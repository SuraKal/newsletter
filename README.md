# Newsletter (Nekedem)

Monorepo for the Nekedem newsletter platform. It contains two applications:

- `frontend/` - React + Vite Single Page Application
- `backend/` - Flask API (MySQL, JWT auth, Alembic migrations)

## Quick Start (backend + frontend)

Run the two services in separate terminals from the repo root.

### 1. Start the backend

```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS nekedem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
cd backend
pip install -r requirements.txt
cp .env.example .env   # first time only; edit credentials if needed
python app.py          # serves http://localhost:5050
```

After the server is up, apply migrations and seed once:

```bash
cd backend
$env:FLASK_APP = "app.py"
flask db upgrade
flask seed
python app.py  
```

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev            # serves http://localhost:5173
```

Open the local URL printed by Vite. The Vite dev server proxies `/api/*` to the
Flask backend at `http://localhost:5050` (see `frontend/vite.config.ts`), so the
site reads categories, subscription plans, and auth from the backend.

> If the backend is offline, the frontend automatically falls back to its
> `localStorage` mock for auth, plans, and categories, so the app still works.
> Start both together for the full wired experience.

### Verify both are running

- Backend health check: open `http://localhost:5050/api/v1/health` → `{"status":"ok"}`
- Frontend: open the Vite URL and browse the site (e.g. `/categories`)

## Frontend

The frontend is a standard Vite app with no Base44 dependency.

### Prerequisites

1. Clone the repository.
2. Open the project directory.
3. Install dependencies with `npm install` from `frontend/`.

### Run Locally

Start the frontend dev server (proxy forwards `/api` to the backend on port 5050):

```bash
cd frontend
npm run dev
```

Open the local URL printed by Vite.

### Environment Setup

Create or update `frontend/.env` with local demo values:

```bash
VITE_APP_NAME=ንቐደም
VITE_STORAGE_PREFIX=ንቐደም
VITE_AUTH_REQUIRED=false
VITE_ADMIN_EMAIL=admin@ንቐደም.local
VITE_ADMIN_PASSWORD=admin12345
VITE_READER_EMAIL=reader@ንቐደም.local
VITE_READER_PASSWORD=reader12345
VITE_SUPPORT_EMAIL=support@ንቐደም.local
VITE_CONTACT_PHONE=+251900000000
```

> Note: the frontend runs auth and subscription-plan reads through the Flask
> backend when it is reachable (`frontend/src/api/backendClient.js`), and falls
> back to the `localStorage` mock when it is not. The rest of the app client
> (`account.*`, `company.*`, `admin.*`, `businessPricing.*`, checkout, and
> delivery state) is still mocked and is being unwired block by block.

### Available Scripts (run from `frontend/`)

- `npm run dev`: start the Vite dev server
- `npm run build`: create a production build
- `npm run lint`: run ESLint
- `npm run typecheck`: run project checks

### Local Auth Notes

- Sign in with the reader or admin credentials from `.env`
- Register creates additional users in browser `localStorage`
- Forgot password creates a local demo reset token named `demo`
- Reset password works locally at `/reset-password?token=demo`

## Backend

See `backend/README.md` for setup, migrations, and API conventions. The Flask dev
server runs on port 5050.