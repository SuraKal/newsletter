# Category Management Phase

Backend-driven categories replacing localStorage mock. Admin CRUD + public listing wired to Flask.

---

## TASK-101 — Backend Category & Subcategory models + migration

Create SQLAlchemy models in `backend/models/`:
- `Category` — `id` (UUID), `label` (unique, required), `slug` (unique, auto-generated from label), `image` (nullable URL), `template_key` (string, default `DEFAULT_ARTICLE_TEMPLATE`), `sort_order` (int), `created_at`, `updated_at`
- `Subcategory` — `id` (UUID), `category_id` (FK → categories), `label` (required), `slug` (auto-generated), `sort_order` (int), `created_at`

Generate Alembic migration. Seed with the 10 existing `CATEGORIES` from `frontend/src/lib/constants.js` plus representative subcategories. Include `category_id` FK on existing `articles` table (nullable, set via a later content phase).

**Verify:** `python -m flask db migrate && python -m flask db upgrade` succeeds; seed runs without error.

---

## TASK-102 — Backend Category CRUD API routes

Add `backend/routes/categories.py` blueprint:
- `GET /api/categories` — public, returns all categories with subcategories nested, ordered by `sort_order`
- `GET /api/categories/<id_or_slug>` — public, single category + its subcategories
- `POST /api/admin/categories` — admin JWT, create category (label required, image optional, template_key optional)
- `PUT /api/admin/categories/<id>` — admin JWT, update category fields + replace subcategory list (accept `{ subcategories: [{ id?, label }] }` for upsert/delete semantics)
- `DELETE /api/admin/categories/<id>` — admin JWT, delete category (cascade subcategories; articles keep their label text)
- `PUT /api/admin/categories/<id>/order` — admin JWT, accept `{ sort_order: int }` to reorder

Register blueprint in `backend/app.py`. Protect admin routes with `@require_admin`.

**Verify:** curl each endpoint; admin routes return 401 without JWT; public routes work unauthenticated.

---

## TASK-103 — Frontend backendClient category helpers

Add to `frontend/src/api/backendClient.js`:
- `listCategories()` → `GET /api/categories` (public)
- `getCategory(idOrSlug)` → `GET /api/categories/<id_or_slug>` (public)
- `adminCreateCategory(data)` → `POST /api/admin/categories`
- `adminUpdateCategory(id, data)` → `PUT /api/admin/categories/<id>`
- `adminDeleteCategory(id)` → `DELETE /api/admin/categories/<id>`
- `adminReorderCategory(id, sortOrder)` → `PUT /api/admin/categories/<id>/order`

Map responses to `{ id, label, slug, image, templateKey, subcategories: [{ id, label, slug }] }`.

**Verify:** `npm run lint && npm run typecheck` pass.

---

## TASK-104 — Wire public `/categories` page to backend

Update `frontend/src/pages/Categories.jsx` and `frontend/src/components/newspaper/CategoriesSection.jsx`:
- Fetch categories from `backendClient.listCategories()` on mount
- On network error (backend down), fall back to current `getCategories()` from `category-store.js`
- Replace hardcoded `CATEGORIES` string array usage with fetched category objects

**Verify:** With backend running, categories come from DB; with backend stopped, localStorage mock shows.

---

## TASK-105 — Wire admin `AdminCategories` page to backend

Update `frontend/src/pages/AdminCategories.jsx`:
- Fetch categories from `backendClient.listCategories()` on mount (fallback to `category-store.js` on error)
- Replace `saveCategory`/`deleteCategory`/`moveCategory` localStorage calls with `backendClient.adminCreateCategory` / `adminUpdateCategory` / `adminDeleteCategory` / `adminReorderCategory`
- Category image: keep client-side file→dataURL upload; send resulting data URL (or external URL) to backend in the `image` field
- After successful create/update/delete, refetch list from backend (simplest correct approach)

**Verify:** Creating, editing, deleting, reordering categories persists across page reloads when backend is running.

