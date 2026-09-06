import React from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CirclePlus } from "lucide-react";
import {
  DashboardActivityTable,
  DashboardFilterBar,
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import {
  adminContentMetrics,
  adminContentRows,
} from "@/lib/demoData";

const contentColumns = [
  { key: "headline", label: "Headline" },
  { key: "sector", label: "Sector" },
  { key: "editor", label: "Editor" },
  {
    key: "status",
    label: "State",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
  { key: "publishWindow", label: "Publish window" },
];

export default function AdminContentList() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin content"
        title="Publishing queue and article inventory"
        action={
          <Link
            to="/admin/content/new"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            New article
            <CirclePlus className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search headline, sector, or editor"
        filters={["5 drafts", "8 scheduled", "12 published today"]}
        action={
          <Link
            to="/admin/schedule"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Open schedule
            <CalendarDays className="h-4 w-4" />
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminContentMetrics.map((metric) => (
          <DashboardMetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            accent={metric.accent}
          />
        ))}
      </section>

      <section>
        <DashboardActivityTable
          title="Article states"
          columns={contentColumns}
          rows={adminContentRows}
        />
      </section>
    </div>
  );
}
