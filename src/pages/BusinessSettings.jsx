import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Users } from "lucide-react";
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
          label="Account owner"
          value={user.companyName || "Business account"}
          accent
        />
        <DashboardMetricCard
          label="Governance queue"
          value={governanceSummary.queueLabel}
        />
        <DashboardMetricCard
          label="Review required"
          value={`${governanceSummary.reviewRequired}`}
        />
        <DashboardMetricCard
          label="Privacy notices"
          value={consents.privacyUpdatesOptIn ? "Visible" : "Muted"}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardPanel
          title="Company consent settings"
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
    </div>
  );
}
