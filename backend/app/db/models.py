"""
SQLAlchemy ORM models for RefundGuard.

Tables:
  - customers
  - orders
  - payments
  - refund_requests
  - refunds
  - audit_logs
"""
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import (
    Column, String, Numeric, Date, DateTime, Text,
    ForeignKey, Integer, JSON
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(String(20), primary_key=True)          # e.g. CUST-1001
    name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False, unique=True)
    created_at = Column(DateTime, default=func.now())

    orders = relationship("Order", back_populates="customer")


class Order(Base):
    __tablename__ = "orders"

    id = Column(String(20), primary_key=True)           # e.g. ORD-1042
    customer_id = Column(String(20), ForeignKey("customers.id"), nullable=False)
    product_name = Column(String(200), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), nullable=False, default="USD")
    order_date = Column(Date, nullable=False)
    status = Column(String(20), nullable=False, default="DELIVERED")
    created_at = Column(DateTime, default=func.now())

    customer = relationship("Customer", back_populates="orders")
    payment = relationship("Payment", back_populates="order", uselist=False)
    refund_requests = relationship("RefundRequest", back_populates="order")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String(20), primary_key=True)           # e.g. PAY-5001
    order_id = Column(String(20), ForeignKey("orders.id"), nullable=False, unique=True)
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), nullable=False, default="USD")
    status = Column(String(20), nullable=False)         # COMPLETED / FAILED / PENDING
    payment_method = Column(String(20), nullable=False, default="CARD")
    payment_date = Column(Date, nullable=False)

    order = relationship("Order", back_populates="payment")


class RefundRequest(Base):
    __tablename__ = "refund_requests"

    id = Column(String(20), primary_key=True)           # e.g. RR-001
    order_id = Column(String(20), ForeignKey("orders.id"), nullable=False)
    reason = Column(Text, nullable=False)
    requested_amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String(30), nullable=False, default="PENDING")
    # PENDING | INVESTIGATING | AWAITING_APPROVAL | APPROVED | REJECTED | COMPLETED | FAILED
    risk_level = Column(String(10), nullable=True)      # LOW | MEDIUM | HIGH
    recommended_amount = Column(Numeric(10, 2), nullable=True)
    agent_summary = Column(Text, nullable=True)
    trueforge_session_id = Column(String(100), nullable=True)
    trueforge_turn_id = Column(String(100), nullable=True)
    # Stores pending approval refs from TrueForge (JSON)
    pending_approval_refs = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    order = relationship("Order", back_populates="refund_requests")
    refunds = relationship("Refund", back_populates="refund_request")
    audit_logs = relationship("AuditLog", back_populates="refund_request")


class Refund(Base):
    __tablename__ = "refunds"

    id = Column(String(20), primary_key=True)           # e.g. REF-001
    refund_request_id = Column(String(20), ForeignKey("refund_requests.id"), nullable=False)
    order_id = Column(String(20), ForeignKey("orders.id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), nullable=False, default="USD")
    status = Column(String(20), nullable=False)         # COMPLETED | FAILED
    processed_at = Column(DateTime, nullable=True)

    refund_request = relationship("RefundRequest", back_populates="refunds")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    refund_request_id = Column(String(20), ForeignKey("refund_requests.id"), nullable=True)
    action = Column(String(60), nullable=False)
    actor = Column(String(50), nullable=False, default="agent")
    details = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=func.now())

    refund_request = relationship("RefundRequest", back_populates="audit_logs")
