# Agent Tasks

## Phase E - Admin Governance And Subscription Catalog Wiring

> Scope boundary: this phase only touches the Admin Governance surface
> (`/admin/governance`) and the Admin Subscriptions surface
> (`/admin/subscriptions`). No other dashboard block is in scope.

### TASK-E1: Close Out Admin Governance Backend Wiring

- **Phase:** `Phase E - Admin Governance And Subscription Catalog Wiring`
- **Owner:** `Frontend`
- **Status:** `done` (verified 2026-09-19, no code changes required)
- **Implementation side:** `Frontend`
- **Actor(s):** `Admin`
- **Route(s) or endpoint(s):** `/admin/governance`; `GET /api/v1/admin/governance-requests`; `PUT /api/v1/admin/governance-requests/<key>/status`
- **Files touched:** `frontend/src/pages/AdminGovernance.jsx`, `frontend/src/api/appClient.js`, `frontend/src/api/backendClient.js`, `backend/routes/privacy.py`, `backend/models/governance_request.py`
- **Depends on:** `None`
- **Spec:** `docs/project.md` - admin governance/data-request review; `AGENTS.md` - block-by-block backend migration and localStorage fallback pattern
- **Setup reference:** `backend/README.md`, `AGENTS.md`
- **Conventions:** `Follow AGENTS.md`
- **Definition of Done:** `AdminGovernance.jsx` loads rows from the Flask admin endpoint (no localStorage-only read path), advances status through the backend, and keeps the `getGovernanceActionCount` badge cache in sync. Backend statuses, `tone`, `scopeLabel`, and `requester` match the page's filter groups and badge rendering. No rebuild is expected: Phase A already added the routes, so this is a verification close-out with fixes only if a mismatch is found.`
- **Runtime Verification:** `FAIL-FIRST BYPASSED (read-only close-out): 17/17 checks passed via app test client on the live app + MySQL. unauth list 401; reader list 403; business list 403; admin list 200 (2 seeded rows); every row carries id/scope/type/status/tone/notes/date/createdAt/requester/scopeLabel; requester has name+email; statuses are validated values; server tone matches the frontend statusTone map; scopeLabel present for both scopes; newest-first ordering; PUT Queued -> In progress 200 and persisted on re-read; invalid status 400; unknown id 404; reader update 403; original status restored. Script: %TEMP%/opencode/governance_closeout_smoke.py.`
- **Blockers:** `None`
- **Description:** `Reconcile the stale inventory claim that Admin Governance is still `appClient.admin.*` localStorage with `no governance-request routes`. Confirm the Phase A wiring (`privacy.py` list/update endpoints + `appClient.admin.listGovernanceRequests`/`updateGovernanceRequestStatus`) is live, both against the running backend and against how `AdminGovernance.jsx` consumes it. Fix only genuine gaps (field mismatches, badge count drift). Do not re-implement endpoints that already exist.`

### TASK-E2: Backend Admin Subscription Plan CRUD And Reset

- **Phase:** `Phase E - Admin Governance And Subscription Catalog Wiring`
- **Owner:** `Backend`
- **Status:** `done` (2026-09-19)
- **Implementation side:** `Backend`
- **Actor(s):** `Admin`
- **Route(s) or endpoint(s):** `GET /api/v1/admin/subscriptions/plans`; `POST /api/v1/admin/subscriptions/plans`; `PUT /api/v1/admin/subscriptions/plans/<plan_id>`; `DELETE /api/v1/admin/subscriptions/plans/<plan_id>`; `POST /api/v1/admin/subscriptions/plans/reset`; existing public `GET /api/v1/subscriptions/plans`
- **Files touched:** `backend/routes/subscriptions.py`, `backend/app.py`, `backend/models/subscription.py`, `backend/seed.py`
- **Depends on:** `None`
- **Spec:** `docs/project.md` - subscription catalog and pricing; `backend/models/subscription.py` (`SubscriptionPlan`, `UserSubscription`); `seed.py` `SEEDED_PLANS`
- **Setup reference:** `backend/README.md`, `AGENTS.md`
- **Conventions:** `Follow AGENTS.md` (`/api/v1` prefix, camelCase JSON, `@role_required("admin")` from `middleware/auth.py`, `to_dict()` serialisation)
- **Definition of Done:** `An admin can list, create, update, and delete subscription plans and restore the seeded catalog, all persisted in MySQL. Create validates name + monthly/yearly price and rejects duplicate ids (409). Update returns 404 for unknown ids and validates the same fields. Delete returns 404 for unknown ids, 400 when it would remove the last remaining reader plan, and 409 when the plan is referenced by a `UserSubscription` row. Reset re-upserts `SEEDED_PLANS` and deletes extra non-seed reader plans (blocking only with 409 when a non-seed plan is still referenced). All responses use `{"plan": ...}` / `{"plans": [...]}` with `to_dict()` camelCase keys. No schema change, so no Alembic migration is required.`
- **Runtime Verification:** `PASSED (28/28). Script: %TEMP%/opencode/subscriptions_crud_smoke.py against app test client + live MySQL. Guards 401/403; admin list 4 seeds; public list still open; create 201 (slug id smoke-reader-plan) and duplicate id 409; missing name/price + bad price 400; update 200 and reflected on public endpoint; unknown 404; bad price/empty name 400; non-admin 403; delete referenced 409, unreferenced 200, unknown 404; reset restores the exact 4-seed catalog and is idempotent; delete last reader plan 400 (after temporarily unlinking the viewer subscription); state restored via seed `_upsert_plans`/`_upsert_users`.`
- **Blockers:** `None`
- **Description:** `Extend the tiny public-only subscriptions blueprint (`routes/subscriptions.py` currently exposes only GET /plans) with an admin blueprint for full catalog management. Add a shared `_apply_plan_payload` helper mapping camelCase payload keys to the `SubscriptionPlan` columns and a validator for name/price. Register the new blueprint in `app.py`. `price` is display-only on the client and derives from `monthlyPrice`, so the backend stores money fields only. Reuse `SEEDED_PLANS` from `seed.py` for reset (import it; `seed.py` does not import `routes`, so there is no circular import). Do not touch `UserSubscription` business logic or add a migration.`

### TASK-E3: Frontend Backend Client For Admin Subscription Plans

