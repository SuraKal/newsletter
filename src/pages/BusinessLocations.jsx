import React from "react";
import { Link } from "react-router-dom";
import { Building2, Truck } from "lucide-react";
import {
  DashboardFilterBar,
  DashboardMetricCard,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardPrimitives";
import DeliveryMapPanel from "@/components/delivery/DeliveryMapPanel";
import LocationStatusTable from "@/components/delivery/LocationStatusTable";
import RouteSummaryPanel from "@/components/delivery/RouteSummaryPanel";
import { IMAGES } from "@/lib/constants";
import {
  businessLocationMetrics,
  businessLocationRows,
  businessShipmentRouteSummaries,
} from "@/lib/demoData";

export default function BusinessLocations() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business locations"
        title="Delivery destinations and receiving readiness"
        description="Location management should make site coverage, receiving contacts, and destination health easy to verify without collapsing into the live shipment workspace."
        action={
          <Link
            to="/business-dashboard/shipments"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Open shipments
            <Truck className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search site, city, or receiving contact"
        filters={["9 active locations", "Belgium + Germany", "1 review state"]}
        action={
          <Link
            to="/business-dashboard/team"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Receiving owners
            <Building2 className="h-4 w-4" />
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {businessLocationMetrics.map((metric) => (
          <DashboardMetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            accent={metric.accent}
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <LocationStatusTable
          title="Location status"
          description="Each branch, reception point, or partner site should stay visible as its own destination record."
          rows={businessLocationRows}
        />
        <RouteSummaryPanel
          title="Route alignment preview"
          description="Location management should still reflect how sites roll up into the shared regional route structure."
          items={businessShipmentRouteSummaries}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <DeliveryMapPanel
          title="Destination coverage"
          description="The map stays modular so richer location grouping can arrive later without changing the business locations layout."
          imageSrc={IMAGES.delivery}
          imageAlt="Business delivery destination coverage"
          tags={["Brussels", "Antwerp", "Cologne", "Berlin"]}
          caption="Business destination management should remain separate from live shipment timing while still reflecting the same regional footprint."
        />
      </section>
    </div>
  );
}
