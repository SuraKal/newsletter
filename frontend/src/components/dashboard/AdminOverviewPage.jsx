import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  PenSquare,
  ReceiptText,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { appClient } from "@/api/appClient";
import {
  DashboardPageHeader,
  DashboardPanel,
  DashboardShortcuts,
  DashboardRelatedLinks,
} from "@/components/dashboard/DashboardPrimitives";
import { adminOverviewMetrics } from "@/lib/demoData";
import { useWorkspaceSectionBadges } from "@/lib/notifications";

const sectionIconMap = {
  overview: LayoutDashboard,
  content: PenSquare,
  schedule: CalendarDays,
  subscribers: Users,
  companies: Building2,
  governance: ShieldCheck,
  shipments: Truck,
  "order-requests": ReceiptText,
  subscriptions: CreditCard,
};

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState(() => adminOverviewMetrics);
  const sectionBadges = useWorkspaceSectionBadges("admin");

  useEffect(() => {
    let cancelled = false;
    appClient.admin
      .overview()
      .then((nextMetrics) => {
        if (!cancelled && Array.isArray(nextMetrics) && nextMetrics.length) {
          setMetrics(nextMetrics);
        }
      })
      .catch(() => {
        // Keep the fallback metrics if the aggregate endpoint is unavailable.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const shortcuts = [
    { id: "content", label: "Content", to: "/admin/content" },
    { id: "schedule", label: "Schedule", to: "/admin/schedule" },
    { id: "subscribers", label: "Subscribers", to: "/admin/subscribers" },
    { id: "companies", label: "Companies", to: "/admin/companies" },
    { id: "governance", label: "Governance", to: "/admin/governance" },
    { id: "shipments", label: "Shipments", to: "/admin/shipments" },
    { id: "subscriptions", label: "Subscriptions", to: "/admin/subscriptions" },
    { id: "order-requests", label: "Order requests", to: "/admin/order-requests" },
  ].map((tool) => ({
    ...tool,
    icon: sectionIconMap[tool.id],
    badge: sectionBadges[tool.id],
    description: tool.label === "Content" ? "Workflow made clearer" : undefined,
  }));

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin workspace"
        title="Admin operations"
        breadcrumbs={[{ label: "Admin workspace" }, { label: "Overview" }]}
        action={
          <Link
            to="/admin/content"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Open content workspace
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardShortcuts
        title="Quick links"
        description="Focus on one operation at a time; each section has its own page."
        items={shortcuts}
        columns={3}
      />

      <DashboardPanel title="At a glance" className="p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-5">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
                {metric.label}
              </p>
              <p className="mt-1.5 font-sans text-lg font-semibold text-stone-900 dark:text-stone-100">
                {metric.value}
              </p>
              {metric.detail ? (
                <p className="mt-1 font-sans text-xs leading-4 text-stone-500 dark:text-stone-400">
                  {metric.detail}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </DashboardPanel>

      <DashboardRelatedLinks
        title="Related links"
        items={[
          { label: "Public newsroom", to: "/news" },
          { label: "Public business page", to: "/business" },
        ]}
      />
    </div>
  );
}
