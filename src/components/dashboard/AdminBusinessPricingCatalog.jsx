import React, { useEffect, useMemo, useState } from "react";
import { Check, RotateCcw, Save } from "lucide-react";
import { appClient } from "@/api/appClient";
import { useBusinessPricing } from "@/lib/business-pricing-catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const toFormState = (tier) => ({ ...tier });

export default function AdminBusinessPricingCatalog() {
  const tiers = useBusinessPricing();
  const [selectedId, setSelectedId] = useState(tiers[0]?.id || "");
  const [form, setForm] = useState(() => tiers[0] ? toFormState(tiers[0]) : null);
  const [status, setStatus] = useState("");
  const selectedTier = useMemo(
    () => tiers.find((tier) => tier.id === selectedId) || tiers[0],
    [selectedId, tiers],
  );

  useEffect(() => {
    if (selectedTier) {
      setSelectedId(selectedTier.id);
      setForm(toFormState(selectedTier));
    }
  }, [selectedTier]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setStatus("");
  };

  const saveTier = async (event) => {
    event.preventDefault();
    if (!form || !selectedTier) return;
    try {
      await appClient.businessPricing.update(selectedTier.id, form);
      setStatus("Saved. The public business pricing cards are now updated.");
    } catch (error) {
      setStatus(error.message || "The pricing tier could not be saved.");
    }
  };

  const resetPricing = async () => {
    try {
      await appClient.businessPricing.reset();
      setStatus("Business pricing restored to the seeded catalog.");
    } catch (error) {
      setStatus(error.message || "The pricing catalog could not be reset.");
    }
  };

  if (!form || !selectedTier) return null;

  return (
    <section className="dashboard-panel p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="dashboard-page-eyebrow">Public company pricing</p>
          <h2 className="mt-1 font-display text-2xl font-black text-stone-900 dark:text-stone-100">Business pricing catalog</h2>
          <p className="mt-2 max-w-2xl font-sans text-sm text-stone-500 dark:text-stone-400">
            These volume tiers are the same cards shown on the public business page.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={resetPricing} className="gap-2 rounded-full font-sans text-xs uppercase tracking-[0.16em]">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset pricing
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(180px,0.7fr)_minmax(0,1.5fr)]">
        <div className="space-y-2">
          {tiers.map((tier) => (
            <button
              key={tier.id}
              type="button"
              onClick={() => setSelectedId(tier.id)}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${tier.id === selectedTier.id ? "border-[#4A2A08] bg-[#4A2A08] text-white" : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"}`}
            >
              <span className="block font-sans text-xs font-bold uppercase tracking-[0.14em]">{tier.tier}</span>
              <span className="mt-1 block font-sans text-xs opacity-70">{tier.volume}</span>
            </button>
          ))}
        </div>

        <form onSubmit={saveTier} className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5">
            <Label htmlFor="business-tier-name">Tier name</Label>
            <Input id="business-tier-name" value={form.tier} onChange={(event) => updateField("tier", event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <Label htmlFor="business-tier-volume">Volume band</Label>
            <Input id="business-tier-volume" value={form.volume} onChange={(event) => updateField("volume", event.target.value)} />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="business-tier-pricing">Pricing label</Label>
            <Input id="business-tier-pricing" value={form.pricing} onChange={(event) => updateField("pricing", event.target.value)} />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="business-tier-billing">Billing model</Label>
            <Textarea id="business-tier-billing" value={form.billing} onChange={(event) => updateField("billing", event.target.value)} />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="business-tier-note">Public note</Label>
            <Textarea id="business-tier-note" value={form.note} onChange={(event) => updateField("note", event.target.value)} />
          </label>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <Button type="submit" className="gap-2 rounded-full bg-[#4A2A08] font-sans text-xs uppercase tracking-[0.16em] hover:bg-stone-900">
              <Save className="h-4 w-4" />
              Save tier
            </Button>
            {status ? <span className="font-sans text-xs text-stone-500">{status}</span> : null}
          </div>
        </form>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-stone-200 pt-4 font-sans text-xs text-stone-500">
        <Check className="h-4 w-4 text-emerald-600" />
        Public `/business` cards, admin pricing records, and company-facing copy now share one catalog.
      </div>
    </section>
  );
}
