# Agent Tasks

## General Rules & Guidelines

- **Consult `AGENTS.md`**: Always read and follow the instructions in [`AGENTS.md`](../AGENTS.md) for architectural conventions, local environment setups, API guidelines, and frontend quality gates whenever guidance is needed.
- **Workspace Scope**: Do not work outside of the project's folder. All code, configuration, scripts, and documentation must stay within this project repository.
- **Task Granularity**: When a feature is requested, craft small, targeted sub-tasks designed to achieve those goals systematically and incrementally.
- **Evidence Over Intent**: Close tasks only after concrete runtime verification and satisfaction of the Definition of Done.

---

## Task Template

Use this exact structure for future tasks:

### TASK-XXX: [Title]
- **Phase:** `Phase X - [Name]`
- **Owner:** `Backend` | `Frontend` | `Both`
- **Implementation side:** `Backend` | `Frontend`
- **Actor(s):** `[Public guest / User / Company / Front desk / Individual owner / Admin]`
- **Route(s) or endpoint(s):** `[Exact frontend routes and/or backend endpoints]`
- **Files touched:** `[Explicit backend and frontend files/directories]`
- **Depends on:** `[Task IDs or none]`
- **Spec:** `[Relevant PRD sections + schema/API references]`
- **Setup reference:** `[BACKEND_SETUP.md / FRONTEND_PRD_READY.md / other relevant setup doc]`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `[Task-specific outcome in concrete terms]`
- **Runtime Verification:** `[Docker / local Python / frontend dev proxy / payment return / callback / direct endpoint smoke / resolved v2 URL check / none. Default to fail-first verification and fail-fast test flags where applicable.]`
- **Blockers:** `[Blocker link or none]`
- **Description:** `[Clear implementation intent and scope boundary]`

---

## Active Tasks

### TASK-201: Frontend AppClient Articles Get & Article Normalization
- **Phase:** `Phase J - Public Article Detail Dynamic Loading`
- **Owner:** `Frontend`
- **Implementation side:** `Frontend`
- **Actor(s):** `Public guest / User`
- **Route(s) or endpoint(s):** `GET /api/v1/articles/<key>`; `appClient.articles.get(id)`
- **Files touched:** `frontend/src/api/appClient.js`, `frontend/src/lib/content-store.js`
- **Depends on:** `None`
- **Spec:** `docs/project.md` - public article reading; `AGENTS.md` - backendClient call with localStorage / content-store fallback pattern
- **Setup reference:** `AGENTS.md`
- **Conventions:** `Follow AGENTS.md`
- **Definition of Done:** `appClient.articles.get(id)` is implemented and exported. It calls `backendArticles.get(id)` when online, normalizes the payload into a store/render-ready article shape with both `category` and `categoryLabel`, ensures `body` is available as paragraphs, and on `isNetworkError` or null response falls back to `getArticleById(id)` from `content-store.js`. Returns `null` if the article is not found in either source.
- **Runtime Verification:** `Exercise appClient.articles.get(id) for valid seeded IDs (e.g., 'hero-1', 'side-1', 'news-1') and non-existent IDs, verifying correct article objects and offline fallback.`
- **Blockers:** `None`
- **Description:** `Add the missing get(id) method to appClient.articles. Currently appClient.articles only exposes list(), refresh(), and recordView(id), which causes ArticleDetail.jsx to catch a TypeError and permanently fall back to getHeroArticle(). Bridge backendArticles.get(id) with getArticleById(id) fallback and proper article shape normalization.`

### TASK-202: Wire ArticleDetail And StoryBody For Dynamic Article Resolution
- **Phase:** `Phase J - Public Article Detail Dynamic Loading`
- **Owner:** `Frontend`
- **Implementation side:** `Frontend`
- **Actor(s):** `Public guest / User`
- **Route(s) or endpoint(s):** `/article/:id`
- **Files touched:** `frontend/src/pages/ArticleDetail.jsx`, `frontend/src/components/newspaper/ArticleTemplateView.jsx`
- **Depends on:** `TASK-201`
- **Spec:** `docs/project.md` - article detail presentation & access rules
- **Setup reference:** `AGENTS.md`
- **Conventions:** `Follow AGENTS.md`
- **Definition of Done:** `ArticleDetail.jsx` uses `appClient.articles.get(id)` to load the specific article corresponding to the URL parameter `id`. Initial state derives from `getArticleById(id)` or loading placeholder (avoiding hardcoded hero-1 flash). If the article does not exist, a clear "Article Not Found" state is shown with a link back to `/news`. `StoryBody` in `ArticleTemplateView.jsx` safely handles `article.body` whether passed as an array of paragraph strings or a single newline-delimited text blob without runtime `.map()` errors. Related stories and access gates compute based on the active article.
- **Runtime Verification:** `Navigate to /article/side-1, /article/side-2, /article/news-1, and /article/non-existent-id, verifying distinct headlines, categories, bodies, and layout templates without defaulting to hero-1.`
- **Blockers:** `None`
- **Description:** `Fix ArticleDetail.jsx so it properly consumes the article returned by appClient.articles.get(id) instead of reading payload.article from an undefined function. Guard against missing articles and ensure body rendering in StoryBody is robust across data sources.`

