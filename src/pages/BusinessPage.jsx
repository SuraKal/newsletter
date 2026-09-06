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
  businessPricingFramework,
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
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="space-y-4">
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
        </section>

        <BusinessContactSection />
      </main>
      <Footer />
    </div>
  );
}
