import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  DashboardEmptyState,
  DashboardPageHeader,
  DashboardPanel,
  DashboardRelatedLinks,
} from "@/components/dashboard/DashboardPrimitives";
import ShipmentRunForm from "@/components/delivery/ShipmentRunForm";
import { appClient } from "@/api/appClient";

const relatedLinks = [
  { label: "Shipments", to: "/business-dashboard/shipments" },
  { label: "Order requests", to: "/business-dashboard/order-requests" },
  { label: "Orders", to: "/business-dashboard/orders" },
  { label: "Locations", to: "/business-dashboard/locations" },
];

export default function BusinessShipmentNew() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get("order") || "";
  const [entity] = useState(() => appClient.company.snapshot());
  const [orders, setOrders] = useState(() =>
    appClient.companyOrders
      .list()
      .filter((order) => order.status === "Approved"),
  );

  useEffect(() => {
    appClient.companyOrders.businessList().then((next) => {
      if (Array.isArray(next)) {
        setOrders(next.filter((order) => order.status === "Approved"));
      }
    });
  }, []);

  const canInitiate = Boolean(entity && entity.id);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business shipments"
        title="Start a shipment run"
        description="Initiate a consolidated run from one of your approved bulk orders to inherit its copies and delivery locations, or build a manual run on your own company account."
        breadcrumbs={[
          { label: "Business workspace", to: "/business-dashboard/overview" },
          { label: "Shipments", to: "/business-dashboard/shipments" },
          { label: "Start a run" },
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

      {!canInitiate ? (
        <DashboardPanel title="Company access required" className="p-5 sm:p-6">
          <DashboardEmptyState
            title="Your company account is not active yet"
            description="Shipment runs open once your business licence is approved and your company account is activated."
          />
        </DashboardPanel>
      ) : (
        <DashboardPanel
          title="New shipment run"
          description="Runs start Preparing and appear in both your delivery view and the admin dispatch surface."
          className="p-5 sm:p-6"
        >
          <ShipmentRunForm
            orders={orders}
            companies={[]}
            defaultMode={initialOrderId ? "bulk_order" : "bulk_order"}
            defaultOrderId={initialOrderId}
            onSubmit={async (payload) => {
              const row = await appClient.shipments.create(payload);
              navigate(`/business-dashboard/shipments/${row.id}`, {
                replace: true,
              });
              return row;
            }}
          />
        </DashboardPanel>
      )}

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}