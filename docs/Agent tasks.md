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
- **Route(s) or endpoint(s):** `/, /news, /article/:id, /categories, /subscriptions, /business, /delivery, /about, /contact, /login, /register, /forgot-password, /reset-password, /dashboard, /business-dashboard, /admin, /privacy, /terms, *`
- **Files touched:** `docs/Agent tasks.md`, `docs/project.md`, `src/App.jsx`, `src/pages/*`, `src/components/newspaper/*`
- **Depends on:** `none`
- **Spec:** `docs/project.md Sections 2, 3, 4, 5, 8, 10`
- **Setup reference:** `README.md`, `AGENTS.md`
- **Conventions:** `Follow CONVENTIONS.md`
- **Definition of Done:** `Every current route is classified as keep, redesign, split, or replace, and every requirement in project.md is mapped to a public, reader, business, admin, or delivery surface.`
- **Runtime Verification:** `none`
- **Blockers:** `none`
- **Description:** `Create the route and surface baseline for the UI rebuild so later tasks have a stable information architecture and scope boundary.`

TASK-120A audit result:

Current route inventory and classification:

| Route | Current surface | Current role | Classification | Reasoning |
| --- | --- | --- | --- | --- |
| `/` | Public | Editorial landing page | `redesign` | Strong brand and section structure already exist, but the page does not yet clearly communicate subscription rules, business ordering, or logistics integration from `project.md`. |
| `/news` | Public | All-news listing | `redesign` | Useful as the main content directory, but it needs access-state logic, fresher information hierarchy, and stronger ties to sector publishing. |
| `/article/:id` | Public | Article detail | `redesign` | Important route to keep, but it must support subscriber-only recent access, delayed public access, and better article metadata states. |
| `/categories` | Public | Category browse view | `redesign` | Keep the route, but the current category page needs stronger sector framing and access-aware filtering. |
| `/subscriptions` | Public | Subscription marketing page | `split` | This route should remain, but it needs to expand into a fuller conversion surface with linked checkout and confirmation routes. |
| `/business` | Public | Business marketing and inquiry page | `redesign` | Good starting route, but it needs a sharper B2B product story aligned to bulk orders, invoicing, and multi-location delivery. |
| `/delivery` | Shared public/authenticated | Delivery tracking page | `redesign` | Keep the route, but rebuild it around reusable shipment modules and richer delivery states. |
| `/about` | Public | Brand/about page | `keep` | Low-risk informational route that can remain mostly intact unless later copy alignment is needed. |
| `/contact` | Public | General contact page | `redesign` | Keep the route, but align contact paths more clearly for subscriber support versus business/commercial contact. |
| `/login` | Public auth entry | Sign-in page | `redesign` | Keep the route, but it needs clearer routing into reader, business, and admin journeys. |
| `/register` | Public auth entry | Registration page | `redesign` | Keep the route, but it must capture account type and prepare separate individual versus company onboarding paths. |
| `/forgot-password` | Public auth recovery | Password recovery request | `keep` | Current role is valid; only minor visual consistency work is needed later. |
| `/reset-password` | Public auth recovery | Password reset completion | `keep` | Current route remains useful and does not need structural changes at this phase. |
| `/dashboard` | Reader workspace | Subscriber dashboard | `split` | Current single-file tabbed dashboard should become a route-backed reader workspace with overview, deliveries, billing, history, and profile sections. |
| `/business-dashboard` | Company workspace | Business dashboard | `split` | Current single-file tabbed dashboard should become a route-backed B2B workspace with overview, team, orders, invoices, locations, and shipments. |
| `/admin` | Admin workspace | Admin dashboard | `split` | Current single-file tabbed admin view should become a modular control center with overview, content, schedule, subscribers, companies, shipments, and pricing. |
| `/privacy` | Public/legal and future account governance | Privacy policy page | `redesign` | Keep the route, but strengthen GDPR and account-governance messaging so it supports future self-service privacy flows. |
| `/terms` | Public/legal | Terms page | `redesign` | Keep the route, but update language so it better reflects billing, delivery cadence, and business-account realities from the proposal. |
| `*` | Global fallback | Not-found handling | `keep` | Existing catch-all route is correct and should remain. |

Current surface ownership map:

- `Public marketing and editorial`: `/`, `/news`, `/article/:id`, `/categories`, `/subscriptions`, `/business`, `/about`, `/contact`
- `Auth entry and recovery`: `/login`, `/register`, `/forgot-password`, `/reset-password`
- `Reader workspace`: `/dashboard`
- `Business workspace`: `/business-dashboard`
- `Admin workspace`: `/admin`
- `Shared delivery and logistics`: `/delivery`
- `Legal and governance`: `/privacy`, `/terms`
- `Global fallback`: `*`

Current component/system anchors worth preserving:

- `Masthead.jsx`: strong public shell and editorial identity
- `Footer.jsx`: reusable public footer
- `NewsCard.jsx`: reusable article card base
- `SectionHeader.jsx`: section title pattern for public pages
- `ScrollReveal.jsx`: optional editorial motion layer
- `HeroSection.jsx`, `LatestNewsSection.jsx`, `BusinessSection.jsx`, `DeliverySection.jsx`, `SubscriptionSection.jsx`: good content modules to evolve rather than discard

Project requirement to surface mapping:

- `Content publishing system with sector templates, draft, and schedule states`:
  - Primary surface: `Admin workspace`
  - Supporting surfaces: `Public editorial pages`
- `Subscription plans, billing cycles, and delayed public access rules`:
  - Primary surfaces: `Subscriptions`, `Register`, `Reader workspace`
  - Supporting surfaces: `News`, `Article detail`, `Admin workspace`
- `Delivery and shipment tracking integration`:
  - Primary surfaces: `Delivery`, `Reader workspace`, `Business workspace`, `Admin workspace`
- `Business bulk ordering and volume pricing`:
  - Primary surfaces: `Business page`, `Business workspace`, `Admin workspace`
- `Customer onboarding and account data capture`:
  - Primary surfaces: `Register`, future `subscribe/checkout`, future `business/apply`
- `GDPR and account governance`:
  - Primary surfaces: `Privacy`, `Reader workspace`, `Business workspace`
