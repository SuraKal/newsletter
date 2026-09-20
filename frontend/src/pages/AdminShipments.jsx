import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Users } from "lucide-react";
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
import { appClient } from "@/api/appClient";

const shipmentColumns = [
  {
    key: "shipmentId",
    label: "Run ID",
    primary: true,
    render: (value, row) => (
      <Link
        to={`/admin/shipments/${row.id}`}
        className="font-medium text-stone-900 transition-colors hover:text-heritage dark:text-stone-100"
      >
        {value}
      </Link>
    ),
  },
  { key: "label", label: "Label" },
  { key: "route", label: "Route" },
  {
    key: "deliveryLocations",
    label: "Destinations",
    render: (value) => value?.length ? `${value.length} saved` : "—",
  },
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
    ...(row.deliveryLocations || []).flatMap((location) => [
      location.location,
      location.address,
      location.region,
    ]),
    row.scope,
    row.status,
    row.eta,
  ].some((value) => String(value ?? "").toLowerCase().includes(query));

const shipmentFilterGroups = [
  { key: "status", label: "State" },
  { key: "route", label: "Route" },
];

const relatedLinks = [
  { label: "Content", to: "/admin/content" },
  { label: "Schedule", to: "/admin/schedule" },
  { label: "Companies", to: "/admin/companies" },
  { label: "Subscribers", to: "/admin/subscribers" },
  { label: "Governance", to: "/admin/governance" },
  { label: "Order requests", to: "/admin/order-requests" },
];

export default function AdminShipments() {
  const [query, setQuery] = useState("");
  const [shipments, setShipments] = useState(() =>
    appClient.shipments.listAdmin(),
  );
  const { activeFilters, setFilter, clearFilters } = useTableFilters();

  const reloadShipments = async () => {
    const rows = await appClient.shipments.refreshAdmin();
    if (Array.isArray(rows)) setShipments(rows);
  };

  useEffect(() => {
    reloadShipments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const table = useTableQuery({
    rows: shipments,
    query,
    predicate: matchesSearch,
    activeFilters,
    filterGroups: shipmentFilterGroups,
  });

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
        resultCount={query.trim() || table.hasActiveFilters ? table.total : null}
        filterGroups={shipmentFilterGroups}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        filterOptions={table.filterOptions}
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
        {table.total ? (
          <>
            <DashboardDataTable
              columns={shipmentColumns}
              rows={table.rows}
              minWidth={840}
            />
            <DashboardPagination
              page={table.page}
              pageCount={table.pageCount}
              total={table.total}
              pageSize={table.pageSize}
              onPageChange={table.setPage}
            />
          </>
        ) : (
          <DashboardEmptyState
            title="No matching shipment runs"
            description="Try clearing the state or route filters to see the full delivery surface."
          />
        )}
      </DashboardPanel>

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}
