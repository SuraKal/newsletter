import React from "react";
import {
  ArrowRight,
  BookOpenText,
  CalendarClock,
  CirclePlus,
  FileClock,
  ReceiptText,
  Route,
  Truck,
  Users,
} from "lucide-react";
import {
  DashboardActivityTable,
  DashboardChartPanel,
  DashboardEmptyState,
  DashboardFilterBar,
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardPanel,
  DashboardSplitMetricCard,
  DashboardStatusBadge,
  DashboardTimeline,
} from "@/components/dashboard/DashboardPrimitives";
import { dashboardWorkspaces } from "@/lib/dashboard-config";

const overviewContent = {
  reader: {
    eyebrow: "Subscriber workspace",
    title: "Reader dashboard foundation",
    description:
      "This overview establishes the new shared shell for subscriber experiences. The deeper delivery, billing, reading, and profile modules will be built in the next reader-focused phases.",
    metrics: [
      {
        label: "Plan",
        value: "Print + Digital",
        detail: "Phase 20 will connect real plan state",
      },
      {
        label: "Renewal",
        value: "Aug 1",
        detail: "Billing details route is now reserved",
      },
      {
        label: "Next delivery",
        value: "Jul 18",
        detail: "Shipment timeline comes in Phase 22",
        accent: true,
      },
      {
        label: "Reading activity",
        value: "47",
        detail: "Recent history route is now split out",
      },
    ],
    focus: [
      "Move subscriber information out of a single tabbed page and into dedicated routed sections.",
      "Keep the overview concise and let details open in deliveries, billing, history, and profile routes.",
      "Reuse the same metric and panel system later across business and admin workspaces.",
    ],
  },
  business: {
    eyebrow: "Business workspace",
    title: "Business control center foundation",
    description:
      "This overview locks in the route strategy and shared shell for company accounts. The next phases will add operational depth for teams, invoices, locations, and shipments.",
    metrics: [
      {
        label: "Contract",
        value: "Business plan",
        detail: "Plan summary will be deepened later",
      },
      {
        label: "Copy volume",
        value: "50",
        detail: "Order details move into their own route",
      },
      {
        label: "Invoice health",
        value: "Paid",
        detail: "Invoice tables follow in Phase 24",
        accent: true,
      },
      {
        label: "Destinations",
        value: "3",
        detail: "Locations become a dedicated section",
      },
    ],
    focus: [
      "Separate overview, team, orders, invoices, locations, and shipments into route-backed sections.",
      "Use a more operational control-center pattern without losing the product's brand tone.",
      "Keep list pages summary-first and push deeper detail into selected records or later route modules.",
    ],
  },
  admin: {
    eyebrow: "Admin workspace",
    title: "Admin operations shell foundation",
    description:
      "This overview creates the shared shell and route map for editorial and operational admin work. Later phases will turn the sections into full management workspaces.",
    metrics: [
      {
        label: "Published today",
        value: "12",
        detail: "Will map to real publishing queue later",
      },
      {
        label: "Scheduled",
        value: "8",
        detail: "Schedule workspace now has a route home",
      },
      {
        label: "Subscribers",
        value: "24.3k",
        detail: "Subscriber ops move into their own section",
      },
      {
        label: "Routes delayed",
        value: "2",
        detail: "Shipment monitoring follows in Phase 26",
        accent: true,
      },
    ],
    focus: [
      "Break the monolithic admin page into overview, content, schedule, subscriber, company, shipment, and pricing workspaces.",
      "Keep the overview focused on operational summaries and quick entry points, not full CRUD detail.",
      "Use the same shell language as reader and business while allowing higher information density.",
    ],
  },
};

