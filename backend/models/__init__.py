from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import models so they register on db.metadata (required by Flask-Migrate).
from .user import User
from .subscription import SubscriptionPlan, UserSubscription
from .template import ArticleTemplate
from .category import Category, Subcategory
from .article import Article

__all__ = [
    "db",
    "User",
    "SubscriptionPlan",
    "UserSubscription",
    "ArticleTemplate",
    "Category",
    "Subcategory",
    "Article",
]