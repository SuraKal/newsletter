from datetime import datetime, timedelta

import click
from flask.cli import with_appcontext
from sqlalchemy import text

from models import (
    Article,
    ArticleTemplate,
    BusinessInvoice,
    BusinessLocation,
    BusinessOrder,
    BusinessTeamMember,
    Category,
    CheckoutSession,
    CompanyAccount,
    CompanyOrder,
    GovernanceRequest,
    LegalPage,
    ReaderDelivery,
    ReaderDeliveryActivity,
    ReadingHistoryEntry,
    ReaderBillingEntry,
    Shipment,
    ShipmentActivity,
    SiteSetting,
    SubscriptionPlan,
    Subcategory,
    User,
    UserSubscription,
    db,
)
from models.category import slugify
from models.company_order import estimate_order_price
from services.invoicing import reconcile_account_invoices

SEEDED_PLANS = [
    {
        "id": "digital",
        "name": "Digital",
        "monthly_price": 9.99,
        "yearly_price": 119.88,
        "period": "/month",
        "description": "Immediate digital access for individual readers",
        "features": [
            "Subscriber-only access to recent reporting",
            "Daily digital edition across all desks",
            "Archive access once public windows open",
            "Mobile and tablet reading",
            "Breaking news and newsletter updates",
            "Monthly billing with no print delivery",
        ],
        "highlighted": False,
        "audience": "Individual readers",
        "delivery_note": "Digital only",
        "payment_note": "PayPal, Visa, or Mastercard",
    },
    {
        "id": "print-digital",
        "name": "Print + Digital",
        "monthly_price": 24.99,
        "yearly_price": 299.88,
        "period": "/month",
        "description": "The complete Nekedem experience",
        "features": [
            "Everything in Digital",
            "Physical newspaper every two weeks",
            "Real-time delivery tracking",
            "Subscriber-only recent articles",
            "Premium long-form and weekend editions",
            "Address and delivery management",
            "Monthly or yearly billing options",
        ],
        "highlighted": True,
        "audience": "Households and dedicated readers",
        "delivery_note": "Biweekly print delivery",
        "payment_note": "PayPal, Visa, or Mastercard",
    },
    {
        "id": "business-regional",
        "name": "Business Regional",
        "monthly_price": 0,
        "yearly_price": 0,
        "period": "",
        "description": "Volume-priced newspaper access for regional teams",
        "features": [
            "Bulk print orders by location or team",
            "Consolidated invoicing across several delivery points",
            "Company dashboard with shipment visibility",
            "Multi-location delivery coordination",
            "101-500 copies per delivery",
            "Dedicated onboarding and account support",
        ],
        "highlighted": False,
        "audience": "Companies and institutions",
        "delivery_note": "Bulk delivery scheduling",
        "payment_note": "Invoice and contract billing",
    },
    {
        "id": "business-enterprise",
        "name": "Business Enterprise",
        "monthly_price": 0,
        "yearly_price": 0,
        "period": "",
        "description": "Custom contract access for large employer, campus, hotel, or partner networks",
        "features": [
            "Bulk print orders across regions",
            "Contract-based billing and rollout planning",
            "Company dashboard with shipment visibility",
            "500+ copies or special routing",
            "Multi-location delivery coordination",
            "Dedicated onboarding and account support",
        ],
        "highlighted": False,
        "audience": "Large organizations",
        "delivery_note": "Contract delivery scheduling",
        "payment_note": "Invoice and contract billing",
    },
]

SEEDED_USERS = [
    {
        "name": "Nekedem Admin",
        "email": "admin@nekedem.local",
        "password": "admin12345",
        "role": "admin",
        "account_type": "admin",
        "company_name": None,
        "subscription": None,
    },
    {
        "name": "Sofia Lindqvist",
        "email": "admin2@nekedem.local",
        "password": "admin12345",
        "role": "admin",
        "account_type": "admin",
        "company_name": None,
        "subscription": None,
    },
    {
        "name": "Elena Tewelde",
        "email": "viewer@nekedem.local",
        "password": "viewer12345",
        "role": "reader",
        "account_type": "individual",
        "company_name": None,
        "contact_phone": "+32 470 00 00 00",
        "delivery_address": "Rue de la Presse 12",
        "city": "Brussels",
        "postal_code": "1000",
        "country": "Belgium",
        "subscription": {"plan_id": "print-digital", "billing_cycle": "monthly"},
    },
    {
        "name": "Massawa Trading Group",
        "email": "org1@nekedem.local",
        "password": "org112345",
        "role": "business",
        "account_type": "business",
        "company_name": "Massawa Trading Group",
        "business_access_approved": True,
        "subscription": {"plan_id": "business-regional", "billing_cycle": "yearly"},
    },
    {
        "name": "Red Sea Hospitality Co.",
        "email": "org2@nekedem.local",
        "password": "org212345",
        "role": "business",
        "account_type": "business",
        "company_name": "Red Sea Hospitality Co.",
        "business_access_approved": True,
        "subscription": {"plan_id": "business-enterprise", "billing_cycle": "yearly"},
    },
    {
        "name": "Horn of Africa Logistics",
        "email": "org3@nekedem.local",
        "password": "org312345",
        "role": "business",
        "account_type": "business",
        "company_name": "Horn of Africa Logistics",
        "business_access_approved": False,
        "subscription": {"plan_id": "business-regional", "billing_cycle": "yearly"},
    },
]


# Demo reader roster for the admin subscribers surface. Renewal offsets are
# relative to seed time so the derived states stay stable across reseeds.
# Mirrors `adminSubscriberRows` from `demoData.js`.
SEEDED_SUBSCRIBERS = [
    {
        "name": "Amelie Laurent",
        "email": "amelie.laurent@nekedem.local",
        "password": "reader12345",
        "plan_id": "print-digital",
        "billing_cycle": "yearly",
        "status": "active",
        "renewal_offset_days": 180,
        "delivery_data_consent": True,
        "contact_phone": "+32 471 10 11 12",
        "delivery_address": "Diestsestraat 45",
        "city": "Leuven",
        "postal_code": "3000",
        "country": "Belgium",
    },
    {
        "name": "Marta Kovacs",
        "email": "marta.kovacs@nekedem.local",
        "password": "reader12345",
        "plan_id": "digital",
        "billing_cycle": "monthly",
        "status": "active",
        "renewal_offset_days": 200,
        "delivery_data_consent": True,
        "contact_phone": "+36 20 555 12 34",
        "delivery_address": "Andrássy út 88",
        "city": "Budapest",
        "postal_code": "1062",
        "country": "Hungary",
    },
    {
        "name": "Jonas Stein",
        "email": "jonas.stein@nekedem.local",
        "password": "reader12345",
        "plan_id": "print-digital",
        "billing_cycle": "monthly",
        "status": "active",
        "renewal_offset_days": 15,
        "delivery_data_consent": False,
        "contact_phone": "+49 30 123 45 67",
        "delivery_address": "Bergmannstraße 21",
        "city": "Berlin",
        "postal_code": "10961",
        "country": "Germany",
    },
    {
        "name": "Niels Verbruggen",
        "email": "niels.verbruggen@nekedem.local",
        "password": "reader12345",
        "plan_id": "print-digital",
        "billing_cycle": "yearly",
        "status": "past_due",
        "renewal_offset_days": -5,
        "delivery_data_consent": True,
        "contact_phone": "+32 484 22 33 44",
        "delivery_address": "Kerkstraat 8",
        "city": "Ghent",
        "postal_code": "9000",
        "country": "Belgium",
    },
    {
        "name": "Petra Holst",
        "email": "petra.holst@nekedem.local",
        "password": "reader12345",
        "plan_id": "digital",
        "billing_cycle": "monthly",
        "status": "cancelled",
        "renewal_offset_days": -40,
        "delivery_data_consent": False,
        "contact_phone": "+45 60 11 22 33",
        "delivery_address": "Strøget 100",
        "city": "Copenhagen",
        "postal_code": "1000",
        "country": "Denmark",
    },
    {
        "name": "Lucas Mertens",
        "email": "lucas.mertens@nekedem.local",
        "password": "reader12345",
        "plan_id": "print-digital",
        "billing_cycle": "yearly",
        "status": "expired",
        "renewal_offset_days": -80,
        "delivery_data_consent": True,
        "contact_phone": "+31 6 1234 5678",
        "delivery_address": "Kalverstraat 15",
        "city": "Amsterdam",
        "postal_code": "1012",
        "country": "Netherlands",
    },
]


SEEDED_TEMPLATES = [
    {
        "key": "feature",
        "label": "Feature",
        "description": "Hero-led layout for announcement and top news coverage. Default template for new articles and the Events, Technology, and Other categories.",
        "active": True,
        "sort_order": 1,
    },
    {
        "key": "classic",
        "label": "Classic",
        "description": "From-the-News-Desk layout with a bold top rule, related links rail, and an in-edition sidebar. Used by Community stories.",
        "active": True,
        "sort_order": 2,
    },
    {
        "key": "newspaper",
        "label": "Newspaper",
        "description": "Traditional broadsheet section layout with a 'More in this Section' rail. Used by News coverage.",
        "active": True,
        "sort_order": 3,
    },
    {
        "key": "magazine",
        "label": "Magazine",
        "description": "Spread-style layout for Business and Culture & Lifestyle features.",
        "active": True,
        "sort_order": 4,
    },
    {
        "key": "tabloid",
        "label": "Tabloid",
        "description": "Compact rail layout for Jobs & Marketplace listings.",
        "active": True,
        "sort_order": 5,
    },
    {
        "key": "newsletter",
        "label": "Newsletter",
        "description": "Mailer-inspired layout for Advice Corner and Serial Novels columns.",
        "active": True,
        "sort_order": 6,
    },
]

