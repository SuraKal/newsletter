import React from "react";
import { Link } from "react-router-dom";
import { Truck, Users } from "lucide-react";
import {
  DashboardFilterBar,
  DashboardPageHeader,
  DashboardPanel,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { adminSubscriberRows } from "@/lib/demoData";

const subscriberColumns = [
  { key: "name", label: "Subscriber" },
  { key: "plan", label: "Plan" },
  { key: "renewal", label: "Renewal" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
];

const relatedLinks = [
  { label: "Content", to: "/admin/content" },
  { label: "Schedule", to: "/admin/schedule" },
  { label: "Companies", to: "/admin/companies" },
  { label: "Shipments", to: "/admin/shipments" },
  { label: "Pricing", to: "/admin/pricing" },
];

export default function AdminSubscribers() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin subscribers"
        title="Subscriber operations"
        description="Review subscriber plans, renewals, and account status."
        breadcrumbs={[
          { label: "Admin workspace", to: "/admin/overview" },
          { label: "Subscribers" },
        ]}
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

      <DashboardPanel title="Subscriber operations table" className="p-5 sm:p-6">
        <div className="dashboard-table-wrap overflow-x-auto">
          <table className="w-full min-w-[620px]">
            <thead>
              <tr className="border-b border-stone-200/80 dark:border-stone-700/80">
                {subscriberColumns.map((column) => (
                  <th
                    key={column.key}
                    className="py-3 text-left font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-stone-500"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adminSubscriberRows.map((row) => (
                <tr key={row.id} className="border-b last:border-b-0">
                  {subscriberColumns.map((column) => (
                    <td
                      key={column.key}
                      className="py-3 font-sans text-sm text-stone-700 dark:text-stone-300"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardPanel>

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}