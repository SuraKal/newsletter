import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import {
  DashboardEmptyState,
  DashboardFactList,
  DashboardPageHeader,
  DashboardPanel,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import {
  activateSubscriber,
  getSubscriberById,
} from "@/lib/subscriber-store";

const relatedLinks = [
  { label: "Content", to: "/admin/content" },
  { label: "Schedule", to: "/admin/schedule" },
  { label: "Companies", to: "/admin/companies" },
  { label: "Shipments", to: "/admin/shipments" },
  { label: "Governance", to: "/admin/governance" },
  { label: "Order requests", to: "/admin/order-requests" },
];

const reviewActionFor = (status) => {
  if (status === "Needs review") {
    return { label: "Approve subscriber", nextStatus: "Active" };
  }

  if (status === "Renewal watch") {
    return { label: "Mark renewal complete", nextStatus: "Active" };
  }

  return null;
};

export default function AdminSubscriberDetail() {
  const { subscriberId } = useParams();
  const [, setRevision] = useState(0);
  const subscriber = getSubscriberById(subscriberId);

  const reviewAction = subscriber
    ? reviewActionFor(subscriber.status)
    : null;

  const handleReviewAction = () => {
    if (!subscriber || !reviewAction) return;
    if (reviewAction.nextStatus === "Active") {
      activateSubscriber(subscriber.id);
    }
    setRevision((value) => value + 1);
  };

  if (!subscriber) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          eyebrow="Admin subscribers"
          title="Subscriber not found"
          breadcrumbs={[
            { label: "Admin workspace", to: "/admin/overview" },
            { label: "Subscribers", to: "/admin/subscribers" },
          ]}
          action={
            <Link
              to="/admin/subscribers"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to subscribers
            </Link>
          }
        />
        <DashboardPanel title="Subscriber operations">
          <DashboardEmptyState title="No subscriber matches this ID." />
        </DashboardPanel>
        <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin subscriber"
        title={subscriber.name}
        description="Subscriber plan, renewal, and account record."
        breadcrumbs={[
          { label: "Admin workspace", to: "/admin/overview" },
          { label: "Subscribers", to: "/admin/subscribers" },
          { label: subscriber.name },
        ]}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/subscribers"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to subscribers
            </Link>
            {reviewAction ? (
              <button
                type="button"
                onClick={handleReviewAction}
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-emerald-700 dark:bg-stone-100 dark:text-stone-900"
              >
                <Check className="h-4 w-4" />
                {reviewAction.label}
              </button>
            ) : null}
          </div>
        }
      />

      {reviewAction ? (
        <DashboardPanel
          title="Awaiting review"
          description="This subscriber still needs an account decision."
          className="p-5 sm:p-6"
        >
          <p className="font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
            Approving resolves the review hold, sets the account to Active, and
            restores delivery eligibility for this subscriber.
          </p>
        </DashboardPanel>
      ) : null}

      <DashboardPanel
        title="Account record"
        description="Plan and status facts for this subscriber."
        className="p-5 sm:p-6"
      >
        <DashboardFactList
          items={[
            { label: "Plan", value: subscriber.plan },
            { label: "Renewal", value: subscriber.renewal },
            {
              label: "Delivery eligibility",
              value: subscriber.deliveryEligibility,
            },
            {
              label: "Status",
              value: (
                <DashboardStatusBadge
                  label={subscriber.status}
                  tone={subscriber.tone}
                />
              ),
            },
          ]}
        />
      </DashboardPanel>

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}