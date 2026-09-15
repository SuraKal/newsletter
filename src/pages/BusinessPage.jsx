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
import ScrollReveal from "@/components/newspaper/ScrollReveal";
import BusinessContactSection from "@/components/newspaper/BusinessContactSection";
import {
  businessDeliveryLocations,
  businessLandingFeatures,
  businessLandingStats,
} from "@/lib/demoData";
import { useBusinessPricing } from "@/lib/business-pricing-catalog";

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
  const businessPricingFramework = useBusinessPricing();

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />

      {/* Hero */}
      <section className="relative overflow-hidden bg-night">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 18% 22%, rgba(196,151,114,0.16), transparent 38%), radial-gradient(circle at 82% 8%, rgba(196,151,114,0.10), transparent 34%), linear-gradient(150deg, #100E0B 0%, #1C1712 52%, #2A1F15 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(236,230,219,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(236,230,219,0.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
          <ScrollReveal effect="rise">
            <span className="font-sans text-[0.6rem] font-bold uppercase tracking-widest text-cream/50">
              Company subscriptions and distribution
            </span>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-black leading-tight text-cream md:text-5xl lg:text-6xl">
              Bulk newspaper ordering, invoicing, and delivery planning for
              organizations.
            </h1>
            <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-cream/65 sm:text-lg">
              Business accounts should not feel like oversized reader plans.
              They need copy-volume logic, multi-location routing,
              invoice-ready billing, and a company workspace designed around
              operational fulfillment.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                to="/business/apply"
                className="group inline-flex items-center justify-center gap-2 bg-cream px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-night transition-colors hover:bg-warmbeige"
              >
                Start business onboarding
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="mailto:business@newsletter.local?subject=Business%20Inquiry"
                className="inline-flex items-center justify-center border-2 border-cream/70 px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-cream transition-colors hover:border-cream hover:bg-cream hover:text-night"
              >
                Contact commercial team
              </a>
              <Link
                to="/subscriptions"
                className="inline-flex items-center justify-center border-2 border-cream/40 px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-cream transition-colors hover:border-cream/70 hover:bg-cream/10"
              >
                Compare reader plans
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats band */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {businessLandingStats.map((item, index) => (
            <ScrollReveal key={item.label} effect="rise" delay={index * 40}>
              <article className="h-full rounded-[1.15rem] border border-stone-300/60 bg-vellum p-6 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
                <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.22em] text-heritage">
                  {item.label}
                </p>
                <h2 className="mt-3 font-heading text-xl font-bold leading-tight text-ink md:text-2xl">
                  {item.value}
                </h2>
                <p className="mt-3 font-body text-sm leading-relaxed text-redacted">
                  {item.detail}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="bg-vellum py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal effect="rise">
            <div className="mx-auto max-w-2xl text-center">
              <span className="font-sans text-[0.6rem] font-bold uppercase tracking-widest text-heritage">
                What a business account includes
              </span>
              <h2 className="mt-3 font-display text-3xl font-black leading-tight text-ink md:text-4xl">
                Built around organizational fulfillment
              </h2>
              <p className="mt-4 font-body text-base leading-relaxed text-redacted">
                Tools and billing logic shaped for offices, branches, and
                partner sites — not scaled-up consumer plans.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {businessLandingFeatures.map((feature, index) => {
              const Icon = featureIconMap[feature.title] || FileText;

              return (
                <ScrollReveal key={feature.title} effect="rise" delay={index * 40}>
                  <article className="hover-lift h-full rounded-[1.15rem] border border-stone-300/60 bg-paper p-6 shadow-[0_12px_28px_rgba(0,0,0,0.04)]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-heritage/30 bg-vellum">
                      <Icon className="h-6 w-6 text-heritage" />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold text-ink">
                      {feature.title}
                    </h3>
                    <p className="mt-3 font-body text-sm leading-relaxed text-redacted">
                      {feature.desc}
                    </p>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing framework */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <ScrollReveal effect="rise">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-sans text-[0.6rem] font-bold uppercase tracking-widest text-heritage">
              Volume pricing
            </span>
            <h2 className="mt-3 font-display text-3xl font-black leading-tight text-ink md:text-4xl">
              Pricing that scales with your footprint
            </h2>
            <p className="mt-4 font-body text-base leading-relaxed text-redacted">
              Copy counts and routing needs vary widely between organizations,
              so commercial plans are banded by delivery volume.
            </p>
            <p className="mt-3 font-sans text-xs font-bold uppercase tracking-[0.16em] text-heritage">
              Public company pricing · separate from reader subscriptions
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {businessPricingFramework.map((tier, index) => (
            <ScrollReveal key={tier.tier} effect="rise" delay={index * 60}>
              <article className="hover-lift flex h-full flex-col rounded-[1.15rem] border border-stone-300/60 bg-vellum p-8 shadow-[0_12px_28px_rgba(0,0,0,0.04)]">
                <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.22em] text-heritage">
                  {tier.tier}
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold text-ink">
                  {tier.pricing}
                </h3>
                <p className="mt-2 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-redacted">
                  {tier.volume}
                </p>
                <p className="mt-4 font-body text-sm leading-relaxed text-redacted">
                  {tier.billing}
                </p>
                <p className="mt-auto pt-4 font-body text-xs leading-relaxed text-redacted/80">
                  {tier.note}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Delivery locations */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <ScrollReveal effect="fade">
          <div className="relative overflow-hidden rounded-[1.35rem] bg-night p-8 md:p-12">
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(236,230,219,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(236,230,219,0.5) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />
            <div className="relative">
              <span className="font-sans text-[0.6rem] font-bold uppercase tracking-widest text-cream/50">
                Where we deliver
              </span>
              <h2 className="mt-3 max-w-2xl font-display text-3xl font-black leading-tight text-cream md:text-4xl">
                One account, several destinations
              </h2>
            </div>
            <div className="relative mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {businessDeliveryLocations.map((location) => {
                const Icon = locationIconMap[location.title] || Building2;

                return (
                  <div key={location.title} className="border-l border-cream/15 pl-5">
                    <Icon className="h-6 w-6 text-cream/70" />
                    <h3 className="mt-3 font-sans text-sm font-bold uppercase tracking-wider text-cream">
                      {location.title}
                    </h3>
                    <p className="mt-2 font-body text-sm leading-relaxed text-cream/60">
                      {location.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <BusinessContactSection />
      <Footer />
    </div>
  );
}
