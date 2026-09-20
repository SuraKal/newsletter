from datetime import datetime, timedelta

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import func

from middleware.auth import role_required
from models import (
    ReaderBillingEntry,
    ReadingHistoryEntry,
    ReaderDelivery,
    User,
    UserSubscription,
    db,
)
from routes.admin_subscribers import _format_date, _is_digital_only

reader_bp = Blueprint("reader", __name__, url_prefix="/api/v1")

# Subscription status -> (status label, access state, recovery action,
# recovery path, reading access, delivery access). The mock-only states
# (trial/paused/renewal_scheduled) have no backend row and are not modelled.
ACCESS_PRESENTATIONS = {
    "active": (
        "Active subscriber",
        "Recent reporting unlocked",
        "Manage billing",
        "/dashboard/billing",
        True,
        True,
    ),
    "past_due": (
        "Payment needs attention",
        "Recent reporting locked until payment is resolved",
        "Review payment",
        "/dashboard/billing",
        False,
        False,
    ),
    "cancelled": (
        "Subscription cancelled",
        "Public archive access only",
        "Restart subscription",
        "/subscriptions",
        False,
        False,
    ),
    "expired": (
        "Subscription expired",
        "Public archive access only",
        "Restart subscription",
        "/subscriptions",
        False,
        False,
    ),
}

NO_SUBSCRIPTION_PRESENTATION = (
    "No subscription",
    "Public archive access only",
    "Choose a reader plan",
    "/subscriptions",
    False,
    False,
)


def _latest_subscription(user):
    return user.subscriptions.order_by(
        UserSubscription.started_at.desc(), UserSubscription.id.desc()
    ).first()


def _plan_amount(plan, billing_cycle):
    if plan is None:
        return 0
    price = plan.yearly_price if billing_cycle == "yearly" else plan.monthly_price
    return float(price or 0)


def _build_snapshot(user, subscription):
    if subscription is None:
        (
            label,
            access,
            recovery_action,
            recovery_path,
            reading,
            delivery,
        ) = NO_SUBSCRIPTION_PRESENTATION
        plan_name = "No active plan"
        billing_cycle = "monthly"
        amount = 0
        next_billing = "Not scheduled"
        payment_method = "No payment method"
        next_delivery = "Not scheduled"
        delivery_mode = "No delivery scheduled"
        delivery_window = "Choose a plan to start delivery"
        is_print = False
    else:
        plan = subscription.plan
        status = subscription.status
        key = status if status in ACCESS_PRESENTATIONS else "expired"
        label, access, recovery_action, recovery_path, reading, delivery = (
            ACCESS_PRESENTATIONS[key]
        )
        plan_name = plan.name if plan is not None else "Unknown plan"
        billing_cycle = subscription.billing_cycle or "monthly"
        amount = _plan_amount(plan, billing_cycle)
        next_billing = _format_date(subscription.renewal_at)
        payment_method = (
            plan.payment_note if plan is not None and plan.payment_note else "Card on file"
        )
        is_print = plan is not None and not _is_digital_only(plan)
        delivery_mode = (
            "Print + digital"
            if is_print
            else ("Digital only" if reading else "No delivery scheduled")
        )
        if is_print and reading:
            release = _release_date()
            release_label = _format_date(release)
            next_delivery = release_label
            delivery_window = f"Next delivery window opens {release_label}"
        elif not reading:
            next_delivery = "Not scheduled"
            delivery_window = "Delivery is unavailable until the subscription is active."
        else:
            next_delivery = "Digital-only plan"
            delivery_window = "Digital access is immediate."

    address_parts = [user.city, user.country]
    location_summary = (
        ", ".join(part for part in address_parts if part) or "Delivery profile saved"
    )

    return {
        "planName": plan_name,
        "billingCycle": billing_cycle,
        "billingAmount": amount,
        "nextBillingDate": next_billing,
        "nextDeliveryDate": next_delivery,
        "paymentMethod": payment_method,
        "deliveryMode": delivery_mode,
        "deliveryWindow": delivery_window,
        "subscriptionStatus": label,
        "accessState": access,
        "recoveryAction": recovery_action,
        "recoveryPath": recovery_path,
        "hasReadingAccess": reading,
        "hasDeliveryAccess": delivery,
        "isPrintSubscriber": is_print,
        "locationSummary": location_summary,
    }


def _release_date():
    now = datetime.utcnow()
    return now + timedelta(days=7)


def _delivery_destination(user):
    return ", ".join(part for part in (user.city, user.country) if part) or "Delivery profile saved"


READING_HISTORY_ACTIONS = ("view", "share", "toggle_save")