const sectionContent = {
  deliveries: {
    icon: Route,
    title: "Delivery workspace route reserved",
    description:
      "This section is now route-backed so delivery modules can be built without changing the dashboard shell or navigation strategy.",
    bullets: [
      "Shipment timeline and ETA modules will land in the dedicated delivery phase.",
      "Reader delivery history and next-delivery widgets will move here.",
      "The shared logistics UI will later power reader, business, and admin views.",
    ],
  },
  billing: {
    icon: ReceiptText,
    title: "Billing workspace route reserved",
    description:
      "Billing and invoice activity should live in a dedicated routed section instead of a tab fragment inside the overview page.",
    bullets: [
      "Payment history tables will use shared dashboard primitives.",
      "Renewal and plan state will be visible without overloading the overview cards.",
      "Later phases can add exported receipts and invoice detail flows here.",
    ],
  },
  history: {
    icon: BookOpenText,
    title: "Reading history route reserved",
    description:
      "Reading activity and saved-content views will be implemented as their own routed modules using the shared shell.",
    bullets: [
      "Recent reading and saved articles can scale without stretching the overview page.",
      "Search and filters can be added here later without changing top-level navigation.",
      "This route also gives us room for better access-state and engagement presentation.",
    ],
  },
  profile: {
    icon: Users,
    title: "Profile route reserved",
    description:
      "Profile editing, delivery address management, and future account controls now have a stable destination in the routed shell.",
    bullets: [
      "Personal details and addresses should not compete with billing or delivery content.",
      "Future privacy and governance actions will pair cleanly with this route strategy.",
      "This also reduces the need for large tabbed forms inside the overview page.",
    ],
  },
  privacy: {
    icon: FileClock,
    title: "Privacy route reserved",
    description:
      "Consent visibility and GDPR-related self-service actions will live here in later phases.",
    bullets: [
      "Privacy should be discoverable as a first-class account section.",
      "Export and deletion request flows can evolve here without affecting the core shell.",
      "This route helps align future governance work with the proposal's EU requirements.",
    ],
  },
  team: {
    icon: Users,
    title: "Team management route reserved",
    description:
      "Company team membership belongs in its own operational section with room for roles, seat usage, and invitations.",
    bullets: [
      "The route is now stable for later team tables and invitation flows.",
      "Team activity can be presented with the shared table and panel primitives.",
      "This keeps company management out of the overview summary surface.",
    ],
  },
  orders: {
    icon: ReceiptText,
    title: "Bulk order route reserved",
    description:
      "Business order volume, cadence, and copy allocations should be managed in a dedicated section.",
    bullets: [
      "Order summaries can stay high-level on the overview while details live here.",
      "This route will later support pricing-tier and delivery-cadence logic.",
      "Operational order changes can be added without redesigning the shell.",
    ],
  },
  invoices: {
    icon: ReceiptText,
    title: "Invoice route reserved",
    description:
      "Business invoices need their own searchable table and status-focused layout instead of a summary card only.",
    bullets: [
      "Invoice lists will fit naturally into the shared operational table zone.",
      "Later phases can add filters, exports, and invoice detail panels here.",
      "This section reinforces the finance-style dashboard structure from the design reference.",
    ],
  },
  locations: {
    icon: Route,
    title: "Locations route reserved",
    description:
      "Delivery destinations and office location management should have a dedicated section in the company workspace.",
    bullets: [
      "This route gives multi-location accounts a clear operational home.",
      "Later phases can add destination summaries and location health states here.",
      "The shell now supports this without changing the top-level business layout.",
    ],
  },
  shipments: {
    icon: Route,
    title: "Shipment monitoring route reserved",
    description:
      "Shipment monitoring will use the shared delivery UI later, but this route is now part of the shell contract.",
    bullets: [
      "Aggregated shipment tables and route-status modules can land here later.",
      "Business and admin workspaces can both reuse the same logistics primitives.",
      "This keeps operational tracking separate from overview metrics.",
    ],
  },
  settings: {
    icon: FileClock,
    title: "Settings route reserved",
    description:
      "Business account-level settings and governance actions now have a stable section in the route strategy.",
    bullets: [
      "Future billing profile and account governance actions can live here.",
      "Separating settings reduces noise across overview and operational tables.",
      "This route will also help localization and governance tasks later on.",
    ],
  },
  content: {
    icon: BookOpenText,
    title: "Content workspace route reserved",
    description:
      "Editorial content management needs its own routed surface rather than a tab inside one admin file.",
    bullets: [
      "Content queue, filters, and list views will fit here later.",
      "Create and edit flows can branch out without changing the shell contract.",
      "This route anchors the future sector-based publishing workflow.",
    ],
  },
  schedule: {
    icon: CalendarClock,
    title: "Schedule route reserved",
    description:
      "Publishing schedules should live in a dedicated route with room for list and calendar views.",
    bullets: [
      "Schedule monitoring will later reuse the same panel and table system.",
      "This route keeps planning work separate from content editing and overview summaries.",
      "It also aligns directly with the proposal's scheduled publishing requirement.",
    ],
  },
  subscribers: {
    icon: Users,
    title: "Subscriber operations route reserved",
    description:
      "Admin subscriber management now has a dedicated route home in the shared shell.",
    bullets: [
      "Searchable subscriber tables will fit here later.",
      "Renewal and delivery-eligibility views can evolve without touching overview layout.",
      "The route helps keep admin operations summary-first and drill-in driven.",
    ],
  },
  companies: {
    icon: Users,
    title: "Company operations route reserved",
    description:
      "Business account management needs its own operational table zone, and this route now reserves that space.",
    bullets: [
      "Company records, volume tiers, and account summaries will later be built here.",
      "The shared shell already supports a high-density operations view for this section.",
      "It will also keep company management separate from subscriber and content workflows.",
    ],
  },
  pricing: {
    icon: ReceiptText,
    title: "Pricing route reserved",
    description:
      "Admin pricing-tier management belongs in a focused workspace with room for summary and drill-in views.",
    bullets: [
      "Business pricing and tier rules will later be surfaced here.",
      "This route gives pricing changes a stable operational home.",
      "It also supports summary-first admin views without inflating the overview page.",
    ],
  },
};