---

## TASK-106 — Wire `appClient.js` category catalog sync

Update `frontend/src/api/appClient.js`:
- On `appClient.ready` (startup) and after `auth.login`, call `backendClient.listCategories()` and store result
- Expose `appClient.categories.list()` returning the synced array (fallback to `category-store.js` values)
- Update `Masthead.jsx` and `Footer.jsx` to read categories from `appClient.categories.list()` instead of hardcoded strings

**Verify:** Nav footer links and masthead category links reflect backend data; no hardcoded category slugs in nav/footer after this task.

---

# Article Management Phase

Backend-driven articles replacing the `content-store.js` localStorage mock. Admin create/edit/publish/schedule/delete wired to Flask; published articles surface on the public site from the same backend data. Mirrors the Category phase structure (model → API → client helpers → page wiring → sync).

---

## TASK-107 — Backend Article model + migration

Create `Article` model in `backend/models/article.py` adopting the field set already used by `content-store.js` records so the admin editor round-trips cleanly:
- `id` (UUID), `headline` (required), `summary` (Text), `body` (Text), `image` (Text, nullable — supports data URL uploads like categories)
- `author`, `editor` (strings), `status` (Draft / Scheduled / Published), `tone` (string), `access_label`, `read_time` (nullable)
- `source` (placement key: `latest` / `hero` / `sidebar` / `featured` / `editorial` / `admin`) — matches `ARTICLE_PLACEMENTS`
- `category_id` (FK → `categories.id`, nullable), plus denormalized `category_label` snapshot so articles survive category renames
- `date`, `public_access_date`, `publish_date`, `publish_time`, `clicks` (int, default 0)
- `meta` (JSON) capturing category-specific template extras (`council_session`, `event_date`, `location`, `scoreline_focus`, `market_impact`) instead of dedicated columns
- `created_at`, `updated_at`

Register in `backend/models/__init__.py`, generate Alembic migration. This also completes the `category_id` FK on `articles` that TASK-101 deferred.

**Verify:** `flask db migrate && flask db upgrade` succeeds; seed optionally plants a few sample articles linked to seeded categories.

---

## TASK-108 — Backend Article API routes + publishing

Add `backend/routes/articles.py` blueprint (`url_prefix="/api/v1"`), register in `backend/app.py`:
- `GET /articles` — public, only `status == "Published"`, optional `?category=` and `?source=` filters, ordered by `publish_date` desc
- `GET /articles/<id_or_slug>` — public single published article
- `GET /admin/articles` — admin JWT, all statuses (list view for the queue)
- `POST /admin/articles` — admin JWT, create article (validates `headline`; default status Draft)
- `PUT /admin/articles/<id>` — admin JWT, update fields + status; on `status = "Published"` set `publish_date` to now if blank
- `DELETE /admin/articles/<id>` — admin JWT
- `POST /admin/articles/<id>/publish` — admin JWT, transition to Published with headline validation (mirrors "Publish now" button)
- `POST /admin/articles/<id>/unpublish` — admin JWT, revert to Draft

Return camelCase JSON shape mirroring `content-store` rows (`{ article: { id, headline, summary, body, image, ..., meta, createdAt } }`). Protect admin routes with `@jwt_required()` + `@role_required("admin")`; public 401/403 behavior verified like categories.

**Verify:** curl each endpoint; admin routes return 401 without token; public routes hide Draft/Scheduled articles.

---

## TASK-109 — Frontend `backendClient.js` article helpers

Add to `frontend/src/api/backendClient.js`, mirroring the existing `backendCategories` pattern:
- `listArticles(params)` → `GET /articles` (public, published only)
- `getArticle(idOrSlug)` → `GET /articles/<id_or_slug>`
- `adminListArticles()` → `GET /admin/articles`
- `adminCreateArticle(data)` → `POST /admin/articles`
- `adminUpdateArticle(id, data)` → `PUT /admin/articles/<id>`
- `adminDeleteArticle(id)` → `DELETE /admin/articles/<id>`
- `adminPublishArticle(id)` / `adminUnpublishArticle(id)` → the dedicated publish/unpublish routes

