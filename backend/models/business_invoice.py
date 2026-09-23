import uuid
from datetime import datetime

from models import db

UUID_LEN = 36

# A consolidated business invoice record. Invoice generation is out of scope for
# the mock-backed flow; the record tracks the billing state and a single VAT
# review follow-up.
INVOICE_WORKFLOW_STATES = (
    "Paid",
    "Review",
    "Upcoming",
    "Reviewed",
)

TONE_FOR_INVOICE_STATUS = {
    "Paid": "success",
    "Review": "warning",
    "Upcoming": "neutral",
    "Reviewed": "info",
}


class BusinessInvoice(db.Model):
    __tablename__ = "business_invoices"

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

    invoice = db.Column(db.String(80), nullable=False)
    scope = db.Column(db.String(160), default="")
    amount = db.Column(db.String(40), default="")
    status = db.Column(db.String(50), default="Upcoming")
    date = db.Column(db.String(80), default="")

    # Linking fields: "bulk_order" or "subscription" with the source row id so
    # the invoice is a projection of real billing, not a static demo record.
    source_type = db.Column(db.String(30), default="", index=True)
    source_id = db.Column(db.String(36), default="", index=True)
    # Numeric amount + currency backing the display `amount` string.
    amount_value = db.Column(db.Numeric(12, 2), nullable=True)
    currency = db.Column(db.String(8), default="EUR")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships -----------------------------------------------------------
    company_account = db.relationship("CompanyAccount")

    # Computed helpers --------------------------------------------------------

    @property
    def tone(self):
        return TONE_FOR_INVOICE_STATUS.get(self.status, "neutral")

    # Serialisation -----------------------------------------------------------

    def to_dict(self):
        return {
            "id": self.id,
            "companyAccountId": self.company_account_id,
            "invoice": self.invoice,
            "scope": self.scope,
            "amount": self.amount,
            "sourceType": self.source_type or "",
            "sourceId": self.source_id or "",
            "amountValue": (
                float(self.amount_value) if self.amount_value is not None else None
            ),
            "currency": self.currency or "EUR",
            "status": self.status,
            "tone": self.tone,
            "date": self.date,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self):
        return f"<BusinessInvoice {self.invoice!r} ({self.status})>"