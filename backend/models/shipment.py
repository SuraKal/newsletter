import uuid
from datetime import datetime

from models import db

UUID_LEN = 36

# A shipment run covers both platform-wide admin runs and company-owned
# business runs. `company_account_id` is NULL for admin/platform runs and set
# for business-owned runs, mirroring the `owner` tag in the mock store.
SHIPMENT_WORKFLOW_STATES = (
    "Address review",
    "Preparing",
    "In dispatch",
    "Delivered",
    "Delay flagged",
)

TONE_FOR_SHIPMENT_STATUS = {
    "Address review": "warning",
    "Preparing": "neutral",
    "In dispatch": "info",
    "Delivered": "success",
    "Delay flagged": "warning",
}


class Shipment(db.Model):
    __tablename__ = "shipments"

    id = db.Column(
        db.String(UUID_LEN),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    company_account_id = db.Column(
        db.String(UUID_LEN),
        db.ForeignKey("company_accounts.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )

    shipment_id = db.Column(db.String(40), nullable=True, index=True)
    label = db.Column(db.String(200), default="")
    route = db.Column(db.String(120), default="")
    scope = db.Column(db.String(120), default="")
    status = db.Column(db.String(50), default="Preparing")
    eta = db.Column(db.String(120), default="")

    # How a run was started. `manual` covers ad-hoc/platform runs started
    # from scratch; `bulk_order` means it was initiated from an approved
    # bulk-order request and keeps a link back to that request.
    source_type = db.Column(db.String(30), default="manual")
    order_request_id = db.Column(
        db.String(UUID_LEN),
        db.ForeignKey("company_orders.id", ondelete="SET NULL"),
        nullable=True,
        unique=True,
        index=True,
    )
    notes = db.Column(db.String(500), default="")

    # Destination names captured when a run is started from a bulk order.
    # When present they take precedence over the company's saved business
    # locations; otherwise the payload falls back to those saved locations.
    delivery_locations = db.Column(db.JSON, default=list)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships -----------------------------------------------------------
    company_account = db.relationship("CompanyAccount")
    activities = db.relationship(
        "ShipmentActivity",
        backref="shipment",
        cascade="all, delete-orphan",
        order_by="ShipmentActivity.created_at",
    )

    # Computed helpers --------------------------------------------------------

    @property
    def tone(self):
        return TONE_FOR_SHIPMENT_STATUS.get(self.status, "neutral")

    @property
    def owner(self):
        return "admin" if self.company_account_id is None else "business"

    # Serialisation -----------------------------------------------------------

    def to_dict(self):
        company = self.company_account.company if self.company_account else None
        return {
            "id": self.id,
            "companyAccountId": self.company_account_id,
            "shipmentId": self.shipment_id,
            "label": self.label,
            "route": self.route,
            "scope": self.scope,
            "status": self.status,
            "tone": self.tone,
            "eta": self.eta,
            "sourceType": self.source_type or "manual",
            "orderRequestId": self.order_request_id,
            "notes": self.notes or "",
            "deliveryLocations": self.delivery_locations or [],
            "owner": self.owner,
            "company": company,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self):
        return f"<Shipment {self.shipment_id} ({self.status})>"


class ShipmentActivity(db.Model):
    __tablename__ = "shipment_activity"

    id = db.Column(
        db.String(UUID_LEN),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    shipment_id = db.Column(
        db.String(UUID_LEN),
        db.ForeignKey("shipments.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    event = db.Column(db.String(200), default="")
    status = db.Column(db.String(50), default="")
    tone = db.Column(db.String(30), default="neutral")
    date = db.Column(db.String(120), default="")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Serialisation -----------------------------------------------------------

    def to_dict(self):
        return {
            "id": self.id,
            "shipmentId": self.shipment.shipment_id if self.shipment else None,
            "event": self.event,
            "status": self.status,
            "tone": self.tone,
            "date": self.date,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<ShipmentActivity {self.event!r}>"