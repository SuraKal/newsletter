import React, { useEffect, useState } from "react";
import { CirclePlus, MapPin, Send } from "lucide-react";
import {
  DashboardDataTable,
  DashboardEmptyState,
  DashboardPageHeader,
  DashboardPanel,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { appClient, estimateOrderPrice } from "@/api/appClient";
import { getCompanyWorkflowState } from "@/lib/company-store";
import { useStoreVersion } from "@/lib/store-bus";

const formatNeededBy = (value) => {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const orderColumns = [
  { key: "company", label: "Company", primary: true },
  {
    key: "articleTitle",
    label: "Article",
    render: (value) => value || "—",
  },
  { key: "copies", label: "Copies" },
  {
    key: "neededBy",
    label: "Required by",
    render: (value) => formatNeededBy(value),
  },
  {
    key: "estimatedPrice",
    label: "Estimated",
    render: (value) => (value ? `€${Number(value).toFixed(2)}` : "—"),
  },
  {
    key: "finalPrice",
    label: "Confirmed price",
    render: (value) => (value == null ? "—" : `€${Number(value).toFixed(2)}`),
  },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
];

const relatedLinks = [
  { label: "Orders", to: "/business-dashboard/orders" },
  { label: "Invoices", to: "/business-dashboard/invoices" },
  { label: "Locations", to: "/business-dashboard/locations" },
  { label: "Shipments", to: "/business-dashboard/shipments" },
];

export default function BusinessOrderRequests() {
  useStoreVersion();
  const [entity, setEntity] = useState(() => appClient.company.snapshot());
  const [orders, setOrders] = useState(() => appClient.companyOrders.list());
  const [articles, setArticles] = useState(() =>
    appClient.articles.list().filter((item) => item.status === "Published"),
  );
  const [copies, setCopies] = useState("");
  const [neededBy, setNeededBy] = useState("");
  const [articleId, setArticleId] = useState("");
  const [locationsInput, setLocationsInput] = useState("");
  const [savedLocations, setSavedLocations] = useState(() =>
    appClient.locations.list(),
  );
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reloadOrders = async () => {
    const next = await appClient.companyOrders.businessList();
    if (Array.isArray(next)) setOrders(next);
  };

  const reloadArticles = async () => {
    await appClient.articles.refresh();
    const next = appClient.articles.list();
    if (Array.isArray(next)) {
      setArticles(next.filter((item) => item.status === "Published"));
    }
  };

  const reloadLocations = async () => {
    const rows = await appClient.locations.refresh();
    if (Array.isArray(rows)) setSavedLocations(rows);
  };

  const fillLocationsFromSaved = () => {
    const labels = savedLocations
      .map((row) => {
        const parts = [row.location, row.address || row.region].filter(Boolean);
        return parts.length ? parts.join(", ") : "";
      })
      .filter(Boolean);
    if (labels.length) {
      setLocationsInput(labels.join("\n"));
      setMessage("");
    } else {
      setMessage(
        "No saved delivery locations yet. Add receiving sites under Locations first.",
      );
    }
  };

  useEffect(() => {
    reloadOrders();
    reloadArticles();
    reloadLocations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const workflowState = entity
    ? getCompanyWorkflowState(entity)
    : "no-account";
  const canRequest = workflowState === "License approved";

  const parsedCopies = Math.max(1, Math.floor(Number(copies) || 0));
  const estimate = estimateOrderPrice(parsedCopies);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canRequest) return;
    setSubmitting(true);
    setMessage("");
    try {
      const locations = locationsInput
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean);
      const selectedArticle = articles.find((item) => item.id === articleId);
      await appClient.companyOrders.businessCreate({
        copies: parsedCopies,
        neededBy,
        articleId,
        articleTitle: selectedArticle?.headline || "",
        deliveryLocations: locations,
      });
      setCopies("");
      setNeededBy("");
      setArticleId("");
      setLocationsInput("");
      setMessage("Order request submitted and waiting for admin confirmation.");
      await reloadOrders();
    } catch (error) {
      setMessage(error?.message || "The order request could not be submitted.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business ordering"
        title="Bulk order requests"
        description="Submit the article, copy volume, and required-by date; an admin confirms the final price before the request becomes an active order."
        breadcrumbs={[
          { label: "Business workspace", to: "/business-dashboard/overview" },
          { label: "Order requests" },
        ]}
        action={null}
      />

      {!canRequest ? (
        <DashboardPanel title="Company access required" className="p-5 sm:p-6">
          <DashboardEmptyState
            title="Your company account is not active yet"
            description="Bulk-order requests open once your business licence is approved and your company account is activated."
          />
        </DashboardPanel>
      ) : (
        <>
          <DashboardPanel title="Request a bulk order" className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="order-copies"
                    className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-700"
                  >
                    Copies needed
                  </label>
                  <input
                    id="order-copies"
                    type="number"
                    min="1"
                    max="100000"
                    value={copies}
                    onChange={(event) => setCopies(event.target.value)}
                    placeholder="e.g. 380"
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 font-sans text-base text-stone-900 outline-none transition-colors focus:border-[#4A2A08] focus:ring-2 focus:ring-[#4A2A08]/15"
                  />
                </div>
                <div>
                  <label
                    htmlFor="order-needed-by"
                    className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-700"
                  >
                    Required by
                  </label>
                  <input
                    id="order-needed-by"
                    type="date"
                    value={neededBy}
                    onChange={(event) => setNeededBy(event.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 font-sans text-base text-stone-900 outline-none transition-colors focus:border-[#4A2A08] focus:ring-2 focus:ring-[#4A2A08]/15"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="order-article"
                  className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-700"
                >
                  Article
                </label>
                <select
                  id="order-article"
                  value={articleId}
                  onChange={(event) => setArticleId(event.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 font-sans text-base text-stone-900 outline-none transition-colors focus:border-[#4A2A08] focus:ring-2 focus:ring-[#4A2A08]/15"
                >
                  <option value="">
                    {articles.length
                      ? "Select the article to print"
                      : "No published articles available"}
                  </option>
                  {articles.map((article) => (
                    <option key={article.id} value={article.id}>
                      {article.headline}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <label
                    htmlFor="order-locations"
                    className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-700"
                  >
                    Delivery locations
                  </label>
                  <button
                    type="button"
                    onClick={fillLocationsFromSaved}
                    disabled={!savedLocations.length}
                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-3 py-1.5 font-sans text-[0.65rem] font-bold uppercase tracking-[0.14em] text-stone-700 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    {savedLocations.length
                      ? "Auto-fill from saved locations"
                      : "No saved locations"}
                  </button>
                </div>
                <textarea
                  id="order-locations"
                  value={locationsInput}
                  onChange={(event) => setLocationsInput(event.target.value)}
                  placeholder={"One location per line, e.g.\nBrussels HQ\nAntwerp"}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 font-sans text-base text-stone-900 outline-none transition-colors focus:border-[#4A2A08] focus:ring-2 focus:ring-[#4A2A08]/15"
                />
                {savedLocations.length ? (
                  <p className="mt-1.5 font-sans text-xs text-stone-500">
                    Auto-fills your {savedLocations.length} saved receiving{" "}
                    {savedLocations.length === 1 ? "site" : "sites"} from the Locations page.
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-stone-700">
                    Price estimate
                  </p>
                  <p className="mt-1 font-sans text-sm text-stone-600">
                    {parsedCopies} copies · €{Number(estimate.rate).toFixed(2)}{" "}
                    / copy
                  </p>
                </div>
                <p className="font-sans text-2xl font-semibold text-stone-900">
                  €{Number(estimate.total).toFixed(2)}
                </p>
              </div>

              {message ? (
                <p
                  className={`font-sans text-sm ${
                    submitting || message.startsWith("The order")
                      ? "text-stone-700"
                      : "text-red-700"
                  }`}
                >
                  {message}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={submitting || !copies || !articleId || !neededBy}
                  className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  Submit for approval
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCopies("");
                    setNeededBy("");
                    setArticleId("");
                    setLocationsInput("");
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700"
                >
                  Clear form
                </button>
              </div>
            </form>
          </DashboardPanel>

          <DashboardPanel title="Request history" className="p-5 sm:p-6">
            {orders.length ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-sans text-sm text-stone-500">
                    {orders.filter((order) => order.status === "Pending approval").length}{" "}
                    pending confirmation
                  </p>
                  <button
                    type="button"
                    onClick={reloadOrders}
                    className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-stone-700"
                  >
                    <CirclePlus className="h-4 w-4" />
                    Refresh
                  </button>
                </div>
                <DashboardDataTable
                  columns={orderColumns}
                  rows={orders}
                  minWidth={780}
                />
              </div>
            ) : (
              <DashboardEmptyState
                title="No order requests yet"
                description="Choose an article, copy volume, and required-by date above to start a bulk-order request."
              />
            )}
          </DashboardPanel>
        </>
      )}

      <DashboardRelatedLinks title="Related links" items={relatedLinks} />
    </div>
  );
}