from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
)
from sqlalchemy.exc import IntegrityError

from models import CompanyAccount, db, User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/v1/auth")


def _public_user(user):
    return user.to_dict(include_subscriptions=True)


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    role = data.get("role") or "reader"
    company_name = (data.get("companyName") or "").strip()
    license_document = data.get("licenseDocument") or ""

    if role not in ("reader", "business"):
        return jsonify({"error": "Invalid role"}), 400
    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required"}), 400
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400
    if role == "business":
        if not company_name:
            return jsonify({"error": "Company name is required"}), 400
        if not isinstance(license_document, str) or not license_document.startswith("data:"):
            return jsonify({"error": "A business licence upload is required"}), 400
        if len(license_document) > 7_000_000:
            return jsonify({"error": "Business licence must be 5 MB or smaller"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    user = User(
        name=name,
        email=email,
        role=role,
        account_type="business" if role == "business" else "individual",
        company_name=company_name,
        business_access_approved=role != "business",
    )
    user.set_password(password)
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Email already registered"}), 409

    if role == "business":
        db.session.add(
            CompanyAccount(
                company=company_name,
                status="License submitted",
                owner_user_id=user.id,
                owner_email=user.email,
                work_email=user.email,
                license_document=license_document,
                lead={"primaryContact": name, "workEmail": email},
            )
        )
        db.session.commit()
        return jsonify({"user": _public_user(user), "pendingApproval": True}), 201

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role},
    )
    return jsonify({"accessToken": access_token, "user": _public_user(user)}), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401
    if user.role == "business" and not user.business_access_approved:
        return jsonify({"error": "Your business licence is awaiting admin approval"}), 403

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role},
    )
    return jsonify({"accessToken": access_token, "user": _public_user(user)}), 200


@auth_bp.get("/me")
@jwt_required()
def me():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": _public_user(user)}), 200


_PROFILE_FIELD_MAP = {
    "name": "name",
    "contactPhone": "contact_phone",
    "deliveryAddress": "delivery_address",
    "city": "city",
    "postalCode": "postal_code",
    "country": "country",
}


@auth_bp.put("/me")
@jwt_required()
def update_me():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json(silent=True) or {}
    for field, column in _PROFILE_FIELD_MAP.items():
        if field not in data:
            continue
        value = (data.get(field) or "").strip()
        if field == "name" and not value:
            return jsonify({"error": "Name is required"}), 400
        setattr(user, column, value or None)

    db.session.commit()
    return jsonify({"user": _public_user(user)}), 200
