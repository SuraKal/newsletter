import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Truck } from "lucide-react";
import {
  DashboardDataTable,
  DashboardEmptyState,
  DashboardFilterBar,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPagination,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { useTableFilters, useTableQuery } from "@/lib/useTableQuery";
import { getBusinessLocationRows } from "@/lib/business-ops-store";

const locationColumns = [
  {
    key: "location",
    label: "Site",
    primary: true,
    render: (value, row) => (
      <Link
        to={`/business-dashboard/locations/${row.id}`}
        className="font-medium text-stone-900 transition-colors hover:text-heritage dark:text-stone-100"
      >
        {value}
      </Link>
    ),
  },
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

const locationFilterGroups = [
  { key: "region", label: "Region" },
  { key: "status", label: "Status" },
];

const relatedLinks = [
  { label: "Team", to: "/business-dashboard/team" },
  { label: "Orders", to: "/business-dashboard/orders" },
  { label: "Invoices", to: "/business-dashboard/invoices" },
  { label: "Shipments", to: "/business-dashboard/shipments" },
  { label: "Settings", to: "/business-dashboard/settings" },
];

export default function BusinessLocations() {
  const [query, setQuery] = useState("");
  const { activeFilters, setFilter, clearFilters } = useTableFilters();
  const table = useTableQuery({
    rows: getBusinessLocationRows(),
    query,
    predicate: matchesSearch,
    activeFilters,
    filterGroups: locationFilterGroups,
  });

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
        resultCount={query.trim() || table.hasActiveFilters ? table.total : null}
        filterGroups={locationFilterGroups}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        filterOptions={table.filterOptions}
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
        {table.total ? (
          <DashboardDataTable
            columns={locationColumns}
            rows={table.rows}
            minWidth={760}
          />
        ) : (
          <DashboardEmptyState
            title="No matching locations"
            description="Try clearing the region or status filters to see the full destination list."
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

      <DashboardRelatedLinks
        title="Related links"
        items={[{ label: "View coverage map", to: "/delivery" }, ...relatedLinks]}
      />
    </div>
  );
}