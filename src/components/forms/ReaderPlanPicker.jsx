import React from "react";
import { Check } from "lucide-react";

export default function ReaderPlanPicker({
  plans,
  selectedPlanId,
  billingCycle,
  onPlanChange,
  onBillingChange,
}) {
  const getPrice = (plan) =>
    billingCycle === "yearly"
      ? Number(plan.yearlyPrice ?? plan.monthlyPrice * 12).toFixed(2)
      : plan.monthlyPrice.toFixed(2);

  return (
    <div className="space-y-5">
      <div className="inline-flex flex-wrap items-center gap-3 rounded-full border border-stone-300/60 bg-paper p-2">
        {["monthly", "yearly"].map((cycle) => (
          <button
            key={cycle}
            type="button"
            onClick={() => onBillingChange(cycle)}
            className={`rounded-full px-5 py-2 font-sans text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
              billingCycle === cycle
                ? "bg-heritage text-paper"
                : "text-redacted hover:text-ink"
            }`}
          >
            {cycle === "monthly" ? "Monthly billing" : "Yearly billing"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {plans.map((plan) => {
          const isSelected = plan.id === selectedPlanId;

          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onPlanChange(plan.id)}
              className={`rounded-[1.4rem] border p-6 text-left transition ${
                isSelected
                  ? "border-heritage bg-paper shadow-[0_18px_38px_rgba(76,43,8,0.08)]"
                  : "border-stone-300/60 bg-vellum/55 hover:border-stone-400"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-sans text-[0.64rem] font-bold uppercase tracking-[0.22em] text-redacted">
                    {plan.audience}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold text-ink">
                    {plan.name}
                  </h3>
                </div>
                {plan.highlighted ? (
                  <span className="rounded-full bg-heritage/10 px-3 py-1 font-sans text-[0.6rem] font-bold uppercase tracking-[0.2em] text-heritage">
                    Recommended
                  </span>
                ) : null}
              </div>

              <p className="mt-3 font-body text-sm leading-6 text-redacted">
                {plan.description}
              </p>

              <div className="mt-5">
                <span className="font-display text-4xl font-black text-ink">
                  €{getPrice(plan)}
                </span>
                <span className="ml-2 font-sans text-sm text-redacted">
                  {billingCycle === "yearly" ? "/year" : "/month"}
                </span>
              </div>

              <div className="mt-5 rounded-[1rem] border border-stone-300/50 bg-paper/70 p-4">
                <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.2em] text-heritage">
                  Delivery and payment
                </p>
                <p className="mt-2 font-body text-sm text-redacted">
                  {plan.deliveryNote}
                </p>
                <p className="mt-1 font-body text-sm text-redacted">
                  {plan.paymentNote}
                </p>
              </div>

              <ul className="mt-5 space-y-3">
                {plan.features.slice(0, 4).map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-heritage" />
                    <span className="font-body text-sm leading-6 text-ink">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}
