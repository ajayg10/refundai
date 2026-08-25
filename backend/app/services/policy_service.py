"""
Deterministic refund policy engine.

The LLM does NOT invent policy rules.
The agent retrieves policy via get_refund_policy() MCP tool
and then uses calculate_refund() MCP tool which calls this engine.

Policy rules:
  - Damaged product, ≤ 30 days  → 100% refund
  - Changed mind,   ≤ 30 days  → 80%  refund
  - Damaged product, 31–60 days → 50% refund
  - Changed mind,   31–60 days → 0%  refund (expired)
  - Any reason,     > 60 days  → 0%  refund (expired)
  - Already fully refunded      → 0%  refund
  - Requested amount > order amount → HIGH RISK, reject
"""
from dataclasses import dataclass
from decimal import Decimal, ROUND_HALF_UP
from typing import Optional


POLICY_RULES = [
    {
        "id": "DAMAGED_30",
        "description": "Damaged product within 30 days",
        "condition": "damaged AND age <= 30",
        "refund_pct": 100,
    },
    {
        "id": "MIND_CHANGE_30",
        "description": "Customer changed mind within 30 days",
        "condition": "changed_mind AND age <= 30",
        "refund_pct": 80,
    },
    {
        "id": "DAMAGED_60",
        "description": "Damaged product, 31–60 days",
        "condition": "damaged AND 31 <= age <= 60",
        "refund_pct": 50,
    },
    {
        "id": "EXPIRED",
        "description": "Order older than 60 days — no refund",
        "condition": "age > 60",
        "refund_pct": 0,
    },
    {
        "id": "FULLY_REFUNDED",
        "description": "Order already fully refunded",
        "condition": "previous_refund_total >= order_amount",
        "refund_pct": 0,
    },
    {
        "id": "AMOUNT_FRAUD",
        "description": "Requested amount exceeds order amount",
        "condition": "requested > order_amount",
        "refund_pct": 0,
        "risk": "HIGH",
    },
]


@dataclass
class PolicyResult:
    eligible: bool
    refund_percentage: int
    recommended_amount: Decimal
    policy_rule_id: str
    policy_rule_description: str
    risk_level: str           # LOW | MEDIUM | HIGH
    risk_score: int           # 0–100
    reject_reason: Optional[str]
    calculation_steps: list   # for sandbox / audit transparency


def _classify_reason(reason: str) -> str:
    """Classify free-text reason into a policy category."""
    reason_lower = reason.lower()
    if any(w in reason_lower for w in ["damage", "damaged", "broken", "defect", "defective", "faulty"]):
        return "damaged"
    if any(w in reason_lower for w in ["changed mind", "changed my mind", "change of mind", "dont want", "don't want",
                                        "no longer need", "unwanted", "mistake"]):
        return "changed_mind"
    # Default: treat as damaged for partial eligibility
    return "other"


def _assess_risk(
    order_age_days: int,
    requested_amount: Decimal,
    order_amount: Decimal,
    previous_refund_total: Decimal,
    reason_category: str,
) -> tuple[str, int]:
    """Return (risk_level, risk_score 0–100)."""
    score = 0

    # Amount anomaly
    if requested_amount > order_amount:
        score += 50   # definite fraud signal
    elif requested_amount > order_amount * Decimal("0.9"):
        score += 10   # full refund claim — slightly elevated

    # Refund history
    if previous_refund_total > 0:
        score += 20
    if previous_refund_total >= order_amount:
        score += 30   # already paid back

    # Age
    if order_age_days > 45:
        score += 15
    elif order_age_days > 30:
        score += 8

    # Reason
    if reason_category == "changed_mind" and order_age_days > 20:
        score += 5

    score = min(score, 100)

    if score >= 50:
        return "HIGH", score
    elif score >= 20:
        return "MEDIUM", score
    else:
        return "LOW", score


