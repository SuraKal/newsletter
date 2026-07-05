import React, { useState } from "react";
import PageWrapper from "@/components/nequdem/PageWrapper";
import { SUBSCRIPTION_PLANS } from "@/lib/nequdem-data";
import { Check, Star } from "lucide-react";
import SectionHeader from "@/components/nequdem/SectionHeader";

export default function Subscriptions() {
  const [billingPeriod, setBillingPeriod] = useState("monthly");

  return (
    <PageWrapper>
      <div className="nq-container py-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="nq-category-label">Subscriptions</span>
          <h1 className="nq-headline text-3xl md:text-5xl mt-4">
            Invest in Informed Thinking
          </h1>
          <p className="nq-deck mt-4 text-base">
            Choose between pure digital access or the full Nequdem experience
            with a physical newspaper delivered to your door. Every plan
            includes our award-winning journalism.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`font-sans text-sm font-medium px-4 py-2 transition-colors ${
                billingPeriod === "monthly"
                  ? "bg-heritage text-parchment"
                  : "text-ink hover:text-heritage"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`font-sans text-sm font-medium px-4 py-2 transition-colors ${
                billingPeriod === "yearly"
                  ? "bg-heritage text-parchment"
                  : "text-ink hover:text-heritage"
              }`}
            >
              Yearly
              <span className="ml-2 text-[10px] bg-heritage/20 text-heritage px-2 py-0.5 font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const price =
              billingPeriod === "yearly"
                ? `$${(parseFloat(plan.price.replace("$", "")) * 0.8 * 12).toFixed(0)}`
                : plan.price;
            const period =
              billingPeriod === "yearly" ? "per year" : "per month";

            return (
              <div
                key={plan.name}
                className={`relative p-8 border transition-all duration-300 hover:shadow-lg ${
                  plan.featured
                    ? "nq-vellum border-heritage shadow-md scale-105"
                    : "nq-parchment border-rule"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-8 bg-heritage text-parchment text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {plan.badge}
                  </div>
                )}
                <h3 className="font-display text-xl font-bold text-ink">
                  {plan.name}
                </h3>
                <div className="mt-4">
                  <span className="font-display text-4xl font-bold text-ink">
                    {price}
                  </span>
                  <span className="font-sans text-sm text-muted-foreground ml-1">
                    {period}
                  </span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-heritage flex-shrink-0 mt-0.5" />
                      <span className="font-sans text-sm text-ink/80">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full text-center mt-8 text-xs py-3 ${plan.featured ? "nq-btn-primary" : "nq-btn-outline"}`}
                >
                  Select Plan
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mt-20">
          <SectionHeader title="Frequently Asked Questions" />
          {[
            {
              q: "Can I switch between plans?",
              a: "Yes. You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
            },
            {
              q: "How often is the physical newspaper delivered?",
              a: "Print + Digital subscribers receive a curated physical edition every two weeks, delivered directly to their registered address with full tracking.",
            },
            {
              q: "Is there a free trial?",
              a: "We offer a 14-day complimentary digital trial for new subscribers. No credit card required.",
            },
            {
              q: "Can I cancel anytime?",
              a: "Absolutely. There are no long-term contracts. Cancel through your account dashboard at any time.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-rule py-6">
              <h4 className="font-sans text-sm font-semibold text-ink">{q}</h4>
              <p className="font-sans text-sm text-muted-foreground mt-2">
                {a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
