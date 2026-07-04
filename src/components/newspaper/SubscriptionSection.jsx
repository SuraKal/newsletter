import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { subscriptionPlans } from "@/lib/demoData";
import SectionHeader from "@/components/newspaper/SectionHeader";

export default function SubscriptionSection() {
  return (
    <section className="bg-vellum py-16">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          title="Subscription Plans"
          viewAllLink="/subscriptions"
        />
        <p className="font-body text-base text-redacted max-w-2xl mb-10">
          Join thousands of discerning readers who trust ንቐደም for their daily
          news. Choose the plan that suits your reading habits.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-0 lg:divide-x lg:divide-stone-300/50">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.name}
              className={`lg:px-8 first:lg:pl-0 last:lg:pr-0 ${plan.highlighted ? "" : ""}`}
            >
              <div
                className={`h-full p-6 ${plan.highlighted ? "bg-paper border border-heritage/20" : ""}`}
              >
                {plan.highlighted && (
                  <span className="font-sans text-[0.6rem] font-bold tracking-widest uppercase text-heritage bg-heritage/10 px-3 py-1 mb-4 inline-block">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-2xl font-bold text-ink">
                  {plan.name}
                </h3>
                <p className="font-body text-sm text-redacted mt-1">
                  {plan.description}
                </p>
                <div className="mt-4 mb-6">
                  <span className="font-display text-4xl font-black text-ink">
                    ${plan.price}
                  </span>
                  <span className="font-sans text-sm text-redacted">
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-heritage mt-0.5 flex-shrink-0" />
                      <span className="font-body text-sm text-ink">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/subscriptions"
                  className={`block text-center font-sans text-xs font-bold tracking-wider uppercase px-6 py-3 transition-colors ${
                    plan.highlighted
                      ? "bg-heritage text-paper hover:bg-ink"
                      : "border-2 border-ink text-ink hover:bg-ink hover:text-paper"
                  }`}
                >
                  Subscribe
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
