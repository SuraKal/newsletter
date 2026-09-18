import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, FileBadge, Truck, X } from "lucide-react";
import { appClient } from "@/api/appClient";
import { backendCompanies, isNetworkError } from "@/api/backendClient";
import {
  DashboardDataTable,
  DashboardEmptyState,
  DashboardFilterBar,
  DashboardPageHeader,
  DashboardPanel,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { approveCompanyLead, declineCompanyLead, formatLeadDate, getCompanyAccounts, getCompanyLeads, getCompanyWorkflowState } from "@/lib/company-store";
import { useStoreVersion } from "@/lib/store-bus";

export default function AdminCompanies() {
  useStoreVersion();
  const [query, setQuery] = useState("");
  const [companies, setCompanies] = useState([]);

  const loadCompanies = () =>
    backendCompanies
      .adminListCompanies()
      .then((list) => setCompanies(Array.isArray(list) ? list : []))
      .catch((error) => {
        if (isNetworkError(error)) setCompanies([...getCompanyLeads(), ...getCompanyAccounts()]);
      });

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleDecision = async (company, approved) => {
    try {
      await (approved
        ? backendCompanies.adminApproveLicense(company.id)
        : backendCompanies.adminDeclineLicense(company.id));
      await Promise.all([loadCompanies(), appClient.company.refresh()]);
    } catch (error) {
      if (isNetworkError(error)) {
        (approved ? approveCompanyLead : declineCompanyLead)(company.id);
        loadCompanies();
      }
    }
  };

  const pending = companies.filter((company) => getCompanyWorkflowState(company) === "License submitted");
  const approved = companies.filter((company) => getCompanyWorkflowState(company) === "License approved");
  const normalize = (value) => String(value ?? "").toLowerCase().includes(query.trim().toLowerCase());
  const matches = (company) =>
    !query.trim() || [company.company, company.workEmail, company.status].some(normalize);

  const pendingColumns = [
    {
      key: "company", label: "Company", primary: true,
      render: (value, row) => <Link to={`/admin/companies/${row.id}`} className="font-semibold text-stone-900 hover:text-heritage dark:text-stone-100">{value}</Link>,
    },
    { key: "workEmail", label: "Account email" },
    {
      key: "license", label: "Business licence",
      render: (value, row) => row.licenseDocument ? <a href={row.licenseDocument} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-heritage hover:underline"><FileBadge className="h-4 w-4" /> View licence</a> : "Not available",
    },
    {
      key: "decision", label: "Decision",
      render: (value, row) => <div className="flex gap-2"><button type="button" onClick={() => handleDecision(row, true)} className="inline-flex items-center gap-1 rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white"><Check className="h-3.5 w-3.5" /> Approve</button><button type="button" onClick={() => handleDecision(row, false)} className="inline-flex items-center gap-1 rounded-full border border-stone-300 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-stone-700"><X className="h-3.5 w-3.5" /> Decline</button></div>,
    },
  ];
  const approvedColumns = [
    { key: "company", label: "Company", primary: true, render: (value, row) => <Link to={`/admin/companies/${row.id}`} className="font-semibold text-stone-900 hover:text-heritage dark:text-stone-100">{value}</Link> },
    { key: "workEmail", label: "Account email" },
    { key: "accountActivatedAt", label: "Approved", render: (value) => formatLeadDate(value) || "—" },
    { key: "status", label: "Access", render: (value, row) => <DashboardStatusBadge label={getCompanyWorkflowState(row)} tone={row.tone} /> },
  ];

  return <div className="space-y-6">
    <DashboardPageHeader eyebrow="Admin companies" title="Company licences" description="Approve a submitted business licence to activate the company login and bulk-order workspace." breadcrumbs={[{ label: "Admin workspace", to: "/admin/overview" }, { label: "Companies" }]} action={<Link to="/admin/order-requests" className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white">Bulk-order requests</Link>} />
    <DashboardFilterBar searchPlaceholder="Search company or account email" searchValue={query} onSearchChange={setQuery} filters={[`${pending.length} licence${pending.length === 1 ? "" : "s"} awaiting review`, `${approved.length} active company accounts`]} />
    <DashboardPanel title="Licence approvals" description="Review the uploaded business licence and approve or decline access." className="p-5 sm:p-6">
      {pending.filter(matches).length ? <DashboardDataTable columns={pendingColumns} rows={pending.filter(matches)} minWidth={850} /> : <DashboardEmptyState title="No licences awaiting review" description="New company registrations will appear here with their business licence document." />}
    </DashboardPanel>
    <DashboardPanel title="Active company accounts" description="Approved companies can sign in, place bulk orders, and track delivery." className="p-5 sm:p-6">
      {approved.filter(matches).length ? <DashboardDataTable columns={approvedColumns} rows={approved.filter(matches)} minWidth={700} /> : <DashboardEmptyState title="No active company accounts" description="Approved licence registrations appear here." />}
    </DashboardPanel>
    <Link to="/admin/shipments" className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700"><Truck className="h-4 w-4" /> Delivery operations</Link>
  </div>;
}