def _history_payload(user):
    entries = (
        ReadingHistoryEntry.query.filter_by(user_id=user.id)
        .order_by(
            func.coalesce(
                ReadingHistoryEntry.last_read_at,
                ReadingHistoryEntry.last_shared_at,
                ReadingHistoryEntry.created_at,
            ).desc()
        )
        .all()
    )
    return jsonify({"history": [entry.to_dict(_format_date) for entry in entries]}), 200


@reader_bp.get("/reader/history")
@jwt_required()
@role_required("reader")
def reader_history_list():
    user = db.session.get(User, int(get_jwt_identity()))
    if user is None:
        return jsonify({"error": "User not found"}), 404
    return _history_payload(user)


@reader_bp.post("/reader/history")
@jwt_required()
@role_required("reader")
def reader_history_record():
    user = db.session.get(User, int(get_jwt_identity()))
    if user is None:
        return jsonify({"error": "User not found"}), 404

    payload = request.get_json(silent=True) or {}
    article_id = str(payload.get("articleId") or "").strip()
    if not article_id:
        return jsonify({"error": "articleId is required"}), 400
    action = str(payload.get("action") or "view").strip()
    if action not in READING_HISTORY_ACTIONS:
        return jsonify({"error": "Unsupported action"}), 400

    now = datetime.utcnow()
    entry = ReadingHistoryEntry.query.filter_by(
        user_id=user.id, article_id=article_id
    ).first()
    if entry is None:
        entry = ReadingHistoryEntry(
            user_id=user.id,
            article_id=article_id,
            title=str(payload.get("title") or "").strip(),
            category=str(payload.get("category") or "News").strip() or "News",
            created_at=now,
        )
        db.session.add(entry)
    else:
        title = str(payload.get("title") or "").strip()
        category = str(payload.get("category") or "").strip()
        if title:
            entry.title = title
        if category:
            entry.category = category

    if action == "view":
        entry.last_read_at = now
        if not entry.saved:
            entry.state = (
                "read_today" if entry.last_read_at.date() == now.date() else "read"
            )
    elif action == "share":
        entry.last_shared_at = now
        if not entry.saved:
            entry.state = "shared"
    elif action == "toggle_save":
        entry.saved = not entry.saved
        if entry.saved:
            entry.state = "saved"
        elif entry.last_shared_at:
            entry.state = "shared"
        elif entry.last_read_at:
            entry.state = (
                "read_today" if entry.last_read_at.date() == now.date() else "read"
            )
        else:
            entry.state = "viewed"

    db.session.commit()
    return _history_payload(user)


@reader_bp.get("/reader/deliveries")
@jwt_required()
@role_required("reader")
def reader_deliveries():
    user = db.session.get(User, int(get_jwt_identity()))
    if user is None:
        return jsonify({"error": "User not found"}), 404
    deliveries = (
        ReaderDelivery.query.filter_by(user_id=user.id)
        .order_by(ReaderDelivery.sort_order.asc(), ReaderDelivery.created_at.desc())
        .all()
    )
    destination = _delivery_destination(user)
    return (
        jsonify({"deliveries": [row.to_dict(destination) for row in deliveries]}),
        200,
    )


@reader_bp.get("/reader/deliveries/<string:key>")
@jwt_required()
@role_required("reader")
def reader_delivery_detail(key):
    user = db.session.get(User, int(get_jwt_identity()))
    if user is None:
        return jsonify({"error": "User not found"}), 404
    delivery = ReaderDelivery.query.filter_by(
        user_id=user.id, tracking_id=key.strip().upper()
    ).first()
    if delivery is None:
        return jsonify({"error": "Delivery not found"}), 404
    return (
        jsonify(
            {
                "delivery": delivery.to_dict(_delivery_destination(user)),
                "timeline": [item.to_dict() for item in delivery.activities],
            }
        ),
        200,
    )


@reader_bp.get("/reader/billing")
@jwt_required()
@role_required("reader")
def reader_billing_list():
    user = db.session.get(User, int(get_jwt_identity()))
    if user is None:
        return jsonify({"error": "User not found"}), 404
    entries = (
        ReaderBillingEntry.query.filter_by(user_id=user.id)
        .order_by(
            ReaderBillingEntry.event_at.desc(),
            ReaderBillingEntry.created_at.desc(),
        )
        .all()
    )
    return (
        jsonify({"entries": [entry.to_dict(_format_date) for entry in entries]}),
        200,
    )


@reader_bp.get("/reader/overview")
@jwt_required()
@role_required("reader")
def reader_overview():
    user = db.session.get(User, int(get_jwt_identity()))
    if user is None:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"snapshot": _build_snapshot(user, _latest_subscription(user))}), 200