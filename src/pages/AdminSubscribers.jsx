import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Truck, Users } from "lucide-react";
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
import { getSubscriberRows } from "@/lib/subscriber-store";

const subscriberColumns = [
  {
    key: "name",
    label: "Subscriber",
    primary: true,
    render: (value, row) => (
      <Link
        to={`/admin/subscribers/${row.id}`}
        className="font-medium text-stone-900 transition-colors hover:text-heritage dark:text-stone-100"
      >
        {value}
      </Link>
    ),
  },
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

const matchesSearch = (row, query) =>
  [row.name, row.plan, row.renewal, row.status].some((value) =>
    String(value ?? "").toLowerCase().includes(query),
  );

const subscriberFilterGroups = [
  { key: "status", label: "Status" },
  { key: "deliveryEligibility", label: "Delivery" },
];

const relatedLinks = [
  { label: "Content", to: "/admin/content" },
  { label: "Schedule", to: "/admin/schedule" },
  { label: "Companies", to: "/admin/companies" },
  { label: "Shipments", to: "/admin/shipments" },
  { label: "Governance", to: "/admin/governance" },
  { label: "Pricing", to: "/admin/pricing" },
];

export default function AdminSubscribers() {
  const [query, setQuery] = useState("");
  const { activeFilters, setFilter, clearFilters } = useTableFilters();
  const table = useTableQuery({
    rows: getSubscriberRows(),
    query,
    predicate: matchesSearch,
    activeFilters,
    filterGroups: subscriberFilterGroups,
  });

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
        searchValue={query}
        onSearchChange={setQuery}
        resultCount={query.trim() || table.hasActiveFilters ? table.total : null}
        filterGroups={subscriberFilterGroups}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        filterOptions={table.filterOptions}
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
        {table.total ? (
          <>
            <DashboardDataTable
              columns={subscriberColumns}
              rows={table.rows}
              minWidth={620}
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
            title="No matching subscribers"
            description="Try clearing the status or delivery filters to see the full subscriber list."
          />
        )}
      </DashboardPanel>

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}