def evaluate_refund(
    order_age_days: int,
    reason: str,
    order_amount: Decimal,
    requested_amount: Decimal,
    previous_refund_total: Decimal,
) -> PolicyResult:
    """
    Core policy evaluation function.

    Returns a PolicyResult with all fields needed for the agent's
    recommendation and the sandbox calculation.
    """
    steps = [
        f"Order age: {order_age_days} days",
        f"Order amount: ${order_amount}",
        f"Requested amount: ${requested_amount}",
        f"Previous refund total: ${previous_refund_total}",
        f"Reason: {reason}",
    ]

    reason_category = _classify_reason(reason)
    steps.append(f"Reason category: {reason_category}")

    risk_level, risk_score = _assess_risk(
        order_age_days, requested_amount, order_amount,
        previous_refund_total, reason_category
    )
    steps.append(f"Risk assessment: {risk_level} (score={risk_score}/100)")

    # ── Guard: amount fraud ────────────────────────────────────────────────
    if requested_amount > order_amount:
        steps.append("RULE TRIGGERED: AMOUNT_FRAUD — requested > order amount → REJECT")
        return PolicyResult(
            eligible=False,
            refund_percentage=0,
            recommended_amount=Decimal("0.00"),
            policy_rule_id="AMOUNT_FRAUD",
            policy_rule_description="Requested amount exceeds order amount — HIGH RISK",
            risk_level="HIGH",
            risk_score=100,
            reject_reason="Requested amount exceeds order amount. Possible fraud.",
            calculation_steps=steps,
        )

    # ── Guard: already fully refunded ─────────────────────────────────────
    if previous_refund_total >= order_amount:
        steps.append("RULE TRIGGERED: FULLY_REFUNDED — previous refunds cover full order → REJECT")
        return PolicyResult(
            eligible=False,
            refund_percentage=0,
            recommended_amount=Decimal("0.00"),
            policy_rule_id="FULLY_REFUNDED",
            policy_rule_description="Order already fully refunded",
            risk_level=risk_level,
            risk_score=risk_score,
            reject_reason="This order has already been fully refunded.",
            calculation_steps=steps,
        )

    # ── Age + reason matrix ───────────────────────────────────────────────
    if order_age_days > 60:
        steps.append("RULE TRIGGERED: EXPIRED — order > 60 days → REJECT")
        return PolicyResult(
            eligible=False,
            refund_percentage=0,
            recommended_amount=Decimal("0.00"),
            policy_rule_id="EXPIRED",
            policy_rule_description="Order older than 60 days — no refund",
            risk_level=risk_level,
            risk_score=risk_score,
            reject_reason=f"Order is {order_age_days} days old. Refund window (60 days) has expired.",
            calculation_steps=steps,
        )

    if reason_category == "damaged":
        if order_age_days <= 30:
            pct = 100
            rule_id, rule_desc = "DAMAGED_30", "Damaged product within 30 days → 100% refund"
        else:
            pct = 50
            rule_id, rule_desc = "DAMAGED_60", "Damaged product, 31–60 days → 50% refund"

    elif reason_category == "changed_mind":
        if order_age_days <= 30:
            pct = 80
            rule_id, rule_desc = "MIND_CHANGE_30", "Customer changed mind within 30 days → 80% refund"
        else:
            steps.append("RULE TRIGGERED: EXPIRED — changed mind after 30 days → REJECT")
            return PolicyResult(
                eligible=False,
                refund_percentage=0,
                recommended_amount=Decimal("0.00"),
                policy_rule_id="EXPIRED",
                policy_rule_description="Change of mind refund window is 30 days",
                risk_level=risk_level,
                risk_score=risk_score,
                reject_reason=f"Change of mind refunds are only allowed within 30 days. Order is {order_age_days} days old.",
                calculation_steps=steps,
            )

    else:  # other / unrecognized reason
        if order_age_days <= 30:
            pct = 50
            rule_id, rule_desc = "DAMAGED_60", "Unspecified reason within 30 days → 50% refund"
        else:
            steps.append("RULE TRIGGERED: EXPIRED — unspecified reason, too old → REJECT")
            return PolicyResult(
                eligible=False,
                refund_percentage=0,
                recommended_amount=Decimal("0.00"),
                policy_rule_id="EXPIRED",
                policy_rule_description="Refund window exceeded",
                risk_level=risk_level,
                risk_score=risk_score,
                reject_reason=f"Refund not eligible. Order is {order_age_days} days old.",
                calculation_steps=steps,
            )

    # ── Calculate recommended amount ──────────────────────────────────────
    recommended = (order_amount * pct / 100).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    # Cap at requested amount (never refund more than asked)
    recommended = min(recommended, requested_amount)

    steps.append(f"RULE APPLIED: {rule_id} — {pct}% refund")
    steps.append(f"Calculation: ${order_amount} × {pct}% = ${recommended}")
    if recommended != (order_amount * pct / 100).quantize(Decimal("0.01")):
        steps.append(f"Capped at requested amount: ${requested_amount}")

    return PolicyResult(
        eligible=True,
        refund_percentage=pct,
        recommended_amount=recommended,
        policy_rule_id=rule_id,
        policy_rule_description=rule_desc,
        risk_level=risk_level,
        risk_score=risk_score,
        reject_reason=None,
        calculation_steps=steps,
    )


def get_policy_document() -> dict:
    """Return the human-readable policy document the agent retrieves."""
    return {
        "title": "RefundGuard Refund Policy",
        "version": "1.0",
        "effective_date": "2026-01-01",
        "rules": POLICY_RULES,
        "summary": (
            "Damaged products may be refunded 100% within 30 days, or 50% within 60 days. "
            "Change-of-mind refunds are 80% within 30 days. "
            "No refunds after 60 days. "
            "Requests exceeding the order amount are automatically flagged as HIGH RISK. "
            "Already-refunded orders cannot be refunded again."
        ),
    }