### TASK-203: End-To-End Runtime Verification & Quality Gates
- **Phase:** `Phase J - Public Article Detail Dynamic Loading`
- **Owner:** `Frontend`
- **Implementation side:** `Frontend`
- **Actor(s):** `Public guest / User`
- **Route(s) or endpoint(s):** `/article/:id`; `GET /api/v1/articles/<key>`
- **Files touched:** `docs/Agent tasks.md`, `frontend/`
- **Depends on:** `TASK-201`, `TASK-202`
- **Spec:** `docs/project.md` - public reading verification; `AGENTS.md` quality gates
- **Setup reference:** `AGENTS.md`
- **Conventions:** `Follow AGENTS.md`
- **Definition of Done:** `All frontend quality gates (npm run lint, npm run typecheck, npm run build) pass cleanly. Direct verification confirms navigation to different article IDs displays their distinct contents, layout templates, reading history tracking, and share links.`
- **Runtime Verification:** `Run npm run typecheck, npm run lint, npm run build. Verify HTTP /api/v1/articles/<key> responses against frontend rendering.`
- **Blockers:** `None`
- **Description:** `Run comprehensive quality gates and record verification evidence in docs/Agent tasks.md.`

### TASK-204: Admin Article Access Mode & Scheduling Schema & Business Logic
- **Phase:** `Phase K - Admin Dynamic Article Locking & Access Scheduling`
- **Owner:** `Both`
- **Implementation side:** `Both`
- **Actor(s):** `Admin / Public guest / User`
- **Route(s) or endpoint(s):** `POST /api/v1/articles`, `PUT /api/v1/articles/<id>`, `GET /api/v1/articles/<id>`
- **Files touched:** `backend/models/article.py`, `backend/routes/articles.py`, `frontend/src/lib/demoData.js`, `frontend/src/lib/content-store.js`
- **Depends on:** `TASK-202`
- **Spec:** `AGENTS.md`, `docs/project.md`
- **Setup reference:** `AGENTS.md`
- **Conventions:** `Follow AGENTS.md`
- **Definition of Done:** `accessMode` (`auto` | `locked` | `public`) and `publicAccessDate` are properly supported in the backend Article model, API endpoints, `toStoreArticle`, `toRenderArticle`, and `getArticleAccessState`. `getArticleAccessState` honors explicit admin lock overrides (`locked` forces subscriber-only, `public` forces open access, `auto` evaluates `publicAccessDate` vs current date).
- **Runtime Verification:** `Test getArticleAccessState with 'locked', 'public', and scheduled 'publicAccessDate' values, verifying correct access permissions and lock labels.`
- **Blockers:** `None`
- **Description:** `Add accessMode field and logic across backend schema, frontend store normalization, and access state evaluator to allow admins to force lock/unlock articles or set scheduled public release dates.`

### TASK-205: Admin Content Detail Lock & Schedule Controls UI
- **Phase:** `Phase K - Admin Dynamic Article Locking & Access Scheduling`
- **Owner:** `Frontend`
- **Implementation side:** `Frontend`
- **Actor(s):** `Admin`
- **Route(s) or endpoint(s):** `/admin/content/:id`, `/admin/content/new`
- **Files touched:** `frontend/src/pages/AdminContentEditor.jsx`, `frontend/src/components/forms/AdminArticleForm.jsx`
- **Depends on:** `TASK-204`
- **Spec:** `AGENTS.md`
- **Setup reference:** `AGENTS.md`
- **Conventions:** `Follow AGENTS.md`
- **Definition of Done:** `AdminContentEditor.jsx` and `AdminArticleForm.jsx` include intuitive UI controls for Access Mode selector (`Auto (Scheduled Release)`, `Always Locked (Subscriber Only)`, `Always Open (Public Access)`), a `publicAccessDate` date picker, and real-time preview of the resulting public access state. Changes save cleanly to backend API and local store.
- **Runtime Verification:** `Open /admin/content/:id, toggle accessMode between Auto, Locked, Public, modify publicAccessDate, save, and verify payload and UI persistence.`
- **Blockers:** `None`
- **Description:** `Expose access mode selection and scheduled release date picker in the Admin Content Editor and Form.`

