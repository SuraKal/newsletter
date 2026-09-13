import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  DashboardEmptyState,
  DashboardFactList,
  DashboardPageHeader,
  DashboardPanel,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import {
  adminShipmentActivityRows,
  adminShipmentRows,
} from "@/lib/demoData";

const relatedLinks = [
  { label: "Content", to: "/admin/content" },
  { label: "Schedule", to: "/admin/schedule" },
  { label: "Companies", to: "/admin/companies" },
  { label: "Subscribers", to: "/admin/subscribers" },
  { label: "Governance", to: "/admin/governance" },
  { label: "Pricing", to: "/admin/pricing" },
];

export default function AdminShipmentDetail() {
  const { shipmentId } = useParams();
  const shipment = adminShipmentRows.find(
    (row) => row.id === shipmentId,
  );

  if (!shipment) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          eyebrow="Admin shipments"
          title="Shipment run not found"
          breadcrumbs={[
            { label: "Admin workspace", to: "/admin/overview" },
            { label: "Shipments", to: "/admin/shipments" },
          ]}
          action={
            <Link
              to="/admin/shipments"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to shipments
            </Link>
          }
        />
        <DashboardPanel title="Delivery operations">
          <DashboardEmptyState title="No shipment run matches this ID." />
        </DashboardPanel>
        <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
      </div>
    );
  }

  const activity = adminShipmentActivityRows.filter(
    (row) => row.shipment === shipment.shipmentId,
  );

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin shipment run"
        title={shipment.shipmentId}
        description={shipment.label}
        breadcrumbs={[
          { label: "Admin workspace", to: "/admin/overview" },
          { label: "Shipments", to: "/admin/shipments" },
          { label: shipment.shipmentId },
        ]}
        action={
          <Link
            to="/admin/shipments"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to shipments
          </Link>
        }
      />

      <DashboardPanel title="Run facts" className="p-5 sm:p-6">
        <DashboardFactList
          items={[
            { label: "Route cluster", value: shipment.route },
            { label: "Coverage", value: shipment.scope },
            { label: "ETA", value: shipment.eta },
            {
              label: "State",
              value: (
                <DashboardStatusBadge label={shipment.status} tone={shipment.tone} />
              ),
            },
          ]}
        />
      </DashboardPanel>

      <DashboardPanel
        title="Run activity"
        description="Events attached to this shipment run."
        className="p-5 sm:p-6"
      >
        {activity.length ? (
          <div className="divide-y divide-stone-200/80 dark:divide-stone-700/80">
            {activity.map((event) => (
              <div
                key={event.id}
                className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-sans text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {event.event}
                  </p>
                  <p className="mt-0.5 font-sans text-xs text-stone-500">
                    {event.shipment} · {event.date}
                  </p>
                </div>
                <DashboardStatusBadge label={event.status} tone={event.tone} />
              </div>
            ))}
          </div>
        ) : (
          <DashboardEmptyState
            title="No activity logged for this run yet."
            description="Dispatch confirmations and route updates for this shipment will appear here."
          />
        )}
      </DashboardPanel>

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}