- `Belgium and Germany readiness`:
  - Primary surfaces: `Public marketing pages`, `Subscriptions`, `Business workspace`, `Admin workspace`

Audit conclusions:

- The repo already has a credible `public/editorial shell`, so the public experience should be evolved rather than replaced.
- The three current dashboard routes are `conceptual stubs`, not yet durable workspaces. All three should be split into deeper route-backed sections.
- The biggest missing surfaces are `checkout`, `business onboarding`, `account privacy/self-service`, and `admin modular management pages`.
- The proposed implementation order in later phases is valid: `shared shell first`, then `public positioning`, then `onboarding`, then `reader`, then `delivery`, then `business`, then `admin`.

TASK-120A status: `completed`

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

TASK-120B dashboard shell spec:

Dashboard shell source cues from `docs/designs.jpg`:

- Soft light background with a distinct inner app frame
- Slim icon-first utility rail on the far left
- Rounded main shell with shallow depth and generous white space
- Top utility row containing search, lightweight alerts/actions, and account profile
- Horizontal section navigation near the top of the content region
- Compact KPI cards grouped in a grid before deeper content
- Larger secondary modules for charts, recent activity, tables, and filtered lists
- Dense but calm information hierarchy with small labels, medium body text, and strong totals

Reusable authenticated shell anatomy:

1. `Outer workspace`
   - Purpose: separate authenticated areas from the public editorial shell
   - Layout: full-height app canvas with muted background and centered max-width dashboard frame
   - Behavior: authenticated routes should visually feel like a contained product workspace, not a newspaper page with tabs

2. `Utility rail`
   - Placement: fixed or sticky left rail on desktop, collapsible drawer on tablet/mobile
   - Content:
     - product mark
     - global workspace icons
     - context-aware shortcuts
     - bottom utility actions such as settings/help/logout
   - Pattern rule: icon-first, labels optional on hover or expanded states
   - Surface owners:
     - reader: overview, deliveries, billing, reading, profile
     - business: overview, team, orders, invoices, locations, shipments
     - admin: overview, content, schedule, subscribers, companies, shipments, pricing

3. `Top utility header`
   - Placement: top of the main content frame
   - Content:
     - page or workspace search
     - optional quick filter pill
     - notifications or lightweight action icons
     - account/avatar block
   - Pattern rule: keep this row light and utility-focused; do not place dense business logic here

4. `Section navigation row`
   - Placement: directly below the top utility header, inside the content frame
   - Content: high-level sections for the current workspace
   - Pattern rule:
     - reader and business may use pill tabs or route-backed top nav
     - admin should use route-backed top nav or segmented workspace sections
     - active item must be visually obvious without heavy color fill

5. `Page header zone`
   - Placement: first content block below section navigation
   - Content:
     - greeting or page title
     - short descriptive subtext
     - optional primary action
   - Pattern rule: use this zone to set context fast; keep it lighter than a marketing hero

6. `Primary analytics row`
   - Placement: immediately below the page header
   - Content: 3-5 compact KPI cards
   - Pattern rule:
     - cards should prioritize one strong metric and one short supporting line
     - at most one card in a row should use stronger accent treatment
     - cards must be reusable across reader, business, admin, and delivery contexts

7. `Secondary module grid`
   - Placement: below KPI row
   - Content:
     - chart panel
     - activity stream
     - status summary
     - payment or shipment widget
     - progress widget
   - Pattern rule: combine one larger high-value module with 1-2 smaller supporting modules instead of equal-weight panels everywhere

8. `Operational table zone`
   - Placement: lower half of dashboard pages or dedicated section pages
   - Content:
     - recent activity
     - invoices
     - shipments
     - articles
     - team members
   - Pattern rule:
     - summary-first list pages
     - searchable
     - filterable where it improves speed
     - deeper detail opens only after selection

Route-backed section model:

- Reader workspace:
  - `/dashboard/overview`
  - `/dashboard/deliveries`
  - `/dashboard/billing`
  - `/dashboard/history`
  - `/dashboard/profile`
  - `/dashboard/privacy`
- Business workspace:
  - `/business-dashboard/overview`
  - `/business-dashboard/team`
  - `/business-dashboard/orders`
  - `/business-dashboard/invoices`
  - `/business-dashboard/locations`
  - `/business-dashboard/shipments`
  - `/business-dashboard/settings`
- Admin workspace:
  - `/admin/overview`
  - `/admin/content`
  - `/admin/content/new`
  - `/admin/content/:id`
  - `/admin/schedule`
  - `/admin/subscribers`
  - `/admin/companies`
  - `/admin/shipments`
  - `/admin/pricing`

Dashboard module catalog:

- `KPI card`
  - label
  - primary value
  - secondary delta or status
  - optional micro-icon
- `Split summary card`
  - one card with two related metrics
  - best for spend vs income, active vs paused, delivered vs delayed
- `Chart panel`
  - title
  - optional range selector
  - visualization area
  - compact legend or notes
- `Activity table`
  - dense rows
  - clear status column
  - date/time column
  - action menu or link
- `Search/filter bar`
  - search input
  - 1-3 scoped filters
  - optional export or add button
- `Status timeline`
  - linear progress view
  - good for delivery stages, publishing stages, subscription lifecycle
- `Detail side panel or drill-in view`
  - opens on explicit selection
  - avoids dumping full record detail on list pages

Visual rules for authenticated surfaces:

- Use softer radius values than the public editorial cards
- Prefer layered whites, pale neutrals, and restrained accent color instead of heavy newspaper borders
- Preserve strong typographic hierarchy, but reduce decorative editorial styling inside dashboards
- Prefer subtle shadow and border combinations over stark section dividers
- Use compact uppercase labels sparingly for metrics and statuses
- Keep table density moderate: compact enough for operations, not cramped

Behavior rules:

- Search and filters belong in header rows above data-heavy modules, not inside KPI areas
- KPI rows should summarize, not replace, the detailed sections below them
- Detail-heavy information should appear on selection, modal, slide-over, or dedicated route
- Dashboard pages should avoid long uninterrupted vertical stacks of equal cards
- On mobile, the utility rail becomes a drawer and the section navigation becomes horizontal scroll or a compact switcher

Surface-specific adaptations:

