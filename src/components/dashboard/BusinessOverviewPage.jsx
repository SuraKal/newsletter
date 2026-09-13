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
  DashboardStatusBadge,
  DashboardRelatedLinks,
} from "@/components/dashboard/DashboardPrimitives";
import { appParams } from "@/lib/app-params";
import { getBusinessCompanySnapshot } from "@/lib/company-store";
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

const statusFor = (entity) => {
  if (!entity) return { label: "No company profile", tone: "neutral" };
  if (entity.status === "Pending review") {
    return { label: "Under review", tone: "warning" };
  }
  if (entity.status === "Declined") return { label: "Declined", tone: "neutral" };
  if (entity.status === "Onboarding") {
    return { label: "Onboarding", tone: "neutral" };
  }
  return { label: "Active", tone: "success" };
};

export default function BusinessOverviewPage() {
  const entity = getBusinessCompanySnapshot();
  const statusInfo = statusFor(entity);

  const contractStateDetail =
    entity?.status === "Pending review"
      ? "Your application is in the commercial review queue and activates once approved in the admin companies workspace."
      : entity?.status === "Declined"
        ? "This application was declined by the commercial review team. Reach out to business@nekedem.local to restart onboarding."
        : entity?.status === "Onboarding"
          ? "Approved and moving through onboarding. Route setup and receiving contacts are being finalized."
          : "Account setup is pending. Start the business application to open the account.";

  const metrics =
    entity && entity.status !== "Pending review" && entity.status !== "Declined"
      ? entity.status === "Onboarding"
        ? [
            {
              label: "Contract state",
              value: "Onboarding",
              detail: contractStateDetail,
            },
            ...businessOverviewMetrics.slice(1),
          ]
        : businessOverviewMetrics
      : [
          {
            label: "Contract state",
            value: statusInfo.label,
            detail: contractStateDetail,
          },
          ...businessOverviewMetrics.slice(1),
        ];

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

      <DashboardPanel title="Company onboarding status" className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="font-sans text-sm font-semibold text-stone-900 dark:text-stone-100">
              {entity?.company || `${appParams.appName} Distribution Group`}
            </p>
            <p className="mt-1 max-w-2xl font-sans text-xs leading-5 text-stone-500">
              {entity?.status === "Pending review"
                ? "Awaiting commercial review. An approval from the admin companies workspace activates this account."
                : entity?.status === "Onboarding"
                  ? "Approved and moving through onboarding. Route setup and receiving contacts are being finalized."
                  : entity?.status === "Declined"
                    ? "This application was declined by the commercial review team."
                    : entity?.status
                      ? "Account is active and invoice-ready."
                      : "Start the business application to open this account."}
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
          {metrics.map((metric) => (
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
          { label: "Business partner application", to: "/business/apply" },
        ]}
      />
    </div>
  );
}