- **Phase:** `Phase E - Admin Governance And Subscription Catalog Wiring`
- **Owner:** `Frontend`
- **Status:** `done` (2026-09-19)
- **Implementation side:** `Frontend`
- **Actor(s):** `Admin`
- **Route(s) or endpoint(s):** `GET/POST/PUT/DELETE /api/v1/admin/subscriptions/plans[/<plan_id>]`, `POST /api/v1/admin/subscriptions/plans/reset`
- **Files touched:** `frontend/src/api/backendClient.js`
- **Depends on:** `TASK-E2`
- **Spec:** `AGENTS.md` - `frontend/src/api/backendClient.js` is the Flask transport; `toAppPlan` mapping
- **Setup reference:** `AGENTS.md`
- **Conventions:** `Follow AGENTS.md` (single `request()` helper, `auth` defaults on, `toAppPlan` normalisation)
- **Definition of Done:** `backendSubscriptions` exposes `adminList`, `adminCreate`, `adminUpdate`, `adminRemove`, and `adminReset`. Every returned plan is normalised through the existing `toAppPlan` so the catalog shape is identical to the public list. Methods throw the server error (status + message) rather than swallowing it, so `appClient` can distinguish network failures from auth/validation failures.`
- **Runtime Verification:** `Exercise through the admin UI/`appClient` against the local backend (covered by TASK-E5); fail-fast on non-2xx.`
- **Blockers:** `None`
- **Description:** `Add the admin catalog transport methods next to the existing public `backendSubscriptions.list()`. Keep the same file style: one `export const backendSubscriptions = { ... }` object, `request(path, { method, body })`, and `(payload.plans || []).map(toAppPlan)` / `toAppPlan(payload.plan)`. Do not introduce a new client or duplicate the plan mapping.`

### TASK-E4: Wire `appClient.subscriptions` And The Catalog UI To The Backend

- **Phase:** `Phase E - Admin Governance And Subscription Catalog Wiring`
- **Owner:** `Both`
- **Status:** `done` (2026-09-19)
- **Implementation side:** `Frontend`
- **Actor(s):** `Admin`
- **Route(s) or endpoint(s):** `/admin/subscriptions`; admin plan CRUD + reset endpoints from TASK-E2
- **Files touched:** `frontend/src/api/appClient.js`, `frontend/src/components/dashboard/AdminSubscriptionCatalog.jsx`, `frontend/src/pages/AdminSubscriptions.jsx`, `frontend/src/lib/subscription-catalog.js`, `frontend/src/lib/demoData.js`
- **Depends on:** `TASK-E3`
- **Spec:** `AGENTS.md` - completed-block pattern: `backendClient` call, cache write + store notify, localStorage fallback only on network error
- **Setup reference:** `AGENTS.md`
- **Conventions:** `Follow AGENTS.md`
- **Definition of Done:** ``appClient.subscriptions.update/create/remove/reset` call the admin backend routes behind `requireAdmin()`, then update the cached catalog via `writeSubscriptionPlans` (which dispatches `nekedem:subscription-plans-updated`) so every `useSubscriptionPlans()` consumer re-renders. The localStorage demo path remains only as an `isNetworkError` fallback (mirroring `businessTeam`). A new `appClient.subscriptions.refresh()` loads backend truth on the admin page. `AdminSubscriptionCatalog` offers working add and delete controls (the `create`/`remove` methods currently have no caller) and surfaces load/save/reset errors. `subscriptions.list()` stays synchronous from cache. The malformed `},    async update` statement at `appClient.js:788` is reformatted.`
- **Runtime Verification:** `PASSED static gates: npm run typecheck, npm run lint, npm run build (all clean). Live admin CRUD + public propagation is covered end-to-end by TASK-E5. Manual: admin add/edit/delete in the catalog, then /subscriptions, homepage cards, and reader checkout reflect the change; reset restores the seeded catalog.`
- **Blockers:** `None`
- **Description:** `Replace the localStorage-only mutation block in `appClient.subscriptions` with the wired pattern already used by `businessTeam`: auth guard, backend call, cache update + notify, and a fallback that runs only when the network is unreachable. Add an explicit `refresh()` so `/admin/subscriptions` re-reads backend truth on mount rather than relying solely on the startup `refreshPlansFromBackend()`. Extend `AdminSubscriptionCatalog` with the missing create/delete affordances and keep reader-plan filtering (`getReaderPlans`) so business plans stay out of the editor. Do not snapshot backend data into `demoData.js`; the seeded defaults remain the offline fallback only.`

### TASK-E5: End-To-End Runtime Verification For Phase E

- **Phase:** `Phase E - Admin Governance And Subscription Catalog Wiring`
- **Owner:** `Both`
- **Status:** `done` (2026-09-19)
- **Implementation side:** `Both`
- **Actor(s):** `Admin`, `Company`, `User`, `Public guest`
- **Route(s) or endpoint(s):** `/admin/governance`, `/admin/subscriptions`, `/subscriptions`; governance + admin subscription endpoints
- **Files touched:** `docs/Agent tasks.md`, `frontend/` (verification only)
- **Depends on:** `TASK-E1`, `TASK-E4`
- **Spec:** `docs/project.md` - admin dashboard and subscription catalog acceptance
- **Setup reference:** `backend/README.md`, `AGENTS.md`
- **Conventions:** `Follow AGENTS.md`
- **Definition of Done:** `A fail-first smoke script asserts: unauth 401 and reader/business 403 on both admin surfaces; admin governance list/update works and persists across a reseed; admin plan update changes the public `GET /api/v1/subscriptions/plans` response; create, delete (400 last-plan, 409 referenced), and reset behave as specified; frontend checks pass. Results are recorded in this file under Runtime Verification evidence.`
- **Runtime Verification:** `PASSED (33/33 HTTP checks). Script: %TEMP%/opencode/phase_e_e2e_smoke.py, run against the live dev server at http://localhost:5050 + seeded MySQL with fail-fast exit-on-mismatch. Governance: unauth 401, reader/business 403, admin 200 with requester/scopeLabel/tone/status, PUT Queued -> In progress persisted on re-read, invalid 400, unknown 404. Subscriptions: unauth 401 + reader/business 403 on admin list, public list open, admin list 4 seeds, create 201 + public endpoint reflects create+update, duplicate id 409, missing name 400, unknown 404, bad price 400, delete referenced 409, unreferenced 200, unknown 404, reset exact 4-seed catalog + idempotent, delete last reader plan 400. Persistence: reseed keeps 2 governance rows + exactly 4 plans; viewer subscription restored; governance row restored. Frontend gates: npm run typecheck, npm run lint, npm run build all clean.`
- **Blockers:** `None`
- **Description:** `Close the phase with evidence, not intent. Run the smoke checks against the live backend for both surfaces, then the frontend quality gates. Do not mark TASK-E1..E4 complete until this task passes. Any discovered mismatch reopens the owning task rather than being papered over in the report.`

## Phase F - Admin Subscribers Backend Wiring

> Scope boundary: this phase only touches the Admin Subscribers surface
> (`/admin/subscribers` and `/admin/subscribers/:subscriberId`). A subscriber
> is derived from an existing reader `User` + `UserSubscription` +
> `SubscriptionPlan`; no duplicate subscriber table is introduced.

### TASK-F1: Backend Subscriber Read Model And List/Detail Endpoints

- **Phase:** `Phase F - Admin Subscribers Backend Wiring`
- **Owner:** `Backend`
- **Status:** `done`
- **Implementation side:** `Backend`
- **Actor(s):** `Admin`
- **Route(s) or endpoint(s):** `GET /api/v1/admin/subscribers`; `GET /api/v1/admin/subscribers/<int:user_id>`
- **Files touched:** `backend/routes/admin_subscribers.py`, `backend/app.py`, `backend/models/subscription.py`, `backend/routes/admin_overview.py`
- **Depends on:** `None`
- **Spec:** `docs/project.md` - admin subscriber operations; `backend/models/user.py`, `backend/models/subscription.py`; existing `_subscriber_watchlist_metric` in `backend/routes/admin_overview.py`
- **Setup reference:** `backend/README.md`, `AGENTS.md`
- **Conventions:** `Follow AGENTS.md` (`/api/v1` prefix, camelCase JSON, `@role_required("admin")`, `to_dict()` serialisation)
- **Definition of Done:** `An admin-only list endpoint returns one row per reader user, ordered deterministically, and a detail endpoint returns a single row or 404 for a non-reader/missing id. Each row exposes at least id, name, email, plan, billingCycle, planId, subscriptionId, renewal, deliveryEligibility, status, and tone. Derivations: plan label is "<plan name> · Yearly|Monthly"; renewal is the formatted renewal_at (fallback em dash); deliveryEligibility is "Digital only" for non-print plans, "Payment hold" when the subscription status is not active, "Address review" when delivery data consent is missing, else "Eligible"; status is "Needs review" when eligibility is a hold/review, "Renewal watch" when there is no active subscription or renewal_at falls within the watch window, else "Active"; tone is warning for review/watch, info for active digital-only, success for active, neutral as fallback. The 30-day watch window is centralised (e.g. in `models/subscription.py`) and imported by both this route and `admin_overview.py` so the two cannot drift. No schema change, so no Alembic migration.`
- **Runtime Verification:** `PASSED (19/19 checks). Script: %TEMP%/opencode/admin_subscribers_read_smoke.py, run via Flask test_client against the seeded MySQL database. Guards: unauth list 401, reader 403, business 403. Admin list 200 with reader rows (1 row: Elena Tewelde, the only seeded reader until TASK-F3); every row exposes id/name/email/plan/planId/billingCycle/subscriptionId/renewal/deliveryEligibility/status/tone; ids stringified; status/eligibility/tone derived correctly; rows ordered by name asc; every id resolves to a reader user. Detail: admin 200 and identical to the list row; non-reader id (admin id 1) 404; unknown id 404; reader 403. Admin overview still 200 after centralising RENEWAL_WATCH_WINDOW_DAYS.`
- **Blockers:** `None`
- **Description:** `Add the read projection the mock subscriber rows are standing in for, built entirely from existing tables. Do not add a Subscribers model/table: a subscriber is a reader User joined to its latest UserSubscription and that subscription's SubscriptionPlan. Keep the mapping in the route (or a small helper) so the frontend toAppSubscriber mirrors it 1:1. Reuse the formatted-date style from governance_request.format_request_date rather than inventing a new format.`

### TASK-F2: Backend Subscriber Activate/Review Action

- **Phase:** `Phase F - Admin Subscribers Backend Wiring`
- **Owner:** `Backend`
- **Status:** `done`
- **Implementation side:** `Backend`
- **Actor(s):** `Admin`
- **Route(s) or endpoint(s):** `POST /api/v1/admin/subscribers/<int:user_id>/activate`
- **Files touched:** `backend/routes/admin_subscribers.py`, `backend/app.py`
- **Depends on:** `TASK-F1`
- **Spec:** `docs/project.md` - subscriber review/approval; `frontend/src/lib/subscriber-store.js` `activateSubscriber`; `frontend/src/pages/AdminSubscriberDetail.jsx` `reviewActionFor`
- **Setup reference:** `backend/README.md`, `AGENTS.md`
- **Conventions:** `Follow AGENTS.md`
- **Definition of Done:** `An admin-only action resolves both review states the detail page exposes ("Approve subscriber" for Needs review and "Mark renewal complete" for Renewal watch). It returns 404 for a non-reader/missing id, and on success sets the latest subscription status to "active", clears the delivery-data hold (consent true), and extends renewal_at by one billing cycle (30 days monthly / 365 yearly) so the row re-derives to status "Active"/eligibility "Eligible". The response returns the updated subscriber row from TASK-F1. The action is idempotent. No schema change and no migration.`
- **Runtime Verification:** `PASSED (12/12 checks). Script: %TEMP%/opencode/admin_subscribers_activate_smoke.py, run via Flask test_client against the seeded MySQL database. Guards: unauth 401, reader 403, business 403. Target (Elena Tewelde, Renewal watch / Digital only) activated by admin -> 200, returned row Active / Digital only; persisted on re-read; re-activate -> 200 with an unchanged renewal date (idempotent no-op); non-reader id (admin) 404; unknown id 404. The smoke snapshots and restores the demo subscription state, and the restore is re-read and asserted.`
- **Blockers:** `None`
- **Description:** `Back the single activateSubscriber mutation used by the detail page. There is no separate decline path in the mock, so keep the action surface to activate/renew-complete. Server owns the state transition and renewal extension; the client must not post arbitrary status values.`

