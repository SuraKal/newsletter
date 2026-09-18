import uuid
from datetime import datetime

from models import db

UUID_LEN = 36

# A bulk order request progresses through one commercial approval. The company
# requests copy volume, the system estimates a price from the copy count, and
# an administrator approves the request with a confirmed final price.
ORDER_WORKFLOW_STATES = (
    "Pending approval",
    "Approved",
    "Declined",
)

TONE_FOR_ORDER_STATUS = {
    "Pending approval": "warning",
    "Approved": "success",
    "Declined": "neutral",
}


def estimate_order_price(copies):
    """Estimate a bulk price from the requested copy count.

    Volume discounts are internal pricing rules — they are not exposed as
    user-facing packages. Returns (estimated_total, per_copy_rate).
    """
    if copies <= 100:
        rate = 1.20
    elif copies <= 500:
        rate = 1.05
    else:
        rate = 0.90
    return round(float(copies) * rate, 2), round(rate, 2)


class CompanyOrder(db.Model):
    __tablename__ = "company_orders"

    id = db.Column(
        db.String(UUID_LEN),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    company_account_id = db.Column(
        db.String(UUID_LEN),
        db.ForeignKey("company_accounts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    requested_by_user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    copies = db.Column(db.Integer, nullable=False)
    needed_by = db.Column(db.String(20), default="")
    delivery_locations = db.Column(db.JSON, default=list)

    # The article/edition a bulk order is printed for. The title is denormalised
    # so the request remains readable even if the source article is removed.
    article_id = db.Column(
        db.String(UUID_LEN),
        db.ForeignKey("articles.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    article_title = db.Column(db.String(255), default="")

    estimated_price = db.Column(db.Numeric(12, 2))
    rate = db.Column(db.Numeric(6, 2))
    status = db.Column(db.String(50), default="Pending approval")
    final_price = db.Column(db.Numeric(12, 2))

    reviewed_by_user_id = db.Column(db.Integer, nullable=True)
    reviewed_at = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships -----------------------------------------------------------
    company_account = db.relationship("CompanyAccount", backref="orders")

    # Computed helpers --------------------------------------------------------

    @property
    def tone(self):
        return TONE_FOR_ORDER_STATUS.get(self.status, "neutral")

    # Serialisation -----------------------------------------------------------

    def to_dict(self):
        return {
            "id": self.id,
            "companyAccountId": self.company_account_id,
            "company": self.company_account.company if self.company_account else None,
            "copies": self.copies,
            "neededBy": self.needed_by or "",
            "deliveryLocations": self.delivery_locations or [],
            "articleId": self.article_id,
            "articleTitle": self.article_title or "",
            "estimatedPrice": (
                float(self.estimated_price)
                if self.estimated_price is not None
                else None
            ),
            "rate": float(self.rate) if self.rate is not None else None,
            "status": self.status,
            "tone": self.tone,
            "finalPrice": (
                float(self.final_price) if self.final_price is not None else None
            ),
            "requestedBy": self.requested_by_user_id,
            "reviewedBy": self.reviewed_by_user_id,
            "reviewedAt": self.reviewed_at.isoformat() if self.reviewed_at else None,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self):
        return f"<CompanyOrder {self.company_account_id} ({self.status})>"