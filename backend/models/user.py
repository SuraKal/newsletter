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
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }
        if include_subscriptions:
            data["subscriptions"] = [
                sub.to_dict() for sub in self.subscriptions.all()
            ]
        return data

    def __repr__(self):
        return f"<User {self.email} ({self.role})>"