import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import { useSubscriptionPlans } from "@/lib/subscription-catalog";

export default function Subscriptions() {
  const [billing, setBilling] = useState("monthly");
  const subscriptionPlans = useSubscriptionPlans();

  const getDisplayPrice = (plan) => {
    if (plan.price === "Custom") {
      return "Custom";
    }

    if (billing === "yearly") {
      return Number(plan.yearlyPrice ?? plan.monthlyPrice * 12).toFixed(2);
    }

    return plan.price;
  };

  const getDisplayPeriod = (plan) => {
    if (plan.price === "Custom") {
      return "contact sales";
    }

    return billing === "yearly" ? "/year" : "/month";
  };

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main>
        <section className="mx-auto max-w-5xl px-4 py-16 text-center">
          <span className="category-label">Subscriptions and Access</span>
          <h1 className="mt-3 font-display text-4xl font-black leading-tight text-ink md:text-5xl lg:text-6xl">
            Choose a plan with the real product rules up front.
          </h1>
          <p className="mx-auto mt-4 max-w-3xl font-body text-lg leading-relaxed text-redacted">
            Reader subscriptions are billed monthly or yearly, print delivery
            still runs every two weeks, and recent reporting stays reserved for
            active subscribers before it moves into the public archive 30 days
            later.
          </p>

          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-stone-300/60 bg-paper p-2 shadow-[0_10px_24px_rgba(0,0,0,0.04)]">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 font-sans text-xs font-bold uppercase tracking-wider transition-colors ${
                billing === "monthly"
                  ? "bg-heritage text-paper"
                  : "text-redacted hover:text-ink"
              }`}
            >
              Monthly billing
            </button>
            <button
              type="button"
              onClick={() => setBilling("yearly")}
              className={`px-5 py-2 font-sans text-xs font-bold uppercase tracking-wider transition-colors ${
                billing === "yearly"
                  ? "bg-heritage text-paper"
                  : "text-redacted hover:text-ink"
              }`}
            >
              Yearly billing
            </button>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-[1.35rem] border p-8 shadow-[0_16px_38px_rgba(0,0,0,0.05)] ${
                  plan.highlighted
                    ? "border-heritage/25 bg-paper"
                    : "border-stone-300/60 bg-vellum"
                }`}
              >
                {plan.highlighted ? (
                  <span className="mb-4 inline-block bg-heritage/10 px-3 py-1 font-sans text-[0.6rem] font-bold uppercase tracking-widest text-heritage">
                    Reader favorite
                  </span>
                ) : null}
                <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.22em] text-redacted">
                  {plan.audience}
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold text-ink">
                  {plan.name}
                </h3>
                <p className="mt-1 font-body text-sm text-redacted">
                  {plan.description}
                </p>

                <div className="mb-6 mt-6">
                  <span className="font-display text-5xl font-black text-ink">
                    {plan.price === "Custom" ? "" : "€"}
                    {getDisplayPrice(plan)}
                  </span>
                  <span className="ml-2 font-sans text-sm text-redacted">
                    {getDisplayPeriod(plan)}
                  </span>
                </div>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-heritage" />
                      <span className="font-body text-sm text-ink">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={
                    plan.id === "business"
                      ? "/business"
                      : `/subscribe/checkout?plan=${plan.id}&billing=${billing}`
                  }
                  className={`flex w-full items-center justify-center gap-2 px-6 py-3.5 font-sans text-xs font-bold uppercase tracking-wider transition-colors ${
                    plan.highlighted
                      ? "bg-heritage text-paper hover:bg-ink"
                      : "border-2 border-ink text-ink hover:bg-ink hover:text-paper"
                  }`}
                >
                  {plan.name === "Business" ? "Request business plan" : "Continue to checkout"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
