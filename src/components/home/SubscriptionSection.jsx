import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/lib/nequdem-data";
import SectionHeader from "@/components/nequdem/SectionHeader";

export default function SubscriptionSection() {
  return (
    <section className="nq-container py-16">
      <SectionHeader
        title="Subscribe to Nequdem"
        subtitle="Choose the plan that suits your reading habits"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative p-8 border rounded-2xl transition-all duration-300 hover:shadow-lg ${
              plan.featured
                ? "nq-vellum border-heritage shadow-md"
                : "nq-parchment border-rule"
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-8 bg-heritage text-parchment text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1">
                {plan.badge}
              </div>
            )}
            <h3 className="font-display text-xl font-bold text-ink">
              {plan.name}
            </h3>
            <div className="mt-4">
              <span className="font-display text-4xl font-bold text-ink">
                {plan.price}
              </span>
              <span className="font-sans text-sm text-muted-foreground ml-1">
                {plan.period}
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
            <Link
              to="/subscriptions"
              className={`block text-center mt-8 text-xs py-3 ${
                plan.featured ? "nq-btn-primary" : "nq-btn-outline"
              }`}
            >
              Select Plan
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
