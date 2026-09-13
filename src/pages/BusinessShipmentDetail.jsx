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
  businessShipmentActivityRows,
  businessShipmentRows,
} from "@/lib/demoData";

const relatedLinks = [
  { label: "Team", to: "/business-dashboard/team" },
  { label: "Orders", to: "/business-dashboard/orders" },
  { label: "Invoices", to: "/business-dashboard/invoices" },
  { label: "Locations", to: "/business-dashboard/locations" },
  { label: "Settings", to: "/business-dashboard/settings" },
];

export default function BusinessShipmentDetail() {
  const { shipmentId } = useParams();
  const shipment = businessShipmentRows.find(
    (row) => row.id === shipmentId,
  );

  if (!shipment) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          eyebrow="Business shipments"
          title="Shipment run not found"
          breadcrumbs={[
            { label: "Business workspace", to: "/business-dashboard/overview" },
            { label: "Shipments", to: "/business-dashboard/shipments" },
          ]}
          action={
            <Link
              to="/business-dashboard/shipments"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to shipments
            </Link>
          }
        />
        <DashboardPanel title="Consolidated shipment runs">
          <DashboardEmptyState title="No shipment run matches this ID." />
        </DashboardPanel>
        <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
      </div>
    );
  }

  const activity = businessShipmentActivityRows.filter(
    (row) => row.shipment === shipment.shipmentId,
  );

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business shipment run"
        title={shipment.shipmentId}
        description={shipment.label}
        breadcrumbs={[
          { label: "Business workspace", to: "/business-dashboard/overview" },
          { label: "Shipments", to: "/business-dashboard/shipments" },
          { label: shipment.shipmentId },
        ]}
        action={
          <Link
            to="/business-dashboard/shipments"
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
            { label: "Account", value: shipment.label },
            { label: "Route cluster", value: shipment.route },
            { label: "Coverage", value: shipment.scope },
            { label: "Delivery window", value: shipment.eta },
            {
              label: "Status",
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
            description="Receiving confirmations and route updates for this shipment will appear here."
          />
        )}
      </DashboardPanel>

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}