Map responses to `{ id, headline, summary, body, image, author, editor, status, tone, source, categoryId, categoryLabel, readTime, accessLabel, publishDate, publishTime, clicks, meta }`, with `body` normalized to a string. Reuse the same `isNetworkError` fallback semantics.

**Verify:** `npm run lint && npm run typecheck` pass.

---

## TASK-110 — Wire `AdminContentList` to backend

Update `frontend/src/pages/AdminContentList.jsx`:
- On mount, fetch `backendClient.adminListArticles()`; on network error fall back to `getAdminContentRows()` from `content-store.js`
- Map backend rows to the table shape (id, headline, source placement label, category label, status, tone, image)
- Derive category + status filter options from fetched data; count draft/scheduled/published like today
- Table "headline" link keeps `/admin/content/<id>` (backend `id` is a UUID; mock ids stay strings)
- Deleted-from-backend rows disappear on reload through the refetch after mutations elsewhere

**Verify:** With backend running, queue shows DB articles; with backend stopped, localStorage mock shows.

---

## TASK-111 — Wire `AdminContentEditor` (and form) to backend

Update `frontend/src/pages/AdminContentEditor.jsx`:
- Edit mode: fetch `backendClient.getArticle(id)`; on network error fall back to `getRawArticleById(id)`; map backend `meta` JSON back into the form's template field keys (`councilSession`, `eventDate`, `location`, `scorelineFocus`, `marketImpact`)
- Create/update: `adminCreateArticle` / `adminUpdateArticle` (unflatten `meta` from the form extras); fall back to `saveArticle` from `content-store.js` on network error; keep the fake 300ms spinner only for the fallback path
- "Publish now" → `adminPublishArticle(id)` (fallback: `saveArticle` with status Published)
- Category dropdown: prefer `backendClient.listCategories()` (fallback `getCategoryLabels()` from `category-store.js`)
- Preserve client-side image → dataURL upload; the backend `image` column is already `Text` so large data URLs persist

**Verify:** Saving a new article back-end, reloading, and editing it again round-trips all fields including template extras and the cover image.

---

## TASK-112 — Wire `AdminSchedule` + scheduled publishing

Update `frontend/src/pages/AdminSchedule.jsx`:
- Fetch scheduled articles from `backendClient.adminListArticles()` filtered to those with a `publishDate`/`publishTime`; fall back to `getAdminScheduleRows()` on network error
- Keep the release label logic driven by backend `status` (Published → "Live in newsroom", Scheduled → "Subscriber release", else sign-off)
- Publishing a draft or schedule change goes through `adminPublishArticle` / `adminUpdateArticle` so the backend owns the state machine

**Verify:** Schedule page reflects real publish windows for DB articles with backend up; mock rows show when backend is down.

---

## TASK-113 — Public article read path + `appClient.js` sync

Make the public site read published articles from the backend instead of `content-store.js`:
- Add backend-backed getters to `frontend/src/lib/content-store.js` (or a thin wrapper) so `getAllArticles`, `getHeroArticle`, `getLatestNews`, `getEditorials`, `getCategoryArticles`, `getArticleById`, and `getPublicListingArticles` serve `backendClient.listArticles()` results when the backend is reachable, falling back to the mock otherwise
- Via `appClient.js` startup sync (like TASK-106 categories) or per-page fetch — keep the graceful network-error fallback consistent
- Key placement mapping (`source`) drives which public slot each article lands in, so a backend article with `source: "hero"` renders in the hero slider

**Verify:** With backend running, articles created in `/admin/content` appear on Home/News/Categories; Draft/Scheduled stay hidden; with backend stopped the seeded mock renders.

---

Once TASK-113 is done, the mock article store remains only as the offline fallback (same role `category-store.js` and `getCategories()` play after the Category phase).

