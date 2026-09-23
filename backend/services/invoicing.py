"""Business invoice generation.

Business invoices are derived from real billing sources instead of static demo
records. Approved bulk orders (confirmed final price) and the company owner's
business subscription are reconciled into ``BusinessInvoice`` rows so the
invoices surface always reflects the live order book and active contract.
"""

import uuid
from datetime import datetime

from models import BusinessInvoice, CompanyOrder, UserSubscription, db


BULK_ORDER_SOURCE = "bulk_order"
SUBSCRIPTION_SOURCE = "subscription"


def _format_amount(value, currency="EUR"):
    if value is None:
        return "Pending"
    return f"{currency} {float(value):,.2f}"


def _display_date(value):
    if value is None:
        return ""
    try:
        return value.strftime("%B %d, %Y")
    except (AttributeError, ValueError):
        return ""


def _next_invoice_code(account_id, now):
    """Build a stable-ish invoice code from the accounts current billing month."""
    month = now.strftime("%Y%m")
    prefix = f"INV-BIZ-{month}-"
    count = (
        BusinessInvoice.query.filter(
            BusinessInvoice.company_account_id == account_id,
            BusinessInvoice.invoice.like(f"{prefix}%"),
        ).count()
        + 1
    )
    return f"{prefix}{count:02d}"


def _find_invoice(account_id, source_type, source_id):
    return BusinessInvoice.query.filter_by(
        company_account_id=account_id,
        source_type=source_type,
        source_id=source_id,
    ).first()


def sync_invoice_for_order(order):
    """Create or refresh the invoice for an approved bulk order.

    Only approved orders with a confirmed final price produce an invoice.
    """
    if order is None or order.status != "Approved" or order.final_price is None:
        return None

    invoice = _find_invoice(order.company_account_id, BULK_ORDER_SOURCE, order.id)
    if invoice is None:
        invoice = BusinessInvoice(
            id=str(uuid.uuid4()),
            company_account_id=order.company_account_id,
            source_type=BULK_ORDER_SOURCE,
            source_id=order.id,
            invoice=_next_invoice_code(order.company_account_id, order.reviewed_at or datetime.utcnow()),
        )
        db.session.add(invoice)

    title = (order.article_title or "").strip()
    invoice.scope = f"{title} · {order.copies} copies"[:160] if title else f"Bulk order · {order.copies} copies"
    invoice.amount_value = order.final_price
    invoice.currency = "EUR"
    invoice.amount = _format_amount(order.final_price)
    invoice.status = invoice.status or "Upcoming"
    invoice.date = _display_date(order.reviewed_at)

    return invoice


def sync_invoice_for_subscription(subscription, account):
    """Create or refresh the invoice for the account owner's business plan.

    Business contracts use invoice/contract billing, so the contract invoice is
    created in a Review state until the finance lead confirms the VAT note.
    """
    if subscription is None or subscription.plan is None or account is None:
        return None
    if subscription.status != "active":
        return None

    plan = subscription.plan
    plan_id = (plan.id or "")
    if not plan_id.startswith("business"):
        return None

    period_label = "yearly" if subscription.billing_cycle == "yearly" else "monthly"
    price = plan.yearly_price if subscription.billing_cycle == "yearly" else plan.monthly_price
    price = float(price or 0)

    invoice = _find_invoice(account.id, SUBSCRIPTION_SOURCE, str(subscription.id))
    if invoice is None:
        invoice = BusinessInvoice(
            id=str(uuid.uuid4()),
            company_account_id=account.id,
            source_type=SUBSCRIPTION_SOURCE,
            source_id=str(subscription.id),
            invoice=_next_invoice_code(account.id, subscription.started_at or datetime.utcnow()),
        )
        db.session.add(invoice)

    invoice.scope = f"{plan.name} · {period_label} contract"[:160]
    invoice.amount_value = price
    invoice.currency = "EUR"
    invoice.amount = _format_amount(price) if price > 0 else "Contract billing"
    if invoice.status not in ("Reviewed",):
        invoice.status = "Review"
    invoice.date = _display_date(subscription.renewal_at or subscription.started_at)
    return invoice


def reconcile_account_invoices(account):
    """Ensure every approved order and the active business contract have an
    invoice, then return the account's invoice rows (newest first)."""
    if account is None:
        return []

    approved_orders = CompanyOrder.query.filter_by(
        company_account_id=account.id,
        status="Approved",
    ).all()
    for order in approved_orders:
        sync_invoice_for_order(order)

    if account.owner_user_id is not None:
        subscriptions = (
            UserSubscription.query.filter_by(
                user_id=account.owner_user_id, status="active"
            )
            .order_by(UserSubscription.started_at.desc(), UserSubscription.id.desc())
            .all()
        )
        if subscriptions:
            sync_invoice_for_subscription(subscriptions[0], account)

    db.session.commit()
    return (
        BusinessInvoice.query.filter_by(company_account_id=account.id)
        .order_by(BusinessInvoice.created_at.asc())
        .all()
    )