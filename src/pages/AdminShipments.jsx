import React from "react";
import { Link } from "react-router-dom";
import { Building2, Users } from "lucide-react";
import DeliveryMapPanel from "@/components/delivery/DeliveryMapPanel";
import LocationStatusTable from "@/components/delivery/LocationStatusTable";
import MultiShipmentTable from "@/components/delivery/MultiShipmentTable";
import RouteSummaryPanel from "@/components/delivery/RouteSummaryPanel";
import ShipmentActivityTable from "@/components/delivery/ShipmentActivityTable";
import ShipmentIssuePanel from "@/components/delivery/ShipmentIssuePanel";
import ShipmentKpiSummary from "@/components/delivery/ShipmentKpiSummary";
import {
  DashboardFilterBar,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardPrimitives";
import { IMAGES } from "@/lib/constants";
import {
  adminShipmentActivityRows,
  adminShipmentIssueStates,
  adminShipmentKpis,
  adminShipmentLocationRows,
  adminShipmentRouteSummaries,
  adminShipmentRows,
} from "@/lib/demoData";

const stripDetail = (items) =>
  items.map(({ detail, ...item }) => item);

export default function AdminShipments() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin shipments"
        title="Network-wide outbound delivery operations"
        action={
          <Link
            to="/admin/companies"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Open companies
            <Building2 className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search route, shipment ID, or company run"
        filters={["24 outbound shipments", "2 delayed routes", "Fleet feed placeholder"]}
        action={
          <Link
            to="/admin/subscribers"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Open subscribers
            <Users className="h-4 w-4" />
          </Link>
        }
      />

      <ShipmentKpiSummary items={stripDetail(adminShipmentKpis)} />

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <MultiShipmentTable
          title="Active outbound shipments"
          description=""
          rows={adminShipmentRows}
        />
        <RouteSummaryPanel
          title="Corridor health summaries"
          items={adminShipmentRouteSummaries}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <LocationStatusTable
          title="Location and stop status"
          description=""
          rows={adminShipmentLocationRows}
        />
        <ShipmentIssuePanel
          title="Delay and escalation states"
          items={stripDetail(adminShipmentIssueStates)}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <DeliveryMapPanel
          title="Network coverage placeholder"
          imageSrc={IMAGES.delivery}
          imageAlt="Admin network delivery coverage"
          tags={["All outbound routes", "Belgium", "Germany", "Ops monitoring"]}
        />
        <ShipmentActivityTable
          title="Recent logistics activity"
          description=""
          rows={adminShipmentActivityRows}
        />
      </section>


    </div>
  );
}
