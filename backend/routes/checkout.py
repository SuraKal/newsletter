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
from services.payments import gateway

checkout_bp = Blueprint("checkout", __name__, url_prefix="/api/v1")

# Stripe's Payment Element owns card collection. It can support extra methods
# later through Stripe configuration; this flow intentionally starts card-only.
PAYMENT_METHODS = [
    {
        "id": "card",
        "label": "Card",
        "detail": (
            "Visa, Mastercard, and American Express accepted. Card details are "
            "collected only by Stripe's secure payment form."
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


def _complete_checkout(session_row, method_label, method_reference):
    """Provision the reader account and activate the subscription after a
    confirmed payment. Safe to call from both the confirm route and the Stripe
    webhook handler; commits and returns the active subscription."""
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
    return subscription


def finalize_from_stripe_intent(session_row, intent):
    """Validate a fetched Stripe PaymentIntent against the checkout session
    and finalize it when the amount and confirmation status match. Returns the
    active subscription, or None when the intent does not apply."""
    if intent is None or intent.get("status") != "succeeded":
        return None
    if str(intent.get("id") or "") != str(session_row.intent_id or ""):
        return None
    expected = int(round(float(session_row.amount or 0) * 100))
    if intent.get("amount") != expected:
        return None
    brand, last4 = gateway.card_details_from_payment_method(
        str(intent.get("payment_method") or "")
    )
    session_row.intent_id = str(intent.get("id") or session_row.intent_id or "")
    session_row.card_brand = brand
    session_row.last4 = last4
    method_label = f"{brand} **** {last4}" if last4 else "Card"
    return _complete_checkout(session_row, method_label, last4)


@checkout_bp.get("/payment-methods")
def list_payment_methods():
    return jsonify({"methods": PAYMENT_METHODS}), 200


@checkout_bp.get("/stripe/config")
def stripe_config():
    """Expose only Stripe's browser-safe publishable key to Stripe.js."""
    return jsonify(
        {
            "enabled": gateway.is_configured,
            "publishableKey": gateway.publishable_key if gateway.is_configured else "",
        }
    ), 200


@checkout_bp.post("/subscriptions/checkout")
def create_checkout_session():
    if not gateway.is_configured:
        return (
            jsonify(
                {
                    "error": "Stripe checkout is not configured. Add both SECRET_KEY and PUBLISHABLE_KEY to the backend environment."
                }
            ),
            503,
        )

    data = request.get_json(silent=True) or {}
    plan_id = str(data.get("planId") or "").strip()
    billing_cycle = (
        "yearly" if str(data.get("billingCycle") or "") == "yearly" else "monthly"
    )
    plan = db.session.get(SubscriptionPlan, plan_id) if plan_id else None
    if plan is None or not _is_reader_plan(plan):
        return _bad_request("A valid reader subscription plan is required")

    payment_method = str(data.get("paymentMethod") or "card").strip().lower()
    if payment_method != "card":
        return _bad_request("Card payments are processed through Stripe.")

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
    consents = data.get("consents") or {}

    # Pre-generate the session id so the PaymentIntent can carry it in its
    # metadata. The Stripe webhook uses that correlation to finalize this
    # checkout even when the browser never returns from an SCA redirect.
    session_id = f"cs_{secrets.token_hex(8)}"
    intent = gateway.create_payment_intent(
        int(round(quote["amount"] * 100)),
        f"{plan.name} ({billing_cycle}) subscription",
        metadata={"sessionId": session_id},
        receipt_email=email,
    )

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
        id=session_id,
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

    # A client secret is returned exactly once, to the browser that created
    # this PaymentIntent. It is not persisted in the checkout record or later
    # exposed through the public checkout-session lookup endpoint.
    session_payload = session_row.to_dict(_format_date)
    session_payload["clientSecret"] = intent.get("client_secret") or ""

    return (
        jsonify(
            {
                "session": session_payload
            }
        ),
        201,
    )


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
    method_label = "Card"
    method_reference = ""

    stripe_intent_id = str(data.get("paymentIntentId") or "").strip()
    if not gateway.is_configured:
        return _bad_request("Stripe is not configured on this server.")
    if stripe_intent_id != session_row.intent_id:
        return _bad_request("This payment does not belong to the checkout session.")
    intent = gateway.retrieve_payment_intent(stripe_intent_id)
    if intent is None or intent.get("status") != "succeeded":
        return jsonify({"error": "The payment was not confirmed."}), 400
    expected = int(round(float(session_row.amount or 0) * 100))
    if intent.get("amount") != expected:
        return _bad_request("The payment amount does not match this checkout.")
    brand, last4 = gateway.card_details_from_payment_method(
        str(intent.get("payment_method") or "")
    )
    session_row.card_brand = brand
    session_row.last4 = last4
    method_label = f"{brand} **** {last4}" if last4 else "Card"
    method_reference = last4

    subscription = _complete_checkout(session_row, method_label, method_reference)

    return (
        jsonify(
            {
                "session": session_row.to_dict(_format_date),
                "subscription": subscription.to_dict(),
            }
        ),
        200,
    )
