import re
from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from middleware.auth import role_required
from models import SiteSetting, db

settings_bp = Blueprint("settings", __name__, url_prefix="/api/v1")
admin_settings_bp = Blueprint("admin_settings", __name__, url_prefix="/api/v1/admin")

USER_GUIDE_VIDEO_KEY = "user_guide_video"
DEFAULT_USER_GUIDE_VIDEO_ID = "maxhtw0ncsc"

# Story YouTube embeds from either a share/watch URL or the full <iframe>
# embed snippet an admin pastes from the YouTube share dialog.
_YOUTUBE_ID_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")
_WATCH_URL_RE = re.compile(
    r"(?:youtube\.com/(?:watch\?[^\"'\s]*v=|embed/|shorts/|live/|v/)"
    r"|youtu\.be/)([A-Za-z0-9_-]{11})"
)
_IFRAME_SRC_RE = re.compile(r'iframe[^>]*\bsrc=["\']([^"\']+)["\']', re.IGNORECASE)


def _extract_youtube_id(raw):
    """Return the video id if `raw` is a YouTube watch URL or iframe snippet."""
    if not raw:
        return None
    text = str(raw).strip()
    match = _WATCH_URL_RE.search(text)
    if match:
        return match.group(1)
    src = _IFRAME_SRC_RE.search(text)
    if src:
        match = _WATCH_URL_RE.search(src.group(1))
        if match:
            return match.group(1)
    # A bare video id is accepted so admins can paste either form.
    if _YOUTUBE_ID_RE.match(text):
        return text
    return None


def _embed_src(video_id):
    return f"https://www.youtube.com/embed/{video_id}"


def _get_setting(key, default_raw):
    row = db.session.get(SiteSetting, key)
    raw = row.value if row is not None and row.value else default_raw
    video_id = _extract_youtube_id(raw) or DEFAULT_USER_GUIDE_VIDEO_ID
    return {
        "raw": raw,
        "videoId": video_id,
        "embedSrc": _embed_src(video_id),
    }


@settings_bp.get("/settings/user-guide-video")
def get_user_guide_video():
    """Public feed used by the home-page guide section.

    Falls back to the seeded default when the admin has not customized it.
    """
    video = _get_setting(USER_GUIDE_VIDEO_KEY, f"https://www.youtube.com/watch?v={DEFAULT_USER_GUIDE_VIDEO_ID}")
    return jsonify({"video": video}), 200


@admin_settings_bp.put("/settings/user-guide-video")
@jwt_required()
@role_required("admin")
def update_user_guide_video():
    """Persist either a plain YouTube URL or a copied <iframe> embed snippet."""
    data = request.get_json(silent=True) or {}
    raw = str(data.get("raw") or "").strip()
    video_id = _extract_youtube_id(raw)
    if not video_id:
        return jsonify({"error": "No YouTube video detected"}), 400

    row = db.session.get(SiteSetting, USER_GUIDE_VIDEO_KEY)
    if row is None:
        row = SiteSetting(key=USER_GUIDE_VIDEO_KEY)
        db.session.add(row)
    row.value = raw
    row.updated_at = datetime.utcnow()
    db.session.commit()

    return (
        jsonify(
            {
                "video": {
                    "raw": row.value,
                    "videoId": video_id,
                    "embedSrc": _embed_src(video_id),
                }
            }
        ),
        200,
    )