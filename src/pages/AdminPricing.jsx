import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Truck } from "lucide-react";
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
import { useBusinessPricing } from "@/lib/business-pricing-catalog";
import AdminBusinessPricingCatalog from "@/components/dashboard/AdminBusinessPricingCatalog";

const pricingColumns = [
  { key: "tier", label: "Tier", primary: true },
  { key: "volume", label: "Volume band" },
  { key: "pricing", label: "Pricing label" },
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
  [row.tier, row.volume, row.pricing, row.billing, row.status].some((value) =>
    String(value ?? "").toLowerCase().includes(query),
  );

const pricingFilterGroups = [{ key: "status", label: "Status" }];

const relatedLinks = [
  { label: "Reader subscriptions", to: "/admin/subscriptions" },
  { label: "Content", to: "/admin/content" },
  { label: "Schedule", to: "/admin/schedule" },
  { label: "Subscribers", to: "/admin/subscribers" },
  { label: "Companies", to: "/admin/companies" },
  { label: "Shipments", to: "/admin/shipments" },
  { label: "Governance", to: "/admin/governance" },
];

export default function AdminPricing() {
  const [query, setQuery] = useState("");
  const businessPricing = useBusinessPricing();
  const { activeFilters, setFilter, clearFilters } = useTableFilters();
  const table = useTableQuery({
    rows: businessPricing,
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
        description="Manage company bulk-order pricing tiers, volume bands, invoice models, and delivery complexity. Company accounts still receive reader access; this workspace only controls their volume and operational rules."
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

      <AdminBusinessPricingCatalog />

      <DashboardFilterBar
        searchPlaceholder="Search tier, volume, pricing, or billing model"
        searchValue={query}
        onSearchChange={setQuery}
        resultCount={query.trim() || table.hasActiveFilters ? table.total : null}
        filterGroups={pricingFilterGroups}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        filterOptions={table.filterOptions}
        filters={[`${businessPricing.length} public tiers`, "Bulk ordering", "Company billing"]}
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
          <DashboardDataTable
            columns={pricingColumns}
            rows={table.rows}
            minWidth={620}
          />
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
