# Coral Coast Transit — Ticketing System starter

Next.js + TypeScript + Drizzle ORM + Turso (libSQL), intended for deployment on Render.

## Current contents

- Responsive dashboard reading counts and recent records from Turso.
- Ticket form for single, return, weekly, and monthly ticket types.
- Simulated payment records only (no real payment provider).
- Drizzle schema for users, routes, services, passengers, tickets, ticket legs, payments, and audit logs.
- API input validation and ticket number generation.

## Important security status

This is an initial development starter, **not production-ready**. Real authentication and authorization are not yet integrated. The API deliberately returns HTTP 503 for ticket creation in production unless `ALLOW_DEMO_TICKETING=true` is set. Do not set that flag for a public deployment. Local development uses a clearly marked demo staff identity. Before production, implement real sessions, verify user roles on every server action/API endpoint, and make ticket + payment + audit writes atomic in a database transaction supported by the chosen Turso engine/driver.

The starter writes the related records in separate statements; if a statement fails part-way through, partial records may remain. This must be fixed before operational use. Route/service management, leg assignment, seat inventory, cancellation, QR validation, account administration, and expiry jobs are future steps.

## 1. Create Turso database

Use Turso's current CLI or dashboard. CLI example:

```bash
turso auth login
turso db create coral-coast-transit
turso db show coral-coast-transit --url
turso db tokens create coral-coast-transit
```

Keep the generated token private.

## 2. Local setup

Install Node.js LTS, unzip this project, then in the project folder:

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local` with the actual `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` values. Do not commit `.env.local`.

Generate and apply the initial database migration:

```bash
npm run db:generate
npm run db:migrate
```

Then start the site:

```bash
npm run dev
```

Open http://localhost:3000.

## 3. Deploy to Render

1. Push the project to a private GitHub repository.
2. In Render, create a **Web Service** connected to that repository.
3. Build command: `npm install && npm run db:generate && npm run build`
4. Start command: `npm start`
5. Add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in Render's Environment settings.
6. Run migrations as a controlled release step from a trusted environment, or add a dedicated pre-deploy command if available on your Render plan. Do not rely on runtime startup to change production schema automatically.
7. Do **not** set `ALLOW_DEMO_TICKETING=true`. Production ticket issuance remains disabled until authentication and authorization are implemented.

## Environment variables

- `TURSO_DATABASE_URL`: Turso database URL, e.g. `libsql://...`
- `TURSO_AUTH_TOKEN`: secret database token

## Suggested next development milestone

Implement authentication (e.g. Auth.js or another maintained provider), admin-only staff provisioning, session-based role checks, transactional ticket issuance, route/service CRUD, return leg selection, and tests. Use integer cents for all monetary values.
