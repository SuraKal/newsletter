# Nekedem Backend

Flask backend for the Nekedem newsletter application.

## Stack

- Flask 3.x
- Flask-SQLAlchemy (MySQL via PyMySQL)
- Flask-Migrate (Alembic migrations)
- Flask-JWT-Extended (auth)
- Flask-CORS

## Setup

```bash
# 1. Create the database (one time)
mysql -u root -e "CREATE DATABASE IF NOT EXISTS nekedem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Install dependencies
pip install -r requirements.txt

# 3. Copy env defaults
cp .env.example .env   # then edit credentials if needed

# 4. Run the server (port 5050)
python app.py
```

## Migrations

Migrations are versioned with Alembic.

```bash
$env:FLASK_APP = "app.py"

# Create a new migration after adding models:
flask db migrate -m "describe the change"

# Apply migrations to the database:
flask db upgrade
```

> After `flask db upgrade`, seed demo data (auth credentials, subscription
> plans, article templates, and the default categories) with `flask seed`.
> Add SQLAlchemy models in `models/` (e.g. `models/user.py`), register them,
> then run `flask db migrate`.

## Conventions

- All API routes are prefixed with `/api/v1/`
- JSON in, JSON out
- JWT passed as `Authorization: Bearer <token>`
- Role guards via `@role_required("admin")` from `middleware/auth.py`

## Ports

- Flask dev server: `http://localhost:5050`
- Frontend Vite proxy forwards `/api/*` to port 5050
  (see `frontend/vite.config.ts`)