import React from "react";
import {
  BookOpenText,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Truck,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import {
  DashboardPageHeader,
  DashboardShortcuts,
  DashboardPanel,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { useReaderOverview } from "@/lib/use-reader-overview";
import { useWorkspaceSectionBadges } from "@/lib/notifications";

const sectionIconMap = {
  deliveries: Truck,
  billing: CreditCard,
  history: BookOpenText,
  profile: UserRound,
  privacy: ShieldCheck,
};

const factRows = [
  { key: "status", label: "Subscription status", get: (s) => s.subscriptionStatus },
  { key: "plan", label: "Current plan", get: (s) => s.planName },
  { key: "billing", label: "Next billing", get: (s) => s.nextBillingDate },
  { key: "delivery", label: "Next delivery", get: (s) => s.nextDeliveryDate },
  { key: "access", label: "Access state", get: (s) => s.accessState },
];

export default function ReaderOverviewPage() {
  const { user } = useAuth();

  const overview = useReaderOverview(user?.email);

  const sectionBadges = useWorkspaceSectionBadges("reader");

  const shortcuts = [
    { id: "deliveries", label: "Deliveries", to: "/dashboard/deliveries" },
    { id: "billing", label: "Billing", to: "/dashboard/billing" },
    { id: "history", label: "Reading", to: "/dashboard/history" },
    { id: "profile", label: "Profile", to: "/dashboard/profile" },
    { id: "privacy", label: "Privacy", to: "/dashboard/privacy" },
  ].map((tool) => ({
    ...tool,
    icon: sectionIconMap[tool.id],
    badge: sectionBadges[tool.id],
  }));

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Subscriber workspace"
        title={`Welcome back${user?.name ? `, ${user.name.split(" ")[0]}` : ""}`}
        breadcrumbs={[{ label: "Reader workspace" }, { label: "Overview" }]}
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

      <DashboardShortcuts
        title="Quick links"
        description="Open a focused section instead of scanning everything on one page."
        items={shortcuts}
      />

      <DashboardPanel title="At a glance" className="p-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {factRows.map((row) => (
            <div key={row.key}>
              <dt className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
                {row.label}
              </dt>
              <dd className="mt-1.5 font-sans text-base font-semibold text-stone-900 dark:text-stone-100">
                {row.get(overview)}
              </dd>
            </div>
          ))}
        </dl>
      </DashboardPanel>

      {!overview.hasReadingAccess ? (
        <DashboardPanel title="Subscription action" className="border-l-4 border-l-amber-500 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <DashboardStatusBadge label={overview.subscriptionStatus} tone="warning" />
              <p className="mt-3 max-w-2xl font-sans text-sm leading-5 text-stone-600 dark:text-stone-400">
                {overview.accessState}. Choose the next action to restore or start reader access.
              </p>
            </div>
            <Link
              to={overview.recoveryPath}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-stone-700"
            >
              {overview.recoveryAction}
            </Link>
          </div>
        </DashboardPanel>
      ) : null}

      <DashboardRelatedLinks
        title="Related links"
        items={[
          { label: "Public delivery page", to: "/delivery" },
          { label: "Compare subscription plans", to: "/subscriptions" },
        ]}
      />
    </div>
  );
}
