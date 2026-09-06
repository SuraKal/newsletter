import React from "react";
import { Link } from "react-router-dom";
import { CreditCard, Truck } from "lucide-react";
import {
  DashboardActivityTable,
  DashboardFilterBar,
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import {
  adminCompanyMetrics,
  adminCompanyRows,
} from "@/lib/demoData";

const companyColumns = [
  { key: "company", label: "Company" },
  { key: "tier", label: "Tier" },
  { key: "volume", label: "Volume" },
  { key: "billing", label: "Billing" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
  { key: "region", label: "Region" },
];

export default function AdminCompanies() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin companies"
        title="Business account summaries and contract health"
        description="Company management should keep volume, billing model, and account status visible so operations can support B2B accounts without falling back to consumer subscription assumptions."
        action={
          <Link
            to="/admin/pricing"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Pricing tiers
            <CreditCard className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search company, contract tier, or invoice model"
        filters={["46 active companies", "Regional + enterprise tiers", "Belgium + Germany accounts"]}
        action={
          <Link
            to="/admin/shipments"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Delivery ops
            <Truck className="h-4 w-4" />
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminCompanyMetrics.map((metric) => (
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
          title="Company account table"
          description="Business account operations should stay searchable by tier, volume, and invoice model rather than being hidden inside overview cards."
          columns={companyColumns}
          rows={adminCompanyRows}
        />
      </section>


    </div>
  );
}