- `Reader`
  - warmer tone and slightly softer copy
  - KPI examples: plan, renewal, next delivery, recent reading
  - modules: delivery timeline, payment history, saved articles, profile
- `Business`
  - stronger operational and financial emphasis
  - KPI examples: contract status, copy volume, invoice health, shipment health
  - modules: team activity, invoice table, location management, shipments
- `Admin`
  - highest density and most management actions
  - KPI examples: published today, scheduled items, active subscribers, delayed routes
  - modules: content queue, publishing schedule, subscriber table, company table, route health
- `Delivery`
  - can reuse the same shell but prioritize status timeline, route map, ETA, issue states, and shipment history

Implementation implications for Phase 14:

- Shared shell components needed:
  - `DashboardShell`
  - `DashboardRail`
  - `DashboardTopbar`
  - `DashboardSectionNav`
  - `DashboardPageHeader`
- Shared content primitives needed:
  - `MetricCard`
  - `SplitMetricCard`
  - `ChartPanel`
  - `ActivityTable`
  - `FilterBar`
  - `StatusBadge`
  - `TimelinePanel`
- Styling areas to standardize:
  - background layers
  - panel radii
  - panel shadows
  - spacing scale
  - accent usage
  - table density
  - mobile collapse behavior

TASK-120B conclusions:

- The current tabbed dashboard pages should not be restyled in place only; they should be `reframed through a shared shell`.
- `docs/designs.jpg` is a shell and hierarchy reference, not a literal visual clone target.
- The right adaptation for this product is `finance-style operational clarity + editorial brand restraint`, not a pure banking UI.
- Phase 14 should start by implementing the shell components and route-backed section structure before any deep page-specific redesigns.

TASK-120B status: `completed`

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

TASK-140A implementation result:

- Shared shell files created:
  - `src/lib/dashboard-config.js`
  - `src/components/dashboard/DashboardShell.jsx`
  - `src/pages/dashboard/WorkspacePages.jsx`
- Existing dashboard page files were converted from monolithic tab pages into routed workspace layouts:
  - `src/pages/ReaderDashboard.jsx`
  - `src/pages/BusinessDashboard.jsx`
  - `src/pages/AdminDashboard.jsx`
- `src/App.jsx` now uses nested route groups for:
  - `/dashboard/*`
  - `/business-dashboard/*`
  - `/admin/*`
- Each workspace root now redirects to its `overview` route, creating a stable route strategy for later tasks without changing public routes.
- Post-auth navigation now targets the new routed workspace structure through:
  - `src/pages/Login.jsx`
  - `src/pages/Register.jsx`

Delivered shell behaviors:

- Desktop utility rail with icon-first workspace navigation
- Top utility header with search placeholder, light utility actions, and account summary
- Horizontal section navigation row for route-backed workspace sections
- Shared page header, panel, and metric-card foundation for later phases
- Placeholder section pages so deeper routes exist before feature-specific content is implemented

Route strategy delivered in this task:

- Reader workspace:
  - `/dashboard/overview`
  - `/dashboard/deliveries`
  - `/dashboard/billing`
  - `/dashboard/history`
  - `/dashboard/profile`
  - `/dashboard/privacy`
- Business workspace:
  - `/business-dashboard/overview`
  - `/business-dashboard/team`
  - `/business-dashboard/orders`
  - `/business-dashboard/invoices`
  - `/business-dashboard/locations`
  - `/business-dashboard/shipments`
  - `/business-dashboard/settings`
- Admin workspace:
  - `/admin/overview`
  - `/admin/content`
  - `/admin/content/new`
  - `/admin/content/:id`
  - `/admin/schedule`
  - `/admin/subscribers`
  - `/admin/companies`
  - `/admin/shipments`
  - `/admin/pricing`

TASK-140A status: `completed`

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

TASK-140B implementation result:

- Shared primitives file created:
  - `src/components/dashboard/DashboardPrimitives.jsx`
- Foundation pages updated to consume the primitives:
  - `src/pages/dashboard/WorkspacePages.jsx`
- Typecheck config updated so component `.jsx` modules are included:
  - `jsconfig.json`

Primitive catalog now available:

- `DashboardPageHeader`
- `DashboardPanel`
- `DashboardMetricCard`
- `DashboardSplitMetricCard`
- `DashboardStatusBadge`
- `DashboardFilterBar`
- `DashboardChartPanel`
- `DashboardActivityTable`
- `DashboardTimeline`
- `DashboardEmptyState`

What these primitives cover:

- KPI and summary cards for top-level workspace metrics
- Search and filter rows for data-heavy sections
- Lightweight chart panel scaffolding for future analytics modules
- Reusable operational table layout for invoices, shipments, articles, and account records
- Status-chip treatment for lifecycle and operational states
- Timeline treatment for delivery, publishing, and workflow progression
- Empty-state presentation for sections that are routed before feature content lands

Where the primitives are already exercised:

- Workspace overview pages now use:
  - KPI metric cards
  - filter bar
  - split summary card
  - chart panel
  - activity table
- Routed placeholder section pages now use:
  - page header
  - panel
  - timeline
  - empty state
  - status badge

TASK-140B status: `completed`

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

TASK-140C implementation result:

- Shared authenticated design tokens were formalized in `src/index.css` with:
  - dashboard canvas, frame, rail, panel, muted, and accent color variables
  - shell, panel, KPI, table, badge, empty-state, timeline, and action-button component classes
  - mobile-specific radius adjustments and reduced-motion handling for dashboard interactions
- `src/components/dashboard/DashboardShell.jsx` was simplified to use the shared dashboard token classes instead of page-local Tailwind style clusters.
- The dashboard shell now includes:
  - token-driven desktop rail styling
  - token-driven topbar and section navigation styling
  - a mobile horizontal rail treatment for workspace section access on smaller screens
- `src/components/dashboard/DashboardPrimitives.jsx` now consumes the shared dashboard classes for:
  - page header
  - panel
  - metric card
  - split metric card
  - status badge
  - filter bar
  - chart panel
  - activity table
  - timeline
  - empty state
- `src/pages/dashboard/WorkspacePages.jsx` placeholder surfaces were updated to use the standardized dashboard action, subpanel, and icon-badge classes so Phase 14 pages follow the same token system as the shell and primitives.

Verification:

