import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, X } from "lucide-react";
import {
  DashboardEmptyState,
  DashboardFactList,
  DashboardPageHeader,
  DashboardPanel,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import {
  approveCompanyLead,
  declineCompanyLead,
  formatLeadDate,
  getCompanyEntityById,
} from "@/lib/company-store";

const relatedLinks = [
  { label: "Content", to: "/admin/content" },
  { label: "Schedule", to: "/admin/schedule" },
  { label: "Subscribers", to: "/admin/subscribers" },
  { label: "Shipments", to: "/admin/shipments" },
  { label: "Governance", to: "/admin/governance" },
  { label: "Pricing", to: "/admin/pricing" },
];

export default function AdminCompanyDetail() {
  const { companyId } = useParams();
  const [, setRevision] = useState(0);
  const entity = getCompanyEntityById(companyId);

  if (!entity) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          eyebrow="Admin companies"
          title="Company not found"
          breadcrumbs={[
            { label: "Admin workspace", to: "/admin/overview" },
            { label: "Companies", to: "/admin/companies" },
          ]}
          action={
            <Link
              to="/admin/companies"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to companies
            </Link>
          }
        />
        <DashboardPanel title="Company accounts">
          <DashboardEmptyState title="No company record matches this ID." />
        </DashboardPanel>
        <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
      </div>
    );
  }

  const lead = entity.lead || null;
  const isPending = entity.status === "Pending review";
  const isDeclined = entity.status === "Declined";

  const accountFacts = [
    {
      label: "Status",
      value: (
        <DashboardStatusBadge label={entity.status} tone={entity.tone} />
      ),
    },
    ...(entity.tier ? [{ label: "Tier", value: entity.tier }] : []),
    ...(entity.volume ? [{ label: "Volume", value: entity.volume }] : []),
    ...(entity.billing
      ? [{ label: "Billing model", value: entity.billing }]
      : []),
    { label: "Region", value: entity.region || "Not specified" },
    ...(entity.createdAt
      ? [{ label: "Submitted", value: formatLeadDate(entity.createdAt) }]
      : []),
    ...(entity.reviewedAt
      ? [{ label: "Reviewed", value: formatLeadDate(entity.reviewedAt) }]
      : []),
  ];

  const applicationFacts = lead
    ? [
        { label: "Primary contact", value: lead.primaryContact || "—" },
        { label: "Work email", value: lead.workEmail || "—" },
        { label: "Work phone", value: lead.workPhone || "—" },
        { label: "Request type", value: lead.requestType || "—" },
        { label: "Company size", value: lead.companySize || "—" },
        { label: "Country scope", value: lead.countryScope || "—" },
        { label: "Expected copies", value: lead.expectedCopies || "—" },
        {
          label: "Delivery locations",
          value: lead.deliveryLocations || "—",
        },
        { label: "Billing preference", value: lead.billingPreference || "—" },
        { label: "Launch timeline", value: lead.launchTimeline || "—" },
      ]
    : [];

  const handleApprove = () => {
    approveCompanyLead(companyId);
    setRevision((value) => value + 1);
  };

  const handleDecline = () => {
    declineCompanyLead(companyId);
    setRevision((value) => value + 1);
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin companies"
        title={entity.company}
        description={
          lead?.requestType || "Company account record."
        }
        breadcrumbs={[
          { label: "Admin workspace", to: "/admin/overview" },
          { label: "Companies", to: "/admin/companies" },
          { label: entity.company },
        ]}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/companies"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to companies
            </Link>
            {isPending ? (
              <>
                <button
                  type="button"
                  onClick={handleDecline}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
                >
                  <X className="h-4 w-4" />
                  Decline
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-emerald-700 dark:bg-stone-100 dark:text-stone-900"
                >
                  <Check className="h-4 w-4" />
                  Approve request
                </button>
              </>
            ) : null}
          </div>
        }
      />

      {isPending ? (
        <DashboardPanel
          title="Awaiting review"
          description="Approving this request opens a company account; declining closes the application."
          className="p-5 sm:p-6"
        >
          <p className="font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
            This application is not yet an active company account until it is
            approved.
          </p>
        </DashboardPanel>
      ) : null}

      {isDeclined ? (
        <DashboardPanel
          title="Request declined"
          description="This application was closed and the company is not an active account."
          className="p-5 sm:p-6"
        >
          <p className="font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
            The record stays listed for reference, but no contract or billing
            applies.
          </p>
        </DashboardPanel>
      ) : null}

      <DashboardPanel
        title="Account record"
        description="Billing and contract facts for this company account."
        className="p-5 sm:p-6"
      >
        <DashboardFactList items={accountFacts} />
      </DashboardPanel>

      {applicationFacts.length ? (
        <DashboardPanel
          title="Application details"
          description="Facts submitted with the onboarding request."
          className="p-5 sm:p-6"
        >
          <DashboardFactList items={applicationFacts} />
        </DashboardPanel>
      ) : null}

      {lead?.operationalNotes ? (
        <DashboardPanel
          title="Operations note"
          description="Notes submitted with the onboarding request."
          className="p-5 sm:p-6"
        >
          <p className="font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
            {lead.operationalNotes}
          </p>
        </DashboardPanel>
      ) : null}

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}