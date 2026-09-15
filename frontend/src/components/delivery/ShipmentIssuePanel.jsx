import React from "react";
import {
  AlertTriangle,
  LifeBuoy,
  MapPinned,
  ShieldCheck,
} from "lucide-react";
import {
  DashboardPanel,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";

const iconMap = {
  AlertTriangle,
  LifeBuoy,
  MapPinned,
  ShieldCheck,
};

export default function ShipmentIssuePanel({
  title,
  description = null,
  items = [],
  footer = null,
}) {
  return (
    <DashboardPanel title={title} description={description} className="h-full">
      <div className="space-y-4">
        {items.map((item) => {
          const Icon = iconMap[item.icon] || AlertTriangle;

          return (
            <article
              key={item.id || item.label}
              className="dashboard-panel-soft p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="dashboard-icon-badge flex h-10 w-10 items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                      {item.label}
                    </p>
                    <p className="mt-1 font-sans text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {item.summary}
                    </p>
                  </div>
                </div>
                <DashboardStatusBadge label={item.status} tone={item.tone} />
              </div>
              {item.detail ? (
                <p className="mt-3 font-sans text-sm leading-6 text-stone-600 dark:text-stone-300">
                  {item.detail}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>

      {footer ? (
        <p className="dashboard-page-description mt-4 font-sans text-xs leading-5">
          {footer}
        </p>
      ) : null}
    </DashboardPanel>
  );
}
