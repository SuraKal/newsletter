from datetime import datetime

from models import db


class SubscriptionPlan(db.Model):
    __tablename__ = "subscription_plans"

    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    monthly_price = db.Column(db.Numeric(10, 2), nullable=False, default=0)
    yearly_price = db.Column(db.Numeric(10, 2), nullable=False, default=0)
    period = db.Column(db.String(20), default="/month")
    description = db.Column(db.Text, default="")
    features = db.Column(db.JSON, default=list)
    highlighted = db.Column(db.Boolean, default=False)
    audience = db.Column(db.String(200), default="")
    delivery_note = db.Column(db.String(200), default="")
    payment_note = db.Column(db.String(200), default="")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "monthlyPrice": float(self.monthly_price or 0),
            "yearlyPrice": float(self.yearly_price or 0),
            "period": self.period,
            "description": self.description,
            "features": self.features or [],
            "highlighted": self.highlighted,
            "audience": self.audience,
            "deliveryNote": self.delivery_note,
            "paymentNote": self.payment_note,
        }

    def __repr__(self):
        return f"<SubscriptionPlan {self.id}: {self.name}>"


class UserSubscription(db.Model):
    __tablename__ = "user_subscriptions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=False, index=True
    )
    plan_id = db.Column(
        db.String(50), db.ForeignKey("subscription_plans.id"), nullable=False
    )
    billing_cycle = db.Column(db.String(20), default="monthly")  # monthly | yearly
    status = db.Column(db.String(30), default="active")  # active | cancelled | past_due | expired
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    renewal_at = db.Column(db.DateTime)

    user = db.relationship("User", back_populates="subscriptions")
    plan = db.relationship("SubscriptionPlan")

    def to_dict(self, include_plan=True):
        data = {
            "id": self.id,
            "billingCycle": self.billing_cycle,
            "status": self.status,
            "startedAt": self.started_at.isoformat() if self.started_at else None,
            "renewalAt": self.renewal_at.isoformat() if self.renewal_at else None,
        }
        if include_plan:
            data["plan"] = self.plan.to_dict() if self.plan else None
        return data

    def __repr__(self):
        return f"<UserSubscription user={self.user_id} plan={self.plan_id} status={self.status}>"