import uuid
from datetime import datetime

from models import db

UUID_LEN = 36

# Canonical workflow states matching COMPANY_WORKFLOW_STATES in company-store.js.
COMPANY_WORKFLOW_STATES = (
    "Draft",
    "Submitted",
    "Under review",
    "Quote ready",
    "Approved",
    "Declined",
    "Converted to account",
)

# Visual tone per state so status badges render without client-side inference.
# Mirrors workflowTone in the mock store.
TONE_FOR_STATUS = {
    "Draft": "neutral",
    "Submitted": "info",
    "Under review": "warning",
    "Quote ready": "info",
    "Approved": "success",
    "Declined": "neutral",
    "Converted to account": "success",
}


class CompanyAccount(db.Model):
    __tablename__ = "company_accounts"

    id = db.Column(
        db.String(UUID_LEN),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    company = db.Column(db.String(255), nullable=False)

    tier = db.Column(db.String(50))
    volume = db.Column(db.String(120))
    billing = db.Column(db.String(120))
    region = db.Column(db.String(120))

    status = db.Column(db.String(50), default="Draft")

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
    # Populated when the workflow reaches "Quote ready".
    quote = db.Column(db.JSON, default=dict)

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
            "tier": self.tier,
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