---

# Company & Business Account Management Phase

Backend-driven business accounts replacing the `company-store.js` localStorage mock. The business-apply submission flow, the admin lead/account workflow, and the business-dashboard company snapshot all wire to Flask. Mirrors the Category/Article phase structure (model → API → client helpers → admin wiring → business wiring → sync), and touches the non-admin surfaces (`BusinessApply`, `BusinessApplySuccess`, `BusinessOverviewPage`, notification badges) because they consume the same underlying company records.

---

## TASK-114 — Backend CompanyAccount model + migration

Create `CompanyAccount` in `backend/models/company.py` adopting the entity shape already used by `company-store.js` records so the admin pages and apply form round-trip cleanly:
- `id` (UUID), `company` (required), `tier` (nullable), `volume` (nullable), `billing` (nullable), `region` (nullable)
- `status` — one of `COMPANY_WORKFLOW_STATES` (`Draft` / `Submitted` / `Under review` / `Quote ready` / `Approved` / `Declined` / `Converted to account`), exported as a module constant mirroring the mock's canonical list
- `owner_user_id` (FK → `users.id`, nullable, index), `owner_email` (nullable), `work_email` (nullable)
- `lead` (JSON) — raw BusinessApply form payload
- `quote` (JSON) — populated when the workflow reaches "Quote ready"
- `reviewed_at` (nullable), `account_activated_at` (nullable), `created_at`, `updated_at`
- `to_dict()` → camelCase (`ownerUserId`, `workEmail`, `accountActivatedAt`, …) matching the mock record shape
- `TONE_FOR_STATUS` mapping (same as `workflowTone` in the mock) so badges render without client-side inference

Register in `backend/models/__init__.py`, generate Alembic migration. Seed with the 4 active `adminCompanyRows` accounts from `demoData.js` (`status: "Converted to account"`/"Invoice review"/"Onboarding" normalized to the canonical list) plus one "Submitted" lead mirroring `business-account-1`.

**Verify:** `flask db migrate && flask db upgrade` succeeds; seed runs without error.

---

## TASK-115 — Backend business + admin company API routes

Add `backend/routes/companies.py` blueprint (url_prefix `/api/v1`), register in `backend/app.py`, mirror `_parse_data`/`_find_*` helpers used by `articles.py`:
- `POST /business/applications/draft` — any logged-in user, saves an application with `status: "Draft"`, sets `owner_user_id` from the JWT
- `POST /business/applications` — any logged-in user, submits (`status: "Submitted"`), `headline`-style validation on `organizationName`
- `GET /business/company` — authenticated, returns the caller's snapshot matched by `owner_user_id` (falls back to `owner_email`/`work_email` match), `{ entity | null }`
- `GET /business/applications/<id>` — authenticated, the entity only if the caller owns it (404 for anyone else)
- `GET /admin/companies` — admin JWT, all entities ordered newest-first (leads + accounts)
- `GET /admin/companies/<id>` — admin JWT, single entity
- `POST /admin/companies/<id>/review` / `quote` / `approve` / `convert` / `decline` — admin JWT, guarded transitions enforcing the mock's state machine (e.g. `quote` only from "Under review" or "Quote ready"; `decline` only from Submittable/Under review/Quote ready; `convert` only from "Approved"; sets `quote` on `quote`, `reviewedAt` on first transition, `ownerEmail` + `accountActivatedAt` on `convert`)

All requests return `{ companyAccount: {...} }`; admin routes use `@jwt_required()` + `@role_required("admin")`.

**Verify:** curl each endpoint; admin routes 401 without token; a business user cannot read another company's application (404).

---

## TASK-116 — Frontend `backendClient.js` company helpers

