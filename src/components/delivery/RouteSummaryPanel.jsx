import React from "react";
import { Route, Truck } from "lucide-react";
import {
  DashboardPanel,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";

export default function RouteSummaryPanel({
  title,
  description,
  items = [],
}) {
  return (
    <DashboardPanel title={title} description={description} className="h-full">
      <div className="space-y-4">
        {items.map((item) => (
          <article key={item.id || item.route} className="dashboard-panel-soft p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
                  <Route className="h-4 w-4" />
                  <p className="font-sans text-sm font-semibold">
                    {item.route}
                  </p>
                </div>
                <p className="mt-2 font-sans text-xs uppercase tracking-[0.18em] text-stone-500">
                  {item.window}
                </p>
              </div>
              <DashboardStatusBadge label={item.status} tone={item.tone} />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                  Shipments
                </p>
                <p className="mt-1 font-sans text-lg font-semibold text-stone-900 dark:text-stone-100">
                  {item.shipments}
                </p>
              </div>
              <div>
                <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                  Destinations
                </p>
                <p className="mt-1 font-sans text-lg font-semibold text-stone-900 dark:text-stone-100">
                  {item.destinations}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 text-stone-500">
              <Truck className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="font-sans text-sm leading-6">{item.note}</p>
            </div>
          </article>
        ))}
      </div>
    </DashboardPanel>
  );
}
