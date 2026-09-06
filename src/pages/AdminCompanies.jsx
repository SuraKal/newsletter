import React from "react";
import { Link } from "react-router-dom";
import { Building2, CreditCard, Truck } from "lucide-react";
import {
  DashboardActivityTable,
  DashboardFilterBar,
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardPanel,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import {
  adminCompanyMetrics,
  adminCompanyRows,
  adminCompanySegments,
  adminCompanyWatchNotes,
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

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <DashboardActivityTable
          title="Company account table"
          description="Business account operations should stay searchable by tier, volume, and invoice model rather than being hidden inside overview cards."
          columns={companyColumns}
          rows={adminCompanyRows}
        />

        <DashboardPanel
          title="Company account segments"
          description="Keep the major business-account shapes visible so front-desk and operations staff know what kind of contract they are handling."
          className="h-full"
        >
          <div className="space-y-4">
            {adminCompanySegments.map((segment) => (
              <div
                key={segment.title}
                className="rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="dashboard-icon-badge flex h-10 w-10 items-center justify-center">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-900 dark:text-stone-100">
                      {segment.title}
                    </p>
                    <p className="mt-2 font-sans text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {segment.value}
                    </p>
                    <p className="mt-2 font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
                      {segment.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardPanel>
      </section>

      <DashboardPanel
        title="Company operations notes"
        description="The company workspace should help the admin team operate business accounts without mixing them into subscriber-only workflows."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {adminCompanyWatchNotes.map((item) => (
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
    </div>
  );
}
