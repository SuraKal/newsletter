"""Payment gateway abstraction, prepared for a Stripe integration.

The checkout flow never sees card details as raw values: the frontend formats
the card on input, builds a simulated payment method on submit, and passes only
a masked reference (brand + last 4) to the API. Full PAN/CVC never reach the
server and are never persisted.

When ``STRIPE_SECRET_KEY`` is set and the Stripe SDK is installed the gateway
forwards intents to Stripe's API with the same objects (PaymentIntent ->
checkout-session). Otherwise a simulated gateway runs with the same shape so the
flow works end to end without external keys. All card validation lives in
``routes/checkout.py``; this module only creates/confirms an intent.
"""

import os
import re
import uuid

try:
    import stripe
except ImportError:  # pragma: no cover - Stripe SDK is optional until enabled
    stripe = None  # type: ignore[assignment]


def luhn_valid(digits):
    """True when ``digits`` (digits only) passes the Luhn checksum."""
    clean = re.sub(r"\D", "", str(digits or ""))
    if len(clean) < 12:
        return False
    total = 0
    parity = len(clean) % 2
    for index, char in enumerate(clean):
        value = int(char)
        if index % 2 == parity:
            value *= 2
            if value > 9:
                value -= 9
        total += value
    return total % 10 == 0


def card_brand_for(number):
    """Derive the network brand from the card number prefix."""
    clean = re.sub(r"\D", "", str(number or ""))
    if re.match(r"^4", clean):
        return "Visa"
    if re.match(r"^5[1-5]", clean) or re.match(r"^2[2-7]", clean):
        return "Mastercard"
    if re.match(r"^3[47]", clean):
        return "American Express"
    return "Card"


def card_last4(number):
    """Masked reference stored on the checkout/billing records."""
    return re.sub(r"\D", "", str(number or ""))[-4:]


# Simulated intents live only in memory; as soon as a Stripe key is configured
# they are created against the Stripe API instead.
_SIMULATED_INTENTS = {}


class PaymentGateway:
    """Creates and confirms payment intents.

    ``enable_stripe`` is derived from the environment: the gateway forwards to
    Stripe only when a secret key is configured and the SDK is importable.
    """

    def __init__(self, api_key=None, currency="eur"):
        self.currency = (currency or "eur").lower()
        self.api_key = api_key or os.getenv("STRIPE_SECRET_KEY")
        self.stripe_enabled = bool(self.api_key and stripe is not None)

    def create_payment_intent(self, amount_cents, description):
        if self.stripe_enabled:
            intent = stripe.PaymentIntent.create(
                api_key=self.api_key,
                amount=amount_cents,
                currency=self.currency,
                payment_method_types=["card"],
                description=description,
            )
            return {
                "id": intent.id,
                "amount": intent.amount,
                "currency": intent.currency,
                "status": intent.status,
                "payment_method_types": list(intent.payment_method_types or []),
            }

        intent_id = f"pi_sim_{uuid.uuid4().hex[:12]}"
        intent = {
            "id": intent_id,
            "amount": amount_cents,
            "currency": self.currency,
            "status": "requires_confirmation",
            "payment_method_types": ["card"],
            "description": description,
        }
        _SIMULATED_INTENTS[intent_id] = intent
        return dict(intent)

    def confirm_payment_intent(self, intent_id, payment_method=None):
        if self.stripe_enabled:
            intent = stripe.PaymentIntent.confirm(
                api_key=self.api_key,
                payment_intent=intent_id,
                payment_method=payment_method,
            )
            return {
                "id": intent.id,
                "amount": intent.amount,
                "currency": intent.currency,
                "status": intent.status,
            }

        intent = _SIMULATED_INTENTS.get(intent_id)
        if intent is None:
            raise ValueError(intent_id)
        intent["status"] = "succeeded"
        intent["payment_method"] = payment_method
        return dict(intent)


gateway = PaymentGateway()