import React from "react";
import {
  ArrowRight,
  Building2,
  FileText,
  MapPinned,
  Package,
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
  businessOverviewActivityRows,
  businessOverviewCopyBars,
  businessOverviewDeliveryFootprint,
  businessOverviewMetrics,
  businessOverviewQuickActions,
  businessOverviewReminders,
  businessShipmentRouteSummaries,
} from "@/lib/demoData";

const quickActionIconMap = {
  team: Users,
  orders: Package,
  invoices: FileText,
  locations: MapPinned,
  shipments: Building2,
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

export default function BusinessOverviewPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business workspace"
        title="Business account command center"
        description="The business overview should surface contract state, copy volume, invoice health, and upcoming distribution at a glance, then hand deeper work off to the dedicated operational sections."
        action={
          <Link
            to="/business-dashboard/shipments"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Open shipment workspace
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search locations, invoices, or shipment runs"
        filters={[
          "Regional Team contract",
          "475 copies per cycle",
          "Belgium + Germany coverage",
        ]}
        action={
          <Link
            to="/business-dashboard/orders"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Review bulk orders
            <Package className="h-4 w-4" />
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {businessOverviewMetrics.map((metric) => (
          <DashboardMetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            accent={metric.accent}
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <DashboardSplitMetricCard
          title="Contract snapshot"
          leftLabel="Commercial tier"
          leftValue="Regional Team"
          rightLabel="Invoice model"
          rightValue="Monthly consolidated"
          footer="Multi-location business accounts stay on a contract and invoice path instead of the self-serve reader renewal model."
        />
        <DashboardPanel
          title="Delivery footprint"
          description="Keep the distribution footprint visible without turning the overview into a full locations workspace."
          className="h-full"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {businessOverviewDeliveryFootprint.map((item) => (
              <div key={item.label} className="dashboard-panel-soft p-4">
                <p className="dashboard-kpi-label font-sans text-[0.65rem] font-bold uppercase tracking-[0.22em]">
                  {item.label}
                </p>
                <p className="dashboard-kpi-value mt-2 font-sans text-2xl font-semibold">
                  {item.value}
                </p>
                <p className="dashboard-page-description mt-2 font-sans text-xs leading-5">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </DashboardPanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <DashboardChartPanel
          title="Copy allocation by location"
          description="This stays summary-first so account owners can spot where distribution is concentrated before opening orders or locations."
          data={businessOverviewCopyBars}
        />
        <DashboardActivityTable
          title="Recent business activity"
          description="Operational finance, location, and shipment signals should be visible together before the user drills into dedicated sections."
          columns={activityColumns}
          rows={businessOverviewActivityRows}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <RouteSummaryPanel
          title="Route and shipment health"
          description="The overview should show a compact logistics read without replacing the deeper shipment workspace."
          items={businessShipmentRouteSummaries.slice(0, 2)}
        />
        <DashboardPanel
          title="Quick actions"
          description="Push deeper operational work into dedicated sections instead of expanding this overview into a multi-purpose control room."
          className="h-full"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {businessOverviewQuickActions.map((action) => {
              const Icon = quickActionIconMap[action.id] || Building2;

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
                      <p className="dashboard-page-description mt-2 font-sans text-xs leading-5">
                        {action.detail}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-5 space-y-3">
            {businessOverviewReminders.map((item) => (
              <div
                key={item}
                className="rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4"
              >
                <p className="font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </DashboardPanel>
      </section>
    </div>
  );
}
