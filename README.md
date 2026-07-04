# Newsletter UI

This project now runs as a standard Vite frontend with no Base44 dependency.

## Prerequisites

1. Clone the repository.
2. Open the project directory.
3. Install dependencies with `npm install`.

## Run Locally

Start the frontend dev server:

```bash
npm run dev
```

Open the local URL printed by Vite.

## Environment Setup

Create or update `.env` in the project root with local demo values:

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

The app seeds a local admin user and a local reader user in `localStorage` using these values.

## Available Scripts

- `npm run dev`: start the Vite dev server
- `npm run build`: create a production build
- `npm run lint`: run ESLint
- `npm run typecheck`: run project checks

## Local Auth Notes

- Sign in with the reader or admin credentials from `.env`
- Register creates additional users in browser `localStorage`
- Forgot password creates a local demo reset token named `demo`
- Reset password works locally at `/reset-password?token=demo`
