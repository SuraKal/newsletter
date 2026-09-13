import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, CreditCard, Truck, X } from "lucide-react";
import {
  DashboardEmptyState,
  DashboardFilterBar,
  DashboardPageHeader,
  DashboardPanel,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import {
  approveCompanyLead,
  declineCompanyLead,
  formatLeadDate,
  getCompanyAccounts,
  getCompanyLeads,
} from "@/lib/company-store";

const companyColumns = [
  { key: "company", label: "Company" },
  { key: "tier", label: "Tier" },
  { key: "volume", label: "Volume" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
];

const relatedLinks = [
  { label: "Content", to: "/admin/content" },
  { label: "Schedule", to: "/admin/schedule" },
  { label: "Subscribers", to: "/admin/subscribers" },
  { label: "Shipments", to: "/admin/shipments" },
  { label: "Pricing", to: "/admin/pricing" },
];

export default function AdminCompanies() {
  const [, setRevision] = useState(0);
  const leads = getCompanyLeads();
  const accounts = getCompanyAccounts();

  const handleApprove = (id) => {
    approveCompanyLead(id);
    setRevision((value) => value + 1);
  };

  const handleDecline = (id) => {
    declineCompanyLead(id);
    setRevision((value) => value + 1);
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin companies"
        title="Company accounts"
        description="Review incoming business requests and manage company account health."
        breadcrumbs={[
          { label: "Admin workspace", to: "/admin/overview" },
          { label: "Companies" },
        ]}
        action={
          <Link
            to="/admin/pricing"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Pricing tiers
            <CreditCard className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search company, contract tier, or invoice model"
        filters={[
          `${accounts.length} company accounts`,
          `${leads.length} pending requests`,
          "Belgium + Germany accounts",
        ]}
        action={
          <Link
            to="/admin/shipments"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Delivery ops
            <Truck className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardPanel
        title="Incoming business requests"
        description="Requests submitted from the public business application appear here for approval."
        className="p-5 sm:p-6"
      >
        {leads.length ? (
          <div className="dashboard-table-wrap overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-stone-200/80 dark:border-stone-700/80">
                  {[
                    { label: "Organization" },
                    { label: "Contact" },
                    { label: "Request" },
                    { label: "Footprint" },
                    { label: "Submitted" },
                    { label: "Decision" },
                  ].map((column) => (
                    <th
                      key={column.label}
                      className="py-3 text-left font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-stone-500"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b last:border-b-0"
                  >
                    <td className="py-3 pr-3">
                      <p className="font-sans text-sm font-semibold text-stone-900 dark:text-stone-100">
                        {lead.company}
                      </p>
                      <p className="mt-0.5 font-sans text-xs text-stone-500">
                        {lead.lead?.requestType}
                      </p>
                    </td>
                    <td className="py-3 pr-3">
                      <p className="font-sans text-sm text-stone-700 dark:text-stone-300">
                        {lead.lead?.primaryContact}
                      </p>
                      <p className="mt-0.5 font-sans text-xs text-stone-500">
                        {lead.workEmail}
                      </p>
                    </td>
                    <td className="py-3 pr-3">
                      <p className="font-sans text-sm text-stone-700 dark:text-stone-300">
                        {lead.lead?.companySize}
                      </p>
                      <p className="mt-0.5 font-sans text-xs text-stone-500">
                        {lead.lead?.launchTimeline}
                      </p>
                    </td>
                    <td className="py-3 pr-3">
                      <p className="font-sans text-sm text-stone-700 dark:text-stone-300">
                        {lead.volume}
                      </p>
                      <p className="mt-0.5 font-sans text-xs text-stone-500">
                        {lead.lead?.deliveryLocations}
                      </p>
                    </td>
                    <td className="py-3 pr-3">
                      <p className="font-sans text-sm text-stone-700 dark:text-stone-300">
                        {formatLeadDate(lead.createdAt)}
                      </p>
                      <DashboardStatusBadge
                        label="Pending review"
                        tone="warning"
                      />
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(lead.id)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-3 py-1.5 font-sans text-[0.66rem] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-emerald-700"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDecline(lead.id)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-3 py-1.5 font-sans text-[0.66rem] font-bold uppercase tracking-[0.14em] text-stone-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                        >
                          <X className="h-3.5 w-3.5" />
                          Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <DashboardEmptyState
            title="No pending requests"
            description="Applications submitted from the public business onboarding path will appear here for review and approval."
          />
        )}
      </DashboardPanel>

      <DashboardPanel title="Company account table" className="p-5 sm:p-6">
        <div className="dashboard-table-wrap overflow-x-auto">
          <table className="w-full min-w-[620px]">
            <thead>
              <tr className="border-b border-stone-200/80 dark:border-stone-700/80">
                {companyColumns.map((column) => (
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
              {accounts.map((row) => (
                <tr key={row.id} className="border-b last:border-b-0">
                  {companyColumns.map((column) => (
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