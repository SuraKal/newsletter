import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CreditCard, Package, Search, Truck } from "lucide-react";
import { appClient } from "@/api/appClient";
import { useAuth } from "@/lib/AuthContext";
import { appParams } from "@/lib/app-params";
import {
  DashboardEmptyState,
  DashboardFactList,
  DashboardFilterBar,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPagination,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { useTableFilters, useTableQuery } from "@/lib/useTableQuery";
import ReaderProfileForm from "@/components/forms/ReaderProfileForm";
import AccountConsentForm from "@/components/forms/AccountConsentForm";
import GovernanceRequestPanel from "@/components/forms/GovernanceRequestPanel";
import DeliveryStatusHero from "@/components/delivery/DeliveryStatusHero";
import DeliveryHistoryTable from "@/components/delivery/DeliveryHistoryTable";
import { getReaderSubscriptionSnapshot } from "@/lib/reader-subscription";
import { getReadingHistoryRows } from "@/lib/reading-history";
import { getDeliveryByTrackingCode } from "@/lib/delivery-store";
import {
  readerConsentChecklist,
  readerBillingRows,
  readerDeliveryCurrent,
  readerDeliveryHistoryRows,
  readerGovernanceActionNotes,
  readerSavedCollections,
} from "@/lib/demoData";

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
  {
    key: "item",
    label: "Article",
    render: (value, row) => (
      <Link
        to={`/article/${row.articleId || row.id}`}
        className="font-medium text-stone-900 transition-colors hover:text-heritage dark:text-stone-100"
      >
        {value}
      </Link>
    ),
  },
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

const matchesBillingSearch = (row, query) =>
  [row.item, row.amount, row.status, row.date].some((value) =>
    String(value ?? "").toLowerCase().includes(query),
  );

const matchesReadingSearch = (row, query) =>
  [row.item, row.category, row.status, row.date].some((value) =>
    String(value ?? "").toLowerCase().includes(query),
  );

const billingFilterGroups = [{ key: "status", label: "Status" }];

const readingFilterGroups = [
  { key: "category", label: "Category" },
  { key: "status", label: "Status" },
];

const readerRelatedLinks = (current) => [
  { label: "Deliveries", to: "/dashboard/deliveries" },
  { label: "Billing", to: "/dashboard/billing" },
  { label: "Reading history", to: "/dashboard/history" },
  { label: "Profile", to: "/dashboard/profile" },
  { label: "Privacy", to: "/dashboard/privacy" },
].filter((link) => link.label !== current);

const makeBreadcrumbs = (label) => [
  { label: "Reader workspace", to: "/dashboard/overview" },
  { label },
];

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
        description="Track the current shipment, then review past deliveries."
        breadcrumbs={makeBreadcrumbs("Deliveries")}
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
          <DeliveryStatusHero
            edition={currentDelivery.edition}
            trackingId={currentDelivery.trackingId}
            status={currentStatus}
            tone={currentTone}
            destination={currentDelivery.destination}
            eta={currentDelivery.eta}
            note={currentDelivery.note}
          />

          <DashboardPanel title="Delivery history" className="p-5 sm:p-6">
            <DeliveryHistoryTable
              title=""
              rows={readerDeliveryHistoryRows}
              trackingHref={(row) => `/dashboard/deliveries/${row.trackingId}`}
            />
          </DashboardPanel>
        </>
      )}

      <DashboardRelatedLinks title="Quick links" items={readerRelatedLinks("Deliveries")} />
    </div>
  );
}

