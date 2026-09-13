import React from "react";
import {
  ArrowRight,
  FileText,
  LayoutDashboard,
  MapPinned,
  Package,
  ShieldCheck,
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
import {
  businessOverviewMetrics,
} from "@/lib/demoData";

const sectionIconMap = {
  overview: LayoutDashboard,
  team: Users,
  orders: Package,
  invoices: FileText,
  locations: MapPinned,
  shipments: Truck,
  settings: ShieldCheck,
};

export default function BusinessOverviewPage() {
  const shortcuts = [
    { id: "team", label: "Team", to: "/business-dashboard/team" },
    { id: "orders", label: "Orders", to: "/business-dashboard/orders" },
    { id: "invoices", label: "Invoices", to: "/business-dashboard/invoices" },
    { id: "locations", label: "Locations", to: "/business-dashboard/locations" },
    { id: "shipments", label: "Shipments", to: "/business-dashboard/shipments" },
    { id: "settings", label: "Settings", to: "/business-dashboard/settings" },
  ].map((tool) => ({
    ...tool,
    icon: sectionIconMap[tool.id],
  }));

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business workspace"
        title="Business account"
        breadcrumbs={[{ label: "Business workspace" }, { label: "Overview" }]}
        action={
          <Link
            to="/business-dashboard/shipments"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Open shipment workspace
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardShortcuts
        title="Quick links"
        description="Open a focused operational section instead of one page with everything at once."
        items={shortcuts}
        columns={3}
      />

      <DashboardPanel title="At a glance" className="p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-5">
          {businessOverviewMetrics.map((metric) => (
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
          { label: "Public business page", to: "/business" },
          { label: "Business partner application", to: "/business/apply" },
        ]}
      />
    </div>
  );
}