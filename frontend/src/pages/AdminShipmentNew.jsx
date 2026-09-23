import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  DashboardPageHeader,
  DashboardPanel,
  DashboardRelatedLinks,
} from "@/components/dashboard/DashboardPrimitives";
import ShipmentRunForm from "@/components/delivery/ShipmentRunForm";
import { appClient } from "@/api/appClient";
import { backendCompanies, isNetworkError } from "@/api/backendClient";
import { getCompanyAccounts, getCompanyWorkflowState } from "@/lib/company-store";

const relatedLinks = [
  { label: "Shipments", to: "/admin/shipments" },
  { label: "Order requests", to: "/admin/order-requests" },
  { label: "Companies", to: "/admin/companies" },
  { label: "Governance", to: "/admin/governance" },
];

export default function AdminShipmentNew() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get("order") || "";
  const [orders, setOrders] = useState(() =>
    appClient.companyOrders.list().filter((order) => order.status === "Approved"),
  );
  const [companies, setCompanies] = useState(() =>
    getCompanyAccounts().filter(
      (company) => getCompanyWorkflowState(company) === "License approved",
    ),
  );

  useEffect(() => {
    appClient.companyOrders.adminList().then((next) => {
      if (Array.isArray(next)) {
        setOrders(next.filter((order) => order.status === "Approved"));
      }
    });
  }, []);

  useEffect(() => {
    backendCompanies
      .adminListCompanies()
      .then((next) => {
        if (Array.isArray(next)) {
          setCompanies(
            next.filter(
              (company) =>
                getCompanyWorkflowState(company) === "License approved",
            ),
          );
        }
      })
      .catch((error) => {
        if (!isNetworkError(error)) {
          throw error;
        }
      });
  }, []);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin shipments"
        title="Start a shipment run"
        description="Initiating records the run as Preparing with an opening dispatch event. Start it from an approved bulk-order request so it inherits the copies and delivery locations, or create a manual/platform-wide run from scratch."
        breadcrumbs={[
          { label: "Admin workspace", to: "/admin/overview" },
          { label: "Shipments", to: "/admin/shipments" },
          { label: "Start a run" },
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

      <DashboardPanel
        title="New shipment run"
        description="Capture the run label, route cluster, scope, and delivery window before it enters the dispatch surface."
        className="p-5 sm:p-6"
      >
        <ShipmentRunForm
          orders={orders}
          companies={companies}
          defaultMode={initialOrderId ? "bulk_order" : "bulk_order"}
          defaultOrderId={initialOrderId}
          showCompanies
          companyHint="Leaving this unset starts a platform-wide run with no company owner."
          onSubmit={async (payload) => {
            const row = await appClient.shipments.createAdmin(payload);
            navigate(`/admin/shipments/${row.id}`, { replace: true });
            return row;
          }}
        />
      </DashboardPanel>

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}