import React from "react";
import { Link } from "react-router-dom";
import { Package, Truck } from "lucide-react";
import {
  DashboardActivityTable,
  DashboardChartPanel,
  DashboardFilterBar,
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import {
  businessOrderMetrics,
  businessOrderRows,
  businessOrderVolumeBars,
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
            accent={metric.accent}
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <DashboardChartPanel
          title="Copy distribution by destination"
          data={businessOrderVolumeBars}
        />
        <DashboardActivityTable
          title="Recurring order plans"
          columns={orderColumns}
          rows={businessOrderRows}
        />
      </section>

    </div>
  );
}
