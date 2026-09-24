import os
from pathlib import Path

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

from models import db
from config import config_by_name, validate_production_environment
from routes.auth import auth_bp
from routes.articles import articles_bp
from routes.categories import categories_bp
from routes.companies import companies_bp
from routes.subscriptions import admin_subscriptions_bp, subscriptions_bp
from routes.templates import templates_bp
from routes.orders import orders_bp
from routes.locations import locations_bp
from routes.places import places_bp
from routes.shipments import shipments_bp
from routes.business_orders import order_plans_bp
from routes.business_invoices import invoices_bp
from routes.business_overview import business_overview_bp
from routes.business_team import business_team_bp
from routes.admin_overview import admin_overview_bp
from routes.admin_subscribers import admin_subscribers_bp
from routes.reader import reader_bp
from routes.privacy import privacy_bp
from routes.checkout import checkout_bp
from routes.stripe_webhooks import stripe_webhook_bp
from routes.legal import admin_legal_bp, legal_bp
from routes.settings import admin_settings_bp, settings_bp
from seed import seed_command
from reset_db import clean_db_command


def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "development")

    project_root = Path(__file__).resolve().parent.parent
    frontend_dist = project_root / "frontend" / "dist"
    # Serve the Vite build and API from one Passenger application. This avoids
    # a cross-origin API deployment and makes React deep links work on cPanel.
    app = Flask(
        __name__,
        static_folder=str(frontend_dist / "assets"),
        static_url_path="/assets",
    )
    app.config.from_object(config_by_name[config_name])

    if config_name == "production":
        validate_production_environment()

    db.init_app(app)
    if config_name != "production":
        CORS(app)
    else:
        allowed_origins = [
            origin.strip()
            for origin in os.getenv("CORS_ORIGINS", "").split(",")
            if origin.strip()
        ]
        if allowed_origins:
            CORS(app, resources={r"/api/*": {"origins": allowed_origins}})
    JWTManager(app)
    Migrate(app, db)

    app.register_blueprint(auth_bp)
    app.register_blueprint(subscriptions_bp)
    app.register_blueprint(admin_subscriptions_bp)
    app.register_blueprint(templates_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(articles_bp)
    app.register_blueprint(companies_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(locations_bp)
    app.register_blueprint(places_bp)
    app.register_blueprint(shipments_bp)
    app.register_blueprint(order_plans_bp)
    app.register_blueprint(invoices_bp)
    app.register_blueprint(business_overview_bp)
    app.register_blueprint(business_team_bp)
    app.register_blueprint(admin_overview_bp)
    app.register_blueprint(admin_subscribers_bp)
    app.register_blueprint(reader_bp)
    app.register_blueprint(privacy_bp)
    app.register_blueprint(checkout_bp)
    app.register_blueprint(stripe_webhook_bp)
    app.register_blueprint(legal_bp)
    app.register_blueprint(admin_legal_bp)
    app.register_blueprint(settings_bp)
    app.register_blueprint(admin_settings_bp)
    app.cli.add_command(seed_command)
    app.cli.add_command(clean_db_command)

    @app.route("/api/v1/health")
    def health():
        return jsonify({"status": "ok"})

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        """Return Vite assets when present, otherwise preserve SPA routing."""
        if path.startswith("api/"):
            return jsonify({"error": "Not found"}), 404

        index_file = frontend_dist / "index.html"
        if not index_file.is_file():
            return (
                jsonify({"error": "Frontend build is not available on this server."}),
                503,
            )

        requested_file = frontend_dist / path
        if path and requested_file.is_file():
            return send_from_directory(frontend_dist, path)
        return send_from_directory(frontend_dist, "index.html")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5050)