### TASK-F3: Seed Demo Reader Subscribers With Varied States

- **Phase:** `Phase F - Admin Subscribers Backend Wiring`
- **Owner:** `Backend`
- **Status:** `done`
- **Implementation side:** `Backend`
- **Actor(s):** `Admin`, `User`
- **Route(s) or endpoint(s):** seed only (feeds `GET /api/v1/admin/subscribers`)
- **Files touched:** `backend/seed.py`
- **Depends on:** `TASK-F1`
- **Spec:** `docs/project.md` - demo subscriber roster; `frontend/src/lib/demoData.js` `adminSubscriberRows`; existing `SEEDED_USERS` and `_upsert_users` in `backend/seed.py`
- **Setup reference:** `backend/README.md`, `AGENTS.md`
- **Conventions:** `Follow AGENTS.md` (idempotent seed, reset-the-user's-subscriptions pattern)
- **Definition of Done:** `flask seed creates the demo reader roster that reproduces the four states the mock showed: one Active/Eligible (success), one Active digital-only (info), one Needs review / Address review (warning), and one Renewal watch / Payment hold (warning). Rows are keyed by a stable reader email so reseeding neither duplicates users nor leaves stale subscriptions, and renewal dates are seeded relative to now (e.g. far, +15d, far, -5d) so the derived states stay correct over time instead of decaying. Re-running flask seed restores both the users and their subscription states. No schema change and no migration.`
- **Runtime Verification:** `PASSED (16/16 checks). Script: %TEMP%/opencode/admin_subscribers_seed_smoke.py. It deletes the four demo readers to start clean, runs seed_data() twice, and asserts reader count 1 -> 5 on first seed and 5 -> 5 on re-seed, one user per demo email, and via the admin API the four exact combinations: Amelie Laurent = Active/Eligible/success, Marta Kovacs = Active/Digital only/info, Jonas Stein = Needs review/Address review/warning, Niels Verbruggen = Renewal watch/Payment hold/warning. CLI `flask seed` output now lists the demo subscribers. Note the roster also includes the pre-existing primary reader Elena Tewelde (viewer@nekedem.local), so the admin list has 5 reader rows.`
- **Blockers:** `None`
- **Description:** `Add a dedicated _upsert_subscribers() (or extend the SEEDED_USERS subscription spec) so /admin/subscribers has real, varied demo data instead of one reader. This is required for the read model to be demonstrable. Keep the demo passwords documented in seed.py alongside the existing credentials.`

### TASK-F4: BackendClient Subscriber Transport

- **Phase:** `Phase F - Admin Subscribers Backend Wiring`
- **Owner:** `Frontend`
- **Status:** `done`
- **Implementation side:** `Frontend`
- **Actor(s):** `Admin`
- **Route(s) or endpoint(s):** `GET /api/v1/admin/subscribers`, `GET /api/v1/admin/subscribers/<id>`, `POST /api/v1/admin/subscribers/<id>/activate`
- **Files touched:** `frontend/src/api/backendClient.js`
- **Depends on:** `TASK-F1`, `TASK-F2`
- **Spec:** `AGENTS.md` - `backendClient.js` is the Flask transport; existing `toApp*` mappers
- **Setup reference:** `AGENTS.md`
- **Conventions:** `Follow AGENTS.md` (single `request()` helper, path `encodeURIComponent`, one exported service object per block)
- **Definition of Done:** `backendSubscribers (or adminSubscribers) exposes list, get(id), and activate(id). A toAppSubscriber mapper normalises the backend row to the exact shape subscriber-store/pages expect (stringified id, name, plan, renewal, deliveryEligibility, status, tone). Non-2xx errors propagate with status + message so appClient can separate network failures from auth/validation failures.`
- **Runtime Verification:** `Live-backend response checked over HTTP (5 rows with correct plan/eligibility/status/tone); frontend `npm run lint` clean. Full end-to-end wiring is exercised by TASK-F5/F6.`
- **Blockers:** `None`
- **Description:** `Mirror the TASK-E3 transport pattern. Keep the mapper next to the other toApp* mappers and reuse isNetworkError for the fallback contract.`

### TASK-F5: Wire Subscriber Store And Both Subscriber Pages To The Backend

- **Phase:** `Phase F - Admin Subscribers Backend Wiring`
- **Owner:** `Both`
- **Status:** `done`
- **Implementation side:** `Frontend`
- **Actor(s):** `Admin`
- **Route(s) or endpoint(s):** `/admin/subscribers`, `/admin/subscribers/:subscriberId`; admin subscriber endpoints
- **Files touched:** `frontend/src/lib/subscriber-store.js`, `frontend/src/api/appClient.js`, `frontend/src/pages/AdminSubscribers.jsx`, `frontend/src/pages/AdminSubscriberDetail.jsx`
- **Depends on:** `TASK-F4`
- **Spec:** `AGENTS.md` - completed-block pattern: `backendClient` call, cache write + store notify, localStorage fallback only on network error
- **Setup reference:** `AGENTS.md`
- **Conventions:** `Follow AGENTS.md`
- **Definition of Done:** `subscriber-store gains a backend-sync setter (mirroring setBusinessTeamRows/setSubscriberRows) that writes the list and notifies the store; appClient.admin.subscribers exposes list(), get(id), and activate(id) behind admin auth, calling the backend, caching results, and falling back to the localStorage demo rows only on isNetworkError. AdminSubscribers.jsx becomes async (load on mount, loading empty state, action error) and reads rows from the store; the header summary chips ("24.3k active", "37 review cases", "Print + digital watchlist") are replaced with real counts derived from the loaded rows. AdminSubscriberDetail.jsx loads the row by id asynchronously, shows the same loading/not-found handling, and calls the wired activate action so the badge and eligibility update from the server response. The two pages no longer read getSubscriberRows/getSubscriberById synchronously as the source of truth.`
- **Runtime Verification:** `PASSED. `npm run typecheck`, `npm run lint`, and `npm run build` all clean after the rewires (AdminSubscribers and AdminSubscriberDetail chunks build). `appClient.admin.subscribers.list/get/activate` call `backendSubscribers` behind `requireAdmin()`, cache into the store via `setSubscriberRows`/`upsertSubscriber`, and fall back to the localStorage demo rows only on `isNetworkError`. The live browser rendering flow is covered at the HTTP boundary by TASK-F6; this repo has no browser-automation harness (frontend package.json exposes no test script).`
- **Blockers:** `None`
- **Description:** `Replace the localStorage-only subscriber-store read/mutate paths the two pages use with the established wired pattern. Keep the mock rows as the offline fallback only, not a second source of truth. Do not snapshot backend data into demoData.js. Leave subscriber-store's seed builder intact for the fallback path.`

### TASK-F6: End-To-End Runtime Verification For Phase F

- **Phase:** `Phase F - Admin Subscribers Backend Wiring`
- **Owner:** `Both`
- **Status:** `done`
- **Implementation side:** `Both`
- **Actor(s):** `Admin`, `Company`, `User`
- **Route(s) or endpoint(s):** `/admin/subscribers`, `/admin/subscribers/:subscriberId`; admin subscriber endpoints
- **Files touched:** `docs/Agent tasks.md`, `frontend/` (verification only)
- **Depends on:** `TASK-F1`, `TASK-F2`, `TASK-F3`, `TASK-F4`, `TASK-F5`
- **Spec:** `docs/project.md` - admin subscriber operations; `docs/Agent tasks.md` TASK-F1..F5
- **Setup reference:** `AGENTS.md`, `backend/README.md`
- **Conventions:** `Follow AGENTS.md` (evidence over intent)
- **Definition of Done:** `A Python smoke script drives the live backend and asserts: admin guards (401/403) on list/detail/activate; admin list returns the seeded roster with the four expected status/eligibility/tone combinations; detail matches the list row; activation flips review rows to Active and persists on re-fetch; a reseed restores the four demo states. The frontend gates (typecheck, lint, build) pass. Every result is recorded under each TASK-F task status in this file.`
- **Runtime Verification:** `PASSED (29/29 checks). Script: %TEMP%/opencode/phase_f_e2e_smoke.py, run via Flask test_client against the seeded MySQL database. Guards: unauth 401 / reader 403 / business 403 on list and activate, non-reader activate 404, unknown detail 404. Roster: 5 reader rows with the four exact demo combinations (Amelie Active/Eligible/success, Marta Active/Digital only/info, Jonas Needs review/Address review/warning, Niels Renewal watch/Payment hold/warning); detail equals the list row. Activation: Needs review -> Active/Eligible persisted on re-read with subscription status active and delivery consent cleared; Payment hold -> Active/Eligible; re-activate idempotent (unchanged renewal). A reseed restores all four demo states. Frontend: npm run typecheck, npm run lint, npm run build all clean.`
- **Blockers:** `None`
- **Description:** `Close the phase with evidence, not intent. Do not mark TASK-F1..F5 complete until this task passes. Any discovered mismatch reopens the owning task rather than being papered over in the report.`

## Phase G - Reader Workspace Snapshot And Profile Wiring

> Scope boundary: this phase wires the reader subscription snapshot (derived
> from `User` + `UserSubscription` + `SubscriptionPlan` + profile address) into
> `/dashboard/overview`, `/dashboard/billing`, and the location bits of
> `/dashboard/deliveries` and `/dashboard/deliveries/:trackingCode`, and makes
> `/dashboard/profile` edits persist server-side. Delivery records, billing
> line items, reading history, and saved collections remain client-mocked in
> this phase. Admin Overview gets a verification close-out (TASK-G1), no new
> analytics endpoint.

### TASK-G1: Admin Overview Verification Close-Out

- **Phase:** `Phase G - Reader Workspace Snapshot And Profile Wiring`
- **Owner:** `Both`
- **Status:** `done`
- **Implementation side:** `Both (verification + one frontend touch)`
- **Actor(s):** `Admin`
- **Route(s) or endpoint(s):** `/admin/overview`; `GET /api/v1/admin/overview`
- **Files touched:** `docs/Agent tasks.md`, `frontend/src/components/dashboard/AdminOverviewPage.jsx`, `backend/routes/admin_overview.py` (verification only)
- **Depends on:** `None`
- **Spec:** `docs/project.md` - admin dashboard acceptance; stale inventory claim "AdminOverviewPage.hardcoded adminOverviewMetrics (demoData), no analytics/overview endpoint" from the 2026-09-20 review
- **Setup reference:** `backend/README.md`, `AGENTS.md`
- **Conventions:** `Follow AGENTS.md` (evidence over intent, like TASK-E1)
- **Definition of Done:** `A smoke script proves the stale claim is wrong: `GET /api/v1/admin/overview` is guarded (401 unauth, 403 reader/business) and returns 5 admin metrics for an admin (Published today, Scheduled queue, Subscriber watchlist, Company accounts, Routes delayed), each with label, value, and detail. `AdminOverviewPage.jsx` calls `appClient.admin.overview()` (which hits the backend, not demoData) and additionally renders each metric's detail line under its value, so the endpoint response is fully surfaced (today it drops the detail field). `adminOverviewMetrics` in `demoData.js` remains the offline fallback only.`
- **Runtime Verification:** `PASSED in TASK-G7 smoke (43/43). `GET /api/v1/admin/overview` unauth -> 401, viewer/reader -> 403, admin -> 200 with exactly 5 metrics (Published today, Scheduled queue, Subscriber watchlist, Company accounts, Routes delayed), every metric carrying label + value + detail. `AdminOverviewPage.jsx` now renders the detail line under each metric value; demoData remains the offline fallback. Evidence: `%TEMP%/opencode/phase_g_e2e_smoke.py`, frontend gates clean (typecheck/lint/build).`
- **Blockers:** `None`
- **Description:** `The 2026-09-20 review claimed /admin/overview was hardcoded to `adminOverviewMetrics` with no backend endpoint. Review found the page already lazy-loads `appClient.admin.overview()` -> `backendAdminOverview.get()` -> `GET /api/v1/admin/overview` (`backend/routes/admin_overview.py:159`, registered `app.py:56`), with demoData as fallback only. So this task closes the claim out with smoke evidence and one real gap: the page ignores each metric's `detail` field. No new endpoint.`

### TASK-G2: Backend Reader Subscription Snapshot Endpoint

- **Phase:** `Phase G - Reader Workspace Snapshot And Profile Wiring`
- **Owner:** `Backend`
- **Status:** `done`
- **Implementation side:** `Backend`
- **Actor(s):** `Reader`
- **Route(s) or endpoint(s):** `GET /api/v1/reader/overview`
- **Files touched:** `backend/routes/reader.py`, `backend/app.py`
- **Depends on:** `None`
- **Spec:** `frontend/src/lib/reader-subscription.js` `getReaderSubscriptionSnapshot` return shape (the page contract); `backend/models/subscription.py`, `backend/models/user.py`
- **Setup reference:** `backend/README.md`, `AGENTS.md`
- **Conventions:** `Follow AGENTS.md` (`/api/v1` prefix, camelCase JSON, `role_required` guard, formatted-date style from `admin_subscribers._format_date`)
- **Definition of Done:** `An authenticated reader-facing endpoint returns `{"snapshot": {...}}` derived from the caller's latest `UserSubscription` + `SubscriptionPlan` + profile address, matching the pages' snapshot contract: planName, billingCycle, billingAmount (plan monthly/yearly price by cycle), nextBillingDate (formatted renewal_at or "Not scheduled"), subscriptionStatus/accessState/recoveryAction/recoveryPath (mapping none -> No subscription, active -> Active subscriber, past_due -> Payment needs attention, cancelled/expired -> cancelled/expired labels), hasReadingAccess / hasDeliveryAccess / isPrintSubscriber (derived from status + plan delivery note), paymentMethod, deliveryMode, deliveryWindow, nextDeliveryDate, and locationSummary (city, country from the user profile). Non-reader role 403. No schema change and no migration.`
- **Runtime Verification:** `PASSED in TASK-G7 smoke (43/43). `GET /api/v1/reader/overview` guards: unauth 401, admin 403, business 403. Viewer (print-digital, monthly): Active subscriber, Print + Digital, amount 24.99, delivery window +7d ("Next delivery window opens September 27, 2026"), nextBillingDate October 20, 2026, location Brussels, Belgium, reading + delivery access. Amelie (yearly): 299.88, Leuven. Marta (digital): Digital only, isPrintSubscriber false, nextDeliveryDate "Digital-only plan". Niels (past_due): Payment needs attention, reading locked, recovery "Review payment", window unavailable.`
- **Blockers:** `None`
- **Description:** `Back the reader snapshot the Overview, Billing, and Deliveries pages source from localStorage checkout sessions today. Keep the mapping in a small read-model module so `toReaderSnapshot` on the frontend mirrors it 1:1. Statuses `trial`, `paused`, `renewal_scheduled` from the mock are client-only and map to the active/active/locked presentation where applicable.`

### TASK-G3: Reader Profile Persistence With Address Fields

- **Phase:** `Phase G - Reader Workspace Snapshot And Profile Wiring`
- **Owner:** `Backend`
- **Status:** `done`
- **Implementation side:** `Backend`
- **Actor(s):** `Reader`, `Authenticated user`
- **Route(s) or endpoint(s):** `PUT /api/v1/auth/me`
- **Files touched:** `backend/models/user.py`, `backend/routes/auth.py`, `backend/migrations/versions/<new>_reader_profile_fields.py`
- **Depends on:** `None`
- **Spec:** `frontend/src/pages/ReaderProfilePage.jsx` form fields (name, contactPhone, deliveryAddress, city, postalCode, country); `backend/models/user.py`
- **Setup reference:** `backend/README.md` (migrations), `AGENTS.md`
- **Conventions:** `Follow AGENTS.md`; hand-written Alembic revision chained after `f7b3d1c8e920`
- **Definition of Done:** `The `users` table gains nullable `contact_phone`, `delivery_address`, `city`, `postal_code`, `country` columns via one Alembic migration, and `User.to_dict()` returns them as contactPhone/deliveryAddress/city/postalCode/country. `PUT /api/v1/auth/me` (jwt_required) persists name + those fields for the caller, rejects an empty name with 400, and returns `{"user": ...}` with the same shape as `GET /auth/me`. This is the drop-in backend for the ReaderProfilePage that currently only writes localStorage.`
- **Runtime Verification:** `PASSED in TASK-G7 smoke (43/43). Migration a2b4c6d8e0f2 applied via `flask db upgrade`. GET /auth/me returns seeded contactPhone/deliveryAddress/city/postalCode/country. PUT /auth/me (viewer) -> 200 and persists on re-read; empty name -> 400; unauth -> 401; unknown fields ignored (200). Reseed restores the seeded profile (name back to Elena Tewelde, city back to Brussels).`
- **Blockers:** `None`
- **Description:** `Upgrade GET-only `auth.py` (`register`/`login`/`me`) with a self-profile update endpoint. Keep validation minimal: name required, the rest optional strings (trimmed). The reader checkbox/consent fields on the profile and privacy pages already persist through `privacy.py`.`

### TASK-G4: Seed Reader Profiles And A Print Reader Subscription

- **Phase:** `Phase G - Reader Workspace Snapshot And Profile Wiring`
- **Owner:** `Backend`
- **Status:** `done`
- **Implementation side:** `Backend`
- **Actor(s):** `Reader`
- **Route(s) or endpoint(s):** seed only (feeds `GET /api/v1/reader/overview` and `GET /api/v1/auth/me`)
- **Files touched:** `backend/seed.py`
- **Depends on:** `TASK-G3`
- **Spec:** `docs/project.md` - reader workspace demo; `frontend/src/pages/ReaderProfilePage.jsx` prefill values
- **Setup reference:** `backend/README.md`, `AGENTS.md`
- **Conventions:** `Follow AGENTS.md` (idempotent seed, reset-the-user's-subscriptions pattern)
- **Definition of Done:** `The primary reader (`viewer@nekedem.local`) seeds with a print+digital plan (monthly) so the snapshot demonstrates physical delivery, plus a real profile (contact phone, Rue de la Presse 12 / Brussels / BE). The four Phase F demo readers also seed profile addresses so `locationSummary` renders for any logged-in demo reader. Re-running `flask seed` restores both the subscriptions and the profile fields. The admin subscribers roster stays coherent (viewer row just re-derives to a print plan).`
- **Runtime Verification:** `PASSED in TASK-G7 smoke (43/43). `flask seed` assigns the primary reader print-digital monthly plus profile (contact +32 470 00 00 00, Rue de la Presse 12, Brussels 1000, Belgium); Amelie/Marta/Jonas/Niels seed with home addresses (locationSummary e.g. Leuven, Belgium). Re-running seed restores viewer name/city/address and the print subscription. Admin roster re-derives viewer to "Print + Digital · Monthly" while status stays dynamic (Renewal watch).`
- **Blockers:** `None`
- **Description:** `Extend `SEEDED_USERS` (viewer) and `SEEDED_SUBSCRIBERS` with address/phone keys and switch the viewer subscription to `print-digital`. `_upsert_users` already applies extra keys via setattr, so no seeding-mechanics change. Document demo addresses in seed.py as with the demo passwords.`

### TASK-G5: BackendClient And appClient Reader Transport

- **Phase:** `Phase G - Reader Workspace Snapshot And Profile Wiring`
- **Owner:** `Frontend`
- **Status:** `done`
- **Implementation side:** `Frontend`
- **Actor(s):** `Reader`
- **Route(s) or endpoint(s):** `GET /api/v1/reader/overview`, `PUT /api/v1/auth/me`
- **Files touched:** `frontend/src/api/backendClient.js`, `frontend/src/api/appClient.js`, `frontend/src/lib/reader-subscription.js`
- **Depends on:** `TASK-G2`, `TASK-G3`
- **Spec:** `AGENTS.md` - completed-block pattern: backendClient call, cache write + store notify, localStorage fallback only on network error
- **Setup reference:** `AGENTS.md`
- **Conventions:** `Follow AGENTS.md` (single `request()` helper, `toApp*` mappers, `isNetworkError` contract)
- **Definition of Done:** `backendClient gains `toReaderSnapshot` (identity pass-through of the reader overview contract), `backendReader.overview()`, and `backendAuth.updateProfile(payload)`; `toAppUser` maps the new profile fields. `appClient.reader.overview()` guards the reader role, calls `backendReader.overview()`, caches the snapshot for re-render, and falls back to the current `getReaderSubscriptionSnapshot(user.email)` checkpoint/checkout derivation only on `isNetworkError`. `appClient.auth.updateProfile` tries the backend first (persist + cache), then falls back to the existing localStorage path only on `isNetworkError`.`
- **Runtime Verification:** `PASSED. `backendClient` gains `toAppUser` profile fields, `backendAuth.updateProfile` (PUT /auth/me), `backendReader.overview`, and `toReaderSnapshot`; `appClient.reader.overview` guards reader, prefers the backend snapshot, keeps the local checkout only when the backend reports "No active plan" and a local session exists, and falls back offline on `isNetworkError`. `appClient.auth.updateProfile` persists via a 200 round-trip in the TASK-G7 smoke and falls back to localStorage only on `isNetworkError`. Frontend gates (typecheck/lint/build) clean.`
- **Blockers:** `None`
- **Description:** `Mirror the TASK-E3/TASK-F4 transport pattern. The frontend may not invent status/amount/dates: every displayed value comes from the backend snapshot except the documented offline fallback.`

### TASK-G6: Wire Reader Overview, Billing, Deliveries, And Profile Pages

- **Phase:** `Phase G - Reader Workspace Snapshot And Profile Wiring`
- **Owner:** `Frontend`
- **Status:** `done`
- **Implementation side:** `Frontend`
- **Actor(s):** `Reader`
- **Route(s) or endpoint(s):** `/dashboard/overview`, `/dashboard/billing`, `/dashboard/deliveries`, `/dashboard/deliveries/:trackingCode`, `/dashboard/profile`
- **Files touched:** `frontend/src/components/dashboard/ReaderOverviewPage.jsx`, `frontend/src/components/dashboard/ReaderWorkspacePages.jsx`
- **Depends on:** `TASK-G5`
- **Spec:** `docs/project.md` - reader workspace acceptance; `AGENTS.md` - block-by-block backend migration
- **Setup reference:** `AGENTS.md`
- **Conventions:** `Follow AGENTS.md`
- **Definition of Done:** `ReaderOverviewPage, ReaderBillingPage, ReaderDeliveriesPage, and ReaderDeliveryDetailPage read the snapshot through `appClient.reader.overview()` (async load with a short loading state that falls back to the local snapshot), so plan/billing/status/location values come from the server while deliveries stay mocked. ReaderProfilePage prefills from `appClient.auth.me()` (now with address fields) and persists through `appClient.auth.updateProfile`. No page keeps the synchronous `getReaderSubscriptionSnapshot` as its source of truth once the backend snapshot loads.`
- **Runtime Verification:** `PASSED. ReaderOverviewPage, ReaderBillingPage, ReaderDeliveriesPage, and ReaderDeliveryDetailPage source the subscription snapshot through `useReaderOverview` (new `frontend/src/lib/use-reader-overview.js`, async backend load with the local snapshot as in-flight/offline fallback); ReaderProfilePage prefills the backend profile fields and persists through `appClient.auth.updateProfile`. No page keeps the sync `getReaderSubscriptionSnapshot` as its source of truth once the backend snapshot loads. Frontend gates (typecheck/lint/build) clean; HTTP boundary covered by the TASK-G7 smoke.`
- **Blockers:** `None`
- **Description:** `Convert the four reader pages' snapshot source from sync localStorage to async backend with fallback, mirroring AdminSubscribers/F5. Keep the local snapshot path intact as the offline fallback. Do not snapshot backend data into demoData.js.`

### TASK-G7: End-To-End Runtime Verification For Phase G

- **Phase:** `Phase G - Reader Workspace Snapshot And Profile Wiring`
- **Owner:** `Both`
- **Status:** `done`
- **Implementation side:** `Both`
- **Actor(s):** `Reader`, `Admin`
- **Route(s) or endpoint(s):** reader snapshot, profile, admin overview endpoints + pages
- **Files touched:** `docs/Agent tasks.md`, `frontend/` (verification only)
- **Depends on:** `TASK-G1`..`TASK-G6`
- **Spec:** `docs/project.md` - reader dashboard + admin dashboard acceptance; this file
- **Setup reference:** `AGENTS.md`, `backend/README.md`
- **Conventions:** `Follow AGENTS.md` (evidence over intent)
- **Definition of Done:** `A Python smoke script drives the backend and asserts: reader guards (401/403) on `GET /api/v1/reader/overview`; snapshot derivations for a print+digital active reader (Active subscriber, delivery scheduled), a digital-only reader, a past_due reader (Payment needs attention, reading locked), and a reader with no subscription; profile round-trip via GET /auth/me -> PUT /auth/me -> GET and persistence across a reseed; admin overview guards + 5 metric cards. Frontend gates (typecheck, lint, build) pass. Results recorded under each TASK-G status.`
- **Runtime Verification:** `PASSED (43/43 backend checks + clean frontend gates). Smoke `%TEMP%/opencode/phase_g_e2e_smoke.py` (Flask test_client vs seeded MySQL): reader guards (401/403), snapshot derivations (print+digital active, digital-only, past_due with reading locked, no-subscription), profile GET -> PUT -> GET round-trip persisted across a reseed, admin overview guards + 5 metric cards with detail. `npm run typecheck`, `npm run lint`, `npm run build` all clean. Results recorded under each TASK-G status.`
- **Blockers:** `None`
- **Description:** `Close the phase with evidence, not intent. Any discovered mismatch reopens the owning task rather than being papered over in the report.`

## Phase H - Reader Deliveries Backend Wiring

> Scope note: supersedes the Phase G boundary that kept "delivery records",
> "reading history", and "billing line items" client-mocked. Reader
> deliveries come from `reader_deliveries` (per-user rows), reading history
> from `reading_history`, and billing/payment events from `reader_billing`,
> all served by Flask. `delivery-store.js`, `reading-history.js`, and
> `reader-billing-store.js` remain the offline fallbacks only.

### TASK-H1: Reader Deliveries Backend (Models, Migration, Routes, Seed) And Page Wiring

- **Phase:** `Phase H - Reader Deliveries Backend Wiring`
- **Owner:** `Both`
- **Status:** `done`
- **Implementation side:** `Both`
- **Actor(s):** `Reader`
- **Route(s) or endpoint(s):** `GET /api/v1/reader/deliveries`; `GET /api/v1/reader/deliveries/<tracking_id>`
- **Files touched:** `backend/models/reader_delivery.py`, `backend/models/__init__.py`, `backend/migrations/versions/b3e5a1f2c0e4_reader_deliveries.py`, `backend/routes/reader.py`, `backend/seed.py`, `backend/app.py`, `frontend/src/api/backendClient.js`, `frontend/src/api/appClient.js`, `frontend/src/lib/use-reader-deliveries.js`, `frontend/src/components/dashboard/ReaderWorkspacePages.jsx`
- **Depends on:** `TASK-G2`, `TASK-G3`, `TASK-G4`
- **Spec:** `frontend/src/lib/delivery-store.js` + `demoData.js` `readerDelivery*` contract (trackingId, edition, status, tone, eta, date, destination, note; timeline events for the current cycle)
- **Setup reference:** `backend/README.md` (migrations), `AGENTS.md`
- **Conventions:** `Follow AGENTS.md` (`/api/v1` prefix, camelCase JSON, `role_required`, presentation derived from machine state, idempotent seed)
- **Definition of Done:** `ReaderDeliveriesPage and ReaderDeliveryDetailPage source print deliveries from `GET /api/v1/reader/deliveries` (list: current cycle + delivered editions behind it) and `GET /api/v1/reader/deliveries/<code>` (record + timeline), guarded for reader-only and owner-scoped (a caller only ever sees their own rows). The backend models `ReaderDelivery`/`ReaderDeliveryActivity` (new migration `b3e5a1f2c0e4`), destination derived from the user profile, `flask seed` restoring per-print-reader rows (current + 4 delivered editions + 4 timeline events) idempotently, digital-only subscribers returning an empty list. `backendReader.deliveries()/deliveryGet()` + `appClient.reader.deliveries()/deliveryDetail()` with `isNetworkError` fallback to `delivery-store`. No page keeps `delivery-store` as its source of truth once the backend responds.`
- **Runtime Verification:** `PASSED (35/35 + clean frontend gates). Smoke `%TEMP%/opencode/phase_h_reader_deliveries_smoke.py`: guards (401 unauth, 403 admin/business), viewer list 1 current (NQ-20260825, "Route preparing", tone info, destination Brussels, Belgium) + 4 Delivered history rows, detail timeline 4 events in order + delivered rows return no timeline, case-insensitive lookup, unknown code 404, owner-scoping (same tracking code returns each caller's own profile city), digital-only reader empty list + 404, reseed idempotent (still 5 rows / 4 timeline events). `npm run typecheck`, `npm run lint`, `npm run build` all clean.`
- **Blockers:** `None`
- **Description:** `Move the demo print-delivery records that `ReaderDeliveriesPage`/`ReaderDeliveryDetailPage` previously hardcoded from `delivery-store.js`/`demoData.js` into per-user MySQL rows served by Flask, mirroring the block-by-block backend-migration pattern used for the subscription snapshot. The reader's own deliveries are returned by `user_id`, so the same tracking code across readers stays isolated. Public `/delivery` and its tracking lookup remain untouched (out of scope).`

### TASK-H2: Reader Reading History Backend (Model, Migration, Routes, Seed) And Page Wiring

- **Phase:** `Phase H - Reader Deliveries Backend Wiring` (continuing the reader workspace backend migration)
- **Owner:** `Both`
- **Status:** `done`
- **Implementation side:** `Both`
- **Actor(s):** `Reader`
- **Route(s) or endpoint(s):** `GET /api/v1/reader/history`; `POST /api/v1/reader/history`
- **Files touched:** `backend/models/reading_history.py`, `backend/models/__init__.py`, `backend/migrations/versions/c1d2e3f4a5b6_reading_history.py`, `backend/routes/reader.py`, `backend/seed.py`, `frontend/src/api/backendClient.js`, `frontend/src/api/appClient.js`, `frontend/src/lib/use-reader-history.js`, `frontend/src/components/dashboard/ReaderWorkspacePages.jsx`, `frontend/src/pages/ArticleDetail.jsx`
- **Depends on:** `TASK-H1`
- **Spec:** `frontend/src/lib/reading-history.js` + `demoData.js` `readerHistoryRows` contract (id, articleId, item, category, status, tone, date) with `seedArticleIds` mapping (history-1->news-1, history-2->business-1, history-3->feat-1, history-4->community-1)
- **Setup reference:** `backend/README.md` (migrations), `AGENTS.md`
- **Conventions:** `Follow AGENTS.md` (`/api/v1` prefix, camelCase JSON, `role_required`, presentation derived from machine state, idempotent seed)
- **Definition of Done:** `ReaderHistoryPage sources reading history from `GET /api/v1/reader/history` (per-user rows, ordered by last activity desc; status label + tone delivered in the payload, derived server-side from the machine state), guarded for reader-only and owner-scoped. `POST /api/v1/reader/history` upserts by (user, articleId) and applies actions `view` (read_today when last read today else read), `share` (shared), `toggle_save` (saved / revert to viewing state when unsaved), returning the refreshed list; validating articleId + action (400 otherwise). Model `ReadingHistoryEntry` (new migration `c1d2e3f4a5b6`), `user_id` Integer FK to `users.id`. `flask seed` restores the 4 pinned demo rows per reader (viewer + 4 demo readers incl. digital-only) idempotently. `backendReader.history()/recordHistoryEvent()` + `appClient.reader.history()` (fallback `getReadingHistoryRows()`) and `appClient.reader.recordHistoryEvent()` (fire-and-forget, swallowed outside the reader session). Article read/share/bookmark on `ArticleDetail` publish events to the backend while the local mock stays the offline-only source. No page keeps `reading-history.js` as its source of truth once the backend responds.`
- **Runtime Verification:** `PASSED (35/35 + clean frontend gates). Smoke `%TEMP%/opencode/phase_h_reading_history_smoke.py`: reseed-first for determinism; guards (401 unauth GET/POST, 403 business), viewer list contract (4 rows, demo article ids, statuses Read today/Saved/Archive soon/Completed + tones info/success/warning/neutral, order by date desc), 400 (missing articleId, unsupported action), POST view -> Read today, toggle_save -> Saved and unsave -> viewing state, share on saved row keeps Saved, persistence across GET, owner scoping (amelie toggle does not leak into viewer rows; her own rows isolated), digital-only reader also serves its own 4 rows, reseed idempotent (4 rows, seed states restored). `npm run typecheck`, `npm run lint`, `npm run build` (1786 modules) all clean.`
- **Blockers:** `None`
- **Description:** `Wire the reader history surface (`ReaderHistoryPage` on `/dashboard/history`) to a real Flask endpoint instead of the client mock. The backend models `ReadingHistoryEntry`, serves list/record endpoints that keep presentation (status/tone/date) derived from machine state, and `ArticleDetail` view/share/bookmark events are POSTed fire-and-forget so the same interaction remains synchronous with the local mock and offline-friendly.`

### TASK-H3: Reader Billing (Payment Events) Backend (Model, Migration, Routes, Seed) And Page Wiring

- **Phase:** `Phase H - Reader Workspace Backend Wiring` (continuing the reader workspace backend migration)
- **Owner:** `Both`
- **Status:** `done`
- **Implementation side:** `Both`
- **Actor(s):** `Reader`
- **Route(s) or endpoint(s):** `GET /api/v1/reader/billing`
- **Files touched:** `backend/models/reader_billing.py`, `backend/models/__init__.py`, `backend/migrations/versions/d4e5f6a7b8c9_reader_billing.py`, `backend/routes/reader.py`, `backend/seed.py`, `frontend/src/api/backendClient.js`, `frontend/src/api/appClient.js`, `frontend/src/lib/reader-billing-store.js`, `frontend/src/lib/use-reader-billing.js`, `frontend/src/components/dashboard/ReaderWorkspacePages.jsx`
- **Depends on:** `TASK-H2`
- **Spec:** `frontend/src/lib/demoData.js` `readerBillingRows` contract (id, item, amount, status, tone, date) — entries blend paid invoices, an upcoming renewal reminder, and a payment-method check
- **Setup reference:** `backend/README.md` (migrations), `AGENTS.md`
- **Conventions:** `Follow AGENTS.md` (`/api/v1` prefix, camelCase JSON, `role_required`, presentation derived from machine state, idempotent seed)
- **Definition of Done:** `ReaderBillingPage sources its payment history table from `GET /api/v1/reader/billing` (per-user events ordered by event date desc; item label, amount rendering (currency for invoice/renewal, payment method for payment events), status label + tone delivered in the payload, derived server-side from entry_type/status), guarded for reader-only and owner-scoped; digital-only readers still get their own events. Model `ReaderBillingEntry` (new migration `d4e5f6a7b8c9`, `user_id` Integer FK to `users.id`). `flask seed` restores the 4 pinned demo events per reader (renewal reminder upcoming / INV-2026-08 paid / payment method check verified / INV-2026-07 paid, event dates 2026-09-11/08-11/08-10/07-11) idempotently. `backendReader.billing()` + `appClient.reader.billing()` (network-error fallback to `reader-billing-store` demo rows) + `useReaderBilling` hook. The renewal snapshot panel keeps sourcing `useReaderOverview` (unchanged). No page keeps `readerBillingRows` as its source of truth once the backend responds.`
- **Runtime Verification:** `PASSED (31/31 + clean frontend gates). Smoke `%TEMP%/opencode/phase_h_reader_billing_smoke.py`: guards (401 unauth, 403 business), viewer list contract (4 events; date-desc order renewal -> INV-2026-08 -> payment check -> INV-2026-07; item/amount (`€24.99` + `PayPal`)/status/tone (Upcoming/warning, Paid/success, Verified/info)), non-empty formatted dates (September 11 / August 11 / August 10 / July 11 2026), owner-scoping (distinct row ids across marta/amelie), digital-only reader returns its own 4 events, reseed idempotent (4 events, pinned order restored). `npm run typecheck`, `npm run lint`, `npm run build` (1788 modules) all clean.`
- **Blockers:** `None`
- **Description:** `Move the payment-history rows that `ReaderBillingPage` previously read straight from the `readerBillingRows` demo array into per-user MySQL rows served by Flask, completing the reader workspace migration (overview/deliveries/history/billing all backend-backed; none of the reader workspace pages keep a client store as source of truth once the backend responds).`

### TASK-H4: Reader Workspace Notification Badge Counts Backed By Reader Endpoints

- **Phase:** `Phase H - Reader Workspace Backend Wiring` (follow-up close-out)
- **Owner:** `Both`
- **Status:** `done`
- **Implementation side:** `Frontend`
- **Actor(s):** `Reader`
- **Route(s) or endpoint(s):** consumes `GET /api/v1/reader/deliveries` + `GET /api/v1/reader/billing`
- **Files touched:** `frontend/src/lib/notifications.js`
- **Depends on:** `TASK-H1`, `TASK-H3`
- **Spec:** `frontend/src/lib/notifications.js` `readerBadges()` — the last client-mocked reader surface still feeding `ReaderOverviewPage` (shortcut chips) and `DashboardShell` (section badges / totals). Deliveries chip = current delivery not Delivered; billing chip = count of Upcoming/Overdue events.
- **Setup reference:** `backend/README.md`, `AGENTS.md`
- **Conventions:** `Follow AGENTS.md` (reader-driven endpoints, graceful offline fallback, keep demo stores as fallback only)
- **Definition of Done:** `Reader shortcut badges source their counts from the reader backend rows instead of demo arrays. `loadReaderBadges()` (module-scoped, deduped) fetches `appClient.reader.deliveries()` (current-row status -> deliveries chip 1/0, digital-only readers -> 0) and `appClient.reader.billing()` (Upcoming/Overdue rows -> billing chip) via a shared `readerCountsFrom` (now also the single implementation of the demo fallback, unchanged shape), then bumps the store so `useStoreVersion` consumers re-render. Loading is kicked off from the reader-workspace badge hooks (`useWorkspaceSectionBadges`/`useWorkspaceNotificationTotal` when `workspaceKey === "reader"`, `useSectionBadgeForPath` when the path maps to the reader workspace). Demo counts (`readerDeliveryCurrent`/`readerBillingRows`) remain the in-flight/offline fallback only; admin/business badges unchanged.`
- **Runtime Verification:** `PASSED (frontend gates). `npm run typecheck`, `npm run lint`, `npm run build` (1788 modules) all clean. Backend counts verified live: current delivery `NQ-20260825` status "Route preparing" (`!= Delivered` -> deliveries chip 1) and billing renewal event status "Upcoming" (-> billing chip 1) — matching the previous demo chips for the primary reader. No HTTP/404 regressions (deliveries + billing endpoints already covered by TASK-H1/H3 smokes).`
- **Blockers:** `None`
- **Description:** `The overview/shell notification chips were the last reader surface still counting demo arrays. Now they compute from the reader deliveries + billing endpoints so a reader's chips reflect their own backend rows (including digital-only readers, whose deliveries chip correctly reads 0), while keeping the demo rows as the loading/offline fallback.`

### TASK-H5: Reader Privacy Page Consents And Governance Requests Confirmed Backend-Wired

- **Phase:** `Phase H - Reader Workspace Backend Wiring` (follow-up close-out)
- **Owner:** `Both`
- **Status:** `done` (verified 2026-09-20, two stale copy messages fixed)
- **Implementation side:** `Frontend`
- **Actor(s):** `Reader`
- **Route(s) or endpoint(s):** `GET`/`PUT /api/v1/account/consents`; `GET`/`POST /api/v1/account/governance-requests`
- **Files touched:** `frontend/src/components/dashboard/ReaderWorkspacePages.jsx`
- **Depends on:** Phase A consent/governance routes (`backend/routes/privacy.py`, migration `e4f7a2c9b610`), TASK-E1 (admin close-out)
- **Spec:** `ReaderPrivacyPage` consent checklist + governance request panel; reader endpoints in `privacy.py` with admin review queue
- **Setup reference:** `backend/README.md`, `AGENTS.md`
- **Conventions:** `Follow AGENTS.md` (reader-driven endpoints, camelCase JSON, graceful offline fallback via localStorage)
- **Definition of Done:** `ReaderPrivacyPage consents come from `GET /api/v1/account/consents` (persisted by `PUT /api/v1/account/consents`), and the governance queue comes from `GET /api/v1/account/governance-requests` (export/deletion created via `POST /api/v1/account/governance-requests`, action mapped through `GOVERNANCE_ACTIONS["reader"]`). `appClient.account.getConsentSettings`/`saveConsentSettings`/`listGovernanceRequests`/`requestDataExport`/`requestDeletion` hit `backendConsents`/`backendGovernance` and keep localStorage only as an offline fallback. Success copy no longer references the "local governance queue".`
- **Runtime Verification:** `PASSED (13/13 + clean frontend gates). Smoke `%TEMP%/opencode/privacy_review_smoke.py`: unauth GET /account/consents 401; viewer GET 200 with all three consent keys; PUT toggles + persists on re-read; GET /account/governance-requests 200 with the seeded reader row; POST export 201 returning id/type ("Data export")/status ("Queued")/date/createdAt/notes; re-list reflects the created row; business governance 403 for reader; unknown action 400; original consent values restored. `npm run typecheck`, `npm run lint`, `npm run build` all clean after the message copy fix.`
- **Blockers:** `None`
- **Description:** `Reconcile the stale inventory claim that ReaderPrivacyPage is still `appClient.account.*` localStorage with `no consent/governance routes` — the Phase A reader endpoints exist and the page already consumes them through `appClient.account.*` (backend-first, localStorage only offline). Only genuine gaps were fixed: two success messages that still said requests were "logged in the local governance queue" now say they are "submitted for the privacy review queue". Reader workspace now fully backend-served (overview, deliveries, history, billing, profile, privacy).`

### TASK-H6: Public Delivery Tracking Page Backed By Reader Endpoints

- **Phase:** `Phase H - Reader Workspace Backend Wiring` (follow-up close-out)
- **Owner:** `Both`
- **Status:** `done`
- **Implementation side:** `Frontend`
- **Actor(s):** `Reader` (public page keeps guest/demo lookup)
- **Route(s) or endpoint(s):** consumes `GET /api/v1/reader/deliveries`, `GET /api/v1/reader/deliveries/<trackingId>`, `GET /api/v1/reader/overview`
- **Files touched:** `frontend/src/pages/Delivery.jsx`
- **Depends on:** `TASK-H1` (reader delivery model + list/detail routes), `TASK-G2` (overview snapshot), `TASK-G5`
- **Spec:** `pages/Delivery.jsx` public `Track your delivery` page; hero + timeline driven by a tracking code (URL `?trackingId=` or current edition), personalized for a matched reader subscription (destination, print/subscription-aware notes)
- **Setup reference:** `backend/README.md`, `AGENTS.md`
- **Conventions:** `Follow AGENTS.md` (backend-first, demo store kept only as guest/in-flight/offline fallback, hooks established in TASK-H1/G6 reused rather than new transport)
- **Definition of Done:** ``/delivery` stops reading `delivery-store` + `reader-subscription` synchronously. A logged-in reader's tracking lookup resolves against `GET /api/v1/reader/deliveries/<trackingId>` (delivery + timeline) and the subscription personalization comes from `useReaderOverview` (`GET /api/v1/reader/overview`, local snapshot only in-flight/offline); the current-edition comparison uses `useReaderDeliveries` (`GET /api/v1/reader/deliveries`). Guests and offline sessions keep the `delivery-store` sample lookup unchanged (sample codes, inline validation errors). Timeline icons fall back positionally (first Clock, last Truck) since backend activities carry no icon. Logged-in readers get real per-reader rows; unknown/non-owned tracking IDs resolve to `No shipment found` instead of leaking a demo row.`
- **Runtime Verification:** `PASSED (9/9 HTTP + clean frontend gates). Smoke `%TEMP%/opencode/public_delivery_review_smoke.py`: unauth GET /reader/deliveries 401; viewer list 200 with 5 seeded rows carrying trackingId/edition/status/tone/eta/date/destination/note; GET detail by own tracking id 200 with `delivery` + `timeline` (activity items carry label/description/badge/status/tone/sortOrder); unknown tracking id 404; viewer overview isPrintSubscriber true. `npm run typecheck`, `npm run lint`, `npm run build` all clean (uses the existing `useReaderDeliveries`/`useReaderDeliveryDetail`/`useReaderOverview` hooks, no new transport code).`
- **Blockers:** `None`
- **Description:** `The public tracking page was the last reader surface still sourcing `delivery-store` + `reader-subscription` directly. It now uses the established backend-first hooks: authenticated readers get their own shipped deliveries + timelines and live subscription snapshot; guests/offline keep the demo sample lookup, so the public marketing flow still works without a backend. `reader-subscription.js` and `delivery-store.js` remain offline fallbacks only, completing the reader workspace migration.`

## Phase I - Public Checkout Backend Wiring

> Scope note: moves the public subscription checkout (`/subscribe/checkout`) and
> its confirmation page (`/subscribe/success`) from the offline localStorage
> session mock to the Flask backend. A guest can open a checkout session, pay by
> card or PayPal, and land on a success page whose confirmation re-reads the
> session from the backend. localStorage checkout sessions remain only the
> in-flight/offline fallback.

### TASK-I1: Checkout Session Backend, Checkout + Success Pages Backend-Wired

- **Phase:** `Phase I - Public Checkout Backend Wiring`
- **Owner:** `Both`
- **Status:** `done`
- **Implementation side:** `Both`
- **Actor(s):** `Guest`, `Reader`
- **Route(s) or endpoint(s):** `GET /api/v1/payment-methods`; `POST /api/v1/subscriptions/checkout`; `GET /api/v1/subscriptions/checkout/<session_id>`; `POST /api/v1/subscriptions/checkout/<session_id>/confirm`
- **Files touched:** `backend/models/checkout_session.py`, `backend/models/__init__.py`, `backend/migrations/versions/5e6f7a8b9c0d_checkout_sessions.py`, `backend/routes/checkout.py`, `backend/services/payments.py`, `backend/app.py`, `frontend/src/lib/card-utils.js`, `frontend/src/lib/payment-methods.js`, `frontend/src/lib/checkout-store.js`, `frontend/src/api/backendClient.js`, `frontend/src/api/appClient.js`, `frontend/src/lib/demoData.js`, `frontend/src/pages/SubscribeCheckout.jsx`, `frontend/src/pages/SubscribeSuccess.jsx`, `frontend/src/components/forms/CheckoutProgress.jsx` (deleted, unused)
- **Depends on:** `TASK-G2` (reader overview snapshot), `TASK-E2` (subscription catalog), `TASK-H3` (reader billing entry pattern)
- **Spec:** `frontend/src/lib/checkout-store.js` swap-in offline contract; `docs/project.md` reader subscription/pricing; `AGENTS.md` backend-first + localStorage-on-network-error pattern
- **Setup reference:** `backend/README.md` (migrations), `AGENTS.md`
- **Conventions:** `Follow AGENTS.md` (`/api/v1` prefix, camelCase JSON, no role middleware on open checkout routes, ASCII-only DB content, float() over Decimal equality, idempotent seed)
- **Definition of Done:** `Backend: `CheckoutSession` model + migration `5e6f7a8b9c0d`; open `routes/checkout.py` blueprint (`GET /payment-methods`, create with server-side quote (299.88 yearly / 24.99 monthly incl. VAT), `GET` session by id, confirm) with Stripe-ready `services/payments.py` gateway (simulated intents unless `STRIPE_SECRET_KEY` is set); confirm validates card (Luhn/expiry/CVC) or PayPal email, upserts reader User by email + profile/consents, replaces the user's `UserSubscription` (renewal now + 365 d / 30 d), inserts `ReaderBillingEntry` invoice, marks session succeeded; card PAN/CVC never persisted. Frontend: `card-utils.js` (format/brand/Luhn/expiry/mask), `payment-methods.js` (default methods), `checkout-store.js` (localStorage read/write + `toCheckoutSession` mapper); `backendClient` `backendPaymentMethods`/`backendCheckout`; `appClient.checkout` block (create/get/confirm, backend-first, localStorage fallback only on network error). `SubscribeCheckout.jsx` one-page layout with payment details as the FIRST/top section (Stripe-like segmented Card/PayPal pills, card panel, per-field errors), then plan/billing, contact, delivery, consents, sticky order summary + pay; `SubscribeSuccess.jsx` reads the session from `appClient.checkout.get(sessionId)` with NO localStorage read path. Dead demo exports (`readerCheckoutPlans`/`readerCheckoutSteps`/`readerPaymentMethods`) and `CheckoutProgress.jsx` removed.`
- **Runtime Verification:** `PASSED (29/29 backend smoke + clean frontend gates). Smoke `%TEMP%/opencode/checkout_backend_smoke.py` against app test client + live MySQL: GET payment-methods 200 (card+paypal); create invalid plan/missing address/bad email 400; create 201 quote matches price; GET open session 200; Luhn-invalid + expired cards 400; confirm 200 succeeded with brand/last4 `Visa **** 4242` (ASCII-safe mask); idempotent re-confirm; PayPal flow; user/profile/consents/subscription/billing persistence; expired-session confirm 400 and GET marks expired. Frontend: `npm run typecheck`, `npm run lint`, `npm run build` all clean, including the success-page transform that removed the localStorage fallback + legacy `?status=` override.`
- **Blockers:** `None`
- **Description:** `Give the public subscription checkout a real backend: open guest checkout routes with server-side quoting and payment confirmation, a `CheckoutSession` row that survives reloads, and checkout + success pages that are backend-first (localStorage sessions kept only as the offline/in-flight fallback). The success page now re-reads its confirmed session from `GET /api/v1/subscriptions/checkout/<session_id>` and renders either the confirmation details or the recorded non-success state; it no longer sources localStorage sessions or the legacy `?status=` override.`

### TASK-I2: Admin-Customizable Legal Policy Pages (Terms, Privacy, Refund, Cookies)

- **Phase:** `Phase I - Public Checkout Backend Wiring`
- **Owner:** `Both`
- **Status:** `done`
- **Implementation side:** `Both`
- **Actor(s):** `Reader`, `Admin`
- **Route(s) or endpoint(s):** `GET /api/v1/legal`; `GET /api/v1/legal/<key>`; `GET /api/v1/admin/legal-pages`; `PUT /api/v1/admin/legal-pages/<key>`; `POST /api/v1/admin/legal-pages/<key>/reset`; frontend `/terms`, `/privacy`, `/refund`, `/cookies`, `/admin/legal-content`
- **Files touched:** `backend/models/legal_page.py`, `backend/models/__init__.py`, `backend/migrations/versions/6f8a0b1c2d3e_legal_pages.py`, `backend/routes/legal.py`, `backend/seed.py`, `backend/app.py`, `frontend/src/lib/legal-store.js`, `frontend/src/api/backendClient.js`, `frontend/src/api/appClient.js`, `frontend/src/lib/use-legal-page.js`, `frontend/src/components/legal/LegalPolicyPage.jsx`, `frontend/src/pages/Terms.jsx`, `frontend/src/pages/Privacy.jsx`, `frontend/src/pages/Refund.jsx` (new), `frontend/src/pages/Cookies.jsx` (new), `frontend/src/pages/AdminLegalContent.jsx` (new), `frontend/src/App.jsx`, `frontend/src/components/newspaper/Footer.jsx`, `frontend/src/lib/dashboard-config.js`, `frontend/src/lib/demoData.js`
- **Depends on:** `TASK-I1` payment-method/consent conventions; existing `AdminGovernance` page pattern (admin nav, role guard)
- **Spec:** `frontend/src/lib/legal-store.js` offline contract; `AGENTS.md` backend-first + localStorage-on-network-error pattern; `docs/project.md` refund/cookies policy requirements
- **Setup reference:** `backend/README.md` (migrations), `AGENTS.md`
- **Conventions:** `Follow AGENTS.md` (`/api/v1` prefix, camelCase JSON, `@jwt_required()` + `@role_required("admin")` on admin legal routes, ASCII-only DB content, idempotent seed, `.jsx` files use JSDoc casts instead of TS generics)
- **Definition of Done:** `Backend: `LegalPage` model + migration `6f8a0b1c2d3e` (id/key, eyebrow, title, intro, sections JSON `[{heading, body}]`, clauses JSON `[{heading, items[]}]`, contacts JSON `[{label, email}]`, last_updated, published); `routes/legal.py` with public `legal_bp` (list + get-by-key, 404 when unknown/unpublished) and admin `admin_legal_bp` (list, upsert PUT with title-required / 400 on malformed blocks / 404 unknown key, reset-to-seed POST); `SEEDED_LEGAL_PAGES` for terms/privacy/refund/cookies + idempotent `_upsert_legal_pages()` in `flask seed`. Frontend: `legal-store.js` (LEGAL_PAGE_KEYS, DEFAULT_LEGAL_PAGES mirroring seed, `toLegalPage` normalizer, localStorage read/write/get/save, `**`-suffixed storage key `*_legal_pages`); `backendClient` `backendLegal` + `appClient.legal.get` (public, backend-first) and `appClient.admin.legal` (list/update/reset with `requireAdmin()` and offline local mirror fallback); `useLegalPage()` hook + shared `LegalPolicyPage.jsx` renderer (instant fallback content, not-found branch, section grid, clause bullet panels, contacts mailto panel); `Terms/Privacy` rewritten backend-first + new `Refund`/`Cookies` pages; routes + footer links; admin editor `AdminLegalContent.jsx` (page tabs, header/intro/published fields, grid CRUD for sections/clauses/contacts, Publish + Restore-default) at `/admin/legal-content` with nav entry. Dead `demoData` legal exports (`termsHighlights`, `privacyPrinciples`, `privacyRights`, `privacyRetentionNotes`, `policyContacts`) removed.`
- **Runtime Verification:** `PASSED (38/38 backend smoke + clean frontend gates + idempotent seed). Smoke `%TEMP%/opencode/legal_backend_smoke.py` against app test client + live MySQL: GET /legal list 200 with 4 keys; GET each key 200 (terms 6 sections, privacy 4, refund 5, cookies 4); unknown key 404; admin GET 200 (non-admin 401/403); PUT upsert persists changes and 404 unknown; reset-kill modifies 200 then reset restores 200 and seed idempotence re-run clean; malformed section 400; unpublished page 404 on public GET. Frontend: `npm run typecheck`, `npm run lint`, `npm run build` all clean (admin editor needs `children` prop for `DashboardPanel` notice boxes).`
- **Blockers:** `None`
- **Description:** `Make the public policy pages (Terms, Privacy, plus new Refund and Cookies pages linked in the footer) admin-customizable end to end: a `LegalPage` table seeded with the four policies, public backend-served pages with a localStorage offline fallback, and an admin Legal Content editor at `/admin/legal-content` that can update any page or restore the seed defaults, publishing changes to the live site immediately.`
