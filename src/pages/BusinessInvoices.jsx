import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ReceiptText, ShieldCheck } from "lucide-react";
import {
  DashboardFilterBar,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPagination,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { useTableQuery } from "@/lib/useTableQuery";
import { businessInvoiceRows } from "@/lib/demoData";

const invoiceColumns = [
  { key: "invoice", label: "Invoice" },
  { key: "scope", label: "Scope" },
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
  [row.invoice, row.scope, row.amount, row.status].some((value) =>
    String(value ?? "").toLowerCase().includes(query),
  );

const relatedLinks = [
  { label: "Team", to: "/business-dashboard/team" },
  { label: "Orders", to: "/business-dashboard/orders" },
  { label: "Locations", to: "/business-dashboard/locations" },
  { label: "Shipments", to: "/business-dashboard/shipments" },
  { label: "Settings", to: "/business-dashboard/settings" },
];

const snapshotRows = [
  { label: "Next invoice", value: "September 1, 2026" },
  { label: "Expected amount", value: "EUR 8,950" },
  { label: "Billing model", value: "Monthly consolidated" },
];

export default function BusinessInvoices() {
  const [query, setQuery] = useState("");
  const table = useTableQuery({ rows: businessInvoiceRows, query, predicate: matchesSearch });

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business invoices"
        title="Invoice records"
        description="Review invoice status and billing follow-up."
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
        resultCount={query.trim() ? table.total : null}
        filters={["Monthly consolidated invoice", "VAT-aware billing", "1 follow-up note"]}
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
        <div className="dashboard-table-wrap overflow-x-auto">
          <table className="w-full min-w-[620px]">
            <thead>
              <tr className="border-b border-stone-200/80 dark:border-stone-700/80">
                {invoiceColumns.map((column) => (
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
                  {invoiceColumns.map((column) => (
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