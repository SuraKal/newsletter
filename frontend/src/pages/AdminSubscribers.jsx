import React, { useCallback, useEffect, useState } from "react";
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
import { appClient } from "@/api/appClient";

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
  { label: "Order requests", to: "/admin/order-requests" },
];

export default function AdminSubscribers() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState("");
  const { activeFilters, setFilter, clearFilters } = useTableFilters();
  const table = useTableQuery({
    rows,
    query,
    predicate: matchesSearch,
    activeFilters,
    filterGroups: subscriberFilterGroups,
  });

  const refreshSubscribers = useCallback(async () => {
    try {
      const nextRows = await appClient.admin.subscribers.list();
      setRows(nextRows);
      setActionError("");
    } catch (error) {
      setActionError(error.message || "The subscriber list could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSubscribers();
  }, [refreshSubscribers]);

  const activeCount = rows.filter((row) => row.status === "Active").length;
  const reviewCount = rows.filter((row) => row.status === "Needs review").length;
  const watchCount = rows.filter((row) => row.status === "Renewal watch").length;

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
        filters={[
          `${activeCount} active`,
          `${reviewCount} review cases`,
          `${watchCount} renewal watch`,
        ]}
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
        {actionError ? (
          <div
            role="alert"
            className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 font-sans text-xs font-semibold text-red-700"
          >
            {actionError}
          </div>
        ) : null}

        {isLoading ? (
          <div className="dashboard-empty-state px-6 py-10 text-center">
            <p className="font-sans text-sm text-stone-500">
              Loading subscribers...
            </p>
          </div>
        ) : rows.length && table.total ? (
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
            title={rows.length ? "No matching subscribers" : "No subscribers"}
            description={
              rows.length
                ? "Try clearing the status or delivery filters to see the full subscriber list."
                : "Reader accounts and their subscription renewals will appear here once they register."
            }
          />
        )}
      </DashboardPanel>

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}
