import React, { useMemo } from "react";
import { Clock3, Newspaper, Route, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import {
  DashboardActivityTable,
  DashboardChartPanel,
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardPanel,
  DashboardSplitMetricCard,
  DashboardStatusBadge,
  DashboardTimeline,
} from "@/components/dashboard/DashboardPrimitives";
import {
  readerDashboardActivityRows,
  readerDashboardDeliveryTimeline,
  readerDashboardQuickActions,
  readerDashboardReadingBars,
  readerDashboardReadingList,
} from "@/lib/demoData";
import { getReaderSubscriptionSnapshot } from "@/lib/reader-subscription";

const timelineItems = readerDashboardDeliveryTimeline.map((item, index) => {
  const iconMap = [Newspaper, Route, Truck, Clock3];
  return {
    ...item,
    icon: iconMap[index] || Route,
    badge: (
      <DashboardStatusBadge
        label={item.badge}
        tone={item.completed ? "success" : "neutral"}
      />
    ),
  };
});

const activityColumns = [
  { key: "item", label: "Item" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
  { key: "date", label: "Date" },
];

export default function ReaderOverviewPage() {
  const { user } = useAuth();

  const overview = useMemo(
    () => getReaderSubscriptionSnapshot(user?.email),
    [user?.email],
  );
  const savedStoriesCount = overview.isPrintSubscriber ? "18" : "12";
  const weeklyReadingCount = overview.isPrintSubscriber ? "47" : "34";

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Subscriber workspace"
        title={`Welcome back${user?.name ? `, ${user.name.split(" ")[0]}` : ""}`}
        action={
          <Link
            to="/subscriptions"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Manage plans
            <Sparkles className="h-4 w-4" />
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard
          label="Subscription status"
          value={overview.subscriptionStatus}
          detail=""
        />
        <DashboardMetricCard
          label="Next billing"
          value={overview.nextBillingDate}
          detail=""
        />
        <DashboardMetricCard
          label="Next delivery"
          value={overview.nextDeliveryDate}
          detail=""
          accent
        />
        <DashboardMetricCard
          label="Access state"
          value={overview.accessState}
          detail=""
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <DashboardSplitMetricCard
          title="Subscription health"
          leftLabel="Current plan"
          leftValue={overview.planName}
          rightLabel="Payment path"
          rightValue={overview.paymentMethod}
          footer={overview.deliveryMode}
        />
        <DashboardPanel
          title="Reader profile snapshot"
          className="h-full"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="dashboard-panel-soft p-4">
              <p className="dashboard-kpi-label font-sans text-[0.65rem] font-bold uppercase tracking-[0.22em]">
                Delivery profile
              </p>
              <p className="dashboard-kpi-value mt-2 font-sans text-2xl font-semibold">
                {overview.locationSummary}
              </p>
              <p className="dashboard-page-description mt-2 font-sans text-xs leading-5">
                {overview.deliveryWindow}
              </p>
            </div>
            <div className="dashboard-panel-soft p-4">
              <p className="dashboard-kpi-label font-sans text-[0.65rem] font-bold uppercase tracking-[0.22em]">
                Reading rhythm
              </p>
              <p className="dashboard-kpi-value mt-2 font-sans text-2xl font-semibold">
                {weeklyReadingCount} articles
              </p>
              <p className="dashboard-page-description mt-2 font-sans text-xs leading-5">
                {savedStoriesCount} stories saved for later across politics, business, and weekend analysis.
              </p>
            </div>
          </div>
        </DashboardPanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardChartPanel
          title="Weekly reading activity"
          description=""
          data={readerDashboardReadingBars}
        />
        <DashboardTimeline
          title="Next print cycle"
          description=""
          items={timelineItems}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardActivityTable
          title="Recent account activity"
          description=""
          columns={activityColumns}
          rows={readerDashboardActivityRows}
        />
        <DashboardPanel
          title="Saved reading queue"
          className="h-full"
        >
          <div className="space-y-4">
            {readerDashboardReadingList.map((item) => (
              <Link
                key={item.id}
                to={item.route}
                className="block rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4 transition hover:border-stone-300 hover:bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-sans text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {item.title}
                    </h3>
                    <p className="dashboard-page-description mt-2 font-sans text-xs leading-5">
                      {item.detail}
                    </p>
                  </div>
                  <DashboardStatusBadge label={item.status} tone={item.tone} />
                </div>
              </Link>
            ))}
          </div>
        </DashboardPanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <DashboardPanel
          title="Quick actions"
          className="h-full"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {readerDashboardQuickActions.map((action) => (
              <Link
                key={action.route}
                to={action.route}
                className="rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4 transition hover:border-stone-300 hover:bg-white"
              >
                <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-900 dark:text-stone-100">
                  {action.label}
                </p>
                <p className="dashboard-page-description mt-2 font-sans text-xs leading-5">
                  {action.detail}
                </p>
              </Link>
            ))}
          </div>
        </DashboardPanel>
      </section>
    </div>
  );
}
