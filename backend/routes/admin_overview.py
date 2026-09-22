from datetime import datetime

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from middleware.auth import role_required
from models import (
    Article,
    CompanyAccount,
    Shipment,
    User,
    UserSubscription,
)
from models.subscription import RENEWAL_WATCH_WINDOW_DAYS

admin_overview_bp = Blueprint("admin_overview", __name__, url_prefix="/api/v1")

# Shipment states that count as a delayed or at-risk outbound corridor.
SHIPMENT_DELAY_STATES = {"Delay flagged", "Delayed", "Escalated", "Delay watch"}


def _plural(count, singular, plural):
    return f"{count} {singular if count == 1 else plural}"


def _parse_article_date(value):
    if not value:
        return None
    try:
        return datetime.strptime(str(value), "%B %d, %Y").date()
    except ValueError:
        return None


def _published_metric():
    published = Article.query.filter_by(status="Published").all()
    total = len(published)
    today = datetime.utcnow().date()
    today_count = sum(
        1
        for row in published
        if _parse_article_date(row.publish_date or row.date) == today
    )

    if today_count:
        value = _plural(today_count, "story", "stories")
        detail = (
            "Morning and midday releases are already live across the sector desks."
        )
    elif total:
        value = _plural(total, "story", "stories")
        detail = (
            f"No new releases today; {total} published "
            f"{'story is' if total == 1 else 'stories are'} live across the "
            "sector desks."
        )
    else:
        value = "0 stories"
        detail = "No published stories are live yet."

    return {"label": "Published today", "value": value, "detail": detail}


def _scheduled_metric():
    count = Article.query.filter_by(status="Scheduled").count()
    if count:
        return {
            "label": "Scheduled queue",
            "value": _plural(count, "item", "items"),
            "detail": (
                "The current schedule includes later releases and "
                "print-linked publishing work."
            ),
        }
    return {
        "label": "Scheduled queue",
        "value": "0 items",
        "detail": "No later releases are queued in the publishing schedule.",
    }


def _subscriber_watchlist_metric():
    readers = User.query.filter_by(role="reader").all()
    now = datetime.utcnow()
    watch = 0

    for reader in readers:
        latest = (
            reader.subscriptions.order_by(
                UserSubscription.started_at.desc()
            ).first()
        )
        if latest is None or latest.status != "active":
            watch += 1
        elif latest.renewal_at and (latest.renewal_at - now).days <= (
            RENEWAL_WATCH_WINDOW_DAYS
        ):
            watch += 1

    if watch:
        detail = (
            "Renewals, delivery eligibility checks, or support reviews need "
            "attention."
        )
    else:
        detail = "No subscriber renewals or delivery eligibility checks need attention."

    return {
        "label": "Subscriber watchlist",
        "value": _plural(watch, "account", "accounts"),
        "detail": detail,
    }


def _company_accounts_metric():
    approved = CompanyAccount.query.filter_by(status="License approved").count()
    pending = CompanyAccount.query.filter_by(status="License submitted").count()

    if pending:
        detail = (
            f"{_plural(pending, 'licence', 'licences')} awaiting review; "
            f"{approved} active {'account is' if approved == 1 else 'accounts are'} live."
        )
    else:
        detail = (
            "Business onboarding and active contracts are currently spread "
            "across Belgium and Germany."
        )

    return {
        "label": "Company accounts",
        "value": f"{approved} active",
        "detail": detail,
    }


def _routes_delayed_metric():
    count = Shipment.query.filter(
        Shipment.status.in_(SHIPMENT_DELAY_STATES)
    ).count()

    if count:
        verb = "needs" if count == 1 else "need"
        detail = (
            f"Only {_plural(count, 'outbound route group', 'outbound route groups')} "
            f"{verb} escalation before the current window closes."
        )
    else:
        detail = "No outbound routes are currently delayed."

    return {
        "label": "Routes delayed",
        "value": _plural(count, "corridor", "corridors"),
        "detail": detail,
        "accent": bool(count),
    }


@admin_overview_bp.get("/admin/overview")
@jwt_required()
@role_required("admin")
def admin_overview():
    metrics = [
        _published_metric(),
        _scheduled_metric(),
        _subscriber_watchlist_metric(),
        _company_accounts_metric(),
        _routes_delayed_metric(),
    ]
    return jsonify({"metrics": metrics}), 200


@admin_overview_bp.get("/admin/overview/visibility")
@jwt_required()
@role_required("admin")
def admin_overview_visibility():
    """Article visibility feed for the overview chart.

    Returns every article with its click count so the chart can render an
    all-articles ranking or a single-article drill-down from real DB data.
    """
    articles = (
        Article.query.order_by(
            Article.clicks.desc(), Article.publish_date.desc()
        ).all()
    )
    return (
        jsonify(
            {
                "articles": [
                    {
                        "id": article.id,
                        "headline": article.headline,
                        "clicks": article.clicks or 0,
                        "status": article.status,
                    }
                    for article in articles
                ]
            }
        ),
        200,
    )
