from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from middleware.auth import role_required
from models import CompanyAccount, User, db
from models.company import COMPANY_WORKFLOW_STATES

companies_bp = Blueprint("companies", __name__, url_prefix="/api/v1")

REVIEWED_STATES = (
    "Under review",
    "Quote ready",
    "Approved",
    "Declined",
    "Converted to account",
)

# Guarded transitions enforced by the admin workflow endpoints. The key is the
# next state, the value is the set of states it may be reached from. Mirrors the
# mock's lead lifecycle in `company-store.js`.
NEXT_STATE_RULES = {
    "Under review": {"Submitted"},
    "Quote ready": {"Under review", "Quote ready"},
    "Approved": {"Quote ready"},
    "Converted to account": {"Approved"},
    "Declined": {"Submitted", "Under review", "Quote ready"},
}


def _find_company(key):
    """Resolve a company account by exact id."""
    return db.session.get(CompanyAccount, key)


def _current_user_id():
    """The logged-in user's id (JWT identity is stored as str)."""
    return int(get_jwt_identity())


def _lead_string(lead, key, default=""):
    value = (lead or {}).get(key)
    return value if isinstance(value, str) else default


def _tier_for_lead(lead=None):
    """Derive a tier from the application's company size, like the mock."""
    lead = lead or {}
    size = _lead_string(lead, "companySize")
    if "1000" in size or "200" in size:
        return "Enterprise Route"
    if "51" in size or "11" in size:
        return "Regional Team"
    return "Single Office"


def _build_entity(data, status, owner_user_id):
    """Build a CompanyAccount from a business-application payload.

    The full form payload is stored as the `lead` JSON column; the denormalized
    top-level fields mirror `buildCompanyEntity` in the mock store.
    """
    org = _lead_string(data, "organizationName") or _lead_string(data, "company")
    entity = CompanyAccount(
        company=org or "Unnamed organization",
        status=status,
        tier=None,
        volume=_lead_string(data, "expectedCopies"),
        billing=_lead_string(data, "billingPreference"),
        region=_lead_string(data, "countryScope"),
        work_email=_lead_string(data, "workEmail") or None,
        owner_email=_lead_string(data, "workEmail") or None,
        owner_user_id=owner_user_id,
        lead=data or {},
    )
    return entity


def _owns_entity(entity, user):
    """True when the user owns the entity by id or by matching email fields."""
    if entity.owner_user_id is not None and user.id == entity.owner_user_id:
        return True
    user_email = (user.email or "").lower()
    owner_email = (entity.owner_email or "").lower()
    work_email = (entity.work_email or "").lower()
    return bool(user_email and (user_email == owner_email or user_email == work_email))


def _apply_transition(entity, next_state):
    """Run the state machine side-effects, mirroring transitionCompanyLead.

    - tier is assigned once the workflow reaches quote/approval/conversion
    - volume follows the application's expected copies
    - reviewed_at is stamped on the first transition into a reviewed state
    - a quote is generated when entering "Quote ready"
    - when converting, owner email is pinned and the account is activated
    """
    lead = entity.lead or {}

    if next_state in ("Quote ready", "Approved", "Converted to account"):
        entity.tier = _tier_for_lead(lead)

    expected_copies = _lead_string(lead, "expectedCopies")
    entity.volume = expected_copies or entity.volume or ""

    if next_state in REVIEWED_STATES and entity.reviewed_at is None:
        entity.reviewed_at = datetime.utcnow()

    if next_state == "Quote ready":
        entity.quote = {
            "tier": _tier_for_lead(lead),
            "volume": expected_copies or entity.volume or "Not specified",
            "billing": _lead_string(lead, "billingPreference")
            or entity.billing
            or "To be confirmed",
            "delivery": _lead_string(lead, "deliveryLocations")
            or "To be confirmed",
            "preparedAt": datetime.utcnow().isoformat(),
            "note": "Quote prepared for commercial approval.",
        }

    if next_state == "Converted to account":
        email = (
            _lead_string(lead, "workEmail")
            or entity.work_email
            or entity.owner_email
        )
        entity.owner_email = email
        entity.account_activated_at = datetime.utcnow()

    entity.status = next_state
    db.session.commit()
    return entity


# --------------------------------------------------------------------------- #
# Business-facing routes
# --------------------------------------------------------------------------- #


@companies_bp.post("/business/applications/draft")
@jwt_required()
def save_application_draft():
    """Any logged-in user saves their application as a Draft."""
    data = request.get_json(silent=True) or {}
    if not isinstance(data, dict):
        return jsonify({"error": "Expected a JSON object"}), 400

    entity = _build_entity(data, "Draft", _current_user_id())
    db.session.add(entity)
    db.session.commit()
    return jsonify({"companyAccount": entity.to_dict()}), 201


