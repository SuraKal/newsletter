import re
import uuid
from datetime import datetime

from models import db

UUID_LEN = 36


def slugify(value):
    """Lowercase, ampersand-friendly URL slug for labels."""
    text = (value or "").lower()
    text = text.replace("&", "and")
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(
        db.String(UUID_LEN),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    label = db.Column(db.String(120), nullable=False)
    slug = db.Column(db.String(140), unique=True, nullable=False, index=True)
    image = db.Column(db.Text)
    template_key = db.Column(db.String(50), nullable=False, default="feature")
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    subcategories = db.relationship(
        "Subcategory",
        back_populates="category",
        cascade="all, delete-orphan",
        order_by="Subcategory.sort_order",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "label": self.label,
            "slug": self.slug,
            "image": self.image,
            "templateKey": self.template_key,
            "sortOrder": self.sort_order,
            "subcategories": [sub.to_dict() for sub in self.subcategories],
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self):
        return f"<Category {self.label} ({self.slug})>"


class Subcategory(db.Model):
    __tablename__ = "subcategories"

    __table_args__ = (
        db.UniqueConstraint("category_id", "label", name="uq_subcategories_category_label"),
    )

    id = db.Column(
        db.String(UUID_LEN),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    category_id = db.Column(
        db.String(UUID_LEN),
        db.ForeignKey("categories.id"),
        nullable=False,
        index=True,
    )
    label = db.Column(db.String(120), nullable=False)
    slug = db.Column(db.String(140), nullable=False)
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    category = db.relationship("Category", back_populates="subcategories")

    def to_dict(self):
        return {
            "id": self.id,
            "label": self.label,
            "slug": self.slug,
            "sortOrder": self.sort_order,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<Subcategory {self.label} ({self.slug})>"