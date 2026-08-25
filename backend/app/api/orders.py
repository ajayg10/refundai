"""Order API endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.db.database import get_db
from app.db import models
from app.schemas import OrderOut, PaymentOut

router = APIRouter()


@router.get("/orders/{order_id}", response_model=OrderOut)
def get_order(order_id: str, db: Session = Depends(get_db)):
    order = (
        db.query(models.Order)
        .options(joinedload(models.Order.customer))
        .filter(models.Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found")
    return order


@router.get("/orders/{order_id}/payment", response_model=PaymentOut)
def get_payment(order_id: str, db: Session = Depends(get_db)):
    payment = db.query(models.Payment).filter(
        models.Payment.order_id == order_id
    ).first()
    if not payment:
        raise HTTPException(status_code=404, detail=f"No payment found for order {order_id}")
    return payment


@router.get("/orders/{order_id}/refunds")
def get_order_refunds(order_id: str, db: Session = Depends(get_db)):
    refunds = db.query(models.Refund).filter(
        models.Refund.order_id == order_id
    ).all()
    return refunds
