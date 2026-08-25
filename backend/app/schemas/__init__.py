"""
Pydantic schemas for RefundGuard API.
"""
from datetime import datetime, date
from decimal import Decimal
from typing import Optional, List, Any, Dict
from pydantic import BaseModel, EmailStr


# ── Customer ─────────────────────────────────────────────────────────────

class CustomerOut(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Order ────────────────────────────────────────────────────────────────

class OrderOut(BaseModel):
    id: str
    customer_id: str
    product_name: str
    amount: Decimal
    currency: str
    order_date: date
    status: str
    created_at: datetime
    customer: Optional[CustomerOut] = None

    model_config = {"from_attributes": True}


# ── Payment ──────────────────────────────────────────────────────────────

class PaymentOut(BaseModel):
    id: str
    order_id: str
    amount: Decimal
    currency: str
    status: str
    payment_method: str
    payment_date: date

    model_config = {"from_attributes": True}


# ── Refund ───────────────────────────────────────────────────────────────

class RefundOut(BaseModel):
    id: str
    refund_request_id: str
    order_id: str
    amount: Decimal
    currency: str
    status: str
    processed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ── Refund Request ───────────────────────────────────────────────────────

class RefundRequestCreate(BaseModel):
    order_id: str
    reason: str
    requested_amount: Decimal


class RefundRequestOut(BaseModel):
    id: str
    order_id: str
    reason: str
    requested_amount: Decimal
    status: str
    risk_level: Optional[str] = None
    recommended_amount: Optional[Decimal] = None
    agent_summary: Optional[str] = None
    trueforge_session_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    order: Optional[OrderOut] = None
    refunds: List[RefundOut] = []

    model_config = {"from_attributes": True}


class ApproveRefundRequest(BaseModel):
    """Body for POST /refund-requests/{id}/approve"""
    approved_amount: Optional[Decimal] = None   # defaults to recommended_amount


class RejectRefundRequest(BaseModel):
    """Body for POST /refund-requests/{id}/reject"""
    reason: Optional[str] = "Rejected by human reviewer"


# ── Audit Log ────────────────────────────────────────────────────────────

class AuditLogOut(BaseModel):
    id: int
    refund_request_id: Optional[str] = None
    action: str
    actor: str
    details: Optional[Dict[str, Any]] = None
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Dashboard Stats ──────────────────────────────────────────────────────

class DashboardStats(BaseModel):
    total_requests: int
    pending_approval: int
    completed_refunds: int
    rejected_requests: int
    total_refunded: Decimal
    investigating: int