SEEDED_CATEGORIES = [
    {
        "label": "News",
        "image": "https://media.base44.com/images/public/6a49054c34809c470a6304a1/500bf7e07_generated_d7201537.png",
        "template_key": "newspaper",
        "subcategories": ["Local News", "International", "Community Updates"],
    },
    {
        "label": "Community",
        "image": "https://media.base44.com/images/public/6a49054c34809c470a6304a1/a7968ed35_generated_d6ba078b.png",
        "template_key": "classic",
        "subcategories": [
            "Weddings & Love Stories",
            "Birth Announcements",
            "Graduations",
            "Memorials",
            "Success Stories",
            "Community Announcements",
            "Volunteer Opportunities",
        ],
    },
    {
        "label": "Business",
        "image": "https://media.base44.com/images/public/6a49054c34809c470a6304a1/a3afdeb7e_generated_3e8f6d5f.png",
        "template_key": "magazine",
        "subcategories": [
            "Business News",
            "Featured Businesses",
            "Entrepreneur Stories",
            "Investment",
            "Sponsored Businesses",
        ],
    },
    {
        "label": "Jobs & Marketplace",
        "image": "https://media.base44.com/images/public/6a49054c34809c470a6304a1/81560dac8_generated_9e4048c1.png",
        "template_key": "tabloid",
        "subcategories": [
            "Job Vacancies",
            "Businesses Hiring",
            "Buy & Sell",
            "Cars",
            "Houses & Apartments",
            "Services",
        ],
    },
    {
        "label": "Events",
        "image": "https://media.base44.com/images/public/6a49054c34809c470a6304a1/aa6b8b143_generated_4e407147.png",
        "template_key": "feature",
        "subcategories": [
            "Community Events",
            "Church Events",
            "Festivals",
            "Concerts",
            "Sports Events",
        ],
    },
    {
        "label": "Culture & Lifestyle",
        "image": "https://media.base44.com/images/public/6a49054c34809c470a6304a1/a7968ed35_generated_d6ba078b.png",
        "template_key": "magazine",
        "subcategories": [
            "Culture",
            "Food",
            "Health",
            "Travel",
            "Fashion",
            "Entertainment",
        ],
    },
    {
        "label": "Technology",
        "image": "https://media.base44.com/images/public/6a49054c34809c470a6304a1/6dcf729e5_generated_89d63e00.png",
        "template_key": "feature",
        "subcategories": ["AI", "Apps", "Mobile", "Business Technology", "Digital Tips"],
    },
    {
        "label": "Advice Corner",
        "image": "https://media.base44.com/images/public/6a49054c34809c470a6304a1/021cf2160_generated_cd75a79f.png",
        "template_key": "newsletter",
        "subcategories": [
            "Anonymous Stories",
            "Relationships",
            "Family",
            "Career Advice",
            "Immigration & Legal Tips",
            "Education",
        ],
    },
    {
        "label": "Serial Novels",
        "image": "https://media.base44.com/images/public/6a49054c34809c470a6304a1/021cf2160_generated_cd75a79f.png",
        "template_key": "newsletter",
        "subcategories": [
            "Romance",
            "Mystery",
            "Historical Fiction",
            "Children's Stories",
        ],
    },
    {
        "label": "Other",
        "image": "https://media.base44.com/images/public/6a49054c34809c470a6304a1/7f78d84fd_generated_d694e2fd.png",
        "template_key": "feature",
        "subcategories": ["Announcements", "General Interest", "Archive Picks"],
    },
]


def _upsert_templates():
    for template_data in SEEDED_TEMPLATES:
        template = ArticleTemplate.query.filter_by(key=template_data["key"]).first()
        if template is None:
            db.session.add(ArticleTemplate(**template_data))
        else:
            for field, field_value in template_data.items():
                setattr(template, field, field_value)


def _upsert_plans():
    for plan_data in SEEDED_PLANS:
        plan = db.session.get(SubscriptionPlan, plan_data["id"])
        if plan is None:
            db.session.add(SubscriptionPlan(**plan_data))
        else:
            for key, value in plan_data.items():
                setattr(plan, key, value)


def _upsert_users():
    now = datetime.now()
    for user_seed in SEEDED_USERS:
        user_data = dict(user_seed)
        subscription = user_data.pop("subscription")
        password = user_data.pop("password")
        user = User.query.filter_by(email=user_data["email"]).first()
        if user is None:
            user = User(**user_data)
            user.set_password(password)
            db.session.add(user)
        else:
            for key, value in user_data.items():
                if key == "email":
                    continue
                setattr(user, key, value)
            user.set_password(password)
        db.session.flush()

        # Reset the user's subscriptions so the seed matches the spec exactly,
        # then attach the intended plan for this demo user.
        UserSubscription.query.filter_by(user_id=user.id).delete()
        if subscription is not None:
            renewal = now + timedelta(days=30 if subscription["billing_cycle"] == "monthly" else 365)
            db.session.add(
                UserSubscription(
                    user_id=user.id,
                    plan_id=subscription["plan_id"],
                    billing_cycle=subscription["billing_cycle"],
                    status="active",
                    started_at=now,
                    renewal_at=renewal,
                )
            )


def _upsert_subscribers():
    """Seed the demo reader roster for the admin subscribers surface.

    Reproduces the four states shown by ``adminSubscriberRows`` in
    ``demoData.js``: Active/Eligible, Active digital-only, Needs review /
    Address review, and Renewal watch / Payment hold. Idempotent per email.
    """
    now = datetime.now()
    for seed in SEEDED_SUBSCRIBERS:
        profile_fields = ("contact_phone", "delivery_address", "city", "postal_code", "country")
        user = User.query.filter_by(email=seed["email"]).first()
        if user is None:
            user = User(
                name=seed["name"],
                email=seed["email"],
                role="reader",
                account_type="individual",
                delivery_data_consent=seed["delivery_data_consent"],
                **{field: seed.get(field) for field in profile_fields},
            )
            user.set_password(seed["password"])
            db.session.add(user)
        else:
            user.name = seed["name"]
            user.role = "reader"
            user.account_type = "individual"
            user.delivery_data_consent = seed["delivery_data_consent"]
            for field in profile_fields:
                setattr(user, field, seed.get(field))
            user.set_password(seed["password"])
        db.session.flush()

        # Reset the user's subscriptions so the seed matches the spec exactly.
        UserSubscription.query.filter_by(user_id=user.id).delete()
        db.session.add(
            UserSubscription(
                user_id=user.id,
                plan_id=seed["plan_id"],
                billing_cycle=seed["billing_cycle"],
                status=seed["status"],
                started_at=now,
                renewal_at=now + timedelta(days=seed["renewal_offset_days"]),
            )
        )


# Demo print deliveries for the reader deliveries surface. Mirrors the
# `readerDelivery*` demo data so the contracts stay 1:1.
READER_DELIVERY_TIMELINE = [
    {
        "label": "Editorial lock",
        "description": (
            "The subscriber edition is closed and queued for print preparation."
        ),
        "badge": "Completed",
        "status": "completed",
        "tone": "neutral",
    },
    {
        "label": "Print and packaging",
        "description": (
            "Copies are grouped by route and verified against active subscriber addresses."
        ),
        "badge": "In queue",
        "status": "active",
        "tone": "neutral",
    },
    {
        "label": "Fleet dispatch",
        "description": (
            "Truck assignment and dispatch confirmation will appear here once the route is released."
        ),
        "badge": "Pending",
        "status": "pending",
        "tone": "neutral",
    },
    {
        "label": "Doorstep confirmation",
        "description": (
            "ETA and final drop confirmation will update after dispatch begins."
        ),
        "badge": "Pending",
        "status": "pending",
        "tone": "neutral",
    },
]

READER_DELIVERY_CURRENT = {
    "tracking_id": "NQ-20260825",
    "edition": "August 25, 2026 Edition",
    "status": "Preparing",
    "eta": "August 25, 2026 · 8:00-9:00 AM",
    "date": "August 25, 2026",
    "note": (
        "The next print cycle is scheduled and the address has already been "
        "matched to an active regional route."
    ),
    "sort_order": 1,
}

READER_DELIVERY_HISTORY = [
    {
        "tracking_id": "NQ-20260811",
        "edition": "August 11, 2026 Edition",
        "date": "August 11, 2026 · 8:24 AM",
        "sort_order": 2,
    },
    {
        "tracking_id": "NQ-20260728",
        "edition": "July 28, 2026 Edition",
        "date": "July 28, 2026 · 8:11 AM",
        "sort_order": 3,
    },
    {
        "tracking_id": "NQ-20260714",
        "edition": "July 14, 2026 Edition",
        "date": "July 14, 2026 · 8:29 AM",
        "sort_order": 4,
    },
    {
        "tracking_id": "NQ-20260630",
        "edition": "June 30, 2026 Edition",
        "date": "June 30, 2026 · 8:18 AM",
        "sort_order": 5,
    },
]

READER_DELIVERY_EMAILS = [
    "viewer@nekedem.local",
    "amelie.laurent@nekedem.local",
    "jonas.stein@nekedem.local",
    "niels.verbruggen@nekedem.local",
    "lucas.mertens@nekedem.local",
]

READER_DELIVERY_DELIVERED_NOTE = (
    "This edition completed its print run and was confirmed delivered to the "
    "saved delivery profile."
)


def _upsert_reader_deliveries():
    """Seed per-subscriber print deliveries with their timeline events.

    Idempotent per (user, tracking_id): rows are recreated to the spec each
    seed, so a reset returns the exact August 25 cycle plus four delivered
    editions. Digital-only subscribers get no rows.
    """
    for email in READER_DELIVERY_EMAILS:
        user = User.query.filter_by(email=email).first()
        if user is None:
            continue
        seeds = [READER_DELIVERY_CURRENT] + [
            {
                **row,
                "status": "Delivered",
                "eta": "",
                "note": READER_DELIVERY_DELIVERED_NOTE,
            }
            for row in READER_DELIVERY_HISTORY
        ]
        for seed in seeds:
            values = {key: value for key, value in seed.items() if key != "timeline"}
            delivery = ReaderDelivery.query.filter_by(
                user_id=user.id, tracking_id=values["tracking_id"]
            ).first()
            if delivery is None:
                delivery = ReaderDelivery(user_id=user.id, **values)
                db.session.add(delivery)
                db.session.flush()
            else:
                for key, value in values.items():
                    setattr(delivery, key, value)
                db.session.flush()

            if values["status"] == "Preparing":
                ReaderDeliveryActivity.query.filter_by(
                    delivery_id=delivery.id
                ).delete()
                for index, item in enumerate(READER_DELIVERY_TIMELINE, start=1):
                    db.session.add(
                        ReaderDeliveryActivity(
                            delivery_id=delivery.id,
                            sort_order=index,
                            **item,
                        )
                    )


# Demo reading history for the reader history surface, mirroring
# `readerHistoryRows` in demoData.js 1:1 (titles, desks, states, dates).
READING_HISTORY_SEEDS = [
    {
        "article_id": "news-1",
        "title": "City Council Approves New Waterline and Road Repair Program",
        "category": "News",
        "state": "read_today",
        "activity_at": datetime(2026, 8, 11, 8, 0),
    },
    {
        "article_id": "business-1",
        "title": "Family-Owned Logistics Firm Expands After Securing Regional Contract",
        "category": "Business",
        "state": "saved",
        "saved": True,
        "activity_at": datetime(2026, 8, 10, 8, 0),
    },
    {
        "article_id": "feat-1",
        "title": "The Vanishing Art of the Morning Paper",
        "category": "Feature",
        "state": "archive_soon",
        "activity_at": datetime(2026, 8, 9, 8, 0),
    },
    {
        "article_id": "community-1",
        "title": "Local Couple Celebrates 50 Years of Marriage Surrounded by Family",
        "category": "Community",
        "state": "completed",
        "activity_at": datetime(2026, 8, 8, 8, 0),
    },
]

READING_HISTORY_EMAILS = [
    "viewer@nekedem.local",
    "amelie.laurent@nekedem.local",
    "marta.kovacs@nekedem.local",
    "jonas.stein@nekedem.local",
    "niels.verbruggen@nekedem.local",
    "petra.holst@nekedem.local",
    "lucas.mertens@nekedem.local",
]


