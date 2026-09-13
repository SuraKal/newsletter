import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Truck } from "lucide-react";
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
import { adminPricingRows } from "@/lib/demoData";

const pricingColumns = [
  { key: "tier", label: "Tier" },
  { key: "volume", label: "Volume band" },
  { key: "billing", label: "Billing model" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
];

const matchesSearch = (row, query) =>
  [row.tier, row.volume, row.billing, row.status].some((value) =>
    String(value ?? "").toLowerCase().includes(query),
  );

const pricingFilterGroups = [{ key: "status", label: "Status" }];

const relatedLinks = [
  { label: "Content", to: "/admin/content" },
  { label: "Schedule", to: "/admin/schedule" },
  { label: "Subscribers", to: "/admin/subscribers" },
  { label: "Companies", to: "/admin/companies" },
  { label: "Shipments", to: "/admin/shipments" },
  { label: "Governance", to: "/admin/governance" },
];

export default function AdminPricing() {
  const [query, setQuery] = useState("");
  const { activeFilters, setFilter, clearFilters } = useTableFilters();
  const table = useTableQuery({
    rows: adminPricingRows,
    query,
    predicate: matchesSearch,
    activeFilters,
    filterGroups: pricingFilterGroups,
  });

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin pricing"
        title="Pricing tier matrix"
        description="Review business pricing tiers and volume bands."
        breadcrumbs={[
          { label: "Admin workspace", to: "/admin/overview" },
          { label: "Pricing" },
        ]}
        action={
          <Link
            to="/admin/companies"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Company accounts
            <Building2 className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search tier, volume band, or billing model"
        searchValue={query}
        onSearchChange={setQuery}
        resultCount={query.trim() || table.hasActiveFilters ? table.total : null}
        filterGroups={pricingFilterGroups}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        filterOptions={table.filterOptions}
        filters={["3 pricing bands", "12 cross-border contracts", "6 reviews in progress"]}
        action={
          <Link
            to="/admin/shipments"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Route complexity
            <Truck className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardPanel title="Pricing tier matrix" className="p-5 sm:p-6">
        {table.total ? (
          <div className="dashboard-table-wrap overflow-x-auto">
            <table className="w-full min-w-[620px]">
              <thead>
                <tr className="border-b border-stone-200/80 dark:border-stone-700/80">
                  {pricingColumns.map((column) => (
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
                    {pricingColumns.map((column) => (
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
            title="No matching pricing tiers"
            description="Try clearing the status filter to see the full pricing band matrix."
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