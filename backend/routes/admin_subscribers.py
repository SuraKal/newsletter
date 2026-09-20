from datetime import datetime, timedelta

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from middleware.auth import role_required
from models import User, UserSubscription, db
from models.subscription import RENEWAL_WATCH_WINDOW_DAYS

admin_subscribers_bp = Blueprint(
    "admin_subscribers", __name__, url_prefix="/api/v1/admin"
)


def _format_date(value):
    if value is None:
        return "—"
    if isinstance(value, datetime):
        return f"{value.strftime('%B')} {value.day}, {value.year}"
    return str(value)


def _latest_subscription(user):
    return user.subscriptions.order_by(
        UserSubscription.started_at.desc(), UserSubscription.id.desc()
    ).first()


def _is_digital_only(plan):
    if plan is None:
        return True
    note = (plan.delivery_note or "").lower()
    if "digital only" in note:
        return True
    if "print" in note:
        return False
    plan_id = (plan.id or "").lower()
    return "digital" in plan_id and "print" not in plan_id


def _delivery_eligibility(user, subscription):
    if subscription is None or subscription.status != "active":
        return "Payment hold"
    if _is_digital_only(subscription.plan):
        return "Digital only"
    if not user.delivery_data_consent:
        return "Address review"
    return "Eligible"


def _renewal_due(subscription):
    if subscription is None or subscription.status != "active":
        return True
    if subscription.renewal_at is None:
        return False
    days = (subscription.renewal_at - datetime.utcnow()).days
    return days <= RENEWAL_WATCH_WINDOW_DAYS


def _subscriber_status(eligibility, subscription):
    if eligibility == "Address review":
        return "Needs review"
    if eligibility == "Payment hold" or _renewal_due(subscription):
        return "Renewal watch"
    return "Active"


def _tone(status, eligibility):
    if status == "Active":
        return "info" if eligibility == "Digital only" else "success"
    if status in ("Needs review", "Renewal watch"):
        return "warning"
    return "neutral"


def _plan_label(subscription):
    if subscription is None or subscription.plan is None:
        return "—"
    cycle = "Yearly" if subscription.billing_cycle == "yearly" else "Monthly"
    return f"{subscription.plan.name} · {cycle}"


def _subscriber_row(user):
    subscription = _latest_subscription(user)
    eligibility = _delivery_eligibility(user, subscription)
    status = _subscriber_status(eligibility, subscription)
    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "plan": _plan_label(subscription),
        "planId": subscription.plan_id if subscription else None,
        "billingCycle": subscription.billing_cycle if subscription else None,
        "subscriptionId": subscription.id if subscription else None,
        "renewal": _format_date(subscription.renewal_at if subscription else None),
        "deliveryEligibility": eligibility,
        "status": status,
        "tone": _tone(status, eligibility),
    }


def _reader_query():
    return User.query.filter_by(role="reader").order_by(User.name.asc(), User.id.asc())


def _activate_subscription(user, subscription):
    """Approve a subscriber or complete their renewal.

    Sets the subscription active, clears the delivery-data hold, and rolls the
    renewal forward one billing cycle only when the current renewal is due, so
    repeated activations settle to a no-op instead of drifting the date.
    """
    now = datetime.utcnow()
    subscription.status = "active"
    user.delivery_data_consent = True
    if subscription.renewal_at is None or _renewal_due(subscription):
        cycle_days = 365 if subscription.billing_cycle == "yearly" else 30
        if subscription.renewal_at is not None and subscription.renewal_at > now:
            base = subscription.renewal_at
        else:
            base = now
        subscription.renewal_at = base + timedelta(days=cycle_days)


@admin_subscribers_bp.get("/subscribers")
@jwt_required()
@role_required("admin")
def list_subscribers():
    rows = [_subscriber_row(user) for user in _reader_query().all()]
    return jsonify({"subscribers": rows}), 200


@admin_subscribers_bp.get("/subscribers/<int:user_id>")
@jwt_required()
@role_required("admin")
def get_subscriber(user_id):
    user = User.query.filter_by(id=user_id, role="reader").first()
    if user is None:
        return jsonify({"error": "Subscriber not found"}), 404
    return jsonify({"subscriber": _subscriber_row(user)}), 200


@admin_subscribers_bp.post("/subscribers/<int:user_id>/activate")
@jwt_required()
@role_required("admin")
def activate_subscriber(user_id):
    user = User.query.filter_by(id=user_id, role="reader").first()
    if user is None:
        return jsonify({"error": "Subscriber not found"}), 404

    subscription = _latest_subscription(user)
    if subscription is None:
        return jsonify({"error": "Subscriber has no subscription to activate"}), 404

    _activate_subscription(user, subscription)
    db.session.commit()
    return jsonify({"subscriber": _subscriber_row(user)}), 200