def _upsert_reading_history():
    """Seed per-reader reading history rows with the demo article set.

    Idempotent per (user, article_id): each seed re-applies title, desk,
    state, and the pinned activity timestamps, so a reset returns the exact
    demo queue.
    """
    for email in READING_HISTORY_EMAILS:
        user = User.query.filter_by(email=email).first()
        if user is None:
            continue
        for seed in READING_HISTORY_SEEDS:
            activity_at = seed["activity_at"]
            entry = ReadingHistoryEntry.query.filter_by(
                user_id=user.id, article_id=seed["article_id"]
            ).first()
            saved = bool(seed.get("saved", False))
            if entry is None:
                entry = ReadingHistoryEntry(
                    user_id=user.id,
                    article_id=seed["article_id"],
                    title=seed["title"],
                    category=seed["category"],
                    state=seed["state"],
                    saved=saved,
                    last_read_at=activity_at,
                    created_at=activity_at,
                )
                db.session.add(entry)
            else:
                entry.title = seed["title"]
                entry.category = seed["category"]
                entry.state = seed["state"]
                entry.saved = saved
                entry.last_read_at = activity_at
                entry.created_at = activity_at


# Demo billing events for the reader billing surface, mirroring
# `readerBillingRows` in demoData.js 1:1 (items, amounts, statuses, dates).
READER_BILLING_SEEDS = [
    {
        "entry_type": "renewal",
        "reference": "",
        "amount": 24.99,
        "method": "",
        "status": "upcoming",
        "event_at": datetime(2026, 9, 11, 9, 0),
    },
    {
        "entry_type": "invoice",
        "reference": "INV-2026-08",
        "amount": 24.99,
        "method": "",
        "status": "paid",
        "event_at": datetime(2026, 8, 11, 9, 0),
    },
    {
        "entry_type": "payment",
        "reference": "",
        "amount": None,
        "method": "PayPal",
        "status": "verified",
        "event_at": datetime(2026, 8, 10, 9, 0),
    },
    {
        "entry_type": "invoice",
        "reference": "INV-2026-07",
        "amount": 24.99,
        "method": "",
        "status": "paid",
        "event_at": datetime(2026, 7, 11, 9, 0),
    },
]

READER_BILLING_EMAILS = [
    "viewer@nekedem.local",
    "amelie.laurent@nekedem.local",
    "marta.kovacs@nekedem.local",
    "jonas.stein@nekedem.local",
    "niels.verbruggen@nekedem.local",
    "petra.holst@nekedem.local",
    "lucas.mertens@nekedem.local",
]


def _upsert_reader_billing():
    """Seed per-reader billing events with the demo invoice set.

    Idempotent per (user, entry_type, reference): each seed re-applies the
    type, amount, method, status, and pinned event timestamps, so a reset
    returns the exact payment-history queue.
    """
    for email in READER_BILLING_EMAILS:
        user = User.query.filter_by(email=email).first()
        if user is None:
            continue
        for seed in READER_BILLING_SEEDS:
            event = ReaderBillingEntry.query.filter_by(
                user_id=user.id,
                entry_type=seed["entry_type"],
                reference=seed["reference"],
            ).first()
            if event is None:
                event = ReaderBillingEntry(
                    user_id=user.id,
                    event_at=seed["event_at"],
                    created_at=seed["event_at"],
                    **{
                        key: value
                        for key, value in seed.items()
                        if key != "event_at"
                    },
                )
                db.session.add(event)
            else:
                for key, value in seed.items():
                    setattr(event, key, value)
                event.created_at = seed["event_at"]


def _upsert_categories():
    for index, category_seed in enumerate(SEEDED_CATEGORIES):
        category_data = dict(category_seed)
        subcategories = category_data.pop("subcategories")
        slug = slugify(category_data["label"])
        category = Category.query.filter_by(slug=slug).first()
        if category is None:
            category = Category(slug=slug, sort_order=index + 1, **category_data)
            db.session.add(category)
        else:
            for key, value in category_data.items():
                setattr(category, key, value)
            category.sort_order = index + 1
        db.session.flush()

        # Reset subcategories so the seed matches the spec exactly.
        Subcategory.query.filter_by(category_id=category.id).delete()
        for sub_index, label in enumerate(subcategories):
            db.session.add(
                Subcategory(
                    category_id=category.id,
                    label=label,
                    slug=slugify(label),
                    sort_order=sub_index + 1,
                )
            )


