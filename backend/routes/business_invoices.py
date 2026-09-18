from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from models import BusinessInvoice, CompanyAccount, User, db

invoices_bp = Blueprint("business_invoices", __name__, url_prefix="/api/v1")


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


@invoices_bp.get("/business/invoices")
@jwt_required()
def business_list_invoices():
    user = db.session.get(User, _current_user_id())
    entity = _account_for_user(user)
    if user is None or entity is None:
        return jsonify({"invoices": []}), 200

    invoices = (
        BusinessInvoice.query.filter_by(company_account_id=entity.id)
        .order_by(BusinessInvoice.created_at)
        .all()
    )
    return jsonify({"invoices": [row.to_dict() for row in invoices]}), 200


@invoices_bp.get("/business/invoices/<string:key>")
@jwt_required()
def business_get_invoice(key):
    user = db.session.get(User, _current_user_id())
    invoice = db.session.get(BusinessInvoice, key)
    entity = _account_for_user(user) if user else None
    if invoice is None or entity is None or invoice.company_account_id != entity.id:
        return jsonify({"error": "Invoice not found"}), 404
    return jsonify({"invoice": invoice.to_dict()}), 200


@invoices_bp.post("/business/invoices/<string:key>/confirm")
@jwt_required()
def business_confirm_invoice(key):
    user = db.session.get(User, _current_user_id())
    invoice = db.session.get(BusinessInvoice, key)
    entity = _account_for_user(user) if user else None
    if invoice is None or entity is None or invoice.company_account_id != entity.id:
        return jsonify({"error": "Invoice not found"}), 404
    if invoice.status != "Review":
        return jsonify({"error": "Only a review invoice can be confirmed"}), 409

    invoice.status = "Reviewed"
    db.session.commit()
    return jsonify({"invoice": invoice.to_dict()}), 200