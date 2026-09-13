import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MailPlus } from "lucide-react";
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
import { businessTeamRows } from "@/lib/demoData";

const teamColumns = [
  { key: "name", label: "Team member" },
  { key: "role", label: "Role" },
  { key: "scope", label: "Scope" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
];

const matchesSearch = (row, query) =>
  [row.name, row.role, row.scope, row.status].some((value) =>
    String(value ?? "").toLowerCase().includes(query),
  );

const teamFilterGroups = [
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
];

const relatedLinks = [
  { label: "Orders", to: "/business-dashboard/orders" },
  { label: "Invoices", to: "/business-dashboard/invoices" },
  { label: "Locations", to: "/business-dashboard/locations" },
  { label: "Shipments", to: "/business-dashboard/shipments" },
  { label: "Settings", to: "/business-dashboard/settings" },
];

export default function BusinessTeam() {
  const [query, setQuery] = useState("");
  const { activeFilters, setFilter, clearFilters } = useTableFilters();
  const table = useTableQuery({
    rows: businessTeamRows,
    query,
    predicate: matchesSearch,
    activeFilters,
    filterGroups: teamFilterGroups,
  });

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business team"
        title="Team access roster"
        description="Review who has access to the business workspace."
        breadcrumbs={[
          { label: "Business workspace", to: "/business-dashboard/overview" },
          { label: "Team" },
        ]}
        action={
          <Link
            to="/business-dashboard/settings"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Invite workflow
            <MailPlus className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search member, role, or location scope"
        searchValue={query}
        onSearchChange={setQuery}
        resultCount={query.trim() || table.hasActiveFilters ? table.total : null}
        filterGroups={teamFilterGroups}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        filterOptions={table.filterOptions}
        filters={["12 active seats", "1 pending invite", "Ops + finance roles"]}
      />

      <DashboardPanel title="Team members" className="p-5 sm:p-6">
        {table.total ? (
          <div className="dashboard-table-wrap overflow-x-auto">
            <table className="w-full min-w-[620px]">
              <thead>
                <tr className="border-b border-stone-200/80 dark:border-stone-700/80">
                  {teamColumns.map((column) => (
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
                    {teamColumns.map((column) => (
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
            title="No matching team members"
            description="Try clearing the role or status filters to see the full access roster."
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