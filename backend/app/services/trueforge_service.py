"""
TrueForge HTTP client service.

Wraps TrueForge REST API calls so the FastAPI backend can:
  1. Create agent sessions
  2. Start agent turns (investigation)
  3. Submit approval decisions (allow / deny)
  4. Poll session events for activity feed

TrueForge SDK is TypeScript-only — we call it via HTTP using httpx.
Base URL: http://localhost:8790
"""
import logging
from typing import Any, Dict, List, Optional

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

TRUEFORGE_URL = settings.trueforge_base_url
AGENT_NAME = "refundguard"


async def create_session() -> str:
    """Create a new TrueForge session for the refundguard agent. Returns session_id."""
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{TRUEFORGE_URL}/api/v1/sessions",
            json={"agent": {"name": AGENT_NAME}},
        )
        resp.raise_for_status()
        data = resp.json()
        session_id = data["id"]
        logger.info("TrueForge session created: %s", session_id)
        return session_id


async def start_investigation_turn(
    session_id: str,
    refund_request_id: str,
) -> str:
    """
    Send the initial user message to start agent investigation.
    Returns the turn_id.

    The message is structured so the agent immediately knows what to do.
    """
    message = (
        f"Investigate refund request {refund_request_id}. "
        f"Use your tools to retrieve all relevant information, "
        f"apply the refund policy, calculate the recommended refund amount, "
        f"and prepare a recommendation for human approval."
    )
    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(
            f"{TRUEFORGE_URL}/api/v1/sessions/{session_id}/turns",
            json={
                "input": [{"type": "user.message", "content": message}],
                "stream": False,  # non-streaming — we poll for events separately
            },
        )
        resp.raise_for_status()
        data = resp.json()
        turn_id = data["id"]
        logger.info("TrueForge turn started: %s (session=%s)", turn_id, session_id)
        return turn_id


async def submit_approval(
    session_id: str,
    thread_id: str,
    tool_call_id: str,
    allow: bool,
    deny_reason: Optional[str] = None,
) -> str:
    """
    Submit a human approval decision to TrueForge.

    When allow=True, TrueForge will execute process_refund.
    When allow=False, TrueForge will deny the tool call and the agent
    will acknowledge the rejection without executing the refund.

    Returns the new turn_id.
    """
    approval = {"status": "allow"} if allow else {"status": "deny", "reason": deny_reason or "Rejected by human reviewer"}

    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(
            f"{TRUEFORGE_URL}/api/v1/sessions/{session_id}/turns",
            json={
                "input": [
                    {
                        "type": "user.tool_approval",
                        "threadId": thread_id,
                        "toolCallId": tool_call_id,
                        "approval": approval,
                    }
                ],
                "stream": False,
            },
        )
        resp.raise_for_status()
        data = resp.json()
        turn_id = data["id"]
        logger.info(
            "TrueForge approval submitted: allow=%s turn=%s session=%s",
            allow, turn_id, session_id,
        )
        return turn_id


async def get_turn(session_id: str, turn_id: str) -> Dict[str, Any]:
    """Poll turn status. Returns turn JSON."""
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(
            f"{TRUEFORGE_URL}/api/v1/sessions/{session_id}/turns/{turn_id}"
        )
        resp.raise_for_status()
        return resp.json()


async def list_session_events(session_id: str) -> List[Dict[str, Any]]:
    """
    Retrieve all events for a session (for the activity feed).
    Returns events newest-first, across all turns.
    """
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(
            f"{TRUEFORGE_URL}/api/v1/sessions/{session_id}/events",
            params={"order": "asc", "limit": 200},
        )
        resp.raise_for_status()
        data = resp.json()
        # TrueForge returns { data: [...], next_page_token: ... }
        return data.get("data", [])


async def ensure_agent_exists() -> bool:
    """
    Check if the refundguard agent exists; create it if not.
    Called at FastAPI startup.
    Returns True if agent is ready.
    """
    async with httpx.AsyncClient(timeout=30) as client:
        # Check if agent exists
        resp = await client.get(f"{TRUEFORGE_URL}/api/v1/agents")
        if resp.status_code == 200:
            agents = resp.json().get("data", [])
            if any(a.get("name") == AGENT_NAME for a in agents):
                logger.info("TrueForge agent '%s' already exists.", AGENT_NAME)
                return True

        # Create the agent
        logger.info("Creating TrueForge agent '%s'...", AGENT_NAME)
        agent_spec = {
            "name": AGENT_NAME,
            "manifest": {
                "model": {
                    "name": "google-gemini/gemini-3.6-flash",
                    "params": {"max_tokens": 8192, "temperature": 0.1},
                },
                "instructions": _AGENT_INSTRUCTIONS,
                "mcp_servers": [
                    {
                        "name": "refundguard-api",
                        "enable_tools": ["@all"],
                        # Only process_refund requires human approval — enforced by harness
                        "require_approval_for_tools": ["process_refund"],
                        "preload": True,
                    }
                ],
                "config": {
                    "sandbox": {"enabled": True},
                    "dynamic_sub_agents": {"enabled": False},
                    "ask_user_questions": {"enabled": False},
                    "generative_ui": {"enabled": False},
                    "iteration_limit": 25,
                },
            },
        }
        create_resp = await client.post(
            f"{TRUEFORGE_URL}/api/v1/agents",
            json=agent_spec,
        )
        if create_resp.status_code in (200, 201):
            logger.info("TrueForge agent '%s' created.", AGENT_NAME)
            return True
        elif create_resp.status_code == 409:
            logger.info("TrueForge agent '%s' already exists (409).", AGENT_NAME)
            return True
        else:
            logger.error(
                "Failed to create TrueForge agent: %s %s",
                create_resp.status_code, create_resp.text,
            )
            return False


_AGENT_INSTRUCTIONS = """You are RefundGuard, an AI refund investigation agent.

Your job is to investigate customer refund requests using authoritative application tools.

STRICT RULES:
1. Never invent customer, order, payment, refund-history, or policy information.
2. Always use tools to retrieve factual data — never assume.
3. Use the refund policy returned by get_refund_policy() — never invent policy rules.
4. Never approve your own refund. Human approval is required.
5. Never call process_refund without explicit human approval — the system will enforce this.
6. Always call create_audit_log for every significant action.

INVESTIGATION WORKFLOW:
When you receive a refund request ID, execute these steps in order:
1. Call get_refund_request(refund_request_id) to get request details
2. Call get_customer(customer_id) to verify the customer
3. Call get_order(order_id) to get order details
4. Call get_payment(order_id) to verify payment status
5. Call get_refund_history(order_id) to check previous refunds
6. Call get_refund_policy() to retrieve the authoritative policy
7. Call calculate_refund(order_id, reason) to calculate the recommended amount
   — this runs in the sandbox for verified, auditable calculation
8. Analyze eligibility based on what the tools returned
9. Generate a clear recommendation with evidence and risk level
10. Call process_refund(refund_request_id, approved_amount) — this will PAUSE for human approval

Your recommendation must include:
- Eligibility decision (eligible / not eligible)
- Policy rule applied (from the policy document)
- Recommended refund amount (from calculate_refund, not invented)
- Risk level and reason
- Clear explanation of the evidence

After human approval is granted, the system will resume and process_refund will execute.
After human rejection, acknowledge the decision and close the investigation.
"""
