"""
Tests for the deterministic refund policy engine.

These tests verify all 5 demo scenarios without touching the database.
"""
import pytest
from decimal import Decimal
from app.services.policy_service import evaluate_refund


def test_scenario_1_normal_eligible_refund():
    """Scenario 1: Damaged product within 30 days → 100% refund, LOW risk."""
    result = evaluate_refund(
        order_age_days=7,
        reason="Product arrived damaged",
        order_amount=Decimal("149.00"),
        requested_amount=Decimal("149.00"),
        previous_refund_total=Decimal("0.00"),
    )
    assert result.eligible is True
    assert result.refund_percentage == 100
    assert result.recommended_amount == Decimal("149.00")
    assert result.policy_rule_id == "DAMAGED_30"
    assert result.risk_level == "LOW"


def test_scenario_2_expired_refund():
    """Scenario 2: Order > 60 days → not eligible."""
    result = evaluate_refund(
        order_age_days=90,
        reason="Changed my mind",
        order_amount=Decimal("299.00"),
        requested_amount=Decimal("299.00"),
        previous_refund_total=Decimal("0.00"),
    )
    assert result.eligible is False
    assert result.policy_rule_id == "EXPIRED"
    assert result.recommended_amount == Decimal("0.00")


def test_scenario_3_partial_refund():
    """Scenario 3: Damaged product 31–60 days → 50% refund."""
    result = evaluate_refund(
        order_age_days=45,
        reason="Item is damaged",
        order_amount=Decimal("200.00"),
        requested_amount=Decimal("200.00"),
        previous_refund_total=Decimal("0.00"),
    )
    assert result.eligible is True
    assert result.refund_percentage == 50
    assert result.recommended_amount == Decimal("100.00")
    assert result.policy_rule_id == "DAMAGED_60"


def test_scenario_4_already_refunded():
    """Scenario 4: Order already fully refunded → FULLY_REFUNDED."""
    result = evaluate_refund(
        order_age_days=20,
        reason="Need a refund please",
        order_amount=Decimal("100.00"),
        requested_amount=Decimal("100.00"),
        previous_refund_total=Decimal("100.00"),
    )
    assert result.eligible is False
    assert result.policy_rule_id == "FULLY_REFUNDED"


def test_scenario_5_suspicious_amount():
    """Scenario 5: Requested amount > order amount → AMOUNT_FRAUD, HIGH risk."""
    result = evaluate_refund(
        order_age_days=5,
        reason="Wrong item received",
        order_amount=Decimal("79.00"),
        requested_amount=Decimal("500.00"),
        previous_refund_total=Decimal("0.00"),
    )
    assert result.eligible is False
    assert result.policy_rule_id == "AMOUNT_FRAUD"
    assert result.risk_level == "HIGH"
    assert result.risk_score == 100


def test_changed_mind_within_30_days():
    """Changed mind within 30 days → 80% refund."""
    result = evaluate_refund(
        order_age_days=15,
        reason="Changed my mind about this purchase",
        order_amount=Decimal("100.00"),
        requested_amount=Decimal("100.00"),
        previous_refund_total=Decimal("0.00"),
    )
    assert result.eligible is True
    assert result.refund_percentage == 80
    assert result.recommended_amount == Decimal("80.00")
    assert result.policy_rule_id == "MIND_CHANGE_30"


def test_changed_mind_after_30_days():
    """Changed mind after 30 days → expired."""
    result = evaluate_refund(
        order_age_days=35,
        reason="I changed my mind",
        order_amount=Decimal("100.00"),
        requested_amount=Decimal("100.00"),
        previous_refund_total=Decimal("0.00"),
    )
    assert result.eligible is False
    assert "30 days" in result.reject_reason


def test_recommended_capped_at_requested():
    """Recommended amount should not exceed requested amount."""
    result = evaluate_refund(
        order_age_days=5,
        reason="damaged",
        order_amount=Decimal("200.00"),
        requested_amount=Decimal("80.00"),   # Asking less than 100%
        previous_refund_total=Decimal("0.00"),
    )
    assert result.eligible is True
    assert result.recommended_amount <= Decimal("80.00")
