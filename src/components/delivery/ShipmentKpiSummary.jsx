import React from "react";
import {
  CalendarClock,
  CheckCircle2,
  Package,
  ShieldCheck,
} from "lucide-react";

const iconMap = {
  CalendarClock,
  CheckCircle2,
  Package,
  ShieldCheck,
};

export default function ShipmentKpiSummary({ items = [] }) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {items.map((item, index) => {
        const Icon = iconMap[item.icon] || Package;

        return (
          <article
            key={item.label}
            className={`dashboard-kpi-card p-5 ${
              item.accent || index === 1 ? "dashboard-kpi-card-accent" : ""
            }`.trim()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="dashboard-kpi-label font-sans text-[0.68rem] font-bold uppercase tracking-[0.24em]">
                  {item.label}
                </p>
                <p className="dashboard-kpi-value mt-3 font-sans text-3xl font-semibold tracking-tight">
                  {item.value}
                </p>
              </div>
              <div className="dashboard-panel-soft flex h-10 w-10 items-center justify-center">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            {item.detail ? (
              <p className="dashboard-kpi-detail mt-3 font-sans text-xs leading-5">
                {item.detail}
              </p>
            ) : null}
          </article>
        );
      })}
    </section>
  );
}
