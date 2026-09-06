import React from "react";
import { MapPinned, Newspaper, Truck } from "lucide-react";
import { DashboardPanel, DashboardStatusBadge } from "@/components/dashboard/DashboardPrimitives";

export default function DeliveryStatusHero({
  eyebrow = "Current delivery",
  edition,
  trackingId,
  status,
  tone = "neutral",
  destination,
  eta,
  note,
}) {
  return (
    <DashboardPanel title={null} className="h-full">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-sans text-[0.64rem] font-bold uppercase tracking-[0.24em] text-stone-500">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            {edition}
          </h2>
          <p className="mt-2 font-sans text-sm text-stone-500">
            Tracking ID: {trackingId}
          </p>
        </div>
        <DashboardStatusBadge label={status} tone={tone} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="dashboard-panel-soft p-4">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
            <Truck className="h-4 w-4" />
            <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.2em]">
              Route status
            </p>
          </div>
          <p className="mt-3 font-sans text-lg font-semibold text-stone-900 dark:text-stone-100">
            {status}
          </p>
          <p className="mt-2 font-sans text-xs leading-5 text-stone-500">
            {note}
          </p>
        </div>
        <div className="dashboard-panel-soft p-4">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
            <MapPinned className="h-4 w-4" />
            <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.2em]">
              Destination
            </p>
          </div>
          <p className="mt-3 font-sans text-lg font-semibold text-stone-900 dark:text-stone-100">
            {destination}
          </p>
          <p className="mt-2 font-sans text-xs leading-5 text-stone-500">
            Address and route grouping stay visible here before the deeper location tools arrive.
          </p>
        </div>
        <div className="dashboard-panel-soft p-4">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
            <Newspaper className="h-4 w-4" />
            <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.2em]">
              Delivery window
            </p>
          </div>
          <p className="mt-3 font-sans text-lg font-semibold text-stone-900 dark:text-stone-100">
            {eta}
          </p>
          <p className="mt-2 font-sans text-xs leading-5 text-stone-500">
            Timing stays tied to the fixed two-week print cadence, not the billing cycle.
          </p>
        </div>
      </div>
    </DashboardPanel>
  );
}
