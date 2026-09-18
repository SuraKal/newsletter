from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from models import BusinessLocation, CompanyAccount, User, db

locations_bp = Blueprint("locations", __name__, url_prefix="/api/v1")


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


def _bad_request(message):
    return jsonify({"error": message}), 400


@locations_bp.post("/business/locations")
@jwt_required()
def business_create_location():
    user = db.session.get(User, _current_user_id())
    if user is None or user.role != "business" or not user.business_access_approved:
        return (
            jsonify(
                {
                    "error": "Your business licence must be approved before you can add locations"
                }
            ),
            403,
        )

    entity = _account_for_user(user)
    if entity is None or entity.status != "License approved":
        return jsonify({"error": "Your company account is not active"}), 403

    data = request.get_json(silent=True) or {}
    location_name = (data.get("location") or "").strip()
    if not location_name:
        return _bad_request("A location name is required")

    region = (data.get("region") or "").strip()
    copies = (data.get("copies") or "").strip()
    contact = (data.get("contact") or "").strip()

    location = BusinessLocation(
        company_account_id=entity.id,
        location=location_name,
        region=region,
        copies=copies,
        contact=contact,
        status="Review",
    )
    db.session.add(location)
    db.session.commit()
    return jsonify({"location": location.to_dict()}), 201


@locations_bp.get("/business/locations")
@jwt_required()
def business_list_locations():
    user = db.session.get(User, _current_user_id())
    entity = _account_for_user(user)
    if user is None or entity is None:
        return jsonify({"locations": []}), 200

    locations = (
        BusinessLocation.query.filter_by(company_account_id=entity.id)
        .order_by(BusinessLocation.created_at)
        .all()
    )
    return jsonify({"locations": [loc.to_dict() for loc in locations]}), 200


@locations_bp.get("/business/locations/<string:key>")
@jwt_required()
def business_get_location(key):
    user = db.session.get(User, _current_user_id())
    location = db.session.get(BusinessLocation, key)
    entity = _account_for_user(user) if user else None
    if location is None or entity is None or location.company_account_id != entity.id:
        return jsonify({"error": "Location not found"}), 404
    return jsonify({"location": location.to_dict()}), 200


@locations_bp.post("/business/locations/<string:key>/confirm")
@jwt_required()
def business_confirm_location(key):
    user = db.session.get(User, _current_user_id())
    location = db.session.get(BusinessLocation, key)
    entity = _account_for_user(user) if user else None
    if location is None or entity is None or location.company_account_id != entity.id:
        return jsonify({"error": "Location not found"}), 404
    if location.status not in ("Review", "Confirm contact"):
        return (
            jsonify({"error": "Only a review state location can be confirmed"}),
            409,
        )

    location.status = "Ready"
    db.session.commit()
    return jsonify({"location": location.to_dict()}), 200