### TASK-206: Public Article Detail Access Gate & Lock Banner Integration
- **Phase:** `Phase K - Admin Dynamic Article Locking & Access Scheduling`
- **Owner:** `Frontend`
- **Implementation side:** `Frontend`
- **Actor(s):** `Public guest / User / Admin`
- **Route(s) or endpoint(s):** `/article/:id`
- **Files touched:** `frontend/src/components/newspaper/ArticleTemplateView.jsx`, `frontend/src/pages/ArticleDetail.jsx`
- **Depends on:** `TASK-204`, `TASK-205`
- **Spec:** `AGENTS.md`
- **Setup reference:** `AGENTS.md`
- **Conventions:** `Follow AGENTS.md`
- **Definition of Done:** `ArticleTemplateView.jsx` displays accurate lock banners based on the admin's configured access mode: custom scheduled date message ("Full article stays locked until [date]"), forced lock message ("Locked by Editorial Desk"), or full article unlocked view ("Public Access"). Quality gates (`npm run typecheck`, `npm run lint`, `npm run build`) pass cleanly.
- **Runtime Verification:** `Navigate to /article/:id for articles set to Auto, Locked, and Public, verifying accurate banners, full text visibility, and quality gates passing cleanly.`
- **Blockers:** `None`
- **Description:** `Wire the public article view and lock banners to render according to the admin's custom access settings and quality verification.`

### TASK-207: Backend & Frontend Client Real Article Sync for Admin Workspace
- **Phase:** `Phase L - Real Backend Database Article Synchronization for Admin Workspace`
- **Owner:** `Both`
- **Implementation side:** `Both`
- **Actor(s):** `Admin`
- **Route(s) or endpoint(s):** `GET /api/v1/admin/articles`, `GET /api/v1/articles`
- **Files touched:** `frontend/src/api/backendClient.js`, `frontend/src/api/appClient.js`, `frontend/src/lib/content-store.js`
- **Depends on:** `TASK-206`
- **Spec:** `AGENTS.md`
- **Setup reference:** `AGENTS.md`
- **Conventions:** `Follow AGENTS.md`
- **Definition of Done:** `backendArticles.adminList()` and `appClient.articles` expose unified getters that fetch real records directly from the database table `articles` (via backend API). If admin endpoint returns unauthenticated or network error, fallback seamlessly retrieves synced database records from local store before resorting to mock seed defaults.
- **Runtime Verification:** `Test backendArticles.adminList() and appClient.articles.list() against backend database, verifying real database records are returned.`
- **Blockers:** `None`
- **Description:** `Wire admin content fetching to prioritize real database table records and synced store data over mock seed arrays.`

### TASK-208: Admin Content List & Editor Real Record Integration & Verification
- **Phase:** `Phase L - Real Backend Database Article Synchronization for Admin Workspace`
- **Owner:** `Frontend`
- **Implementation side:** `Frontend`
- **Actor(s):** `Admin`
- **Route(s) or endpoint(s):** `/admin/content`, `/admin/content/:id`
- **Files touched:** `frontend/src/pages/AdminContentList.jsx`, `frontend/src/pages/AdminContentEditor.jsx`
- **Depends on:** `TASK-207`
- **Spec:** `AGENTS.md`
- **Setup reference:** `AGENTS.md`
- **Conventions:** `Follow AGENTS.md`
- **Definition of Done:** `/admin/content` and `/admin/content/:id` load and display real database table records (just like `/news`). Creating, updating, or changing access modes for an article updates the database table and reflects immediately in both admin and public news feeds. All quality gates (`npm run typecheck`, `npm run lint`, `npm run build`) pass cleanly.
- **Runtime Verification:** `Navigate to /admin/content, verify real database records display in the table, edit an article, and confirm persistence across /admin/content and /news.`
- **Blockers:** `None`
- **Description:** `Update AdminContentList and AdminContentEditor to display and edit real database table records seamlessly with quality verification.`

