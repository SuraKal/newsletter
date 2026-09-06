import React from "react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import { policyContacts, termsHighlights } from "@/lib/demoData";

export default function Terms() {
  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main>
        <section className="mx-auto max-w-5xl px-4 py-14">
          <span className="category-label">Terms and Service Rules</span>
          <h1 className="mt-3 font-display text-4xl font-black leading-tight text-ink md:text-5xl">
            The service terms should match how subscriptions, delivery, and access really behave.
          </h1>
          <p className="mt-4 max-w-3xl font-body text-lg leading-relaxed text-redacted">
            These terms summarize the operating rules behind the product: how
            subscriptions are billed, how print delivery cadence works, when
            recent articles remain subscriber-only, and how business accounts
            differ from standard reader plans.
          </p>
          <p className="meta-text mt-4">Last updated: August 10, 2026</p>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-14">
          <div className="grid gap-5 lg:grid-cols-2">
            {termsHighlights.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.2rem] border border-stone-300/60 bg-vellum p-6 shadow-[0_12px_30px_rgba(0,0,0,0.04)]"
              >
                <h2 className="font-heading text-xl font-bold text-ink">
                  {item.title}
                </h2>
                <p className="mt-3 font-body text-sm leading-relaxed text-redacted">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-vellum py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <article className="rounded-[1.2rem] border border-stone-300/50 bg-paper p-6 shadow-[0_12px_28px_rgba(0,0,0,0.04)]">
              <p className="category-label">Reader plan reminders</p>
              <ul className="mt-4 space-y-4">
                <li className="font-body text-sm leading-relaxed text-redacted">
                  Monthly and yearly billing both refer to payment frequency, not
                  to how often the physical paper is delivered.
                </li>
                <li className="font-body text-sm leading-relaxed text-redacted">
                  Recent digital reporting is part of the paid subscriber value
                  proposition and only becomes publicly accessible after the
                  one-month delay window.
                </li>
                <li className="font-body text-sm leading-relaxed text-redacted">
                  Print delivery depends on accurate address information and may
                  rely on the integrated route and shipment workflow described by
                  the platform.
                </li>
              </ul>
            </article>

            <article className="rounded-[1.2rem] border border-stone-300/60 bg-paper p-6 shadow-[0_12px_28px_rgba(0,0,0,0.04)]">
              <p className="category-label">Business account reminders</p>
              <ul className="mt-4 space-y-4">
                <li className="font-body text-sm leading-relaxed text-redacted">
                  Business accounts may use bulk-order rules, invoice handling,
                  and pricing structures that differ from ordinary reader plans.
                </li>
                <li className="font-body text-sm leading-relaxed text-redacted">
                  Multi-location delivery coordination can require additional
                  operational details beyond a standard household subscription.
                </li>
                <li className="font-body text-sm leading-relaxed text-redacted">
                  The platform may need separate business-contact and billing
                  information in order to support organization-level fulfillment.
                </li>
              </ul>
            </article>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16">
          <article className="rounded-[1.25rem] border border-stone-300/60 bg-paper p-7 shadow-[0_12px_28px_rgba(0,0,0,0.04)]">
            <p className="category-label">Need help with billing or plan terms?</p>
            <h2 className="mt-3 font-heading text-2xl font-bold text-ink">
              Contact support before checkout or renewal questions become account problems.
            </h2>
            <p className="mt-4 font-body text-sm leading-relaxed text-redacted">
              If you need clarification on subscription changes, delivery issues,
              or business billing expectations, use the support and billing
              contacts before proceeding with a new subscription or order.
            </p>
            <div className="mt-5 space-y-2 font-sans text-sm text-ink">
              <p>
                Support:{" "}
                <a
                  href={`mailto:${policyContacts.supportEmail}`}
                  className="text-heritage hover:text-ink"
                >
                  {policyContacts.supportEmail}
                </a>
              </p>
              <p>
                Billing:{" "}
                <a
                  href={`mailto:${policyContacts.billingEmail}`}
                  className="text-heritage hover:text-ink"
                >
                  {policyContacts.billingEmail}
                </a>
              </p>
            </div>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}
