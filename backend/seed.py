from datetime import datetime, timedelta

import click
from flask.cli import with_appcontext

from models import (
    Article,
    ArticleTemplate,
    BusinessInvoice,
    BusinessLocation,
    BusinessOrder,
    BusinessTeamMember,
    Category,
    CompanyAccount,
    CompanyOrder,
    GovernanceRequest,
    ReaderDelivery,
    ReaderDeliveryActivity,
    ReadingHistoryEntry,
    ReaderBillingEntry,
    Shipment,
    ShipmentActivity,
    SubscriptionPlan,
    Subcategory,
    User,
    UserSubscription,
    db,
)
from models.category import slugify
from models.company_order import estimate_order_price

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
        "subscription": {"plan_id": "business-regional", "billing_cycle": "yearly"},
    },
    {
        "name": "Red Sea Hospitality Co.",
        "email": "org2@nekedem.local",
        "password": "org212345",
        "role": "business",
        "account_type": "business",
        "company_name": "Red Sea Hospitality Co.",
        "subscription": {"plan_id": "business-enterprise", "billing_cycle": "yearly"},
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
        "headline": "City council approves the new harbour market plan",
        "summary": "Councillors voted 8–2 to begin the phased redevelopment of the harbour market quarter.",
        "body": "The harbour market quarter will be rebuilt in three phases starting early next year. Retailers will be relocated during construction.",
        "author": "Nael Desk",
        "editor": "Editorial desk",
        "status": "Published",
        "tone": "success",
        "access_label": "Subscriber-only",
        "read_time": "4 min",
        "source": "hero",
        "category_label": "News",
        "date": "September 11, 2026",
        "public_access_date": "October 11, 2026",
        "publish_date": "September 11, 2026",
        "publish_time": "2:00 PM",
        "clicks": 210,
        "meta": {"location": "Harbour quarter", "councilSession": "September 2026"},
    },
    {
        "headline": "Small businesses see a recovery quarter in the region",
        "summary": "Regional business groups report rising orders and new hires for the first time this year.",
        "body": "Local chambers of commerce recorded a 12% rise in new business registrations last quarter.",
        "author": "Nael Desk",
        "editor": "Editorial desk",
        "status": "Published",
        "tone": "success",
        "access_label": "Public",
        "read_time": "6 min",
        "source": "featured",
        "category_label": "Business",
        "date": "September 10, 2026",
        "public_access_date": "",
        "publish_date": "September 10, 2026",
        "publish_time": "8:30 AM",
        "clicks": 145,
        "meta": {"marketImpact": "Regional employment outlook positive"},
    },
    {
        "headline": "A weekend guide to the autumn festival opening",
        "summary": "Parades, food stalls, and evening concerts mark the opening weekend of the autumn festival.",
        "body": "The festival opens Saturday with a street parade and closes Sunday with a headline concert in the main square.",
        "author": "Nael Desk",
        "editor": "Editorial desk",
        "status": "Scheduled",
        "tone": "neutral",
        "access_label": "Public",
        "read_time": "3 min",
        "source": "latest",
        "category_label": "Events",
        "date": "",
        "public_access_date": "",
        "publish_date": "September 18, 2026",
        "publish_time": "10:00 AM",
        "clicks": 0,
        "meta": {"eventDate": "Sep 19-20, 2026", "location": "City centre"},
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


def _upsert_articles():
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
    """Seed active company accounts linked to demo business users.

    The four accounts mirror ``adminCompanyRows`` from ``demoData.js``.  Legacy
    mock statuses ("Active", "Invoice review", "Onboarding") are normalised to
    the canonical ``COMPANY_WORKFLOW_STATES`` so the admin pages can classify
    rows purely by the canonical status. The account linked to the first
    seeded business user so
    the business dashboard works out of the box after login.
    """
    business_user = User.query.filter_by(role="business").first()

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
    lead_data["owner_user_id"] = business_user.id if business_user else None
    lead_data["owner_email"] = business_user.email if business_user else None
    lead_data["work_email"] = business_user.email if business_user else None
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
                    admin.id if admin and order_seed["status"] == "Approved" else None
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
    """Seed consolidated invoice records for the demo lead org account.

    Mirrors ``businessInvoiceRows`` from ``demoData.js``. Idempotent per
    (account, invoice code).
    """
    account = CompanyAccount.query.filter_by(
        company=SEEDED_COMPANY_LEAD["company"]
    ).first()
    if account is None:
        return

    seeded = [
        ("INV-BIZ-2026-08", "August business circulation", "EUR 8,950", "Paid", "August 11, 2026"),
        ("INV-BIZ-2026-07", "July business circulation", "EUR 8,630", "Paid", "July 11, 2026"),
        ("VAT note review", "Germany branch allocation", "Pending", "Review", "August 8, 2026"),
        ("INV-BIZ-2026-09", "Projected September cycle", "EUR 9,120", "Upcoming", "September 1, 2026"),
    ]
    for invoice, scope, amount, status, date in seeded:
        existing = BusinessInvoice.query.filter_by(
            company_account_id=account.id, invoice=invoice
        ).first()
        if existing is None:
            db.session.add(
                BusinessInvoice(
                    company_account_id=account.id,
                    invoice=invoice,
                    scope=scope,
                    amount=amount,
                    status=status,
                    date=date,
                    created_at=SEED_COMPANY_BASE_CREATED,
                )
            )
        else:
            existing.scope = scope
            existing.amount = amount
            existing.status = status
            existing.date = date


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
    fresh seed. Idempotent per (user, scope, type).
    """
    reader = User.query.filter_by(email="viewer@nekedem.local").first()
    business = User.query.filter_by(role="business").first()
    account = CompanyAccount.query.filter_by(
        company=SEEDED_COMPANY_LEAD["company"]
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
        if existing is None:
            db.session.add(
                GovernanceRequest(
                    user_id=seed["user"].id,
                    company_account_id=company_account_id,
                    scope=seed["scope"],
                    type=seed["type"],
                    status=seed["status"],
                    notes=seed["notes"],
                    created_at=SEED_COMPANY_BASE_CREATED,
                )
            )
        else:
            existing.company_account_id = company_account_id
            existing.status = seed["status"]
            existing.notes = seed["notes"]


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
    db.session.commit()


@click.command("seed")
@with_appcontext
def seed_command():
    """Seed demo plans, users, and subscriptions (1 reader, 2 orgs, 1 admin)."""
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
            f"{article_data['headline']}"
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
    print("  - 1 reader data export, 1 company deletion review")
