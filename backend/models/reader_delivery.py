import uuid
from datetime import datetime

from models import db

# Machine states for a subscriber print delivery, reusing the shipment
# vocabulary. Presentation (label/tone) is derived so pages stay data-driven.
READER_DELIVERY_STATES = (
    "Address review",
    "Preparing",
    "In dispatch",
    "Delivered",
    "Delay flagged",
)

READER_DELIVERY_LABELS = {
    "Address review": "Address review",
    "Preparing": "Route preparing",
    "In dispatch": "In dispatch",
    "Delivered": "Delivered",
    "Delay flagged": "Delay flagged",
}

READER_DELIVERY_TONES = {
    "Address review": "warning",
    "Preparing": "info",
    "In dispatch": "info",
    "Delivered": "success",
    "Delay flagged": "warning",
}


class ReaderDelivery(db.Model):
    __tablename__ = "reader_deliveries"

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

    tracking_id = db.Column(db.String(40), default="", index=True)
    edition = db.Column(db.String(120), default="")
    status = db.Column(db.String(50), default="Preparing")
    eta = db.Column(db.String(160), default="")
    date = db.Column(db.String(160), default="")
    note = db.Column(db.String(300), default="")
    sort_order = db.Column(db.Integer, default=0)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    activities = db.relationship(
        "ReaderDeliveryActivity",
        backref="delivery",
        cascade="all, delete-orphan",
        order_by="ReaderDeliveryActivity.sort_order",
    )

    @property
    def status_label(self):
        return READER_DELIVERY_LABELS.get(self.status, self.status)

    @property
    def tone(self):
        return READER_DELIVERY_TONES.get(self.status, "neutral")

    def to_dict(self, destination=""):
        return {
            "id": self.id,
            "trackingId": self.tracking_id,
            "edition": self.edition,
            "status": self.status_label,
            "tone": self.tone,
            "eta": self.eta,
            "date": self.date,
            "destination": destination,
            "note": self.note,
            "sortOrder": self.sort_order,
        }

    def __repr__(self):
        return f"<ReaderDelivery {self.tracking_id} ({self.status})>"


class ReaderDeliveryActivity(db.Model):
    __tablename__ = "reader_delivery_activity"

    id = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    delivery_id = db.Column(
        db.String(36),
        db.ForeignKey("reader_deliveries.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    sort_order = db.Column(db.Integer, default=0)
    label = db.Column(db.String(120), default="")
    description = db.Column(db.String(300), default="")
    badge = db.Column(db.String(30), default="")
    status = db.Column(db.String(30), default="pending")
    tone = db.Column(db.String(30), default="neutral")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "sortOrder": self.sort_order,
            "label": self.label,
            "description": self.description,
            "badge": self.badge,
            "status": self.status,
            "tone": self.tone,
        }

    def __repr__(self):
        return f"<ReaderDeliveryActivity {self.label!r} ({self.status})>"