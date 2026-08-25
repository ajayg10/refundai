"""
Audit log service — writes to the audit_logs table.
"""
from typing import Any, Dict, Optional
from sqlalchemy.orm import Session

from app.db.models import AuditLog


def log(
    db: Session,
    action: str,
    refund_request_id: Optional[str] = None,
    actor: str = "agent",
    details: Optional[Dict[str, Any]] = None,
) -> AuditLog:
    """Write an audit log entry. Commits immediately."""
    entry = AuditLog(
        refund_request_id=refund_request_id,
        action=action,
        actor=actor,
        details=details or {},
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


# Action constants — use these everywhere for consistency
class Actions:
    AGENT_INVESTIGATION_STARTED = "AGENT_INVESTIGATION_STARTED"
    CUSTOMER_RETRIEVED = "CUSTOMER_RETRIEVED"
    ORDER_RETRIEVED = "ORDER_RETRIEVED"
    PAYMENT_VERIFIED = "PAYMENT_VERIFIED"
    REFUND_HISTORY_CHECKED = "REFUND_HISTORY_CHECKED"
    POLICY_RETRIEVED = "POLICY_RETRIEVED"
    REFUND_CALCULATED = "REFUND_CALCULATED"
    SANDBOX_EXECUTION_STARTED = "SANDBOX_EXECUTION_STARTED"
    SANDBOX_EXECUTION_COMPLETED = "SANDBOX_EXECUTION_COMPLETED"
    AWAITING_HUMAN_APPROVAL = "AWAITING_HUMAN_APPROVAL"
    REFUND_APPROVED = "REFUND_APPROVED"
    REFUND_REJECTED = "REFUND_REJECTED"
    REFUND_PROCESSED = "REFUND_PROCESSED"
    REFUND_FAILED = "REFUND_FAILED"
    AUDIT_COMPLETED = "AUDIT_COMPLETED"
