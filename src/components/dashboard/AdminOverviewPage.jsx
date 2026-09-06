import React from "react";
import {
  ArrowRight,
  BookText,
  Building2,
  CalendarDays,
  CreditCard,
  Truck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  DashboardActivityTable,
  DashboardChartPanel,
  DashboardFilterBar,
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardPanel,
  DashboardSplitMetricCard,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import RouteSummaryPanel from "@/components/delivery/RouteSummaryPanel";
import {
  adminOverviewAccountHealth,
  adminOverviewActivityRows,
  adminOverviewMetrics,
  adminOverviewPublishingBars,
  adminOverviewQuickActions,
  adminShipmentRouteSummaries,
} from "@/lib/demoData";

const quickActionIconMap = {
  content: BookText,
  schedule: CalendarDays,
  subscribers: Users,
  companies: Building2,
  shipments: Truck,
  pricing: CreditCard,
};

const activityColumns = [
  { key: "item", label: "Activity" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
  { key: "date", label: "Date" },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin workspace"
        title="Editorial and operations control center"
        action={
          <Link
            to="/admin/content"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Open content workspace
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search articles, subscribers, companies, or routes"
        filters={[
          "12 published today",
          "24.3k subscribers",
          "2 delayed corridors",
        ]}
        action={
          <Link
            to="/admin/shipments"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Monitor shipments
            <Truck className="h-4 w-4" />
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {adminOverviewMetrics.map((metric) => (
          <DashboardMetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            accent={metric.accent}
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <DashboardSplitMetricCard
          title="Publishing snapshot"
          leftLabel="Next release"
          leftValue="August 11, 2026 · 2:00 PM"
          rightLabel="Queue mix"
          rightValue="8 scheduled / 5 drafts"
          footer=""
        />
        <DashboardPanel
          title="Subscriber and company health"
          className="h-full"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {adminOverviewAccountHealth.map((item) => (
              <div key={item.label} className="dashboard-panel-soft p-4">
                <p className="dashboard-kpi-label font-sans text-[0.65rem] font-bold uppercase tracking-[0.22em]">
                  {item.label}
                </p>
                <p className="dashboard-kpi-value mt-2 font-sans text-2xl font-semibold">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </DashboardPanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <DashboardChartPanel
          title="Publishing cadence"
          data={adminOverviewPublishingBars}
        />
        <DashboardActivityTable
          title="Recent operations activity"
          columns={activityColumns}
          rows={adminOverviewActivityRows}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <RouteSummaryPanel
          title="Live route risk preview"
          items={adminShipmentRouteSummaries.slice(0, 2)}
        />
        <DashboardPanel
          title="Quick actions"
          className="h-full"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {adminOverviewQuickActions.map((action) => {
              const Icon = quickActionIconMap[action.id] || BookText;

              return (
                <Link
                  key={action.route}
                  to={action.route}
                  className="rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4 transition hover:border-stone-300 hover:bg-white"
                >
                  <div className="flex items-start gap-3">
                    <div className="dashboard-icon-badge flex h-10 w-10 items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-900 dark:text-stone-100">
                        {action.label}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>


        </DashboardPanel>
      </section>
    </div>
  );
}
