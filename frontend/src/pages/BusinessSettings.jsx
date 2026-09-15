import React, { useEffect, useState } from "react";
import { appClient } from "@/api/appClient";
import {
  DashboardPageHeader,
  DashboardPanel,
  DashboardRelatedLinks,
} from "@/components/dashboard/DashboardPrimitives";
import AccountConsentForm from "@/components/forms/AccountConsentForm";
import GovernanceRequestPanel from "@/components/forms/GovernanceRequestPanel";
import {
  businessGovernanceActionNotes,
  businessPrivacyChecklist,
} from "@/lib/demoData";

const relatedLinks = [
  { label: "Team", to: "/business-dashboard/team" },
  { label: "Orders", to: "/business-dashboard/orders" },
  { label: "Invoices", to: "/business-dashboard/invoices" },
  { label: "Locations", to: "/business-dashboard/locations" },
  { label: "Shipments", to: "/business-dashboard/shipments" },
];

export default function BusinessSettings() {
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
  }, []);

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
        title="Consent and governance controls"
        description="Manage company privacy settings and governance requests."
        breadcrumbs={[
          { label: "Business workspace", to: "/business-dashboard/overview" },
          { label: "Settings" },
        ]}
      />

      <DashboardPanel title="Company consent settings" className="p-5 sm:p-6">
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

      <DashboardPanel title="Governance requests" className="p-5 sm:p-6">
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

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}