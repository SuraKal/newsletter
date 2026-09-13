import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
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
import { appClient } from "@/api/appClient";

const statusTone = {
  Queued: "info",
  "In progress": "info",
  "Under review": "warning",
  "Review required": "warning",
  Completed: "success",
};

const nextActionFor = (status) => {
  if (status === "Queued") {
    return { label: "Start processing", next: "In progress" };
  }

  if (status === "In progress") {
    return { label: "Mark complete", next: "Completed" };
  }

  if (status === "Review required") {
    return { label: "Start review", next: "Under review" };
  }

  if (status === "Under review") {
    return { label: "Mark complete", next: "Completed" };
  }

  return null;
};

const matchesSearch = (row, query) =>
  [
    row.type,
    row.scopeLabel,
    row.status,
    row.date,
    row.notes,
    row.requester?.name,
    row.requester?.email,
  ].some((value) => String(value ?? "").toLowerCase().includes(query));

const governanceFilterGroups = [
  { key: "status", label: "Status" },
  { key: "type", label: "Request type" },
  { key: "scopeLabel", label: "Scope" },
];

const relatedLinks = [
  { label: "Content", to: "/admin/content" },
  { label: "Companies", to: "/admin/companies" },
  { label: "Subscribers", to: "/admin/subscribers" },
  { label: "Shipments", to: "/admin/shipments" },
  { label: "Pricing", to: "/admin/pricing" },
];

export default function AdminGovernance() {
  const [requests, setRequests] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState("");
  const { activeFilters, setFilter, clearFilters } = useTableFilters();
  const table = useTableQuery({
    rows: requests,
    query,
    predicate: matchesSearch,
    activeFilters,
    filterGroups: governanceFilterGroups,
  });

  const refreshRequests = useCallback(async () => {
    try {
      const nextRequests = await appClient.admin.listGovernanceRequests();
      setRequests(nextRequests);
      setActionError("");
    } catch (error) {
      setActionError(error.message || "The governance queue could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshRequests();
  }, [refreshRequests]);

  const handleAdvance = async (requestId, nextStatus) => {
    setActionError("");
    try {
      await appClient.admin.updateGovernanceRequestStatus(requestId, nextStatus);
      await refreshRequests();
    } catch (error) {
      setActionError(error.message || "The request could not be updated.");
    }
  };

  const openRequests = requests.filter(
    (request) => request.status !== "Completed",
  ).length;
  const completedRequests = requests.filter(
    (request) => request.status === "Completed",
  ).length;
  const companyRequests = requests.filter(
    (request) => request.scope === "company",
  ).length;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin governance"
        title="Data and privacy requests"
        description="Data exports and deletion reviews submitted by readers and company accounts appear here for processing."
        breadcrumbs={[
          { label: "Admin workspace", to: "/admin/overview" },
          { label: "Governance" },
        ]}
        action={
          <Link
            to="/privacy"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Privacy policy
            <ShieldCheck className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search request type, requester, or notes"
        searchValue={query}
        onSearchChange={setQuery}
        resultCount={query.trim() || table.hasActiveFilters ? table.total : null}
        filterGroups={governanceFilterGroups}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        filterOptions={table.filterOptions}
        filters={[
          `${openRequests} open requests`,
          `${completedRequests} completed`,
          `${companyRequests} company scoped`,
        ]}
      />

      <DashboardPanel
        title="Governance queue"
        description="Requests are listed newest first and move through processing until completed."
        className="p-5 sm:p-6"
      >
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
            <p className="font-sans text-sm text-stone-500">Loading requests...</p>
          </div>
        ) : requests.length && table.total ? (
          <div className="dashboard-table-wrap overflow-x-auto">
            <table className="w-full min-w-[840px]">
              <thead>
                <tr className="border-b border-stone-200/80 dark:border-stone-700/80">
                  {[
                    { label: "Requester" },
                    { label: "Request" },
                    { label: "Submitted" },
                    { label: "Notes" },
                    { label: "Status" },
                    { label: "Action" },
                  ].map((column) => (
                    <th
                      key={column.label}
                      className="py-3 text-left font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-stone-500"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((request) => {
                  const nextAction = nextActionFor(request.status);
                  return (
                    <tr
                      key={request.id}
                      className="border-b last:border-b-0"
                    >
                      <td className="py-3 pr-3">
                        <p className="font-sans text-sm font-semibold text-stone-900 dark:text-stone-100">
                          {request.requester?.name}
                        </p>
                        <p className="mt-0.5 font-sans text-xs text-stone-500">
                          {request.requester?.email}
                        </p>
                      </td>
                      <td className="py-3 pr-3">
                        <p className="font-sans text-sm text-stone-700 dark:text-stone-300">
                          {request.type}
                        </p>
                        <p className="mt-0.5 font-sans text-xs text-stone-500">
                          {request.scopeLabel}
                        </p>
                      </td>
                      <td className="py-3 pr-3">
                        <p className="font-sans text-sm text-stone-700 dark:text-stone-300">
                          {request.date}
                        </p>
                      </td>
                      <td className="py-3 pr-3">
                        <p className="max-w-xs font-body text-xs leading-relaxed text-stone-600 line-clamp-2 dark:text-stone-300">
                          {request.notes}
                        </p>
                      </td>
                      <td className="py-3 pr-3">
                        <DashboardStatusBadge
                          label={request.status}
                          tone={statusTone[request.status] || "neutral"}
                        />
                      </td>
                      <td className="py-3">
                        {nextAction ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleAdvance(request.id, nextAction.next)
                            }
                            className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-3 py-1.5 font-sans text-[0.66rem] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-heritage"
                          >
                            {nextAction.label}
                          </button>
                        ) : (
                          <span className="font-sans text-xs text-stone-400">
                            Resolved
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <DashboardEmptyState
            title={requests.length ? "No matching requests" : "No governance requests"}
            description={
              requests.length
                ? "Try clearing a search or filter to see the full governance queue."
                : "Data export and deletion requests submitted from the reader and business privacy workspaces will appear here for review and processing."
            }
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