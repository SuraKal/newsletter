import React from "react";
import { Link } from "react-router-dom";
import { Building2, Truck } from "lucide-react";
import {
  DashboardActivityTable,
  DashboardFilterBar,
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import {
  adminPricingMetrics,
  adminPricingRows,
} from "@/lib/demoData";

const pricingColumns = [
  { key: "tier", label: "Tier" },
  { key: "volume", label: "Volume band" },
  { key: "billing", label: "Billing model" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
  { key: "coverage", label: "Coverage fit" },
];

export default function AdminPricing() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin pricing"
        title="Business pricing tiers and contract guidance"
        description="Pricing management should make business tier logic, contract-band fit, and commercial review signals visible without forcing the team into the public business marketing flow."
        action={
          <Link
            to="/admin/companies"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Company accounts
            <Building2 className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search tier, volume band, or billing model"
        filters={["3 pricing bands", "12 cross-border contracts", "6 reviews in progress"]}
        action={
          <Link
            to="/admin/shipments"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Route complexity
            <Truck className="h-4 w-4" />
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminPricingMetrics.map((metric) => (
          <DashboardMetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            accent={metric.accent}
          />
        ))}
      </section>

      <section>
        <DashboardActivityTable
          title="Pricing tier matrix"
          description="Admins should be able to scan the live business pricing bands and their intended operating fit in one operational table."
          columns={pricingColumns}
          rows={adminPricingRows}
        />
      </section>


    </div>
  );
}
