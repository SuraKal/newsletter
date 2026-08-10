# Agent Tasks

Project references:

- Product scope: `docs/project.md`
- Dashboard inspiration: `docs/designs.jpg`
- Current app routes: `src/App.jsx`
- Local setup: `README.md`
- Repo guidance: `AGENTS.md`, `CLAUDE.md`

Assumptions:

- This repo is currently `frontend-first`.
- Backend endpoints listed below are `proposed contracts to design against` unless they already exist elsewhere in the product stack.
- Public surfaces should keep the editorial identity already present in `src/components/newspaper/*`.
- Authenticated surfaces should follow the softer control-center pattern from `docs/designs.jpg`.
- `CONVENTIONS.md` is not present in this repo, so use `AGENTS.md`, `CLAUDE.md`, and existing repo patterns as the effective conventions source.

## Phase 12 - Discovery And Dashboard Shell Spec

Phase goal: convert `docs/project.md` and `docs/designs.jpg` into an implementation-ready UI map so later work is driven by explicit surfaces, routes, shared patterns, and dashboard behavior rather than guesswork.

Phase rules:

- Treat this phase as `planning and UI architecture only` unless a task explicitly creates shared shell primitives.
- Use `docs/designs.jpg` as the source of truth for dashboard shell direction:
  - slim utility rail
  - top utility header
  - compact KPI cards
  - rounded panels
  - dense activity tables
  - search and filter rows
- Keep the public editorial experience distinct from the authenticated control-center experience.
- If route splitting is introduced later, preserve current public route behavior unless a task explicitly replaces it.

### TASK-120A: Frontend - Audit Current UI Surfaces And Route Inventory
- **Phase:** `Phase 12 - Discovery And Dashboard Shell Spec`
- **Owner:** `Frontend`
- **Implementation side:** `Frontend`
- **Actor(s):** `Public guest / User / Company / Admin`
- **Route(s) or endpoint(s):** `/, /news, /article/:id, /categories, /subscriptions, /business, /delivery, /login, /register, /forgot-password, /reset-password, /dashboard, /business-dashboard, /admin, /privacy, /terms`
- **Files touched:** `docs/Agent tasks.md`, `docs/project.md`, `src/App.jsx`, `src/pages/*`, `src/components/newspaper/*`
- **Depends on:** `none`
- **Spec:** `docs/project.md Sections 2, 3, 4, 5, 8, 10`
- **Setup reference:** `README.md`, `AGENTS.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `Every current route is classified as keep, redesign, split, or replace, and every requirement in project.md is mapped to a public, reader, business, admin, or delivery surface.`
- **Runtime Verification:** `none`
- **Blockers:** `none`
- **Description:** `Create the route and surface baseline for the UI rebuild so later tasks have a stable information architecture and scope boundary.`

### TASK-120B: Frontend - Convert designs.jpg Into A Reusable Dashboard Shell Spec
- **Phase:** `Phase 12 - Discovery And Dashboard Shell Spec`
- **Owner:** `Frontend`
- **Implementation side:** `Frontend`
- **Actor(s):** `User / Company / Admin`
- **Route(s) or endpoint(s):** `/dashboard, /business-dashboard, /admin, /delivery`
- **Files touched:** `docs/Agent tasks.md`, `docs/designs.jpg`, `src/pages/ReaderDashboard.jsx`, `src/pages/BusinessDashboard.jsx`, `src/pages/AdminDashboard.jsx`, `src/pages/Delivery.jsx`, `src/index.css`
- **Depends on:** `TASK-120A`
- **Spec:** `docs/project.md Sections 4.3, 4.5, 4.6, 8`, `docs/designs.jpg`
- **Setup reference:** `README.md`, `AGENTS.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `The dashboard shell is clearly defined with navigation zones, content regions, KPI blocks, table modules, search/filter behavior, and responsive rules that can be reused across reader, business, admin, and delivery views.`
- **Runtime Verification:** `none`
- **Blockers:** `none`
- **Description:** `Turn the inspiration image into a concrete dashboard system specification so every authenticated page pulls from the same shell language.`

## Phase 14 - Shared Authenticated UI Foundation

Phase goal: build the shared shell, primitives, and styling rules that all authenticated areas will use before individual dashboard pages are redesigned.

Phase rules:

- Treat this phase as `shared infrastructure first`, not feature-specific page work.
- Prefer reusable dashboard components over page-local markup.
- Keep public/editorial styles intact while introducing a separate authenticated visual layer.
- Do not hardcode business or admin-only assumptions into the shared shell.

