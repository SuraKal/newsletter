from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from middleware.auth import role_required
from models import LegalPage, db
from models.legal_page import LEGAL_PAGE_KEYS
from seed import SEEDED_LEGAL_PAGES

legal_bp = Blueprint("legal", __name__, url_prefix="/api/v1")
admin_legal_bp = Blueprint("admin_legal", __name__, url_prefix="/api/v1/admin")


def _clean_text(value, max_length=2000):
    return str(value or "").strip()[:max_length]


def _clean_blocks(blocks, allowed_keys):
    """Normalise a JSON list of ``{heading/body/items/...}`` blocks.

    Returns ``(clean_list, error)``. Unknown keys are dropped, blocks with no
    usable content are skipped, and anything that is not a list of objects is
    rejected so the admin editor cannot store malformed content.
    """
    if blocks in (None, ""):
        return [], None
    if not isinstance(blocks, list):
        return None, "Content blocks must be a list"

    cleaned = []
    for block in blocks:
        if not isinstance(block, dict):
            return None, "Each content block must be an object"
        item = {}
        if "heading" in allowed_keys and block.get("heading"):
            item["heading"] = _clean_text(block.get("heading"), 300)
        if "body" in allowed_keys and block.get("body"):
            item["body"] = _clean_text(block.get("body"))
        if "items" in allowed_keys and block.get("items"):
            items = block["items"]
            if not isinstance(items, list):
                return None, "Clause items must be a list"
            item["items"] = [
                _clean_text(bullet, 2000)
                for bullet in items
                if _clean_text(bullet, 2000)
            ]
        if "email" in allowed_keys and block.get("email"):
            item["email"] = _clean_text(block.get("email"), 300)
        if item:
            cleaned.append(item)
    return cleaned, None


def _apply_legal_payload(page, data):
    """Copy camelCase legal-page fields onto `page`. Returns an error or None."""
    if "eyebrow" in data:
        page.eyebrow = _clean_text(data.get("eyebrow"), 300)
    if "title" in data:
        page.title = _clean_text(data.get("title"), 300)
    if "intro" in data:
        page.intro = _clean_text(data.get("intro"))
    if "lastUpdated" in data:
        page.last_updated = _clean_text(data.get("lastUpdated"), 100)
    if "published" in data:
        page.published = bool(data["published"])

    for field, allowed_keys in (
        ("sections", {"heading", "body"}),
        ("clauses", {"heading", "items"}),
        ("contacts", {"label", "email"}),
    ):
        if field not in data:
            continue
        cleaned, error = _clean_blocks(data.get(field), allowed_keys)
        if error:
            return error
        setattr(page, field, cleaned)

    return None


def _page_or_404(page_key):
    page = db.session.get(LegalPage, page_key)
    if page is None:
        return None
    return page


@legal_bp.get("/legal")
def list_legal():
    pages = LegalPage.query.filter_by(published=True).order_by(LegalPage.id).all()
    return jsonify({"pages": [page.to_dict() for page in pages]}), 200


@legal_bp.get("/legal/<string:page_id>")
def get_legal(page_id):
    page = db.session.get(LegalPage, page_id)
    if page is None or not page.published:
        return jsonify({"error": "Legal page not found"}), 404
    return jsonify({"page": page.to_dict()}), 200


@admin_legal_bp.get("/legal-pages")
@jwt_required()
@role_required("admin")
def admin_list_legal():
    pages = LegalPage.query.order_by(LegalPage.id).all()
    return jsonify({"pages": [page.to_dict() for page in pages]}), 200


@admin_legal_bp.put("/legal-pages/<string:page_id>")
@jwt_required()
@role_required("admin")
def admin_update_legal(page_id):
    if page_id not in LEGAL_PAGE_KEYS:
        return jsonify({"error": "Unknown legal page key"}), 404

    page = _page_or_404(page_id)
    if page is None:
        page = LegalPage(id=page_id)

    data = request.get_json(silent=True) or {}
    error = _apply_legal_payload(page, data)
    if error:
        return jsonify({"error": error}), 400
    if not str(page.title or "").strip():
        return jsonify({"error": "A page title is required"}), 400

    db.session.add(page)
    db.session.commit()
    return jsonify({"page": page.to_dict()}), 200


@admin_legal_bp.post("/legal-pages/<string:page_id>/reset")
@jwt_required()
@role_required("admin")
def admin_reset_legal(page_id):
    page = db.session.get(LegalPage, page_id)
    if page is None:
        return jsonify({"error": "Legal page not found"}), 404

    seed_data = SEEDED_LEGAL_PAGES.get(page_id)
    if seed_data is None:
        return jsonify({"error": "This page has no seed content"}), 404

    error = _apply_legal_payload(page, seed_data)
    if error:
        return jsonify({"error": error}), 400
    db.session.commit()
    return jsonify({"page": page.to_dict()}), 200