- `npm run lint` ✅
- `npm run build` ✅
- `npm run typecheck` ⚠️ still reports the same pre-existing repo issues outside this task scope:
  - `src/components/newspaper/ScrollReveal.jsx`: CSS custom property typing mismatch for `--reveal-delay`
  - `src/lib/demoData.js`: duplicate object key in demo data

TASK-140C status: `completed`

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

TASK-160A implementation result:

- The homepage top flow was reordered in `src/pages/Home.jsx` so product-defining sections now surface earlier:
  - hero
  - reading/access framing
  - subscription logic
  - delivery tracking
  - business ordering
- `src/components/newspaper/HeroSection.jsx` now positions the product as:
  - sector-based publishing across politics, sport, business, and events
  - subscriber-first recent access
  - print plus digital delivery in one workflow
  - business and delivery routes with direct CTAs
- `src/components/newspaper/LatestNewsSection.jsx` now makes reading-access rules visible on the homepage itself through:
  - sector desk framing
  - subscriber versus public archive explanation
  - article-level access labels and public-open dates
- `src/components/newspaper/SubscriptionSection.jsx` now explains:
  - monthly versus yearly billing
  - separate two-week print cadence
  - subscriber-only recent access
  - payment and invoicing expectations at the homepage level
- `src/components/newspaper/DeliverySection.jsx` now frames delivery as a core product capability tied to the client's existing fleet and mapping workflow rather than a generic subscriber perk.
- `src/components/newspaper/BusinessSection.jsx` now presents business accounts as a distinct operational offer with bulk ordering, invoice-friendly billing, multi-location delivery, and company workspace positioning.
- `src/lib/demoData.js` was updated to align homepage content and plan data with the proposal's product model, and the duplicate `business` key issue in `categoryArticles` was removed while touching the file.

Verification:

- `npm run lint` ✅
- `npm run build` ✅
- `npm run typecheck` ⚠️ now only reports the pre-existing `ScrollReveal.jsx` custom-property typing issue

TASK-160A status: `completed`

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

TASK-160B implementation result:

- `src/pages/Subscriptions.jsx` was redesigned from a generic pricing page into a fuller product-rules surface that now explains:
  - monthly versus yearly billing
  - fixed two-week print cadence
  - one-month delayed public content access
  - supported payment methods for reader plans
  - business-plan invoice and contract positioning
  - onboarding and consent expectations before checkout
- `src/pages/Privacy.jsx` was rebuilt to connect privacy policy language to the actual product model, including:
  - sign-up data collection
  - delivery-address sharing with logistics workflows
  - PCI-conscious payment handling expectations
  - GDPR access, export, and deletion rights
  - retention and support contact framing
- `src/pages/Terms.jsx` now explains the service around:
  - subscription billing rules
  - delivery cadence versus payment cadence
  - subscriber-only recent access and delayed public archive timing
  - business-order differences
  - account responsibility and support contacts
- `src/lib/demoData.js` now includes shared content models for:
  - subscription page facts
  - access-timeline moments
  - checkout and consent notes
  - subscription FAQs
  - privacy principles and rights
  - retention notes
  - terms highlights
  - policy contacts

Verification:

- `npm run lint` ✅
- `npm run build` ✅
- `npm run typecheck` ⚠️ still reports only the pre-existing `ScrollReveal.jsx` custom-property typing issue

TASK-160B status: `completed`

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

TASK-160C implementation result:

- `src/lib/demoData.js` now includes shared reading-access helpers that derive article state from published date, the August 10, 2026 reference date, and signed-in subscriber access:
  - subscriber access active
  - public archive access
  - recent subscriber-only access
- `src/components/newspaper/NewsCard.jsx` now shows explicit access badges and supporting copy on both default and compact card variants so article cards communicate availability before the click.
- `src/pages/News.jsx` now frames the newsroom feed around access-state behavior with:
  - signed-in versus guest reading mode context
  - counts for recent locked stories versus archive-open stories
  - lead-story access messaging with exact archive timing
- `src/pages/Categories.jsx` now carries the same access model into category browsing so selected category pages explain whether readers are seeing archive-open or subscriber-only reporting.
- `src/pages/ArticleDetail.jsx` now preserves the same route while changing the body experience by access state:
  - signed-in subscribers can read the full recent article
  - public archive readers can read older stories in full
  - guests on recent stories see summary plus a gated-state panel, archive-open date, and sign-in / subscribe actions without breaking `/article/:id`
- Comment UI on the article page now reflects access state, staying interactive for full-access readers and clearly disabled for recent locked guest views.

Verification:

- `npm run lint` ✅
- `npm run build` ✅
- `npm run typecheck` ⚠️ still reports only the pre-existing `ScrollReveal.jsx` custom-property typing issue

TASK-160C status: `completed`

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

TASK-160D implementation result:

- `src/pages/BusinessPage.jsx` was rebuilt into a more operational business landing page that now explains:
  - bulk copy ordering versus individual-reader access
  - invoice-ready and contract-ready billing expectations
  - multi-location delivery planning
  - business pricing-tier logic without pretending final discount bands are already fixed
  - a clearer business intake path on the page itself
- The business hero now directs organizations into:
  - a dedicated business intake section on `/business`
  - direct commercial email contact
  - reader-plan comparison only as a secondary route
- New B2B sections on `/business` now cover:
  - operational business model and company workspace framing
  - pricing framework by volume band and rollout complexity
  - delivery-location scenarios for head office, multi-branch, and partner-site fulfillment
  - invoice expectations for monthly invoice, contract, and VAT-aware regional setup
  - an intake form that captures organization profile, estimated volume, delivery locations, country scope, billing preference, and launch timeline
- `src/components/newspaper/BusinessContactSection.jsx` now uses a more serious commercial contact model aligned to quote requests, billing questions, and intake start points.
- `src/lib/demoData.js` now includes shared business landing content for:
  - landing stats
  - operational business features
  - pricing framework and notes
  - delivery-location models
  - onboarding steps
  - intake form option sets
  - business contact cards

Verification:

- `npm run lint` ✅
- `npm run build` ✅
- `npm run typecheck` ⚠️ still reports only the pre-existing `ScrollReveal.jsx` custom-property typing issue

TASK-160D status: `completed`

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

TASK-180A implementation result:

