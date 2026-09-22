from datetime import datetime, timezone

from models import db


class SiteSetting(db.Model):
    """Key/value site settings editable from the admin workspace.

    Rows are created lazily by the admin save path; the public readers fall
    back to the hard-coded default when a key has no row yet.
    """

    __tablename__ = "site_settings"

    key = db.Column(db.String(60), primary_key=True)
    value = db.Column(db.Text, nullable=False, default="")
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self):
        return {
            "key": self.key,
            "value": self.value or "",
            "updatedAt": self.updated_at.isoformat() if self.updated_at else "",
        }

    def __repr__(self):
        return f"<SiteSetting {self.key}>"