@companies_bp.post("/business/applications")
@jwt_required()
def submit_application():
    """Any logged-in user submits their application for commercial review."""
    data = request.get_json(silent=True) or {}
    if not isinstance(data, dict):
        return jsonify({"error": "Expected a JSON object"}), 400

    org = (_lead_string(data, "organizationName") or "").strip()
    if not org:
        return jsonify({"error": "Organization name is required"}), 400

    entity = _build_entity(data, "Submitted", _current_user_id())
    db.session.add(entity)
    db.session.commit()
    return jsonify({"companyAccount": entity.to_dict()}), 201


@companies_bp.get("/business/company")
@jwt_required()
def get_business_company():
    """The caller's company snapshot.

    Matches by the owning user id first, then falls back to owner_email /
    work_email so applications submitted before the user id was linked still
    resolve. Returns `null` when the caller has no company entity.
    """
    user = db.session.get(User, _current_user_id())
    if user is None:
        return jsonify({"companyAccount": None}), 200

    entity = CompanyAccount.query.filter_by(owner_user_id=user.id).first()
    if entity is None:
        email = (user.email or "").lower()
        entity = (
            CompanyAccount.query.filter(
                db.or_(
                    db.func.lower(CompanyAccount.owner_email) == email,
                    db.func.lower(CompanyAccount.work_email) == email,
                )
            )
            .order_by(CompanyAccount.created_at.desc())
            .first()
        )

    return jsonify(
        {"companyAccount": entity.to_dict() if entity else None}
    ), 200


@companies_bp.get("/business/applications/<string:key>")
@jwt_required()
def get_my_application(key):
    """The caller's own application; anyone else gets a 404."""
    entity = _find_company(key)
    if entity is None:
        return jsonify({"error": "Application not found"}), 404

    user = db.session.get(User, _current_user_id())
    if user is None or not _owns_entity(entity, user):
        return jsonify({"error": "Application not found"}), 404

    return jsonify({"companyAccount": entity.to_dict()}), 200


# --------------------------------------------------------------------------- #
# Admin routes
# --------------------------------------------------------------------------- #


@companies_bp.get("/admin/companies")
@jwt_required()
@role_required("admin")
def admin_list_companies():
    """All entities (leads + accounts), newest first."""
    entities = CompanyAccount.query.order_by(
        CompanyAccount.created_at.desc()
    ).all()
    return jsonify(
        {"companyAccounts": [entity.to_dict() for entity in entities]}
    ), 200


@companies_bp.get("/admin/companies/<string:key>")
@jwt_required()
@role_required("admin")
def admin_get_company(key):
    entity = _find_company(key)
    if entity is None:
        return jsonify({"error": "Company not found"}), 404
    return jsonify({"companyAccount": entity.to_dict()}), 200


@companies_bp.post("/admin/companies/<string:key>/review")
@jwt_required()
@role_required("admin")
def admin_start_review(key):
    entity = _find_company(key)
    if entity is None:
        return jsonify({"error": "Company not found"}), 404
    return _guard_and_transition(entity, "Under review")


@companies_bp.post("/admin/companies/<string:key>/quote")
@jwt_required()
@role_required("admin")
def admin_prepare_quote(key):
    entity = _find_company(key)
    if entity is None:
        return jsonify({"error": "Company not found"}), 404
    return _guard_and_transition(entity, "Quote ready")


@companies_bp.post("/admin/companies/<string:key>/approve")
@jwt_required()
@role_required("admin")
def admin_approve(key):
    entity = _find_company(key)
    if entity is None:
        return jsonify({"error": "Company not found"}), 404
    return _guard_and_transition(entity, "Approved")


@companies_bp.post("/admin/companies/<string:key>/convert")
@jwt_required()
@role_required("admin")
def admin_convert(key):
    entity = _find_company(key)
    if entity is None:
        return jsonify({"error": "Company not found"}), 404
    return _guard_and_transition(entity, "Converted to account")


@companies_bp.post("/admin/companies/<string:key>/decline")
@jwt_required()
@role_required("admin")
def admin_decline(key):
    entity = _find_company(key)
    if entity is None:
        return jsonify({"error": "Company not found"}), 404
    return _guard_and_transition(entity, "Declined")


def _guard_and_transition(entity, next_state):
    """Guard a transition against the allowed source states, then apply it."""
    if next_state not in COMPANY_WORKFLOW_STATES:
        return jsonify({"error": "Invalid workflow state"}), 400

    allowed = NEXT_STATE_RULES.get(next_state, set())
    if entity.status not in allowed:
        return (
            jsonify(
                {
                    "error": (
                        f"Cannot move {entity.status!r} to {next_state!r}. "
                        f"Allowed from: {', '.join(sorted(allowed)) or 'none'}."
                    )
                }
            ),
            409,
        )

    return jsonify({"companyAccount": _apply_transition(entity, next_state).to_dict()}), 200