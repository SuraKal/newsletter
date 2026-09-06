import React from "react";
import { Link } from "react-router-dom";
import { Mail, ReceiptText, ShieldCheck } from "lucide-react";
import {
  DashboardActivityTable,
  DashboardFilterBar,
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardPanel,
  DashboardSplitMetricCard,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import {
  businessContactCards,
  businessInvoiceMetrics,
  businessInvoiceRows,
  businessPricingNotes,
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
        description="Commercial billing should be searchable, contract-aware, and easy to separate from reader-style self-serve renewals."
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
            detail={metric.detail}
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
          footer="The business account remains on invoice-based billing rather than the self-serve monthly or yearly reader cycle."
        />
        <DashboardActivityTable
          title="Invoice history"
          description="Invoice records should stay organized in their own operational table instead of being compressed into one overview card."
          columns={invoiceColumns}
          rows={businessInvoiceRows}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <DashboardPanel
          title="Billing contacts and support paths"
          description="Keep invoice follow-up clear so account owners know which commercial or finance path to use."
          className="h-full"
        >
          <div className="space-y-4">
            {businessContactCards.map((card) => (
              <Link
                key={card.title}
                to={card.href.startsWith("/") ? card.href : "#"}
                className="block rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4 transition hover:border-stone-300 hover:bg-white"
              >
                <div className="flex items-start gap-3">
                  <div className="dashboard-icon-badge flex h-10 w-10 items-center justify-center">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-900 dark:text-stone-100">
                      {card.title}
                    </p>
                    <p className="mt-2 font-sans text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {card.detail}
                    </p>
                    <p className="dashboard-page-description mt-2 font-sans text-xs leading-5">
                      {card.note}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel
          title="Invoice and pricing notes"
          description="Billing policy belongs here so the overview and shipment pages stay focused on their own jobs."
          className="h-full"
        >
          <div className="space-y-4">
            {businessPricingNotes.map((item) => (
              <div
                key={item}
                className="rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4"
              >
                <p className="font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </DashboardPanel>
      </section>
    </div>
  );
}
