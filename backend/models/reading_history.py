import uuid
from datetime import datetime

from models import db

# Machine states for a reader history row. Presentation (status label + tone)
# is derived so pages stay data-driven and the seed can pin demo states such
# as "Archive soon" or "Read today".
READING_HISTORY_STATES = (
    "viewed",
    "read",
    "read_today",
    "shared",
    "saved",
    "archive_soon",
    "completed",
)

READING_STATE_PRESENTATION = {
    "saved": ("Saved", "success"),
    "shared": ("Shared", "info"),
    "read_today": ("Read today", "info"),
    "completed": ("Completed", "neutral"),
    "archive_soon": ("Archive soon", "warning"),
    "read": ("Read", "neutral"),
    "viewed": ("Viewed", "neutral"),
}


class ReadingHistoryEntry(db.Model):
    __tablename__ = "reading_history"

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
    article_id = db.Column(db.String(80), default="", index=True)

    title = db.Column(db.String(200), default="")
    category = db.Column(db.String(80), default="News")
    state = db.Column(db.String(30), default="viewed")

    saved = db.Column(db.Boolean, default=False)
    last_read_at = db.Column(db.DateTime, nullable=True)
    last_shared_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Serialisation -----------------------------------------------------------
    # `date_formatter` is injected so this model stays free of route imports.
    def to_dict(self, date_formatter=None):
        label, tone = READING_STATE_PRESENTATION.get(self.state, ("Viewed", "neutral"))
        activity_at = self.last_read_at or self.last_shared_at or self.created_at
        return {
            "id": self.id,
            "articleId": self.article_id,
            "item": self.title or "Untitled story",
            "category": self.category or "News",
            "status": label,
            "tone": tone,
            "date": date_formatter(activity_at) if (activity_at and date_formatter) else "",
        }

    def __repr__(self):
        return f"<ReadingHistoryEntry {self.article_id} ({self.state})>"