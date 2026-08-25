"""
Refund request API endpoints.

Covers:
  POST   /refund-requests              — create + trigger TrueForge agent
  GET    /refund-requests              — list all
  GET    /refund-requests/{id}         — get one
  GET    /refund-requests/{id}/activity — audit log timeline
  POST   /refund-requests/{id}/approve — human approves → TrueForge allow
  POST   /refund-requests/{id}/reject  — human rejects  → TrueForge deny
  GET    /dashboard                    — stats
"""
import asyncio
import logging
import uuid
from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.db.database import get_db
from app.db import models
from app.schemas import (
    RefundRequestCreate, RefundRequestOut,
    ApproveRefundRequest, RejectRefundRequest,
    AuditLogOut, DashboardStats,
)
from app.services import audit_service, trueforge_service

logger = logging.getLogger(__name__)
router = APIRouter()


# ── ID generator ──────────────────────────────────────────────────────────

def _new_rr_id(db: Session) -> str:
    count = db.query(models.RefundRequest).count()
    return f"RR-{count + 1:04d}"


# ── Background task: run TrueForge agent investigation ───────────────────

async def _run_agent_investigation(refund_request_id: str) -> None:
    """
    Background task: creates TrueForge session and starts investigation turn.
    Updates the DB as the agent progresses.
    """
    from app.db.database import SessionLocal
    db = SessionLocal()
    try:
        rr = db.get(models.RefundRequest, refund_request_id)
        if not rr:
            return

        # Update status → INVESTIGATING
        rr.status = "INVESTIGATING"
        rr.updated_at = datetime.utcnow()
        db.commit()

        audit_service.log(
            db, audit_service.Actions.AGENT_INVESTIGATION_STARTED,
            refund_request_id=refund_request_id,
            actor="system",
        )

        # Create TrueForge session
        session_id = await trueforge_service.create_session()
        rr.trueforge_session_id = session_id
        db.commit()

        # Start investigation turn (non-streaming — agent runs async)
        turn_id = await trueforge_service.start_investigation_turn(
            session_id, refund_request_id
        )
        rr.trueforge_turn_id = turn_id
        db.commit()

        # Poll for turn completion and watch for approval_required
        await _poll_turn_for_approval(db, refund_request_id, session_id, turn_id)

    except Exception as e:
        logger.exception("Agent investigation failed for %s", refund_request_id)
        db_inner = SessionLocal()
        try:
            rr_inner = db_inner.get(models.RefundRequest, refund_request_id)
            if rr_inner:
                rr_inner.status = "FAILED"
                rr_inner.agent_summary = f"Investigation failed: {str(e)}"
                rr_inner.updated_at = datetime.utcnow()
                db_inner.commit()
        finally:
            db_inner.close()
    finally:
        db.close()


async def _poll_turn_for_approval(
    db: Session,
    refund_request_id: str,
    session_id: str,
    turn_id: str,
    max_polls: int = 120,
    poll_interval: float = 3.0,
) -> None:
    """
    Poll a TrueForge turn until it finishes or requires approval.
    Updates the RefundRequest status and stores pending approval refs.
    """
    for _ in range(max_polls):
        await asyncio.sleep(poll_interval)
        try:
            turn = await trueforge_service.get_turn(session_id, turn_id)
            state = turn.get("state", {})
            status = state.get("status")

            if status == "running":
                continue  # still going

            if status == "done":
                required_actions = state.get("requiredActions", [])

                if required_actions:
                    # Agent is paused for approval
                    rr = db.get(models.RefundRequest, refund_request_id)
                    if rr:
                        rr.status = "AWAITING_APPROVAL"
                        rr.updated_at = datetime.utcnow()
                        rr.pending_approval_refs = required_actions
                        db.commit()

                    audit_service.log(
                        db, audit_service.Actions.AWAITING_HUMAN_APPROVAL,
                        refund_request_id=refund_request_id,
                        actor="agent",
                        details={"required_actions": required_actions},
                    )

                    # Extract agent summary from turn output if available
                    output = state.get("output")
                    if output and output.get("content"):
                        rr = db.get(models.RefundRequest, refund_request_id)
                        if rr:
                            rr.agent_summary = output["content"]
                            db.commit()

                else:
                    # Agent completed without requesting approval (rejected case)
                    rr = db.get(models.RefundRequest, refund_request_id)
                    output = state.get("output")
                    if rr:
                        output_text = output.get("content", "") if output else ""
                        # Check if it was rejected by policy
                        if any(word in output_text.lower() for word in
                               ["not eligible", "cannot process", "rejected", "expired", "exceed"]):
                            rr.status = "REJECTED"
                        else:
                            rr.status = "COMPLETED"
                        rr.agent_summary = output_text
                        rr.updated_at = datetime.utcnow()
                        db.commit()

                    audit_service.log(
                        db, audit_service.Actions.AUDIT_COMPLETED,
                        refund_request_id=refund_request_id,
                        actor="system",
                    )
                return

            elif status in ("cancelled", "error"):
                logger.warning("Turn %s ended with status=%s", turn_id, status)
                rr = db.get(models.RefundRequest, refund_request_id)
                if rr:
                    rr.status = "FAILED"
                    rr.agent_summary = f"Agent turn {status}: {state.get('message', '')}"
                    rr.updated_at = datetime.utcnow()
                    db.commit()
                return

        except Exception as e:
            logger.warning("Poll error for turn %s: %s", turn_id, e)

    logger.warning("Turn %s polling timed out", turn_id)


