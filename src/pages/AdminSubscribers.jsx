import React from "react";
import { Link } from "react-router-dom";
import { Truck, Users } from "lucide-react";
import {
  DashboardActivityTable,
  DashboardFilterBar,
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import {
  adminSubscriberMetrics,
  adminSubscriberRows,
} from "@/lib/demoData";

const subscriberColumns = [
  { key: "name", label: "Subscriber" },
  { key: "plan", label: "Plan" },
  { key: "renewal", label: "Renewal" },
  { key: "deliveryEligibility", label: "Delivery eligibility" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
];

export default function AdminSubscribers() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin subscribers"
        title="Subscriber status, renewals, and delivery eligibility"
        description="Subscriber operations should keep renewal state, print eligibility, and support review easy to scan without sending the front desk into unrelated logistics or billing screens."
        action={
          <Link
            to="/admin/shipments"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Open shipment ops
            <Truck className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search subscriber, renewal state, or address watch"
        filters={["24.3k active", "37 review cases", "Print + digital watchlist"]}
        action={
          <Link
            to="/admin/companies"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Company accounts
            <Users className="h-4 w-4" />
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminSubscriberMetrics.map((metric) => (
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
          title="Subscriber operations table"
          description="Keep renewal, plan, and delivery-eligibility checks together so frontline account work can be resolved without jumping across several pages."
          columns={subscriberColumns}
          rows={adminSubscriberRows}
        />
      </section>


    </div>
  );
}
