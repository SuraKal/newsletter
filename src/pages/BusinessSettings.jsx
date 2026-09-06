import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, ShieldCheck, Users } from "lucide-react";
import { appClient } from "@/api/appClient";
import { useAuth } from "@/lib/AuthContext";
import {
  DashboardEmptyState,
  DashboardFilterBar,
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardPanel,
} from "@/components/dashboard/DashboardPrimitives";
import AccountConsentForm from "@/components/forms/AccountConsentForm";
import GovernanceRequestPanel from "@/components/forms/GovernanceRequestPanel";
import {
  businessGovernanceActionNotes,
  businessPrivacyChecklist,
  businessPrivacyPrinciples,
  businessPrivacyRetentionNotes,
  businessPrivacyRights,
  policyContacts,
} from "@/lib/demoData";

export default function BusinessSettings() {
  const { user } = useAuth();
  const [consents, setConsents] = useState({
    commercialUpdatesOptIn: false,
    privacyUpdatesOptIn: true,
    deliveryDataConsent: true,
  });
  const [requests, setRequests] = useState([]);
  const [notes, setNotes] = useState("");
  const [consentError, setConsentError] = useState("");
  const [consentSuccess, setConsentSuccess] = useState("");
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState("");
  const [isSavingConsents, setIsSavingConsents] = useState(false);
  const [isSubmittingExport, setIsSubmittingExport] = useState(false);
  const [isSubmittingDeletion, setIsSubmittingDeletion] = useState(false);

  useEffect(() => {
    const loadCompanyPrivacyState = async () => {
      if (!user) {
        return;
      }

      try {
        const [nextConsents, nextRequests] = await Promise.all([
          appClient.company.getPrivacySettings(),
          appClient.company.listGovernanceRequests(),
        ]);
        setConsents(nextConsents);
        setRequests(nextRequests.slice().reverse());
      } catch {
        // Keep the local fallback state if the mock persistence layer is unavailable.
      }
    };

    loadCompanyPrivacyState();
  }, [user]);

  const governanceSummary = useMemo(() => {
    const reviewRequiredCount = requests.filter(
      (request) => request.status === "Review required",
    ).length;

    return {
      total: requests.length,
      reviewRequired: reviewRequiredCount,
      queueLabel:
        requests.length === 1
          ? "1 active request"
          : `${requests.length} active requests`,
    };
  }, [requests]);

  if (!user) {
    return (
      <DashboardEmptyState
        title="Sign in to manage company privacy and governance actions."
        description="Business privacy settings depend on the active company account because export and retention actions are tied to named contacts, locations, and invoice records."
        action={
          <Link
            to="/login?journey=business"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Business sign in
            <Search className="h-4 w-4" />
          </Link>
        }
      />
    );
  }

  const handleConsentChange = (field, value) => {
    setConsents((current) => ({ ...current, [field]: value }));
    setConsentError("");
    setConsentSuccess("");
  };

  const refreshGovernanceRequests = async () => {
    const nextRequests = await appClient.company.listGovernanceRequests();
    setRequests(nextRequests.slice().reverse());
  };

  const handleSaveConsents = async (e) => {
    e.preventDefault();
    setConsentError("");
    setConsentSuccess("");
    setIsSavingConsents(true);

    try {
      await appClient.company.savePrivacySettings(consents);
      setConsentSuccess("Company privacy settings saved for the active account.");
    } catch (saveError) {
      setConsentError(
        saveError.message || "Company privacy settings could not be saved.",
      );
    } finally {
      setIsSavingConsents(false);
    }
  };

  const handleExportRequest = async () => {
    setRequestError("");
    setRequestSuccess("");
    setIsSubmittingExport(true);

    try {
      await appClient.company.requestDataExport({ notes });
      await refreshGovernanceRequests();
      setRequestSuccess("Company export request logged in the governance queue.");
      setNotes("");
    } catch (requestActionError) {
      setRequestError(
        requestActionError.message ||
          "The company export request could not be created.",
      );
    } finally {
      setIsSubmittingExport(false);
    }
  };

  const handleDeletionRequest = async () => {
    setRequestError("");
    setRequestSuccess("");
    setIsSubmittingDeletion(true);

    try {
      await appClient.company.requestDeletion({ reason: notes });
      await refreshGovernanceRequests();
      setRequestSuccess(
        "Company deletion or retention review request logged in the governance queue.",
      );
      setNotes("");
    } catch (requestActionError) {
      setRequestError(
        requestActionError.message ||
          "The company deletion review request could not be created.",
      );
    } finally {
      setIsSubmittingDeletion(false);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business settings"
        title="Company privacy, consent, and governance controls"
        description="This workspace turns GDPR-style company governance into concrete UI by showing what operational records exist, what the business account consents to, and how export or retention review requests are handled."
        action={
          <Link
            to="/privacy"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Open public privacy page
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search governance, retention, or consent controls"
        filters={[
          user.companyName || "Business account",
          "Belgium + Germany operations",
          "Company governance workflow",
        ]}
        action={
          <Link
            to="/business-dashboard/team"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Review team access
            <Users className="h-4 w-4" />
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard
          label="Company profile"
          value={user.companyName || "Business account"}
          detail="The active company workspace holds named contacts, operational addresses, and invoice-linked data."
          accent
        />
        <DashboardMetricCard
          label="Governance queue"
          value={governanceSummary.queueLabel}
          detail="Export and deletion review requests stay visible here instead of disappearing into support email."
        />
        <DashboardMetricCard
          label="Review required"
          value={`${governanceSummary.reviewRequired}`}
          detail="Requests touching invoices, shipment disputes, or authority checks may need admin follow-up."
        />
        <DashboardMetricCard
          label="Privacy notices"
          value={consents.privacyUpdatesOptIn ? "Visible" : "Muted"}
          detail="Essential governance communication should remain discoverable for the company account owner."
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardPanel
          title="Company consent settings"
          description="Keep optional commercial updates separate from the operational and governance visibility the organization still needs."
          className="h-full"
        >
          <AccountConsentForm
            values={consents}
            onChange={handleConsentChange}
            onSubmit={handleSaveConsents}
            isSaving={isSavingConsents}
            checklist={businessPrivacyChecklist}
            error={consentError}
            successMessage={consentSuccess}
            saveLabel="Save company settings"
            savingLabel="Saving company settings..."
          />
        </DashboardPanel>

        <DashboardPanel
          title="Company governance requests"
          description="Export and deletion review should be available inside the business workspace because the request scope often includes sites, invoices, and designated contacts."
          className="h-full"
        >
          <GovernanceRequestPanel
            notes={notes}
            onNotesChange={setNotes}
            onExport={handleExportRequest}
            onDeletion={handleDeletionRequest}
            isSubmittingExport={isSubmittingExport}
            isSubmittingDeletion={isSubmittingDeletion}
            requests={requests}
            notesConfig={businessGovernanceActionNotes}
            error={requestError}
            successMessage={requestSuccess}
            notesLabel="Company request notes"
            notesPlaceholder="Add authority, location, invoice, or retention context for the company governance request."
            exportLabel="Request company export"
            exportLoadingLabel="Requesting company export..."
            deletionLabel="Request retention review"
            deletionLoadingLabel="Requesting retention review..."
            requestsTitle="Recent company governance requests"
            emptyStateMessage="No company export or retention review requests have been logged from this workspace yet."
          />
        </DashboardPanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <DashboardPanel
          title="Company privacy principles"
          description="Translate policy language into operational guidance for company contacts, sites, invoice history, and cross-border distribution."
          className="h-full"
        >
          <div className="grid gap-4">
            {businessPrivacyPrinciples.map((item) => (
              <div
                key={item.title}
                className="rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4"
              >
                <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-900 dark:text-stone-100">
                  {item.title}
                </p>
                <p className="mt-2 font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </DashboardPanel>

        <div className="space-y-4">
          <DashboardPanel
            title="Company rights"
            description="Business account owners still need the same core visibility, export, and deletion pathways described in the product proposal."
          >
            <ul className="space-y-3">
              {businessPrivacyRights.map((right) => (
                <li key={right} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-stone-900" />
                  <p className="font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
                    {right}
                  </p>
                </li>
              ))}
            </ul>
          </DashboardPanel>

          <DashboardPanel
            title="Retention and admin review"
            description="Not every business record can be removed immediately, especially when invoicing and shipment records still support compliance or dispute handling."
          >
            <div className="space-y-3">
              {businessPrivacyRetentionNotes.map((note) => (
                <div
                  key={note}
                  className="rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4"
                >
                  <p className="font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
                    {note}
                  </p>
                </div>
              ))}
            </div>
          </DashboardPanel>

          <DashboardPanel
            title="Privacy contacts"
            description="Self-service controls reduce friction, but company governance still needs a visible human escalation path."
          >
            <div className="space-y-3 font-sans text-sm text-stone-700 dark:text-stone-300">
              <p>
                Privacy:{" "}
                <a
                  href={`mailto:${policyContacts.privacyEmail}`}
                  className="text-stone-900 underline-offset-4 hover:underline dark:text-stone-100"
                >
                  {policyContacts.privacyEmail}
                </a>
              </p>
              <p>
                Support:{" "}
                <a
                  href={`mailto:${policyContacts.supportEmail}`}
                  className="text-stone-900 underline-offset-4 hover:underline dark:text-stone-100"
                >
                  {policyContacts.supportEmail}
                </a>
              </p>
              <div className="rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4">
                <div className="flex items-start gap-3">
                  <div className="dashboard-icon-badge flex h-10 w-10 items-center justify-center">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <p className="font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
                    Requests that touch invoice history, site authority, or
                    shipment evidence may be reviewed with admin operations
                    before company records are changed or removed.
                  </p>
                </div>
              </div>
            </div>
          </DashboardPanel>
        </div>
      </section>
    </div>
  );
}