SEEDED_ARTICLES = [
    {
        "headline": "Asmara Heritage Conservation Board Unveils Modernist Landmark Restoration Project",
        "summary": "Urban conservation teams in Asmara launch an extensive restoration initiative revitalising iconic art deco architecture across Harnet Avenue and the historic centre.",
        "body": "The municipality of Asmara, working alongside architectural historians and the Cultural Heritage Project, has inaugurated a major restoration cycle across the capital's historic core. Recognised as a UNESCO World Heritage site for its remarkable modernist urban design, Asmara boasts Africa's finest collection of Art Deco, Futurist, and Novecento structures. The first phase of restoration targets landmark facades along Harnet Avenue, including Cinema Impero's grand portico, the distinctive aerodynamic wings of the Fiat Tagliero service station, and the Mai Jahjah green pedestrian terraces.\n\nLocal craftspeople and restoration technicians trained in lime plastering and terrazzo preservation are heading the works. Municipal urban planners affirmed that the initiative balances rigorous historical preservation with daily civic life, keeping the capital's vibrant cafe culture and pedestrian thoroughfares alive while protecting architectural treasures for generations to come.",
        "image": "https://media.base44.com/images/public/6a49054c34809c470a6304a1/500bf7e07_generated_d7201537.png",
        "author": "Yonas Berhane",
        "editor": "Nekedem Editorial Desk",
        "status": "Published",
        "tone": "success",
        "access_label": "Subscriber-only",
        "access_mode": "locked",
        "read_time": "5 min",
        "source": "hero",
        "category_label": "News",
        "date": "September 18, 2026",
        "public_access_date": "October 18, 2026",
        "publish_date": "September 18, 2026",
        "publish_time": "2:00 PM",
        "clicks": 320,
        "meta": {"location": "Asmara", "quarter": "Harnet Avenue", "focus": "UNESCO World Heritage"},
    },
    {
        "headline": "Massawa Port Upgrade Expands Red Sea Fisheries and Regional Cold-Chain Logistics",
        "summary": "Expanded deep-water berths, modernized cold-storage docks, and swift processing facilities drive substantial growth in coastal seafood distribution.",
        "body": "New cold-storage complexes and upgraded docking berths across Twalot and Batsi Island in Massawa are providing an unprecedented economic boost to Red Sea artisanal fishing cooperatives. The port authority reported an eighteen percent increase in commercial marine catch handling over the recent quarter, with fresh snapper, grouper, and Gulf of Zula shrimp reaching central highland markets within hours of offloading.\n\nKey to this expansion has been the refrigerated transport corridor linking Massawa to Dekemhare and Asmara via the historic mountain roadway. Cooperative chairmen emphasized that reliable chilling facilities have slashed post-harvest losses, enabling coastal fishing families to secure premium wholesale prices while supplying nutritious seafood to retail markets across the country.",
        "image": "https://media.base44.com/images/public/6a49054c34809c470a6304a1/a3afdeb7e_generated_3e8f6d5f.png",
        "author": "Amanuel Tesfay",
        "editor": "Nekedem Editorial Desk",
        "status": "Published",
        "tone": "success",
        "access_label": "Public",
        "access_mode": "public",
        "read_time": "6 min",
        "source": "featured",
        "category_label": "Business",
        "date": "September 16, 2026",
        "public_access_date": "",
        "publish_date": "September 16, 2026",
        "publish_time": "8:30 AM",
        "clicks": 215,
        "meta": {"location": "Massawa", "sector": "Fisheries & Maritime Logistics"},
    },
    {
        "headline": "Tour of Eritrea Unveils Challenging Mountain Stages from Coast to Highlands",
        "summary": "The national cycling federation reveals the route for the upcoming classic, featuring the grueling high-altitude ascent from Ghinda to Asmara.",
        "body": "Cycling enthusiasts across Eritrea are preparing for the nation's most celebrated sporting event as the National Cycling Federation finalized the stages for the autumn Tour of Eritrea. Spanning over seven hundred kilometers across the Northern Red Sea, Anseba, and Central regions, the competition will pit domestic continental teams against international challengers.\n\nThe defining moment of the tour will arrive during the mountain queen stage, which begins at sea level in Massawa, traverses the lush mist-shrouded green belt of Filfil, and climbs over two thousand vertical meters through the serpentine switchbacks of Ghinda to the finish line at Asmara's Bahti Meskerem square. Fans are expected to assemble along every climb in customary fashion, waving flags and cheering the nation's rising cycling prodigies.",
        "image": "https://media.base44.com/images/public/6a49054c34809c470a6304a1/aa6b8b143_generated_4e407147.png",
        "author": "Rahel Ghebre",
        "editor": "Nekedem Editorial Desk",
        "status": "Scheduled",
        "tone": "neutral",
        "access_label": "Public",
        "access_mode": "public",
        "read_time": "4 min",
        "source": "latest",
        "category_label": "Events",
        "date": "",
        "public_access_date": "",
        "publish_date": "September 28, 2026",
        "publish_time": "10:00 AM",
        "clicks": 0,
        "meta": {"event": "Tour de l'Érythrée", "location": "Asmara - Massawa"},
    },
    {
        "headline": "Keren Citrus Groves Celebrate Bountiful Autumn Harvest and Artisanal Honey Fair",
        "summary": "Senhit farming cooperatives bring sweet oranges, mandarins, and famous white honey to the Monday market beneath Keren's granite peaks.",
        "body": "The bustling market town of Keren celebrated the opening of the seasonal citrus harvest with hundreds of cooperative farmers and beekeepers assembling around the historic camel market and town square. Supported by generous seasonal rains along the Anseba river catchment, orchard yields of Valencia oranges and sweet mandarins exceeded seasonal forecasts.\n\nLocal apiarists also showcased celebrated Keren white honey, cultivated from wild acacia blossoms across the Senhit hillsides. Elders and agricultural extension officers shared sustainable water harvesting methods and organic pest deterrents, demonstrating how community solidarity and traditional ecological wisdom continue to nourish the regional economy.",
        "image": "https://media.base44.com/images/public/6a49054c34809c470a6304a1/a7968ed35_generated_d6ba078b.png",
        "author": "Semir Osman",
        "editor": "Nekedem Editorial Desk",
        "status": "Published",
        "tone": "neutral",
        "access_label": "Public",
        "access_mode": "public",
        "read_time": "3 min",
        "source": "sidebar",
        "category_label": "Community",
        "date": "September 12, 2026",
        "public_access_date": "September 22, 2026",
        "publish_date": "September 12, 2026",
        "publish_time": "7:45 AM",
        "clicks": 94,
        "meta": {"location": "Keren", "focus": "Agriculture & Honey"},
    },
    {
        "headline": "Solar Micro-Grids and Smart Irrigation Transform Farming in Gash-Barka",
        "summary": "Young engineers deploy automated solar pumping systems to optimize water distribution across commercial sorghum and sesame farms in Teseney.",
        "body": "In the sprawling agricultural plains of Gash-Barka, solar-powered precision irrigation networks developed by regional technical institute graduates are redefining agricultural stewardship. Operating across commercial cooperative acreage in Teseney and Barentu, these installations couple solar pump arrays with real-time soil moisture sensors to direct water where it is most needed.\n\nBy replacing expensive diesel-powered generator pumps with clean solar energy, participating farming groups have cut operating fuel expenditures by sixty-five percent. The telemetry sensors alert farm managers via mobile notifications when hydration levels reach optimal saturation, preventing over-irrigation and protecting the vital groundwater reserves of the Gash river basin.",
        "image": "https://media.base44.com/images/public/6a49054c34809c470a6304a1/6dcf729e5_generated_89d63e00.png",
        "author": "Filmon Kidane",
        "editor": "Nekedem Editorial Desk",
        "status": "Published",
        "tone": "info",
        "access_label": "Subscriber-only",
        "access_mode": "locked",
        "read_time": "8 min",
        "source": "editorial",
        "category_label": "Technology",
        "date": "September 14, 2026",
        "public_access_date": "October 20, 2026",
        "publish_date": "September 14, 2026",
        "publish_time": "6:00 PM",
        "clicks": 188,
        "meta": {"location": "Gash-Barka", "technology": "Solar Agro-Tech"},
    },
    {
        "headline": "National Archives Call for Community Submissions of Oral Histories and Folk Songs",
        "summary": "A nationwide heritage campaign invites elders, musicians, and diaspora families to contribute recordings of traditional poetry and music.",
        "body": "The National Heritage Institute has officially opened a nationwide public collection drive to archive traditional oral folklore, customary judicial codes (Higi Endaba), and regional music across Eritrea's nine nationalities. Archivists are working with portable audio stations to record elder poets in rural villages from Debub to the Southern Red Sea.\n\nIn addition to oral history preservation, the project will digitally catalog vintage shellac and magnetic tape recordings of legendary krar players and singers from the 1960s and 1970s. Organisers note that establishing a high-fidelity digital repository will guarantee that Eritrea's oral traditions remain accessible for cultural research and musicological study worldwide.",
        "image": "https://media.base44.com/images/public/6a49054c34809c470a6304a1/7f78d84fd_generated_d694e2fd.png",
        "author": "Nekedem Heritage Desk",
        "editor": "Nekedem Editorial Desk",
        "status": "Draft",
        "tone": "neutral",
        "access_label": "Public",
        "access_mode": "public",
        "read_time": "5 min",
        "source": "admin",
        "category_label": "Other",
        "date": "",
        "public_access_date": "",
        "publish_date": "",
        "publish_time": "",
        "clicks": 0,
        "meta": {"project": "Oral History Archive", "scope": "National"},
    },
    {
        "headline": "Advice Corner: Sustaining Cultural Identity and Multilingual Roots in the Diaspora",
        "summary": "Community counselor Senait Woldu answers reader letters on teaching Tigrinya at home while navigating demanding global careers.",
        "body": "In our weekly reader correspondence column, guest counselor Senait Woldu reflects on heartfelt letters submitted by Eritrean families living in diaspora hubs across Europe and North America. Readers frequently share the difficulty of instilling native language fluency in children when English or local European tongues dominate daily school life.\n\nSenait advises creating natural, pressure-free cultural immersions at home—such as gathering the family around weekend coffee ceremonies, playing traditional krar melodies during dinner, and cooking taita and tsebhi together. She encourages parents to treat heritage language learning as a joyous gift rather than an academic chore, linking language directly to family warmth, music, and ancestral pride.",
        "image": "https://media.base44.com/images/public/6a49054c34809c470a6304a1/021cf2160_generated_cd75a79f.png",
        "author": "Senait Woldu",
        "editor": "Nekedem Editorial Desk",
        "status": "Draft",
        "tone": "warning",
        "access_label": "Public",
        "access_mode": "public",
        "read_time": "4 min",
        "source": "latest",
        "category_label": "Advice Corner",
        "date": "",
        "public_access_date": "",
        "publish_date": "",
        "publish_time": "",
        "clicks": 0,
        "meta": {"column": "Advice Corner", "topic": "Diaspora & Heritage"},
    },
    {
        "headline": "The Red Sea Lantern: Chapter Four - Shadows of the Old Port",
        "summary": "In chapter four of our serialized historical mystery, telegraph operator Dawit deciphers an enigmatic message aboard a midnight dhow in Massawa.",
        "body": "The warm midnight breeze coming off the Gulf of Zula carried the unmistakable aroma of frankincense and drying nets through the slatted shutters of the Massawa telegraph office. Dawit adjusted the brass dial of his receiver, listening intently to the steady rhythm of rhythmic clicks coming through the copper cable from the offshore lighthouse.\n\nOut across the dark water, the amber lantern on a lone sambuk dhow flickered three times before slipping silently past the coral shoals toward Batsi Island. When Dawit transcribed the sequence into his leather-bound ledger, the letters did not spell out standard shipping manifests or port clearance orders. Instead, they spelled the name of a long-abandoned pearl diving outpost near the Dahlak banks.",
        "image": "https://media.base44.com/images/public/6a49054c34809c470a6304a1/021cf2160_generated_cd75a79f.png",
        "author": "Bereket Yohannes",
        "editor": "Nekedem Editorial Desk",
        "status": "Scheduled",
        "tone": "info",
        "access_label": "Subscriber-only",
        "access_mode": "locked",
        "read_time": "12 min",
        "source": "featured",
        "category_label": "Serial Novels",
        "date": "",
        "public_access_date": "",
        "publish_date": "October 4, 2026",
        "publish_time": "8:00 AM",
        "clicks": 0,
        "meta": {"chapter": 4, "title": "The Red Sea Lantern"},
    },
    {
        "headline": "Decamhare Agro-Industrial Corridor Expands Processing and Solar Dairy Depots",
        "summary": "Modern dairy processing plants and organic oil pressing facilities open in the Debub corridor, servicing cooperatives across Mendefera and Segeneiti.",
        "body": "The bustling manufacturing district of Decamhare has witnessed the inauguration of expanded agro-processing depots tailored for regional dairy and organic oil cooperatives. Financed by regional credit unions and domestic agricultural funds, the facility features stainless-steel pasteurization systems, bulk grain milling machinery, and rooftop solar installations.\n\nLocal dairy farmers from Mendefera, Adi Quala, and surrounding farming settlements can now deliver fresh milk daily with guaranteed cold-chain preservation. Municipal leaders underscored that processing locally grown sunflower, sesame, and dairy products inside the region stabilizes consumer food prices in Asmara while generating hundreds of vocational jobs for young technicians.",
        "image": "https://media.base44.com/images/public/6a49054c34809c470a6304a1/500bf7e07_generated_d7201537.png",
        "author": "Meron Habte",
        "editor": "Nekedem Editorial Desk",
        "status": "Published",
        "tone": "success",
        "access_label": "Public",
        "access_mode": "public",
        "read_time": "4 min",
        "source": "hero",
        "category_label": "News",
        "date": "September 15, 2026",
        "public_access_date": "",
        "publish_date": "September 15, 2026",
        "publish_time": "12:30 PM",
        "clicks": 142,
        "meta": {"location": "Decamhare", "industry": "Agro-processing"},
    },
    {
        "headline": "Asmara Medebar Artisanal Guild Launches Vocational Metalcraft Apprenticeship Grants",
        "summary": "Renowned metalworkers and equipment fabricators in the Medebar artisanal quarter offer subsidized training for thirty young apprentices.",
        "body": "The Medebar market in Asmara, celebrated internationally as one of the world's most inventive hubs of circular economy and metal recycling, has announced thirty funded apprenticeship opportunities. Young mechanics, welders, and artisans will study under senior master craftsmen who have spent decades fashioning cooking stoves, agricultural plowshares, and structural hardware from recycled steel.\n\nThe curriculum combines practical on-site anvil work with technical drawing and basic enterprise management. The initiative aims to preserve Eritrea's renowned culture of self-reliance, ingenuity, and technical improvisation while equipping the next generation with marketable craftsmanship skills.",
        "image": "https://media.base44.com/images/public/6a49054c34809c470a6304a1/81560dac8_generated_9e4048c1.png",
        "author": "Nekedem Trade Reporter",
        "editor": "Nekedem Editorial Desk",
        "status": "Scheduled",
        "tone": "success",
        "access_label": "Public",
        "access_mode": "public",
        "read_time": "3 min",
        "source": "sidebar",
        "category_label": "Jobs & Marketplace",
        "date": "",
        "public_access_date": "",
        "publish_date": "September 25, 2026",
        "publish_time": "9:00 AM",
        "clicks": 0,
        "meta": {"location": "Medebar, Asmara", "program": "Apprenticeships"},
    },
    {
        "headline": "The Art of the Eritrean Coffee Ceremony: Ritual, Hospitality, and Shared Memory",
        "summary": "From roasting green beans over hot coals to pouring from the clay jebena, an exploration of how the bun ceremony remains the country's social heartbeat.",
        "body": "In both bustling Asmara apartments and quiet highland villages, daily life pauses when the frankincense begins to curl into the air. The Eritrean coffee ceremony (bun) is far more than a beverage; it is a sacred communal rhythm. Guests gather as freshly washed green coffee beans are roasted over charcoal in a shallow pan, shaken continuously until glistening dark and fragrant, then presented so each guest may inhale the aroma.\n\nBrewed in the spherical clay jebena with hot water and cardamom, the coffee is served in delicate handle-less cups (finiyan) across three sequential rounds: Awol (the first, strongest pour), Bereka (the second round, symbolising blessing), and Dege (the third round, sealing fellowship). Accompanied by freshly popped popcorn (kolo) and aromatic sprigs of rue, the ritual provides a timeless space for conversation, reconciliation, and storytelling.",
        "image": "https://media.base44.com/images/public/6a49054c34809c470a6304a1/a7968ed35_generated_d6ba078b.png",
        "author": "Luwam Tesfamariam",
        "editor": "Nekedem Editorial Desk",
        "status": "Published",
        "tone": "neutral",
        "access_label": "Public",
        "access_mode": "public",
        "read_time": "7 min",
        "source": "editorial",
        "category_label": "Culture & Lifestyle",
        "date": "September 10, 2026",
        "public_access_date": "September 30, 2026",
        "publish_date": "September 10, 2026",
        "publish_time": "11:00 AM",
        "clicks": 260,
        "meta": {"topic": "Coffee Ceremony & Traditions", "culture": "Tigrinya"},
    },
    {
        "headline": "Mendefera Regional Referral Center Commission New Pediatric and Telemedicine Unit",
        "summary": "Healthcare workers in Debub launch specialized diagnostic links connecting rural clinics directly with surgical specialists in Asmara.",
        "body": "Health authorities in the Debub region celebrated a milestone today with the formal opening of the newly equipped pediatric wing and digital telemedicine facility at the Mendefera Referral Hospital. The ward adds twenty-four modern pediatric beds, incubator units for premature newborns, and advanced neonatal monitors.\n\nEqually transformative is the dedicated broadband telemedicine terminal connecting Mendefera's resident clinicians with senior pediatric surgeons and cardiologists at Asmara's Orotta Referral Hospital. Doctors can share digital radiology scans and real-time patient observations, enabling swift expert consultations without requiring critically ill patients to undertake emergency travel across mountain roads.",
        "image": "https://media.base44.com/images/public/6a49054c34809c470a6304a1/500bf7e07_generated_d7201537.png",
        "author": "Nekedem Health Reporter",
        "editor": "Nekedem Editorial Desk",
        "status": "Draft",
        "tone": "warning",
        "access_label": "Public",
        "access_mode": "public",
        "read_time": "3 min",
        "source": "admin",
        "category_label": "News",
        "date": "",
        "public_access_date": "",
        "publish_date": "",
        "publish_time": "",
        "clicks": 0,
        "meta": {"location": "Mendefera", "healthcare": "Pediatric & Telemedicine"},
    },
]

