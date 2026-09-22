from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from middleware.auth import role_required
from models import (
    BusinessLocation,
    CompanyAccount,
    ReaderDelivery,
    Shipment,
    User,
    db,
)

shipments_bp = Blueprint("shipments", __name__, url_prefix="/api/v1")

# Milestone transitions the business user can trigger. Mirrors the
# `actionForStatus` map in the business shipment detail page.
BUSINESS_ADVANCES = {
    "Address review": "Preparing",
    "Preparing": "In dispatch",
    "In dispatch": "Delivered",
}

# Milestone transitions the admin can trigger. Mirrors the admin detail page.
ADMIN_ADVANCES = {
    "Delay flagged": "In dispatch",
    "Preparing": "In dispatch",
    "In dispatch": "Delivered",
}


def _current_user_id():
    return int(get_jwt_identity())


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


def _activity_payload(shipment):
    return [
        activity.to_dict() for activity in shipment.activities
    ]


def _reader_destinations():
    """Distinct subscriber delivery profiles behind active print deliveries.

    Reader profiles only persist an address as free text (no coordinates), so
    the admin shipment maps resolve the destination text to Geoapify
    coordinates on the client. This keeps the "reader flow" visible on the
    same route map as the company's saved business locations.
    """
    readers = (
        db.session.query(User)
        .join(ReaderDelivery, ReaderDelivery.user_id == User.id)
        .distinct()
        .all()
    )
    destinations = []
    seen = set()
    for user in readers:
        city = (user.city or "").strip()
        country = (user.country or "").strip()
        destination = ", ".join(part for part in (city, country) if part)
        if not destination or destination.lower() in seen:
            continue
        seen.add(destination.lower())
        destinations.append(
            {
                "name": user.name or "",
                "destination": destination,
                "address": (user.delivery_address or "").strip(),
            }
        )
    return destinations


def _shipment_payload(shipment):
    """Include exact company delivery destinations for dispatch reference.

    Shipment runs are consolidated at the company level, so they do not yet
    select a subset of locations. Returning the company's stored destinations
    gives both workspaces the Geoapify address and coordinates used for routing,
    and appends the distinct subscriber delivery profiles for the full flow.
    """
    payload = shipment.to_dict()
    if shipment.company_account_id:
        locations = (
            BusinessLocation.query.filter_by(
                company_account_id=shipment.company_account_id
            )
            .order_by(BusinessLocation.created_at)
            .all()
        )
        payload["deliveryLocations"] = [location.to_dict() for location in locations]
    else:
        payload["deliveryLocations"] = []
    payload["readerDestinations"] = _reader_destinations()
    return payload


@shipments_bp.get("/business/shipments")
@jwt_required()
def business_list_shipments():
    user = db.session.get(User, _current_user_id())
    entity = _account_for_user(user)
    if user is None or entity is None:
        return jsonify({"shipments": []}), 200

    shipments = (
        Shipment.query.filter_by(company_account_id=entity.id)
        .order_by(Shipment.created_at)
        .all()
    )
    return jsonify({"shipments": [_shipment_payload(row) for row in shipments]}), 200


@shipments_bp.get("/business/shipments/<string:key>")
@jwt_required()
def business_get_shipment(key):
    user = db.session.get(User, _current_user_id())
    shipment = db.session.get(Shipment, key)
    entity = _account_for_user(user) if user else None
    if shipment is None or entity is None or shipment.company_account_id != entity.id:
        return jsonify({"error": "Shipment run not found"}), 404
    return (
        jsonify(
            {
                "shipment": _shipment_payload(shipment),
                "activity": _activity_payload(shipment),
            }
        ),
        200,
    )


@shipments_bp.post("/business/shipments/<string:key>/advance")
@jwt_required()
def business_advance_shipment(key):
    user = db.session.get(User, _current_user_id())
    shipment = db.session.get(Shipment, key)
    entity = _account_for_user(user) if user else None
    if shipment is None or entity is None or shipment.company_account_id != entity.id:
        return jsonify({"error": "Shipment run not found"}), 404

    next_status = BUSINESS_ADVANCES.get(shipment.status)
    if next_status is None:
        return (
            jsonify({"error": "This shipment run cannot be advanced"}),
            409,
        )

    shipment.status = next_status
    db.session.commit()
    return jsonify({"shipment": _shipment_payload(shipment)}), 200


@shipments_bp.get("/admin/shipments")
@jwt_required()
@role_required("admin")
def admin_list_shipments():
    shipments = Shipment.query.order_by(Shipment.created_at).all()
    return jsonify({"shipments": [_shipment_payload(row) for row in shipments]}), 200


@shipments_bp.get("/admin/shipments/<string:key>")
@jwt_required()
@role_required("admin")
def admin_get_shipment(key):
    shipment = db.session.get(Shipment, key)
    if shipment is None:
        return jsonify({"error": "Shipment run not found"}), 404
    return (
        jsonify(
            {
                "shipment": _shipment_payload(shipment),
                "activity": _activity_payload(shipment),
            }
        ),
        200,
    )


@shipments_bp.post("/admin/shipments/<string:key>/advance")
@jwt_required()
@role_required("admin")
def admin_advance_shipment(key):
    shipment = db.session.get(Shipment, key)
    if shipment is None:
        return jsonify({"error": "Shipment run not found"}), 404

    next_status = ADMIN_ADVANCES.get(shipment.status)
    if next_status is None:
        return (
            jsonify({"error": "This shipment run cannot be advanced"}),
            409,
        )

    shipment.status = next_status
    db.session.commit()
    return jsonify({"shipment": _shipment_payload(shipment)}), 200
