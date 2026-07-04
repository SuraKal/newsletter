import React, { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import { subscriptionPlans } from "@/lib/demoData";

export default function Subscriptions() {
  const [billing, setBilling] = useState("monthly");

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main>
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 py-16 text-center">
          <span className="category-label">Membership</span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-ink leading-tight mt-3">
            Subscribe to ንቐደም
          </h1>
          <p className="font-body text-lg text-redacted mt-4 max-w-2xl mx-auto leading-relaxed">
            Join a community of discerning readers who demand journalism of the
            highest caliber. Choose your plan and gain unlimited access to
            award-winning reporting.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setBilling("monthly")}
              className={`font-sans text-xs font-bold tracking-wider uppercase px-4 py-2 transition-colors ${billing === "monthly" ? "bg-heritage text-paper" : "text-redacted hover:text-ink"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`font-sans text-xs font-bold tracking-wider uppercase px-4 py-2 transition-colors ${billing === "yearly" ? "bg-heritage text-paper" : "text-redacted hover:text-ink"}`}
            >
              Yearly <span className="text-heritage ml-1">(Save 20%)</span>
            </button>
          </div>
        </section>

        {/* Plans */}
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan) => {
              const price =
                billing === "yearly"
                  ? (parseFloat(plan.price) * 12 * 0.8).toFixed(0)
                  : plan.price;
              const period = billing === "yearly" ? "/year" : "/month";

              return (
                <div
                  key={plan.name}
                  className={`border p-8 ${plan.highlighted ? "border-heritage bg-vellum" : "border-stone-300/50"}`}
                >
                  {plan.highlighted && (
                    <span className="font-sans text-[0.6rem] font-bold tracking-widest uppercase text-heritage bg-heritage/10 px-3 py-1 mb-4 inline-block">
                      Recommended
                    </span>
                  )}
                  <h3 className="font-display text-2xl font-bold text-ink">
                    {plan.name}
                  </h3>
                  <p className="font-body text-sm text-redacted mt-1">
                    {plan.description}
                  </p>
                  <div className="mt-6 mb-8">
                    <span className="font-display text-5xl font-black text-ink">
                      ${price}
                    </span>
                    <span className="font-sans text-sm text-redacted">
                      {period}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-heritage mt-0.5 flex-shrink-0" />
                        <span className="font-body text-sm text-ink">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full flex items-center justify-center gap-2 font-sans text-xs font-bold tracking-wider uppercase px-6 py-3.5 transition-colors ${
                      plan.highlighted
                        ? "bg-heritage text-paper hover:bg-ink"
                        : "border-2 border-ink text-ink hover:bg-ink hover:text-paper"
                    }`}
                  >
                    Get Started <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-vellum py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="font-display text-3xl font-black text-ink text-center mb-10">
              Frequently Asked Questions
            </h2>
            {[
              {
                q: "Can I switch between plans?",
                a: "Yes. You can upgrade or downgrade your subscription at any time. Changes take effect at the start of your next billing cycle.",
              },
              {
                q: "How does print delivery work?",
                a: "Print subscribers receive a beautifully produced physical newspaper every two weeks. You can track each delivery in real time through your reader dashboard.",
              },
              {
                q: "Is there a free trial?",
                a: "We offer a 14-day free trial on all digital plans. No credit card required to start.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit and debit cards, PayPal, and bank transfers for annual subscriptions.",
              },
            ].map((faq) => (
              <div key={faq.q} className="border-b border-stone-300/50 py-6">
                <h3 className="font-sans text-sm font-bold tracking-wider uppercase text-ink">
                  {faq.q}
                </h3>
                <p className="font-body text-sm text-redacted mt-2 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