# --------------------------------------------------------------------------- #
# Seed company accounts — mirrors adminCompanyRows from demoData.js plus one
# business-application lead that maps to the first seeded business user.
# --------------------------------------------------------------------------- #

SEED_COMPANY_BASE_CREATED = datetime(2026, 1, 12, 9, 0, 0)
SEED_COMPANY_REVIEWED_AT = datetime(2026, 1, 14, 14, 30, 0)

# Seeded organisations represent already-approved company accounts.
SEEDED_COMPANY_ACCOUNTS = [
    {
        "company": "Atlas Hotels Belgium",
        "volume": "180 copies / cycle",
        "billing": "Monthly invoice",
        "status": "License approved",
        "region": "Belgium",
    },
    {
        "company": "Meridian Trade Offices",
        "volume": "95 copies / cycle",
        "billing": "Monthly invoice",
        "status": "License approved",
        "region": "Belgium",
    },
    {
        "company": "Rhine Partner Lounges",
        "volume": "140 copies / cycle",
        "billing": "Contract billing",
        "status": "License approved",
        "region": "Germany",
    },
    {
        "company": "Embassy reception network",
        "volume": "60 copies / cycle",
        "billing": "Contract billing",
        "status": "License approved",
        "region": "Belgium + Germany",
    },
]

SEEDED_COMPANY_LEAD = {
    "company": "Nekedem Distribution Group",
    "status": "License approved",
    "billing": "Monthly invoice",
    "region": "Belgium and Germany",
    "lead": {
        "primaryContact": "Operations and finance lead",
        "workPhone": "+000000000000",
        "organizationName": "Nekedem Distribution Group",
        "requestType": "Business Subscription",
        "companySize": "51-200",
        "countryScope": "Belgium and Germany",
        "expectedCopies": "475 copies across HQ and partner desks",
        "deliveryLocations": "Brussels, Antwerp, Cologne, and Berlin",
        "billingPreference": "Monthly invoice",
        "launchTimeline": "Within 1 month",
        "operationalNotes": (
            "Consolidated HQ plus regional branch and partner desk "
            "distribution under one account."
        ),
    },
}

# Not-yet-approved company applications that populate the admin review queue.
# One stays pending for admin review (License submitted) and one maps to an
# unapproved business user whose access is still blocked (License declined).
SEEDED_COMPANY_PENDING = [
    {
        "company": "Delta European Distribution",
        "volume": "—",
        "billing": "Contract billing",
        "status": "License submitted",
        "region": "Netherlands + Germany",
        "owner_email": None,
        "lead": {
            "primaryContact": "Fleet and logistics lead",
            "workPhone": "+310000000000",
            "organizationName": "Delta European Distribution",
            "requestType": "Business Subscription",
            "companySize": "201-500",
            "countryScope": "Netherlands and Germany",
            "expectedCopies": "620 copies across two depots",
            "deliveryLocations": "Rotterdam, Düsseldorf",
            "billingPreference": "Contract billing",
            "launchTimeline": "Within 2 months",
            "operationalNotes": (
                "Cross-border depot distribution pending licence review."
            ),
        },
    },
    {
        "company": "Horn of Africa Logistics",
        "volume": "—",
        "billing": "Monthly invoice",
        "status": "License declined",
        "region": "Belgium",
        "owner_email": "org3@nekedem.local",
        "lead": {
            "primaryContact": "Finance and operations lead",
            "workPhone": "+320000000000",
            "organizationName": "Horn of Africa Logistics",
            "requestType": "Business Subscription",
            "companySize": "1-50",
            "countryScope": "Belgium",
            "expectedCopies": "120 copies / cycle",
            "deliveryLocations": "Brussels",
            "billingPreference": "Monthly invoice",
            "launchTimeline": "Within 2 months",
            "operationalNotes": (
                "Application declined at licence review; owner access stays blocked."
            ),
        },
    },
]


def _upsert_articles():
    obsolete_headlines = [
        "City council approves the new harbour market plan",
        "Small businesses see a recovery quarter in the region",
        "A weekend guide to the autumn festival opening",
        "Local bakery wins the national sourdough challenge",
        "Interview: the data journalist behind the harbour series",
        "Readers vote on the next long-form investigation",
        "Advice corner: when parents disagree on schooling",
        "Serial novel, chapter twelve: the flood",
        "New tram line approval moves to public consultation",
        "Young founders open a makers' market in the old depot",
        "Culture desk picks: five films worth a second watch",
        "Harbour market relocation: timeline for stallholders",
    ]
    Article.query.filter(Article.headline.in_(obsolete_headlines)).delete(synchronize_session=False)

    for article_seed in SEEDED_ARTICLES:
        article_data = dict(article_seed)
        category_label = article_data.pop("category_label")
        category = Category.query.filter_by(label=category_label).first()
        article = Article.query.filter_by(headline=article_data["headline"]).first()
        if article is None:
            db.session.add(
                Article(
                    category_id=category.id if category else None,
                    category_label=category_label,
                    **article_data,
                )
            )
        else:
            article.category_id = category.id if category else None
            article.category_label = category_label
            for key, value in article_data.items():
                setattr(article, key, value)


def _upsert_companies():
    """Seed company accounts including pending and declined licence states.

    The four approved accounts mirror ``adminCompanyRows`` from ``demoData.js``.
    The lead account is linked to the first seeded business user so the
    business dashboard works out of the box after login. Pending and declined
    applications keep the admin review queue populated and, for the declined
    one, map to the blocked (``business_access_approved=False``) business user.
    """
    business_users = {
        user.email: user for user in User.query.filter_by(role="business").all()
    }

    for seed in SEEDED_COMPANY_ACCOUNTS:
        existing = CompanyAccount.query.filter_by(company=seed["company"]).first()
        if existing is None:
            db.session.add(
                CompanyAccount(
                    company=seed["company"],
                    volume=seed["volume"],
                    billing=seed["billing"],
                    status=seed["status"],
                    region=seed["region"],
                    created_at=SEED_COMPANY_BASE_CREATED,
                    reviewed_at=SEED_COMPANY_REVIEWED_AT,
                )
            )
        else:
            for key, value in seed.items():
                setattr(existing, key, value)

    # Account — linked to the first business user so the business dashboard
    # snapshot (/business/company) resolves immediately.
    lead_org = SEEDED_COMPANY_LEAD["company"]
    existing_lead = CompanyAccount.query.filter_by(company=lead_org).first()
    lead_data = dict(SEEDED_COMPANY_LEAD)
    lead_user = business_users.get("org1@nekedem.local")
    lead_data["owner_user_id"] = lead_user.id if lead_user else None
    lead_data["owner_email"] = "org1@nekedem.local"
    lead_data["work_email"] = "org1@nekedem.local"
    if existing_lead is None:
        db.session.add(
            CompanyAccount(
                company=lead_data["company"],
                status=lead_data["status"],
                billing=lead_data["billing"],
                region=lead_data["region"],
                owner_user_id=lead_data["owner_user_id"],
                owner_email=lead_data["owner_email"],
                work_email=lead_data["work_email"],
                lead=lead_data["lead"],
            )
        )
    else:
        for key, value in lead_data.items():
            setattr(existing_lead, key, value)

    # Pending and declined applications. The declined one is owned by the
    # unapproved business user so the login block and admin queue match.
    for seed in SEEDED_COMPANY_PENDING:
        owner = (
            business_users.get(seed["owner_email"]) if seed["owner_email"] else None
        )
        seed_data = dict(seed)
        seed_data["owner_user_id"] = owner.id if owner else None
        existing = CompanyAccount.query.filter_by(company=seed["company"]).first()
        if existing is None:
            db.session.add(
                CompanyAccount(
                    company=seed_data["company"],
                    volume=seed_data["volume"],
                    billing=seed_data["billing"],
                    status=seed_data["status"],
                    region=seed_data["region"],
                    owner_user_id=seed_data["owner_user_id"],
                    owner_email=seed_data.get("owner_email"),
                    work_email=seed_data.get("owner_email"),
                    lead=seed_data["lead"],
                )
            )
        else:
            for key, value in seed_data.items():
                if key == "company":
                    continue
                setattr(existing, key, value)


def _upsert_company_orders():
    """Seed bulk order requests for the demo accounts.

    One approved request keeps the business overview populated with a live
    volume, and two pending requests give the admin approval queue something
    to review.
    """
    admin = User.query.filter_by(role="admin").first()

    seeded_orders = [
        {
            "company": "Nekedem Distribution Group",
            "copies": 475,
            "needed_by": "2026-09-25",
            "locations": ["Brussels HQ", "Antwerp (HQ)", "Cologne", "Berlin"],
            "article": "City council approves the new harbour market plan",
            "status": "Approved",
            "final_price": 498.75,
            "reviewed_at": SEED_COMPANY_REVIEWED_AT,
        },
        {
            "company": "Nekedem Distribution Group",
            "copies": 380,
            "needed_by": "2026-10-02",
            "locations": ["Brussels HQ", "Antwerp", "Cologne"],
            "article": "Small businesses see a recovery quarter in the region",
            "status": "Pending approval",
        },
        {
            "company": "Atlas Hotels Belgium",
            "copies": 240,
            "needed_by": "2026-10-09",
            "locations": ["Atlas Brussels", "Atlas Antwerp"],
            "article": "A weekend guide to the autumn festival opening",
            "status": "Pending approval",
        },
        {
            "company": "Horn of Africa Logistics",
            "copies": 120,
            "needed_by": "2026-09-01",
            "locations": ["Brussels depot"],
            "article": "Local bakery wins the national sourdough challenge",
            "status": "Declined",
            "reviewed_at": SEED_COMPANY_REVIEWED_AT,
        },
    ]

    for order_seed in seeded_orders:
        account = CompanyAccount.query.filter_by(
            company=order_seed["company"]
        ).first()
        if account is None:
            continue
        article = Article.query.filter_by(headline=order_seed["article"]).first()
        created_at = order_seed.get("created_at") or SEED_COMPANY_BASE_CREATED
        existing = CompanyOrder.query.filter_by(
            company_account_id=account.id,
            copies=order_seed["copies"],
            status=order_seed["status"],
        ).first()
        if existing is not None:
            if article is not None:
                existing.article_id = article.id
                existing.article_title = article.headline
            existing.needed_by = order_seed["needed_by"]
            continue

        estimated_price, rate = estimate_order_price(order_seed["copies"])
        db.session.add(
            CompanyOrder(
                company_account_id=account.id,
                requested_by_user_id=account.owner_user_id,
                copies=order_seed["copies"],
                needed_by=order_seed["needed_by"],
                delivery_locations=order_seed["locations"],
                article_id=article.id if article else None,
                article_title=article.headline if article else "",
                estimated_price=estimated_price,
                rate=rate,
                status=order_seed["status"],
                final_price=order_seed.get("final_price"),
                reviewed_by_user_id=(
                    admin.id
                    if admin and order_seed["status"] in ("Approved", "Declined")
                    else None
                ),
                reviewed_at=order_seed.get("reviewed_at"),
                created_at=created_at,
            )
        )