const overviewBars = {
  reader: [
    { label: "Mon", value: 12, tone: "default" },
    { label: "Tue", value: 19, tone: "accent" },
    { label: "Wed", value: 16, tone: "default" },
    { label: "Thu", value: 24, tone: "accent" },
    { label: "Fri", value: 18, tone: "default" },
  ],
  business: [
    { label: "Jan", value: 36, tone: "default" },
    { label: "Feb", value: 42, tone: "accent" },
    { label: "Mar", value: 31, tone: "default" },
    { label: "Apr", value: 46, tone: "accent" },
    { label: "May", value: 39, tone: "default" },
  ],
  admin: [
    { label: "Mon", value: 8, tone: "default" },
    { label: "Tue", value: 14, tone: "accent" },
    { label: "Wed", value: 11, tone: "default" },
    { label: "Thu", value: 17, tone: "accent" },
    { label: "Fri", value: 15, tone: "default" },
  ],
};

const overviewActivity = {
  reader: [
    {
      id: "reader-1",
      item: "Morning delivery scheduled",
      status: "On track",
      tone: "success",
      date: "Aug 10, 2026",
    },
    {
      id: "reader-2",
      item: "Invoice generated",
      status: "Pending",
      tone: "warning",
      date: "Aug 8, 2026",
    },
    {
      id: "reader-3",
      item: "Saved article synced",
      status: "Updated",
      tone: "info",
      date: "Aug 7, 2026",
    },
  ],
  business: [
    {
      id: "business-1",
      item: "Bulk order queued",
      status: "Queued",
      tone: "info",
      date: "Aug 10, 2026",
    },
    {
      id: "business-2",
      item: "Invoice INV-2026-08",
      status: "Paid",
      tone: "success",
      date: "Aug 8, 2026",
    },
    {
      id: "business-3",
      item: "Location review pending",
      status: "Review",
      tone: "warning",
      date: "Aug 6, 2026",
    },
  ],
  admin: [
    {
      id: "admin-1",
      item: "Morning publish queue",
      status: "Ready",
      tone: "success",
      date: "Aug 10, 2026",
    },
    {
      id: "admin-2",
      item: "Subscriber import review",
      status: "In progress",
      tone: "info",
      date: "Aug 9, 2026",
    },
    {
      id: "admin-3",
      item: "Route delay alert",
      status: "Needs review",
      tone: "warning",
      date: "Aug 9, 2026",
    },
  ],
};

