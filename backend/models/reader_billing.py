import uuid
from datetime import datetime

from models import db

# Machine states for a reader billing/payment event. Presentation (label,
# amount rendering, status label, tone) is derived from the machine type and
# state so pages stay data-driven and the seed can pin demo events.
READER_BILLING_TYPES = ("invoice", "renewal", "payment")
READER_BILLING_STATES = ("paid", "upcoming", "verified")

READER_BILLING_ITEMS = {
    "invoice": "Invoice {reference}",
    "renewal": "Renewal reminder",
    "payment": "Payment method check",
}

READER_BILLING_PRESENTATION = {
    ("invoice", "paid"): ("Paid", "success"),
    ("invoice", "upcoming"): ("Upcoming", "warning"),
    ("invoice", "failed"): ("Payment failed", "warning"),
    ("renewal", "upcoming"): ("Upcoming", "warning"),
    ("renewal", "paid"): ("Renewed", "success"),
    ("payment", "verified"): ("Verified", "info"),
    ("payment", "pending"): ("Pending", "neutral"),
}

CURRENCY_SYMBOLS = {"EUR": "€"}


class ReaderBillingEntry(db.Model):
    __tablename__ = "reader_billing"

    id = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    entry_type = db.Column(db.String(30), default="invoice")
    reference = db.Column(db.String(80), default="")
    amount = db.Column(db.Numeric(10, 2), nullable=True)
    currency = db.Column(db.String(8), default="EUR")
    method = db.Column(db.String(40), default="")
    status = db.Column(db.String(30), default="paid")
    event_at = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    @property
    def item_label(self):
        template = READER_BILLING_ITEMS.get(self.entry_type, "Billing event")
        return template.format(reference=self.reference or "")

    @property
    def amount_label(self):
        if self.entry_type == "payment":
            return self.method or "—"
        if self.amount is None:
            return "—"
        symbol = CURRENCY_SYMBOLS.get(self.currency or "EUR", "")
        return f"{symbol}{float(self.amount):.2f}"

    @property
    def presentation(self):
        return READER_BILLING_PRESENTATION.get(
            (self.entry_type, self.status), ("Pending", "neutral")
        )

    def to_dict(self, date_formatter=None):
        status, tone = self.presentation
        return {
            "id": self.id,
            "item": self.item_label,
            "amount": self.amount_label,
            "status": status,
            "tone": tone,
            "date": date_formatter(self.event_at) if (self.event_at and date_formatter) else "",
        }

    def __repr__(self):
        return f"<ReaderBillingEntry {self.item_label} ({self.status})>"