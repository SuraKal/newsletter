import uuid
from datetime import datetime

from models import db

UUID_LEN = 36

# Governance requests are raised from the reader and company privacy
# workspaces and reviewed by admins. `scope` distinguishes an individual
# reader request from a company-account request.
GOVERNANCE_SCOPES = ("reader", "company")

GOVERNANCE_REQUEST_STATUSES = (
    "Queued",
    "In progress",
    "Under review",
    "Review required",
    "Completed",
)

# Visual tone per status so admin badges render without client-side inference.
# Mirrors `statusTone` in AdminGovernance.jsx.
TONE_FOR_GOVERNANCE_STATUS = {
    "Queued": "info",
    "In progress": "info",
    "Under review": "warning",
    "Review required": "warning",
    "Completed": "success",
}

# Server-owned mapping of the two self-service actions to request type and
# initial status, so the client cannot dictate workflow state.
GOVERNANCE_ACTIONS = {
    "reader": {
        "export": ("Data export", "Queued"),
        "deletion": ("Deletion review", "Review required"),
    },
    "company": {
        "export": ("Company data export", "Queued"),
        "deletion": ("Company deletion review", "Review required"),
    },
}


def format_request_date(value):
    """Format a datetime the way the governance panels display it."""
    if value is None:
        return ""
    return f"{value.strftime('%B')} {value.day}, {value.year}"


class GovernanceRequest(db.Model):
    __tablename__ = "governance_requests"

    id = db.Column(
        db.String(UUID_LEN),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    company_account_id = db.Column(
        db.String(UUID_LEN),
        db.ForeignKey("company_accounts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    scope = db.Column(db.String(30), default="reader")
    type = db.Column(db.String(80), default="Data export")
    status = db.Column(db.String(40), default="Queued")
    notes = db.Column(db.Text, default="")

    resolved_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships -----------------------------------------------------------
    user = db.relationship("User")
    company_account = db.relationship("CompanyAccount")

    # Computed helpers --------------------------------------------------------

    @property
    def tone(self):
        return TONE_FOR_GOVERNANCE_STATUS.get(self.status, "neutral")

    # Serialisation -----------------------------------------------------------

    def to_dict(self, include_requester=False):
        data = {
            "id": self.id,
            "userId": self.user_id,
            "companyAccountId": self.company_account_id,
            "scope": self.scope,
            "type": self.type,
            "status": self.status,
            "tone": self.tone,
            "notes": self.notes or "",
            "date": format_request_date(self.created_at),
            "createdAt": (
                self.created_at.isoformat() if self.created_at else None
            ),
            "updatedAt": (
                self.updated_at.isoformat() if self.updated_at else None
            ),
            "resolvedAt": (
                self.resolved_at.isoformat() if self.resolved_at else None
            ),
        }

        if include_requester:
            data["requester"] = {
                "id": self.user_id,
                "name": self.user.name if self.user else "Unknown user",
                "email": self.user.email if self.user else "",
                "role": self.user.role if self.user else "",
                "companyName": self.user.company_name if self.user else "",
            }
            if self.scope == "company":
                data["scopeLabel"] = (
                    (self.company_account.company if self.company_account else None)
                    or (self.user.company_name if self.user else None)
                    or "Company account"
                )
            else:
                data["scopeLabel"] = "Individual reader"

        return data

    def __repr__(self):
        return f"<GovernanceRequest {self.type!r} ({self.status})>"
