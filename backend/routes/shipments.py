from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from middleware.auth import role_required
from models import (
    BusinessLocation,
    CompanyAccount,
    CompanyOrder,
    ReaderDelivery,
    Shipment,
    ShipmentActivity,
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
    "Address review": "Preparing",
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


def _next_run_id(prefix, seed_letter=False):
    """Build the next display run id for a workspace.

    Admin runs use numeric suffixes (`OPS-20260922-05`); business runs use
    letter suffixes to match the seeded `BIZ-20260811-A` format. The suffix
    increments per run so ids stay unique within the workspace prefix.
    """
    today = datetime.utcnow().strftime("%Y%m%d")
    if seed_letter:
        existing = Shipment.query.filter(
            Shipment.shipment_id.like(f"{prefix}-{today}-%")
        ).count()
        return f"{prefix}-{today}-{chr(ord('A') + existing)}"
    existing = Shipment.query.filter(
        Shipment.shipment_id.like(f"{prefix}-{today}-%")
    ).count()
    return f"{prefix}-{today}-{existing + 1:02d}"


def _create_shipment(data, company_account_id=None, prefix="OPS", seed_letter=False):
    """Create a shipment run and its opening activity event.

    Runs start in `Preparing` regardless of source. A `bulk_order` run keeps
    a link to the approved order request (idempotent per order) and remembers
    the order's delivery locations so the dispatch surface reflects the
    requested stops.
    """
    label = (data.get("label") or "").strip()
    if not label:
        return None, "A run label is required.", 400
    route = (data.get("route") or "").strip()
    scope = (data.get("scope") or "").strip()
    eta = (data.get("eta") or "").strip() or "Awaiting dispatch window"
    notes = (data.get("notes") or "").strip()
    source_type = (data.get("sourceType") or "manual").strip()
    if source_type not in ("manual", "bulk_order"):
        return None, "sourceType must be 'manual' or 'bulk_order'.", 400

    order = None
    order_request_id = (data.get("orderRequestId") or "").strip() or None
    if source_type == "bulk_order":
        if not order_request_id:
            return None, "A bulk-order run must reference an approved order request.", 400
        order = db.session.get(CompanyOrder, order_request_id)
        if order is None:
            return None, "The referenced order request could not be found.", 404
        if order.status != "Approved":
            return None, "Only an approved order request can start a shipment run.", 400
        if company_account_id is not None and order.company_account_id != company_account_id:
            return None, "The order request does not belong to this company.", 403
        if Shipment.query.filter_by(order_request_id=order.id).first():
            return None, "This order request already has a shipment run.", 409
        if company_account_id is None:
            company_account_id = order.company_account_id

    run = Shipment(
        company_account_id=company_account_id,
        label=label,
        route=route,
        scope=scope,
        status="Preparing",
        eta=eta,
        source_type=source_type,
        order_request_id=order.id if order else None,
        notes=notes,
    )
    if order:
        run.delivery_locations = order.delivery_locations or []
    run.shipment_id = _next_run_id(prefix, seed_letter=seed_letter)
    db.session.add(run)
    db.session.flush()

    now = datetime.utcnow()
    hour = now.strftime("%I").lstrip("0") or "12"
    activity = ShipmentActivity(
        shipment_id=run.id,
        event=f"Run initiated from {'bulk order' if order else 'manual dispatch'}",
        status="Preparing",
        tone="neutral",
        date=now.strftime(f"%B %d, %Y · {hour}:%M %p"),
    )
    db.session.add(activity)
    db.session.commit()
    return run, None, 201


def _shipment_payload(shipment):
    """Include exact company delivery destinations for dispatch reference.

    Shipment runs are consolidated at the company level, so they do not yet
    select a subset of locations. Returning the company's stored destinations
    gives both workspaces the Geoapify address and coordinates used for routing,
    and appends the distinct subscriber delivery profiles for the full flow.
    """
    payload = shipment.to_dict()
    if shipment.delivery_locations:
        payload["deliveryLocations"] = shipment.delivery_locations
    elif shipment.company_account_id:
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


@shipments_bp.post("/business/shipments")
@jwt_required()
def business_create_shipment():
    user = db.session.get(User, _current_user_id())
    entity = _account_for_user(user)
    if user is None or entity is None:
        return jsonify({"error": "No company account is linked to this user."}), 403

    run, error, status = _create_shipment(
        request.get_json(silent=True) or {},
        company_account_id=entity.id,
        prefix="BIZ",
        seed_letter=True,
    )
    if run is None:
        return jsonify({"error": error}), status
    return (
        jsonify(
            {
                "shipment": _shipment_payload(run),
                "activity": _activity_payload(run),
            }
        ),
        201,
    )


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


@shipments_bp.post("/admin/shipments")
@jwt_required()
@role_required("admin")
def admin_create_shipment():
    data = request.get_json(silent=True) or {}
    company_account_id = (data.get("companyAccountId") or "").strip() or None
    run, error, status = _create_shipment(
        data,
        company_account_id=company_account_id,
        prefix="OPS",
    )
    if run is None:
        return jsonify({"error": error}), status
    return (
        jsonify(
            {
                "shipment": _shipment_payload(run),
                "activity": _activity_payload(run),
            }
        ),
        201,
    )


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
