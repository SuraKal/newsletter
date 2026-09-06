import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, CreditCard, MapPin, Package, Search, Truck } from "lucide-react";
import { appClient } from "@/api/appClient";
import { useAuth } from "@/lib/AuthContext";
import { IMAGES } from "@/lib/constants";
import {
  DashboardChartPanel,
  DashboardEmptyState,
  DashboardFilterBar,
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardPanel,
  DashboardSplitMetricCard,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import ReaderProfileForm from "@/components/forms/ReaderProfileForm";
import AccountConsentForm from "@/components/forms/AccountConsentForm";
import GovernanceRequestPanel from "@/components/forms/GovernanceRequestPanel";
import DeliveryStatusHero from "@/components/delivery/DeliveryStatusHero";
import DeliveryTimelinePanel from "@/components/delivery/DeliveryTimelinePanel";
import DeliveryHistoryTable from "@/components/delivery/DeliveryHistoryTable";
import DeliveryMapPanel from "@/components/delivery/DeliveryMapPanel";
import ShipmentIssuePanel from "@/components/delivery/ShipmentIssuePanel";
import ShipmentKpiSummary from "@/components/delivery/ShipmentKpiSummary";
import { getReaderSubscriptionSnapshot } from "@/lib/reader-subscription";
import {
  readerBillingQuickFacts,
  readerConsentChecklist,
  readerBillingRows,
  readerDashboardReadingBars,
  readerDeliveryCurrent,
  readerDeliveryHistoryRows,
  readerDeliveryIssueStates,
  readerDeliveryKpis,
  readerDeliveryTimeline,
  readerGovernanceActionNotes,
  readerHistoryRows,
  readerProfileHighlights,
  readerSavedCollections,
} from "@/lib/demoData";

const deliveryIconMap = {
  Clock,
  Package,
  Truck,
  MapPin,
};

const invoiceColumns = [
  { key: "item", label: "Item" },
  { key: "amount", label: "Amount" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
  { key: "date", label: "Date" },
];

const readingColumns = [
  { key: "item", label: "Article" },
  { key: "category", label: "Desk" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
  { key: "date", label: "Date" },
];

const mapDeliveryTimeline = (items) =>
  items.map((item) => ({
    ...item,
    icon: deliveryIconMap[item.icon] || Package,
  }));

export function ReaderDeliveriesPage() {
  const { user } = useAuth();
  const subscription = useMemo(
    () => getReaderSubscriptionSnapshot(user?.email),
    [user?.email],
  );

  const currentDelivery = {
    ...readerDeliveryCurrent,
    destination: subscription.locationSummary,
    eta: subscription.isPrintSubscriber
      ? readerDeliveryCurrent.eta
      : "Digital-only plan",
    note: subscription.isPrintSubscriber
      ? readerDeliveryCurrent.note
      : "Your current plan does not schedule physical newspaper drops yet.",
  };

  const currentTone = subscription.isPrintSubscriber ? readerDeliveryCurrent.tone : "neutral";
  const currentStatus = subscription.isPrintSubscriber ? readerDeliveryCurrent.status : "No print route";

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Reader deliveries"
        title="Shipment timing and delivery history"
        description=""
        action={
          <Link
            to="/delivery"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Open public delivery page
            <Truck className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search edition, tracking ID, or destination"
        filters={[
          subscription.isPrintSubscriber ? "Print + Digital" : "Digital-only plan",
          "Biweekly cadence",
          "Belgium and Germany coverage",
        ]}
      />

      {!subscription.isPrintSubscriber ? (
        <DashboardEmptyState
          title="No physical delivery is scheduled for the digital-only plan."
          action={
            <Link
              to="/subscriptions"
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
            >
              Upgrade plan
              <Truck className="h-4 w-4" />
            </Link>
          }
        />
      ) : (
        <>
          <ShipmentKpiSummary items={readerDeliveryKpis} />

          <DeliveryStatusHero
            edition={currentDelivery.edition}
            trackingId={currentDelivery.trackingId}
            status={currentStatus}
            tone={currentTone}
            destination={currentDelivery.destination}
            eta={currentDelivery.eta}
            note={currentDelivery.note}
          />

          <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
            <DeliveryTimelinePanel
              title="Current shipment timeline"
              description=""
              items={mapDeliveryTimeline(readerDeliveryTimeline)}
            />
            <DeliveryMapPanel
              title="Route coverage"
              description=""
              imageSrc={IMAGES.delivery}
              imageAlt="Delivery route and newspaper distribution visual"
              tags={["Brussels cluster", "Belgium + Germany", "Route placeholder"]}
              caption=""
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <DeliveryHistoryTable
              title="Delivery history"
              description=""
              rows={readerDeliveryHistoryRows}
            />
            <ShipmentIssuePanel
              title="Issue states and support readiness"
              description=""
              items={readerDeliveryIssueStates}
            />
          </section>
        </>
      )}
    </div>
  );
}

export function ReaderBillingPage() {
  const { user } = useAuth();
  const subscription = useMemo(
    () => getReaderSubscriptionSnapshot(user?.email),
    [user?.email],
  );

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Reader billing"
        title="Plan, renewal, and payment history"
        description=""
        action={
          <Link
            to="/subscriptions"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Compare plans
            <CreditCard className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search invoice, payment path, or renewal event"
        filters={[
          subscription.billingCycle === "yearly" ? "Yearly renewal" : "Monthly renewal",
          subscription.paymentMethod,
          subscription.planName,
        ]}
      />

      <section className="grid gap-4 md:grid-cols-3">
        {readerBillingQuickFacts.map((metric, index) => {
          const valueMap = {
            "Current plan": subscription.planName,
            "Renewal cycle":
              subscription.billingCycle === "yearly" ? "Yearly" : "Monthly",
            "Payment path": subscription.paymentMethod,
          };

          return (
            <DashboardMetricCard
              key={metric.label}
              label={metric.label}
              value={valueMap[metric.label] || metric.value}
              detail=""
              accent={index === 1}
            />
          );
        })}
      </section>

      <DashboardSplitMetricCard
        title="Renewal snapshot"
        leftLabel="Next charge"
        leftValue={subscription.nextBillingDate}
        rightLabel="Expected amount"
        rightValue={`€${subscription.billingAmount.toFixed(2)}`}
        footer={`Payment method on file: ${subscription.paymentMethod}`}
      />

      <DashboardPanel
        title="Payment history and renewal events"
      >
        <div className="dashboard-table-wrap overflow-x-auto">
          <table className="w-full min-w-[620px]">
            <thead>
              <tr className="border-b border-stone-200/80 dark:border-stone-700/80">
                {invoiceColumns.map((column) => (
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
              {readerBillingRows.map((row) => (
                <tr key={row.id} className="border-b last:border-b-0">
                  {invoiceColumns.map((column) => (
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
    </div>
  );
}

export function ReaderHistoryPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Reader history"
        title="Saved stories and recent reading"
        description=""
        action={
          <Link
            to="/news"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Browse latest news
            <Search className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search saved stories, desks, or reading status"
        filters={["Saved queue", "Subscriber access", "Archive opening soon"]}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <DashboardMetricCard
          label="Saved stories"
          value="18"
          detail=""
        />
        <DashboardMetricCard
          label="Read this week"
          value="47"
          detail=""
          accent
        />
        <DashboardMetricCard
          label="Archive transitions"
          value="3 pending"
          detail=""
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <DashboardChartPanel
          title="Reading rhythm"
          description=""
          data={readerDashboardReadingBars}
        />
        <DashboardPanel
          title="Saved collections"
          className="h-full"
        >
          <div className="space-y-4">
            {readerSavedCollections.map((collection) => (
              <Link
                key={collection.id}
                to={collection.route}
                className="block rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4 transition hover:border-stone-300 hover:bg-white"
              >
                <p className="font-sans text-sm font-semibold text-stone-900 dark:text-stone-100">
                  {collection.title}
                </p>
                <p className="mt-2 font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
                  {collection.detail}
                </p>
              </Link>
            ))}
          </div>
        </DashboardPanel>
      </section>

      <DashboardPanel
        title="Recent reading history"
      >
        <div className="dashboard-table-wrap overflow-x-auto">
          <table className="w-full min-w-[620px]">
            <thead>
              <tr className="border-b border-stone-200/80 dark:border-stone-700/80">
                {readingColumns.map((column) => (
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
              {readerHistoryRows.map((row) => (
                <tr key={row.id} className="border-b last:border-b-0">
                  {readingColumns.map((column) => (
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
    </div>
  );
}

export function ReaderProfilePage() {
  const { user, checkUserAuth } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    contactPhone: "",
    deliveryAddress: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      contactPhone: user?.contactPhone || "",
      deliveryAddress: user?.deliveryAddress || "",
      city: user?.city || "",
      postalCode: user?.postalCode || "",
      country: user?.country || "",
    });
  }, [user]);

  if (!user) {
    return (
      <DashboardEmptyState
        title="Sign in to manage your reader profile."
        action={
          <Link
            to="/login?journey=individual"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Reader sign in
            <Search className="h-4 w-4" />
          </Link>
        }
      />
    );
  }

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!form.name || !form.deliveryAddress || !form.country) {
      setError("Please complete your name, delivery address, and country before saving.");
      return;
    }

    setIsSaving(true);

    try {
      await appClient.auth.updateProfile({
        name: form.name,
        contactPhone: form.contactPhone,
        deliveryAddress: form.deliveryAddress,
        city: form.city,
        postalCode: form.postalCode,
        country: form.country,
      });
      await checkUserAuth();
      setSuccessMessage("Profile details saved for delivery coordination and account support.");
    } catch (saveError) {
      setError(saveError.message || "Profile changes could not be saved.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Reader profile"
        title="Manage account and delivery details"
        description=""
      />

      <section className="grid gap-4 md:grid-cols-3">
        {readerProfileHighlights.map((item, index) => (
          <DashboardMetricCard
            key={item.label}
            label={item.label}
            value={item.value}
            detail={item.detail}
            accent={index === 1}
          />
        ))}
      </section>

      <DashboardPanel
        title="Profile details"
        className="h-full"
      >
        <ReaderProfileForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isSaving={isSaving}
          error={error}
          successMessage={successMessage}
        />
      </DashboardPanel>
    </div>
  );
}

export function ReaderPrivacyPage() {
  const { user } = useAuth();
  const [consents, setConsents] = useState({
    newsletterOptIn: false,
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
    const loadPrivacyState = async () => {
      if (!user) {
        return;
      }

      try {
        const [nextConsents, nextRequests] = await Promise.all([
          appClient.account.getConsentSettings(),
          appClient.account.listGovernanceRequests(),
        ]);
        setConsents(nextConsents);
        setRequests(nextRequests.slice().reverse());
      } catch {
        // Keep fallback state if local mock data is unavailable.
      }
    };

    loadPrivacyState();
  }, [user]);

  if (!user) {
    return (
      <DashboardEmptyState
        title="Sign in to use privacy and governance controls."
        action={
          <Link
            to="/login?journey=individual"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Reader sign in
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
    const nextRequests = await appClient.account.listGovernanceRequests();
    setRequests(nextRequests.slice().reverse());
  };

  const handleSaveConsents = async (e) => {
    e.preventDefault();
    setConsentError("");
    setConsentSuccess("");
    setIsSavingConsents(true);

    try {
      await appClient.account.saveConsentSettings(consents);
      setConsentSuccess("Consent settings saved for the current account.");
    } catch (saveError) {
      setConsentError(saveError.message || "Consent settings could not be saved.");
    } finally {
      setIsSavingConsents(false);
    }
  };

  const handleExportRequest = async () => {
    setRequestError("");
    setRequestSuccess("");
    setIsSubmittingExport(true);

    try {
      await appClient.account.requestDataExport({ notes });
      await refreshGovernanceRequests();
      setRequestSuccess("Data export request logged in the local governance queue.");
      setNotes("");
    } catch (requestActionError) {
      setRequestError(requestActionError.message || "The export request could not be created.");
    } finally {
      setIsSubmittingExport(false);
    }
  };

  const handleDeletionRequest = async () => {
    setRequestError("");
    setRequestSuccess("");
    setIsSubmittingDeletion(true);

    try {
      await appClient.account.requestDeletion({ reason: notes });
      await refreshGovernanceRequests();
      setRequestSuccess("Deletion review request logged in the local governance queue.");
      setNotes("");
    } catch (requestActionError) {
      setRequestError(requestActionError.message || "The deletion request could not be created.");
    } finally {
      setIsSubmittingDeletion(false);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Reader privacy"
        title="Consent visibility and data-governance actions"
        description=""
      />

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardPanel
          title="Consent settings"
          className="h-full"
        >
          <AccountConsentForm
            values={consents}
            onChange={handleConsentChange}
            onSubmit={handleSaveConsents}
            isSaving={isSavingConsents}
            checklist={readerConsentChecklist}
            error={consentError}
            successMessage={consentSuccess}
          />
        </DashboardPanel>

        <DashboardPanel
          title="Governance requests"
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
            notesConfig={readerGovernanceActionNotes}
            error={requestError}
            successMessage={requestSuccess}
          />
        </DashboardPanel>
      </section>
    </div>
  );
}
