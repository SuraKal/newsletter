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

        <section className="mx-auto max-w-5xl px-4 py-16">
          <article className="rounded-[1.25rem] border border-stone-300/60 bg-paper p-7 shadow-[0_12px_28px_rgba(0,0,0,0.04)]">
            <div className="space-y-2 font-sans text-sm text-ink">
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
