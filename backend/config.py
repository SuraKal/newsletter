import os
from pathlib import Path

from dotenv import load_dotenv


# Passenger starts from the application root, which is not necessarily the
# backend directory. Load this application's environment explicitly so a
# server-side `backend/.env` is honoured in both local Flask and Passenger.
load_dotenv(Path(__file__).resolve().parent / ".env")


class Config:
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "dev-secret-change-in-production")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://root@localhost:3306/nekedem",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-dev-secret-change-in-production")
    JWT_ACCESS_TOKEN_EXPIRES = 3600


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


def validate_production_environment():
    """Fail closed when an unsafe or incomplete production configuration is used."""
    required = ("FLASK_SECRET_KEY", "JWT_SECRET_KEY", "DATABASE_URL")
    missing = [key for key in required if not os.getenv(key)]
    unsafe = [
        key
        for key in ("FLASK_SECRET_KEY", "JWT_SECRET_KEY")
        if os.getenv(key, "").startswith(("dev-", "jwt-dev-"))
    ]
    if missing or unsafe:
        details = []
        if missing:
            details.append(f"missing: {', '.join(missing)}")
        if unsafe:
            details.append(f"unsafe development values: {', '.join(unsafe)}")
        raise RuntimeError(
            "Production environment is not configured (" + "; ".join(details) + ")."
        )


config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
}