- Auth entry pages now separate `individual reader` and `company account` journeys up front on:
  - `src/pages/Login.jsx`
  - `src/pages/Register.jsx`
  - `src/pages/ForgetPassword.jsx`
  - `src/pages/ResetPassword.jsx`
- Registration now captures account-type-aware onboarding context for routing and later billing or delivery work:
  - personal or primary contact name
  - company name for business accounts
  - contact phone
  - delivery context
  - GDPR-style consent acknowledgement
- Shared auth presentation was upgraded in:
  - `src/components/AuthLayout.jsx`
  so password recovery and reset pages use the same branded split-shell and journey framing as sign-in flows.
- Auth helpers now expose reusable journey mapping in:
  - `src/lib/AuthContext.jsx`
  covering `individual`, `business`, and existing `admin` accounts.
- Mock auth storage and routing were updated so the new business path is functional rather than cosmetic:
  - `src/api/appClient.js` seeds a business demo account and preserves business signup metadata
  - `src/lib/app-params.js` adds business demo credentials
  - `src/lib/dashboard-config.js` now routes `business` users to `/business-dashboard/overview`
- Demo login coverage now includes:
  - reader account
  - business account
  - admin account

TASK-180A delivered behaviors:

- Users choose the correct account journey before entering credentials or creating an account.
- Business registrations create `business`-role users and land them in the business workspace.
- Reader registrations continue into the reader workspace.
- Forgot and reset password screens preserve the selected journey so recovery copy stays aligned with the account type.
- Existing admin sign-in remains available without being mixed into the public business onboarding path.

TASK-180A status: `completed`

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

TASK-180B implementation result:

- Reader plan cards on `src/pages/Subscriptions.jsx` now route into a dedicated checkout path instead of stopping at an informational pricing page.
- New reader checkout route added at:
  - `src/pages/SubscribeCheckout.jsx`
  - `/subscribe/checkout`
- New mocked payment-return success route added at:
  - `src/pages/SubscribeSuccess.jsx`
  - `/subscribe/success`
- Checkout flow now covers the full Phase 18 reader path:
  - plan choice
  - monthly versus yearly billing selection
  - contact and delivery address capture
  - payment method selection for PayPal, Visa, or Mastercard
  - recurring billing and delivery-data consent
  - success confirmation after a mocked checkout session is completed
- Reusable checkout UI components were added under:
  - `src/components/forms/CheckoutProgress.jsx`
  - `src/components/forms/ReaderPlanPicker.jsx`
  - `src/components/forms/SubscriptionOrderSummary.jsx`
- Reader checkout data scaffolding was added in:
  - `src/lib/demoData.js`
  including reader-only plans, checkout steps, payment methods, and success-state content.
- App routing now includes:
  - `/subscribe/checkout`
  - `/subscribe/success`
  through `src/App.jsx`
- The checkout flow stores a mocked session in browser storage so the success route can behave like a resolved payment return instead of a static thank-you page.

TASK-180B delivered behaviors:

- Individual readers can move from pricing to checkout with the selected plan and billing cycle preserved in the URL.
- Checkout validation stops incomplete submissions and highlights missing delivery, payment, or consent requirements.
- The success page shows plan, billing, payment path, and delivery profile details from the resolved mocked session.
- Business users are kept out of the reader checkout and pushed toward the separate business path instead.

TASK-180B status: `completed`

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

TASK-180C implementation result:

- The business landing page at `src/pages/BusinessPage.jsx` now hands off into a dedicated onboarding route instead of ending in an embedded public-page intake form.
- New business onboarding route added at:
  - `src/pages/BusinessApply.jsx`
  - `/business/apply`
- New business success route added at:
  - `src/pages/BusinessApplySuccess.jsx`
  - `/business/apply/success`
- Business onboarding now captures the full company-intake milestone scope:
  - organization details
  - contact information
  - request type and company size
  - country scope
  - expected copy volume
  - delivery location footprint
  - billing preference
  - launch timing
  - VAT, PO, and invoice notes
  - operational notes and consent
- Reusable business-flow support components were added under:
  - `src/components/forms/BusinessIntakeChecklist.jsx`
  - `src/components/forms/BusinessRequestSummary.jsx`
- Shared step progress from the reader checkout work is reused so the company path now behaves like a staged onboarding flow rather than a static form.
- Business onboarding data scaffolding was expanded in:
  - `src/lib/demoData.js`
  for step definitions, benefits, and success-state content.
- App routing now includes:
  - `/business/apply`
  - `/business/apply/success`
  through `src/App.jsx`
- The business flow stores a mocked request in browser storage so the success route can reflect a realistic quote submission without needing a live backend intake endpoint yet.

TASK-180C delivered behaviors:

- Company users now leave the public business landing page for a dedicated onboarding flow that matches the complexity of bulk accounts.
- Quote request validation stops incomplete submissions and keeps missing data tied to the relevant onboarding step.
- The success route shows the submitted organization, fulfillment footprint, billing path, and follow-up expectations from the saved mocked request.
- Reader subscriptions remain separate and continue to use the consumer checkout flow instead of mixing B2B intake into the same path.

TASK-180C status: `completed`

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

TASK-200A implementation result:

- The reader workspace overview is no longer using the generic shell placeholder and now renders a dedicated subscriber home screen through:
  - `src/components/dashboard/ReaderOverviewPage.jsx`
  - `/dashboard/overview`
- Reader overview routing was updated in:
  - `src/App.jsx`
  so only the reader workspace moves to the new overview while business and admin keep their existing shared placeholder foundations.
- Reader dashboard overview data scaffolding was added in:
  - `src/lib/demoData.js`
  including:
  - fallback subscription state
  - KPI note copy
  - weekly reading activity bars
  - recent account activity rows
  - print-cycle timeline content
  - saved reading queue items
  - quick actions for deeper reader routes
- The overview now pulls the latest mocked reader checkout session from browser storage when available, so Phase 18 checkout work can feed:
  - current plan
  - payment method
  - next billing date
  - delivery mode
  - delivery window
- Overview modules now expose the concrete Phase 20 summary surface expected by the task:
  - subscription status KPI
  - next billing KPI
  - next delivery KPI
  - access-state KPI
  - subscription health summary
  - reader profile snapshot
  - weekly reading activity chart
  - next print-cycle timeline
  - recent account activity table
  - saved reading queue
  - quick-action links into routed reader sections

