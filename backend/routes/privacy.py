from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from middleware.auth import role_required
from models import CompanyAccount, GovernanceRequest, User, db
from models.governance_request import (
    GOVERNANCE_ACTIONS,
    GOVERNANCE_REQUEST_STATUSES,
)

privacy_bp = Blueprint("privacy", __name__, url_prefix="/api/v1")


def _current_user_id():
    return int(get_jwt_identity())


def _current_user():
    return db.session.get(User, _current_user_id())


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


# Consent field keys are camelCase to match the frontend `AccountConsentForm`
# `fieldMap`; the mapped attribute lives either on User or CompanyAccount.
READER_CONSENT_FIELDS = {
    "newsletterOptIn": "newsletter_opt_in",
    "privacyUpdatesOptIn": "privacy_updates_opt_in",
    "deliveryDataConsent": "delivery_data_consent",
}

COMPANY_CONSENT_FIELDS = {
    "commercialUpdatesOptIn": "commercial_updates_opt_in",
    "privacyUpdatesOptIn": "privacy_updates_opt_in",
    "deliveryDataConsent": "delivery_data_consent",
}


def _reader_consents(user):
    return {
        "newsletterOptIn": bool(user.newsletter_opt_in),
        "privacyUpdatesOptIn": bool(user.privacy_updates_opt_in),
        "deliveryDataConsent": bool(user.delivery_data_consent),
    }


def _company_consents(account, user):
    source = account if account is not None else user
    return {
        "commercialUpdatesOptIn": bool(source.commercial_updates_opt_in),
        "privacyUpdatesOptIn": bool(source.privacy_updates_opt_in),
        "deliveryDataConsent": bool(source.delivery_data_consent),
    }


# Reader consent -------------------------------------------------------------


@privacy_bp.get("/account/consents")
@jwt_required()
def get_reader_consents():
    user = _current_user()
    if user is None:
        return jsonify({"error": "Authentication required"}), 401
    return jsonify({"consents": _reader_consents(user)}), 200


@privacy_bp.put("/account/consents")
@jwt_required()
def save_reader_consents():
    user = _current_user()
    if user is None:
        return jsonify({"error": "Authentication required"}), 401

    data = request.get_json(silent=True) or {}
    for key, attr in READER_CONSENT_FIELDS.items():
        if key in data:
            setattr(user, attr, bool(data[key]))
    db.session.commit()
    return jsonify({"consents": _reader_consents(user)}), 200


# Company consent ------------------------------------------------------------


@privacy_bp.get("/business/company/consents")
@jwt_required()
def get_company_consents():
    user = _current_user()
    if user is None or user.role != "business":
        return jsonify({"error": "Business access required"}), 403
    account = _account_for_user(user)
    return jsonify({"consents": _company_consents(account, user)}), 200


@privacy_bp.put("/business/company/consents")
@jwt_required()
def save_company_consents():
    user = _current_user()
    if user is None or user.role != "business":
        return jsonify({"error": "Business access required"}), 403

    account = _account_for_user(user)
    target = account if account is not None else user
    data = request.get_json(silent=True) or {}
    for key, attr in COMPANY_CONSENT_FIELDS.items():
        if key in data:
            setattr(target, attr, bool(data[key]))
    db.session.commit()
    return jsonify({"consents": _company_consents(account, user)}), 200


# Reader governance requests -------------------------------------------------


@privacy_bp.get("/account/governance-requests")
@jwt_required()
def list_reader_governance_requests():
    user = _current_user()
    if user is None:
        return jsonify({"error": "Authentication required"}), 401

    rows = (
        GovernanceRequest.query.filter_by(user_id=user.id, scope="reader")
        .order_by(GovernanceRequest.created_at.asc())
        .all()
    )
    return jsonify({"governanceRequests": [row.to_dict() for row in rows]}), 200


@privacy_bp.post("/account/governance-requests")
@jwt_required()
def create_reader_governance_request():
    user = _current_user()
    if user is None:
        return jsonify({"error": "Authentication required"}), 401

    data = request.get_json(silent=True) or {}
    action = (data.get("action") or "").strip().lower()
    mapping = GOVERNANCE_ACTIONS["reader"]
    if action not in mapping:
        return _bad_request("A valid governance action is required")

    request_type, status = mapping[action]
    row = GovernanceRequest(
        user_id=user.id,
        company_account_id=None,
        scope="reader",
        type=request_type,
        status=status,
        notes=(data.get("notes") or "").strip(),
    )
    db.session.add(row)
    db.session.commit()
    return jsonify({"governanceRequest": row.to_dict()}), 201


# Company governance requests ------------------------------------------------


@privacy_bp.get("/business/governance-requests")
@jwt_required()
def list_company_governance_requests():
    user = _current_user()
    if user is None or user.role != "business":
        return jsonify({"error": "Business access required"}), 403

    account = _account_for_user(user)
    query = GovernanceRequest.query.filter_by(scope="company")
    if account is not None:
        query = query.filter_by(company_account_id=account.id)
    else:
        query = query.filter_by(user_id=user.id)

    rows = query.order_by(GovernanceRequest.created_at.asc()).all()
    return jsonify({"governanceRequests": [row.to_dict() for row in rows]}), 200


@privacy_bp.post("/business/governance-requests")
@jwt_required()
def create_company_governance_request():
    user = _current_user()
    if user is None or user.role != "business":
        return jsonify({"error": "Business access required"}), 403

    account = _account_for_user(user)
    data = request.get_json(silent=True) or {}
    action = (data.get("action") or "").strip().lower()
    mapping = GOVERNANCE_ACTIONS["company"]
    if action not in mapping:
        return _bad_request("A valid governance action is required")

    request_type, status = mapping[action]
    row = GovernanceRequest(
        user_id=user.id,
        company_account_id=account.id if account is not None else None,
        scope="company",
        type=request_type,
        status=status,
        notes=(data.get("notes") or "").strip(),
    )
    db.session.add(row)
    db.session.commit()
    return jsonify({"governanceRequest": row.to_dict()}), 201


# Admin governance queue -----------------------------------------------------


@privacy_bp.get("/admin/governance-requests")
@jwt_required()
@role_required("admin")
def list_admin_governance_requests():
    rows = (
        GovernanceRequest.query.order_by(GovernanceRequest.created_at.desc()).all()
    )
    return (
        jsonify(
            {
                "governanceRequests": [
                    row.to_dict(include_requester=True) for row in rows
                ]
            }
        ),
        200,
    )


@privacy_bp.put("/admin/governance-requests/<string:key>/status")
@jwt_required()
@role_required("admin")
def update_governance_request_status(key):
    row = db.session.get(GovernanceRequest, key)
    if row is None:
        return jsonify({"error": "Governance request not found"}), 404

    data = request.get_json(silent=True) or {}
    next_status = (data.get("status") or "").strip()
    if next_status not in GOVERNANCE_REQUEST_STATUSES:
        return _bad_request("A valid governance status is required")

    row.status = next_status
    row.resolved_at = datetime.utcnow() if next_status == "Completed" else None
    db.session.commit()
    return jsonify({"governanceRequest": row.to_dict(include_requester=True)}), 200