export function ReaderDeliveryDetailPage() {
  const { user } = useAuth();
  const { trackingCode } = useParams();
  const subscription = useMemo(
    () => getReaderSubscriptionSnapshot(user?.email),
    [user?.email],
  );
  const delivery = getDeliveryByTrackingCode(trackingCode) || null;

  if (!subscription.isPrintSubscriber) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          eyebrow="Reader delivery"
          title="Delivery detail"
          breadcrumbs={makeBreadcrumbs("Deliveries")}
        />
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
        <DashboardRelatedLinks title="Quick links" items={readerRelatedLinks("Deliveries")} />
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          eyebrow="Reader delivery"
          title="Delivery not found"
          breadcrumbs={[
            { label: "Reader workspace", to: "/dashboard/overview" },
            { label: "Deliveries", to: "/dashboard/deliveries" },
          ]}
          action={
            <Link
              to="/dashboard/deliveries"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to deliveries
            </Link>
          }
        />
        <DashboardPanel title="Delivery history">
          <DashboardEmptyState title="No delivery matches this tracking ID." />
        </DashboardPanel>
        <DashboardRelatedLinks title="Quick links" items={readerRelatedLinks("Deliveries")} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Reader delivery"
        title={delivery.edition}
        description="Delivery record for one subscriber edition."
        breadcrumbs={[
          { label: "Reader workspace", to: "/dashboard/overview" },
          { label: "Deliveries", to: "/dashboard/deliveries" },
          { label: delivery.trackingId },
        ]}
        action={
          <Link
            to="/dashboard/deliveries"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to deliveries
          </Link>
        }
      />

      <DeliveryStatusHero
        edition={delivery.edition}
        trackingId={delivery.trackingId}
        status={delivery.status}
        tone={delivery.tone}
        destination={subscription.locationSummary}
        eta={delivery.eta || delivery.date}
        note={delivery.note}
      />

      <DashboardPanel title="Delivery summary" className="p-5 sm:p-6">
        <DashboardFactList
          items={[
            { label: "Edition", value: delivery.edition },
            { label: "Tracking ID", value: delivery.trackingId },
            { label: "Destination", value: subscription.locationSummary },
            {
              label: "Delivery status",
              value: (
                <DashboardStatusBadge label={delivery.status} tone={delivery.tone} />
              ),
            },
          ]}
        />
      </DashboardPanel>

      <DashboardRelatedLinks title="Quick links" items={readerRelatedLinks("Deliveries")} />
    </div>
  );
}