TASK-200A delivered behaviors:

- The reader overview now feels like a real subscriber control center instead of a temporary route placeholder.
- Subscription, billing, delivery, access, and reading signals are visible immediately without overloading the first screen.
- The overview stays summary-first and sends deeper work into `/dashboard/deliveries`, `/dashboard/billing`, `/dashboard/history`, `/dashboard/profile`, and `/dashboard/privacy`.
- Phase 18 reader checkout data now has a visible dashboard landing surface before the deeper modules are built.

TASK-200A status: `completed`

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

TASK-200B implementation result:

- Reader workspace routes now use real subscriber modules instead of shared placeholders for:
  - `/dashboard/deliveries`
  - `/dashboard/billing`
  - `/dashboard/history`
- New routed reader workspace components were added in:
  - `src/components/dashboard/ReaderWorkspacePages.jsx`
  covering:
  - delivery status and shipment history
  - billing and renewal activity
  - reading history and saved content
- Shared reader subscription helpers were extracted into:
  - `src/lib/reader-subscription.js`
  so overview, deliveries, and billing can all read the latest mocked checkout session consistently.
- A reusable delivery component set was added under:
  - `src/components/delivery/DeliveryStatusHero.jsx`
  - `src/components/delivery/DeliveryTimelinePanel.jsx`
  - `src/components/delivery/DeliveryHistoryTable.jsx`
  - `src/components/delivery/DeliveryMapPanel.jsx`
- The public delivery route at `src/pages/Delivery.jsx` was redesigned to use the same shipment component language as the reader dashboard instead of a separate older markup pattern.
- Reader route data scaffolding was expanded in:
  - `src/lib/demoData.js`
  including:
  - shipment status data
  - delivery history rows
  - billing rows and billing rules
  - reading history rows
  - saved collections
  - delivery KPI content
- `src/App.jsx` now mounts the reader-specific routed modules directly, while business and admin sections continue using their own current placeholder strategy until their later tasks.

TASK-200B delivered behaviors:

- Reader deliveries now expose shipment status, cadence, route progress, and delivery history in a dedicated routed module.
- Reader billing now exposes plan state, next renewal, payment path, and invoice-style activity in a structured workspace instead of overview-only summaries.
- Reader history now exposes recent reading, saved collections, and engagement summaries through a dedicated route instead of a placeholder screen.
- The public `/delivery` route now stays visually and structurally aligned with the reader shipment experience.

TASK-200B status: `completed`

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

TASK-200C implementation result:

- Reader dashboard routes now use real account-management modules instead of placeholders for:
  - `/dashboard/profile`
  - `/dashboard/privacy`
- New reader account modules were added in:
  - `src/components/dashboard/ReaderWorkspacePages.jsx`
  covering:
  - profile editing
  - consent visibility and updates
  - data export requests
  - deletion review requests
  - privacy principles, rights, and retention visibility
- The local mock account layer was expanded in:
  - `src/api/appClient.js`
  with:
  - `auth.updateProfile`
  - `account.getConsentSettings`
  - `account.saveConsentSettings`
  - `account.listGovernanceRequests`
  - `account.requestDataExport`
  - `account.requestDeletion`
- New reusable account and privacy form components were added under:
  - `src/components/forms/ReaderProfileForm.jsx`
  - `src/components/forms/AccountConsentForm.jsx`
  - `src/components/forms/GovernanceRequestPanel.jsx`
- Reader profile and governance demo content was added in:
  - `src/lib/demoData.js`
  for profile highlights, consent explanations, and governance action guidance.
- The public privacy page at `src/pages/Privacy.jsx` now points users toward the in-account self-service controls instead of acting as a policy-only dead end.
- `src/App.jsx` now mounts the new reader profile and privacy modules directly, while business and admin routes keep their current phase-appropriate structure.

TASK-200C delivered behaviors:

- Readers can update contact and delivery-profile information from a dedicated profile route.
- Readers can review and save consent settings without mixing those controls into billing or delivery pages.
- Readers can create mocked data export and deletion review requests and see a request history inside the privacy route.
- The public privacy page now reinforces that governance actions live inside the authenticated dashboard experience as well as in static policy content.

TASK-200C status: `completed`

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

TASK-220A implementation result:

- Shared shipment primitives now cover the missing Phase 22 logistics pieces through:
  - `src/components/delivery/ShipmentKpiSummary.jsx`
  - `src/components/delivery/ShipmentIssuePanel.jsx`
- The delivery component layer now spans:
  - status header
  - route timeline
  - KPI summary
  - map placeholder with route tags
  - issue-state module
  - history table
- Reader delivery scaffolding in `src/lib/demoData.js` now includes reusable shipment KPI metadata and issue-state content for:
  - route health
  - address verification
  - support readiness
- The reader dashboard route in `src/components/dashboard/ReaderWorkspacePages.jsx` now uses the shared KPI and issue-state components instead of page-local reminder markup.
- The public delivery route in `src/pages/Delivery.jsx` now uses the same shared shipment primitives so reader and public logistics language stay aligned.

TASK-220A delivered behaviors:

- Reader delivery now exposes route health and issue-state visibility through reusable shipment modules instead of inline explanatory panels.
- Public and authenticated reader delivery surfaces now share the same operational treatment for KPI summaries, map context, and logistics issue readiness.
- The single-shipment foundation is ready to support later multi-shipment business and admin work without redesigning the reader delivery model again.

TASK-220A status: `completed`

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

TASK-220B implementation result:

- Dedicated aggregated shipment pages now exist at:
  - `src/pages/BusinessShipments.jsx`
  - `src/pages/AdminShipments.jsx`
- The router now mounts real shipment workspaces on:
  - `/business-dashboard/shipments`
  - `/admin/shipments`
  via `src/App.jsx` instead of placeholder route content.
- Shared logistics components were extended for multi-shipment use through:
  - `src/components/delivery/MultiShipmentTable.jsx`
  - `src/components/delivery/LocationStatusTable.jsx`
  - `src/components/delivery/RouteSummaryPanel.jsx`
