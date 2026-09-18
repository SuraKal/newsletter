from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from models import BusinessOrder, CompanyAccount, User, db

# Recurring order plans live under `/business/order-plans` because
# `/business/orders` is already the bulk order-request surface (CompanyOrder).
order_plans_bp = Blueprint("order_plans", __name__, url_prefix="/api/v1")


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


@order_plans_bp.get("/business/order-plans")
@jwt_required()
def business_list_order_plans():
    user = db.session.get(User, _current_user_id())
    entity = _account_for_user(user)
    if user is None or entity is None:
        return jsonify({"orderPlans": []}), 200

    plans = (
        BusinessOrder.query.filter_by(company_account_id=entity.id)
        .order_by(BusinessOrder.created_at)
        .all()
    )
    return jsonify({"orderPlans": [plan.to_dict() for plan in plans]}), 200


@order_plans_bp.get("/business/order-plans/<string:key>")
@jwt_required()
def business_get_order_plan(key):
    user = db.session.get(User, _current_user_id())
    plan = db.session.get(BusinessOrder, key)
    entity = _account_for_user(user) if user else None
    if plan is None or entity is None or plan.company_account_id != entity.id:
        return jsonify({"error": "Order plan not found"}), 404
    return jsonify({"orderPlan": plan.to_dict()}), 200


@order_plans_bp.post("/business/order-plans/<string:key>/confirm")
@jwt_required()
def business_confirm_order_plan(key):
    user = db.session.get(User, _current_user_id())
    plan = db.session.get(BusinessOrder, key)
    entity = _account_for_user(user) if user else None
    if plan is None or entity is None or plan.company_account_id != entity.id:
        return jsonify({"error": "Order plan not found"}), 404
    if plan.status != "Review":
        return jsonify({"error": "Only a review plan can be confirmed"}), 409

    plan.status = "Active"
    db.session.commit()
    return jsonify({"orderPlan": plan.to_dict()}), 200