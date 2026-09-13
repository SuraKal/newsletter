import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Users } from "lucide-react";
import {
  DashboardFilterBar,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPagination,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { useTableQuery } from "@/lib/useTableQuery";
import { adminShipmentRows } from "@/lib/demoData";

const shipmentColumns = [
  { key: "shipmentId", label: "Run ID" },
  { key: "label", label: "Label" },
  { key: "route", label: "Route" },
  { key: "scope", label: "Scope" },
  {
    key: "status",
    label: "State",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
  { key: "eta", label: "ETA" },
];

const matchesSearch = (row, query) =>
  [
    row.shipmentId,
    row.label,
    row.route,
    row.scope,
    row.status,
    row.eta,
  ].some((value) => String(value ?? "").toLowerCase().includes(query));

const relatedLinks = [
  { label: "Content", to: "/admin/content" },
  { label: "Schedule", to: "/admin/schedule" },
  { label: "Companies", to: "/admin/companies" },
  { label: "Subscribers", to: "/admin/subscribers" },
  { label: "Governance", to: "/admin/governance" },
  { label: "Pricing", to: "/admin/pricing" },
];

export default function AdminShipments() {
  const [query, setQuery] = useState("");
  const table = useTableQuery({ rows: adminShipmentRows, query, predicate: matchesSearch });

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin shipments"
        title="Delivery operations"
        description="Review consolidated shipment runs and dispatch states."
        breadcrumbs={[
          { label: "Admin workspace", to: "/admin/overview" },
          { label: "Shipments" },
        ]}
        action={
          <Link
            to="/admin/schedule"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Coordinated releases
            <Users className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search run ID, route cluster, or dispatch state"
        searchValue={query}
        onSearchChange={setQuery}
        resultCount={query.trim() ? table.total : null}
        filters={["17 runs today", "3 clusters", "2 delays flagged"]}
        action={
          <Link
            to="/admin/subscribers"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Subscriber watch
            <MapPin className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardPanel title="Consolidated shipment runs" className="p-5 sm:p-6">
        <div className="dashboard-table-wrap overflow-x-auto">
          <table className="w-full min-w-[720px]">
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
              {table.rows.map((row) => (
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
        <DashboardPagination
          page={table.page}
          pageCount={table.pageCount}
          total={table.total}
          pageSize={table.pageSize}
          onPageChange={table.setPage}
        />
      </DashboardPanel>

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}