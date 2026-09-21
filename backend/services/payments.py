"""Stripe PaymentIntent gateway for secure reader checkout."""

import os
try:
    import stripe
except ImportError:  # pragma: no cover - Stripe SDK is optional until enabled
    stripe = None  # type: ignore[assignment]


class PaymentGateway:
    """Creates and verifies PaymentIntents through Stripe's server SDK."""

    def __init__(self, api_key=None, currency="eur"):
        self.currency = (currency or "eur").lower()
        # Accept the names already used in the local environment, while
        # supporting explicit Stripe-prefixed names for deployments.
        self.api_key = (
            api_key
            or os.getenv("STRIPE_SECRET_KEY")
            or os.getenv("SECRET_KEY")
        )
        self.publishable_key = (
            os.getenv("STRIPE_PUBLISHABLE_KEY")
            or os.getenv("PUBLISHABLE_KEY")
        )
        self.stripe_enabled = bool(self.api_key and stripe is not None)

    @property
    def is_configured(self):
        """True only when both the server and Stripe.js can be initialized."""
        return bool(self.stripe_enabled and self.publishable_key)

    def create_payment_intent(self, amount_cents, description, metadata=None, receipt_email=None):
        if not self.is_configured:
            raise RuntimeError("Stripe is not configured")
        intent = stripe.PaymentIntent.create(
            api_key=self.api_key,
            amount=amount_cents,
            currency=self.currency,
            payment_method_types=["card"],
            description=description,
            metadata=metadata or {},
            receipt_email=receipt_email or None,
        )
        return {
            "id": intent.id,
            "amount": intent.amount,
            "currency": intent.currency,
            "status": intent.status,
            "client_secret": intent.client_secret,
        }

    def retrieve_payment_intent(self, intent_id):
        """Return the verified PaymentIntent details required by checkout."""
        if not intent_id:
            return None
        if not self.is_configured:
            return None
        intent = stripe.PaymentIntent.retrieve(intent_id, api_key=self.api_key)
        return {
            "id": intent.id,
            "amount": intent.amount,
            "currency": intent.currency,
            "status": intent.status,
            "payment_method": intent.payment_method,
        }

    def card_details_from_payment_method(self, payment_method_id):
        """Resolve (brand, last4) from a Stripe PaymentMethod id."""
        if not self.is_configured or not payment_method_id:
            return ("", "")
        try:
            method = stripe.PaymentMethod.retrieve(payment_method_id, api_key=self.api_key)
        except Exception:  # pragma: no cover - network/API failures
            return ("", "")
        card = method.get("card") or {}
        brand = str(card.get("brand") or "").capitalize()
        last4 = str(card.get("last4") or "")
        return (brand, last4)


gateway = PaymentGateway()
