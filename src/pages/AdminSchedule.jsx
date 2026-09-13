import React from "react";
import { Link } from "react-router-dom";
import { PenSquare, Truck } from "lucide-react";
import {
  DashboardFilterBar,
  DashboardPageHeader,
  DashboardPanel,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { adminScheduleRows } from "@/lib/demoData";

const scheduleColumns = [
  { key: "slot", label: "Publish slot" },
  { key: "sector", label: "Sector" },
  { key: "headline", label: "Headline" },
  {
    key: "status",
    label: "State",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
];

const relatedLinks = [
  { label: "Content", to: "/admin/content" },
  { label: "Subscribers", to: "/admin/subscribers" },
  { label: "Companies", to: "/admin/companies" },
  { label: "Shipments", to: "/admin/shipments" },
  { label: "Pricing", to: "/admin/pricing" },
];

export default function AdminSchedule() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin schedule"
        title="Scheduled publishing"
        description="Review upcoming release slots and coordination status."
        breadcrumbs={[
          { label: "Admin workspace", to: "/admin/overview" },
          { label: "Schedule" },
        ]}
        action={
          <Link
            to="/admin/content/new"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Draft new article
            <PenSquare className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search release slot, sector, or headline"
        filters={["8 scheduled items", "3 print-linked releases", "2 review holds"]}
        action={
          <Link
            to="/admin/shipments"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Check route timing
            <Truck className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardPanel title="Scheduled publishing queue" className="p-5 sm:p-6">
        <div className="dashboard-table-wrap overflow-x-auto">
          <table className="w-full min-w-[620px]">
            <thead>
              <tr className="border-b border-stone-200/80 dark:border-stone-700/80">
                {scheduleColumns.map((column) => (
                  <th
                    key={column.key}
                    className="py-3 text-left font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-stone-500"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adminScheduleRows.map((row) => (
                <tr key={row.id} className="border-b last:border-b-0">
                  {scheduleColumns.map((column) => (
                    <td
                      key={column.key}
                      className="py-3 font-sans text-sm text-stone-700 dark:text-stone-300"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardPanel>

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}