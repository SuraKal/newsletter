import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  PenSquare,
  ReceiptText,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { appClient } from "@/api/appClient";
import {
  DashboardChartPanel,
  DashboardPageHeader,
  DashboardPanel,
  DashboardShortcuts,
  DashboardRelatedLinks,
} from "@/components/dashboard/DashboardPrimitives";
import { adminOverviewMetrics } from "@/lib/demoData";
import { getAdminContentRows } from "@/lib/content-store";
import { useStoreVersion } from "@/lib/store-bus";
import { useWorkspaceSectionBadges } from "@/lib/notifications";

const sectionIconMap = {
  overview: LayoutDashboard,
  content: PenSquare,
  schedule: CalendarDays,
  subscribers: Users,
  companies: Building2,
  governance: ShieldCheck,
  shipments: Truck,
  "order-requests": ReceiptText,
  subscriptions: CreditCard,
};

export default function AdminOverviewPage() {
  useStoreVersion();
  const [metrics, setMetrics] = useState(() => adminOverviewMetrics);
  const [visibility, setVisibility] = useState(() =>
    getAdminContentRows().map((row) => ({
      id: row.id,
      headline: row.headline,
      clicks: Number(row.clicks) || 0,
      status: row.status,
    })),
  );
  const [selectedArticleId, setSelectedArticleId] = useState("");
  const sectionBadges = useWorkspaceSectionBadges("admin");

  const selectedArticle =
    visibility.find((row) => row.id === selectedArticleId) || null;

  const truncateHeadline = (headline) =>
    headline.length > 20 ? `${headline.slice(0, 20)}…` : headline;

  const chartData = selectedArticle
    ? [
        {
          label: truncateHeadline(selectedArticle.headline),
          value: selectedArticle.clicks || 0,
          tone: "accent",
        },
      ]
    : [...visibility]
        .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
        .slice(0, 6)
        .map((row, index) => ({
          label: truncateHeadline(row.headline),
          value: row.clicks || 0,
          tone: index === 0 ? "accent" : undefined,
        }));

  useEffect(() => {
    let cancelled = false;
    appClient.admin
      .overview()
      .then((nextMetrics) => {
        if (!cancelled && Array.isArray(nextMetrics) && nextMetrics.length) {
          setMetrics(nextMetrics);
        }
      })
      .catch(() => {
        // Keep the fallback metrics if the aggregate endpoint is unavailable.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    appClient.admin
      .overviewVisibility()
      .then((rows) => {
        if (!cancelled && Array.isArray(rows)) {
          setVisibility(rows);
        }
      })
      .catch(() => {
        // Keep the store-derived rows if the visibility endpoint is unavailable.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const shortcuts = [
    { id: "content", label: "Content", to: "/admin/content" },
    { id: "schedule", label: "Schedule", to: "/admin/schedule" },
    { id: "subscribers", label: "Subscribers", to: "/admin/subscribers" },
    { id: "companies", label: "Companies", to: "/admin/companies" },
    { id: "governance", label: "Governance", to: "/admin/governance" },
    { id: "shipments", label: "Shipments", to: "/admin/shipments" },
    { id: "subscriptions", label: "Subscriptions", to: "/admin/subscriptions" },
    { id: "order-requests", label: "Order requests", to: "/admin/order-requests" },
  ].map((tool) => ({
    ...tool,
    icon: sectionIconMap[tool.id],
    badge: sectionBadges[tool.id],
    description: tool.label === "Content" ? "Workflow made clearer" : undefined,
  }));

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin workspace"
        title="Admin operations"
        breadcrumbs={[{ label: "Admin workspace" }, { label: "Overview" }]}
        action={
          <Link
            to="/admin/content"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Open content workspace
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardShortcuts
        title="Quick links"
        description="Focus on one operation at a time; each section has its own page."
        items={shortcuts}
        columns={3}
      />

      <DashboardPanel title="At a glance" className="p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-5">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
                {metric.label}
              </p>
              <p className="mt-1.5 font-sans text-lg font-semibold text-stone-900 dark:text-stone-100">
                {metric.value}
              </p>
              {metric.detail ? (
                <p className="mt-1 font-sans text-xs leading-4 text-stone-500 dark:text-stone-400">
                  {metric.detail}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </DashboardPanel>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <label className="dashboard-filter-pill inline-flex items-center gap-1.5 px-2.5 py-2">
            <span className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.16em] text-stone-400">
              Article
            </span>
            <select
              value={selectedArticleId}
              onChange={(event) => setSelectedArticleId(event.target.value)}
              className="max-w-[16rem] bg-transparent font-sans text-xs font-semibold text-stone-700 focus:outline-none dark:text-stone-200"
            >
              <option value="">All articles</option>
              {visibility.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.headline}
                </option>
              ))}
            </select>
          </label>
        </div>
        <DashboardChartPanel
          title="Article visibility"
          description={
            selectedArticle
              ? `Visibility for "${selectedArticle.headline}" measured in clicks.`
              : "Top articles by click count across all desks."
          }
          data={
            chartData.length
              ? chartData
              : [{ label: "No data", value: 1, tone: "neutral" }]
          }
        />
      </div>

      <DashboardRelatedLinks
        title="Related links"
        items={[
          { label: "Public newsroom", to: "/news" },
          { label: "Public business page", to: "/business" },
        ]}
      />
    </div>
  );
}
