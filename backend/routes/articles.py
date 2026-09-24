import time
from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from middleware.auth import role_required
from models import Article, Category, db
from models.article import ARTICLE_SOURCES, ARTICLE_STATUSES

articles_bp = Blueprint("articles", __name__, url_prefix="/api/v1")

DEFAULT_AUTHOR = "Editorial desk"
DEFAULT_EDITOR = "Editorial desk"


def _find_article(key):
    return db.session.get(Article, key)


def _parse_data(data):
    """Convert camelCase API keys to snake_case model fields and validate."""
    if not data:
        return {}, None

    fields = {}
    errors = []

    string_fields = {
        "headline": "headline",
        "summary": "summary",
        "body": "body",
        "image": "image",
        "author": "author",
        "editor": "editor",
        "status": "status",
        "tone": "tone",
        "access_label": "accessLabel",
        "read_time": "readTime",
        "source": "source",
        "category_id": "categoryId",
        "category_label": "categoryLabel",
        "date": "date",
        "public_access_date": "publicAccessDate",
        "access_mode": "accessMode",
        "publish_date": "publishDate",
        "publish_time": "publishTime",
    }

    for model_field, api_key in string_fields.items():
        if api_key in data:
            value = data.get(api_key)
            if isinstance(value, str):
                value = value.strip()
            fields[model_field] = value if value != "" else None

    if "meta" in data and data["meta"] is not None:
        if isinstance(data["meta"], dict):
            fields["meta"] = data["meta"]
        else:
            errors.append("meta must be an object")

    if "clicks" in data and data["clicks"] is not None:
        try:
            fields["clicks"] = int(data["clicks"])
        except (TypeError, ValueError):
            errors.append("clicks must be an integer")

    status = fields.get("status")
    if status is not None and status not in ARTICLE_STATUSES:
        errors.append(f"status must be one of: {', '.join(ARTICLE_STATUSES)}")

    source = fields.get("source")
    if source is not None and source not in ARTICLE_SOURCES:
        errors.append(f"source must be one of: {', '.join(ARTICLE_SOURCES)}")

    return fields, errors or None


def _resolve_category(fields):
    """Resolve categoryId to a Category; derive category_label when missing."""
    category_id = fields.get("category_id")
    category_label = fields.get("category_label")

    if category_id is not None:
        category = db.session.get(Category, category_id)
        if category is None:
            return {"error": f"Category '{category_id}' not found"}
        if not category_label:
            fields["category_label"] = category.label

    if isinstance(fields.get("category_label"), str) and not fields["category_label"].strip():
        fields["category_label"] = None

    return None


@articles_bp.get("/articles")
def list_articles():
    query = Article.query.filter_by(status="Published")
    category = request.args.get("category")
    if category:
        like = category.lower()
        query = query.filter(
            db.or_(
                db.func.lower(Article.category_label) == like,
                Article.category_id == category,
            )
        )
    source = request.args.get("source")
    if source:
        query = query.filter_by(source=source)
    articles = query.order_by(Article.publish_date.desc(), Article.created_at.desc()).all()
    return jsonify({"articles": [article.to_dict() for article in articles]}), 200


@articles_bp.get("/articles/<string:key>")
def get_article(key):
    article = _find_article(key)
    if article is None or article.status != "Published":
        return jsonify({"error": "Article not found"}), 404
    return jsonify({"article": article.to_dict()}), 200


# Cooldown so rapid refreshes by the same visitor do not inflate the article
# visibility count. Keyed on client identity + article id.
_VIEW_COOLDOWN_SECONDS = 60 * 15
_recent_views = {}


def _counts_as_new_visit(key, now=None):
    now = now if now is not None else time.time()
    cutoff = now - _VIEW_COOLDOWN_SECONDS
    for existing in tuple(_recent_views.keys()):
        if _recent_views[existing] < cutoff:
            del _recent_views[existing]
    if key in _recent_views:
        return False
    _recent_views[key] = now
    return True


@articles_bp.post("/articles/<string:key>/view")
def register_article_view(key):
    article = _find_article(key)
    if article is None or article.status != "Published":
        return jsonify({"error": "Article not found"}), 404

    client_ip = request.headers.get("X-Forwarded-For", request.remote_addr)
    if _counts_as_new_visit((client_ip, article.id)):
        article.clicks = (article.clicks or 0) + 1
        db.session.commit()
    return jsonify({"article": article.to_dict()}), 200


