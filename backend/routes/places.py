import os
import requests
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

places_bp = Blueprint("places", __name__, url_prefix="/api/v1")

# Geoapify raster tile endpoint used by the Leaflet maps on the admin shipment
# workspace. The key is only returned to authenticated users so the dashboard
# maps stay live without shipping a client-side secret.
GEOAPIFY_TILE_STYLE = os.getenv("GEOAPIFY_TILE_STYLE", "osm-bright-smooth")
GEOAPIFY_TILE_URL = (
    "https://maps.geoapify.com/v1/tile/"
    + GEOAPIFY_TILE_STYLE
    + "/{z}/{x}/{y}.png?apiKey={apiKey}"
)
GEOAPIFY_ATTRIBUTION = (
    'Powered by <a href="https://www.geoapify.com/" target="_blank" '
    'rel="noopener">Geoapify</a> | '
    '<a href="https://openmaptiles.org/" target="_blank" rel="noopener">'
    "© OpenMapTiles</a> "
    '<a href="https://www.openstreetmap.org/copyright" target="_blank" '
    'rel="noopener">© OpenStreetMap</a> contributors'
)


def _geoapify_key():
    return os.getenv("GEOAPIFY_API_KEY", "").strip()


def _geocode_params(**extra):
    api_key = _geoapify_key()
    if not api_key:
        return None
    return {"apiKey": api_key, "format": "geojson", **extra}


def _proxy_get(base_url, params, error_message):
    """Shared Geoapify proxy request keeping the API key server-side."""
    if params is None:
        return jsonify({"error": "Geocoding not configured"}), 503
    try:
        resp = requests.get(base_url, params=params, timeout=6)
        resp.raise_for_status()
        return jsonify(resp.json()), 200
    except requests.RequestException as e:
        return jsonify({"error": error_message, "detail": str(e)}), 502


@places_bp.get("/places/autocomplete")
def places_autocomplete():
    """Proxy Geoapify autocomplete to keep API key server-side."""
    query = (request.args.get("text") or "").strip()
    if not query:
        return jsonify({"features": []}), 200

    base_url = os.getenv(
        "GEOAPIFY_AUTOCOMPLETE_URL",
        "https://api.geoapify.com/v1/geocode/autocomplete",
    )
    return _proxy_get(
        base_url,
        _geocode_params(text=query, limit=10),
        "Geocoding request failed",
    )


@places_bp.get("/places/geocode")
def places_geocode():
    """Proxy Geoapify forward geocoding for text addresses.

    Reader delivery profiles only store a city/country address, so the admin
    shipment maps resolve those destinations to coordinates through this
    endpoint without exposing the Geoapify key to the browser.
    """
    text = (request.args.get("text") or "").strip()
    if not text:
        return jsonify({"error": "Text address required"}), 400

    base_url = os.getenv(
        "GEOAPIFY_GEOCODING_URL",
        "https://api.geoapify.com/v1/geocode/search",
    )
    return _proxy_get(
        base_url,
        _geocode_params(text=text, limit=5),
        "Geocoding request failed",
    )


@places_bp.get("/places/reverse")
def places_reverse():
    """Proxy Geoapify reverse geocoding for a coordinate pair."""
    try:
        latitude = float(request.args.get("lat"))
        longitude = float(request.args.get("lon"))
    except (TypeError, ValueError):
        return jsonify({"error": "Valid lat/lon required"}), 400
    if not (-90 <= latitude <= 90 and -180 <= longitude <= 180):
        return jsonify({"error": "Coordinates out of range"}), 400

    base_url = os.getenv(
        "GEOAPIFY_REVERSE_GEOCODING_URL",
        "https://api.geoapify.com/v1/geocode/reverse",
    )
    return _proxy_get(
        base_url,
        _geocode_params(lat=latitude, lon=longitude, limit=1),
        "Reverse geocoding request failed",
    )


@places_bp.get("/maps/config")
@jwt_required()
def maps_config():
    """Return the Geoapify tile configuration used by the dashboard maps."""
    api_key = _geoapify_key()
    return (
        jsonify(
            {
                "provider": "geoapify",
                "apiKey": api_key,
                "tileStyle": GEOAPIFY_TILE_STYLE,
                "tileUrl": GEOAPIFY_TILE_URL,
                "attribution": GEOAPIFY_ATTRIBUTION,
            }
        ),
        200,
    )


@places_bp.get("/places/detail")
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