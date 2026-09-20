from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import models so they register on db.metadata (required by Flask-Migrate).
from .user import User
from .subscription import SubscriptionPlan, UserSubscription
from .template import ArticleTemplate
from .category import Category, Subcategory
from .article import Article
from .company import CompanyAccount
from .company_order import CompanyOrder
from .location import BusinessLocation
from .shipment import Shipment, ShipmentActivity
from .reader_delivery import ReaderDelivery, ReaderDeliveryActivity
from .reading_history import ReadingHistoryEntry
from .reader_billing import ReaderBillingEntry
from .checkout_session import CheckoutSession
from .business_order import BusinessOrder
from .business_invoice import BusinessInvoice
from .business_team import BusinessTeamMember
from .governance_request import GovernanceRequest
from .legal_page import LegalPage

__all__ = [
    "db",
    "User",
    "SubscriptionPlan",
    "UserSubscription",
    "ArticleTemplate",
    "Category",
    "Subcategory",
    "Article",
    "CompanyAccount",
    "CompanyOrder",
    "BusinessLocation",
    "Shipment",
    "ShipmentActivity",
    "ReaderDelivery",
    "ReaderDeliveryActivity",
    "ReadingHistoryEntry",
    "ReaderBillingEntry",
    "CheckoutSession",
    "BusinessOrder",
    "BusinessInvoice",
    "BusinessTeamMember",
    "GovernanceRequest",
    "LegalPage",
]