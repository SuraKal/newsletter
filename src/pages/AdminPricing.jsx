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
  adminPricingBandCards,
  adminPricingMetrics,
  adminPricingNotes,
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

      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <DashboardActivityTable
          title="Pricing tier matrix"
          description="Admins should be able to scan the live business pricing bands and their intended operating fit in one operational table."
          columns={pricingColumns}
          rows={adminPricingRows}
        />

        <DashboardPanel
          title="Tier guidance"
          description="Keep the contract shapes visible so operations and commercial follow-up use the same pricing language."
          className="h-full"
        >
          <div className="space-y-4">
            {adminPricingBandCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="dashboard-icon-badge flex h-10 w-10 items-center justify-center">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-900 dark:text-stone-100">
                      {card.title}
                    </p>
                    <p className="mt-2 font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
                      {card.detail}
                    </p>
                    <p className="mt-2 font-sans text-xs leading-5 text-stone-500">
                      {card.note}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardPanel>
      </section>

      <DashboardPanel
        title="Pricing operations notes"
        description="The admin pricing page should reinforce why business tiers exist and how they relate to route and contract complexity."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {adminPricingNotes.map((item) => (
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
