from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError

from middleware.auth import role_required
from models import ArticleTemplate, Category, Subcategory, db
from models.category import slugify

categories_bp = Blueprint("categories", __name__, url_prefix="/api/v1")

DEFAULT_TEMPLATE_KEY = "feature"


def _find_category(key):
    category = db.session.get(Category, key)
    if category is None:
        category = Category.query.filter_by(slug=key).first()
    return category


def _normalize_subcategories(value):
    """Normalize `subcategories` payload into a list of (id_or_None, label) pairs."""
    if value is None:
        return []
    if not isinstance(value, list):
        return {"error": "Subcategories must be a list"}
    items = []
    seen = set()
    for item in value:
        sub_id = item.get("id") if isinstance(item, dict) else None
        label = ((item.get("label") if isinstance(item, dict) else item) or "").strip()
        if not label:
            return {"error": "Subcategory labels cannot be blank"}
        lowered = label.lower()
        if lowered in seen:
            return {"error": f"Duplicate subcategory label '{label}'"}
        seen.add(lowered)
        items.append((sub_id, label))
    return items


def _apply_subcategories(category, value):
    """Upsert/delete subcategories so the stored list matches the payload."""
    items = _normalize_subcategories(value)
    if isinstance(items, dict):
        return items

    existing = {sub.id: sub for sub in category.subcategories}
    by_label = {sub.label.lower(): sub for sub in category.subcategories}

    for sub_id, label in items:
        if sub_id is not None and sub_id in existing:
            if (
                existing[sub_id].label.lower() != label.lower()
                and label.lower() in by_label
            ):
                return {"error": f"Subcategory label '{label}' already exists"}
        elif label.lower() in by_label:
            return {"error": f"Subcategory label '{label}' already exists"}

    keep_ids = set()
    for index, (sub_id, label) in enumerate(items):
        if sub_id is not None and sub_id in existing:
            sub = existing[sub_id]
        else:
            sub = Subcategory(category_id=category.id, slug=slugify(label))
            category.subcategories.append(sub)
        sub.label = label
        sub.slug = slugify(label)
        sub.sort_order = index + 1
        keep_ids.add(sub.id)

    for sub in existing.values():
        if sub.id not in keep_ids:
            db.session.delete(sub)

    return None


@categories_bp.get("/categories")
def list_categories():
    categories = Category.query.order_by(Category.sort_order, Category.label).all()
    return jsonify({"categories": [category.to_dict() for category in categories]}), 200


@categories_bp.get("/categories/<string:key>")
def get_category(key):
    category = _find_category(key)
    if category is None:
        return jsonify({"error": "Category not found"}), 404
    return jsonify({"category": category.to_dict()}), 200


@categories_bp.post("/admin/categories")
@jwt_required()
@role_required("admin")
def create_category():
    data = request.get_json(silent=True) or {}
    label = (data.get("label") or "").strip()
    if not label:
        return jsonify({"error": "Category label is required"}), 400

    template_key = data.get("templateKey") or DEFAULT_TEMPLATE_KEY
    if ArticleTemplate.query.filter_by(key=template_key).first() is None:
        return jsonify({"error": f"Unknown template '{template_key}'"}), 400

    slug = slugify(label)
    if Category.query.filter_by(slug=slug).first():
        return jsonify({"error": "A category with this label already exists"}), 409

    max_order = db.session.query(db.func.max(Category.sort_order)).scalar() or 0
    category = Category(
        label=label,
        slug=slug,
        image=(data.get("image") or "").strip() or None,
        template_key=template_key,
        sort_order=max_order + 1,
    )
    db.session.add(category)
    db.session.flush()

    error = _apply_subcategories(category, data.get("subcategories"))
    if error:
        db.session.rollback()
        return jsonify(error), 400

    db.session.commit()
    return jsonify({"category": category.to_dict()}), 201


@categories_bp.put("/admin/categories/<string:key>")
@jwt_required()
@role_required("admin")
def update_category(key):
    category = _find_category(key)
    if category is None:
        return jsonify({"error": "Category not found"}), 404

    data = request.get_json(silent=True) or {}

    if "label" in data:
        label = (data.get("label") or "").strip()
        if not label:
            return jsonify({"error": "Category label cannot be blank"}), 400
        if label.lower() != category.label.lower():
            slug = slugify(label)
            conflict = Category.query.filter(
                Category.slug == slug, Category.id != category.id
            ).first()
            if conflict:
                return jsonify({"error": "A category with this label already exists"}), 409
            category.label = label
            category.slug = slug

    if "image" in data:
        category.image = (data.get("image") or "").strip() or None

    if "templateKey" in data:
        template_key = data.get("templateKey") or ""
        if ArticleTemplate.query.filter_by(key=template_key).first() is None:
            return jsonify({"error": f"Unknown template '{template_key}'"}), 400
        category.template_key = template_key

    if "sortOrder" in data:
        try:
            category.sort_order = int(data["sortOrder"])
        except (TypeError, ValueError):
            return jsonify({"error": "sortOrder must be an integer"}), 400

    if "subcategories" in data:
        error = _apply_subcategories(category, data["subcategories"])
        if error:
            db.session.rollback()
            return jsonify(error), 400

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "A category or subcategory with this label already exists"}), 409

    return jsonify({"category": category.to_dict()}), 200


@categories_bp.delete("/admin/categories/<string:key>")
@jwt_required()
@role_required("admin")
def delete_category(key):
    category = _find_category(key)
    if category is None:
        return jsonify({"error": "Category not found"}), 404

    db.session.delete(category)
    db.session.commit()
    return jsonify({"ok": True}), 200


@categories_bp.put("/admin/categories/<string:key>/order")
@jwt_required()
@role_required("admin")
def reorder_category(key):
    category = _find_category(key)
    if category is None:
        return jsonify({"error": "Category not found"}), 404

    data = request.get_json(silent=True) or {}
    try:
        sort_order = int(data.get("sortOrder"))
    except (TypeError, ValueError):
        return jsonify({"error": "sortOrder must be an integer"}), 400

    category.sort_order = sort_order
    db.session.commit()
    return jsonify({"category": category.to_dict()}), 200