Add `backendCompanies` to `frontend/src/api/backendClient.js`, mirroring the `backendArticles` pattern:
- `submitApplication(data)` → `POST /business/applications`
- `saveDraftApplication(data)` → `POST /business/applications/draft`
- `getBusinessCompany()` → `GET /business/company`
- `getMyApplication(id)` → `GET /business/applications/<id>`
- `adminListCompanies()` → `GET /admin/companies`
- `adminGetCompany(id)` → `GET /admin/companies/<id>`
- `adminReview(id)` / `adminPrepareQuote(id)` / `adminApprove(id)` / `adminConvert(id)` / `adminDecline(id)` → the transition endpoints

Map responses to the mock entity shape (`{ id, company, tier, volume, billing, status, region, ownerEmail, ownerUserId, workEmail, lead, quote, reviewedAt, accountActivatedAt, createdAt }`) and re-export/validate workflow states through the existing `COMPANY_WORKFLOW_STATES`. Reuse the same `isNetworkError` fallback semantics.

**Verify:** `npm run lint && npm run typecheck` pass.

---

## TASK-117 — Wire `AdminCompanies` to backend

Update `frontend/src/pages/AdminCompanies.jsx`:
- On mount, fetch `backendCompanies.adminListCompanies()`; on network error fall back to `getCompanyLeads()`/`getCompanyAccounts()`
- Classify each backend row into the leads vs accounts tables using the same rule as the mock (`status === "Converted to account"` → account table, else leads table) — the raw `status` badge comes straight from the row
- Replace the `startCompanyReview` / `prepareCompanyQuote` / `approveCompanyLead` / `convertCompanyLead` / `declineCompanyLead` button actions with the matching `backendCompanies.admin*` calls, falling back to the `company-store.js` transition on network error
- Refetch the admin list after each successful transition so the tables stay in sync with the backend

**Verify:** With backend running, submitting through the apply flow then moving a lead through review → quote → approve → convert persists across reloads; with backend stopped, the localStorage mock renders and transitions.

---

## TASK-118 — Wire `AdminCompanyDetail` to backend

Update `frontend/src/pages/AdminCompanyDetail.jsx`:
- Fetch `backendCompanies.adminGetCompany(companyId)` on mount (network-error fallback to `getCompanyEntityById`); resolve the workflow presentation from the fetched `status`
- Header actions (`Start review` / `Prepare quote` / `Approve quote` / `Convert account` / `Decline`) call the matching `backendCompanies.admin*` endpoints with the mock-store fallback + refetch after success
- Panels (fact list, application details, operations note, prepared quote) read from the fetched `lead`/`quote` JSON when present

**Verify:** Detail view reflects backend state after each transition; opening a URL like `/admin/companies/<seed-id>` renders seeded companies with backend up.

---

## TASK-119 — Wire `BusinessApply`, `BusinessApplySuccess` to backend

Update `frontend/src/pages/BusinessApply.jsx`:
- **Save draft** → `backendCompanies.saveDraftApplication(formData)` (network-error fallback: `saveCompanyLeadDraft`)
- **Submit** → `backendCompanies.submitApplication(formData)` (network-error fallback: `submitCompanyLead`); redirect to `/business/apply/success?request=<id>`
- Keep pre-fill from `useAuth().user` and the `?draft={id}` load (draft load stays client-side from `getCompanyEntityById` fallback, or the returned draft id)

Update `frontend/src/pages/BusinessApplySuccess.jsx`:
- On mount, fetch `backendCompanies.getMyApplication(requestId)` (network-error fallback to current `getCompanyEntityById`/localStorage lead)
- Derive status badge + quote section from the fetched `status`/`quote` so a live request shows the true backend state

**Verify:** Submitting an application against a running backend creates a row visible in `/admin/companies`; the success page tracks its live workflow state (Submitted → Under review → Quote ready → Approved) without a reload of the mock.

---

## TASK-120 — Business dashboard snapshot + `appClient.js` company sync + notification badge

Update `frontend/src/pages/BusinessOverviewPage.jsx`:
- Fetch `backendCompanies.getBusinessCompany()` on mount (network-error fallback to `getBusinessCompanySnapshot(user.email)`); feed the fetched/fallback entity into the existing workflow-presentation render so the overview banner reflects live state

