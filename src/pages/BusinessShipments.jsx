import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, MapPin } from "lucide-react";
import {
  DashboardEmptyState,
  DashboardFilterBar,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPagination,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { useTableFilters, useTableQuery } from "@/lib/useTableQuery";
import { businessShipmentRows } from "@/lib/demoData";

const shipmentColumns = [
  {
    key: "shipmentId",
    label: "Run ID",
    render: (value, row) => (
      <Link
        to={`/business-dashboard/shipments/${row.id}`}
        className="font-medium text-stone-900 transition-colors hover:text-heritage dark:text-stone-100"
      >
        {value}
      </Link>
    ),
  },
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

const matchesSearch = (row, query) =>
  [
    row.shipmentId,
    row.label,
    row.route,
    row.scope,
    row.status,
    row.eta,
  ].some((value) => String(value ?? "").toLowerCase().includes(query));

const businessShipmentFilterGroups = [
  { key: "status", label: "Status" },
  { key: "route", label: "Route" },
];

const relatedLinks = [
  { label: "Team", to: "/business-dashboard/team" },
  { label: "Orders", to: "/business-dashboard/orders" },
  { label: "Invoices", to: "/business-dashboard/invoices" },
  { label: "Locations", to: "/business-dashboard/locations" },
  { label: "Settings", to: "/business-dashboard/settings" },
];

export default function BusinessShipments() {
  const [query, setQuery] = useState("");
  const { activeFilters, setFilter, clearFilters } = useTableFilters();
  const table = useTableQuery({
    rows: businessShipmentRows,
    query,
    predicate: matchesSearch,
    activeFilters,
    filterGroups: businessShipmentFilterGroups,
  });

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
        searchValue={query}
        onSearchChange={setQuery}
        resultCount={query.trim() || table.hasActiveFilters ? table.total : null}
        filterGroups={businessShipmentFilterGroups}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        filterOptions={table.filterOptions}
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
        {table.total ? (
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
        ) : (
          <DashboardEmptyState
            title="No matching shipment runs"
            description="Try clearing the status or route filters to see the full shipment surface."
          />
        )}
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