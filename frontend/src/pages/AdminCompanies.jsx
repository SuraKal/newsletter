import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, CreditCard, Truck, X } from "lucide-react";
import { appClient } from "@/api/appClient";
import { backendCompanies, isNetworkError } from "@/api/backendClient";
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
import { useStoreVersion } from "@/lib/store-bus";
import {
  approveCompanyLead,
  convertCompanyLead,
  declineCompanyLead,
  formatLeadDate,
  getCompanyAccounts,
  getCompanyLeads,
  getCompanyWorkflowState,
  prepareCompanyQuote,
  startCompanyReview,
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
      <DashboardStatusBadge label={getCompanyWorkflowState(row)} tone={row.tone} />
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
    getCompanyWorkflowState(lead),
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
    options: ["Draft", "Submitted", "Under review", "Quote ready", "Approved", "Declined"],
  },
  {
    key: "tier",
    label: "Tier",
    options: ["Single Office", "Regional Team", "Enterprise Route"],
  },
];

export default function AdminCompanies() {
  useStoreVersion();
  const [query, setQuery] = useState("");
  const [companies, setCompanies] = useState([]);
  const { activeFilters, setFilter, clearFilters } = useTableFilters();

  const loadCompanies = () => {
    return backendCompanies
      .adminListCompanies()
      .then((list) => setCompanies(Array.isArray(list) ? list : []))
      .catch((error) => {
        if (isNetworkError(error)) {
          setCompanies([...getCompanyLeads(), ...getCompanyAccounts()]);
        }
      });
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  // The mock-classification rule: only rows whose workflow state is
  // "Converted to account" are accounts; everything else (Draft → Approved,
  // Declined) is a workflow lead. `getCompanyWorkflowState` normalizes legacy
  // mock statuses (Active/Onboarding/Invoice review) and passes canonical
  // backend statuses through unchanged.
  const leads = companies.filter(
    (entity) => getCompanyWorkflowState(entity) !== "Converted to account",
  );
  const accounts = companies.filter(
    (entity) => getCompanyWorkflowState(entity) === "Converted to account",
  );

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

  // Backend-first transitions with the mock store as the offline fallback.
  const transitionActions = {
    review: { backend: backendCompanies.adminReview, fallback: startCompanyReview },
    quote: { backend: backendCompanies.adminPrepareQuote, fallback: prepareCompanyQuote },
    approve: { backend: backendCompanies.adminApprove, fallback: approveCompanyLead },
    convert: { backend: backendCompanies.adminConvert, fallback: convertCompanyLead },
    decline: { backend: backendCompanies.adminDecline, fallback: declineCompanyLead },
  };

  const handleTransition = async (id, action) => {
    const { backend, fallback } = transitionActions[action];
    try {
      await backend(id);
      await Promise.all([loadCompanies(), appClient.company.refresh()]);
    } catch (error) {
      if (isNetworkError(error)) {
        fallback(id);
        loadCompanies();
      }
    }
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
          <DashboardStatusBadge
            label={getCompanyWorkflowState(lead)}
            tone={lead.tone}
          />
        </div>
      ),
    },
    {
      key: "decision",
      label: "Decision",
      render: (value, lead) => (
        <div className="flex items-center gap-2">
          {getCompanyWorkflowState(lead) === "Submitted" ? (
            <button type="button" onClick={() => handleTransition(lead.id, "review")} className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-3 py-1.5 font-sans text-[0.66rem] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-stone-700">
              <Check className="h-3.5 w-3.5" /> Start review
            </button>
          ) : null}
          {getCompanyWorkflowState(lead) === "Under review" ? (
            <button type="button" onClick={() => handleTransition(lead.id, "quote")} className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-3 py-1.5 font-sans text-[0.66rem] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-stone-700">
              <Check className="h-3.5 w-3.5" /> Prepare quote
            </button>
          ) : null}
          {getCompanyWorkflowState(lead) === "Quote ready" ? (
            <button type="button" onClick={() => handleTransition(lead.id, "approve")} className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-3 py-1.5 font-sans text-[0.66rem] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-emerald-700">
              <Check className="h-3.5 w-3.5" /> Approve quote
            </button>
          ) : null}
          {getCompanyWorkflowState(lead) === "Approved" ? (
            <button type="button" onClick={() => handleTransition(lead.id, "convert")} className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-3 py-1.5 font-sans text-[0.66rem] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-emerald-700">
              <Check className="h-3.5 w-3.5" /> Convert account
            </button>
          ) : null}
          {["Submitted", "Under review", "Quote ready"].includes(getCompanyWorkflowState(lead)) ? (
            <button type="button" onClick={() => handleTransition(lead.id, "decline")} className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-3 py-1.5 font-sans text-[0.66rem] font-bold uppercase tracking-[0.14em] text-stone-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700">
              <X className="h-3.5 w-3.5" /> Decline
            </button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin companies"
        title="Company accounts"
        description="Move business requests from submission through quote review and account conversion."
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
          `${leads.length} workflow requests`,
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
        description="Move each business request from submission through quote review and account conversion."
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
            title="No workflow requests"
            description="Applications saved or submitted from the public business onboarding path will appear here."
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
