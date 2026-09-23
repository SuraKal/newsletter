import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, ExternalLink, MapPin } from "lucide-react";
import {
  DashboardEmptyState,
  DashboardFactList,
  DashboardPageHeader,
  DashboardPanel,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import GeoapifyMap from "@/components/delivery/GeoapifyMap";
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
  if (status === "Address review") {
    return { label: "Approve address", next: { status: "Preparing", tone: "neutral" } };
  }

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

// Builds a Geoapify interactive embed URL for a saved company stop. Requires
// the tile key from the maps config, so it stays out of the public bundle.
const geoapifyLocationUrl = (location, mapConfig) => {
  if (
    !mapConfig?.apiKey ||
    !Number.isFinite(location.latitude) ||
    !Number.isFinite(location.longitude)
  ) {
    return null;
  }
  const center = `lonlat:${location.longitude},${location.latitude}`;
  return `https://maps.geoapify.com/v1/iframe/map?key=${encodeURIComponent(mapConfig.apiKey)}&center=${encodeURIComponent(center)}&zoom=15`;
};

export default function AdminShipmentDetail() {
  const { shipmentId } = useParams();
  const [shipment, setShipment] = useState(() =>
    appClient.shipments.getLocal(shipmentId),
  );
  const [activity, setActivity] = useState([]);
  const [busy, setBusy] = useState(false);
  const [mapConfig, setMapConfig] = useState(null);

  useEffect(() => {
    let mounted = true;
    appClient.maps.config().then((value) => {
      if (mounted) setMapConfig(value);
    });
    return () => {
      mounted = false;
    };
  }, []);

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

  // Flattens the run's company stops and subscriber destinations into marker
  // rows for the Geoapify route map.
  const shipmentMarkers = useMemo(() => {
    if (!shipment) {
      return [];
    }
    const companyStops = (shipment.deliveryLocations || []).map((location) => ({
      id: `company-${location.id}`,
      kind: "company",
      name: location.location || "Company stop",
      address:
        [location.address, location.region].filter(Boolean).join(", ") ||
        location.location,
      latitude: location.latitude,
      longitude: location.longitude,
      geocodeText:
        [location.address, location.region, location.location]
          .filter(Boolean)
          .join(", ") || undefined,
      copies: location.copies,
      contact: location.contact,
      status: location.status,
    }));
    const readerStops = (shipment.readerDestinations || []).map(
      (destination) => ({
        id: `reader-${destination.destination}`,
        kind: "reader",
        name: destination.name || "Subscriber delivery",
        address: destination.destination,
        latitude: null,
        longitude: null,
        geocodeText: destination.destination,
      }),
    );
    return [...companyStops, ...readerStops];
  }, [shipment]);

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
            { label: "Saved destinations", value: shipment.deliveryLocations?.length || "—" },
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
        title="Route map"
        description="Company stops and reader subscriber destinations for this run, plotted with Geoapify."
        className="p-5 sm:p-6"
      >
        <GeoapifyMap locations={shipmentMarkers} height={380} />
        <div className="mt-4 flex flex-wrap items-center gap-5">
          <span className="inline-flex items-center gap-2 font-sans text-xs font-medium text-stone-500 dark:text-stone-400">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: "#44403c" }}
            />
            Company stops
          </span>
          <span className="inline-flex items-center gap-2 font-sans text-xs font-medium text-stone-500 dark:text-stone-400">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: "#059669" }}
            />
            Reader deliveries
          </span>
        </div>
      </DashboardPanel>

      <DashboardPanel
        title="Delivery destinations"
        description="Saved company locations and the reader delivery profiles covered by this consolidated run."
        className="p-5 sm:p-6"
      >
        {shipment.deliveryLocations?.length ? (
          <div className="space-y-3">
            {shipment.deliveryLocations.map((location) => {
              const mapUrl = geoapifyLocationUrl(location, mapConfig);
              return (
                <div key={location.id} className="flex flex-col gap-3 rounded-xl border border-stone-200 p-4 sm:flex-row sm:items-start sm:justify-between dark:border-stone-700">
                  <div className="min-w-0">
                    <p className="font-sans text-sm font-semibold text-stone-900 dark:text-stone-100">{location.location}</p>
                    <p className="mt-1 flex items-start gap-2 font-sans text-sm text-stone-600 dark:text-stone-300"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{location.address || location.region}</p>
                    {location.region && location.address ? <p className="mt-1 font-sans text-xs text-stone-500">{location.region}</p> : null}
                    {location.contact ? <p className="mt-2 font-sans text-xs text-stone-500">Receiving contact: {location.contact}</p> : null}
                  </div>
                  {mapUrl ? (
                    <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-stone-300 px-3 py-2 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-200 dark:hover:bg-stone-800">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open in Geoapify
                    </a>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : <DashboardEmptyState title="No saved destinations for this run" description="This is a platform-wide run or the company has not saved a delivery address." />}

        {shipment.readerDestinations?.length ? (
          <div className="mt-6 border-t border-stone-200/80 pt-5 dark:border-stone-700/80">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
              Reader delivery profiles
            </p>
            <ul className="mt-3 space-y-2">
              {shipment.readerDestinations.map((destination) => (
                <li key={destination.destination} className="flex items-start gap-2 font-sans text-sm text-stone-700 dark:text-stone-200">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" />
                  <span className="min-w-0">
                    <span className="font-medium">{destination.name || "Subscriber delivery"}</span>
                    <span className="text-stone-500 dark:text-stone-400"> · {destination.destination}</span>
                    {destination.address ? <span className="block text-xs text-stone-500 dark:text-stone-400">{destination.address}</span> : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
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
