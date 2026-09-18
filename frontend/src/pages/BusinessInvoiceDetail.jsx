import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import {
  DashboardEmptyState,
  DashboardFactList,
  DashboardPageHeader,
  DashboardPanel,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { appClient } from "@/api/appClient";

const relatedLinks = [
  { label: "Team", to: "/business-dashboard/team" },
  { label: "Orders", to: "/business-dashboard/orders" },
  { label: "Locations", to: "/business-dashboard/locations" },
  { label: "Shipments", to: "/business-dashboard/shipments" },
  { label: "Settings", to: "/business-dashboard/settings" },
];

export default function BusinessInvoiceDetail() {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(() =>
    appClient.invoices.getLocal(invoiceId),
  );
  const [busy, setBusy] = useState(false);

  const loadInvoice = async () => {
    const result = await appClient.invoices.get(invoiceId);
    setInvoice(result);
  };

  useEffect(() => {
    loadInvoice();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId]);

  const needsConfirmation = invoice && invoice.status === "Review";

  const handleConfirm = async () => {
    if (!invoice) return;
    setBusy(true);
    try {
      const row = await appClient.invoices.confirm(invoice.id);
      if (row) setInvoice(row);
      await loadInvoice();
    } catch {
      // Leave the record in place; the next refresh reconciles the state.
    } finally {
      setBusy(false);
    }
  };

  if (!invoice) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          eyebrow="Business invoices"
          title="Invoice not found"
          breadcrumbs={[
            { label: "Business workspace", to: "/business-dashboard/overview" },
            { label: "Invoices", to: "/business-dashboard/invoices" },
          ]}
          action={
            <Link
              to="/business-dashboard/invoices"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to invoices
            </Link>
          }
        />
        <DashboardPanel title="Invoice records">
          <DashboardEmptyState title="No invoice matches this ID." />
        </DashboardPanel>
        <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business invoice"
        title={invoice.invoice}
        description="Invoice record and billing follow-up."
        breadcrumbs={[
          { label: "Business workspace", to: "/business-dashboard/overview" },
          { label: "Invoices", to: "/business-dashboard/invoices" },
          { label: invoice.invoice },
        ]}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/business-dashboard/invoices"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to invoices
            </Link>
            {needsConfirmation ? (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-100 dark:text-stone-900"
              >
                <Check className="h-4 w-4" />
                Confirm VAT note
              </button>
            ) : null}
          </div>
        }
      />

      <DashboardPanel title="Invoice facts" className="p-5 sm:p-6">
        <DashboardFactList
          items={[
            { label: "Scope", value: invoice.scope },
            { label: "Amount", value: invoice.amount },
            { label: "Date", value: invoice.date },
            {
              label: "Status",
              value: (
                <DashboardStatusBadge label={invoice.status} tone={invoice.tone} />
              ),
            },
          ]}
        />
      </DashboardPanel>

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}