# ── ENDPOINTS ─────────────────────────────────────────────────────────────

@router.post("/refund-requests", response_model=RefundRequestOut, status_code=201)
async def create_refund_request(
    body: RefundRequestCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Create a new refund request and immediately start AI investigation."""
    # Validate order exists
    order = db.get(models.Order, body.order_id)
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {body.order_id} not found")

    # Check for existing in-progress requests
    active = db.query(models.RefundRequest).filter(
        models.RefundRequest.order_id == body.order_id,
        models.RefundRequest.status.in_(["PENDING", "INVESTIGATING", "AWAITING_APPROVAL"]),
    ).first()
    if active:
        raise HTTPException(
            status_code=409,
            detail=f"An active refund request ({active.id}) already exists for order {body.order_id}",
        )

    rr_id = _new_rr_id(db)
    rr = models.RefundRequest(
        id=rr_id,
        order_id=body.order_id,
        reason=body.reason,
        requested_amount=body.requested_amount,
        status="PENDING",
    )
    db.add(rr)
    db.commit()
    db.refresh(rr)

    # Start agent investigation in background
    background_tasks.add_task(_run_agent_investigation, rr_id)

    return rr


@router.get("/refund-requests", response_model=List[RefundRequestOut])
def list_refund_requests(db: Session = Depends(get_db)):
    return (
        db.query(models.RefundRequest)
        .options(joinedload(models.RefundRequest.order).joinedload(models.Order.customer))
        .order_by(models.RefundRequest.created_at.desc())
        .all()
    )


@router.get("/refund-requests/{refund_request_id}", response_model=RefundRequestOut)
def get_refund_request(refund_request_id: str, db: Session = Depends(get_db)):
    rr = (
        db.query(models.RefundRequest)
        .options(
            joinedload(models.RefundRequest.order).joinedload(models.Order.customer),
            joinedload(models.RefundRequest.refunds),
        )
        .filter(models.RefundRequest.id == refund_request_id)
        .first()
    )
    if not rr:
        raise HTTPException(status_code=404, detail=f"Refund request {refund_request_id} not found")
    return rr


@router.get("/refund-requests/{refund_request_id}/activity", response_model=List[AuditLogOut])
def get_activity(refund_request_id: str, db: Session = Depends(get_db)):
    """Return audit log for a refund request (activity timeline)."""
    return (
        db.query(models.AuditLog)
        .filter(models.AuditLog.refund_request_id == refund_request_id)
        .order_by(models.AuditLog.created_at.asc())
        .all()
    )


@router.post("/refund-requests/{refund_request_id}/approve")
async def approve_refund_request(
    refund_request_id: str,
    body: ApproveRefundRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """
    Human approval endpoint.

    Safety:
    - Status MUST be AWAITING_APPROVAL (server-side check, not just LLM trust)
    - Submits user.tool_approval { status: allow } to TrueForge
    - process_refund MCP tool performs additional safety checks
    """
    rr = db.get(models.RefundRequest, refund_request_id)
    if not rr:
        raise HTTPException(status_code=404, detail="Refund request not found")

    if rr.status != "AWAITING_APPROVAL":
        raise HTTPException(
            status_code=400,
            detail=f"Cannot approve: refund request status is '{rr.status}', expected 'AWAITING_APPROVAL'",
        )

    if not rr.trueforge_session_id:
        raise HTTPException(status_code=500, detail="No TrueForge session associated with this request")

    # Determine approved amount (default to recommended)
    approved_amount = body.approved_amount or rr.recommended_amount
    if not approved_amount:
        raise HTTPException(status_code=400, detail="No approved_amount provided and no recommended_amount available")

    # Update DB status to APPROVED
    rr.status = "APPROVED"
    rr.updated_at = datetime.utcnow()
    db.commit()

    # Write human approval audit log
    audit_service.log(
        db, audit_service.Actions.REFUND_APPROVED,
        refund_request_id=refund_request_id,
        actor="human",
        details={"approved_amount": str(approved_amount)},
    )

    # Extract pending approval refs from DB
    pending_refs = rr.pending_approval_refs or []
    session_id = rr.trueforge_session_id

    # Submit approval to TrueForge in background
    async def _submit_approval():
        inner_db = SessionLocal()
        try:
            for action in pending_refs:
                for tool_call in action.get("toolCalls", action.get("tool_calls", [])):
                    tc_id = tool_call.get("id")
                    thread_id = action.get("threadId", action.get("thread_id", "main"))
                    if tc_id:
                        new_turn_id = await trueforge_service.submit_approval(
                            session_id=session_id,
                            thread_id=thread_id,
                            tool_call_id=tc_id,
                            allow=True,
                        )
                        # Update turn ID and poll for completion
                        rr_inner = inner_db.get(models.RefundRequest, refund_request_id)
                        if rr_inner:
                            rr_inner.trueforge_turn_id = new_turn_id
                            inner_db.commit()
        except Exception as e:
            logger.exception("Failed to submit TrueForge approval for %s", refund_request_id)
        finally:
            inner_db.close()

    from app.db.database import SessionLocal
    background_tasks.add_task(_submit_approval)

    return {
        "success": True,
        "message": f"Refund request {refund_request_id} approved. Processing...",
        "status": "APPROVED",
    }


@router.post("/refund-requests/{refund_request_id}/reject")
async def reject_refund_request(
    refund_request_id: str,
    body: RejectRefundRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Human rejection endpoint. Submits deny decision to TrueForge."""
    rr = db.get(models.RefundRequest, refund_request_id)
    if not rr:
        raise HTTPException(status_code=404, detail="Refund request not found")

    if rr.status != "AWAITING_APPROVAL":
        raise HTTPException(
            status_code=400,
            detail=f"Cannot reject: refund request status is '{rr.status}'",
        )

    # Update status
    rr.status = "REJECTED"
    rr.updated_at = datetime.utcnow()
    db.commit()

    audit_service.log(
        db, audit_service.Actions.REFUND_REJECTED,
        refund_request_id=refund_request_id,
        actor="human",
        details={"reason": body.reason},
    )

    # Submit denial to TrueForge
    pending_refs = rr.pending_approval_refs or []
    session_id = rr.trueforge_session_id

    async def _submit_denial():
        for action in pending_refs:
            for tool_call in action.get("toolCalls", action.get("tool_calls", [])):
                tc_id = tool_call.get("id")
                thread_id = action.get("threadId", action.get("thread_id", "main"))
                if tc_id:
                    try:
                        await trueforge_service.submit_approval(
                            session_id=session_id,
                            thread_id=thread_id,
                            tool_call_id=tc_id,
                            allow=False,
                            deny_reason=body.reason,
                        )
                    except Exception as e:
                        logger.warning("TrueForge denial error: %s", e)

    background_tasks.add_task(_submit_denial)

    return {
        "success": True,
        "message": f"Refund request {refund_request_id} rejected.",
        "status": "REJECTED",
    }


@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    from sqlalchemy import func

    total = db.query(models.RefundRequest).count()
    pending_approval = db.query(models.RefundRequest).filter(
        models.RefundRequest.status == "AWAITING_APPROVAL"
    ).count()
    completed = db.query(models.RefundRequest).filter(
        models.RefundRequest.status == "COMPLETED"
    ).count()
    rejected = db.query(models.RefundRequest).filter(
        models.RefundRequest.status == "REJECTED"
    ).count()
    investigating = db.query(models.RefundRequest).filter(
        models.RefundRequest.status.in_(["PENDING", "INVESTIGATING"])
    ).count()

    total_refunded_row = db.query(func.sum(models.Refund.amount)).filter(
        models.Refund.status == "COMPLETED"
    ).scalar()
    total_refunded = Decimal(str(total_refunded_row or 0))

    return DashboardStats(
        total_requests=total,
        pending_approval=pending_approval,
        completed_refunds=completed,
        rejected_requests=rejected,
        total_refunded=total_refunded,
        investigating=investigating,
    )
