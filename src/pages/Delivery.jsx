import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Package, Truck } from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import DeliveryStatusHero from "@/components/delivery/DeliveryStatusHero";
import DeliveryTimelinePanel from "@/components/delivery/DeliveryTimelinePanel";
import DeliveryHistoryTable from "@/components/delivery/DeliveryHistoryTable";
import DeliveryMapPanel from "@/components/delivery/DeliveryMapPanel";
import ShipmentIssuePanel from "@/components/delivery/ShipmentIssuePanel";
import ShipmentKpiSummary from "@/components/delivery/ShipmentKpiSummary";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPrimitives";
import { IMAGES } from "@/lib/constants";
import {
  readerDeliveryCurrent,
  readerDeliveryHistoryRows,
  readerDeliveryIssueStates,
  readerDeliveryKpis,
  readerDeliveryTimeline,
} from "@/lib/demoData";

const deliveryIconMap = {
  Clock: Package,
  Package,
  Truck,
  MapPin,
};

const timelineItems = readerDeliveryTimeline.map((item) => ({
  ...item,
  icon: deliveryIconMap[item.icon] || Package,
}));

export default function Delivery() {
  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <DashboardPageHeader
          eyebrow="Public delivery view"
          title="Follow the newspaper delivery cycle"
          action={
            <Link
              to="/dashboard/deliveries"
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
            >
              Open reader delivery workspace
              <Truck className="h-4 w-4" />
            </Link>
          }
        />

        <section className="mt-6">
          <ShipmentKpiSummary items={readerDeliveryKpis} />
        </section>

        <section className="mt-6">
          <DeliveryStatusHero
            edition={readerDeliveryCurrent.edition}
            trackingId={readerDeliveryCurrent.trackingId}
            status={readerDeliveryCurrent.status}
            tone={readerDeliveryCurrent.tone}
            destination={readerDeliveryCurrent.destination}
            eta={readerDeliveryCurrent.eta}
            note={readerDeliveryCurrent.note}
          />
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-[1fr_0.95fr]">
          <DeliveryTimelinePanel
            title="Route progress"
            items={timelineItems}
          />
          <DeliveryMapPanel
            title="Coverage visual"
            imageSrc={IMAGES.delivery}
            imageAlt="Delivery route illustration"
          />
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <DeliveryHistoryTable
            title="Recent delivery history"
            rows={readerDeliveryHistoryRows}
          />
          <ShipmentIssuePanel
            title="Route health and issue states"
            items={readerDeliveryIssueStates}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
