import uuid
from datetime import datetime

from models import db

UUID_LEN = 36

# A company delivery destination moves through one readiness workflow. New
# review states start off "Ready" once the receiving contact is confirmed.
LOCATION_WORKFLOW_STATES = (
    "Ready",
    "Review",
    "Confirm contact",
    "Updated",
)

TONE_FOR_LOCATION_STATUS = {
    "Ready": "success",
    "Review": "warning",
    "Confirm contact": "warning",
    "Updated": "info",
}


class BusinessLocation(db.Model):
    __tablename__ = "business_locations"

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

    location = db.Column(db.String(120), nullable=False)
    region = db.Column(db.String(80), default="")
    address = db.Column(db.String(255), default="")
    place_id = db.Column(db.String(255))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    copies = db.Column(db.String(40), default="")
    contact = db.Column(db.String(120), default="")
    status = db.Column(db.String(50), default="Review")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships -----------------------------------------------------------
    company_account = db.relationship("CompanyAccount")

    # Computed helpers --------------------------------------------------------

    @property
    def tone(self):
        return TONE_FOR_LOCATION_STATUS.get(self.status, "neutral")

    # Serialisation -----------------------------------------------------------

    def to_dict(self):
        return {
            "id": self.id,
            "companyAccountId": self.company_account_id,
            "location": self.location,
            "region": self.region,
            "address": self.address,
            "placeId": self.place_id,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "copies": self.copies,
            "contact": self.contact,
            "status": self.status,
            "tone": self.tone,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self):
        return f"<BusinessLocation {self.location!r} ({self.status})>"
