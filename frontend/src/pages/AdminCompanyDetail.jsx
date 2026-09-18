import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, FileBadge, X } from "lucide-react";
import { appClient } from "@/api/appClient";
import { backendCompanies, isNetworkError } from "@/api/backendClient";
import { DashboardEmptyState, DashboardFactList, DashboardPageHeader, DashboardPanel, DashboardStatusBadge } from "@/components/dashboard/DashboardPrimitives";
import { approveCompanyLead, declineCompanyLead, formatLeadDate, getCompanyEntityById, getCompanyWorkflowPresentation, getCompanyWorkflowState } from "@/lib/company-store";

export default function AdminCompanyDetail() {
  const { companyId } = useParams();
  const [entity, setEntity] = useState(null);
  const loadEntity = () => backendCompanies.adminGetCompany(companyId).then(setEntity).catch((error) => {
    if (isNetworkError(error)) setEntity(getCompanyEntityById(companyId) || null);
  });
  useEffect(() => { loadEntity(); }, [companyId]);

  const decide = async (approved) => {
    try {
      await (approved ? backendCompanies.adminApproveLicense(companyId) : backendCompanies.adminDeclineLicense(companyId));
      await Promise.all([loadEntity(), appClient.company.refresh()]);
    } catch (error) {
      if (isNetworkError(error)) {
        (approved ? approveCompanyLead : declineCompanyLead)(companyId);
        loadEntity();
      }
    }
  };

  if (!entity) return <div className="space-y-6"><DashboardPageHeader eyebrow="Admin companies" title="Company not found" breadcrumbs={[{ label: "Admin workspace", to: "/admin/overview" }, { label: "Companies", to: "/admin/companies" }]} action={<Link to="/admin/companies" className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold uppercase tracking-wider"><ArrowLeft className="h-4 w-4" /> Back</Link>} /><DashboardPanel title="Company not found"><DashboardEmptyState title="No company record matches this ID." /></DashboardPanel></div>;

  const state = getCompanyWorkflowState(entity);
  const workflow = getCompanyWorkflowPresentation(entity);
  const licenceFacts = [
    { label: "Company", value: entity.company },
    { label: "Account email", value: entity.workEmail || "—" },
    { label: "Registered", value: formatLeadDate(entity.createdAt) || "—" },
    { label: "Licence status", value: <DashboardStatusBadge label={workflow.label} tone={workflow.tone} /> },
    ...(entity.licenseReviewedAt ? [{ label: "Reviewed", value: formatLeadDate(entity.licenseReviewedAt) }] : []),
  ];
  return <div className="space-y-6"><DashboardPageHeader eyebrow="Admin companies" title={entity.company} description="Review the submitted business licence and decide whether to enable company access." breadcrumbs={[{ label: "Admin workspace", to: "/admin/overview" }, { label: "Companies", to: "/admin/companies" }, { label: entity.company }]} action={<Link to="/admin/companies" className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold uppercase tracking-wider"><ArrowLeft className="h-4 w-4" /> All companies</Link>} />
    <DashboardPanel title="Company registration" className="p-5 sm:p-6"><DashboardFactList items={licenceFacts} /></DashboardPanel>
    <DashboardPanel title="Business licence" className="p-5 sm:p-6">{entity.licenseDocument ? <a href={entity.licenseDocument} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white"><FileBadge className="h-4 w-4" /> Open uploaded licence</a> : <p className="text-sm text-stone-500">No licence document is available for this legacy company record.</p>}</DashboardPanel>
    {state === "License submitted" ? <div className="flex gap-3"><button type="button" onClick={() => decide(true)} className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white"><Check className="h-4 w-4" /> Approve licence</button><button type="button" onClick={() => decide(false)} className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-700"><X className="h-4 w-4" /> Decline licence</button></div> : null}
  </div>;
}
