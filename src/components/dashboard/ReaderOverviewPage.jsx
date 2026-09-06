import React, { useMemo } from "react";
import { Clock3, Newspaper, Route, ShieldCheck, Sparkles, Truck } from "lucide-react";
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
  readerCheckoutBenefits,
  readerDashboardActivityRows,
  readerDashboardDeliveryTimeline,
  readerDashboardMetricNotes,
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
        description="Your overview should make plan status, next billing, next delivery, and reading momentum easy to trust before you open deeper sections."
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
          detail={readerDashboardMetricNotes.subscriptionStatus}
        />
        <DashboardMetricCard
          label="Next billing"
          value={overview.nextBillingDate}
          detail={readerDashboardMetricNotes.nextBilling}
        />
        <DashboardMetricCard
          label="Next delivery"
          value={overview.nextDeliveryDate}
          detail={readerDashboardMetricNotes.nextDelivery}
          accent
        />
        <DashboardMetricCard
          label="Access state"
          value={overview.accessState}
          detail={readerDashboardMetricNotes.accessState}
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
          description="Keep the overview compact, but show enough account context that the next action feels obvious."
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
          description="Overview charts should summarize engagement without replacing the deeper reading-history route."
          data={readerDashboardReadingBars}
        />
        <DashboardTimeline
          title="Next print cycle"
          description="This timeline gives the reader an operational summary now, while Phase 22 will deepen the full logistics workflow."
          items={timelineItems}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardActivityTable
          title="Recent account activity"
          description="Renewal, delivery, and saved-reading events should be visible together before the reader drills into dedicated sections."
          columns={activityColumns}
          rows={readerDashboardActivityRows}
        />
        <DashboardPanel
          title="Saved reading queue"
          description="Keep a concise list of what deserves the reader's next click rather than forcing them into a blank history route."
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
          title="Reader trust reminders"
          description="The dashboard should reinforce product rules without making the overview feel like a policy page."
          className="h-full"
        >
          <div className="space-y-3">
            {readerCheckoutBenefits.map((item) => (
              <div
                key={item}
                className="rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4"
              >
                <p className="font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel
          title="Quick actions"
          description="The overview should point clearly into the deeper routed sections built in the next tasks."
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

          <div className="mt-5 rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 text-stone-900" />
              <div>
                <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-900 dark:text-stone-100">
                  Privacy and profile later
                </p>
                <p className="dashboard-page-description mt-2 font-sans text-xs leading-5">
                  Phase 20 continues by deepening deliveries, billing, reading history, and self-service profile controls without overloading this first overview.
                </p>
              </div>
            </div>
          </div>
        </DashboardPanel>
      </section>
    </div>
  );
}
