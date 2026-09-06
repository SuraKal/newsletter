import React from "react";
import { Button } from "@/components/ui/button";

export default function AccountConsentForm({
  values,
  onChange,
  onSubmit,
  isSaving,
  checklist,
  error,
  successMessage,
  saveLabel = "Save consent settings",
  savingLabel = "Saving consents...",
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error ? (
        <div
          role="alert"
          className="rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-[1rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          {successMessage}
        </div>
      ) : null}

      <div className="space-y-4">
        {checklist.map((item) => {
          const fieldMap = {
            "Delivery coordination consent": "deliveryDataConsent",
            "Privacy update visibility": "privacyUpdatesOptIn",
            "Newsletter preference": "newsletterOptIn",
          };
          const field = item.field || fieldMap[item.title];

          return (
            <label
              key={item.title}
              className="flex items-start gap-3 rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4"
            >
              <input
                type="checkbox"
                checked={Boolean(values[field])}
                onChange={(e) => onChange(field, e.target.checked)}
                className="mt-1 accent-stone-900"
              />
              <span>
                <span className="block font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-900 dark:text-stone-100">
                  {item.title}
                </span>
                <span className="mt-2 block font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
                  {item.detail}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      <Button
        type="submit"
        disabled={isSaving}
        className="h-11 rounded-2xl bg-stone-900 px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-white hover:bg-stone-700"
      >
        {isSaving ? savingLabel : saveLabel}
      </Button>
    </form>
  );
}
