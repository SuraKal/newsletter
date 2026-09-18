import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import {
  DashboardEmptyState,
  DashboardFactList,
  DashboardPageHeader,
  DashboardPanel,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { appClient } from "@/api/appClient";

const relatedLinks = [
  { label: "Content", to: "/admin/content" },
  { label: "Schedule", to: "/admin/schedule" },
  { label: "Companies", to: "/admin/companies" },
  { label: "Subscribers", to: "/admin/subscribers" },
  { label: "Governance", to: "/admin/governance" },
  { label: "Order requests", to: "/admin/order-requests" },
];

const actionForStatus = (status) => {
  if (status === "Delay flagged") {
    return { label: "Resolve delay", next: { status: "In dispatch", tone: "info" } };
  }

  if (status === "Preparing") {
    return { label: "Confirm dispatch", next: { status: "In dispatch", tone: "info" } };
  }

  if (status === "In dispatch") {
    return { label: "Mark delivered", next: { status: "Delivered", tone: "success" } };
  }

  return null;
};

export default function AdminShipmentDetail() {
  const { shipmentId } = useParams();
  const [shipment, setShipment] = useState(() =>
    appClient.shipments.getLocal(shipmentId),
  );
  const [activity, setActivity] = useState([]);
  const [busy, setBusy] = useState(false);

  const loadShipment = async () => {
    const result = await appClient.shipments.getAdmin(shipmentId);
    if (result) {
      setShipment(result.shipment);
      setActivity(result.activity);
    } else {
      setShipment(null);
      setActivity([]);
    }
  };

  useEffect(() => {
    loadShipment();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipmentId]);

  const action = shipment ? actionForStatus(shipment.status) : null;

  const handleAction = async () => {
    if (!shipment || !action) return;
    setBusy(true);
    try {
      const row = await appClient.shipments.advanceAdmin(shipment.id);
      if (row) setShipment(row);
      await loadShipment();
    } catch {
      // Leave the record in place; the next refresh reconciles the state.
    } finally {
      setBusy(false);
    }
  };

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
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/shipments"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to shipments
            </Link>
            {action ? (
              <button
                type="button"
                onClick={handleAction}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-100 dark:text-stone-900"
              >
                <Check className="h-4 w-4" />
                {action.label}
              </button>
            ) : null}
          </div>
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