const baseColumns = [
  { key: "item", label: "Item" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
  { key: "date", label: "Date" },
];

export function WorkspaceOverviewPage({ workspaceKey }) {
  const workspace = dashboardWorkspaces[workspaceKey];
  const content = overviewContent[workspaceKey];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        action={
          <div className="dashboard-action-button dashboard-action-button-muted inline-flex items-center gap-2 px-4 py-2 font-sans text-xs font-medium">
            Phase 14 foundation
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {content.metrics.map((metric) => (
          <DashboardMetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            accent={metric.accent}
          />
        ))}
      </div>

      <DashboardFilterBar
        searchPlaceholder={`Search inside ${workspace.label.toLowerCase()}`}
        filters={workspace.sections.map((section) => section.label)}
        action={
          <button
            type="button"
            className="dashboard-action-button inline-flex items-center gap-2 px-4 py-2 font-sans text-xs font-semibold"
          >
            <CirclePlus className="h-3.5 w-3.5" />
            Quick action
          </button>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
        <DashboardPanel
          title="Workspace contract set in this phase"
          description="This page is intentionally light. The goal here is to establish the shared shell, navigation, route structure, and primitive catalog before the deeper page-specific tasks land."
        >
          <ul className="space-y-3">
            {content.focus.map((item) => (
              <li
                key={item}
                className="dashboard-subpanel px-4 py-3 font-sans text-sm leading-6 text-stone-600 dark:text-stone-300"
              >
                {item}
              </li>
            ))}
          </ul>
        </DashboardPanel>

        <DashboardSplitMetricCard
          title="Shared shell coverage"
          leftLabel="Sections"
          leftValue={workspace.sections.length}
          rightLabel="Routes"
          rightValue={workspace.sections.length + 1}
          footer={`The ${workspace.label.toLowerCase()} now has a stable route-backed structure for overview plus dedicated deeper sections.`}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
        <DashboardChartPanel
          title="Shell readiness snapshot"
          description="A lightweight chart primitive is now available for later analytics and status surfaces."
          data={overviewBars[workspaceKey]}
        />
        <DashboardActivityTable
          title="Recent activity primitive"
          description="This reusable table pattern will be used later for invoices, shipments, publishing queues, and subscriber operations."
          columns={baseColumns}
          rows={overviewActivity[workspaceKey]}
        />
      </div>
    </div>
  );
}

export function WorkspaceSectionPlaceholder({ workspaceKey, sectionId }) {
  const workspace = dashboardWorkspaces[workspaceKey];
  const section = workspace.sections.find((item) => item.id === sectionId);
  const content = sectionContent[sectionId];
  const Icon = content?.icon || FileClock;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow={workspace.label}
        title={content?.title || section?.label || "Workspace section"}
        description={
          content?.description ||
          "This section has been routed as part of the shared dashboard foundation and will be filled out in later feature phases."
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <DashboardPanel
          title="Why this route exists now"
          description="Phase 14 introduces the shell and route structure first so deeper dashboard tasks can focus on content and operations instead of navigation changes."
        >
          <div className="dashboard-subpanel p-5">
            <div className="flex items-center gap-3">
              <div className="dashboard-icon-badge flex h-12 w-12 items-center justify-center">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-sans text-sm font-semibold text-stone-900 dark:text-stone-100">
                  Routed workspace section
                </p>
                <p className="dashboard-page-description font-sans text-xs">
                  {section?.path}
                </p>
              </div>
            </div>
            <p className="dashboard-page-description mt-4 font-sans text-sm leading-6">
              {content?.description}
            </p>
          </div>
        </DashboardPanel>

        <DashboardTimeline
          title="Planned implementation focus"
          description="These capabilities are the next items intended for this route once the shared shell foundation is in place."
          items={(content?.bullets || []).map((item, index) => ({
            label: `Step ${index + 1}`,
            description: item,
            completed: index === 0,
            icon: index === 0 ? Truck : Route,
            badge:
              index === 0 ? (
                <DashboardStatusBadge label="Prepared" tone="success" />
              ) : null,
          }))}
        />
      </div>

      <DashboardEmptyState
        title="Feature content intentionally deferred"
        description="This route is now stable inside the shared shell. A later phase will replace this placeholder with workspace-specific forms, tables, widgets, or operational flows."
      />
    </div>
  );
}
