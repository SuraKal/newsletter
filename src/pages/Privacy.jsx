import React from "react";
import { Link } from "react-router-dom";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import {
  businessGovernanceActionNotes,
  policyContacts,
  privacyPrinciples,
  privacyRetentionNotes,
  privacyRights,
} from "@/lib/demoData";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main>
        <section className="mx-auto max-w-5xl px-4 py-14">
          <span className="category-label">Privacy and Data Use</span>
          <h1 className="mt-3 font-display text-4xl font-black leading-tight text-ink md:text-5xl">
            Privacy needs to explain billing, delivery, and consent together.
          </h1>
          <p className="mt-4 max-w-3xl font-body text-lg leading-relaxed text-redacted">
            This platform collects more than a normal news login because it also
            manages recurring billing, physical newspaper delivery, and account
            routing across Belgium and Germany. That means the privacy story has
            to be explicit about payment handling, delivery-address sharing, and
            GDPR rights.
          </p>
          <p className="meta-text mt-4">Last updated: August 11, 2026</p>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-14">
          <div className="grid gap-5 lg:grid-cols-2">
            {privacyPrinciples.map((item) => (
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
          <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div>
              <p className="category-label">GDPR rights</p>
              <h2 className="mt-2 font-display text-3xl font-black text-ink">
                Readers and business contacts need clear self-service rights.
              </h2>
              <p className="mt-4 font-body text-base leading-relaxed text-redacted">
                Because the service handles EU personal data, the account
                experience needs a clear path for access, export, deletion
                requests, and transparency around delivery-partner or payment
                processor involvement.
              </p>
            </div>

            <div className="rounded-[1.2rem] border border-stone-300/50 bg-paper p-6 shadow-[0_12px_28px_rgba(0,0,0,0.04)]">
              <ul className="space-y-4">
                {privacyRights.map((right) => (
                  <li key={right} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-heritage" />
                    <p className="font-body text-sm leading-relaxed text-redacted">
                      {right}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <article className="rounded-[1.2rem] border border-stone-300/60 bg-paper p-6 shadow-[0_12px_28px_rgba(0,0,0,0.04)]">
              <p className="category-label">Retention and deletion</p>
              <div className="mt-4 space-y-4">
                {privacyRetentionNotes.map((note) => (
                  <p key={note} className="font-body text-sm leading-relaxed text-redacted">
                    {note}
                  </p>
                ))}
              </div>
            </article>

            <article className="rounded-[1.2rem] border border-stone-300/60 bg-vellum p-6">
              <p className="category-label">Privacy contact</p>
              <h2 className="mt-3 font-heading text-xl font-bold text-ink">
                Questions about consent, export, or deletion requests
              </h2>
              <p className="mt-4 font-body text-sm leading-relaxed text-redacted">
                For privacy-specific requests, contact the data-protection and
                support team before or after subscription setup. This contact
                path should also be used if you need clarification on how your
                delivery address or billing data is handled.
              </p>
              <div className="mt-5 space-y-2 font-sans text-sm text-ink">
                <p>
                  Privacy:{" "}
                  <a
                    href={`mailto:${policyContacts.privacyEmail}`}
                    className="text-heritage hover:text-ink"
                  >
                    {policyContacts.privacyEmail}
                  </a>
                </p>
                <p>
                  Support:{" "}
                  <a
                    href={`mailto:${policyContacts.supportEmail}`}
                    className="text-heritage hover:text-ink"
                  >
                    {policyContacts.supportEmail}
                  </a>
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="bg-vellum py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div>
                <p className="category-label">Self-service controls</p>
                <h2 className="mt-2 font-display text-3xl font-black text-ink">
                  Privacy should also be actionable inside the account workspace.
                </h2>
                <p className="mt-4 font-body text-base leading-relaxed text-redacted">
                  The reader dashboard and business workspace now expose
                  account-level privacy controls so both subscribers and company
                  contacts can review consent state, request export, and start
                  retention or deletion review without relying only on static
                  policy copy.
                </p>
              </div>

              <div className="rounded-[1.2rem] border border-stone-300/50 bg-paper p-6 shadow-[0_12px_28px_rgba(0,0,0,0.04)]">
                <div className="space-y-4">
                  <div className="rounded-[1rem] border border-stone-300/50 bg-vellum p-4">
                    <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-heritage">
                      Reader profile
                    </p>
                    <p className="mt-2 font-body text-sm leading-relaxed text-redacted">
                      Update contact and delivery data used for billing support
                      and shipment routing.
                    </p>
                  </div>
                  <div className="rounded-[1rem] border border-stone-300/50 bg-vellum p-4">
                    <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-heritage">
                      Privacy and governance
                    </p>
                    <p className="mt-2 font-body text-sm leading-relaxed text-redacted">
                      Review consent settings, request export, and start a
                      deletion review from the dashboard privacy route.
                    </p>
                  </div>
                  <div className="rounded-[1rem] border border-stone-300/50 bg-vellum p-4">
                    <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-heritage">
                      Business settings
                    </p>
                    <p className="mt-2 font-body text-sm leading-relaxed text-redacted">
                      Company account owners can manage logistics-sharing
                      consent, request company export packages, and review
                      retention guidance inside the business workspace.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-[1rem] border border-stone-300/50 bg-vellum p-4">
                  <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-heritage">
                    Admin and support review
                  </p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-redacted">
                    {businessGovernanceActionNotes[2].detail}
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/dashboard/profile"
                    className="inline-flex items-center justify-center rounded-2xl bg-heritage px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-ink"
                  >
                    Open profile route
                  </Link>
                  <Link
                    to="/dashboard/privacy"
                    className="inline-flex items-center justify-center rounded-2xl border-2 border-ink px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-paper"
                  >
                    Open privacy controls
                  </Link>
                  <Link
                    to="/business-dashboard/settings"
                    className="inline-flex items-center justify-center rounded-2xl border-2 border-heritage px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.18em] text-heritage transition-colors hover:bg-heritage hover:text-paper"
                  >
                    Open business settings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
