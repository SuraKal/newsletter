import React from "react";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  PenSquare,
  Truck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  DashboardPageHeader,
  DashboardPanel,
  DashboardShortcuts,
  DashboardRelatedLinks,
} from "@/components/dashboard/DashboardPrimitives";
import { adminOverviewMetrics } from "@/lib/demoData";

const sectionIconMap = {
  overview: LayoutDashboard,
  content: PenSquare,
  schedule: CalendarDays,
  subscribers: Users,
  companies: Building2,
  shipments: Truck,
  pricing: CreditCard,
};

export default function AdminOverviewPage() {
  const shortcuts = [
    { id: "content", label: "Content", to: "/admin/content" },
    { id: "schedule", label: "Schedule", to: "/admin/schedule" },
    { id: "subscribers", label: "Subscribers", to: "/admin/subscribers" },
    { id: "companies", label: "Companies", to: "/admin/companies" },
    { id: "shipments", label: "Shipments", to: "/admin/shipments" },
    { id: "pricing", label: "Pricing", to: "/admin/pricing" },
  ].map((tool) => ({
    ...tool,
    icon: sectionIconMap[tool.id],
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
          {adminOverviewMetrics.map((metric) => (
            <div key={metric.label}>
              <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
                {metric.label}
              </p>
              <p className="mt-1.5 font-sans text-lg font-semibold text-stone-900 dark:text-stone-100">
                {metric.value}
              </p>
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