Update `frontend/src/api/appClient.js`:
- Add startup + post-login sync like `refreshCategoriesFromBackend`: fetch `backendCompanies.getBusinessCompany()` for an authenticated business user and cache it under a `company_sync` key; expose `appClient.company.snapshot()` returning the synced snapshot (fallback to the mock store) so `BusinessOverviewPage`/`BusinessSettings` share one read path

Update `frontend/src/lib/notifications.js`:
- The admin "Companies" badge count and the business "Settings" badge gate should use the synced company list/snapshot instead of `getCompanyLeads()` alone; keep mock fallback on network error

**Verify:** Business-dashboard overview reflects the live company entity with backend up; admin sidebar badge counts real submitted leads; mock shows when backend is down.

---

Once TASK-120 is done, the mock company store remains only as the offline fallback (same role `category-store.js`/`content-store.js` play after their phases). The business operations surfaces (team, orders, invoices, locations, shipments, governance requests) stay mocked pending their own future phases.

---

# Business Locations & Shipments Phase

Backend-driven delivery destinations and shipment runs for approved company accounts. This phase replaces the `business-ops-store.js` locations mock and the `shipment-store.js` business shipment mock while preserving them as offline fallbacks. It deliberately excludes orders, order requests, and invoices, which will be handled in the next phase.

---

## TASK-121 — Backend business location and shipment models + migration

Create SQLAlchemy models in `backend/models/`:

- `BusinessLocation` — `id` (UUID), `company_account_id` (FK → `company_accounts.id`, indexed), `location` (required display name), `region`, `address`, `contact`, `copies` (string or integer), `status` (`Ready` / `Review` / `Confirm contact`), `created_at`, `updated_at`.
- `ShipmentRun` — `id` (UUID), `company_account_id` (FK → `company_accounts.id`, indexed), `shipment_id` (unique human-readable run ID), `route`, `scope`, `status` (`Address review` / `Preparing` / `In dispatch` / `Delivered` / `Delayed`), `eta`, `created_at`, `updated_at`.
- `ShipmentEvent` — `id`, `shipment_run_id` (FK → `shipment_runs.id`, indexed), `event`, `status`, `occurred_at`, `note` (nullable). Events are returned oldest-first and replace `businessShipmentActivityRows` for the shipment detail page.

Add model exports and an Alembic migration. Seed approved company accounts with the existing location/shipment mock equivalents, attaching every row to a real `CompanyAccount`; do not create orphan rows.

**Verify:** `flask db upgrade && flask seed` succeeds; each seeded shipment and location has a valid company-account foreign key.

---

## TASK-122 — Backend location and shipment API routes with ownership rules

Add `backend/routes/business_operations.py` under `/api/v1`, register it in `backend/app.py`:

- `GET /business/locations` — authenticated business user; returns only locations for their approved company account.
- `GET /business/locations/<id>` — same ownership restriction; return 404 for another company’s location.
- `PUT /business/locations/<id>` — business user may update receiving-contact fields (`contact`, `address`) and may acknowledge `Review`/`Confirm contact` as `Ready`; reject edits to another company or unsupported status changes.
- `GET /business/shipments` — authenticated business user; returns only their company shipment runs, newest first.
- `GET /business/shipments/<id>` — return a shipment plus nested event timeline only when it belongs to the caller’s company.
- `POST /business/shipments/<id>/confirm-address` — allowed only while the run is `Address review`; records an event and advances to `Preparing`.
- `GET /admin/shipments` / `GET /admin/shipments/<id>` — admin-only operational view across companies.
- `PUT /admin/shipments/<id>` — admin-only updates to operational fields/status; append a `ShipmentEvent` whenever status changes.

Return camelCase JSON matching the existing row shapes, including `tone` derived on the server. Enforce JWT authentication and company ownership from the caller’s `CompanyAccount`, not a client-supplied company id.

