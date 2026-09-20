import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

from models import db
from config import config_by_name
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
from seed import seed_command


def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "development")

    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    db.init_app(app)
    CORS(app)
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
    app.cli.add_command(seed_command)

    @app.route("/api/v1/health")
    def health():
        return jsonify({"status": "ok"})

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5050)