export function ReaderBillingPage() {
  const { user } = useAuth();
  const subscription = useMemo(
    () => getReaderSubscriptionSnapshot(user?.email),
    [user?.email],
  );
  const [query, setQuery] = useState("");
  const { activeFilters, setFilter, clearFilters } = useTableFilters();
  const table = useTableQuery({
    rows: readerBillingRows,
    query,
    predicate: matchesBillingSearch,
    activeFilters,
    filterGroups: billingFilterGroups,
  });

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Reader billing"
        title="Plan, renewal, and payment history"
        description="Review your plan and renewal terms, then check individual charges."
        breadcrumbs={makeBreadcrumbs("Billing")}
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

      <DashboardPanel title="Renewal snapshot" className="p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
          <div>
            <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
              Current plan
            </p>
            <p className="mt-1.5 font-sans text-base font-semibold text-stone-900 dark:text-stone-100">
              {subscription.planName}
            </p>
          </div>
          <div>
            <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
              Renewal cycle
            </p>
            <p className="mt-1.5 font-sans text-base font-semibold text-stone-900 dark:text-stone-100">
              {subscription.billingCycle === "yearly" ? "Yearly" : "Monthly"}
            </p>
          </div>
          <div>
            <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
              Payment path
            </p>
            <p className="mt-1.5 font-sans text-base font-semibold text-stone-900 dark:text-stone-100">
              {subscription.paymentMethod}
            </p>
          </div>
          <div>
            <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
              Next charge
            </p>
            <p className="mt-1.5 font-sans text-base font-semibold text-stone-900 dark:text-stone-100">
              {subscription.nextBillingDate}
            </p>
          </div>
          <div>
            <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
              Expected amount
            </p>
            <p className="mt-1.5 font-sans text-base font-semibold text-stone-900 dark:text-stone-100">
              €{subscription.billingAmount.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
              Delivery mode
            </p>
            <p className="mt-1.5 font-sans text-base font-semibold text-stone-900 dark:text-stone-100">
              {subscription.deliveryMode}
            </p>
          </div>
        </div>
      </DashboardPanel>

      <DashboardFilterBar
        searchPlaceholder="Search payment item, amount, status, or date"
        searchValue={query}
        onSearchChange={setQuery}
        resultCount={query.trim() || table.hasActiveFilters ? table.total : null}
        filterGroups={billingFilterGroups}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        filterOptions={table.filterOptions}
        filters={[subscription.planName, subscription.billingCycle]}
      />

      <DashboardPanel title="Payment history and renewal events" className="p-5 sm:p-6">
        {table.total ? (
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
                {table.rows.map((row) => (
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
        ) : (
          <DashboardEmptyState
            title="No matching payment events"
            description="Try clearing the status filter to see the full payment history."
          />
        )}
        <DashboardPagination
          page={table.page}
          pageCount={table.pageCount}
          total={table.total}
          pageSize={table.pageSize}
          onPageChange={table.setPage}
        />
      </DashboardPanel>

      <DashboardRelatedLinks title="Quick links" items={readerRelatedLinks("Billing")} />
    </div>
  );
}

export function ReaderHistoryPage() {
  const readingRows = getReadingHistoryRows();
  const [query, setQuery] = useState("");
  const { activeFilters, setFilter, clearFilters } = useTableFilters();
  const table = useTableQuery({
    rows: readingRows,
    query,
    predicate: matchesReadingSearch,
    activeFilters,
    filterGroups: readingFilterGroups,
  });

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Reader history"
        title="Saved stories and recent reading"
        description="Browse what you have read and revisit saved stories."
        breadcrumbs={makeBreadcrumbs("Reading")}
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

      <DashboardPanel title="Saved collections" className="p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {readerSavedCollections.map((collection) => (
            <Link
              key={collection.id}
              to={collection.route}
              className="dashboard-shortcut flex items-center gap-3"
            >
              <span className="dashboard-icon-badge flex h-10 w-10 shrink-0 items-center justify-center">
                <Package className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block font-sans text-sm font-semibold text-stone-900 dark:text-stone-100">
                  {collection.title}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </DashboardPanel>

      <DashboardFilterBar
        searchPlaceholder="Search article, desk, status, or date"
        searchValue={query}
        onSearchChange={setQuery}
        resultCount={query.trim() || table.hasActiveFilters ? table.total : null}
        filterGroups={readingFilterGroups}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        filterOptions={table.filterOptions}
        filters={[`${readingRows.length} stories in history`]}
      />

      <DashboardPanel title="Recent reading history" className="p-5 sm:p-6">
        {table.total ? (
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
                {table.rows.map((row) => (
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
        ) : (
          <DashboardEmptyState
            title="No matching reading history"
            description="Try clearing the category or status filters to see your full reading history."
          />
        )}
        <DashboardPagination
          page={table.page}
          pageCount={table.pageCount}
          total={table.total}
          pageSize={table.pageSize}
          onPageChange={table.setPage}
        />
      </DashboardPanel>

      <DashboardRelatedLinks title="Quick links" items={readerRelatedLinks("Reading history")} />
    </div>
  );
}

export function ReaderProfilePage() {
  const [form, setForm] = useState({
    name: `${appParams.appName} Reader`,
    email: appParams.readerEmail,
    contactPhone: "+32 470 00 00 00",
    deliveryAddress: "Rue de la Presse 12",
    city: "Brussels",
    postalCode: "1000",
    country: "Belgium",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const profile = await appClient.auth.me();

        if (mounted) {
          setForm((current) => ({
            ...current,
            name: profile.name || current.name,
            email: profile.email || current.email,
            contactPhone: profile.contactPhone || current.contactPhone,
            deliveryAddress: profile.deliveryAddress || current.deliveryAddress,
            city: profile.city || current.city,
            postalCode: profile.postalCode || current.postalCode,
            country: profile.country || current.country,
          }));
        }
      } catch {
        // Keep the demo profile as prefilled defaults.
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

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
        description="Update the personal and delivery information used for your subscription."
        breadcrumbs={makeBreadcrumbs("Profile")}
      />

      <DashboardPanel title="Profile details" className="p-5 sm:p-6">
        <ReaderProfileForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isSaving={isSaving}
          error={error}
          successMessage={successMessage}
        />
      </DashboardPanel>

      <DashboardRelatedLinks title="Quick links" items={readerRelatedLinks("Profile")} />
    </div>
  );
}

export function ReaderPrivacyPage() {
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
  }, []);

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
        title="Consent and data-governance controls"
        description="Control marketing consent and request data export or deletion."
        breadcrumbs={makeBreadcrumbs("Privacy")}
      />

      <DashboardPanel title="Consent settings" className="p-5 sm:p-6">
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

      <DashboardPanel title="Governance requests" className="p-5 sm:p-6">
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

      <DashboardRelatedLinks title="Quick links" items={readerRelatedLinks("Privacy")} />
    </div>
  );
}