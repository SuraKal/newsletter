import React from "react";
import { Link } from "react-router-dom";
import { PenSquare, Truck } from "lucide-react";
import {
  DashboardActivityTable,
  DashboardChartPanel,
  DashboardFilterBar,
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import {
  adminScheduleMetrics,
  adminScheduleRows,
  adminScheduleVolumeBars,
} from "@/lib/demoData";

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
  { key: "release", label: "Release" },
];

export default function AdminSchedule() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin schedule"
        title="Scheduled publishing and release coordination"
        description="Scheduling should make planned publish windows, draft readiness, and print-linked release timing easy to scan from one operational workspace."
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

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminScheduleMetrics.map((metric) => (
          <DashboardMetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            accent={metric.accent}
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <DashboardChartPanel
          title="Release load by day"
          description="The schedule workspace should help editors and operations see which days carry the heaviest release pressure."
          data={adminScheduleVolumeBars}
        />
        <DashboardActivityTable
          title="Scheduled publishing queue"
          description="Future publishing slots need a dedicated table so draft, scheduled, and hold states stay obvious."
          columns={scheduleColumns}
          rows={adminScheduleRows}
        />
      </section>


    </div>
  );
}
