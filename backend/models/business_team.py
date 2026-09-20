import uuid
from datetime import datetime

from models import db

UUID_LEN = 36

# Team seats are active or awaiting activation. A pending seat represents an
# invitation that has not been accepted yet.
TEAM_MEMBER_WORKFLOW_STATES = ("Active", "Pending")

TONE_FOR_TEAM_STATUS = {
    "Active": "success",
    "Pending": "warning",
}


class BusinessTeamMember(db.Model):
    __tablename__ = "business_team_members"

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

    name = db.Column(db.String(160), nullable=False)
    role = db.Column(db.String(120), default="")
    scope = db.Column(db.String(160), default="")
    status = db.Column(db.String(40), default="Pending")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships -----------------------------------------------------------
    company_account = db.relationship("CompanyAccount")

    # Computed helpers --------------------------------------------------------

    @property
    def tone(self):
        return TONE_FOR_TEAM_STATUS.get(self.status, "neutral")

    # Serialisation -----------------------------------------------------------

    def to_dict(self):
        return {
            "id": self.id,
            "companyAccountId": self.company_account_id,
            "name": self.name,
            "role": self.role or "",
            "scope": self.scope or "",
            "status": self.status,
            "tone": self.tone,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self):
        return f"<BusinessTeamMember {self.name!r} ({self.status})>"
