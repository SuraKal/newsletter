import uuid
from datetime import datetime

from models import db


class CheckoutSession(db.Model):
    """A reader subscription checkout, shaped like a Stripe Checkout Session.

    The row records the plan/quote snapshot at creation time, the delivery and
    consent details, and the payment intent reference. Card numbers are never
    stored; only the masked brand + last 4 once a payment is confirmed.
    """

    __tablename__ = "checkout_sessions"

    SESSION_STATUSES = ("open", "succeeded", "cancelled", "expired")

    id = db.Column(
        db.String(40),
        primary_key=True,
        default=lambda: f"cs_{uuid.uuid4().hex[:16]}",
    )
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    plan_id = db.Column(
        db.String(50),
        db.ForeignKey("subscription_plans.id"),
        nullable=True,
        index=True,
    )
    billing_cycle = db.Column(db.String(20), default="monthly")
    amount = db.Column(db.Numeric(10, 2), nullable=True)
    currency = db.Column(db.String(8), default="EUR")
    status = db.Column(db.String(30), default="open")
    payment_status = db.Column(db.String(30), default="requires_confirmation")
    payment_method = db.Column(db.String(30), default="card")  # card | paypal

    customer_name = db.Column(db.String(120), default="")
    customer_email = db.Column(db.String(200), default="")
    delivery = db.Column(db.JSON, default=dict)
    consents = db.Column(db.JSON, default=dict)

    quote_mode = db.Column(db.String(80), default="")
    quote_window = db.Column(db.String(160), default="")
    quote_next_charge = db.Column(db.String(80), default="")

    intent_id = db.Column(db.String(80), default="")
    client_secret = db.Column(db.String(255), default="")
    card_brand = db.Column(db.String(30), default="")
    last4 = db.Column(db.String(4), default="")
    paypal_email = db.Column(db.String(200), default="")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=True)
    confirmed_at = db.Column(db.DateTime, nullable=True)

    plan = db.relationship("SubscriptionPlan")

    def is_expired(self, reference=None):
        reference = reference or datetime.utcnow()
        return self.expires_at is not None and reference > self.expires_at

    def to_dict(self, date_formatter=None, include_client_secret=False):
        quote = {
            "amount": float(self.amount or 0),
            "billingCycle": self.billing_cycle or "monthly",
            "deliveryMode": self.quote_mode or "",
            "deliveryWindow": self.quote_window or "",
            "nextChargeDate": self.quote_next_charge or "",
        }
        data = {
            "id": self.id,
            "object": "checkout.session",
            "status": self.status,
            "paymentStatus": self.payment_status,
            "amount": float(self.amount or 0),
            "currency": (self.currency or "EUR").upper(),
            "planId": self.plan_id,
            "planName": self.plan.name if self.plan else "Unknown plan",
            "plan": self.plan.to_dict() if self.plan else None,
            "quote": quote,
            "billingCycle": self.billing_cycle or "monthly",
            "customerName": self.customer_name,
            "customerEmail": self.customer_email,
            "delivery": self.delivery or {},
            "paymentMethod": self.payment_method or "card",
            "cardBrand": self.card_brand,
            "last4": self.last4,
            "paypalEmail": self.paypal_email,
            "consents": self.consents or {},
            "createdAt": (
                date_formatter(self.created_at) if (self.created_at and date_formatter) else ""
            ),
            "expiresAt": (
                date_formatter(self.expires_at) if (self.expires_at and date_formatter) else ""
            ),
            "confirmedAt": (
                date_formatter(self.confirmed_at) if (self.confirmed_at and date_formatter) else ""
            ),
        }
        if include_client_secret:
            data["clientSecret"] = self.client_secret or ""
        return data

    def __repr__(self):
        return f"<CheckoutSession {self.id} ({self.status})>"
