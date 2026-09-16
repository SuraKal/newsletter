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
