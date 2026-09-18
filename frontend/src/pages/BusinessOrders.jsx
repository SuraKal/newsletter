import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CirclePlus, Truck } from "lucide-react";
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

const orderColumns = [
  {
    key: "order",
    label: "Order plan",
    primary: true,
    render: (value, row) => (
      <Link
        to={`/business-dashboard/orders/${row.id}`}
        className="font-medium text-stone-900 transition-colors hover:text-heritage dark:text-stone-100"
      >
        {value}
      </Link>
    ),
  },
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

const matchesSearch = (row, query) =>
  [row.order, row.copies, row.cadence, row.status].some((value) =>
    String(value ?? "").toLowerCase().includes(query),
  );

const orderFilterGroups = [
  { key: "status", label: "Status" },
  { key: "cadence", label: "Cadence" },
];

const relatedLinks = [
  { label: "Team", to: "/business-dashboard/team" },
  { label: "Invoices", to: "/business-dashboard/invoices" },
  { label: "Locations", to: "/business-dashboard/locations" },
  { label: "Shipments", to: "/business-dashboard/shipments" },
  { label: "Settings", to: "/business-dashboard/settings" },
];

export default function BusinessOrders() {
  const [query, setQuery] = useState("");
  const [plans, setPlans] = useState(() => appClient.orderPlans.list());
  const { activeFilters, setFilter, clearFilters } = useTableFilters();

  const reloadPlans = async () => {
    const rows = await appClient.orderPlans.refresh();
    if (Array.isArray(rows)) setPlans(rows);
  };

  useEffect(() => {
    reloadPlans();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const table = useTableQuery({
    rows: plans,
    query,
    predicate: matchesSearch,
    activeFilters,
    filterGroups: orderFilterGroups,
  });

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
        searchValue={query}
        onSearchChange={setQuery}
        resultCount={query.trim() || table.hasActiveFilters ? table.total : null}
        filterGroups={orderFilterGroups}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        filterOptions={table.filterOptions}
        filters={["475 copies recurring", "Biweekly print cycle", "Admin-confirmed price"]}
        action={
          <Link
            to="/business-dashboard/order-requests"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            <CirclePlus className="h-4 w-4" />
            Request bulk order
          </Link>
        }
      />

      <DashboardPanel title="Recurring order plans" className="p-5 sm:p-6">
        {table.total ? (
          <DashboardDataTable
            columns={orderColumns}
            rows={table.rows}
            minWidth={620}
          />
        ) : (
          <DashboardEmptyState
            title="No matching order plans"
            description="Try clearing the status or cadence filters to see the full recurring plan set."
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