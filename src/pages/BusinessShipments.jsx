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

const stripDetail = (items) =>
  items.map(({ detail, ...item }) => item);

export default function BusinessShipments() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business shipments"
        title="Consolidated delivery visibility across your locations"
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

      <ShipmentKpiSummary items={stripDetail(businessShipmentKpis)} />

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <MultiShipmentTable
          title="Consolidated shipment runs"
          description=""
          rows={businessShipmentRows}
        />
        <RouteSummaryPanel
          title="Regional route summaries"
          items={businessShipmentRouteSummaries}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <LocationStatusTable
          title="Location-level delivery status"
          description=""
          rows={businessShipmentLocationRows}
        />
        <ShipmentIssuePanel
          title="Exceptions and receiving notes"
          items={stripDetail(businessShipmentIssueStates)}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <DeliveryMapPanel
          title="Coverage and receiving footprint"
          imageSrc={IMAGES.delivery}
          imageAlt="Business delivery network coverage"
          tags={["Brussels", "Antwerp", "Cologne", "Berlin"]}
        />
        <ShipmentActivityTable
          title="Recent logistics activity"
          description=""
          rows={businessShipmentActivityRows}
        />
      </section>
    </div>
  );
}
