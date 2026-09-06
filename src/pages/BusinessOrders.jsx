import React from "react";
import { Link } from "react-router-dom";
import { BarChart3, Package, Truck } from "lucide-react";
import {
  DashboardActivityTable,
  DashboardChartPanel,
  DashboardFilterBar,
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardPanel,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import {
  businessOrderMetrics,
  businessOrderRows,
  businessOrderVolumeBars,
  businessPricingFramework,
  businessPricingNotes,
} from "@/lib/demoData";

const orderColumns = [
  { key: "order", label: "Order plan" },
  { key: "copies", label: "Copies" },
  { key: "cadence", label: "Cadence" },
  { key: "sites", label: "Sites" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
  { key: "nextWindow", label: "Next window" },
];

export default function BusinessOrders() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business orders"
        title="Bulk volume and recurring distribution planning"
        description="Order management should make copy counts, cadence, and site coverage easy to adjust without mixing commercial planning into the shipment detail pages."
        action={
          <Link
            to="/business-dashboard/shipments"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Open shipment timing
            <Truck className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search order plan, cadence, or destination set"
        filters={["475 copies recurring", "Biweekly print cycle", "Regional Team pricing"]}
        action={
          <Link
            to="/business-dashboard/locations"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Review destinations
            <Package className="h-4 w-4" />
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {businessOrderMetrics.map((metric) => (
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
        <DashboardChartPanel
          title="Copy distribution by destination"
          description="The order workspace should show where volume is concentrated before the business user changes a recurring allocation."
          data={businessOrderVolumeBars}
        />
        <DashboardActivityTable
          title="Recurring order plans"
          description="Keep order planning in a dedicated table so users can compare cadence and footprint without leaving the business workspace."
          columns={orderColumns}
          rows={businessOrderRows}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <DashboardPanel
          title="Volume pricing framework"
          description="Business order planning should stay aware of tier logic without turning this screen into a public pricing page."
          className="h-full"
        >
          <div className="space-y-4">
            {businessPricingFramework.map((tier) => (
              <div
                key={tier.tier}
                className="rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-900 dark:text-stone-100">
                      {tier.tier}
                    </p>
                    <p className="mt-2 font-sans text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {tier.volume}
                    </p>
                  </div>
                  <div className="dashboard-icon-badge flex h-10 w-10 items-center justify-center">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                </div>
                <p className="dashboard-page-description mt-3 font-sans text-xs leading-5">
                  {tier.pricing} · {tier.billing}
                </p>
                <p className="mt-2 font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
                  {tier.note}
                </p>
              </div>
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel
          title="Order planning notes"
          description="Keep commercial constraints visible while the account owner adjusts recurring copy volume and site scope."
          className="h-full"
        >
          <div className="space-y-4">
            {businessPricingNotes.map((item) => (
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
