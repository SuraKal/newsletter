import React from "react";
import { Link } from "react-router-dom";
import { Building2, MapPin } from "lucide-react";
import {
  DashboardFilterBar,
  DashboardPageHeader,
  DashboardPanel,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { businessShipmentRows } from "@/lib/demoData";

const shipmentColumns = [
  { key: "shipmentId", label: "Run ID" },
  { key: "label", label: "Account" },
  { key: "route", label: "Route cluster" },
  { key: "scope", label: "Scope" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
  { key: "eta", label: "Delivery window" },
];

const relatedLinks = [
  { label: "Team", to: "/business-dashboard/team" },
  { label: "Orders", to: "/business-dashboard/orders" },
  { label: "Invoices", to: "/business-dashboard/invoices" },
  { label: "Locations", to: "/business-dashboard/locations" },
  { label: "Settings", to: "/business-dashboard/settings" },
];

export default function BusinessShipments() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business shipments"
        title="Consolidated shipment runs"
        description="Review outbound shipment runs and their coverage scope."
        breadcrumbs={[
          { label: "Business workspace", to: "/business-dashboard/overview" },
          { label: "Shipments" },
        ]}
        action={
          <Link
            to="/business-dashboard/locations"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Open locations
            <MapPin className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search shipment, branch, or route cluster"
        filters={["9 delivery points", "Belgium + Germany", "Contract shipment mode"]}
        action={
          <Link
            to="/business-dashboard/orders"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Open orders
            <Building2 className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardPanel title="Consolidated shipment runs" className="p-5 sm:p-6">
        <div className="dashboard-table-wrap overflow-x-auto">
          <table className="w-full min-w-[840px]">
            <thead>
              <tr className="border-b border-stone-200/80 dark:border-stone-700/80">
                {shipmentColumns.map((column) => (
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
              {businessShipmentRows.map((row) => (
                <tr key={row.id} className="border-b last:border-b-0">
                  {shipmentColumns.map((column) => (
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