- Shared shipment mock data in `src/lib/demoData.js` now covers:
  - business shipment KPIs
  - business shipment runs
  - business route summaries
  - business location-level statuses
  - business issue states
  - admin shipment KPIs
  - admin shipment runs
  - admin route summaries
  - admin location-level statuses
  - admin issue states
- Both shipment workspaces reuse the same shared shipment component language from TASK-220A while shifting from single-reader delivery into aggregated operational views.

TASK-220B delivered behaviors:

- Business users can now inspect several shipment runs, grouped route summaries, branch-level delivery status, and receiving exceptions in one contract-friendly workspace.
- Admin users can now inspect multiple outbound shipments, corridor health, delay escalation states, and stop-level delivery readiness from one operations-focused workspace.
- The logistics UI now scales from reader delivery into company and admin monitoring without introducing a disconnected second design pattern.

TASK-220B status: `completed`

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

TASK-240A implementation result:

- The business overview placeholder route was replaced with a dedicated overview component at:
  - `src/components/dashboard/BusinessOverviewPage.jsx`
- `/business-dashboard/overview` in `src/App.jsx` now mounts the real B2B overview instead of the generic workspace foundation page.
- Business overview data scaffolding in `src/lib/demoData.js` now includes:
  - business overview KPI cards
  - delivery footprint summary items
  - copy allocation chart data
  - recent business activity rows
  - quick-action links
  - compact operational reminders
- The new overview reuses the shared dashboard shell and logistics language while staying summary-first through:
  - contract and invoice snapshot panels
  - copy volume and location footprint summaries
  - recent activity table
  - route and shipment health preview
  - direct links into team, orders, invoices, locations, and shipments

TASK-240A delivered behaviors:

- Business users now land on a real operational overview instead of a generic placeholder page.
- Contract state, copy volume, next bulk delivery, invoice status, and shipment health are visible immediately in KPI form.
- The overview keeps deeper work in dedicated business sections instead of collapsing team, finance, locations, and logistics into one long mixed page.

TASK-240A status: `completed`

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

TASK-240B implementation result:

- Dedicated business workspace pages now exist at:
  - `src/pages/BusinessTeam.jsx`
  - `src/pages/BusinessOrders.jsx`
  - `src/pages/BusinessInvoices.jsx`
  - `src/pages/BusinessLocations.jsx`
- `/business-dashboard/team`, `/business-dashboard/orders`, `/business-dashboard/invoices`, and `/business-dashboard/locations` in `src/App.jsx` now mount real operational pages instead of generic section placeholders.
- Business workspace mock data in `src/lib/demoData.js` now includes:
  - team seat and role metrics
  - team roster rows and invite guidance
  - recurring order metrics and order-plan rows
  - invoice metrics and invoice history rows
  - location metrics and destination records
- The new business sections reuse the shared dashboard shell and the shared delivery/location primitives where appropriate while staying dedicated to their own operational jobs.

TASK-240B delivered behaviors:

- Company users can now inspect seat ownership, role boundaries, and invitation readiness in a dedicated team workspace.
- Bulk order planning, invoice history, and location-level destination management now live in separate operational sections instead of one placeholder route.
- The business workspace now behaves like a usable B2B control center with clear boundaries between people, volume, billing, and location management.

TASK-240B status: `completed`

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

TASK-240C implementation result:

- The business shipment workspace at `src/pages/BusinessShipments.jsx` was deepened from the shared Phase 22 logistics foundation into a B2B-specific monitoring surface.
- A reusable logistics activity table was added at:
  - `src/components/delivery/ShipmentActivityTable.jsx`
  so shipment workspaces can show recent operations activity alongside route and destination state.
- Business shipment mock data in `src/lib/demoData.js` now includes:
  - recent logistics activity rows
  - business-specific logistics notes that explain the contract-run model and receiving-contact dependency
- The business shipment page now explicitly combines:
  - aggregated shipment status
  - destination-level delivery states
  - recent logistics activity
  - business-only operational rules
  without leaning on the reader delivery model for explanation or structure.

TASK-240C delivered behaviors:

- Company users can now review recent logistics events, destination updates, and follow-up actions directly inside the business shipment workspace.
- The business logistics page now reads as a dedicated multi-location account surface rather than only a shared shipment demo.
- The B2B workspace now has a complete shipment monitoring section that matches the Phase 24 account-management scope.

TASK-240C status: `completed`

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

TASK-260A implementation result:

- The generic admin overview placeholder was replaced with a dedicated admin landing component at:
  - `src/components/dashboard/AdminOverviewPage.jsx`
- `/admin/overview` in `src/App.jsx` now mounts the real admin control-center landing view instead of the shared placeholder overview page.
- Admin overview data scaffolding in `src/lib/demoData.js` now includes:
  - KPI cards for publishing, scheduling, subscriber watchlist, company accounts, and route delays
  - account-health summary cards
  - publishing cadence chart data
  - recent operations activity rows
  - quick-action links into admin workspaces
  - compact operational reminders
- The new landing page now previews:
  - publishing workload
  - subscriber and company health
  - route risk and delivery operations
  while keeping heavy management work in the dedicated admin sections.

TASK-260A delivered behaviors:

- Admins now land on a real overview control center instead of a foundation placeholder.
- Publishing, subscriber, business-account, and delivery signals are visible immediately with quick links into deeper workspaces.
- The admin landing surface now matches the shared authenticated shell while using a denser, operations-first information mix than the business and reader overviews.

TASK-260A status: `completed`

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

TASK-260B implementation result:

- Dedicated admin editorial pages now exist at:
  - `src/pages/AdminContentList.jsx`
  - `src/pages/AdminContentEditor.jsx`
  - `src/pages/AdminSchedule.jsx`
- A reusable sector-aware article form was added at:
  - `src/components/forms/AdminArticleForm.jsx`
- `/admin/content`, `/admin/content/new`, `/admin/content/:id`, and `/admin/schedule` in `src/App.jsx` now mount real editorial workspaces instead of generic placeholders.
- Editorial mock data in `src/lib/demoData.js` now includes:
  - content-list KPI cards and article rows
  - sector template guidance
  - editor article seeds and sector-specific field definitions
  - schedule KPI cards and scheduled publishing rows
  - publishing-volume chart data and scheduling notes
