from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from models import BusinessTeamMember, CompanyAccount, User, db

business_team_bp = Blueprint("business_team", __name__, url_prefix="/api/v1")


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


@business_team_bp.get("/business/team")
@jwt_required()
def business_list_team():
    user = db.session.get(User, _current_user_id())
    account = _account_for_user(user)
    if user is None or account is None:
        return jsonify({"teamMembers": []}), 200

    members = (
        BusinessTeamMember.query.filter_by(company_account_id=account.id)
        .order_by(BusinessTeamMember.created_at)
        .all()
    )
    return jsonify({"teamMembers": [member.to_dict() for member in members]}), 200


@business_team_bp.post("/business/team/<string:member_id>/activate")
@jwt_required()
def business_activate_team_member(member_id):
    user = db.session.get(User, _current_user_id())
    account = _account_for_user(user)
    member = db.session.get(BusinessTeamMember, member_id)

    if (
        member is None
        or account is None
        or member.company_account_id != account.id
    ):
        return jsonify({"error": "Team member not found"}), 404

    member.status = "Active"
    db.session.commit()
    return jsonify({"teamMember": member.to_dict()}), 200
