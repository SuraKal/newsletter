import React from "react";

export default function CheckoutProgress({ steps, currentStepId }) {
  const currentIndex = steps.findIndex((step) => step.id === currentStepId);

  return (
    <div className="rounded-[1.35rem] border border-stone-300/60 bg-vellum/80 p-5">
      <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.22em] text-heritage">
        Checkout progress
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => {
          const isActive = step.id === currentStepId;
          const isComplete = index < currentIndex;

          return (
            <div
              key={step.id}
              className={`rounded-[1.1rem] border p-4 transition ${
                isActive
                  ? "border-heritage bg-paper shadow-[0_14px_26px_rgba(76,43,8,0.08)]"
                  : isComplete
                    ? "border-emerald-200 bg-emerald-50/80"
                    : "border-stone-300/50 bg-paper/70"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full font-sans text-[0.68rem] font-bold ${
                    isActive
                      ? "bg-heritage text-paper"
                      : isComplete
                        ? "bg-emerald-600 text-white"
                        : "bg-stone-200 text-ink"
                  }`}
                >
                  {index + 1}
                </span>
                <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-ink">
                  {step.label}
                </p>
              </div>
              <p className="mt-3 font-body text-sm leading-6 text-redacted">
                {step.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