@articles_bp.get("/admin/articles")
@jwt_required()
@role_required("admin")
def admin_list_articles():
    articles = Article.query.order_by(Article.publish_date.desc(), Article.created_at.desc()).all()
    return jsonify({"articles": [article.to_dict() for article in articles]}), 200


@articles_bp.post("/admin/articles")
@jwt_required()
@role_required("admin")
def create_article():
    data = request.get_json(silent=True) or {}
    fields, errors = _parse_data(data)
    if errors:
        return jsonify({"error": "; ".join(errors)}), 400

    headline = fields.get("headline")
    if not headline:
        return jsonify({"error": "Article headline is required"}), 400

    error = _resolve_category(fields)
    if error:
        return jsonify(error), 400

    article = Article(
        headline=headline.strip(),
        summary=fields.get("summary"),
        body=fields.get("body"),
        image=fields.get("image"),
        author=fields.get("author") or DEFAULT_AUTHOR,
        editor=fields.get("editor") or DEFAULT_EDITOR,
        status=fields.get("status") or "Draft",
        tone=fields.get("tone") or "neutral",
        access_label=fields.get("access_label"),
        read_time=fields.get("read_time"),
        source=fields.get("source") or "latest",
        category_id=fields.get("category_id"),
        category_label=fields.get("category_label"),
        date=fields.get("date"),
        public_access_date=fields.get("public_access_date"),
        publish_date=fields.get("publish_date"),
        publish_time=fields.get("publish_time"),
        clicks=fields.get("clicks") or 0,
        access_mode=fields.get("access_mode") or "auto",
        meta=fields.get("meta") or {},
    )
    db.session.add(article)
    db.session.commit()
    return jsonify({"article": article.to_dict()}), 201


@articles_bp.put("/admin/articles/<string:key>")
@jwt_required()
@role_required("admin")
def update_article(key):
    article = _find_article(key)
    if article is None:
        return jsonify({"error": "Article not found"}), 404

    data = request.get_json(silent=True) or {}
    fields, errors = _parse_data(data)
    if errors:
        return jsonify({"error": "; ".join(errors)}), 400

    if "headline" in fields:
        if not fields["headline"]:
            return jsonify({"error": "Article headline cannot be blank"}), 400
        article.headline = fields["headline"].strip()

    for field in (
        "summary",
        "body",
        "image",
        "author",
        "editor",
        "status",
        "tone",
        "access_label",
        "read_time",
        "source",
        "category_label",
        "date",
        "public_access_date",
        "publish_date",
        "publish_time",
        "access_mode",
        "clicks",
        "meta",
    ):
        if field in fields:
            setattr(article, field, fields[field])

    if "category_id" in fields:
        article.category_id = fields["category_id"]
        error = _resolve_category(fields)
        if error:
            db.session.rollback()
            return jsonify(error), 400
        article.category_label = fields.get("category_label")

    if article.status == "Published" and not article.publish_date:
        article.publish_date = datetime.now().strftime("%B %d, %Y")

    db.session.commit()
    return jsonify({"article": article.to_dict()}), 200


@articles_bp.delete("/admin/articles/<string:key>")
@jwt_required()
@role_required("admin")
def delete_article(key):
    article = _find_article(key)
    if article is None:
        return jsonify({"error": "Article not found"}), 404

    db.session.delete(article)
    db.session.commit()
    return jsonify({"ok": True}), 200


@articles_bp.post("/admin/articles/<string:key>/publish")
@jwt_required()
@role_required("admin")
def publish_article(key):
    article = _find_article(key)
    if article is None:
        return jsonify({"error": "Article not found"}), 404

    if not (article.headline or "").strip():
        return jsonify({"error": "Add a headline before publishing this article."}), 400

    article.status = "Published"
    if not article.publish_date:
        article.publish_date = datetime.now().strftime("%B %d, %Y")
    db.session.commit()
    return jsonify({"article": article.to_dict()}), 200


@articles_bp.post("/admin/articles/<string:key>/unpublish")
@jwt_required()
@role_required("admin")
def unpublish_article(key):
    article = _find_article(key)
    if article is None:
        return jsonify({"error": "Article not found"}), 404

    article.status = "Draft"
    db.session.commit()
    return jsonify({"article": article.to_dict()}), 200