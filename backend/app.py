import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

from models import db
from config import config_by_name
from routes.auth import auth_bp
from routes.categories import categories_bp
from routes.subscriptions import subscriptions_bp
from routes.templates import templates_bp
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
    app.register_blueprint(templates_bp)
    app.register_blueprint(categories_bp)
    app.cli.add_command(seed_command)

    @app.route("/api/v1/health")
    def health():
        return jsonify({"status": "ok"})

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5050)