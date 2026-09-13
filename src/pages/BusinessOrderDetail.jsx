import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  DashboardEmptyState,
  DashboardFactList,
  DashboardPageHeader,
  DashboardPanel,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { businessOrderRows } from "@/lib/demoData";

const relatedLinks = [
  { label: "Team", to: "/business-dashboard/team" },
  { label: "Invoices", to: "/business-dashboard/invoices" },
  { label: "Locations", to: "/business-dashboard/locations" },
  { label: "Shipments", to: "/business-dashboard/shipments" },
  { label: "Settings", to: "/business-dashboard/settings" },
];

export default function BusinessOrderDetail() {
  const { orderId } = useParams();
  const order = businessOrderRows.find((row) => row.id === orderId);

  if (!order) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          eyebrow="Business orders"
          title="Order plan not found"
          breadcrumbs={[
            { label: "Business workspace", to: "/business-dashboard/overview" },
            { label: "Orders", to: "/business-dashboard/orders" },
          ]}
          action={
            <Link
              to="/business-dashboard/orders"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to orders
            </Link>
          }
        />
        <DashboardPanel title="Bulk order plans">
          <DashboardEmptyState title="No order plan matches this ID." />
        </DashboardPanel>
        <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business order"
        title={order.order}
        description="Recurring copy volume and cadence plan."
        breadcrumbs={[
          { label: "Business workspace", to: "/business-dashboard/overview" },
          { label: "Orders", to: "/business-dashboard/orders" },
          { label: order.order },
        ]}
        action={
          <Link
            to="/business-dashboard/orders"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to orders
          </Link>
        }
      />

      <DashboardPanel title="Plan facts" className="p-5 sm:p-6">
        <DashboardFactList
          items={[
            { label: "Copies / cycle", value: order.copies },
            { label: "Cadence", value: order.cadence },
            { label: "Sites", value: order.sites },
            { label: "Next window", value: order.nextWindow },
            {
              label: "Status",
              value: (
                <DashboardStatusBadge label={order.status} tone={order.tone} />
              ),
            },
          ]}
        />
      </DashboardPanel>

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}