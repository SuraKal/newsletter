import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import {
  subscriptionAccessMoments,
  subscriptionCheckoutNotes,
  subscriptionFaqs,
  subscriptionPageFacts,
  subscriptionPlans,
} from "@/lib/demoData";

export default function Subscriptions() {
  const [billing, setBilling] = useState("monthly");

  const getDisplayPrice = (plan) => {
    if (plan.price === "Custom") {
      return "Custom";
    }

    if (billing === "yearly") {
      return (plan.monthlyPrice * 12).toFixed(2);
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

        <section className="mx-auto max-w-7xl px-4 pb-12">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {subscriptionPageFacts.map((fact) => (
              <article
                key={fact.label}
                className="rounded-[1.15rem] border border-stone-300/60 bg-vellum p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)]"
              >
                <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.22em] text-heritage">
                  {fact.label}
                </p>
                <h2 className="mt-3 font-heading text-xl font-bold leading-tight text-ink">
                  {fact.value}
                </h2>
                <p className="mt-3 font-body text-sm leading-relaxed text-redacted">
                  {fact.detail}
                </p>
              </article>
            ))}
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

                <div className="mb-6 rounded-[1rem] border border-stone-300/50 bg-stone-50/80 p-4">
                  <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.18em] text-heritage">
                    Delivery and payment
                  </p>
                  <p className="mt-2 font-body text-sm text-redacted">
                    {plan.deliveryNote}
                  </p>
                  <p className="mt-1 font-body text-sm text-redacted">
                    {plan.paymentNote}
                  </p>
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

        <section className="bg-vellum py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div>
              <p className="category-label">Access policy</p>
              <h2 className="mt-2 font-display text-3xl font-black text-ink">
                Access changes over time, even when the article stays the same.
              </h2>
              <p className="mt-4 font-body text-base leading-relaxed text-redacted">
                The subscription model is designed to protect fresh reporting for
                paying readers first, then open that same reporting to the public
                archive after the one-month delay window.
              </p>
            </div>

            <div className="space-y-4">
              {subscriptionAccessMoments.map((item, index) => (
                <article
                  key={item.title}
                  className="rounded-[1.05rem] border border-stone-300/50 bg-paper p-5 shadow-[0_10px_24px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-heritage font-sans text-xs font-bold text-paper">
                      {index + 1}
                    </span>
                    <h3 className="font-heading text-lg font-bold text-ink">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-3 font-body text-sm leading-relaxed text-redacted">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <p className="category-label">Onboarding and consent</p>
              <h2 className="mt-2 font-display text-3xl font-black text-ink">
                Subscription setup needs more than a card number.
              </h2>
              <p className="mt-4 font-body text-base leading-relaxed text-redacted">
                Because the platform ships physical editions and handles recurring
                billing, onboarding needs enough information to support delivery
                routing, account management, and GDPR-aware consent.
              </p>
            </div>

            <div className="space-y-4">
              {subscriptionCheckoutNotes.map((note) => (
                <article
                  key={note.title}
                  className="rounded-[1.05rem] border border-stone-300/50 bg-vellum p-5"
                >
                  <h3 className="font-heading text-lg font-bold text-ink">
                    {note.title}
                  </h3>
                  <p className="mt-3 font-body text-sm leading-relaxed text-redacted">
                    {note.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-vellum py-16">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-center font-display text-3xl font-black text-ink">
              Frequently asked questions
            </h2>
            <div className="mt-10 space-y-0">
              {subscriptionFaqs.map((faq) => (
                <article key={faq.q} className="border-b border-stone-300/50 py-6">
                  <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-ink">
                    {faq.q}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-redacted">
                    {faq.a}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
