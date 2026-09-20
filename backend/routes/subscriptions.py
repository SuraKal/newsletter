from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from middleware.auth import role_required
from models import SubscriptionPlan, UserSubscription, db
from models.category import slugify
from seed import SEEDED_PLANS

subscriptions_bp = Blueprint(
    "subscriptions", __name__, url_prefix="/api/v1/subscriptions"
)

admin_subscriptions_bp = Blueprint(
    "admin_subscriptions", __name__, url_prefix="/api/v1/admin/subscriptions"
)

# Business plans are owned by the contract workflow and stay out of the reader
# catalog editor. Mirrors `getReaderPlans` in `frontend/src/lib/subscription-catalog.js`.
BUSINESS_PLAN_PREFIX = "business"

# camelCase payload keys -> `SubscriptionPlan` columns.
STRING_FIELDS = (
    ("name", "name"),
    ("period", "period"),
    ("description", "description"),
    ("audience", "audience"),
    ("deliveryNote", "delivery_note"),
    ("paymentNote", "payment_note"),
)

MONEY_FIELDS = (
    ("monthlyPrice", "monthly_price"),
    ("yearlyPrice", "yearly_price"),
)


def _is_reader_plan(plan_id):
    return not str(plan_id or "").startswith(BUSINESS_PLAN_PREFIX)


def _all_plans():
    return SubscriptionPlan.query.order_by(SubscriptionPlan.name).all()


def _coerce_price(value):
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    if number < 0:
        return None
    return round(number, 2)


def _payload_error(data):
    """Create-time validation: a name and a display price are required."""
    if not str(data.get("name") or "").strip():
        return "Plan name is required"
    if not any(key in data for key in ("price", "monthlyPrice", "yearlyPrice")):
        return "A monthly or yearly price is required"
    for key, _ in MONEY_FIELDS:
        if key in data and _coerce_price(data[key]) is None:
            return "Monthly and yearly prices must be numbers of 0 or more"
    return None


def _apply_plan_payload(plan, data):
    """Copy camelCase catalog fields onto `plan`. Returns an error or None."""
    for key, attr in STRING_FIELDS:
        if key in data:
            setattr(plan, attr, str(data[key] or "").strip())

    for key, attr in MONEY_FIELDS:
        if key in data:
            price = _coerce_price(data[key])
            if price is None:
                return "Monthly and yearly prices must be numbers of 0 or more"
            setattr(plan, attr, price)

    if "features" in data:
        features = data["features"]
        if not isinstance(features, list):
            return "Features must be a list"
        plan.features = [
            str(feature).strip() for feature in features if str(feature).strip()
        ]

    if "highlighted" in data:
        plan.highlighted = bool(data["highlighted"])

    return None


def _unique_plan_id(name):
    base = slugify(name) or "plan"
    candidate = base
    suffix = 2
    while db.session.get(SubscriptionPlan, candidate) is not None:
        candidate = f"{base}-{suffix}"
        suffix += 1
    return candidate


@subscriptions_bp.get("/plans")
def list_plans():
    plans = _all_plans()
    return jsonify({"plans": [plan.to_dict() for plan in plans]}), 200


@admin_subscriptions_bp.get("/plans")
@jwt_required()
@role_required("admin")
def admin_list_plans():
    plans = _all_plans()
    return jsonify({"plans": [plan.to_dict() for plan in plans]}), 200


@admin_subscriptions_bp.post("/plans")
@jwt_required()
@role_required("admin")
def create_plan():
    data = request.get_json(silent=True) or {}
    error = _payload_error(data)
    if error:
        return jsonify({"error": error}), 400

    plan_id = str(data.get("id") or "").strip()
    if plan_id:
        if db.session.get(SubscriptionPlan, plan_id) is not None:
            return jsonify({"error": "A plan with that id already exists"}), 409
    else:
        plan_id = _unique_plan_id(data["name"])

    plan = SubscriptionPlan(id=plan_id)
    _apply_plan_payload(plan, data)
    db.session.add(plan)
    db.session.commit()
    return jsonify({"plan": plan.to_dict()}), 201


@admin_subscriptions_bp.put("/plans/<string:plan_id>")
@jwt_required()
@role_required("admin")
def update_plan(plan_id):
    plan = db.session.get(SubscriptionPlan, plan_id)
    if plan is None:
        return jsonify({"error": "Subscription plan not found"}), 404

    data = request.get_json(silent=True) or {}
    error = _apply_plan_payload(plan, data)
    if error:
        return jsonify({"error": error}), 400
    if not str(plan.name or "").strip():
        return jsonify({"error": "Plan name is required"}), 400

    db.session.commit()
    return jsonify({"plan": plan.to_dict()}), 200


@admin_subscriptions_bp.delete("/plans/<string:plan_id>")
@jwt_required()
@role_required("admin")
def delete_plan(plan_id):
    plan = db.session.get(SubscriptionPlan, plan_id)
    if plan is None:
        return jsonify({"error": "Subscription plan not found"}), 404

    if UserSubscription.query.filter_by(plan_id=plan_id).first() is not None:
        return jsonify({"error": "Plan is in use and cannot be removed"}), 409

    if _is_reader_plan(plan_id):
        reader_count = sum(1 for row in _all_plans() if _is_reader_plan(row.id))
        if reader_count <= 1:
            return jsonify({"error": "At least one reader plan is required"}), 400

    db.session.delete(plan)
    db.session.commit()
    return jsonify({"plans": [row.to_dict() for row in _all_plans()]}), 200


@admin_subscriptions_bp.post("/plans/reset")
@jwt_required()
@role_required("admin")
def reset_plans():
    seed_ids = [plan["id"] for plan in SEEDED_PLANS]
    extras = SubscriptionPlan.query.filter(
        ~SubscriptionPlan.id.in_(seed_ids)
    ).all()

    for plan in extras:
        if UserSubscription.query.filter_by(plan_id=plan.id).first() is not None:
            return (
                jsonify(
                    {
                        "error": (
                            f"Plan '{plan.name}' is in use and cannot be removed"
                        )
                    }
                ),
                409,
            )

    for plan_data in SEEDED_PLANS:
        plan = db.session.get(SubscriptionPlan, plan_data["id"])
        if plan is None:
            db.session.add(SubscriptionPlan(**plan_data))
        else:
            for key, value in plan_data.items():
                setattr(plan, key, value)

    for plan in extras:
        db.session.delete(plan)

    db.session.commit()
    return jsonify({"plans": [row.to_dict() for row in _all_plans()]}), 200
