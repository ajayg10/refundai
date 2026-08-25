"""
Deterministic seed data for RefundGuard demo.

Creates all 5 hackathon demo scenarios with fixed IDs.
Running this multiple times is safe — it uses upsert logic.
"""
from datetime import date, timedelta
from decimal import Decimal

from sqlalchemy.orm import Session

from app.db.database import SessionLocal, engine
from app.db import models


def seed(db: Session) -> None:
    """Insert all demo data. Idempotent — skips existing records."""

    # ── Customers ──────────────────────────────────────────────────────────
    customers = [
        models.Customer(id="CUST-1001", name="Alice Johnson", email="alice@example.com"),
        models.Customer(id="CUST-1002", name="Bob Smith", email="bob@example.com"),
        models.Customer(id="CUST-1003", name="Carol White", email="carol@example.com"),
        models.Customer(id="CUST-1004", name="David Brown", email="david@example.com"),
        models.Customer(id="CUST-1005", name="Eve Davis", email="eve@example.com"),
    ]
    for c in customers:
        if not db.get(models.Customer, c.id):
            db.add(c)

    today = date.today()

    # ── Orders ─────────────────────────────────────────────────────────────
    orders = [
        # Scenario 1 — Normal eligible refund (7 days, damaged)
        models.Order(
            id="ORD-1042",
            customer_id="CUST-1001",
            product_name="Wireless Headphones",
            amount=Decimal("149.00"),
            currency="USD",
            order_date=today - timedelta(days=7),
            status="DELIVERED",
        ),
        # Scenario 2 — Expired refund (90 days, changed mind)
        models.Order(
            id="ORD-1043",
            customer_id="CUST-1002",
            product_name="Bluetooth Speaker",
            amount=Decimal("299.00"),
            currency="USD",
            order_date=today - timedelta(days=90),
            status="DELIVERED",
        ),
        # Scenario 3 — Partial refund (45 days, damaged)
        models.Order(
            id="ORD-1044",
            customer_id="CUST-1003",
            product_name="Mechanical Keyboard",
            amount=Decimal("200.00"),
            currency="USD",
            order_date=today - timedelta(days=45),
            status="DELIVERED",
        ),
        # Scenario 4 — Already refunded
        models.Order(
            id="ORD-1045",
            customer_id="CUST-1004",
            product_name="USB-C Hub",
            amount=Decimal("100.00"),
            currency="USD",
            order_date=today - timedelta(days=20),
            status="DELIVERED",
        ),
        # Scenario 5 — Suspicious request (amount > order amount)
        models.Order(
            id="ORD-1046",
            customer_id="CUST-1005",
            product_name="Webcam HD",
            amount=Decimal("79.00"),
            currency="USD",
            order_date=today - timedelta(days=5),
            status="DELIVERED",
        ),
    ]
    for o in orders:
        if not db.get(models.Order, o.id):
            db.add(o)

    # ── Payments ───────────────────────────────────────────────────────────
    payments = [
        models.Payment(
            id="PAY-5001", order_id="ORD-1042", amount=Decimal("149.00"),
            currency="USD", status="COMPLETED", payment_method="CARD",
            payment_date=today - timedelta(days=7),
        ),
        models.Payment(
            id="PAY-5002", order_id="ORD-1043", amount=Decimal("299.00"),
            currency="USD", status="COMPLETED", payment_method="CARD",
            payment_date=today - timedelta(days=90),
        ),
        models.Payment(
            id="PAY-5003", order_id="ORD-1044", amount=Decimal("200.00"),
            currency="USD", status="COMPLETED", payment_method="BANK",
            payment_date=today - timedelta(days=45),
        ),
        models.Payment(
            id="PAY-5004", order_id="ORD-1045", amount=Decimal("100.00"),
            currency="USD", status="COMPLETED", payment_method="CARD",
            payment_date=today - timedelta(days=20),
        ),
        models.Payment(
            id="PAY-5005", order_id="ORD-1046", amount=Decimal("79.00"),
            currency="USD", status="COMPLETED", payment_method="CARD",
            payment_date=today - timedelta(days=5),
        ),
    ]
    for p in payments:
        if not db.get(models.Payment, p.id):
            db.add(p)

    # ── Scenario 4: Previous full refund ───────────────────────────────────
    # Create a completed refund_request and refund so ORD-1045 is "already refunded"
    existing_rr = db.get(models.RefundRequest, "RR-SEED-001")
    if not existing_rr:
        seed_rr = models.RefundRequest(
            id="RR-SEED-001",
            order_id="ORD-1045",
            reason="Item arrived broken",
            requested_amount=Decimal("100.00"),
            status="COMPLETED",
            risk_level="LOW",
            recommended_amount=Decimal("100.00"),
            agent_summary="Full refund granted for damaged item within policy window.",
        )
        db.add(seed_rr)
        seed_refund = models.Refund(
            id="REF-SEED-001",
            refund_request_id="RR-SEED-001",
            order_id="ORD-1045",
            amount=Decimal("100.00"),
            currency="USD",
            status="COMPLETED",
        )
        db.add(seed_refund)

    db.commit()
    print("[OK] Seed data inserted successfully.")


def main():
    """Create all tables then seed."""
    from app.db import models as m  # noqa: F401 — ensures models are registered
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()
