import React from "react";
import { Building2, FileText, Globe2, MapPinned, ReceiptText } from "lucide-react";

export default function BusinessRequestSummary({ form, selectedRequestType }) {
  return (
    <aside className="rounded-[1.5rem] border border-stone-300/60 bg-vellum p-6 shadow-[0_16px_38px_rgba(0,0,0,0.04)]">
      <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em] text-heritage">
        Quote request summary
      </p>
      <h2 className="mt-3 font-display text-2xl font-black text-ink">
        {form.organizationName || "Business onboarding"}
      </h2>
      <p className="mt-2 font-body text-sm leading-6 text-redacted">
        The company path captures operational details before any contract or dashboard activation work begins.
      </p>

      <div className="newspaper-rule my-6" />

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Building2 className="mt-1 h-4 w-4 text-heritage" />
          <div>
            <p className="font-sans text-[0.64rem] font-bold uppercase tracking-[0.2em] text-redacted">
              Request type
            </p>
            <p className="mt-1 font-body text-sm text-ink">{selectedRequestType}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Globe2 className="mt-1 h-4 w-4 text-heritage" />
          <div>
            <p className="font-sans text-[0.64rem] font-bold uppercase tracking-[0.2em] text-redacted">
              Country scope
            </p>
            <p className="mt-1 font-body text-sm text-ink">{form.countryScope}</p>
            <p className="font-body text-sm text-redacted">
              Belgium and Germany rollout expectations can affect billing and fulfillment.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPinned className="mt-1 h-4 w-4 text-heritage" />
          <div>
            <p className="font-sans text-[0.64rem] font-bold uppercase tracking-[0.2em] text-redacted">
              Fulfillment
            </p>
            <p className="mt-1 font-body text-sm text-ink">
              {form.expectedCopies || "TBD"} copies, {form.deliveryLocations || "TBD"} locations
            </p>
            <p className="font-body text-sm text-redacted">
              Launch timeline: {form.launchTimeline}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ReceiptText className="mt-1 h-4 w-4 text-heritage" />
          <div>
            <p className="font-sans text-[0.64rem] font-bold uppercase tracking-[0.2em] text-redacted">
              Billing preference
            </p>
            <p className="mt-1 font-body text-sm text-ink">{form.billingPreference}</p>
            <p className="font-body text-sm text-redacted">
              VAT, invoice structure, and PO expectations can be confirmed during follow-up.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FileText className="mt-1 h-4 w-4 text-heritage" />
          <div>
            <p className="font-sans text-[0.64rem] font-bold uppercase tracking-[0.2em] text-redacted">
              Primary contact
            </p>
            <p className="mt-1 font-body text-sm text-ink">
              {form.primaryContact || "Pending contact name"}
            </p>
            <p className="font-body text-sm text-redacted">
              {form.workEmail || "Pending work email"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