### TASK-209: Native Date/Time Inputs, Public Article Date Formatting, & Access Helpers
- **Phase:** `Phase M - Admin Content Editor UI Streamlining & Public Article Detail Polish`
- **Owner:** `Frontend`
- **Implementation side:** `Frontend`
- **Actor(s):** `Admin / Public guest / User`
- **Route(s) or endpoint(s):** `/admin/content/new`, `/admin/content/:id`, `/article/:id`
- **Files touched:** `frontend/src/lib/content-store.js`, `frontend/src/lib/demoData.js`, `frontend/src/pages/AdminContentEditor.jsx`
- **Depends on:** `TASK-208`
- **Spec:** `AGENTS.md`
- **Setup reference:** `AGENTS.md`
- **Conventions:** `Follow AGENTS.md`
- **Definition of Done:** Date string helper functions handle bidirectional conversion between display strings (e.g., "September 10, 2026"), ISO date format (`YYYY-MM-DD`), and time format (`HH:mm`) for both admin form native inputs and public article detail presentation on `/article/:id`.
- **Runtime Verification:** `Exercise date formatting helpers with various date formats and confirm valid YYYY-MM-DD, HH:mm, and formatted display strings for public detail rendering.`
- **Blockers:** `None`
- **Description:** `Add date/time parsing helpers and state normalization to support native HTML5 date and time inputs in admin and clean date displays on public article details.`

### TASK-210: Streamline Admin Article Form UI & Public Article Detail Page Layout
- **Phase:** `Phase M - Admin Content Editor UI Streamlining & Public Article Detail Polish`
- **Owner:** `Frontend`
- **Implementation side:** `Frontend`
- **Actor(s):** `Admin / Public guest / User`
- **Route(s) or endpoint(s):** `/admin/content/new`, `/admin/content/:id`, `/article/:id`
- **Files touched:** `frontend/src/components/forms/AdminArticleForm.jsx`, `frontend/src/pages/AdminContentEditor.jsx`, `frontend/src/pages/ArticleDetail.jsx`, `frontend/src/components/newspaper/ArticleTemplateView.jsx`
- **Depends on:** `TASK-209`
- **Spec:** `AGENTS.md`
- **Setup reference:** `AGENTS.md`
- **Conventions:** `Follow AGENTS.md`
- **Definition of Done:** `AdminArticleForm.jsx` and `AdminContentEditor.jsx` are streamlined to present necessary fields only. Duplicate Access Mode and date/time controls are removed. `publishDate`, `publicAccessDate`, and `publishTime` use native date and time picker controls (`<input type="date">`, `<input type="time">`). Public article detail page on `/article/:id` (`ArticleDetail.jsx` & `ArticleTemplateView.jsx`) is adjusted so layout, metadata, lock banners, and story presentation are streamlined, uncluttered, and show only necessary information.
- **Runtime Verification:** `Open /admin/content/new, /admin/content/:id, and /article/:id, verifying single Access Mode selector, native date pickers, and clean, uncluttered layout on both admin and public article pages.`
- **Blockers:** `None`
- **Description:** `Remove duplicate access controls, convert text date/time fields to native pickers, and polish styling on both admin content editor and public article detail pages.`

### TASK-211: Fix Form Submission, Navigation, Public Article Resolution, and Quality Gates
- **Phase:** `Phase M - Admin Content Editor UI Streamlining & Public Article Detail Polish`
- **Owner:** `Frontend`
- **Implementation side:** `Frontend`
- **Actor(s):** `Admin / Public guest / User`
- **Route(s) or endpoint(s):** `/admin/content/new`, `/admin/content/:id`, `/article/:id`
- **Files touched:** `frontend/src/pages/AdminContentEditor.jsx`, `frontend/src/pages/ArticleDetail.jsx`
- **Depends on:** `TASK-210`
- **Spec:** `AGENTS.md`
- **Setup reference:** `AGENTS.md`
- **Conventions:** `Follow AGENTS.md`
- **Definition of Done:** Creating a new article redirects automatically to `/admin/content/${newId}` upon success. Saving existing articles updates both backend database table and local store immediately. Public article viewing on `/article/:id` resolves and renders newly created/edited articles accurately. Quality gates (`npm run typecheck`, `npm run lint`, `npm run build`) pass cleanly.
- **Runtime Verification:** `Create a new article, verify redirect to /admin/content/:id, view the article on /article/:id, edit fields, save, and run typecheck, lint, build.`
- **Blockers:** `None`
- **Description:** `Fix form save/create handling, add post-create navigation, verify public article detail rendering, and run comprehensive quality gates.`




