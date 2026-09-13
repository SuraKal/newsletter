import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Truck } from "lucide-react";
import {
  DashboardFilterBar,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPagination,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { useTableQuery } from "@/lib/useTableQuery";
import { businessLocationRows } from "@/lib/demoData";

const locationColumns = [
  { key: "location", label: "Site" },
  { key: "region", label: "Region" },
  { key: "copies", label: "Copies / cycle" },
  { key: "contact", label: "Receiving contact" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
];

const matchesSearch = (row, query) =>
  [row.location, row.region, row.copies, row.contact, row.status].some(
    (value) => String(value ?? "").toLowerCase().includes(query),
  );

const relatedLinks = [
  { label: "Team", to: "/business-dashboard/team" },
  { label: "Orders", to: "/business-dashboard/orders" },
  { label: "Invoices", to: "/business-dashboard/invoices" },
  { label: "Shipments", to: "/business-dashboard/shipments" },
  { label: "Settings", to: "/business-dashboard/settings" },
];

export default function BusinessLocations() {
  const [query, setQuery] = useState("");
  const table = useTableQuery({ rows: businessLocationRows, query, predicate: matchesSearch });

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business locations"
        title="Delivery destinations"
        description="Review receiving sites and their readiness status."
        breadcrumbs={[
          { label: "Business workspace", to: "/business-dashboard/overview" },
          { label: "Locations" },
        ]}
        action={
          <Link
            to="/business-dashboard/shipments"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Open shipments
            <Truck className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search site, city, or receiving contact"
        searchValue={query}
        onSearchChange={setQuery}
        resultCount={query.trim() ? table.total : null}
        filters={["9 active locations", "Belgium + Germany", "1 review state"]}
        action={
          <Link
            to="/business-dashboard/team"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Receiving owners
            <Building2 className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardPanel title="Location status" className="p-5 sm:p-6">
        <div className="dashboard-table-wrap overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-stone-200/80 dark:border-stone-700/80">
                {locationColumns.map((column) => (
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
                  {locationColumns.map((column) => (
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

      <DashboardRelatedLinks
        title="Related links"
        items={[{ label: "View coverage map", to: "/delivery" }, ...relatedLinks]}
      />
    </div>
  );
}