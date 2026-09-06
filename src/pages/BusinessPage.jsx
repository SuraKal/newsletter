import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  FileText,
  Globe2,
  MapPinned,
  ReceiptText,
  Truck,
  Users,
} from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import BusinessContactSection from "@/components/newspaper/BusinessContactSection";
import { IMAGES } from "@/lib/constants";
import {
  businessDeliveryLocations,
  businessLandingFeatures,
  businessLandingStats,
  businessOnboardingSteps,
  businessPricingFramework,
  businessPricingNotes,
} from "@/lib/demoData";

const featureIconMap = {
  "Bulk copy planning": FileText,
  "Consolidated invoicing": ReceiptText,
  "Location management": MapPinned,
  "Operational shipment visibility": Truck,
  "Volume pricing logic": Globe2,
  "Company workspace": Users,
};

const locationIconMap = {
  "Head office delivery": Building2,
  "Multi-branch rollout": MapPinned,
  "Hospitality and partner sites": Truck,
};

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main>
        <section className="relative overflow-hidden">
          <img
            src={IMAGES.boardroom}
            alt="Business team planning newspaper distribution"
            className="h-[360px] w-full object-cover sm:h-[420px] md:h-[520px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-night/95 via-night/78 to-night/45" />
          <div className="absolute inset-0">
            <div className="mx-auto flex h-full max-w-7xl items-center px-4">
              <div className="max-w-3xl">
                <span className="font-sans text-[0.6rem] font-bold uppercase tracking-widest text-cream/55">
                  Company subscriptions and distribution
                </span>
                <h1 className="mt-3 font-display text-4xl font-black leading-tight text-cream md:text-5xl lg:text-6xl">
                  Bulk newspaper ordering, invoicing, and delivery planning for organizations.
                </h1>
                <p className="mt-4 max-w-2xl font-body text-base leading-relaxed text-cream/75 sm:text-lg">
                  Business accounts should not feel like oversized reader plans.
                  They need copy-volume logic, multi-location routing,
                  invoice-ready billing, and a company workspace designed around
                  operational fulfillment.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                  <Link
                    to="/business/apply"
                    className="inline-flex items-center justify-center gap-2 bg-cream px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-night transition-colors hover:bg-warmbeige sm:w-auto"
                  >
                    Start business onboarding
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="mailto:business@newsletter.local?subject=Business%20Inquiry"
                    className="inline-flex items-center justify-center border-2 border-cream px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-cream transition-colors hover:bg-cream hover:text-night sm:w-auto"
                  >
                    Contact commercial team
                  </a>
                  <Link
                    to="/subscriptions"
                    className="inline-flex items-center justify-center border border-cream/50 px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-cream transition-colors hover:border-cream hover:bg-cream/10 sm:w-auto"
                  >
                    Compare reader plans
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {businessLandingStats.map((item) => (
              <article
                key={item.label}
                className="rounded-[1.15rem] border border-stone-300/60 bg-vellum p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)]"
              >
                <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.22em] text-heritage">
                  {item.label}
                </p>
                <h2 className="mt-3 font-heading text-xl font-bold leading-tight text-ink">
                  {item.value}
                </h2>
                <p className="mt-3 font-body text-sm leading-relaxed text-redacted">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10">
          <div className="mb-10 max-w-3xl">
            <span className="category-label">Business operating model</span>
            <h2 className="mt-2 font-display text-3xl font-black text-ink md:text-4xl">
              The business offer is built around fulfillment, not only access.
            </h2>
            <p className="mt-4 font-body text-base leading-relaxed text-redacted">
              The proposal separates individual readers from company buyers for a
              reason. Business accounts need operational control over copy
              counts, invoice structure, site delivery, and shipment visibility
              before they ever care about a dashboard login.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {businessLandingFeatures.map((feature) => {
              const Icon = featureIconMap[feature.title] || FileText;

              return (
                <article
                  key={feature.title}
                  className="rounded-[1.15rem] border border-stone-300/60 bg-paper p-6 shadow-[0_12px_28px_rgba(0,0,0,0.04)]"
                >
                  <Icon className="h-6 w-6 text-heritage" />
                  <h3 className="mt-4 font-sans text-sm font-bold uppercase tracking-wider text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-3 font-body text-sm leading-relaxed text-redacted">
                    {feature.desc}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="bg-vellum py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-10 max-w-3xl">
              <span className="category-label">Pricing framework</span>
              <h2 className="mt-2 font-display text-3xl font-black text-ink md:text-4xl">
                Volume pricing should scale with distribution complexity.
              </h2>
              <p className="mt-4 font-body text-base leading-relaxed text-redacted">
                The business page should explain pricing-tier logic even before
                exact discount bands are finalized. Organizations need to know
                that copy volume, number of locations, and invoice structure all
                influence the quote.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {businessPricingFramework.map((tier) => (
                <article
                  key={tier.tier}
                  className="rounded-[1.2rem] border border-stone-300/60 bg-paper p-6 shadow-[0_12px_28px_rgba(0,0,0,0.04)]"
                >
                  <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.22em] text-heritage">
                    {tier.tier}
                  </p>
                  <h3 className="mt-3 font-heading text-2xl font-bold text-ink">
                    {tier.pricing}
                  </h3>
                  <p className="mt-2 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-redacted">
                    {tier.volume}
                  </p>
                  <p className="mt-4 font-body text-sm leading-relaxed text-redacted">
                    {tier.billing}
                  </p>
                  <p className="mt-4 rounded-[1rem] bg-vellum px-4 py-3 font-body text-sm leading-relaxed text-redacted">
                    {tier.note}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {businessPricingNotes.map((note) => (
                <article
                  key={note}
                  className="rounded-[1rem] border border-stone-300/50 bg-vellum/65 p-4"
                >
                  <p className="font-body text-sm leading-relaxed text-redacted">
                    {note}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div>
              <span className="category-label">Delivery locations and invoicing</span>
              <h2 className="mt-2 font-display text-3xl font-black text-ink md:text-4xl">
                Delivery planning has to work across one office or many.
              </h2>
              <p className="mt-4 font-body text-base leading-relaxed text-redacted">
                Business fulfillment can mean one headquarters, a cluster of
                branches, or partner-facing sites like hotels and lounges. The
                landing page should make that operational flexibility visible
                before onboarding starts.
              </p>

              <div className="mt-8 space-y-4">
                {businessDeliveryLocations.map((location) => {
                  const Icon = locationIconMap[location.title] || Building2;

                  return (
                    <article
                      key={location.title}
                      className="rounded-[1.1rem] border border-stone-300/60 bg-vellum p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-heritage/30 bg-paper">
                          <Icon className="h-5 w-5 text-heritage" />
                        </div>
                        <div>
                          <h3 className="font-heading text-lg font-bold text-ink">
                            {location.title}
                          </h3>
                          <p className="mt-2 font-body text-sm leading-relaxed text-redacted">
                            {location.detail}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.25rem] border border-stone-300/60 bg-paper p-6 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
              <p className="category-label">Invoice expectations</p>
              <h3 className="mt-3 font-heading text-2xl font-bold text-ink">
                Commercial billing needs more structure than a normal reader checkout.
              </h3>
              <div className="mt-5 space-y-4">
                <div className="rounded-[1rem] border border-stone-300/50 bg-vellum p-4">
                  <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-heritage">
                    Monthly or quarterly invoices
                  </p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-redacted">
                    Some teams will want a simple recurring invoice tied to one
                    primary billing contact and one delivery group.
                  </p>
                </div>
                <div className="rounded-[1rem] border border-stone-300/50 bg-vellum p-4">
                  <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-heritage">
                    Contract billing for larger rollouts
                  </p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-redacted">
                    Larger organizations may need negotiated billing schedules,
                    internal purchase order references, or rollout phases.
                  </p>
                </div>
                <div className="rounded-[1rem] border border-stone-300/50 bg-vellum p-4">
                  <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-heritage">
                    Belgium and Germany considerations
                  </p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-redacted">
                    Commercial setup may require VAT-aware invoicing and country
                    coverage details before the business account is activated.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-vellum py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div>
                <span className="category-label">Dedicated business path</span>
                <h2 className="mt-2 font-display text-3xl font-black text-ink md:text-4xl">
                  The public landing page now hands off into a dedicated quote-request flow.
                </h2>
                <p className="mt-4 font-body text-base leading-relaxed text-redacted">
                  Instead of burying a long company intake inside the marketing page, the next step is now a separate onboarding route that captures organization details, expected volume, delivery footprint, and invoicing preferences in one place.
                </p>

                <div className="mt-8 space-y-4">
                  {businessOnboardingSteps.map((step, index) => (
                    <article
                      key={step.title}
                      className="rounded-[1.05rem] border border-stone-300/60 bg-paper p-5 shadow-[0_10px_24px_rgba(0,0,0,0.04)]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-heritage font-sans text-xs font-bold text-paper">
                          {index + 1}
                        </span>
                        <h3 className="font-heading text-lg font-bold text-ink">
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-3 font-body text-sm leading-relaxed text-redacted">
                        {step.detail}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.3rem] border border-stone-300/60 bg-paper p-6 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
                <h3 className="font-display text-2xl font-black text-ink">
                  Business onboarding route
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-redacted">
                  The dedicated route captures:
                </p>

                <div className="mt-6 space-y-4">
                  {[
                    "Organization profile, request type, and operating scope",
                    "Expected copies per delivery cycle and location count",
                    "Billing preference, VAT context, and invoice notes",
                    "Operational notes and consent needed for commercial follow-up",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[1rem] border border-stone-300/50 bg-vellum p-4"
                    >
                      <p className="font-body text-sm leading-relaxed text-redacted">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/business/apply"
                    className="inline-flex items-center justify-center gap-2 bg-heritage px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-ink"
                  >
                    Start business onboarding
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="mailto:business@newsletter.local?subject=Business%20Inquiry"
                    className="inline-flex items-center justify-center border-2 border-ink px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-paper"
                  >
                    Email commercial team
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <BusinessContactSection />
      </main>
      <Footer />
    </div>
  );
}
