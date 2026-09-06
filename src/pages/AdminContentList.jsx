import React from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CirclePlus, PenSquare } from "lucide-react";
import {
  DashboardActivityTable,
  DashboardFilterBar,
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardPanel,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import {
  adminContentMetrics,
  adminContentRows,
  adminContentTemplates,
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
        description="The content workspace should keep draft, scheduled, and published editorial work visible in one searchable list without mixing it into the broader admin landing page."
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
            detail={metric.detail}
            accent={metric.accent}
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <DashboardActivityTable
          title="Article states"
          description="Editorial teams should be able to scan status and publish timing without opening each story first."
          columns={contentColumns}
          rows={adminContentRows}
        />

        <DashboardPanel
          title="Sector-aware templates"
          description="Template differences should stay visible because politics, business, sports, and events do not share identical editorial fields."
          className="h-full"
        >
          <div className="space-y-4">
            {adminContentTemplates.map((template) => (
              <Link
                key={template.id}
                to={`/admin/content/${template.sampleId}`}
                className="block rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4 transition hover:border-stone-300 hover:bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-900 dark:text-stone-100">
                      {template.label}
                    </p>
                    <p className="mt-2 font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
                      {template.detail}
                    </p>
                  </div>
                  <div className="dashboard-icon-badge flex h-10 w-10 items-center justify-center">
                    <PenSquare className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </DashboardPanel>
      </section>
    </div>
  );
}