def _upsert_locations():
    """Seed delivery destinations for the demo lead org account.

    Mirrors ``businessLocationRows`` from ``demoData.js`` so the business
    locations surface matches the mock. Idempotent per (account, location).
    """
    account = CompanyAccount.query.filter_by(
        company=SEEDED_COMPANY_LEAD["company"]
    ).first()
    if account is None:
        return

    seeded = [
        ("Brussels head office", "Belgium", "70 copies", "Facilities desk", "Ready"),
        ("Antwerp hotel lobby", "Belgium", "55 copies", "Morning concierge", "Ready"),
        ("Cologne branch office", "Germany", "80 copies", "Operations lead", "Updated"),
        ("Berlin partner lounge", "Germany", "45 copies", "Site host", "Ready"),
        ("Embassy reception desk", "Belgium", "30 copies", "Reception review", "Review"),
    ]
    for location, region, copies, contact, status in seeded:
        existing = BusinessLocation.query.filter_by(
            company_account_id=account.id, location=location
        ).first()
        if existing is None:
            db.session.add(
                BusinessLocation(
                    company_account_id=account.id,
                    location=location,
                    region=region,
                    copies=copies,
                    contact=contact,
                    status=status,
                    created_at=SEED_COMPANY_BASE_CREATED,
                )
            )
        else:
            existing.region = region
            existing.copies = copies
            existing.contact = contact
            existing.status = status


SEEDED_ADMIN_SHIPMENTS = [
    {
        "shipment_id": "OPS-20260811-01",
        "label": "Reader and hotel mix · Belgium North",
        "route": "Belgium North cluster",
        "scope": "8 stops / 320 copies",
        "status": "In dispatch",
        "eta": "August 11, 2026 · 8:15 AM",
    },
    {
        "shipment_id": "OPS-20260811-02",
        "label": "Business branch run · Germany West",
        "route": "Germany West corridor",
        "scope": "6 stops / 420 copies",
        "status": "Delay flagged",
        "eta": "August 11, 2026 · 9:05 AM",
    },
    {
        "shipment_id": "OPS-20260811-03",
        "label": "Subscriber route · Brussels central",
        "route": "Brussels central corridor",
        "scope": "5 stops / 110 copies",
        "status": "Delivered",
        "eta": "August 11, 2026 · 7:58 AM",
    },
    {
        "shipment_id": "OPS-20260825-04",
        "label": "Cross-border prep · Berlin and Cologne",
        "route": "Germany East prep",
        "scope": "5 stops / 260 copies",
        "status": "Preparing",
        "eta": "August 25, 2026 · Pre-release",
    },
]

SEEDED_BUSINESS_SHIPMENTS = [
    {
        "shipment_id": "BIZ-20260811-A",
        "label": "Atlas Hotels Belgium",
        "route": "Belgium North cluster",
        "scope": "3 sites / 180 copies",
        "status": "In dispatch",
        "eta": "August 11, 2026 · 8:10 AM",
    },
    {
        "shipment_id": "BIZ-20260811-B",
        "label": "Meridian Trade Offices",
        "route": "Brussels central corridor",
        "scope": "2 sites / 95 copies",
        "status": "Delivered",
        "eta": "August 11, 2026 · 8:02 AM",
    },
    {
        "shipment_id": "BIZ-20260825-A",
        "label": "Rhine Partner Lounges",
        "route": "Germany West corridor",
        "scope": "2 sites / 140 copies",
        "status": "Preparing",
        "eta": "August 25, 2026 · 7:45 AM",
    },
    {
        "shipment_id": "BIZ-20260825-B",
        "label": "Embassy reception network",
        "route": "Belgium embassy route",
        "scope": "2 sites / 60 copies",
        "status": "Address review",
        "eta": "August 25, 2026 · Pending confirmation",
    },
]

SEEDED_SHIPMENT_ACTIVITY = [
    {
        "shipment_id": "BIZ-20260811-A",
        "event": "Antwerp hotel receiving confirmed",
        "status": "Confirmed",
        "tone": "success",
        "date": "August 11, 2026 · 8:18 AM",
    },
    {
        "shipment_id": "BIZ-20260825-B",
        "event": "Embassy reception contact check requested",
        "status": "Review",
        "tone": "warning",
        "date": "August 10, 2026 · 4:20 PM",
    },
    {
        "shipment_id": "BIZ-20260825-A",
        "event": "Cologne branch manifest updated",
        "status": "Updated",
        "tone": "info",
        "date": "August 9, 2026 · 2:05 PM",
    },
    {
        "shipment_id": "BIZ-20260825-A",
        "event": "Next business route grouped for regional release",
        "status": "Queued",
        "tone": "neutral",
        "date": "August 8, 2026 · 10:40 AM",
    },
    {
        "shipment_id": "OPS-20260811-02",
        "event": "Germany West delay escalation assigned to fleet desk",
        "status": "Escalated",
        "tone": "warning",
        "date": "August 11, 2026 · 8:10 AM",
    },
    {
        "shipment_id": "OPS-20260811-03",
        "event": "Brussels central subscriber route confirmed",
        "status": "Confirmed",
        "tone": "success",
        "date": "August 11, 2026 · 7:58 AM",
    },
    {
        "shipment_id": "OPS-20260825-04",
        "event": "Berlin prep manifest synced for next release window",
        "status": "Updated",
        "tone": "info",
        "date": "August 10, 2026 · 5:15 PM",
    },
    {
        "shipment_id": "OPS-20260811-01",
        "event": "Hospitality route stop count adjusted after receiving update",
        "status": "Queued",
        "tone": "neutral",
        "date": "August 10, 2026 · 4:05 PM",
    },
]


def _upsert_shipments():
    """Seed shipment runs and their activity events.

    Admin shipments have no company owner (platform-wide runs); business
    shipments belong to the demo lead org. Idempotent per (owner, shipment_id).
    """
    account = CompanyAccount.query.filter_by(
        company=SEEDED_COMPANY_LEAD["company"]
    ).first()

    def upsert_run(seed, company_account_id):
        existing = Shipment.query.filter_by(
            shipment_id=seed["shipment_id"]
        ).first()
        if existing is None:
            run = Shipment(
                company_account_id=company_account_id,
                shipment_id=seed["shipment_id"],
                label=seed["label"],
                route=seed["route"],
                scope=seed["scope"],
                status=seed["status"],
                eta=seed["eta"],
                created_at=SEED_COMPANY_BASE_CREATED,
            )
            db.session.add(run)
            db.session.flush()
            return run
        existing.company_account_id = company_account_id
        existing.label = seed["label"]
        existing.route = seed["route"]
        existing.scope = seed["scope"]
        existing.status = seed["status"]
        existing.eta = seed["eta"]
        return existing

    for seed in SEEDED_ADMIN_SHIPMENTS:
        upsert_run(seed, None)

    if account is not None:
        for seed in SEEDED_BUSINESS_SHIPMENTS:
            upsert_run(seed, account.id)

    for activity_seed in SEEDED_SHIPMENT_ACTIVITY:
        run = Shipment.query.filter_by(
            shipment_id=activity_seed["shipment_id"]
        ).first()
        if run is None:
            continue
        existing = ShipmentActivity.query.filter_by(
            shipment_id=run.id, event=activity_seed["event"]
        ).first()
        if existing is None:
            db.session.add(
                ShipmentActivity(
                    shipment_id=run.id,
                    event=activity_seed["event"],
                    status=activity_seed["status"],
                    tone=activity_seed["tone"],
                    date=activity_seed["date"],
                    created_at=SEED_COMPANY_BASE_CREATED,
                )
            )
        else:
            existing.status = activity_seed["status"]
            existing.tone = activity_seed["tone"]
            existing.date = activity_seed["date"]


def _upsert_business_orders():
    """Seed recurring order plans for the demo lead org account.

    Mirrors ``businessOrderRows`` from ``demoData.js``. Idempotent per
    (account, order name).
    """
    account = CompanyAccount.query.filter_by(
        company=SEEDED_COMPANY_LEAD["company"]
    ).first()
    if account is None:
        return

    seeded = [
        ("Belgium headquarters pack", "140 copies", "Biweekly", "2 sites", "Active", "August 25, 2026"),
        ("Germany branch circulation", "190 copies", "Biweekly", "3 sites", "Adjusted", "August 25, 2026"),
        ("Hospitality reception bundle", "95 copies", "Biweekly", "2 sites", "Review", "Awaiting contact confirmation"),
        ("Embassy partner drop", "50 copies", "Biweekly", "2 sites", "Queued", "Next cycle after review"),
    ]
    for order, copies, cadence, sites, status, next_window in seeded:
        existing = BusinessOrder.query.filter_by(
            company_account_id=account.id, order=order
        ).first()
        if existing is None:
            db.session.add(
                BusinessOrder(
                    company_account_id=account.id,
                    order=order,
                    copies=copies,
                    cadence=cadence,
                    sites=sites,
                    status=status,
                    next_window=next_window,
                    created_at=SEED_COMPANY_BASE_CREATED,
                )
            )
        else:
            existing.copies = copies
            existing.cadence = cadence
            existing.sites = sites
            existing.status = status
            existing.next_window = next_window


def _upsert_business_invoices():
    """Seed the demo lead org account invoices from real billing sources.

    Instead of static demo rows, invoices are reconciled from the account's
    approved bulk orders (confirmed final price) and the owner's active
    business subscription, so the invoices surface is a projection of the live
    order book and contract. Idempotent via the source link.
    """
    account = CompanyAccount.query.filter_by(
        company=SEEDED_COMPANY_LEAD["company"]
    ).first()
    if account is None:
        return
    reconcile_account_invoices(account)


def _upsert_business_team_members():
    """Seed the access roster for the demo lead org account.

    Mirrors ``businessTeamRows`` from ``demoData.js`` so the team page and the
    pending-invite badge are populated after a fresh seed. Idempotent per
    (account, name).
    """
    account = CompanyAccount.query.filter_by(
        company=SEEDED_COMPANY_LEAD["company"]
    ).first()
    if account is None:
        return

    seeded = [
        ("Sajibur Rahman", "Account owner", "Commercial + oversight", "Active"),
        ("Lina Van Hove", "Finance lead", "Invoices + VAT follow-up", "Active"),
        ("Marco Stein", "Receiving coordinator", "Belgium North cluster", "Active"),
        ("Embassy desk invite", "Receiving contact", "Embassy reception route", "Pending"),
    ]
    for index, (name, role, scope, status) in enumerate(seeded):
        existing = BusinessTeamMember.query.filter_by(
            company_account_id=account.id, name=name
        ).first()
        created_at = SEED_COMPANY_BASE_CREATED + timedelta(days=index)
        if existing is None:
            db.session.add(
                BusinessTeamMember(
                    company_account_id=account.id,
                    name=name,
                    role=role,
                    scope=scope,
                    status=status,
                    created_at=created_at,
                )
            )
        else:
            existing.role = role
            existing.scope = scope
            existing.status = status
            existing.created_at = created_at


