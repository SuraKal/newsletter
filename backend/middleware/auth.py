from functools import wraps

from flask import jsonify, request
from flask_jwt_extended import (
    get_jwt,
    verify_jwt_in_request,
)


class RoleRequiredError(Exception):
    """Raised when the current user does not have the required role."""


def role_required(role):
    """Guard a route behind JWT auth and a required user role.

    Example:
        @app.route("/admin/only")
        @role_required("admin")
        def admin_only():
            return jsonify({"ok": True})
    """

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user_role = get_jwt().get("role")
            if user_role is None or user_role != role:
                return jsonify({"error": "Forbidden"}), 403
            return fn(*args, **kwargs)

        return wrapper

    return decorator


def register_error_handlers(app):
    @app.errorhandler(RoleRequiredError)
    def handle_role_required(error):
        return jsonify({"error": "Forbidden"}), 403