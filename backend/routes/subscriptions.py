from flask import Blueprint, jsonify

from models import SubscriptionPlan

subscriptions_bp = Blueprint(
    "subscriptions", __name__, url_prefix="/api/v1/subscriptions"
)


@subscriptions_bp.get("/plans")
def list_plans():
    plans = SubscriptionPlan.query.order_by(SubscriptionPlan.name).all()
    return jsonify({"plans": [plan.to_dict() for plan in plans]}), 200