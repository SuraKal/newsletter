import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  FileText,
  LayoutDashboard,
  MapPinned,
  Package,
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
  DashboardStatusBadge,
  DashboardRelatedLinks,
} from "@/components/dashboard/DashboardPrimitives";
import { appParams } from "@/lib/app-params";
import {
  getCompanyWorkflowPresentation,
  getCompanyWorkflowState,
} from "@/lib/company-store";
import {
  businessOverviewMetrics,
} from "@/lib/demoData";
import { useWorkspaceSectionBadges } from "@/lib/notifications";
import { useStoreVersion } from "@/lib/store-bus";

const sectionIconMap = {
  overview: LayoutDashboard,
  team: Users,
  orders: Package,
  "order-requests": ReceiptText,
  invoices: FileText,
  locations: MapPinned,
  shipments: Truck,
  settings: ShieldCheck,
};

export default function BusinessOverviewPage() {
  useStoreVersion();
  const [entity, setEntity] = useState(() => appClient.company.snapshot());
  const [metrics, setMetrics] = useState(() => businessOverviewMetrics);

  useEffect(() => {
    let cancelled = false;
    appClient.company.refresh().then((nextEntity) => {
      if (!cancelled && nextEntity) setEntity(nextEntity);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    appClient.company
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

  const workflow = getCompanyWorkflowPresentation(entity);
  const workflowState = getCompanyWorkflowState(entity);
  const statusInfo = entity
    ? workflow
    : { label: "No company profile", tone: "neutral" };
  const sectionBadges = useWorkspaceSectionBadges("business");

  const contractStateDetail =
    entity ? workflow.detail : "Start a business registration to have your company licence reviewed for access.";

  const displayedMetrics = entity && workflowState === "License approved"
    ? metrics
    : [{ label: "Account access", value: statusInfo.label, detail: contractStateDetail }, ...metrics.slice(1)];

  const shortcuts = [
    { id: "team", label: "Team", to: "/business-dashboard/team" },
    { id: "orders", label: "Orders", to: "/business-dashboard/orders" },
    { id: "order-requests", label: "Order requests", to: "/business-dashboard/order-requests" },
    { id: "invoices", label: "Invoices", to: "/business-dashboard/invoices" },
    { id: "locations", label: "Locations", to: "/business-dashboard/locations" },
    { id: "shipments", label: "Shipments", to: "/business-dashboard/shipments" },
    { id: "settings", label: "Settings", to: "/business-dashboard/settings" },
  ].map((tool) => ({
    ...tool,
    icon: sectionIconMap[tool.id],
    badge: sectionBadges[tool.id],
  }));

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business workspace"
        title="Business account"
        breadcrumbs={[{ label: "Business workspace" }, { label: "Overview" }]}
        action={
          <Link
            to={workflowState === "License approved" ? "/business-dashboard/order-requests" : workflow.actionPath}
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            {workflowState === "License approved" ? "Place bulk order" : workflow.action}
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardPanel title="Company onboarding status" className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="font-sans text-sm font-semibold text-stone-900 dark:text-stone-100">
              {entity?.company || `${appParams.appName} Distribution Group`}
            </p>
            <p className="mt-1 max-w-2xl font-sans text-xs leading-5 text-stone-500">
              {contractStateDetail}
            </p>
          </div>
          <DashboardStatusBadge
            label={statusInfo.label}
            tone={statusInfo.tone}
          />
        </div>
      </DashboardPanel>

      <DashboardShortcuts
        title="Quick links"
        description="Open a focused operational section instead of one page with everything at once."
        items={shortcuts}
        columns={3}
      />

      <DashboardPanel title="At a glance" className="p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-5">
          {displayedMetrics.map((metric) => (
            <div key={metric.label}>
              <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
                {metric.label}
              </p>
              <p className="mt-1.5 font-sans text-lg font-semibold text-stone-900 dark:text-stone-100">
                {metric.value}
              </p>
              {metric.detail ? (
                <p className="mt-1 font-sans text-xs leading-4 text-stone-500">
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
          { label: "Public business page", to: "/business" },
          { label: "How bulk ordering works", to: "/business" },
        ]}
      />
    </div>
  );
}