def _upsert_governance_requests():
    """Seed reader and company governance requests for the admin queue.

    Mirrors the demo rows created by ``ensureSeedData`` in ``appClient.js`` so
    the privacy panels and the admin governance queue are populated after a
    fresh seed. Idempotent per (user, scope, type). Extra rows exercise all
    queue statuses (Queued, In progress, Under review, Review required,
    Completed).
    """
    by_email = {}
    for user in User.query.all():
        by_email[user.email] = user
    reader = by_email.get("viewer@nekedem.local")
    reader2 = by_email.get("amelie.laurent@nekedem.local")
    business = by_email.get("org1@nekedem.local")
    account = CompanyAccount.query.filter_by(
        company=SEEDED_COMPANY_LEAD["company"]
    ).first()
    declined_account = CompanyAccount.query.filter_by(
        company="Horn of Africa Logistics"
    ).first()

    seeded = [
        {
            "user": reader,
            "account": None,
            "scope": "reader",
            "type": "Data export",
            "status": "Queued",
            "notes": (
                "Full account and subscription export requested from the "
                "reader privacy workspace."
            ),
        },
        {
            "user": reader,
            "account": None,
            "scope": "reader",
            "type": "Deletion review",
            "status": "Review required",
            "notes": (
                "Reader deletion request flagged because billing obligations "
                "are still open."
            ),
        },
        {
            "user": reader2,
            "account": None,
            "scope": "reader",
            "type": "Data export",
            "status": "In progress",
            "notes": (
                "Export assembled; awaiting the reader's email confirmation."
            ),
        },
        {
            "user": business,
            "account": account,
            "scope": "company",
            "type": "Company deletion review",
            "status": "Review required",
            "notes": (
                "Business account retention review requested under the "
                "company privacy workflow."
            ),
        },
        {
            "user": business,
            "account": account,
            "scope": "company",
            "type": "Company data export",
            "status": "Queued",
            "notes": (
                "Ordering and shipment history export requested by the "
                "account owner."
            ),
        },
        {
            "user": by_email.get("org3@nekedem.local"),
            "account": declined_account,
            "scope": "company",
            "type": "Company deletion review",
            "status": "Completed",
            "notes": (
                "Account archived after the licence decline was confirmed."
            ),
            "resolved": True,
        },
        {
            "user": by_email.get("petra.holst@nekedem.local"),
            "account": None,
            "scope": "reader",
            "type": "Deletion review",
            "status": "Completed",
            "notes": "Subscription closed and reader data scheduled for erasure.",
            "resolved": True,
        },
    ]

    for seed in seeded:
        if seed["user"] is None:
            continue
        company_account_id = (
            seed["account"].id if seed["account"] is not None else None
        )
        existing = GovernanceRequest.query.filter_by(
            user_id=seed["user"].id,
            scope=seed["scope"],
            type=seed["type"],
        ).first()
        resolved_at = (
            SEED_COMPANY_REVIEWED_AT if seed.get("resolved") else None
        )
        if existing is None:
            db.session.add(
                GovernanceRequest(
                    user_id=seed["user"].id,
                    company_account_id=company_account_id,
                    scope=seed["scope"],
                    type=seed["type"],
                    status=seed["status"],
                    notes=seed["notes"],
                    resolved_at=resolved_at,
                    created_at=SEED_COMPANY_BASE_CREATED,
                )
            )
        else:
            existing.company_account_id = company_account_id
            existing.status = seed["status"]
            existing.notes = seed["notes"]
            existing.resolved_at = resolved_at


# Admin-customizable legal page content. Each entry is the seed specification
# for the matching `legal_pages` row; the admin editor writes the same shape on
# update and can restore these values with the reset action. Mirrors the legal
# site pages in the public UI. Content is ASCII-safe for the MySQL connection.
SEEDED_LEGAL_PAGES = {
    "terms": {
        "eyebrow": "Terms and Service Rules",
        "title": "The service terms should match how subscriptions, delivery, and access really behave.",
        "intro": "",
        "last_updated": "August 10, 2026",
        "published": True,
        "sections": [
            {
                "heading": "Subscription billing",
                "body": "Individual reader subscriptions are offered on monthly or yearly billing cycles. Business accounts may instead use negotiated or invoice-based billing arrangements.",
            },
            {
                "heading": "Delivery cadence",
                "body": "Billing frequency does not control newspaper arrival frequency. Active print subscribers follow the fixed two-week delivery cadence described in the product proposal.",
            },
            {
                "heading": "Access timing",
                "body": "Recent articles are reserved for active subscribers, while public readers gain access once the content moves beyond the 30-day delay window.",
            },
            {
                "heading": "Account responsibilities",
                "body": "Subscribers are responsible for keeping contact and delivery details accurate so billing and shipment routing can function correctly.",
            },
            {
                "heading": "Business orders and pricing",
                "body": "Business ordering may involve bulk copy counts, separate invoice handling, and volume-based pricing rules that differ from individual reader plans.",
            },
            {
                "heading": "Content use",
                "body": "Editorial content remains protected by copyright and may not be reproduced or redistributed commercially without permission.",
            },
        ],
        "clauses": [],
        "contacts": [
            {"label": "Support", "email": "support@newsletter.local"},
            {"label": "Billing", "email": "billing@newsletter.local"},
        ],
    },
    "privacy": {
        "eyebrow": "Privacy and Data Use",
        "title": "Privacy needs to explain billing, delivery, and consent together.",
        "intro": "",
        "last_updated": "August 11, 2026",
        "published": True,
        "sections": [
            {
                "heading": "Data collected at sign-up",
                "body": "The platform needs name, contact details, delivery address, account type, and payment references so it can create the correct subscription, delivery, and billing records.",
            },
            {
                "heading": "Why delivery addresses matter",
                "body": "Delivery addresses are used to determine shipment routing and may be shared with the courier or fleet-integrated logistics workflow that powers physical newspaper delivery.",
            },
            {
                "heading": "How payments stay safer",
                "body": "Raw card numbers should not be stored in the platform database. Payment details are expected to be captured and vaulted by a PCI-compliant processor, with the platform retaining only a reference token.",
            },
            {
                "heading": "How consent should be presented",
                "body": "Consent needs to be explicit at sign-up, especially when personal data supports billing, account management, and delivery coordination across Belgium and Germany.",
            },
        ],
        "clauses": [
            {
                "heading": "GDPR rights",
                "items": [
                    "Access the personal data stored for your account.",
                    "Request export of your account and subscription-related data.",
                    "Request deletion or retention review where legal and operational obligations allow it.",
                    "Understand when address data is shared with logistics or payment partners.",
                ],
            },
            {
                "heading": "Retention and deletion",
                "items": [
                    "Account and subscription records should be retained only as long as operational, legal, and billing obligations require.",
                    "Delivery and shipment history may need limited retention to resolve disputes, missed deliveries, or account support issues.",
                    "Business-account invoicing records may require longer retention than ordinary reader marketing preferences.",
                ],
            },
        ],
        "contacts": [
            {"label": "Privacy", "email": "privacy@newsletter.local"},
            {"label": "Support", "email": "support@newsletter.local"},
        ],
    },
    "refund": {
        "eyebrow": "Refund Policy",
        "title": "Subscriptions are billed as described and refunds follow the plan rules.",
        "intro": "This Refund Policy explains when subscription charges can be refunded and how a refund request is handled once a charge has been made.",
        "last_updated": "September 1, 2026",
        "published": True,
        "sections": [
            {
                "heading": "Cancellation before renewal",
                "body": "Monthly subscriptions renew automatically unless they are cancelled at least 48 hours before the next renewal date. A cancellation received before that window prevents the next charge, so no refund is needed for that cycle.",
            },
            {
                "heading": "30-day annual window",
                "body": "Annual subscriptions may be cancelled for a prorated refund within the first 30 days of a new annual term, minus any print copies already dispatched for the current cycle.",
            },
            {
                "heading": "Print delivery issues",
                "body": "If a print edition is reported as not delivered and the delivery partner confirms the miss, the affected cycle can be credited or refunded on request. Shipping and handling costs are not refundable.",
            },
            {
                "heading": "Digital access correction",
                "body": "Charges made in error, duplicate charges, or charges for an account that never gained access can be refunded in full when reported within 14 days.",
            },
            {
                "heading": "How refunds are paid",
                "body": "Approved refunds are returned to the original payment method within 10 business days and confirmed by email to the billing address on the account.",
            },
        ],
        "clauses": [
            {
                "heading": "Refund scenarios",
                "items": [
                    "Monthly cycle cancelled before the 48-hour window: no charge, no refund.",
                    "Annual cancellation in the first 30 days: prorated refund.",
                    "Missed print delivery verified by the delivery partner: cycle credit or refund.",
                    "Duplicate or mistaken charge: full refund within 14 days.",
                    "Approved refunds paid to the original method within 10 business days.",
                ],
            },
            {
                "heading": "Not covered",
                "items": [
                    "Partial print cycles already dispatched.",
                    "Reinstating a cancelled subscription without a new charge.",
                    "Third-party or voucher purchases made outside the platform.",
                ],
            },
        ],
        "contacts": [
            {"label": "Billing", "email": "billing@newsletter.local"},
            {"label": "Support", "email": "support@newsletter.local"},
        ],
    },
    "cookies": {
        "eyebrow": "Cookies Policy",
        "title": "Cookies and similar technologies keep the site working and optional tools optional.",
        "intro": "This Cookies Policy explains the cookies and similar technologies used on the site, what they are for, and the choices you have.",
        "last_updated": "September 20, 2026",
        "published": True,
        "sections": [
            {
                "heading": "Strictly necessary",
                "body": "These cookies are required for core functions such as sign-in, checking out, and keeping your session stable. They cannot be switched off.",
            },
            {
                "heading": "Preferences",
                "body": "These cookies remember settings like language, chosen edition, and consent choices so the site behaves consistently across visits.",
            },
            {
                "heading": "Analytics",
                "body": "Anonymous usage cookies help measure how articles, editions, and the checkout are used so the newsroom can improve the product. No personal data is required for these counts.",
            },
            {
                "heading": "Marketing and measurement",
                "body": "Optional cookies support campaign measurement and audience analysis. They are only set when you accept non-essential cookies.",
            },
        ],
        "clauses": [
            {
                "heading": "Your choices",
                "items": [
                    "Essential cookies cannot be disabled without blocking parts of the service.",
                    "Preference and analytics cookies can be withdrawn from the consent settings.",
                    "Marketing cookies are off by default.",
                    "Refresh after changing choices so the decision applies on the next visit.",
                ],
            },
            {
                "heading": "Managing cookies in your browser",
                "items": [
                    "Browser settings can block or delete individual cookies.",
                    "Blocking essential cookies may stop sign-in and checkout from working.",
                    "Most browsers apply cookie changes to new sessions.",
                ],
            },
        ],
        "contacts": [
            {"label": "Privacy", "email": "privacy@newsletter.local"},
            {"label": "Support", "email": "support@newsletter.local"},
        ],
    },
}


def _upsert_legal_pages():
    """Seed (or restore) the four admin-customizable legal pages.

    Idempotent per key: rows are recreated to the spec each seed, mirroring how
    ``flask seed`` restores plans and users. Admin edits persist between seeds
    and are only reset by the admin reset action or a fresh ``flask seed``.
    """
    for page_key, seed in SEEDED_LEGAL_PAGES.items():
        page = db.session.get(LegalPage, page_key)
        if page is None:
            db.session.add(LegalPage(id=page_key, **seed))
        else:
            for key, value in seed.items():
                setattr(page, key, value)


