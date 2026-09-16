from datetime import datetime, timedelta

import click
from flask.cli import with_appcontext

from models import (
    ArticleTemplate,
    Category,
    SubscriptionPlan,
    Subcategory,
    User,
    UserSubscription,
    db,
)
from models.category import slugify

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
        "subscription": {"plan_id": "digital", "billing_cycle": "monthly"},
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


def seed_data():
    _upsert_plans()
    _upsert_users()
    _upsert_templates()
    _upsert_categories()
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