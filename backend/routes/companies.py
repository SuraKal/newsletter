from datetime import datetime

from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from middleware.auth import role_required
from models import CompanyAccount, User, db

companies_bp = Blueprint("companies", __name__, url_prefix="/api/v1")


def _find_company(key):
    return db.session.get(CompanyAccount, key)


def _current_user_id():
    return int(get_jwt_identity())


def _owns_entity(entity, user):
    if entity.owner_user_id is not None and user.id == entity.owner_user_id:
        return True
    email = (user.email or "").lower()
    return bool(
        email
        and email
        in {(entity.owner_email or "").lower(), (entity.work_email or "").lower()}
    )


def _review_license(entity, approved):
    """Apply the only company workflow transition: licence approval."""
    entity.status = "License approved" if approved else "License declined"
    entity.license_reviewed_at = datetime.utcnow()
    entity.reviewed_at = entity.license_reviewed_at
    entity.account_activated_at = entity.license_reviewed_at if approved else None

    owner = db.session.get(User, entity.owner_user_id) if entity.owner_user_id else None
    if owner:
        owner.business_access_approved = approved

    db.session.commit()
    return entity


@companies_bp.get("/business/company")
@jwt_required()
def get_business_company():
    """Return the approved user's company registration snapshot."""
    user = db.session.get(User, _current_user_id())
    if user is None:
        return jsonify({"companyAccount": None}), 200

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
    return jsonify({"companyAccount": entity.to_dict() if entity else None}), 200


@companies_bp.get("/business/applications/<string:key>")
@jwt_required()
def get_my_application(key):
    entity = _find_company(key)
    user = db.session.get(User, _current_user_id())
    if entity is None or user is None or not _owns_entity(entity, user):
        return jsonify({"error": "Company registration not found"}), 404
    return jsonify({"companyAccount": entity.to_dict()}), 200


@companies_bp.get("/admin/companies")
@jwt_required()
@role_required("admin")
def admin_list_companies():
    entities = CompanyAccount.query.order_by(CompanyAccount.created_at.desc()).all()
    return jsonify({"companyAccounts": [entity.to_dict() for entity in entities]}), 200


@companies_bp.get("/admin/companies/<string:key>")
@jwt_required()
@role_required("admin")
def admin_get_company(key):
    entity = _find_company(key)
    if entity is None:
        return jsonify({"error": "Company not found"}), 404
    return jsonify({"companyAccount": entity.to_dict()}), 200


@companies_bp.post("/admin/companies/<string:key>/approve-license")
@jwt_required()
@role_required("admin")
def admin_approve_license(key):
    entity = _find_company(key)
    if entity is None:
        return jsonify({"error": "Company not found"}), 404
    if entity.status != "License submitted":
        return jsonify({"error": "Only a submitted licence can be approved"}), 409
    return jsonify({"companyAccount": _review_license(entity, True).to_dict()}), 200


@companies_bp.post("/admin/companies/<string:key>/decline-license")
@jwt_required()
@role_required("admin")
def admin_decline_license(key):
    entity = _find_company(key)
    if entity is None:
        return jsonify({"error": "Company not found"}), 404
    if entity.status != "License submitted":
        return jsonify({"error": "Only a submitted licence can be declined"}), 409
    return jsonify({"companyAccount": _review_license(entity, False).to_dict()}), 200
