import uuid
from datetime import datetime

from sqlalchemy.dialects.mysql import MEDIUMTEXT

from models import db

UUID_LEN = 36

# A company registration has one short compliance workflow. Once approved the
# account can sign in and place bulk orders; commercial quote stages are not
# part of this product flow.
COMPANY_WORKFLOW_STATES = (
    "License submitted",
    "License approved",
    "License declined",
)

# Visual tone per state so status badges render without client-side inference.
# Mirrors workflowTone in the mock store.
TONE_FOR_STATUS = {
    "License submitted": "warning",
    "License approved": "success",
    "License declined": "neutral",
}


class CompanyAccount(db.Model):
    __tablename__ = "company_accounts"

    id = db.Column(
        db.String(UUID_LEN),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    company = db.Column(db.String(255), nullable=False)

    volume = db.Column(db.String(120))
    billing = db.Column(db.String(120))
    region = db.Column(db.String(120))

    status = db.Column(db.String(50), default="License submitted")

    # The owning business user — nullable because seed/anonymous applications may
    # lack a user account at creation time.
    owner_user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    owner_email = db.Column(db.String(200))
    work_email = db.Column(db.String(200))

    # Raw BusinessApply form payload — stored as JSON so we don't need a separate
    # application/lead table; the entity itself owns both the application data and
    # the resulting company record.
    lead = db.Column(db.JSON, default=dict)
    # Retained for backwards-compatible reads of existing rows. New company
    # registrations do not use quotes.
    quote = db.Column(db.JSON, default=dict)
    # Data URL for the uploaded business licence. File storage can be swapped
    # in later without changing the API contract.
    license_document = db.Column(MEDIUMTEXT, nullable=True)
    license_reviewed_at = db.Column(db.DateTime, nullable=True)

    reviewed_at = db.Column(db.DateTime, nullable=True)
    account_activated_at = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships -----------------------------------------------------------
    owner = db.relationship("User")

    # Computed helpers --------------------------------------------------------

    @property
    def tone(self):
        return TONE_FOR_STATUS.get(self.status, "neutral")

    # Serialisation -----------------------------------------------------------

    def to_dict(self):
        return {
            "id": self.id,
            "company": self.company,
            "volume": self.volume,
            "billing": self.billing,
            "region": self.region,
            "status": self.status,
            "tone": self.tone,
            "ownerUserId": self.owner_user_id,
            "ownerEmail": self.owner_email,
            "workEmail": self.work_email,
            "lead": self.lead or {},
            "quote": self.quote or {},
            "licenseDocument": self.license_document,
            "licenseReviewedAt": (
                self.license_reviewed_at.isoformat()
                if self.license_reviewed_at
                else None
            ),
            "reviewedAt": (
                self.reviewed_at.isoformat() if self.reviewed_at else None
            ),
            "accountActivatedAt": (
                self.account_activated_at.isoformat()
                if self.account_activated_at
                else None
            ),
            "createdAt": (
                self.created_at.isoformat() if self.created_at else None
            ),
            "updatedAt": (
                self.updated_at.isoformat() if self.updated_at else None
            ),
        }

    def __repr__(self):
        return f"<CompanyAccount {self.company!r} ({self.status})>"
