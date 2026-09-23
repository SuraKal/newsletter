from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from middleware.auth import role_required
from models import Article, CompanyAccount, CompanyOrder, User, db
from models.company_order import estimate_order_price
from services.invoicing import sync_invoice_for_order

orders_bp = Blueprint("orders", __name__, url_prefix="/api/v1")


def _current_user_id():
    return int(get_jwt_identity())


def _find_order(key):
    return db.session.get(CompanyOrder, key)


def _account_for_user(user):
    if user is None:
        return None
    entity = CompanyAccount.query.filter_by(owner_user_id=user.id).first()
    if entity is None:
        entity = (
            CompanyAccount.query.filter(
                db.or_(
                    db.func.lower(CompanyAccount.owner_email) == user.email.lower(),
                    db.func.lower(CompanyAccount.work_email) == user.email.lower(),
                )
            )
            .order_by(CompanyAccount.created_at.desc())
            .first()
        )
    return entity


def _bad_request(message):
    return jsonify({"error": message}), 400


@orders_bp.get("/business/orders")
@jwt_required()
def business_list_orders():
    user = db.session.get(User, _current_user_id())
    entity = _account_for_user(user)
    if user is None or entity is None:
        return jsonify({"orders": []}), 200

    orders = (
        CompanyOrder.query.filter_by(company_account_id=entity.id)
        .order_by(CompanyOrder.created_at.desc())
        .all()
    )
    return jsonify({"orders": [order.to_dict() for order in orders]}), 200


@orders_bp.post("/business/orders")
@jwt_required()
def business_create_order():
    user = db.session.get(User, _current_user_id())
    if user is None or user.role != "business" or not user.business_access_approved:
        return (
            jsonify(
                {
                    "error": "Your business licence must be approved before you can request bulk orders"
                }
            ),
            403,
        )

    entity = _account_for_user(user)
    if entity is None or entity.status != "License approved":
        return (
            jsonify({"error": "Your company account is not active"}),
            403,
        )

    data = request.get_json(silent=True) or {}
    try:
        copies = int(data.get("copies"))
    except (TypeError, ValueError):
        return _bad_request("A positive copy count is required")
    if copies < 1 or copies > 100_000:
        return _bad_request("Copy count must be between 1 and 100000")

    needed_by = (data.get("neededBy") or "").strip()
    if not needed_by:
        return _bad_request("A required-by date is needed for the order")
    try:
        needed_date = datetime.strptime(needed_by, "%Y-%m-%d").date()
    except ValueError:
        return _bad_request("The required-by date must be a valid date")
    if needed_date < datetime.utcnow().date():
        return _bad_request("The required-by date cannot be in the past")

    locations = data.get("deliveryLocations")
    if locations is None:
        locations = []
    if not isinstance(locations, list) or not all(
        isinstance(item, str) for item in locations
    ):
        return _bad_request("deliveryLocations must be a list of location names")

    article_id = (data.get("articleId") or "").strip()
    if not article_id:
        return _bad_request("An article must be selected for the order")
    article = db.session.get(Article, article_id)
    if article is None:
        return _bad_request("The selected article could not be found")

    estimated_price, rate = estimate_order_price(copies)
    order = CompanyOrder(
        company_account_id=entity.id,
        requested_by_user_id=user.id,
        copies=copies,
        needed_by=needed_by,
        delivery_locations=locations,
        article_id=article.id,
        article_title=article.headline,
        estimated_price=estimated_price,
        rate=rate,
        status="Pending approval",
    )
    db.session.add(order)
    db.session.commit()
    return jsonify({"order": order.to_dict()}), 201


@orders_bp.get("/business/orders/<string:key>")
@jwt_required()
def business_get_order(key):
    user = db.session.get(User, _current_user_id())
    order = _find_order(key)
    entity = _account_for_user(user) if user else None
    if order is None or entity is None or order.company_account_id != entity.id:
        return jsonify({"error": "Order request not found"}), 404
    return jsonify({"order": order.to_dict()}), 200


@orders_bp.get("/admin/orders")
@jwt_required()
@role_required("admin")
def admin_list_orders():
    orders = CompanyOrder.query.order_by(CompanyOrder.created_at.desc()).all()
    return jsonify({"orders": [order.to_dict() for order in orders]}), 200


@orders_bp.post("/admin/orders/<string:key>/approve")
@jwt_required()
@role_required("admin")
def admin_approve_order(key):
    order = _find_order(key)
    if order is None:
        return jsonify({"error": "Order request not found"}), 404
    if order.status != "Pending approval":
        return jsonify({"error": "Only a pending request can be approved"}), 409

    data = request.get_json(silent=True) or {}
    raw_price = data.get("finalPrice")
    if raw_price is None or raw_price == "":
        return _bad_request("A final price is required")
    try:
        final_price = round(float(raw_price), 2)
    except (TypeError, ValueError):
        return _bad_request("Final price must be a number")
    if final_price < 0 or final_price > 1_000_000_000:
        return _bad_request("Final price out of range")

    order.status = "Approved"
    order.final_price = final_price
    order.reviewed_by_user_id = _current_user_id()
    order.reviewed_at = datetime.utcnow()

    # Mirror the approved volume onto the account so at-a-glance summaries stay
    # in sync with the live order book.
    if order.company_account is not None:
        order.company_account.volume = f"{order.copies} copies / cycle"

    # An approved order with a confirmed final price becomes a real billing
    # source: reconcile its invoice in the same transaction.
    sync_invoice_for_order(order)

    db.session.commit()
    return jsonify({"order": order.to_dict()}), 200


@orders_bp.post("/admin/orders/<string:key>/decline")
@jwt_required()
@role_required("admin")
def admin_decline_order(key):
    order = _find_order(key)
    if order is None:
        return jsonify({"error": "Order request not found"}), 404
    if order.status != "Pending approval":
        return jsonify({"error": "Only a pending request can be declined"}), 409

    order.status = "Declined"
    order.reviewed_by_user_id = _current_user_id()
    order.reviewed_at = datetime.utcnow()

    db.session.commit()
    return jsonify({"order": order.to_dict()}), 200