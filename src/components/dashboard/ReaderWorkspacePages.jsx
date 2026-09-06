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
  readerBillingEvents,
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
  policyContacts,
  privacyPrinciples,
  privacyRetentionNotes,
  privacyRights,
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
        description="The reader delivery section should keep route state, cadence, and past drops easy to trust before the full logistics phase deepens the map and issue tooling."
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
          description="This workspace still reserves the delivery history and shipment structure, but a print route will only appear after upgrading to a print-enabled reader plan."
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
              description="A timeline should expose the route stage without forcing the subscriber into a support request or separate map page."
              items={mapDeliveryTimeline(readerDeliveryTimeline)}
            />
            <DeliveryMapPanel
              title="Route coverage"
              description="The shared delivery map surface will become richer later, but the reader should already see where the route context belongs."
              imageSrc={IMAGES.delivery}
              imageAlt="Delivery route and newspaper distribution visual"
              tags={["Brussels cluster", "Belgium + Germany", "Route placeholder"]}
              caption="Belgium and Germany route coverage stays visible as a reminder that shipment timing is tied to regional dispatch logic rather than individual billing timestamps."
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <DeliveryHistoryTable
              title="Delivery history"
              description="Keep recent drops visible in a structured table so missed or late deliveries can be spotted quickly."
              rows={readerDeliveryHistoryRows}
            />
            <ShipmentIssuePanel
              title="Issue states and support readiness"
              description="Delivery exceptions, address verification, and support readiness now sit in a reusable shipment module instead of an inline reminder list."
              items={readerDeliveryIssueStates}
              footer="Billing cadence stays separate from print cadence, so the same issue-state surface can serve monthly and yearly reader plans."
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
        description="Billing details should be structured enough for renewals and receipts, but still easy to scan from a subscriber point of view."
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
              detail={metric.detail}
              accent={index === 1}
            />
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <DashboardSplitMetricCard
          title="Renewal snapshot"
          leftLabel="Next charge"
          leftValue={subscription.nextBillingDate}
          rightLabel="Expected amount"
          rightValue={`€${subscription.billingAmount.toFixed(2)}`}
          footer={`Payment method on file: ${subscription.paymentMethod}`}
        />
        <DashboardPanel
          title="Billing rules at a glance"
          description="Keep the pricing model understandable before invoice exports and detailed statements arrive later."
          className="h-full"
        >
          <div className="space-y-4">
            {readerBillingEvents.map((event) => (
              <div
                key={event.title}
                className="rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4"
              >
                <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-900 dark:text-stone-100">
                  {event.title}
                </p>
                <p className="mt-2 font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
                  {event.body}
                </p>
              </div>
            ))}
          </div>
        </DashboardPanel>
      </section>

      <DashboardPanel
        title="Payment history and renewal events"
        description="Reader billing should expose invoice activity, reminder states, and payment verification without mixing them into the overview cards."
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
        description="This route should scale beyond a simple overview teaser and give the subscriber a clear place to resume, save, and revisit reporting."
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
          detail="The queue is compact here so the route can grow later without stretching the overview."
        />
        <DashboardMetricCard
          label="Read this week"
          value="47"
          detail="Engagement can be summarized here and charted without hiding the actual article list."
          accent
        />
        <DashboardMetricCard
          label="Archive transitions"
          value="3 pending"
          detail="A few saved articles are close to moving out of the subscriber-first window."
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <DashboardChartPanel
          title="Reading rhythm"
          description="A simple activity chart helps summarize weekly usage without replacing the recent-reading list below."
          data={readerDashboardReadingBars}
        />
        <DashboardPanel
          title="Saved collections"
          description="Saved content should stay grouped around what the subscriber is likely to continue next."
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
        description="The subscriber should be able to scan what was read, what was saved, and what is about to leave the subscriber-first window."
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
        description="Profile editing, address updates, and consent visibility live inside the authenticated workspace because they depend on the current account record."
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
        description="The profile route should keep personal data updates separate from billing and delivery history, while still making it obvious how those fields affect subscription operations."
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

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardPanel
          title="Profile details"
          description="Update the contact and location fields that billing support and delivery routing rely on."
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

        <DashboardPanel
          title="Why these fields matter"
          description="The reader profile should explain why operational data exists instead of leaving the form feeling arbitrary."
          className="h-full"
        >
          <div className="space-y-4">
            {[
              "Delivery address determines shipment routing whenever the active reader plan includes print distribution.",
              "Contact details support renewal reminders, missed-delivery follow-up, and account governance communication.",
              "Country and postal details help the platform stay aligned with Belgium and Germany rollout assumptions.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4"
              >
                <p className="font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
                  {item}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-900 dark:text-stone-100">
              Need governance controls instead?
            </p>
            <p className="mt-2 font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
              Consent visibility, export requests, and deletion review actions live in the privacy route so this page can stay focused on profile maintenance.
            </p>
            <Link
              to="/dashboard/privacy"
              className="mt-3 inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-900 hover:underline"
            >
              Open privacy controls
              <Search className="h-4 w-4" />
            </Link>
          </div>
        </DashboardPanel>
      </section>
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
        description="Export requests, deletion review, and consent visibility are account-specific actions, so they only make sense inside the authenticated reader workspace."
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
        description="This route should make GDPR-style rights concrete inside the product by showing what the platform stores, what consent means, and how a subscriber can request export or deletion review."
      />

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardPanel
          title="Consent settings"
          description="Keep marketing preferences separate from essential privacy and delivery coordination visibility."
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
          description="Export and deletion review should be discoverable without forcing the user to leave the dashboard."
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

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <DashboardPanel
          title="Privacy principles in the account context"
          description="The dashboard view should translate policy text into operationally understandable explanations."
          className="h-full"
        >
          <div className="grid gap-4">
            {privacyPrinciples.map((item) => (
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
            title="Reader rights"
            description="Rights should be visible as actions and expectations, not buried inside a static policy page."
          >
            <ul className="space-y-3">
              {privacyRights.map((right) => (
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
            title="Retention notes"
            description="Deletion requests may still require operational or legal review depending on the data category."
          >
            <div className="space-y-3">
              {privacyRetentionNotes.map((note) => (
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
            description="Some governance requests will still need a human follow-up path alongside self-service actions."
          >
            <div className="space-y-2 font-sans text-sm text-stone-700 dark:text-stone-300">
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
            </div>
          </DashboardPanel>
        </div>
      </section>
    </div>
  );
}