### TASK-140A: Frontend - Build Shared Authenticated Shell And Route Strategy
- **Phase:** `Phase 14 - Shared Authenticated UI Foundation`
- **Owner:** `Frontend`
- **Implementation side:** `Frontend`
- **Actor(s):** `User / Company / Admin`
- **Route(s) or endpoint(s):** `/dashboard/*, /business-dashboard/*, /admin/*`
- **Files touched:** `src/App.jsx`, `src/components/dashboard/*`, `src/components/ui/*`, `src/lib/constants.js`
- **Depends on:** `TASK-120B`
- **Spec:** `docs/project.md Sections 4.5, 4.6, 8`
- **Setup reference:** `README.md`, `AGENTS.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `A shared authenticated shell exists with left utility rail, top header, section-level subnav, and a route structure that supports deeper dashboard pages without relying on one-file tab demos.`
- **Runtime Verification:** `frontend dev proxy`
- **Blockers:** `none`
- **Description:** `Create the structural frame for all account and admin areas so later page tasks can focus on content rather than layout scaffolding.`

### TASK-140B: Frontend - Build Shared Dashboard Primitives
- **Phase:** `Phase 14 - Shared Authenticated UI Foundation`
- **Owner:** `Frontend`
- **Implementation side:** `Frontend`
- **Actor(s):** `User / Company / Admin`
- **Route(s) or endpoint(s):** `/dashboard/*, /business-dashboard/*, /admin/*, /delivery`
- **Files touched:** `src/components/dashboard/*`, `src/components/delivery/*`, `src/components/ui/*`
- **Depends on:** `TASK-140A`
- **Spec:** `docs/project.md Sections 4.3, 4.5, 4.6`, `docs/designs.jpg`
- **Setup reference:** `README.md`, `AGENTS.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `Reusable KPI cards, summary cards, chart panels, activity tables, filter rows, empty states, status chips, and timeline blocks are available and ready to compose into reader, business, admin, and delivery pages.`
- **Runtime Verification:** `frontend dev proxy`
- **Blockers:** `none`
- **Description:** `Extract the common control-center modules so later pages stay visually consistent and easier to maintain.`

### TASK-140C: Frontend - Standardize Dashboard Tokens, States, And Responsive Rules
- **Phase:** `Phase 14 - Shared Authenticated UI Foundation`
- **Owner:** `Frontend`
- **Implementation side:** `Frontend`
- **Actor(s):** `Public guest / User / Company / Admin`
- **Route(s) or endpoint(s):** `all frontend routes`
- **Files touched:** `src/index.css`, `src/components/dashboard/*`, `src/components/ui/*`, `src/components/newspaper/*`
- **Depends on:** `TASK-140B`
- **Spec:** `docs/project.md Sections 7, 8`, `docs/designs.jpg`
- **Setup reference:** `README.md`, `AGENTS.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `Editorial and authenticated surfaces have consistent spacing, radii, shadows, status colors, responsive breakpoints, and interaction rules without collapsing into a single undifferentiated style.`
- **Runtime Verification:** `frontend dev proxy`
- **Blockers:** `none`
- **Description:** `Lock in the design tokens and layout behavior that will let public/news and dashboard/workspace pages coexist cleanly.`

## Phase 16 - Public Product Positioning And Reading Access UX

Phase goal: turn the public site into a clear expression of the product described in `project.md`, including subscriptions, delayed public access, print delivery, and business ordering.

Phase rules:

- Treat this phase as `public-facing only` unless a task explicitly introduces a shared auth-state or access-state dependency.
- Preserve the existing editorial tone and newspaper-inspired presentation.
- Make access and subscription rules visible in the reading experience, not only in marketing copy.
- Avoid leaking admin or internal workflow complexity onto public pages.

### TASK-160A: Frontend - Reposition Homepage Around Product Promise
- **Phase:** `Phase 16 - Public Product Positioning And Reading Access UX`
- **Owner:** `Frontend`
- **Implementation side:** `Frontend`
- **Actor(s):** `Public guest`
- **Route(s) or endpoint(s):** `/`
- **Files touched:** `src/pages/Home.jsx`, `src/components/newspaper/HeroSection.jsx`, `src/components/newspaper/LatestNewsSection.jsx`, `src/components/newspaper/DeliverySection.jsx`, `src/components/newspaper/BusinessSection.jsx`, `src/components/newspaper/SubscriptionSection.jsx`, `src/lib/demoData.js`
- **Depends on:** `TASK-140C`
- **Spec:** `docs/project.md Sections 1, 2, 3, 4.2, 4.3, 4.5, 5, 7`
- **Setup reference:** `README.md`, `docs/project.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `The homepage communicates sector-based publishing, digital plus physical newspaper delivery, subscriber-only recent access, business ordering, and logistics tracking with direct calls to action.`
- **Runtime Verification:** `frontend dev proxy`
- **Blockers:** `none`
- **Description:** `Upgrade the landing page from a strong brand experience into a strong product experience while keeping the editorial identity intact.`

### TASK-160B: Frontend - Redesign Subscription, Access, And Policy Messaging
- **Phase:** `Phase 16 - Public Product Positioning And Reading Access UX`
- **Owner:** `Both`
- **Implementation side:** `Frontend`
- **Actor(s):** `Public guest / User / Company`
- **Route(s) or endpoint(s):** `/subscriptions, /privacy, /terms, /api/subscriptions/plans, /api/subscriptions/access-policy`
- **Files touched:** `src/pages/Subscriptions.jsx`, `src/pages/Privacy.jsx`, `src/pages/Terms.jsx`, `src/lib/demoData.js`, `src/lib/LanguageContext.jsx`
- **Depends on:** `TASK-160A`
- **Spec:** `docs/project.md Sections 4.2, 4.4, 4.7, 6.1, 6.2`
- **Setup reference:** `README.md`, `docs/project.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `The subscription and policy pages explain monthly versus yearly billing, biweekly print delivery cadence, supported payment methods, consent implications, and one-month delayed public content access.`
- **Runtime Verification:** `frontend dev proxy`
- **Blockers:** `none`
- **Description:** `Clarify how the product actually works before onboarding begins so users understand the rules of billing, delivery, and access.`

### TASK-160C: Frontend - Add Reading Access States To News And Article Pages
- **Phase:** `Phase 16 - Public Product Positioning And Reading Access UX`
- **Owner:** `Both`
- **Implementation side:** `Frontend`
- **Actor(s):** `Public guest / User`
- **Route(s) or endpoint(s):** `/news, /categories, /article/:id, /api/articles, /api/articles/:id`
- **Files touched:** `src/pages/News.jsx`, `src/pages/Categories.jsx`, `src/pages/ArticleDetail.jsx`, `src/components/newspaper/NewsCard.jsx`, `src/lib/demoData.js`
- **Depends on:** `TASK-160B`
- **Spec:** `docs/project.md Sections 3.3, 4.1, 4.2`
- **Setup reference:** `README.md`, `docs/project.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `News lists and article pages support explicit UI states for active subscriber access, delayed public access, and recent gated content without breaking the current reading routes.`
- **Runtime Verification:** `frontend dev proxy`
- **Blockers:** `none`
- **Description:** `Bring subscription logic into the content experience itself so access rules feel real and productized.`

### TASK-160D: Frontend - Upgrade Business Landing And CTA Flow
- **Phase:** `Phase 16 - Public Product Positioning And Reading Access UX`
- **Owner:** `Frontend`
- **Implementation side:** `Frontend`
- **Actor(s):** `Company`
- **Route(s) or endpoint(s):** `/business`
- **Files touched:** `src/pages/BusinessPage.jsx`, `src/components/newspaper/BusinessSection.jsx`, `src/components/newspaper/BusinessContactSection.jsx`, `src/lib/demoData.js`
- **Depends on:** `TASK-160A`
- **Spec:** `docs/project.md Sections 4.4, 4.5, 5, 7`
- **Setup reference:** `README.md`, `docs/project.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `The business page clearly presents bulk orders, pricing-tier logic, invoicing expectations, delivery locations, and the path into business onboarding.`
- **Runtime Verification:** `frontend dev proxy`
- **Blockers:** `none`
- **Description:** `Make the B2B landing page feel like a serious operational offer rather than an informational side page.`

## Phase 18 - Subscription And Onboarding Flows

Phase goal: build the first complete path from visitor to paying or onboarded customer for both individual and business users.

Phase rules:

- Treat this phase as `conversion and onboarding work`, not dashboard operations work.
- Separate individual and business flows early.
- Keep payment and invoicing UX explicit even if final backend integration is stubbed.
- Do not mix business lead capture into the consumer checkout journey.

### TASK-180A: Frontend - Split Auth Entry For Individual And Business Journeys
- **Phase:** `Phase 18 - Subscription And Onboarding Flows`
- **Owner:** `Both`
- **Implementation side:** `Frontend`
- **Actor(s):** `Public guest / User / Company`
- **Route(s) or endpoint(s):** `/login, /register, /forgot-password, /reset-password, /api/auth/login, /api/auth/register, /api/auth/password/forgot, /api/auth/password/reset`
- **Files touched:** `src/pages/Login.jsx`, `src/pages/Register.jsx`, `src/pages/ForgetPassword.jsx`, `src/pages/ResetPassword.jsx`, `src/components/AuthLayout.jsx`, `src/lib/AuthContext.jsx`
- **Depends on:** `TASK-160B`
- **Spec:** `docs/project.md Sections 4.5, 4.7, 5, 6.2`
- **Setup reference:** `README.md`, `docs/project.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `Login and registration flows clearly differentiate individual and company journeys and collect enough account type context to route users into the correct next steps.`
- **Runtime Verification:** `frontend dev proxy`
- **Blockers:** `none`
- **Description:** `Refactor entry flows so account type is explicit and future dashboard routing is predictable.`

### TASK-180B: Frontend - Build Individual Subscription Checkout Flow
- **Phase:** `Phase 18 - Subscription And Onboarding Flows`
- **Owner:** `Both`
- **Implementation side:** `Frontend`
- **Actor(s):** `User`
- **Route(s) or endpoint(s):** `/subscriptions, /subscribe/checkout, /subscribe/success, /api/subscriptions/plans, /api/checkout/quote, /api/checkout/session`
- **Files touched:** `src/pages/Subscriptions.jsx`, `src/pages/SubscribeCheckout.jsx`, `src/pages/SubscribeSuccess.jsx`, `src/components/forms/*`, `src/App.jsx`, `src/lib/demoData.js`
- **Depends on:** `TASK-180A`
- **Spec:** `docs/project.md Sections 4.2, 4.4, 4.7, 6.1`
- **Setup reference:** `README.md`, `docs/project.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `An individual user can move through plan choice, billing cycle selection, delivery address capture, payment selection, and subscription confirmation with clear loading, validation, and success states.`
- **Runtime Verification:** `payment return`
- **Blockers:** `none`
- **Description:** `Create the core paid conversion flow for monthly and yearly subscriber plans.`

### TASK-180C: Frontend - Build Business Onboarding And Quote Request Flow
- **Phase:** `Phase 18 - Subscription And Onboarding Flows`
- **Owner:** `Both`
- **Implementation side:** `Frontend`
- **Actor(s):** `Company / Individual owner`
- **Route(s) or endpoint(s):** `/business/apply, /business/apply/success, /api/business/leads, /api/business/quote-request`
- **Files touched:** `src/pages/BusinessApply.jsx`, `src/pages/BusinessApplySuccess.jsx`, `src/components/forms/*`, `src/App.jsx`, `src/pages/BusinessPage.jsx`
- **Depends on:** `TASK-160D`, `TASK-180A`
- **Spec:** `docs/project.md Sections 4.4, 4.5, 4.7, 5, 7`
- **Setup reference:** `README.md`, `docs/project.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `A company user can submit organization details, contact info, expected volume, delivery locations, and invoicing preferences through a dedicated business onboarding flow.`
- **Runtime Verification:** `direct endpoint smoke`
- **Blockers:** `none`
- **Description:** `Build a separate B2B intake path that matches the operational complexity of bulk accounts.`

## Phase 20 - Reader Dashboard Workspace

Phase goal: replace the current reader dashboard demo with a real subscriber control center built on the shared shell from `docs/designs.jpg`.

Phase rules:

- Treat this phase as `reader-facing authenticated work only`.
- Keep overview information dense but not overloaded; details should open in deeper reader sections.
- Preserve reader trust by making delivery, billing, and access states immediately understandable.
- Do not introduce business or admin controls into the reader workspace.

### TASK-200A: Frontend - Redesign Reader Overview Dashboard
- **Phase:** `Phase 20 - Reader Dashboard Workspace`
- **Owner:** `Frontend`
- **Implementation side:** `Frontend`
- **Actor(s):** `User`
- **Route(s) or endpoint(s):** `/dashboard, /dashboard/overview`
- **Files touched:** `src/pages/ReaderDashboard.jsx`, `src/components/dashboard/*`, `src/lib/demoData.js`, `src/App.jsx`
- **Depends on:** `TASK-140A`, `TASK-140B`, `TASK-180B`
- **Spec:** `docs/project.md Sections 4.2, 4.5`, `docs/designs.jpg`
- **Setup reference:** `README.md`, `docs/project.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `The reader dashboard overview uses the new shell and exposes subscription status, next billing, next delivery, access state, and reading activity through compact KPI and summary modules.`
- **Runtime Verification:** `frontend dev proxy`
- **Blockers:** `none`
- **Description:** `Turn the current tab page into a proper subscriber home screen that feels like a real product workspace.`

### TASK-200B: Frontend - Build Reader Delivery, Billing, And Reading Modules
- **Phase:** `Phase 20 - Reader Dashboard Workspace`
- **Owner:** `Both`
- **Implementation side:** `Frontend`
- **Actor(s):** `User`
- **Route(s) or endpoint(s):** `/dashboard/deliveries, /dashboard/billing, /dashboard/history, /delivery, /api/me/deliveries, /api/me/invoices, /api/me/reading-history`
- **Files touched:** `src/pages/ReaderDashboard.jsx`, `src/pages/Delivery.jsx`, `src/components/delivery/*`, `src/components/dashboard/*`, `src/App.jsx`
- **Depends on:** `TASK-200A`
- **Spec:** `docs/project.md Sections 4.3, 4.5`
- **Setup reference:** `README.md`, `docs/project.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `Reader-facing delivery status, payment history, renewals, saved content, and reading history are organized into table and activity modules with search or filtering where it improves usability.`
- **Runtime Verification:** `frontend dev proxy`
- **Blockers:** `none`
- **Description:** `Deepen the subscriber experience so operational information is accessible and structured instead of being squeezed into simple tabs.`

### TASK-200C: Frontend - Build Reader Profile, Consent, And Self-Service Account Actions
- **Phase:** `Phase 20 - Reader Dashboard Workspace`
- **Owner:** `Both`
- **Implementation side:** `Frontend`
- **Actor(s):** `User`
- **Route(s) or endpoint(s):** `/dashboard/profile, /dashboard/privacy, /api/me/profile, /api/me/consents, /api/me/export, /api/me/delete-request`
- **Files touched:** `src/pages/ReaderDashboard.jsx`, `src/pages/Privacy.jsx`, `src/components/forms/*`, `src/components/dashboard/*`, `src/App.jsx`
- **Depends on:** `TASK-200A`
- **Spec:** `docs/project.md Sections 4.7, 6.2`
- **Setup reference:** `README.md`, `docs/project.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `Users can manage personal details, delivery address, contact preferences, consent visibility, data export, and deletion request actions through dedicated account surfaces.`
- **Runtime Verification:** `direct endpoint smoke`
- **Blockers:** `none`
- **Description:** `Add the profile and governance controls expected in a self-service subscription platform serving EU users.`

## Phase 22 - Shared Delivery And Logistics UI

Phase goal: create the shared shipment and delivery UI system that powers reader, business, and admin logistics views without fragmenting the delivery experience.

Phase rules:

- Treat this phase as `shared logistics UI work` before business-only or admin-only delivery specialization.
- Preserve the public `/delivery` route while upgrading its internals.
- Build reusable shipment components first, then aggregated operational views.
- Keep map and fleet visualization modular so future integration does not require a redesign.

### TASK-220A: Frontend - Build Shared Shipment Components And Redesign Reader Delivery View
- **Phase:** `Phase 22 - Shared Delivery And Logistics UI`
- **Owner:** `Frontend`
- **Implementation side:** `Frontend`
- **Actor(s):** `User / Company / Admin`
- **Route(s) or endpoint(s):** `/delivery, /dashboard/deliveries`
- **Files touched:** `src/pages/Delivery.jsx`, `src/components/delivery/*`, `src/components/dashboard/*`, `src/lib/demoData.js`
- **Depends on:** `TASK-140B`, `TASK-140C`
- **Spec:** `docs/project.md Sections 4.3, 4.5`, `docs/designs.jpg`
- **Setup reference:** `README.md`, `docs/project.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `A shared shipment component set exists for status headers, route timelines, KPI summaries, map placeholders, issue states, and history tables, and the main reader delivery experience uses it.`
- **Runtime Verification:** `frontend dev proxy`
- **Blockers:** `none`
- **Description:** `Build the logistics component foundation once so reader, business, and admin delivery surfaces can stay aligned.`

### TASK-220B: Frontend - Build Aggregated Delivery Views For Multi-Shipment Workspaces
- **Phase:** `Phase 22 - Shared Delivery And Logistics UI`
- **Owner:** `Both`
- **Implementation side:** `Frontend`
- **Actor(s):** `Company / Admin / Front desk`
- **Route(s) or endpoint(s):** `/business-dashboard/shipments, /admin/shipments, /api/company/shipments, /api/admin/shipments`
- **Files touched:** `src/pages/BusinessShipments.jsx`, `src/pages/AdminShipments.jsx`, `src/components/delivery/*`, `src/components/dashboard/*`, `src/App.jsx`
- **Depends on:** `TASK-220A`
- **Spec:** `docs/project.md Sections 4.3, 4.5, 4.6`
- **Setup reference:** `README.md`, `docs/project.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `Business and admin users can inspect multiple shipments, route summaries, delay states, and location-level delivery status in aggregated operational views.`
- **Runtime Verification:** `direct endpoint smoke`
- **Blockers:** `none`
- **Description:** `Extend the shared delivery system from single-reader tracking into the multi-shipment contexts required by business and operations users.`

## Phase 24 - Business Account Workspace

Phase goal: build a B2B control center for bulk subscriptions, delivery locations, invoicing, and team management using the shared dashboard shell.

Phase rules:

- Treat this phase as `company-facing authenticated work only`.
- Keep overview information concise and operational; deeper detail should open in dedicated business sections.
- Reuse the dashboard shell and shared logistics modules rather than inventing a separate B2B design language.
- Do not force companies through consumer subscription metaphors.

### TASK-240A: Frontend - Redesign Business Overview Dashboard
- **Phase:** `Phase 24 - Business Account Workspace`
- **Owner:** `Frontend`
- **Implementation side:** `Frontend`
- **Actor(s):** `Company / Individual owner`
- **Route(s) or endpoint(s):** `/business-dashboard, /business-dashboard/overview`
- **Files touched:** `src/pages/BusinessDashboard.jsx`, `src/components/dashboard/*`, `src/lib/demoData.js`, `src/App.jsx`
- **Depends on:** `TASK-140A`, `TASK-140B`, `TASK-180C`
- **Spec:** `docs/project.md Sections 4.5, 5, 8`, `docs/designs.jpg`
- **Setup reference:** `README.md`, `docs/project.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `The business overview uses the new shell and shows KPI cards for contract state, copy volume, next bulk delivery, invoice status, and shipment health.`
- **Runtime Verification:** `frontend dev proxy`
- **Blockers:** `none`
- **Description:** `Build the main B2B command center as a real operational dashboard rather than a light summary page.`

### TASK-240B: Frontend - Build Business Team, Orders, Invoices, And Locations Sections
- **Phase:** `Phase 24 - Business Account Workspace`
- **Owner:** `Both`
- **Implementation side:** `Frontend`
- **Actor(s):** `Company / Individual owner`
- **Route(s) or endpoint(s):** `/business-dashboard/team, /business-dashboard/orders, /business-dashboard/invoices, /business-dashboard/locations, /api/company/team, /api/company/orders, /api/company/invoices, /api/company/locations`
- **Files touched:** `src/pages/BusinessDashboard.jsx`, `src/pages/BusinessTeam.jsx`, `src/pages/BusinessOrders.jsx`, `src/pages/BusinessInvoices.jsx`, `src/pages/BusinessLocations.jsx`, `src/components/dashboard/*`, `src/App.jsx`
- **Depends on:** `TASK-240A`
- **Spec:** `docs/project.md Sections 4.4, 4.5, 5, 7`
- **Setup reference:** `README.md`, `docs/project.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `Company users can inspect and manage team members, bulk order volume, invoice records, and delivery destinations through dedicated operational views.`
- **Runtime Verification:** `direct endpoint smoke`
- **Blockers:** `none`
- **Description:** `Expand the B2B workspace into the main sections required to operate a business account day to day.`

### TASK-240C: Frontend - Add Business Shipment Monitoring Workspace
- **Phase:** `Phase 24 - Business Account Workspace`
- **Owner:** `Both`
- **Implementation side:** `Frontend`
- **Actor(s):** `Company`
- **Route(s) or endpoint(s):** `/business-dashboard/shipments, /api/company/shipments`
- **Files touched:** `src/pages/BusinessShipments.jsx`, `src/components/delivery/*`, `src/components/dashboard/*`, `src/App.jsx`
- **Depends on:** `TASK-220B`, `TASK-240A`
- **Spec:** `docs/project.md Sections 4.3, 4.5, 5`
- **Setup reference:** `README.md`, `docs/project.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `Business users can review aggregated shipment status, destination-level delivery states, and recent logistics activity without relying on the reader delivery view.`
- **Runtime Verification:** `direct endpoint smoke`
- **Blockers:** `none`
- **Description:** `Complete the B2B workspace with a dedicated logistics surface tailored to multi-location bulk accounts.`

## Phase 26 - Admin Editorial And Operations Workspace

Phase goal: transform the current admin dashboard into a modular control center for publishing, subscribers, business clients, shipments, and pricing operations.

Phase rules:

- Treat this phase as `internal only` admin workspace work unless a task explicitly changes a public contract.
- Keep admin list pages summary-first; open heavy detail only when the admin drills into a specific record or section.
- Preserve public reading and subscription routes while admin pages are expanded.
- If any admin-facing API contract changes during implementation, record it in the relevant backend changelog and schema source once those docs exist in the integrated stack.

### TASK-260A: Frontend - Redesign Admin Overview Control Center
- **Phase:** `Phase 26 - Admin Editorial And Operations Workspace`
- **Owner:** `Frontend`
- **Implementation side:** `Frontend`
- **Actor(s):** `Admin / Front desk`
- **Route(s) or endpoint(s):** `/admin, /admin/overview`
- **Files touched:** `src/pages/AdminDashboard.jsx`, `src/components/dashboard/*`, `src/lib/demoData.js`, `src/App.jsx`
- **Depends on:** `TASK-140A`, `TASK-140B`
- **Spec:** `docs/project.md Sections 4.1, 4.5, 4.6, 8`, `docs/designs.jpg`
- **Setup reference:** `README.md`, `docs/project.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `The admin landing view uses the shared shell and exposes publishing, subscriber, business, and delivery summaries with quick actions into deeper management sections.`
- **Runtime Verification:** `frontend dev proxy`
- **Blockers:** `none`
- **Description:** `Replace the current demo-style admin dashboard with a real operations overview that matches the new authenticated shell.`

### TASK-260B: Frontend - Build Admin Content List, Editor, And Schedule Workspaces
- **Phase:** `Phase 26 - Admin Editorial And Operations Workspace`
- **Owner:** `Both`
- **Implementation side:** `Frontend`
- **Actor(s):** `Admin`
- **Route(s) or endpoint(s):** `/admin/content, /admin/content/new, /admin/content/:id, /admin/schedule, /api/admin/articles, /api/admin/articles/:id, /api/admin/schedules`
- **Files touched:** `src/pages/AdminDashboard.jsx`, `src/pages/AdminContentList.jsx`, `src/pages/AdminContentEditor.jsx`, `src/pages/AdminSchedule.jsx`, `src/components/forms/*`, `src/components/dashboard/*`, `src/App.jsx`
- **Depends on:** `TASK-260A`
- **Spec:** `docs/project.md Sections 4.1, 4.6, 8`
- **Setup reference:** `README.md`, `docs/project.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `Admins can move between content listing, sector-aware content editing, and scheduled publishing surfaces with visible draft, scheduled, and published states.`
- **Runtime Verification:** `direct endpoint smoke`
- **Blockers:** `none`
- **Description:** `Break publishing out into dedicated editorial workflows that match the product’s real content management complexity.`

### TASK-260C: Frontend - Build Admin Subscriber And Company Management Sections
- **Phase:** `Phase 26 - Admin Editorial And Operations Workspace`
- **Owner:** `Both`
- **Implementation side:** `Frontend`
- **Actor(s):** `Admin / Front desk`
- **Route(s) or endpoint(s):** `/admin/subscribers, /admin/companies, /api/admin/subscribers, /api/admin/companies`
- **Files touched:** `src/pages/AdminSubscribers.jsx`, `src/pages/AdminCompanies.jsx`, `src/components/dashboard/*`, `src/App.jsx`
- **Depends on:** `TASK-260A`
- **Spec:** `docs/project.md Sections 4.2, 4.5, 4.6, 5`
- **Setup reference:** `README.md`, `docs/project.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `Admins can review subscriber states, renewal and delivery eligibility, and company account summaries through searchable, operational tables and summary modules.`
- **Runtime Verification:** `direct endpoint smoke`
- **Blockers:** `none`
- **Description:** `Add the customer and organization management surfaces needed to operate subscriptions across both individual and business accounts.`

### TASK-260D: Frontend - Build Admin Shipment And Pricing Workspaces
- **Phase:** `Phase 26 - Admin Editorial And Operations Workspace`
- **Owner:** `Both`
- **Implementation side:** `Frontend`
- **Actor(s):** `Admin / Front desk`
- **Route(s) or endpoint(s):** `/admin/shipments, /admin/pricing, /api/admin/shipments, /api/admin/pricing-tiers`
- **Files touched:** `src/pages/AdminShipments.jsx`, `src/pages/AdminPricing.jsx`, `src/components/delivery/*`, `src/components/dashboard/*`, `src/App.jsx`
- **Depends on:** `TASK-220B`, `TASK-260C`
- **Spec:** `docs/project.md Sections 4.3, 4.4, 4.6, 5`
- **Setup reference:** `README.md`, `docs/project.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `Admins can inspect active deliveries, delayed routes, logistics health, and business pricing tiers through dedicated operational workspaces.`
- **Runtime Verification:** `direct endpoint smoke`
- **Blockers:** `none`
- **Description:** `Complete the admin control center with logistics and pricing management surfaces needed for operational control.`

## Phase 28 - Compliance, Localization, And Final UX Polish

Phase goal: finish the UI so it is easier to localize, easier to govern, and consistent across editorial and operational surfaces before full implementation closes out.

Phase rules:

- Treat this phase as `cross-cutting polish and governance work`.
- Do not use this phase to introduce new major features that belong in earlier phases.
- Prefer targeted cleanup against defined inconsistencies rather than broad visual churn.
- Preserve all previously established dashboard and editorial patterns.

### TASK-280A: Frontend - Add GDPR And Account Governance Surfaces
- **Phase:** `Phase 28 - Compliance, Localization, And Final UX Polish`
- **Owner:** `Both`
- **Implementation side:** `Frontend`
- **Actor(s):** `User / Company / Admin`
- **Route(s) or endpoint(s):** `/dashboard/privacy, /business-dashboard/settings, /privacy, /api/me/export, /api/me/delete-request, /api/company/privacy`
- **Files touched:** `src/pages/Privacy.jsx`, `src/pages/ReaderDashboard.jsx`, `src/pages/BusinessDashboard.jsx`, `src/components/forms/*`, `src/App.jsx`
- **Depends on:** `TASK-200C`, `TASK-240B`
- **Spec:** `docs/project.md Section 6.2`
- **Setup reference:** `README.md`, `docs/project.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `GDPR-related actions, consent visibility, and account governance messaging are present and discoverable in the correct user and company account surfaces.`
- **Runtime Verification:** `direct endpoint smoke`
- **Blockers:** `none`
- **Description:** `Bring privacy and governance controls into the actual UI flows instead of leaving them only in policy copy.`

### TASK-280B: Frontend - Run Localization, Accessibility, And Consistency Pass
- **Phase:** `Phase 28 - Compliance, Localization, And Final UX Polish`
- **Owner:** `Frontend`
- **Implementation side:** `Frontend`
- **Actor(s):** `Public guest / User / Company / Admin`
- **Route(s) or endpoint(s):** `all frontend routes`
- **Files touched:** `src/index.css`, `src/lib/LanguageContext.jsx`, `src/pages/*`, `src/components/*`
- **Depends on:** `TASK-280A`
- **Spec:** `docs/project.md Sections 6.2, 7`
- **Setup reference:** `README.md`, `docs/project.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `Layouts are translation-ready, accessibility gaps are reduced, dashboard and public surfaces are visually consistent, and the product feels cohesive across mobile and desktop.`
- **Runtime Verification:** `frontend dev proxy`
- **Blockers:** `none`
- **Description:** `Apply the final polish pass so localization, accessibility, and consistency are addressed before launch-style review.`

## Suggested Start Order

1. `TASK-120A`
2. `TASK-120B`
3. `TASK-140A`
4. `TASK-140B`
5. `TASK-140C`
6. `TASK-160A`
7. `TASK-160B`
8. `TASK-180A`
9. `TASK-180B`
10. `TASK-200A`

## First Executable Slice

- `TASK-140A`
- `TASK-140B`
- `TASK-140C`
- `TASK-160A`
- `TASK-160B`
- `TASK-180A`
- `TASK-200A`

This slice gives the project a reusable dashboard foundation, a clearer public product story, and the first real subscriber workspace.
