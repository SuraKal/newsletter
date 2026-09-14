import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, PenSquare, Truck } from "lucide-react";
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
import {
  getAdminScheduleRows,
  getRawArticleById,
  saveArticle,
} from "@/lib/content-store";

const createScheduleColumns = (handleRelease) => [
  { key: "slot", label: "Publish slot" },
  { key: "sector", label: "Sector" },
  {
    key: "headline",
    label: "Headline",
    primary: true,
    render: (value, row) => (
      <Link
        to={`/admin/content/${row.id}`}
        className="font-semibold text-stone-900 hover:text-heritage dark:text-stone-100"
      >
        {value}
      </Link>
    ),
  },
  {
    key: "status",
    label: "State",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
  { key: "release", label: "Release step" },
  {
    key: "action",
    label: "Action",
    render: (value, row) => {
      const action = nextReleaseAction(row.status);
      return action ? (
        <button
          type="button"
          onClick={() => handleRelease(row.id, action.next)}
          className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-3 py-1.5 font-sans text-[0.66rem] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-heritage"
        >
          <Check className="h-3.5 w-3.5" />
          {action.label}
        </button>
      ) : (
        <span className="font-sans text-xs text-stone-400">Released</span>
      );
    },
  },
];

const nextReleaseAction = (status) => {
  if (status === "Draft" || status === "Needs review") {
    return { label: "Approve release", next: "Scheduled" };
  }

  if (status === "Scheduled") {
    return { label: "Publish now", next: "Published" };
  }

  return null;
};

const matchesSearch = (row, query) =>
  [row.slot, row.sector, row.headline, row.status, row.release].some(
    (value) => String(value ?? "").toLowerCase().includes(query),
  );

const scheduleFilterGroups = [
  { key: "sector", label: "Sector" },
  { key: "status", label: "State" },
];

const relatedLinks = [
  { label: "Content", to: "/admin/content" },
  { label: "Subscribers", to: "/admin/subscribers" },
  { label: "Companies", to: "/admin/companies" },
  { label: "Shipments", to: "/admin/shipments" },
  { label: "Governance", to: "/admin/governance" },
  { label: "Pricing", to: "/admin/pricing" },
];

export default function AdminSchedule() {
  const adminScheduleRows = getAdminScheduleRows();
  const [query, setQuery] = useState("");
  const [, setRevision] = useState(0);
  const { activeFilters, setFilter, clearFilters } = useTableFilters();
  const table = useTableQuery({
    rows: adminScheduleRows,
    query,
    predicate: matchesSearch,
    activeFilters,
    filterGroups: scheduleFilterGroups,
  });

  const handleRelease = (articleId, nextStatus) => {
    const raw = getRawArticleById(articleId);
    if (!raw) return;
    saveArticle({ ...raw, status: nextStatus });
    setRevision((value) => value + 1);
  };

  const scheduleColumns = createScheduleColumns(handleRelease);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin schedule"
        title="Scheduled publishing"
        description="Review upcoming release slots and coordination status."
        breadcrumbs={[
          { label: "Admin workspace", to: "/admin/overview" },
          { label: "Schedule" },
        ]}
        action={
          <Link
            to="/admin/content/new"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Draft new article
            <PenSquare className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search release slot, sector, or headline"
        searchValue={query}
        onSearchChange={setQuery}
        resultCount={query.trim() || table.hasActiveFilters ? table.total : null}
        filterGroups={scheduleFilterGroups}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        filterOptions={table.filterOptions}
        filters={["8 scheduled items", "3 print-linked releases", "2 review holds"]}
        action={
          <Link
            to="/admin/shipments"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Check route timing
            <Truck className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardPanel title="Scheduled publishing queue" className="p-5 sm:p-6">
        {table.total ? (
          <>
            <DashboardDataTable
              columns={scheduleColumns}
              rows={table.rows}
              minWidth={860}
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
            title="No matching schedule items"
            description="Try clearing the sector or state filters to see the full release queue."
          />
        )}
      </DashboardPanel>

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}