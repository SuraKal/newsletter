import React from "react";
import { Link } from "react-router-dom";
import { CirclePlus, Truck } from "lucide-react";
import {
  DashboardFilterBar,
  DashboardPageHeader,
  DashboardPanel,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { businessOrderRows } from "@/lib/demoData";

const orderColumns = [
  { key: "order", label: "Order plan" },
  { key: "copies", label: "Copies" },
  { key: "cadence", label: "Cadence" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
];

const relatedLinks = [
  { label: "Team", to: "/business-dashboard/team" },
  { label: "Invoices", to: "/business-dashboard/invoices" },
  { label: "Locations", to: "/business-dashboard/locations" },
  { label: "Shipments", to: "/business-dashboard/shipments" },
  { label: "Settings", to: "/business-dashboard/settings" },
];

export default function BusinessOrders() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business orders"
        title="Bulk order plans"
        description="Manage recurring copy volume and distribution cadence."
        breadcrumbs={[
          { label: "Business workspace", to: "/business-dashboard/overview" },
          { label: "Orders" },
        ]}
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
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            <CirclePlus className="h-4 w-4" />
            New order plan
          </button>
        }
      />

      <DashboardPanel title="Recurring order plans" className="p-5 sm:p-6">
        <div className="dashboard-table-wrap overflow-x-auto">
          <table className="w-full min-w-[620px]">
            <thead>
              <tr className="border-b border-stone-200/80 dark:border-stone-700/80">
                {orderColumns.map((column) => (
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
              {businessOrderRows.map((row) => (
                <tr key={row.id} className="border-b last:border-b-0">
                  {orderColumns.map((column) => (
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