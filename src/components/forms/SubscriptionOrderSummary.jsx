import React from "react";
import { CalendarDays, Check, CreditCard, MapPin, Truck } from "lucide-react";

export default function SubscriptionOrderSummary({
  plan,
  billingCycle,
  quote,
  paymentMethodLabel,
}) {
  if (!plan || !quote) {
    return null;
  }

  return (
    <aside className="rounded-[1.5rem] border border-stone-300/60 bg-vellum p-6 shadow-[0_16px_38px_rgba(0,0,0,0.04)]">
      <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em] text-heritage">
        Order summary
      </p>
      <h2 className="mt-3 font-display text-2xl font-black text-ink">
        {plan.name}
      </h2>
      <p className="mt-2 font-body text-sm leading-6 text-redacted">
        {plan.description}
      </p>

      <div className="newspaper-rule my-6" />

      <div className="mb-6 rounded-[1rem] border border-stone-300/50 bg-paper/70 p-4">
        <p className="font-sans text-[0.64rem] font-bold uppercase tracking-[0.2em] text-heritage">
          Included in this plan
        </p>
        <ul className="mt-3 space-y-2">
          {plan.features.slice(0, 4).map((feature) => (
            <li key={feature} className="flex items-start gap-2 font-body text-sm text-ink">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-heritage" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <CreditCard className="mt-1 h-4 w-4 text-heritage" />
          <div>
            <p className="font-sans text-[0.64rem] font-bold uppercase tracking-[0.2em] text-redacted">
              Billing cycle
            </p>
            <p className="mt-1 font-body text-sm text-ink">
              {billingCycle === "yearly" ? "Yearly billing" : "Monthly billing"}
            </p>
            <p className="font-body text-sm text-redacted">
              €{quote.amount.toFixed(2)} due today
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Truck className="mt-1 h-4 w-4 text-heritage" />
          <div>
            <p className="font-sans text-[0.64rem] font-bold uppercase tracking-[0.2em] text-redacted">
              Delivery model
            </p>
            <p className="mt-1 font-body text-sm text-ink">
              {quote.deliveryMode}
            </p>
            <p className="font-body text-sm text-redacted">
              {quote.deliveryWindow}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CalendarDays className="mt-1 h-4 w-4 text-heritage" />
          <div>
            <p className="font-sans text-[0.64rem] font-bold uppercase tracking-[0.2em] text-redacted">
              Next charge
            </p>
            <p className="mt-1 font-body text-sm text-ink">{quote.nextChargeDate}</p>
            <p className="font-body text-sm text-redacted">
              Payment method: {paymentMethodLabel}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="mt-1 h-4 w-4 text-heritage" />
          <div>
            <p className="font-sans text-[0.64rem] font-bold uppercase tracking-[0.2em] text-redacted">
              Operating scope
            </p>
            <p className="mt-1 font-body text-sm text-ink">
              Belgium and Germany
            </p>
            <p className="font-body text-sm text-redacted">
              Checkout captures the delivery context needed for routing and account support.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
