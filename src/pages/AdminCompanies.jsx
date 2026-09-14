import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, CreditCard, Truck, X } from "lucide-react";
import {
  DashboardDataTable,
  DashboardEmptyState,
  DashboardFilterBar,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPagination,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { useTableFilters, useTableQuery } from "@/lib/useTableQuery";
import {
  approveCompanyLead,
  declineCompanyLead,
  formatLeadDate,
  getCompanyAccounts,
  getCompanyLeads,
} from "@/lib/company-store";

const companyColumns = [
  {
    key: "company",
    label: "Company",
    primary: true,
    render: (value, row) => (
      <Link
        to={`/admin/companies/${row.id}`}
        className="font-medium text-stone-900 transition-colors hover:text-heritage dark:text-stone-100"
      >
        {value}
      </Link>
    ),
  },
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

const matchesLeadSearch = (lead, query) =>
  [
    lead.company,
    lead.lead?.requestType,
    lead.lead?.primaryContact,
    lead.workEmail,
    lead.lead?.companySize,
    lead.lead?.launchTimeline,
    lead.volume,
    lead.lead?.deliveryLocations,
  ].some((value) => String(value ?? "").toLowerCase().includes(query));

const matchesAccountSearch = (row, query) =>
  [row.company, row.tier, row.volume, row.status].some((value) =>
    String(value ?? "").toLowerCase().includes(query),
  );

const relatedLinks = [
  { label: "Content", to: "/admin/content" },
  { label: "Schedule", to: "/admin/schedule" },
  { label: "Subscribers", to: "/admin/subscribers" },
  { label: "Shipments", to: "/admin/shipments" },
  { label: "Governance", to: "/admin/governance" },
  { label: "Pricing", to: "/admin/pricing" },
];

const companyFilterGroups = [
  {
    key: "status",
    label: "Status",
    options: ["Pending review", "Onboarding", "Active", "Invoice review"],
  },
  {
    key: "tier",
    label: "Tier",
    options: ["Single Office", "Regional Team", "Enterprise Route"],
  },
];

export default function AdminCompanies() {
  const [, setRevision] = useState(0);
  const [query, setQuery] = useState("");
  const { activeFilters, setFilter, clearFilters } = useTableFilters();
  const leads = getCompanyLeads();
  const accounts = getCompanyAccounts();
  const leadsTable = useTableQuery({
    rows: leads,
    query,
    predicate: matchesLeadSearch,
    activeFilters,
    filterGroups: companyFilterGroups,
  });
  const accountsTable = useTableQuery({
    rows: accounts,
    query,
    predicate: matchesAccountSearch,
    activeFilters,
    filterGroups: companyFilterGroups,
  });

  const handleApprove = (id) => {
    approveCompanyLead(id);
    setRevision((value) => value + 1);
  };

  const handleDecline = (id) => {
    declineCompanyLead(id);
    setRevision((value) => value + 1);
  };

  const leadColumns = [
    {
      key: "company",
      label: "Organization",
      primary: true,
      render: (value, lead) => (
        <div>
          <Link
            to={`/admin/companies/${lead.id}`}
            className="font-sans text-sm font-semibold text-stone-900 transition-colors hover:text-heritage dark:text-stone-100"
          >
            {lead.company}
          </Link>
          <p className="mt-0.5 font-sans text-xs text-stone-500">
            {lead.lead?.requestType}
          </p>
        </div>
      ),
    },
    {
      key: "workEmail",
      label: "Contact",
      render: (value, lead) => (
        <div>
          <p className="font-sans text-sm text-stone-700 dark:text-stone-300">
            {lead.lead?.primaryContact}
          </p>
          <p className="mt-0.5 font-sans text-xs text-stone-500">{lead.workEmail}</p>
        </div>
      ),
    },
    {
      key: "companySize",
      label: "Request",
      render: (value, lead) => (
        <div>
          <p className="font-sans text-sm text-stone-700 dark:text-stone-300">
            {lead.lead?.companySize}
          </p>
          <p className="mt-0.5 font-sans text-xs text-stone-500">
            {lead.lead?.launchTimeline}
          </p>
        </div>
      ),
    },
    {
      key: "volume",
      label: "Footprint",
      render: (value, lead) => (
        <div>
          <p className="font-sans text-sm text-stone-700 dark:text-stone-300">
            {lead.volume}
          </p>
          <p className="mt-0.5 font-sans text-xs text-stone-500">
            {lead.lead?.deliveryLocations}
          </p>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Submitted",
      render: (value, lead) => (
        <div>
          <p className="font-sans text-sm text-stone-700 dark:text-stone-300">
            {formatLeadDate(lead.createdAt)}
          </p>
          <DashboardStatusBadge label="Pending review" tone="warning" />
        </div>
      ),
    },
    {
      key: "decision",
      label: "Decision",
      render: (value, lead) => (
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
      ),
    },
  ];

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
        searchValue={query}
        onSearchChange={setQuery}
        resultCount={
          query.trim() ||
          accountsTable.hasActiveFilters ||
          leadsTable.hasActiveFilters
            ? leadsTable.total + accountsTable.total
            : null
        }
        filterGroups={companyFilterGroups}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
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
          leadsTable.total ? (
            <>
              <DashboardDataTable
                columns={leadColumns}
                rows={leadsTable.rows}
                minWidth={760}
              />
              <DashboardPagination
                page={leadsTable.page}
                pageCount={leadsTable.pageCount}
                total={leadsTable.total}
                pageSize={leadsTable.pageSize}
                onPageChange={leadsTable.setPage}
              />
            </>
          ) : (
            <DashboardEmptyState
              title="No matching requests"
              description="Try a different search term to find the business request you are looking for."
            />
          )
        ) : (
          <DashboardEmptyState
            title="No pending requests"
            description="Applications submitted from the public business onboarding path will appear here for review and approval."
          />
        )}
      </DashboardPanel>

      <DashboardPanel title="Company account table" className="p-5 sm:p-6">
        {accountsTable.total ? (
          <>
            <DashboardDataTable
              columns={companyColumns}
              rows={accountsTable.rows}
              minWidth={620}
            />
            <DashboardPagination
              page={accountsTable.page}
              pageCount={accountsTable.pageCount}
              total={accountsTable.total}
              pageSize={accountsTable.pageSize}
              onPageChange={accountsTable.setPage}
            />
          </>
        ) : (
          <DashboardEmptyState
            title="No matching accounts"
            description="Try a different search term to find the company account you are looking for."
          />
        )}
      </DashboardPanel>

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}