- Admins can now move between:
  - content inventory
  - sector-aware article editing
  - scheduled publishing review
  with visible draft, scheduled, and published states.

TASK-260B delivered behaviors:

- The admin content list now behaves like a real publishing queue instead of a route placeholder.
- The admin editor now exposes sector-specific fields and visible article state for draft, scheduled, and published workflows.
- The schedule workspace now gives editorial timing and release coordination a dedicated operational surface inside the admin shell.

TASK-260B status: `completed`

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

TASK-260C implementation result:

- Dedicated admin account-management pages now exist at:
  - `src/pages/AdminSubscribers.jsx`
  - `src/pages/AdminCompanies.jsx`
- `/admin/subscribers` and `/admin/companies` in `src/App.jsx` now mount real operational workspaces instead of placeholder sections.
- Admin customer and company mock data in `src/lib/demoData.js` now includes:
  - subscriber KPI cards, watchlist summaries, and operational table rows
  - company KPI cards, account-segment summaries, and operational table rows
  - support and workflow notes for both subscriber and business-account operations
- The new admin sections keep renewal state, delivery eligibility, contract tier, invoice model, and company footprint visible in searchable operational tables and compact summary modules.

TASK-260C delivered behaviors:

- Admins can now inspect subscriber renewal and delivery-eligibility state from a dedicated subscriber operations page.
- Business-account summaries, contract shapes, and invoice-model visibility now live in a dedicated company management page.
- The admin control center now has real customer and organization management surfaces instead of route placeholders.

TASK-260C status: `completed`

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

TASK-260D implementation result:

- The admin shipment workspace at `src/pages/AdminShipments.jsx` was deepened with:
  - recent logistics activity
  - explicit operations handling notes
  using the shared `src/components/delivery/ShipmentActivityTable.jsx` component and new shipment activity data.
- A dedicated admin pricing page was added at:
  - `src/pages/AdminPricing.jsx`
- `/admin/pricing` in `src/App.jsx` now mounts the real pricing workspace instead of a placeholder section.
- Admin logistics and pricing mock data in `src/lib/demoData.js` now includes:
  - admin shipment activity rows
  - admin shipment operations notes
  - pricing KPI cards
  - pricing matrix rows
  - pricing tier guidance cards
  - pricing operations notes
- The admin control center now has dedicated operational surfaces for:
  - active deliveries and delayed routes
  - logistics health and recent shipment activity
  - business pricing tier management

TASK-260D delivered behaviors:

- Admin shipment monitoring now exposes recent logistics events and explicit operations guidance in addition to route, stop, and exception summaries.
- Admin pricing now has its own workspace for tier review, contract-band fit, and pricing-policy context instead of relying on company tables or public business pages.
- The admin workspace now covers publishing, customer operations, logistics, and pricing through dedicated routed sections rather than remaining partially placeholder-based.

TASK-260D status: `completed`

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

TASK-280A implementation result:

- The business dashboard settings route now mounts a real governance workspace at:
  - `src/pages/BusinessSettings.jsx`
- `/business-dashboard/settings` in `src/App.jsx` now uses the new business privacy workspace instead of the shared placeholder page.
- Shared governance form components were expanded so the same primitives can serve both reader and business privacy flows:
  - `src/components/forms/AccountConsentForm.jsx`
  - `src/components/forms/GovernanceRequestPanel.jsx`
- The mock client in `src/api/appClient.js` now includes a dedicated `company` privacy surface for:
  - company consent retrieval and saving
  - company governance request listing
  - company export and deletion-review request creation
- Privacy and governance demo data in `src/lib/demoData.js` now includes dedicated business-facing:
  - consent checklist items
  - governance request notes
  - privacy principles
  - rights and retention notes
- The public privacy page in `src/pages/Privacy.jsx` now points to both reader and business self-service governance routes and explicitly explains the admin review path for company-sensitive requests.

TASK-280A delivered behaviors:

- Reader privacy controls remain intact while business account owners now have a routed company settings workspace for consent visibility, export requests, and retention-review actions.
- GDPR-style controls are now discoverable in:
  - the reader dashboard privacy route
  - the business dashboard settings route
  - the public privacy page
- Company governance requests now reflect business-specific context such as location data, invoice-linked retention, and admin verification requirements.

TASK-280A status: `completed`

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

TASK-280B implementation result:

- The shared language layer in `src/lib/LanguageContext.jsx` now sets real document locale metadata and exposes locale-aware date formatting so public chrome can follow the active language more cleanly.
- Public masthead polish in `src/components/newspaper/Masthead.jsx` now uses the shared language metadata for:
  - locale-aware date display
  - translated language-switch labels
- Shared accessibility improvements were added across the app in:
  - `src/App.jsx`
  - `src/components/ScrollToTop.jsx`
  - `src/index.css`
  including a skip link, route-level main-content focus handling, stronger focus-visible states, and reduced-motion fallbacks.
- Dashboard consistency and accessibility were improved in:
  - `src/components/dashboard/DashboardShell.jsx`
  - `src/components/dashboard/DashboardPrimitives.jsx`
  by replacing fake read-only search inputs with non-interactive placeholder shells and labeling section navigation more clearly.
- Form feedback accessibility was standardized in:
  - `src/components/forms/ReaderProfileForm.jsx`
  - `src/components/forms/AccountConsentForm.jsx`
  - `src/components/forms/GovernanceRequestPanel.jsx`
  - `src/components/newspaper/NewsletterSection.jsx`
  using status and alert semantics plus a real label for newsletter email entry.
- Motion polish was tightened in:
  - `src/components/newspaper/HeroSection.jsx`
  - `src/components/newspaper/ScrollReveal.jsx`
  so autoplay respects reduced-motion preferences and the existing scroll reveal utility no longer leaves the known CSS custom-property type issue behind.

TASK-280B delivered behaviors:

- The app now exposes a predictable `main` skip target and route focus behavior for keyboard users across dashboard and public surfaces.
- Dashboard placeholder search shells no longer look interactive to assistive technology while still preserving the visual design language.
- Public chrome now responds more cleanly to language switching and reduced-motion preferences.
- Shared feedback, focus, and motion rules now feel more cohesive across mobile and desktop instead of varying by page.

TASK-280B status: `completed`

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
