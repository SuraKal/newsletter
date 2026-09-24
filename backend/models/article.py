import uuid
from datetime import datetime

from models import db

UUID_LEN = 36

ARTICLE_STATUSES = ("Draft", "Scheduled", "Published")

# Placement keys mirror `ARTICLE_PLACEMENTS` in `frontend/src/lib/content-store.js`.
ARTICLE_SOURCES = ("latest", "hero", "sidebar", "featured", "editorial", "admin")


class Article(db.Model):
    __tablename__ = "articles"

    id = db.Column(
        db.String(UUID_LEN),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    headline = db.Column(db.String(255), nullable=False)
    summary = db.Column(db.Text)
    body = db.Column(db.Text)
    image = db.Column(db.Text)
    author = db.Column(db.String(120), default="Editorial desk")
    editor = db.Column(db.String(120), default="Editorial desk")
    status = db.Column(db.String(30), default="Draft")  # Draft | Scheduled | Published
    tone = db.Column(db.String(30), default="neutral")
    access_label = db.Column(db.String(120))
    read_time = db.Column(db.String(50))
    source = db.Column(db.String(30), default="latest")  # latest | hero | sidebar | featured | editorial | admin
    category_id = db.Column(
        db.String(UUID_LEN),
        db.ForeignKey("categories.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    category_label = db.Column(db.String(200))
    date = db.Column(db.String(50))
    public_access_date = db.Column(db.String(50))
    access_mode = db.Column(db.String(30), default="auto")  # auto | locked | public
    publish_date = db.Column(db.String(50))
    publish_time = db.Column(db.String(50))
    clicks = db.Column(db.Integer, default=0)
    meta = db.Column(db.JSON, default=dict)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    category = db.relationship("Category", back_populates="articles")

    def to_dict(self):
        return {
            "id": self.id,
            "headline": self.headline,
            "summary": self.summary,
            "body": self.body,
            "image": self.image,
            "author": self.author,
            "editor": self.editor,
            "status": self.status,
            "tone": self.tone,
            "accessLabel": self.access_label,
            "readTime": self.read_time,
            "source": self.source,
            "categoryId": self.category_id,
            "categoryLabel": self.category_label,
            "date": self.date,
            "publicAccessDate": self.public_access_date,
            "accessMode": self.access_mode or "auto",
            "publishDate": self.publish_date,
            "publishTime": self.publish_time,
            "clicks": self.clicks or 0,
            "meta": self.meta or {},
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self):
        return f"<Article {self.headline!r} ({self.status})>"