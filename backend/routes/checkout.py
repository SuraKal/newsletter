import re
import secrets
from datetime import datetime, timedelta

from flask import Blueprint, jsonify, request

from models import (
    CheckoutSession,
    ReaderBillingEntry,
    SubscriptionPlan,
    User,
    UserSubscription,
    db,
)
from routes.admin_subscribers import _format_date
from services.payments import (
    card_brand_for,
    card_last4,
    gateway,
    luhn_valid,
)

checkout_bp = Blueprint("checkout", __name__, url_prefix="/api/v1")

# Supported payment methods, served by `GET /payment-methods` so the checkout
# page stops sourcing them from the demo fixture.
PAYMENT_METHODS = [
    {
        "id": "card",
        "label": "Card",
        "detail": (
            "Visa, Mastercard, and American Express accepted. Card details are "
            "collected in your browser and processed through a PCI-compliant "
            "payment provider."
        ),
    },
    {
        "id": "paypal",
        "label": "PayPal",
        "detail": (
            "Pay with your PayPal wallet and approve the recurring billing "
            "during the PayPal return."
        ),
    },
]

PRINT_PLAN_ID = "print-digital"
SESSION_TTL_MINUTES = 30

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _bad_request(message):
    return jsonify({"error": message}), 400


def _is_reader_plan(plan):
    return not str(plan.id or "").startswith("business")


def _quote_for(plan, billing_cycle):
    amount = float(
        (plan.yearly_price if billing_cycle == "yearly" else plan.monthly_price) or 0
    )
    is_print = plan.id == PRINT_PLAN_ID
    reference = datetime.utcnow()
    next_charge = reference + timedelta(
        days=365 if billing_cycle == "yearly" else 30
    )
    delivery_date = reference + timedelta(days=14)
    return {
        "amount": amount,
        "billingCycle": billing_cycle,
        "deliveryMode": (
            "Biweekly print + digital" if is_print else "Digital access only"
        ),
        "deliveryWindow": (
            f"Next delivery window opens {_format_date(delivery_date)}"
            if is_print
            else "No print shipment is scheduled for the digital-only plan."
        ),
        "nextChargeDate": _format_date(next_charge),
    }


def _extract_card(data):
    card = data.get("card") if isinstance(data, dict) else None
    if not isinstance(card, dict):
        return None, "Card details are required"
    if not str(card.get("name") or "").strip():
        return None, "Cardholder name is required"
    number = re.sub(r"\D", "", str(card.get("number") or ""))
    if not re.match(r"^\d{13,19}$", number):
        return None, "A valid card number is required"
    if not luhn_valid(number):
        return None, "The card number failed the checksum validation"
    cvc = str(card.get("cvc") or "").strip()
    if not re.match(r"^\d{3,4}$", cvc):
        return None, "A valid card security code (CVC) is required"
    try:
        exp_month = int(card.get("expMonth"))
        exp_year = int(card.get("expYear"))
    except (TypeError, ValueError):
        return None, "A valid card expiry is required"
    if exp_month < 1 or exp_month > 12 or exp_year < 1900 or exp_year > 2200:
        return None, "A valid card expiry is required"
    if (exp_year, exp_month) < (datetime.utcnow().year, datetime.utcnow().month):
        return None, "The card has expired"
    return (number, cvc, exp_month, exp_year, str(card.get("name") or "").strip()), None


def _upsert_reader(user, session, consents):
    """Persist profile + consents for the checkout customer."""
    delivery = session.delivery or {}
    profile = {
        "contact_phone": str(delivery.get("phone") or "").strip() or None,
        "delivery_address": str(delivery.get("streetAddress") or "").strip() or None,
        "city": str(delivery.get("city") or "").strip() or None,
        "postal_code": str(delivery.get("postalCode") or "").strip() or None,
        "country": str(delivery.get("country") or "").strip() or None,
    }
    for field, value in profile.items():
        if value and not getattr(user, field, None):
            setattr(user, field, value)
    if consents.get("deliverySharing") is not None:
        user.delivery_data_consent = bool(consents["deliverySharing"])
    if consents.get("newsletterOptIn") is not None:
        user.newsletter_opt_in = bool(consents["newsletterOptIn"])
    user.account_type = "individual"
    return user


def _activate_subscription(user, session_row):
    billing_cycle = session_row.billing_cycle or "monthly"
    renewal = datetime.utcnow() + timedelta(
        days=365 if billing_cycle == "yearly" else 30
    )
    UserSubscription.query.filter_by(user_id=user.id).delete()
    subscription = UserSubscription(
        user_id=user.id,
        plan_id=session_row.plan_id,
        billing_cycle=billing_cycle,
        status="active",
        started_at=datetime.utcnow(),
        renewal_at=renewal,
    )
    db.session.add(subscription)
    return subscription


@checkout_bp.get("/payment-methods")
def list_payment_methods():
    return jsonify({"methods": PAYMENT_METHODS}), 200


