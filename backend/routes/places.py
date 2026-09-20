import os
import requests
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

places_bp = Blueprint("places", __name__, url_prefix="/api/v1")


@places_bp.get("/places/autocomplete")
@jwt_required()
def places_autocomplete():
    """Proxy Geoapify autocomplete to keep API key server-side."""
    query = (request.args.get("text") or "").strip()
    if not query:
        return jsonify({"features": []}), 200

    api_key = os.getenv("GEOAPIFY_API_KEY")
    base_url = os.getenv("GEOAPIFY_AUTOCOMPLETE_URL", "https://api.geoapify.com/v1/geocode/autocomplete")

    if not api_key:
        return jsonify({"error": "Geocoding not configured"}), 503

    params = {
        "text": query,
        "apiKey": api_key,
        "limit": 10,
        "format": "geojson",
    }

    try:
        resp = requests.get(base_url, params=params, timeout=5)
        resp.raise_for_status()
        return jsonify(resp.json()), 200
    except requests.RequestException as e:
        return jsonify({"error": "Geocoding request failed", "detail": str(e)}), 502


@places_bp.get("/places/detail")
@jwt_required()
def places_detail():
    """Proxy Geoapify place details."""
    place_id = (request.args.get("id") or "").strip()
    if not place_id:
        return jsonify({"error": "Place id required"}), 400

    api_key = os.getenv("GEOAPIFY_API_KEY")
    base_url = os.getenv("GEOAPIFY_PLACE_DETAIL_URL", "https://api.geoapify.com/v2/place-details")

    if not api_key:
        return jsonify({"error": "Geocoding not configured"}), 503

    params = {"id": place_id, "apiKey": api_key}

    try:
        resp = requests.get(base_url, params=params, timeout=5)
        resp.raise_for_status()
        return jsonify(resp.json()), 200
    except requests.RequestException as e:
        return jsonify({"error": "Place detail request failed", "detail": str(e)}), 502