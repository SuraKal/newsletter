# Nequdem Local App

Use this repository to run and edit the app locally without any Base44 backend.

## Prerequisites

1. Clone the repository using the project's Git URL.
2. Navigate to the project directory.
3. Install dependencies: `npm install`.

## Run Locally

Run the app from the project root:

```bash
npm run dev
```

Open the local URL printed by Vite.

## Local Env

The repo includes a local `.env` with demo credentials for the built-in auth flow.

Demo accounts:

- Admin: `admin@nequdem.local` / `admin12345`
- Reader: `reader@nequdem.local` / `reader12345`
- Business: `business@nequdem.local` / `business12345`
- Google demo sign-in: `google.user@nequdem.local`

The register flow uses the demo OTP `123456`.
