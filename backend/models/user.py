from datetime import datetime

from werkzeug.security import check_password_hash, generate_password_hash

from models import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(30), nullable=False, default="reader")  # reader | business | admin
    account_type = db.Column(db.String(30), default="individual")  # individual | business | admin
    company_name = db.Column(db.String(255))
    # Business users cannot receive a session until an administrator has
    # verified the company licence submitted with their registration.
    business_access_approved = db.Column(db.Boolean, default=True, nullable=False)
    # Reader consent preferences. Business consents live on CompanyAccount but
    # these columns act as a fallback when a business user has no company record.
    newsletter_opt_in = db.Column(db.Boolean, default=False, nullable=False)
    privacy_updates_opt_in = db.Column(db.Boolean, default=True, nullable=False)
    delivery_data_consent = db.Column(db.Boolean, default=True, nullable=False)
    commercial_updates_opt_in = db.Column(db.Boolean, default=False, nullable=False)
    # Reader delivery profile (persisted from the reader workspace profile page).
    contact_phone = db.Column(db.String(40))
    delivery_address = db.Column(db.String(200))
    city = db.Column(db.String(120))
    postal_code = db.Column(db.String(40))
    country = db.Column(db.String(120))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    subscriptions = db.relationship(
        "UserSubscription", back_populates="user", lazy="dynamic"
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self, include_subscriptions=True):
        data = {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "accountType": self.account_type,
            "companyName": self.company_name,
            "businessAccessApproved": self.business_access_approved,
            "contactPhone": self.contact_phone,
            "deliveryAddress": self.delivery_address,
            "city": self.city,
            "postalCode": self.postal_code,
            "country": self.country,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }
        if include_subscriptions:
            data["subscriptions"] = [
                sub.to_dict() for sub in self.subscriptions.all()
            ]
        return data

    def __repr__(self):
        return f"<User {self.email} ({self.role})>"
