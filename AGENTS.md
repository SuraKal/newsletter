# AGENTS.md

## Project Context

This is a monorepo for the Nekedem newsletter platform. Treat it as user-owned
application code, keep changes focused on the user's request, and preserve
existing project conventions.

- `frontend/`: React + Vite Single Page Application (no Base44 dependency).
- `backend/`: Flask API (MySQL, JWT auth, Alembic migrations).
- `base44/`: leftover Base44 entity definitions; no longer wired into the app.

Start with `README.md` for local setup, environment variables, and run workflow.

## Base44 References

- CLI overview: https://docs.base44.com/developers/references/cli/get-started/overview.md
- Agent skills: https://docs.base44.com/developers/backend/overview/skills.md

If your agent supports Agent Skills, install or update Base44 skills before
Base44-specific work:

```bash
npx skills add base44/skills
```

> Note: the frontend currently ships as a plain Vite app. Only use Base44
> knowledge if work explicitly targets the leftover `base44/` files.

## Key Files

- `frontend/src/`: frontend application source.
- `frontend/src/api/appClient.js`: frontend app client. Auth and subscription-plans
  reads hit the Flask backend (`frontend/src/api/backendClient.js`) with a
  graceful `localStorage` fallback; account, company, admin, pricing, checkout,
  and delivery surfaces are still mocked and wired block by block.
- `frontend/vite.config.ts`: Vite config. It proxies `/api/*` to the Flask
  backend at `http://localhost:5050`.
- `frontend/.env`: local-only frontend environment values; never commit secrets.
- `backend/`: Flask application (see `backend/README.md`).
- `backend/.env`: local-only backend environment values; never commit secrets.

## Working Notes

- Backend: run `python app.py` from `backend/` (port 5050). See
  `backend/README.md` for database setup and migrations.
- Frontend: run `npm run dev` from `frontend/` for frontend-only work against
  the local mock client, or start the backend as well and use `/api` through
  the Vite proxy.
- Run the relevant checks from `frontend/package.json` (`npm run lint`,
  `npm run typecheck`, `npm run build`) before finishing frontend code changes.