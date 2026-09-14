import React, { useEffect, useMemo, useState } from "react";
import { Check, RotateCcw, Save } from "lucide-react";
import { appClient } from "@/api/appClient";
import { useSubscriptionPlans } from "@/lib/subscription-catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const toFormState = (plan) => ({
  ...plan,
  featuresText: plan.features.join("\n"),
});

const toPlanUpdates = (form) => ({
  name: form.name,
  price: form.price,
  monthlyPrice: form.price === "Custom" ? 0 : form.monthlyPrice,
  yearlyPrice: form.price === "Custom" ? 0 : form.yearlyPrice,
  description: form.description,
  features: form.featuresText
    .split("\n")
    .map((feature) => feature.trim())
    .filter(Boolean),
  highlighted: Boolean(form.highlighted),
  audience: form.audience,
  deliveryNote: form.deliveryNote,
  paymentNote: form.paymentNote,
});

export default function AdminSubscriptionCatalog() {
  const plans = useSubscriptionPlans();
  const [selectedId, setSelectedId] = useState(plans[0]?.id || "");
  const [form, setForm] = useState(() =>
    plans[0] ? toFormState(plans[0]) : null,
  );
  const [status, setStatus] = useState("");
  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedId) || plans[0],
    [plans, selectedId],
  );

  useEffect(() => {
    if (!selectedPlan) {
      return;
    }
    setSelectedId(selectedPlan.id);
    setForm(toFormState(selectedPlan));
  }, [selectedPlan]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setStatus("");
  };

  const savePlan = async (event) => {
    event.preventDefault();
    if (!form || !selectedPlan) {
      return;
    }

    try {
      await appClient.subscriptions.update(selectedPlan.id, toPlanUpdates(form));
      setStatus("Saved. Public subscription pages now use this plan.");
    } catch (error) {
      setStatus(error.message || "The plan could not be saved.");
    }
  };

  const resetPlans = async () => {
    try {
      await appClient.subscriptions.reset();
      setStatus("Plans restored to the seeded catalog.");
    } catch (error) {
      setStatus(error.message || "The plans could not be reset.");
    }
  };

  if (!form || !selectedPlan) {
    return null;
  }

  return (
    <section className="dashboard-panel p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="dashboard-page-eyebrow">Public reader plans</p>
          <h2 className="mt-1 font-display text-2xl font-black text-stone-900 dark:text-stone-100">
            Subscription catalog
          </h2>
          <p className="mt-2 max-w-2xl font-sans text-sm text-stone-500 dark:text-stone-400">
            Edit the plans shown on the public subscriptions page and checkout.
          </p>
        </div>
        <button
          type="button"
          onClick={resetPlans}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-stone-600 transition-colors hover:bg-stone-50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset seed plans
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(180px,0.7fr)_minmax(0,1.5fr)]">
        <div className="space-y-2">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedId(plan.id)}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                plan.id === selectedPlan.id
                  ? "border-[#4A2A08] bg-[#4A2A08] text-white"
                  : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
              }`}
            >
              <span className="block font-sans text-xs font-bold uppercase tracking-[0.14em]">
                {plan.name}
              </span>
              <span className="mt-1 block font-sans text-xs opacity-70">
                {plan.price === "Custom"
                  ? "Custom"
                  : `€${plan.monthlyPrice}/mo · €${plan.yearlyPrice}/yr`}
              </span>
            </button>
          ))}
        </div>

        <form onSubmit={savePlan} className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5">
            <Label htmlFor="subscription-plan-name">Plan name</Label>
            <Input id="subscription-plan-name" value={form.name} onChange={(event) => updateField("name", event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <Label htmlFor="subscription-plan-price">Display price</Label>
            <Input id="subscription-plan-price" value={form.price} onChange={(event) => updateField("price", event.target.value)} placeholder="9.99 or Custom" />
          </label>
          <label className="space-y-1.5">
            <Label htmlFor="subscription-plan-monthly-price">Monthly price</Label>
            <Input id="subscription-plan-monthly-price" type="number" min="0" step="0.01" value={form.monthlyPrice} onChange={(event) => updateField("monthlyPrice", Number(event.target.value))} disabled={form.price === "Custom"} />
          </label>
          <label className="space-y-1.5">
            <Label htmlFor="subscription-plan-yearly-price">Yearly price</Label>
            <Input id="subscription-plan-yearly-price" type="number" min="0" step="0.01" value={form.yearlyPrice} onChange={(event) => updateField("yearlyPrice", Number(event.target.value))} disabled={form.price === "Custom"} />
          </label>
          <label className="space-y-1.5">
            <Label htmlFor="subscription-plan-audience">Audience</Label>
            <Input id="subscription-plan-audience" value={form.audience} onChange={(event) => updateField("audience", event.target.value)} />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="subscription-plan-description">Description</Label>
            <Input id="subscription-plan-description" value={form.description} onChange={(event) => updateField("description", event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <Label htmlFor="subscription-plan-delivery">Delivery note</Label>
            <Input id="subscription-plan-delivery" value={form.deliveryNote} onChange={(event) => updateField("deliveryNote", event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <Label htmlFor="subscription-plan-payment">Payment note</Label>
            <Input id="subscription-plan-payment" value={form.paymentNote} onChange={(event) => updateField("paymentNote", event.target.value)} />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="subscription-plan-features">Features, one per line</Label>
            <Textarea id="subscription-plan-features" className="min-h-32 resize-y" value={form.featuresText} onChange={(event) => updateField("featuresText", event.target.value)} />
          </label>
          <label className="flex items-center gap-2 font-sans text-sm text-stone-700 dark:text-stone-300 sm:col-span-2">
            <input type="checkbox" checked={Boolean(form.highlighted)} onChange={(event) => updateField("highlighted", event.target.checked)} />
            Mark as the highlighted public plan
          </label>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <Button type="submit" className="gap-2 rounded-full bg-[#4A2A08] font-sans text-xs uppercase tracking-[0.16em] hover:bg-stone-900">
              <Save className="h-4 w-4" />
              Save plan
            </Button>
            {status ? <span className="font-sans text-xs text-stone-500">{status}</span> : null}
          </div>
        </form>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-stone-200 pt-4 font-sans text-xs text-stone-500">
        <Check className="h-4 w-4 text-emerald-600" />
        Changes are shared by the public subscription page, homepage cards, and reader checkout.
      </div>
    </section>
  );
}
