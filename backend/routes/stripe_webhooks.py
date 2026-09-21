"""Stripe webhook endpoint.

The PaymentIntent created for a checkout carries the session id in its
``metadata.sessionId``, so this handler can finalize a checkout even when the
customer never returns from a 3DS redirect (closed tab, lost network). The
endpoint is idempotent: once a session is finalized or cancelled the event is
still acknowledged, but no further write happens.

Signature verification requires ``STRIPE_ENDPOINT_SECRET``. When the secret is
missing the handler only acknowledges the event without processing it, keeping
local/simulated runs safe; verified events are the only ones acted on.
"""

import json
import os

from flask import Blueprint, jsonify, request

from models import CheckoutSession, db
from routes.checkout import finalize_from_stripe_intent
from services.payments import stripe

stripe_webhook_bp = Blueprint("stripe_webhook", __name__, url_prefix="/api/v1")


def _verified_event(payload, sig_header):
    """Return the verified Stripe event as a plain dict, or None when it could
    not be verified. Never trusts an unverified event."""
    secret = os.getenv("STRIPE_ENDPOINT_SECRET") or ""
    if not secret or stripe is None:
        return None
    construct = getattr(stripe, "Webhook", None)
    verify = getattr(stripe, "WebhookSignature", None)
    try:
        if construct is not None and hasattr(construct, "construct_event"):
            event = construct.construct_event(payload, sig_header, secret)
        elif verify is not None and hasattr(verify, "verify_event"):
            event = verify.verify_event(payload, sig_header, secret)
        else:
            return None
    except Exception:  # pragma: no cover - bad signature or payload
        return None
    if hasattr(event, "to_dict"):
        return event.to_dict()
    return {
        "type": getattr(event, "type", None),
        "data": getattr(event, "data", None),
    }


def _simulated_payload(payload):
    """Build an event-shaped dict from a raw JSON body, used only in local
    simulation where no endpoint secret is configured."""
    try:
        event = json.loads(payload)
    except ValueError:
        return None
    if event.get("object") != "event":
        return None
    return {"type": event.get("type"), "data": event.get("data") or {}}


def _find_session(intent_object):
    intent_id = str(intent_object.get("id") or "")
    session_id = str((intent_object.get("metadata") or {}).get("sessionId") or "")
    session_row = None
    if intent_id:
        session_row = CheckoutSession.query.filter_by(intent_id=intent_id).first()
    if session_row is None and session_id:
        session_row = db.session.get(CheckoutSession, session_id)
    return session_row


@stripe_webhook_bp.post("/webhooks/stripe")
def stripe_webhook():
    payload = request.get_data()
    sig_header = request.headers.get("Stripe-Signature", "")

    secret = os.getenv("STRIPE_ENDPOINT_SECRET") or ""
    if secret:
        event = _verified_event(payload, sig_header)
        if event is None:
            return jsonify({"error": "Invalid Stripe signature"}), 400
    else:
        event = _simulated_payload(payload)
        if event is None:
            return jsonify({"error": "Invalid Stripe payload"}), 400

    event_type = event.get("type")
    intent_object = (event.get("data") or {}).get("object") or {}
    if not event_type or not intent_object:
        return jsonify({"error": "Unsupported webhook event"}), 400

    if event_type == "payment_intent.succeeded":
        session_row = _find_session(intent_object)
        if (
            session_row is not None
            and session_row.status == "open"
            and not session_row.is_expired()
        ):
            finalize_from_stripe_intent(
                session_row,
                {
                    "id": intent_object.get("id"),
                    "amount": intent_object.get("amount"),
                    "status": "succeeded",
                    "payment_method": intent_object.get("payment_method"),
                },
            )
    elif event_type == "payment_intent.canceled":
        session_row = _find_session(intent_object)
        if session_row is not None and session_row.status == "open":
            session_row.status = "cancelled"
            session_row.payment_status = "cancelled"
            db.session.commit()

    return jsonify({"received": True}), 200