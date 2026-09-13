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
import { businessLocationRows } from "@/lib/demoData";

const relatedLinks = [
  { label: "Team", to: "/business-dashboard/team" },
  { label: "Orders", to: "/business-dashboard/orders" },
  { label: "Invoices", to: "/business-dashboard/invoices" },
  { label: "Shipments", to: "/business-dashboard/shipments" },
  { label: "Settings", to: "/business-dashboard/settings" },
];

export default function BusinessLocationDetail() {
  const { locationId } = useParams();
  const location = businessLocationRows.find(
    (row) => row.id === locationId,
  );

  if (!location) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          eyebrow="Business locations"
          title="Site not found"
          breadcrumbs={[
            { label: "Business workspace", to: "/business-dashboard/overview" },
            { label: "Locations", to: "/business-dashboard/locations" },
          ]}
          action={
            <Link
              to="/business-dashboard/locations"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to locations
            </Link>
          }
        />
        <DashboardPanel title="Delivery destinations">
          <DashboardEmptyState title="No site matches this ID." />
        </DashboardPanel>
        <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business location"
        title={location.location}
        description="Receiving site and readiness record."
        breadcrumbs={[
          { label: "Business workspace", to: "/business-dashboard/overview" },
          { label: "Locations", to: "/business-dashboard/locations" },
          { label: location.location },
        ]}
        action={
          <Link
            to="/business-dashboard/locations"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to locations
          </Link>
        }
      />

      <DashboardPanel title="Site facts" className="p-5 sm:p-6">
        <DashboardFactList
          items={[
            { label: "Region", value: location.region },
            { label: "Copies / cycle", value: location.copies },
            { label: "Receiving contact", value: location.contact },
            {
              label: "Status",
              value: (
                <DashboardStatusBadge label={location.status} tone={location.tone} />
              ),
            },
          ]}
        />
      </DashboardPanel>

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}