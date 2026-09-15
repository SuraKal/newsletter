# Newsletter (Nekedem)

Monorepo for the Nekedem newsletter platform. It contains two applications:

- `frontend/` - React + Vite Single Page Application
- `backend/` - Flask API (MySQL, JWT auth, Alembic migrations)

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

> Note: the frontend currently runs auth and data through a `localStorage` mock
> (`frontend/src/api/appClient.js`). Wiring it to the Flask backend is future work.

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