import uuid
from datetime import datetime

from models import db

UUID_LEN = 36

# A recurring business order plan groups recurring copy volume for a set of
# delivery sites. It moves through a lightweight review once the receiving set
# is confirmed.
ORDER_PLAN_WORKFLOW_STATES = (
    "Active",
    "Adjusted",
    "Review",
    "Queued",
)

TONE_FOR_ORDER_PLAN_STATUS = {
    "Active": "success",
    "Adjusted": "info",
    "Review": "warning",
    "Queued": "neutral",
}


class BusinessOrder(db.Model):
    __tablename__ = "business_orders"

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

    order = db.Column(db.String(160), nullable=False)
    copies = db.Column(db.String(40), default="")
    cadence = db.Column(db.String(80), default="")
    sites = db.Column(db.String(40), default="")
    status = db.Column(db.String(50), default="Queued")
    next_window = db.Column(db.String(120), default="")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships -----------------------------------------------------------
    company_account = db.relationship("CompanyAccount")

    # Computed helpers --------------------------------------------------------

    @property
    def tone(self):
        return TONE_FOR_ORDER_PLAN_STATUS.get(self.status, "neutral")

    # Serialisation -----------------------------------------------------------

    def to_dict(self):
        return {
            "id": self.id,
            "companyAccountId": self.company_account_id,
            "order": self.order,
            "copies": self.copies,
            "cadence": self.cadence,
            "sites": self.sites,
            "status": self.status,
            "tone": self.tone,
            "nextWindow": self.next_window,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self):
        return f"<BusinessOrder {self.order!r} ({self.status})>"