def _upsert_site_settings():
    """Seed the admin-customizable site settings with their defaults.

    The user-guide video falls back server-side to the same hard-coded default
    when no row exists, so a clean reseed keeps behaviour identical while still
    giving the admin editor a row to reset against.
    """
    default_video = "https://www.youtube.com/watch?v=maxhtw0ncsc"
    key = "user_guide_video"
    row = db.session.get(SiteSetting, key)
    if row is None:
        db.session.add(SiteSetting(key=key, value=default_video))
    else:
        row.value = default_video
        row.updated_at = datetime.now()


SEEDED_CHECKOUT_SESSIONS = [
    {
        "email": "viewer@nekedem.local",
        "plan_id": "print-digital",
        "billing_cycle": "monthly",
        "amount": 24.99,
        "status": "succeeded",
        "payment_status": "succeeded",
        "customer_name": "Elena Tewelde",
        "customer_email": "viewer@nekedem.local",
        "payment_method": "card",
        "card_brand": "visa",
        "last4": "4242",
        "delivery": {
            "street": "Rue de la Presse 12",
            "city": "Brussels",
            "postal_code": "1000",
            "country": "Belgium",
        },
        "consents": {"delivery": True, "newsletter": True},
        "days_ago": 45,
    },
    {
        "email": "viewer@nekedem.local",
        "plan_id": "print-digital",
        "billing_cycle": "yearly",
        "amount": 299.88,
        "status": "open",
        "payment_status": "requires_confirmation",
        "customer_name": "Elena Tewelde",
        "customer_email": "viewer@nekedem.local",
        "payment_method": "paypal",
        "paypal_email": "elena.t@example.com",
        "delivery": {
            "street": "Rue de la Presse 12",
            "city": "Brussels",
            "postal_code": "1000",
            "country": "Belgium",
        },
        "consents": {"delivery": True, "newsletter": True},
        "days_ago": 2,
    },
    {
        "email": "marta.kovacs@nekedem.local",
        "plan_id": "digital",
        "billing_cycle": "monthly",
        "amount": 9.99,
        "status": "succeeded",
        "payment_status": "succeeded",
        "customer_name": "Marta Kovacs",
        "customer_email": "marta.kovacs@nekedem.local",
        "payment_method": "card",
        "card_brand": "mastercard",
        "last4": "5555",
        "delivery": {},
        "consents": {"delivery": False, "newsletter": True},
        "days_ago": 60,
    },
    {
        "email": "petra.holst@nekedem.local",
        "plan_id": "digital",
        "billing_cycle": "monthly",
        "amount": 9.99,
        "status": "cancelled",
        "payment_status": "cancelled",
        "customer_name": "Petra Holst",
        "customer_email": "petra.holst@nekedem.local",
        "payment_method": "card",
        "card_brand": "visa",
        "last4": "1111",
        "delivery": {},
        "consents": {"delivery": False, "newsletter": False},
        "days_ago": 120,
    },
    {
        "email": "lucas.mertens@nekedem.local",
        "plan_id": "digital",
        "billing_cycle": "monthly",
        "amount": 9.99,
        "status": "expired",
        "payment_status": "requires_payment_method",
        "customer_name": "Lucas Mertens",
        "customer_email": "lucas.mertens@nekedem.local",
        "payment_method": "card",
        "card_brand": "",
        "last4": "",
        "delivery": {},
        "consents": {"delivery": False, "newsletter": False},
        "days_ago": 180,
    },
]


def _upsert_checkout_sessions():
    """Seed reader checkout sessions across every session status.

    Succeeded, open, cancelled, and expired rows give the checkout history a
    realistic spread. Idempotent per (user, status, plan, amount): rows are
    recreated to the spec each seed so a reset returns the exact demo set.
    """
    from datetime import timezone

    now = datetime.now(timezone.utc)
    for seed in SEEDED_CHECKOUT_SESSIONS:
        user = User.query.filter_by(email=seed["email"]).first()
        if user is None:
            continue
        created_at = now - timedelta(days=seed["days_ago"])
        expires_at = (
            created_at + timedelta(minutes=120) if seed["status"] == "open" else created_at
        )
        confirmed_at = created_at if seed["status"] == "succeeded" else None
        session_row = CheckoutSession.query.filter_by(
            user_id=user.id,
            plan_id=seed["plan_id"],
            status=seed["status"],
            billing_cycle=seed["billing_cycle"],
            amount=seed["amount"],
        ).first()
        values = {
            "user_id": user.id,
            "plan_id": seed["plan_id"],
            "billing_cycle": seed["billing_cycle"],
            "amount": seed["amount"],
            "status": seed["status"],
            "payment_status": seed["payment_status"],
            "customer_name": seed["customer_name"],
            "customer_email": seed["customer_email"],
            "payment_method": seed["payment_method"],
            "card_brand": seed.get("card_brand", ""),
            "last4": seed.get("last4", ""),
            "paypal_email": seed.get("paypal_email", ""),
            "delivery": seed["delivery"],
            "consents": seed["consents"],
        }
        if session_row is None:
            db.session.add(
                CheckoutSession(
                    **values,
                    created_at=created_at,
                    expires_at=expires_at,
                    confirmed_at=confirmed_at,
                )
            )
        else:
            for key, value in values.items():
                setattr(session_row, key, value)
            session_row.created_at = created_at
            session_row.expires_at = expires_at
            session_row.confirmed_at = confirmed_at


def seed_data():
    _upsert_plans()
    _upsert_users()
    _upsert_subscribers()
    _upsert_reader_deliveries()
    _upsert_reading_history()
    _upsert_reader_billing()
    _upsert_templates()
    _upsert_categories()
    _upsert_articles()
    _upsert_companies()
    _upsert_company_orders()
    _upsert_locations()
    _upsert_shipments()
    _upsert_business_orders()
    _upsert_business_invoices()
    _upsert_business_team_members()
    _upsert_governance_requests()
    _upsert_legal_pages()
    _upsert_site_settings()
    _upsert_checkout_sessions()
    db.session.commit()


@click.command("seed")
@click.option(
    "--reset",
    is_flag=True,
    help="Delete all application data first, then reseed from scratch.",
)
@with_appcontext
def seed_command(reset):
    """Seed demo plans, users, articles, companies, and business data."""
    if reset:
        _reset_data()
    seed_data()
    print("Seed complete. Demo accounts:")
    for user_data in SEEDED_USERS:
        sub = user_data["subscription"]
        plan = sub["plan_id"] if sub else "(none)"
        print(
            f"  - {user_data['role']:<8} {user_data['email']:<32} "
            f"{user_data['password']:<16} plan={plan}"
        )
    print("Seeded demo subscribers:")
    for subscriber in SEEDED_SUBSCRIBERS:
        print(
            f"  - reader   {subscriber['email']:<32} "
            f"{subscriber['password']:<16} plan={subscriber['plan_id']} "
            f"status={subscriber['status']}"
        )
    print("Registered article templates:")
    for template_data in SEEDED_TEMPLATES:
        print(
            f"  - {template_data['key']:<16} {template_data['label']:<12} "
            f"active={template_data['active']} sort={template_data['sort_order']}"
        )
    print("Seeded categories:")
    for category_data in SEEDED_CATEGORIES:
        print(
            f"  - {category_data['label']:<22} template={category_data['template_key']:<9} "
            f"subcategories={len(category_data['subcategories'])}"
        )
    print("Seeded articles:")
    for article_data in SEEDED_ARTICLES:
        print(
            f"  - {article_data['status']:<10} {article_data['source']:<9} "
            f"clicks={article_data['clicks']:<4} {article_data['headline']}"
        )
    print("Seeded company accounts:")
    for company_data in SEEDED_COMPANY_ACCOUNTS:
        print(
            f"  - {company_data['status']:<24} {company_data['volume']:<22} "
            f"{company_data['company']}"
        )
    print(
        f"  - {'License approved':<24} {'--':<22} "
        f"{SEEDED_COMPANY_LEAD['company']} (lead)"
    )
    for company_data in SEEDED_COMPANY_PENDING:
        print(
            f"  - {company_data['status']:<24} {company_data['volume']:<22} "
            f"{company_data['company']}"
        )
    print("Seeded shipment runs and activity:")
    print(
        f"  - {len(SEEDED_ADMIN_SHIPMENTS)} admin runs, "
        f"{len(SEEDED_BUSINESS_SHIPMENTS)} business runs, "
        f"{len(SEEDED_SHIPMENT_ACTIVITY)} activity events"
    )
    print("Seeded reader print deliveries:")
    print(
        f"  - {1 + len(READER_DELIVERY_HISTORY)} deliveries x "
        f"{len(READER_DELIVERY_EMAILS)} print readers "
        f"({len(READER_DELIVERY_TIMELINE)} timeline events each)"
    )
    print("Seeded reader reading history:")
    print(
        f"  - {len(READING_HISTORY_SEEDS)} story rows x "
        f"{len(READING_HISTORY_EMAILS)} readers"
    )
    print("Seeded reader billing events:")
    print(
        f"  - {len(READER_BILLING_SEEDS)} billing events x "
        f"{len(READER_BILLING_EMAILS)} readers"
    )
    print("Seeded business order plans and invoices:")
    print("  - 4 order plans, 4 invoices (lead org account)")
    print("Seeded business team roster:")
    print("  - 4 seats (3 active, 1 pending) for the lead org account")
    print("Seeded governance requests:")
    print("  - reader + company requests across the admin queue")
    print("Seeded legal pages:")
    for page_key in sorted(SEEDED_LEGAL_PAGES):
        seed = SEEDED_LEGAL_PAGES[page_key]
        print(
            f"  - {page_key:<10} published={seed['published']} "
            f"sections={len(seed['sections'])} clauses={len(seed['clauses'])}"
        )
    print("Seeded admin site settings:")
    print("  - user_guide_video (default YouTube guide)")
    print("Seeded checkout sessions:")
    print(f"  - {len(SEEDED_CHECKOUT_SESSIONS)} sessions across all statuses")


def _reset_data():
    """Drop every seeded row in dependency-safe order for a clean reseed.

    Child rows (history, activities, subscriptions) are removed before their
    parents (users, companies, articles) so the wipe respects any foreign keys.
    """
    try:
        db.session.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
    except Exception:
        pass
    ordered = [
        ReadingHistoryEntry,
        ReaderBillingEntry,
        ReaderDeliveryActivity,
        ReaderDelivery,
        ShipmentActivity,
        Shipment,
        BusinessTeamMember,
        BusinessInvoice,
        BusinessOrder,
        BusinessLocation,
        CompanyOrder,
        GovernanceRequest,
        CheckoutSession,
        UserSubscription,
        CompanyAccount,
        User,
        Article,
        Subcategory,
        Category,
        LegalPage,
        ArticleTemplate,
        SubscriptionPlan,
        SiteSetting,
    ]
    for model in ordered:
        db.session.query(model).delete()
    try:
        db.session.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
    except Exception:
        pass
    db.session.commit()
    print("Existing application data cleared.")
