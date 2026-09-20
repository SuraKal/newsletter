from models import db

# Keys the public legal pages are served under. Admin editing covers exactly
# these four pages; unknown keys are rejected by the routes.
LEGAL_PAGE_KEYS = ("terms", "privacy", "refund", "cookies")


class LegalPage(db.Model):
    """Admin-customizable legal/company page content.

    Each row is one published policy (terms, privacy, refund, cookies). The
    body is stored as three JSON blocks so the admin editor can change any
    heading or paragraph without a schema migration:

    - ``sections``: article cards (``{heading, body}``)
    - ``clauses``: bullet panels (``{heading, items: [str]}``)
    - ``contacts``: contact rows (``{label, email}``)
    """

    __tablename__ = "legal_pages"

    id = db.Column(db.String(40), primary_key=True)
    eyebrow = db.Column(db.String(80), default="")
    title = db.Column(db.String(200), default="")
    intro = db.Column(db.Text, default="")
    sections = db.Column(db.JSON, default=list)
    clauses = db.Column(db.JSON, default=list)
    contacts = db.Column(db.JSON, default=list)
    last_updated = db.Column(db.String(40), default="")
    published = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            "key": self.id,
            "eyebrow": self.eyebrow or "",
            "title": self.title or "",
            "intro": self.intro or "",
            "sections": self.sections or [],
            "clauses": self.clauses or [],
            "contacts": self.contacts or [],
            "lastUpdated": self.last_updated or "",
            "published": bool(self.published),
        }

    def __repr__(self):
        return f"<LegalPage {self.id} published={self.published}>"