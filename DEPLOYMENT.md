# cPanel Passenger deployment

This repository deploys as one Passenger application. Flask serves the API at
`/api/v1/*` and the Vite build in `frontend/dist` for every other route. This
keeps the browser and API on the same origin and supports direct React routes
such as `/news` or `/business-dashboard/locations`.

## One-time cPanel setup

1. Create a Python application in cPanel and set its application root to the
   directory that will be supplied as `FTP_SERVER_DIR`.
2. Set the startup file to `passenger_wsgi.py` and the application callable to
   `application`.
3. Create or select the application's Python virtual environment and install
   the backend dependencies:

   ```bash
   cd /path/to/FTP_SERVER_DIR
   /path/to/venv/bin/pip install -r backend/requirements.txt
   ```

4. Create `backend/.env` on the server. It is intentionally excluded from
   deployments and must remain server-owned. At a minimum, configure:

   ```dotenv
   FLASK_ENV=production
   FLASK_SECRET_KEY=<long-random-secret>
   JWT_SECRET_KEY=<different-long-random-secret>
   DATABASE_URL=mysql+pymysql://<user>:<password>@<host>/<database>
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   GEOAPIFY_API_KEY=<server-side-key>
   ```

   `CORS_ORIGINS` is optional. Leave it unset when the web app and API use the
   same domain; set a comma-separated allow-list only if another origin needs
   API access.

5. After the first deployment, run migrations from the application virtual
   environment:

   ```bash
   cd /path/to/FTP_SERVER_DIR/backend
   FLASK_APP=app.py flask db upgrade
   ```

GitHub Actions never receives database, Stripe, Geoapify, Flask, or JWT
credentials. They remain in the server's `backend/.env`.

## GitHub Actions secrets

The workflow requires exactly these six repository or environment secrets:

- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `FTP_PROTOCOL` (`ftp` or `ftps`)
- `FTP_PORT`
- `FTP_SERVER_DIR`

The workflow validates all six values, builds and checks the frontend, uploads
the complete application and compiled `frontend/dist`, preserves server-owned
environment files and virtual environments, and writes `tmp/restart.txt` to
restart Passenger. FTPS certificate verification is enabled.

Deployments run automatically after pushes to `main` and can be started
manually with **Run workflow**.
