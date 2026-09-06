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
  DashboardPanel,
  DashboardFilterBar,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardPrimitives";
import { IMAGES } from "@/lib/constants";
import {
  adminShipmentActivityRows,
  adminShipmentIssueStates,
  adminShipmentKpis,
  adminShipmentLocationRows,
  adminShipmentOpsNotes,
  adminShipmentRouteSummaries,
  adminShipmentRows,
} from "@/lib/demoData";

export default function AdminShipments() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin shipments"
        title="Network-wide outbound delivery operations"
        description="Operations staff need a cross-account shipment view that surfaces active routes, delayed corridors, and location-level fulfillment signals across both subscriber and business deliveries."
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

      <ShipmentKpiSummary items={adminShipmentKpis} />

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <MultiShipmentTable
          title="Active outbound shipments"
          description="Admin operations can inspect several live runs at once instead of drilling into one subscriber or company shipment at a time."
          rows={adminShipmentRows}
        />
        <RouteSummaryPanel
          title="Corridor health summaries"
          description="Route-level health stays visible beside the shipment list so delays and stable corridors are easy to compare."
          items={adminShipmentRouteSummaries}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <LocationStatusTable
          title="Location and stop status"
          description="Operations should be able to see destination-level readiness, receiving state, and delay watch signals without leaving the shipment workspace."
          rows={adminShipmentLocationRows}
        />
        <ShipmentIssuePanel
          title="Delay and escalation states"
          description="Issue-state visibility keeps the admin surface operational instead of burying route trouble inside generic dashboard notes."
          items={adminShipmentIssueStates}
          footer="The same issue-state language can later absorb live fleet alerts, reroute events, and support callbacks once the logistics integration is connected."
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <DeliveryMapPanel
          title="Network coverage placeholder"
          description="A deeper fleet map can arrive later without changing the overall admin shipment workspace layout."
          imageSrc={IMAGES.delivery}
          imageAlt="Admin network delivery coverage"
          tags={["All outbound routes", "Belgium", "Germany", "Ops monitoring"]}
          caption="The admin workspace keeps consolidated network context visible while list and issue modules handle the operational detail."
        />
        <ShipmentActivityTable
          title="Recent logistics activity"
          description="Operations teams should see escalation events, route confirmations, and manifest updates without leaving the shipment workspace."
          rows={adminShipmentActivityRows}
        />
      </section>

      <section>
        <DashboardPanel
          title="Operations handling notes"
          description="Keep the logistics model visible so the admin shipment page remains a true operations surface rather than a generic dashboard summary."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {adminShipmentOpsNotes.map((item) => (
              <div
                key={item}
                className="rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4"
              >
                <p className="font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </DashboardPanel>
      </section>
    </div>
  );
}
