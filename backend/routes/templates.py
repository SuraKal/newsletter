from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from middleware.auth import role_required
from models import ArticleTemplate, db

templates_bp = Blueprint("templates", __name__, url_prefix="/api/v1/templates")


@templates_bp.get("")
def list_templates():
    templates = ArticleTemplate.query.order_by(ArticleTemplate.sort_order).all()
    return jsonify({"templates": [t.to_dict() for t in templates]}), 200


@templates_bp.put("/<string:template_key>")
@jwt_required()
@role_required("admin")
def update_template(template_key):
    template = ArticleTemplate.query.filter_by(key=template_key).first()
    if template is None:
        return jsonify({"error": "Template not found"}), 404

    data = request.get_json(silent=True) or {}
    mutable = {"label", "description", "active", "sort_order"}
    for field in mutable:
        if field in data:
            setattr(template, field, data[field])
    db.session.commit()
    return jsonify({"template": template.to_dict()}), 200


@templates_bp.delete("/<string:template_key>")
@jwt_required()
@role_required("admin")
def delete_template(template_key):
    template = ArticleTemplate.query.filter_by(key=template_key).first()
    if template is None:
        return jsonify({"error": "Template not found"}), 404
    db.session.delete(template)
    db.session.commit()
    return jsonify({"ok": True}), 200