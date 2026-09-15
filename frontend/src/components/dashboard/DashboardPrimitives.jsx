import React, { useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTableQuery } from "@/lib/useTableQuery";
import { getSectionBadgeForPath } from "@/lib/notifications";
import { useStoreVersion } from "@/lib/store-bus";

const toneClassMap = {
  success: "dashboard-status-success",
  warning: "dashboard-status-warning",
  danger: "dashboard-status-danger",
  info: "dashboard-status-info",
  neutral: "dashboard-status-neutral",
};

export function DashboardNavBadge({ count = 0, className = "" }) {
  if (!count) {
    return null;
  }

  return (
    <span
      className={`inline-flex h-[1.15rem] min-w-[1.15rem] items-center justify-center rounded-full bg-heritage px-1 font-sans text-[0.6rem] font-bold leading-none text-paper ${className}`}
      aria-label={`${count} items needing attention`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function DashboardBreadcrumbs({ items = [] } = {}) {
  const crumbs = items || [];
  if (!crumbs.length) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 font-sans text-xs"
    >
      {crumbs.map((item, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {index > 0 ? (
              <span className="text-stone-400 dark:text-stone-600">/</span>
            ) : null}
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="font-medium text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export function DashboardShortcuts({
  items = [],
  columns = 2,
  title = null,
  description = null,
}) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="dashboard-panel min-w-0 p-5 sm:p-6">
      {title ? (
        <div className="mb-5">
          <h2 className="font-sans text-sm font-semibold text-stone-900 dark:text-stone-100">
            {title}
          </h2>
          {description ? (
            <p className="dashboard-page-description mt-1 font-sans text-xs leading-4">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      <div
        className={`grid gap-3 sm:grid-cols-2 ${
          columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
        }`}
      >
        {items.map((item) => {
          const Icon = item.icon || ChevronRight;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="dashboard-shortcut group flex items-center gap-3"
            >
              <span className="dashboard-icon-badge flex h-10 w-10 shrink-0 items-center justify-center">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <span className="block font-sans text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {item.label}
                  </span>
                  <DashboardNavBadge count={item.badge} />
                </span>
                {item.description ? (
                  <span className="dashboard-page-description mt-0.5 block font-sans text-xs">
                    {item.description}
                  </span>
                ) : null}
              </span>
              <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-stone-400 transition-transform group-hover:translate-x-0.5 group-hover:text-stone-600 dark:text-stone-600 dark:group-hover:text-stone-300" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function DashboardRelatedLinks({ items = [], title = "Related links" }) {
  useStoreVersion();
  if (!items.length) {
    return null;
  }

  return (
    <div className="dashboard-subpanel min-w-0 px-4 py-3">
      <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        {title}
      </p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-stone-600 underline decoration-stone-300 underline-offset-2 transition-colors hover:text-stone-900 hover:decoration-stone-500 dark:text-stone-300 dark:hover:text-stone-100"
          >
            {item.label}
            <DashboardNavBadge
              count={item.badge ?? getSectionBadgeForPath(item.to)}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function DashboardPageHeader({
  eyebrow,
  title,
  description = null,
  action = null,
  breadcrumbs = null,
}) {
  return (
    <div className="dashboard-page-header">
      <DashboardBreadcrumbs items={breadcrumbs} />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {eyebrow ? (
            <p className="dashboard-page-eyebrow font-sans text-[0.65rem] font-bold uppercase tracking-[0.28em]">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="dashboard-page-description mt-2 max-w-2xl font-sans text-sm leading-5 sm:text-[0.9rem]">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}

export function DashboardPanel({
  title,
  description = null,
  children,
  className = "",
}) {
  return (
    <section className={`dashboard-panel min-w-0 p-5 sm:p-6 ${className}`.trim()}>
      {title ? (
        <div className="mb-4">
          <h2 className="font-sans text-sm font-semibold text-stone-900 dark:text-stone-100">
            {title}
          </h2>
          {description ? (
            <p className="dashboard-page-description mt-1 font-sans text-xs leading-4">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function DashboardMetricCard({
  label,
  value,
  detail = null,
  accent = false,
}) {
  return (
    <div
      className={`dashboard-kpi-card p-5 ${
        accent ? "dashboard-kpi-card-accent" : ""
      }`.trim()}
    >
      <p className="dashboard-kpi-label font-sans text-[0.68rem] font-bold uppercase tracking-[0.24em]">
        {label}
      </p>
      <p className="dashboard-kpi-value mt-3 font-sans text-3xl font-semibold tracking-tight">
        {value}
      </p>
      {detail ? (
        <p className="dashboard-kpi-detail mt-2 font-sans text-xs">{detail}</p>
      ) : null}
    </div>
  );
}

export function DashboardSplitMetricCard({
  title,
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  footer,
}) {
  return (
    <DashboardPanel title={title} className="h-full">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="dashboard-panel-soft p-4">
          <p className="dashboard-kpi-label font-sans text-[0.65rem] font-bold uppercase tracking-[0.22em]">
            {leftLabel}
          </p>
          <p className="dashboard-kpi-value mt-2 font-sans text-2xl font-semibold">
            {leftValue}
          </p>
        </div>
        <div className="dashboard-panel-soft p-4">
          <p className="dashboard-kpi-label font-sans text-[0.65rem] font-bold uppercase tracking-[0.22em]">
            {rightLabel}
          </p>
          <p className="dashboard-kpi-value mt-2 font-sans text-2xl font-semibold">
            {rightValue}
          </p>
        </div>
      </div>
      {footer ? (
        <p className="dashboard-page-description mt-4 font-sans text-xs leading-5">
          {footer}
        </p>
      ) : null}
    </DashboardPanel>
  );
}

export function DashboardStatusBadge({ label, tone = "neutral" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.18em] ${
        toneClassMap[tone] || toneClassMap.neutral
      }`}
    >
      {label}
    </span>
  );
}

export function DashboardFactList({ items = [] }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
            {item.label}
          </p>
          <div className="mt-1.5 font-sans text-sm font-medium leading-5 text-stone-900 dark:text-stone-100">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardFilterBar({
  searchPlaceholder = "Search",
  filters = [],
  action = null,
  searchValue = "",
  onSearchChange = null,
  resultCount = null,
  filterGroups = [],
  activeFilters = {},
  onFilterChange = (key, value) => {},
  onClearFilters = null,
  filterOptions = {},
}) {
  const hasActiveFilters = Object.keys(activeFilters).some(
    (key) => Boolean(activeFilters[key]) && filterGroups.some((group) => group.key === key),
  );

  return (
    <div className="dashboard-filter-bar flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
        <div className="dashboard-search-shell relative w-full max-w-md">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
          />
          {onSearchChange ? (
            <input
              type="search"
              role="searchbox"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent py-2.5 pl-10 pr-3 font-sans text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none dark:text-stone-100"
            />
          ) : (
            <div
              aria-label={`Filter placeholder: ${searchPlaceholder}`}
              className="w-full py-2.5 pl-10 pr-3 font-sans text-sm text-stone-500"
            >
              {searchPlaceholder}
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filterGroups.length ? (
            <>
              {filterGroups.map((group) => {
                const options = group.options || filterOptions[group.key] || [];
                const selected = activeFilters[group.key] || "";
                const isActive = Boolean(selected);
                return (
                  <label
                    key={group.key}
                    className={`dashboard-filter-pill inline-flex items-center gap-1.5 px-2.5 py-2 ${
                      isActive ? "ring-1 ring-inset ring-stone-700/20" : ""
                    }`.trim()}
                  >
                    <span className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.16em] text-stone-400">
                      {group.label}
                    </span>
                    <select
                      value={selected}
                      onChange={(event) =>
                        onFilterChange(group.key, event.target.value)
                      }
                      className="bg-transparent font-sans text-xs font-semibold text-stone-700 focus:outline-none dark:text-stone-200"
                    >
                      <option value="">All</option>
                      {options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                );
              })}
              {hasActiveFilters && onClearFilters ? (
                <button
                  type="button"
                  onClick={onClearFilters}
                  className="inline-flex items-center gap-1 rounded-full border border-stone-300 bg-white px-3 py-2 font-sans text-xs font-medium text-stone-600 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </button>
              ) : null}
            </>
          ) : null}
          {resultCount != null ? (
            <span className="dashboard-filter-pill inline-flex items-center px-3 py-2 font-sans text-xs font-medium">
              {resultCount} {resultCount === 1 ? "result" : "results"}
            </span>
          ) : null}
          {filters.map((filter) => (
            <span
              key={filter}
              className="dashboard-filter-pill inline-flex items-center px-3 py-2 font-sans text-xs font-medium"
            >
              {filter}
            </span>
          ))}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function DashboardChartPanel({
  title,
  description = null,
  data = [],
}) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <DashboardPanel title={title} description={description} className="h-full">
      <div className="flex min-h-[220px] items-end gap-3">
        {data.map((item) => (
          <div
            key={item.label}
            className="flex flex-1 flex-col items-center gap-3"
          >
            <div className="dashboard-chart-shell flex h-40 w-full items-end justify-center p-2">
              <div
                className={`w-full ${
                  item.tone === "accent"
                    ? "dashboard-chart-bar-accent"
                    : "dashboard-chart-bar"
                }`}
                style={{ height: `${Math.max((item.value / maxValue) * 100, 12)}%` }}
              />
            </div>
            <div className="text-center">
              <p className="font-sans text-xs font-semibold text-stone-900 dark:text-stone-100">
                {item.label}
              </p>
              <p className="dashboard-page-description font-sans text-[0.7rem]">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}

export function DashboardPagination({
  page,
  pageCount,
  total,
  pageSize = 5,
  onPageChange,
}) {
  if (pageCount <= 1) {
    return null;
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-stone-200/80 pt-4 sm:flex-row dark:border-stone-700/80">
      <p className="font-sans text-xs text-stone-500 dark:text-stone-400">
        Showing {start}–{end} of {total} results
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-3 py-1.5 font-sans text-[0.66rem] font-bold uppercase tracking-[0.14em] text-stone-600 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </button>
        <span className="font-sans text-xs text-stone-500 dark:text-stone-400">
          Page {page} of {pageCount}
        </span>
        <button
          type="button"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-3 py-1.5 font-sans text-[0.66rem] font-bold uppercase tracking-[0.14em] text-stone-600 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function DashboardDataTable({
  columns = [],
  rows = [],
  minWidth = 620,
  className = "",
}) {
  const primaryIndex = Math.max(
    0,
    columns.findIndex(
      (column) => column.primary && !column.hideOnMobile,
    ),
  );
  const primaryColumn = columns[primaryIndex] || { key: "", label: "" };
  const detailColumns = columns.filter(
    (column, index) => index !== primaryIndex && !column.hideOnMobile,
  );

  const renderCell = (column, row) =>
    column.render ? column.render(row[column.key], row) : row[column.key];

  return (
    <div className={className}>
      <div className="dashboard-table-wrap hidden md:block">
        <table className="w-full" style={{ minWidth }}>
          <thead>
            <tr className="border-b border-stone-200/80 dark:border-stone-700/80">
              {columns.map((column) => (
                <th
                  key={column.key || column.label}
                  className="py-3 text-left font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="dashboard-table-row border-b last:border-b-0"
              >
                {columns.map((column) => (
                  <td
                    key={column.key || column.label}
                    className="py-3 font-sans text-sm text-stone-700 dark:text-stone-300"
                  >
                    {renderCell(column, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="dashboard-mobile-list md:hidden">
        {rows.map((row, rowIndex) => (
          <li key={row.id || rowIndex}>
            <div className="dashboard-mobile-list-title font-sans text-[0.95rem] font-semibold leading-snug">
              {renderCell(primaryColumn, row)}
            </div>
            {detailColumns.length ? (
              <dl className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2.5">
                {detailColumns.map((column) => (
                  <div key={column.key || column.label}>
                    <dt className="dashboard-mobile-list-label font-sans text-[0.62rem] font-bold uppercase tracking-[0.16em]">
                      {column.label}
                    </dt>
                    <dd className="dashboard-mobile-list-value mt-1 font-sans text-sm leading-5">
                      {renderCell(column, row)}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DashboardActivityTable({
  title,
  description = null,
  columns = [],
  rows = [],
  searchPlaceholder = null,
  matchesSearch = null,
  pageSize = 5,
}) {
  const [query, setQuery] = useState("");
  const table = useTableQuery({
    rows,
    query: matchesSearch && searchPlaceholder ? query : "",
    predicate: matchesSearch,
    pageSize,
  });

  return (
    <DashboardPanel title={title} description={description} className="h-full">
      {matchesSearch && searchPlaceholder ? (
        <div className="dashboard-search-shell relative mb-4 max-w-sm">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
          />
          <input
            type="search"
            role="searchbox"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-transparent py-2.5 pl-10 pr-3 font-sans text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none dark:text-stone-100"
          />
        </div>
      ) : null}
      <DashboardDataTable columns={columns} rows={table.rows} minWidth={620} />
      <DashboardPagination
        page={table.page}
        pageCount={table.pageCount}
        total={table.total}
        pageSize={pageSize}
        onPageChange={table.setPage}
      />
    </DashboardPanel>
  );
}

export function DashboardTimeline({
  title,
  description = null,
  items = [],
}) {
  return (
    <DashboardPanel title={title} description={description}>
      <div className="space-y-0">
        {items.map((item, index) => (
          <div key={item.label} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`dashboard-timeline-node flex h-9 w-9 items-center justify-center ${
                  item.completed ? "dashboard-timeline-node-active" : ""
                }`.trim()}
              >
                <item.icon className="h-4 w-4" />
              </div>
              {index < items.length - 1 ? (
                <div className="dashboard-timeline-line h-8 w-px" />
              ) : null}
            </div>
            <div className="pb-5">
              <div className="flex items-center gap-3">
                <p className="font-sans text-sm font-semibold text-stone-900 dark:text-stone-100">
                  {item.label}
                </p>
                {item.badge ? item.badge : null}
              </div>
              <p className="dashboard-page-description mt-1 font-sans text-sm leading-6">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}

export function DashboardEmptyState({
  title,
  description = null,
  action = null,
}) {
  return (
    <div className="dashboard-empty-state px-6 py-10 text-center">
      <h3 className="font-sans text-lg font-semibold text-stone-900 dark:text-stone-100">
        {title}
      </h3>
      <p className="dashboard-page-description mx-auto mt-3 max-w-xl font-sans text-sm leading-6">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