@checkout_bp.post("/subscriptions/checkout")
def create_checkout_session():
    data = request.get_json(silent=True) or {}
    plan_id = str(data.get("planId") or "").strip()
    billing_cycle = (
        "yearly" if str(data.get("billingCycle") or "") == "yearly" else "monthly"
    )
    plan = db.session.get(SubscriptionPlan, plan_id) if plan_id else None
    if plan is None or not _is_reader_plan(plan):
        return _bad_request("A valid reader subscription plan is required")

    payment_method = str(data.get("paymentMethod") or "card").strip().lower()
    if payment_method not in ("card", "paypal"):
        return _bad_request("A valid payment method is required")

    customer = data.get("customer") or {}
    email = str(customer.get("email") or "").strip()
    if not EMAIL_PATTERN.match(email):
        return _bad_request("A valid contact email is required")
    full_name = str(customer.get("fullName") or "").strip()
    if not full_name:
        return _bad_request("Full name is required")
    for field in ("streetAddress", "city", "postalCode", "country"):
        if not str(customer.get(field) or "").strip():
            return _bad_request(
                "The delivery address must include street, city, postal code, and country"
            )

    quote = _quote_for(plan, billing_cycle)
    intent = gateway.create_payment_intent(
        int(round(quote["amount"] * 100)),
        f"{plan.name} ({billing_cycle}) subscription",
    )

    consents = data.get("consents") or {}
    delivery = {
        "fullName": full_name,
        "email": email,
        "phone": str(customer.get("phone") or "").strip(),
        "streetAddress": str(customer.get("streetAddress") or "").strip(),
        "city": str(customer.get("city") or "").strip(),
        "postalCode": str(customer.get("postalCode") or "").strip(),
        "country": str(customer.get("country") or "").strip(),
    }

    session_row = CheckoutSession(
        plan_id=plan_id,
        billing_cycle=billing_cycle,
        amount=quote["amount"],
        currency="EUR",
        status="open",
        payment_status=intent["status"],
        payment_method=payment_method,
        customer_name=full_name,
        customer_email=email,
        delivery=delivery,
        consents={
            "recurringBilling": bool(consents.get("recurringBilling")),
            "deliverySharing": bool(consents.get("deliverySharing")),
            "newsletterOptIn": bool(consents.get("newsletterOptIn")),
        },
        quote_mode=quote["deliveryMode"],
        quote_window=quote["deliveryWindow"],
        quote_next_charge=quote["nextChargeDate"],
        intent_id=intent["id"],
        expires_at=datetime.utcnow() + timedelta(minutes=SESSION_TTL_MINUTES),
    )
    db.session.add(session_row)
    db.session.commit()

    return jsonify({"session": session_row.to_dict(_format_date)}), 201


@checkout_bp.get("/subscriptions/checkout/<string:session_id>")
def get_checkout_session(session_id):
    session_row = db.session.get(CheckoutSession, session_id)
    if session_row is None:
        return jsonify({"error": "Checkout session not found"}), 404
    if session_row.status == "open" and session_row.is_expired():
        session_row.status = "expired"
        db.session.commit()
    return jsonify({"session": session_row.to_dict(_format_date)}), 200


@checkout_bp.post("/subscriptions/checkout/<string:session_id>/confirm")
def confirm_checkout_session(session_id):
    session_row = db.session.get(CheckoutSession, session_id)
    if session_row is None:
        return jsonify({"error": "Checkout session not found"}), 404

    if session_row.status == "succeeded":
        subscription = (
            UserSubscription.query.filter_by(user_id=session_row.user_id)
            .order_by(UserSubscription.started_at.desc(), UserSubscription.id.desc())
            .first()
            if session_row.user_id
            else None
        )
        return (
            jsonify(
                {
                    "session": session_row.to_dict(_format_date),
                    "subscription": subscription.to_dict() if subscription else None,
                }
            ),
            200,
        )

    if session_row.status == "open" and session_row.is_expired():
        session_row.status = "expired"
        db.session.commit()
        return _bad_request(
            "This checkout session has expired. Please start a new checkout."
        )

    data = request.get_json(silent=True) or {}
    payment_method = session_row.payment_method or "card"
    method_label = "Card"
    method_reference = ""
    if payment_method == "paypal":
        paypal_email = str(data.get("paypalEmail") or "").strip()
        if not EMAIL_PATTERN.match(paypal_email):
            return _bad_request("A valid PayPal account email is required")
        method_label = "PayPal"
        method_reference = paypal_email
        session_row.paypal_email = paypal_email
    else:
        card, card_error = _extract_card(data)
        if card_error:
            return _bad_request(card_error)
        number, cvc, _exp_month, _exp_year, cardholder = card
        brand = card_brand_for(number)
        last4 = card_last4(number)
        session_row.card_brand = brand
        session_row.last4 = last4
        method_label = f"{brand} **** {last4}"
        method_reference = last4

    try:
        intent = gateway.confirm_payment_intent(
            session_row.intent_id or "",
            payment_method=method_label,
        )
    except ValueError:
        return _bad_request("The payment intent could not be confirmed. Please retry.")

    if intent["status"] != "succeeded":
        return jsonify({"error": "The payment was not confirmed."}), 400

    consents = session_row.consents or {}
    delivery = session_row.delivery or {}
    email = str(session_row.customer_email or "").strip()
    user = User.query.filter_by(email=email).first()
    if user is None:
        user = User(
            name=session_row.customer_name or email,
            email=email,
            role="reader",
            account_type="individual",
        )
        user.set_password(secrets.token_urlsafe(32))
        db.session.add(user)
        db.session.flush()
    else:
        user.name = session_row.customer_name or user.name

    _upsert_reader(user, session_row, consents)
    db.session.flush()

    subscription = _activate_subscription(user, session_row)
    db.session.flush()

    db.session.add(
        ReaderBillingEntry(
            user_id=user.id,
            entry_type="invoice",
            reference=f"INV-{str(session_row.id)[-8:].upper()}",
            amount=session_row.amount,
            currency=(session_row.currency or "EUR").upper(),
            method=method_label,
            status="paid",
            event_at=datetime.utcnow(),
        )
    )

    session_row.user_id = user.id
    session_row.status = "succeeded"
    session_row.payment_status = "succeeded"
    session_row.confirmed_at = datetime.utcnow()
    db.session.commit()

    return (
        jsonify(
            {
                "session": session_row.to_dict(_format_date),
                "subscription": subscription.to_dict(),
            }
        ),
        200,
    )