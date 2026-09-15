import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CirclePlus } from "lucide-react";
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
import { getAdminContentRows, getPlacementLabel } from "@/lib/content-store";

const contentColumns = [
  {
    key: "image",
    label: "",
    hideOnMobile: true,
    render: (value, row) =>
      value ? (
        <img
          src={value}
          alt={row.headline}
          className="h-10 w-16 rounded-sm object-cover"
        />
      ) : (
        <span className="inline-flex h-10 w-16 items-center justify-center rounded-sm bg-stone-100 text-[0.6rem] font-semibold uppercase tracking-widest text-stone-400 dark:bg-stone-800">
          None
        </span>
      ),
  },
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
    key: "source",
    label: "Placement",
    render: (value) => getPlacementLabel(value),
  },
  { key: "category", label: "Category" },
  {
    key: "status",
    label: "State",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
];

const matchesSearch = (row, query) =>
  [row.headline, getPlacementLabel(row.source), row.category, row.status].some(
    (value) => String(value ?? "").toLowerCase().includes(query),
  );

const contentFilterGroups = [
  { key: "category", label: "Category" },
  { key: "status", label: "State" },
];

const relatedLinks = [
  { label: "Schedule", to: "/admin/schedule" },
  { label: "Subscribers", to: "/admin/subscribers" },
  { label: "Companies", to: "/admin/companies" },
  { label: "Shipments", to: "/admin/shipments" },
  { label: "Governance", to: "/admin/governance" },
  { label: "Pricing", to: "/admin/pricing" },
];

export default function AdminContentList() {
  const adminContentRows = getAdminContentRows();
  const [query, setQuery] = useState("");
  const { activeFilters, setFilter, clearFilters } = useTableFilters();
  const table = useTableQuery({
    rows: adminContentRows,
    query,
    predicate: matchesSearch,
    activeFilters,
    filterGroups: contentFilterGroups,
  });

  const draftCount = adminContentRows.filter(
    (row) => row.status === "Draft",
  ).length;
  const scheduledCount = adminContentRows.filter(
    (row) => row.status === "Scheduled",
  ).length;
  const publishedCount = adminContentRows.filter(
    (row) => row.status === "Published",
  ).length;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin content"
        title="Publishing queue"
        description="Review drafts, scheduled items, and live pieces. Placement mirrors exactly where each story appears on the public site."
        breadcrumbs={[
          { label: "Admin workspace", to: "/admin/overview" },
          { label: "Content" },
        ]}
        action={
          <Link
            to="/admin/content/new"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            New article
            <CirclePlus className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search headline, placement, or category"
        searchValue={query}
        onSearchChange={setQuery}
        resultCount={query.trim() || table.hasActiveFilters ? table.total : null}
        filterGroups={contentFilterGroups}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        filterOptions={table.filterOptions}
        filters={[
          `${draftCount} drafts`,
          `${scheduledCount} scheduled`,
          `${publishedCount} published`,
        ]}
        action={
          <Link
            to="/admin/schedule"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Open schedule
            <CalendarDays className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardPanel title="Article queue" className="p-5 sm:p-6">
        {table.total ? (
          <>
            <DashboardDataTable
              columns={contentColumns}
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
            title="No matching articles"
            description="Try clearing the category or state filters to see the full publishing queue."
          />
        )}
      </DashboardPanel>

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}