**Verify:** A business user sees only their locations and runs; cross-company IDs return 404; admin endpoints return 401 without a token and can update a seeded shipment with an event recorded.

---

## TASK-123 — Frontend backend client helpers for locations and shipments

Add `backendBusinessOperations` to `frontend/src/api/backendClient.js`:

- `listLocations()` / `getLocation(id)` / `updateLocation(id, patch)`
- `listShipments()` / `getShipment(id)` / `confirmShipmentAddress(id)`
- `adminListShipments()` / `adminGetShipment(id)` / `adminUpdateShipment(id, patch)`

Normalize responses to the current frontend contracts:

- locations: `{ id, location, region, address, contact, copies, status, tone }`
- shipments: `{ id, shipmentId, label, route, scope, status, tone, eta, events: [{ id, event, status, tone, occurredAt, note }] }`

Use the existing `isNetworkError` convention so only an unreachable backend triggers the mock fallback; do not hide authorization or validation errors behind mock data.

**Verify:** `npm run lint && npm run typecheck` pass.

---

## TASK-124 — Wire `/business-dashboard/locations` and location detail to backend

Update `frontend/src/pages/BusinessLocations.jsx` and `frontend/src/pages/BusinessLocationDetail.jsx`:

- On mount, use `backendBusinessOperations.listLocations()`; fall back to `getBusinessLocationRows()` only on network error.
- Build filters, counts, and search options from the loaded list instead of static copy such as “9 active locations”.
- Detail route uses `getLocation(locationId)` with the same fallback.
- “Confirm receiving contact” uses `updateLocation(id, { status: "Ready" })` (or the dedicated backend acknowledgement route if implemented), refetches the detail/list state, and keeps `updateBusinessLocation` only for network fallback.
- Keep company ownership implicit; no company ID appears in URLs or request payloads.

**Verify:** Updating a company location’s contact/readiness survives refresh with the backend running; a different business account cannot open the detail URL; mock locations render with the backend offline.

---

## TASK-125 — Wire `/business-dashboard/shipments` and shipment detail to backend

Update `frontend/src/pages/BusinessShipments.jsx` and `frontend/src/pages/BusinessShipmentDetail.jsx`:

- Fetch shipment runs through `backendBusinessOperations.listShipments()` on mount, with `getBusinessShipmentRows()` as the network-only fallback.
- Derive route/status filters and summary labels from backend rows.
- Fetch a live shipment plus its `events` timeline in the detail route; fall back to `getShipmentById()` and `businessShipmentActivityRows` only when offline.
- Replace the business-side address confirmation action with `confirmShipmentAddress(id)` and refetch after success. Business users must not be able to mark a shipment dispatched or delivered.
- Keep the existing delivery/dispatch status actions for a later admin-shipment wiring task unless `AdminShipments` is explicitly included in this implementation.

**Verify:** A business user sees live shipment status and event history for their company, can confirm an address-review run once, and cannot change dispatch/delivery status. Offline fallback still renders the mock run list and detail page.

---

## TASK-126 — Shared business-operation sync and notification badges

Update the shared read paths after locations and shipments are wired:

- Add app-client startup/post-login refresh functions (or a small business-operations cache module) that cache the authenticated company’s location and shipment lists without mixing records across users.
- Update `frontend/src/lib/notifications.js` so business `locations` and `shipments` badges read these synced backend lists, with mock-store fallback only on network error.
- Ensure successful empty lists clear old cached rows and that logout clears the business-operation cache keys.

**Verify:** The business sidebar badges match real backend location/shipment states after refresh and after a confirmed-address mutation; they do not show another company’s data; backend-down mode retains mock badges.

---

After TASK-126, only `team`, `orders`, `order requests`, and `invoices` remain mocked within the business workspace. Start the next phase with orders and invoices; do not add order or invoice tables/routes as part of this locations-and-shipments phase.
