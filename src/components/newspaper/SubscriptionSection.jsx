import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { useSubscriptionPlans } from "@/lib/subscription-catalog";
import SectionHeader from "@/components/newspaper/SectionHeader";
import { useLanguage } from "@/lib/LanguageContext";

export default function SubscriptionSection() {
  const { t } = useLanguage();
  const subscriptionPlans = useSubscriptionPlans();

  return (
    <section className="bg-vellum py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          title="Subscription Plans"
          viewAllLink="/subscriptions"
        />

        <div className="grid grid-cols-1 gap-7 md:grid-cols-3 lg:gap-6">
          {subscriptionPlans.map((plan) => (
            <div key={plan.name} className="h-full">
              <div
                className={`h-full rounded-[1.25rem] border p-7 shadow-[0_12px_30px_rgba(0,0,0,0.04)] ${
                  plan.highlighted
                    ? "border-heritage bg-heritage text-paper"
                    : "bg-vellum border-stone-300/50"
                }`}
              >
                {plan.highlighted && (
                  <span className="mb-4 inline-block bg-paper/15 px-3 py-1 font-sans text-[0.6rem] font-bold uppercase tracking-widest text-paper">
                    {t("Most Popular")}
                  </span>
                )}
                <p className={`font-sans text-[0.62rem] font-bold uppercase tracking-[0.22em] ${plan.highlighted ? "text-paper/70" : "text-redacted"}`}>
                  {t(plan.audience || "Subscribers")}
                </p>
                <h3 className={`mt-2 font-display text-2xl font-bold ${plan.highlighted ? "text-paper" : "text-ink"}`}>
                  {t(plan.name)}
                </h3>
                <p className={`mt-1 font-body text-sm ${plan.highlighted ? "text-paper/75" : "text-redacted"}`}>
                  {t(
                    plan.name === "Print + Digital"
                      ? "Digital access plus a printed edition every two weeks"
                      : plan.description,
                  )}
                </p>
                <div className="mb-6 mt-4">
                  <span className={`font-display text-4xl font-black ${plan.highlighted ? "text-paper" : "text-ink"}`}>
                    {plan.pricePrefix === "" ? "" : "$"}
                    {plan.price}
                  </span>
                  <span className={`font-sans text-sm ${plan.highlighted ? "text-paper/70" : "text-redacted"}`}>
                    {t(plan.period)}
                  </span>
                </div>
                <div className={`mb-5 rounded-[0.95rem] border p-4 ${plan.highlighted ? "border-paper/20 bg-paper/10" : "border-stone-300/40 bg-stone-50/70"}`}>
                  <p className={`font-body text-sm ${plan.highlighted ? "text-paper/80" : "text-redacted"}`}>
                    {t(plan.deliveryNote)}
                  </p>
                </div>
                <ul className="mb-8 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${plan.highlighted ? "text-paper" : "text-heritage"}`} />
                      <span className={`font-body text-sm ${plan.highlighted ? "text-paper" : "text-ink"}`}>
                        {t(feature)}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/subscriptions"
                  className={`block px-6 py-3 text-center font-sans text-xs font-bold uppercase tracking-wider transition-colors ${
                    plan.highlighted
                      ? "bg-paper text-heritage hover:bg-vellum"
                      : "border-2 border-ink text-ink hover:bg-ink hover:text-paper"
                  }`}
                >
                  {t(plan.name === "Business" ? "Request Business Plan" : "Choose Plan")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
