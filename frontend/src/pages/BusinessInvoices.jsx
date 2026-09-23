import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReceiptText, ShieldCheck } from "lucide-react";
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

const invoiceColumns = [
  {
    key: "invoice",
    label: "Invoice",
    primary: true,
    render: (value, row) => (
      <Link
        to={`/business-dashboard/invoices/${row.id}`}
        className="font-medium text-stone-900 transition-colors hover:text-heritage dark:text-stone-100"
      >
        {value}
      </Link>
    ),
  },
  { key: "scope", label: "Scope" },
  {
    key: "sourceType",
    label: "Source",
    render: (value, row) => {
      if (row.sourceType === "bulk_order") {
        return (
          <Link
            to={`/business-dashboard/orders/${row.sourceId}`}
            className="font-sans text-xs font-semibold text-heritage transition-colors hover:text-stone-900 dark:hover:text-stone-100"
          >
            Bulk order
          </Link>
        );
      }
      if (row.sourceType === "subscription") {
        return (
          <span className="font-sans text-xs font-semibold text-stone-500">
            Subscription
          </span>
        );
      }
      return <span className="font-sans text-xs text-stone-400">—</span>;
    },
  },
  { key: "amount", label: "Amount" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
];

const matchesSearch = (row, query) =>
  [row.invoice, row.scope, row.amount, row.status, row.date].some((value) =>
    String(value ?? "").toLowerCase().includes(query),
  );

const invoiceFilterGroups = [{ key: "status", label: "Status" }];

const relatedLinks = [
  { label: "Team", to: "/business-dashboard/team" },
  { label: "Orders", to: "/business-dashboard/orders" },
  { label: "Locations", to: "/business-dashboard/locations" },
  { label: "Shipments", to: "/business-dashboard/shipments" },
  { label: "Settings", to: "/business-dashboard/settings" },
];

const buildSnapshot = (rows) => {
  const billable = rows.filter((row) =>
    ["Upcoming", "Review"].includes(row.status),
  );
  const next = billable.length
    ? billable
        .slice()
        .sort((a, b) => (a.date || "").localeCompare(b.date || ""))[0]
    : null;
  const hasContract = rows.some((row) => row.sourceType === "subscription");
  return [
    {
      label: "Next invoice",
      value: next?.date || "Awaiting billing cycle",
    },
    {
      label: "Expected amount",
      value: (next && next.amount !== "Contract billing") ? next.amount : "Contract billing",
    },
    {
      label: "Billing model",
      value: hasContract ? "Contract + order billing" : "Consolidated order billing",
    },
  ];
};

const hasContractLabel = (rows) =>
  rows.some((row) => row.sourceType === "subscription")
    ? "Contract billing active"
    : "Order-scope billing";

export default function BusinessInvoices() {
  const [query, setQuery] = useState("");
  const [invoices, setInvoices] = useState(() => appClient.invoices.list());
  const { activeFilters, setFilter, clearFilters } = useTableFilters();

  const reloadInvoices = async () => {
    const rows = await appClient.invoices.refresh();
    if (Array.isArray(rows)) setInvoices(rows);
  };

  useEffect(() => {
    reloadInvoices();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const table = useTableQuery({
    rows: invoices,
    query,
    predicate: matchesSearch,
    activeFilters,
    filterGroups: invoiceFilterGroups,
  });

  const snapshotRows = buildSnapshot(invoices);
  const reviewCount = invoices.filter(
    (row) => row.status === "Review",
  ).length;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business invoices"
        title="Invoice records"
        description="Invoices are generated from approved bulk orders and your active subscription contract."
        breadcrumbs={[
          { label: "Business workspace", to: "/business-dashboard/overview" },
          { label: "Invoices" },
        ]}
        action={
          <Link
            to="/business-dashboard/orders"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Review order scope
            <ReceiptText className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search invoice, purchase order, or billing note"
        searchValue={query}
        onSearchChange={setQuery}
        resultCount={query.trim() || table.hasActiveFilters ? table.total : null}
        filterGroups={invoiceFilterGroups}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        filterOptions={table.filterOptions}
        filters={[
          "Linked to approved orders",
          hasContractLabel(invoices),
          reviewCount ? `${reviewCount} review note${reviewCount > 1 ? "s" : ""}` : "No review follow-ups",
        ]}
        action={
          <Link
            to="/business-dashboard/team"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Billing contacts
            <ShieldCheck className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardPanel title="Current billing snapshot" className="p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
          {snapshotRows.map((row) => (
            <div key={row.label}>
              <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
                {row.label}
              </p>
              <p className="mt-1.5 font-sans text-base font-semibold text-stone-900 dark:text-stone-100">
                {row.value}
              </p>
            </div>
          ))}
        </div>
      </DashboardPanel>

      <DashboardPanel title="Invoice history" className="p-5 sm:p-6">
        {table.total ? (
          <DashboardDataTable
            columns={invoiceColumns}
            rows={table.rows}
            minWidth={620}
          />
        ) : (
          <DashboardEmptyState
            title="No matching invoices"
            description="Try clearing the status filter to see the full invoice history."
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