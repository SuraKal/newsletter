from datetime import datetime

from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from models import (
    BusinessInvoice,
    BusinessOrder,
    CompanyAccount,
    CompanyOrder,
    Shipment,
    User,
    UserSubscription,
    db,
)

business_overview_bp = Blueprint(
    "business_overview", __name__, url_prefix="/api/v1"
)

# Shipment states that represent an open follow-up rather than a healthy run.
SHIPMENT_ATTENTION_STATES = {
    "Address review",
    "Delay flagged",
    "Delayed",
    "Escalated",
    "Delay watch",
}


def _current_user_id():
    return int(get_jwt_identity())


def _account_for_user(user):
    if user is None:
        return None
    account = CompanyAccount.query.filter_by(owner_user_id=user.id).first()
    if account is None:
        account = (
            CompanyAccount.query.filter(
                db.or_(
                    db.func.lower(CompanyAccount.owner_email) == user.email.lower(),
                    db.func.lower(CompanyAccount.work_email) == user.email.lower(),
                )
            )
            .order_by(CompanyAccount.created_at.desc())
            .first()
        )
    return account


def _parse_copies(value):
    digits = "".join(ch for ch in str(value or "") if ch.isdigit())
    return int(digits) if digits else 0


def _parse_iso_date(value):
    if not value:
        return None
    try:
        return datetime.strptime(str(value), "%Y-%m-%d").date()
    except ValueError:
        return None


def _format_short_date(value):
    return f"{value.strftime('%b')} {value.day}" if value else ""


def _format_long_date(value):
    return f"{value.strftime('%B')} {value.day}, {value.year}" if value else ""


def _contract_metric(user, account):
    subscription = None
    if user is not None:
        subscription = (
            UserSubscription.query.filter_by(user_id=user.id, status="active")
            .order_by(UserSubscription.started_at.desc())
            .first()
        )

    plan = subscription.plan if subscription is not None else None
    if plan is not None:
        return {
            "label": "Contract state",
            "value": plan.name,
            "detail": plan.description
            or f"{account.billing or 'Contract'} billing is active for this account.",
        }

    return {
        "label": "Contract state",
        "value": account.billing or "Custom contract",
        "detail": account.volume
        or "No recurring contract is recorded for this account yet.",
    }


def _copy_volume_metric(account):
    plans = BusinessOrder.query.filter_by(company_account_id=account.id).all()
    total = sum(_parse_copies(row.copies) for row in plans)
    if total:
        return {
            "label": "Copy volume",
            "value": f"{total} copies",
            "detail": (
                "Current recurring volume across the active order plans "
                "for this account."
            ),
        }

    orders = CompanyOrder.query.filter(
        CompanyOrder.company_account_id == account.id,
        CompanyOrder.status != "Declined",
    ).all()
    total = sum(int(row.copies or 0) for row in orders)
    return {
        "label": "Copy volume",
        "value": f"{total} copies" if total else "No volume yet",
        "detail": "Recurring volume will appear once an order plan is active.",
    }


def _next_delivery_metric(account):
    orders = CompanyOrder.query.filter(
        CompanyOrder.company_account_id == account.id,
        CompanyOrder.status != "Declined",
    ).all()
    today = datetime.utcnow().date()
    upcoming = [
        parsed
        for parsed in (_parse_iso_date(row.needed_by) for row in orders)
        if parsed is not None and parsed >= today
    ]

    if not upcoming:
        return {
            "label": "Next bulk delivery",
            "value": "None scheduled",
            "detail": "Place a bulk order to schedule the next consolidated release.",
            "accent": True,
        }

    next_date = min(upcoming)
    return {
        "label": "Next bulk delivery",
        "value": _format_short_date(next_date),
        "detail": (
            "The next consolidated business release is targeted for "
            f"{_format_long_date(next_date)}."
        ),
        "accent": True,
    }


def _invoice_status_metric(account):
    invoices = BusinessInvoice.query.filter_by(company_account_id=account.id).all()
    if not invoices:
        return {
            "label": "Invoice status",
            "value": "No invoices",
            "detail": "Consolidated invoices will appear once a billing cycle closes.",
        }

    statuses = {row.status for row in invoices}
    if "Overdue" in statuses:
        value = "Overdue"
        detail = "At least one consolidated invoice is past due and needs attention."
    elif "Review" in statuses:
        value = "Review"
        detail = "A consolidated invoice or VAT note has an open review follow-up."
    elif "Upcoming" in statuses:
        value = "Upcoming"
        detail = "The next consolidated invoice is scheduled and not yet due."
    else:
        value = "Current"
        detail = "All consolidated invoices are paid or reviewed."

    return {"label": "Invoice status", "value": value, "detail": detail}


def _shipment_health_metric(account):
    shipments = Shipment.query.filter_by(company_account_id=account.id).all()
    if not shipments:
        return {
            "label": "Shipment health",
            "value": "No active runs",
            "detail": (
                "Delivery runs will appear once bulk orders are grouped for release."
            ),
        }

    count = sum(
        1 for row in shipments if row.status in SHIPMENT_ATTENTION_STATES
    )
    if count:
        noun = "note" if count == 1 else "notes"
        return {
            "label": "Shipment health",
            "value": f"{count} review {noun}",
            "detail": (
                "Receiving-contact or route follow-ups are blocking a fully "
                "clean route release."
            ),
        }

    return {
        "label": "Shipment health",
        "value": "All routes clear",
        "detail": "No business delivery run currently has an open review note.",
    }


@business_overview_bp.get("/business/overview")
@jwt_required()
def business_overview():
    user = db.session.get(User, _current_user_id())
    account = _account_for_user(user)
    if user is None or account is None:
        return jsonify({"metrics": []}), 200

    metrics = [
        _contract_metric(user, account),
        _copy_volume_metric(account),
        _next_delivery_metric(account),
        _invoice_status_metric(account),
        _shipment_health_metric(account),
    ]
    return jsonify({"metrics": metrics}), 200
