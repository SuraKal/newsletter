import React from "react";
import { Link } from "react-router-dom";
import { Building2, MapPin } from "lucide-react";
import DeliveryMapPanel from "@/components/delivery/DeliveryMapPanel";
import ShipmentActivityTable from "@/components/delivery/ShipmentActivityTable";
import LocationStatusTable from "@/components/delivery/LocationStatusTable";
import MultiShipmentTable from "@/components/delivery/MultiShipmentTable";
import RouteSummaryPanel from "@/components/delivery/RouteSummaryPanel";
import ShipmentIssuePanel from "@/components/delivery/ShipmentIssuePanel";
import ShipmentKpiSummary from "@/components/delivery/ShipmentKpiSummary";
import {
  DashboardFilterBar,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardPrimitives";
import { IMAGES } from "@/lib/constants";
import {
  businessShipmentActivityRows,
  businessShipmentIssueStates,
  businessShipmentKpis,
  businessShipmentLocationRows,
  businessShipmentRouteSummaries,
  businessShipmentRows,
} from "@/lib/demoData";

export default function BusinessShipments() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business shipments"
        title="Consolidated delivery visibility across your locations"
        description="Business accounts need one operational shipment view that groups branch deliveries, route timing, and receiving readiness without forcing teams to inspect reader-style single drops."
        action={
          <Link
            to="/business-dashboard/locations"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Open locations
            <MapPin className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search shipment, branch, or route cluster"
        filters={["9 delivery points", "Belgium + Germany", "Contract shipment mode"]}
        action={
          <Link
            to="/business-dashboard/orders"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Open orders
            <Building2 className="h-4 w-4" />
          </Link>
        }
      />

      <ShipmentKpiSummary items={businessShipmentKpis} />

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <MultiShipmentTable
          title="Consolidated shipment runs"
          description="This business table stays grouped by shipment run so teams can track several destinations without dropping into an admin-only network view."
          rows={businessShipmentRows}
        />
        <RouteSummaryPanel
          title="Regional route summaries"
          description="Each contract shipment can still be understood by corridor, release window, and destination footprint."
          items={businessShipmentRouteSummaries}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <LocationStatusTable
          title="Location-level delivery status"
          description="Branch and receiving-point visibility stays close to the shipment list so businesses can confirm which sites are ready for the next drop."
          rows={businessShipmentLocationRows}
        />
        <ShipmentIssuePanel
          title="Exceptions and receiving notes"
          description="Business teams should see contract-safe issue states without being overloaded by every network-wide operations detail."
          items={businessShipmentIssueStates}
          footer="Bulk copy planning, invoice ownership, and receiving contact readiness remain aligned inside this shared business logistics view."
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <DeliveryMapPanel
          title="Coverage and receiving footprint"
          description="The map placeholder stays modular so later fleet data can deepen the experience without replacing the page structure."
          imageSrc={IMAGES.delivery}
          imageAlt="Business delivery network coverage"
          tags={["Brussels", "Antwerp", "Cologne", "Berlin"]}
          caption="Business shipment visibility stays consolidated even when one contract covers several offices, hospitality desks, or partner sites."
        />
        <ShipmentActivityTable
          title="Recent logistics activity"
          description="Business users should see operational follow-up and destination updates in the shipment workspace without dropping into the admin network view."
          rows={businessShipmentActivityRows}
        />
      </section>
    </div>
  );
}
