import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, MailPlus } from "lucide-react";
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
  getBusinessTeamRows,
  updateBusinessTeamMember,
} from "@/lib/business-ops-store";

const createTeamColumns = (handleActivate) => [
  { key: "name", label: "Team member", primary: true },
  { key: "role", label: "Role" },
  { key: "scope", label: "Scope" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
  {
    key: "action",
    label: "Action",
    render: (value, row) =>
      row.status === "Pending" ? (
        <button
          type="button"
          onClick={() => handleActivate(row.id)}
          className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-3 py-1.5 font-sans text-[0.66rem] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-heritage"
        >
          <Check className="h-3.5 w-3.5" />
          Activate seat
        </button>
      ) : (
        <span className="font-sans text-xs text-stone-400">Active</span>
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
  const [, setRevision] = useState(0);
  const { activeFilters, setFilter, clearFilters } = useTableFilters();
  const table = useTableQuery({
    rows: getBusinessTeamRows(),
    query,
    predicate: matchesSearch,
    activeFilters,
    filterGroups: teamFilterGroups,
  });

  const handleActivate = (memberId) => {
    updateBusinessTeamMember(memberId, {
      status: "Active",
      tone: "success",
    });
    setRevision((value) => value + 1);
  };

  const teamColumns = createTeamColumns(handleActivate);

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
          <DashboardDataTable
            columns={teamColumns}
            rows={table.rows}
            minWidth={620}
          />
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