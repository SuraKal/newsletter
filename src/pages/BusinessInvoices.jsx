import React from "react";
import { Link } from "react-router-dom";
import { ReceiptText, ShieldCheck } from "lucide-react";
import {
  DashboardActivityTable,
  DashboardFilterBar,
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardSplitMetricCard,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import {
  businessInvoiceMetrics,
  businessInvoiceRows,
} from "@/lib/demoData";

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
  { key: "date", label: "Date" },
];

export default function BusinessInvoices() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business invoices"
        title="Invoice records and billing follow-up"
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

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {businessInvoiceMetrics.map((metric) => (
          <DashboardMetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            accent={metric.accent}
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <DashboardSplitMetricCard
          title="Current billing snapshot"
          leftLabel="Next invoice"
          leftValue="September 1, 2026"
          rightLabel="Expected amount"
          rightValue="EUR 8,950"
          footer=""
        />
        <DashboardActivityTable
          title="Invoice history"
          columns={invoiceColumns}
          rows={businessInvoiceRows}
        />
      </section>

    </div>
  );
}
