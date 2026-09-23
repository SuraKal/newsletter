import React, { useMemo, useState } from "react";
import { CirclePlus, Send } from "lucide-react";

// Shared form for starting a new shipment run. Supports two sources:
//   bulk_order — pick an approved order request and prefill the run from it
//   manual      — start from scratch, optionally assigning a company (admin)
//
// `companies` is only needed for admin/manual runs that want to attach the
// run to an approved company. Business runs always stay on the caller's own
// company account, so that list stays empty there.
export default function ShipmentRunForm({
  orders = [],
  companies = [],
  defaultMode = "bulk_order",
  defaultOrderId = "",
  companyHint = null,
  onSubmit,
  submitLabel = "Start shipment run",
  showCompanies = false,
}) {
  const approvedOrders = useMemo(
    () => orders.filter((order) => order.status === "Approved"),
    [orders],
  );

  const [mode, setMode] = useState(
    defaultMode === "manual" || (defaultMode === "bulk_order" && !approvedOrders.length)
      ? "manual"
      : "bulk_order",
  );
  const [selectedOrderId, setSelectedOrderId] = useState(defaultOrderId);
  const [label, setLabel] = useState("");
  const [route, setRoute] = useState("");
  const [scope, setScope] = useState("");
  const [eta, setEta] = useState("");
  const [notes, setNotes] = useState("");
  const [companyAccountId, setCompanyAccountId] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedOrder = useMemo(
    () => approvedOrders.find((order) => order.id === selectedOrderId) || null,
    [approvedOrders, selectedOrderId],
  );

  const pickOrder = (orderId) => {
    setSelectedOrderId(orderId);
    const order = approvedOrders.find((item) => item.id === orderId);
    if (!order) {
      return;
    }
    const locations = Array.isArray(order.deliveryLocations)
      ? order.deliveryLocations
      : [];
    setLabel([order.articleTitle, order.company].filter(Boolean).join(" · "));
    setRoute(locations[0] || "Consolidated route");
    setScope(Number(order.copies) ? `${order.copies} copies` : "");
    setEta(
      order.neededBy
        ? new Date(`${order.neededBy}T00:00:00`).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "",
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!label.trim()) {
      setMessage("Give this run a label before starting it.");
      return;
    }
    if (mode === "bulk_order" && !selectedOrderId) {
      setMessage("Choose an approved order request to start the run from.");
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      const payload = {
        sourceType: mode,
        label: label.trim(),
        route: route.trim(),
        scope: scope.trim(),
        eta: eta.trim(),
        notes: notes.trim(),
        orderRequestId: mode === "bulk_order" ? selectedOrderId : null,
        companyAccountId:
          mode === "manual" && showCompanies ? companyAccountId || null : null,
      };
      if (mode === "bulk_order" && selectedOrder) {
        payload.deliveryLocations = Array.isArray(selectedOrder.deliveryLocations)
          ? selectedOrder.deliveryLocations
          : [];
      }
      const row = await onSubmit(payload);
      setMessage(
        `Run ${row?.shipmentId || ""} started. Opening the run detail view.`,
      );
    } catch (error) {
      setMessage(error?.message || "The shipment run could not be started.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div>
        <p className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-700 dark:text-stone-300">
          Run source
        </p>
        <div className="inline-flex flex-wrap gap-2 rounded-full border border-stone-200 bg-stone-50 p-1 dark:border-stone-700 dark:bg-stone-900">
          <button
            type="button"
            onClick={() => setMode("bulk_order")}
            disabled={!approvedOrders.length}
            className={`rounded-full px-4 py-2 font-sans text-xs font-bold uppercase tracking-[0.16em] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              mode === "bulk_order"
                ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                : "text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100"
            }`}
          >
            From bulk order
          </button>
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={`rounded-full px-4 py-2 font-sans text-xs font-bold uppercase tracking-[0.16em] transition-colors ${
              mode === "manual"
                ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                : "text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100"
            }`}
          >
            From nothing
          </button>
        </div>
        {mode === "bulk_order" && !approvedOrders.length ? (
          <p className="mt-3 font-sans text-xs text-stone-500 dark:text-stone-400">
            No approved order requests are available yet. Approved requests
            appear here once an admin confirms their final price.
          </p>
        ) : null}
      </div>

      {mode === "bulk_order" && approvedOrders.length ? (
        <div>
          <label
            htmlFor="shipment-run-order"
            className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-700 dark:text-stone-300"
          >
            Approved order request
          </label>
          <select
            id="shipment-run-order"
            value={selectedOrderId}
            onChange={(event) => pickOrder(event.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 font-sans text-base text-stone-900 outline-none transition-colors focus:border-[#4A2A08] focus:ring-2 focus:ring-[#4A2A08]/15 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          >
            <option value="">Select an approved bulk-order request</option>
            {approvedOrders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.articleTitle || "Bulk order"} · {order.company} ·{" "}
                {order.copies} copies
              </option>
            ))}
          </select>
          <p className="mt-2 font-sans text-xs text-stone-500 dark:text-stone-400">
            Selecting a request pre-fills the run below from its copies,
            delivery locations, and required-by date.
          </p>
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label
            htmlFor="shipment-run-label"
            className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-700 dark:text-stone-300"
          >
            Run label
          </label>
          <input
            id="shipment-run-label"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="e.g. Release prep · Brussels central"
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 font-sans text-base text-stone-900 outline-none transition-colors focus:border-[#4A2A08] focus:ring-2 focus:ring-[#4A2A08]/15 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          />
        </div>

        <div>
          <label
            htmlFor="shipment-run-route"
            className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-700 dark:text-stone-300"
          >
            Route cluster
          </label>
          <input
            id="shipment-run-route"
            value={route}
            onChange={(event) => setRoute(event.target.value)}
            placeholder="e.g. Belgium North cluster"
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 font-sans text-base text-stone-900 outline-none transition-colors focus:border-[#4A2A08] focus:ring-2 focus:ring-[#4A2A08]/15 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          />
        </div>

        <div>
          <label
            htmlFor="shipment-run-scope"
            className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-700 dark:text-stone-300"
          >
            Scope
          </label>
          <input
            id="shipment-run-scope"
            value={scope}
            onChange={(event) => setScope(event.target.value)}
            placeholder="e.g. 8 stops / 320 copies"
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 font-sans text-base text-stone-900 outline-none transition-colors focus:border-[#4A2A08] focus:ring-2 focus:ring-[#4A2A08]/15 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          />
        </div>

        <div>
          <label
            htmlFor="shipment-run-eta"
            className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-700 dark:text-stone-300"
          >
            Expected delivery
          </label>
          <input
            id="shipment-run-eta"
            value={eta}
            onChange={(event) => setEta(event.target.value)}
            placeholder="e.g. September 25, 2026 · 8:10 AM"
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 font-sans text-base text-stone-900 outline-none transition-colors focus:border-[#4A2A08] focus:ring-2 focus:ring-[#4A2A08]/15 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          />
        </div>

        {showCompanies ? (
          <div>
            <label
              htmlFor="shipment-run-company"
              className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-700 dark:text-stone-300"
            >
              Company (optional)
            </label>
            <select
              id="shipment-run-company"
              value={companyAccountId}
              onChange={(event) => setCompanyAccountId(event.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 font-sans text-base text-stone-900 outline-none transition-colors focus:border-[#4A2A08] focus:ring-2 focus:ring-[#4A2A08]/15 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
            >
              <option value="">Platform-wide run</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.company}
                </option>
              ))}
            </select>
            {companyHint ? (
              <p className="mt-2 font-sans text-xs text-stone-500 dark:text-stone-400">
                {companyHint}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="shipment-run-notes"
          className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-700 dark:text-stone-300"
        >
          Dispatch notes (optional)
        </label>
        <textarea
          id="shipment-run-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
          placeholder="Anything the receiving stops or fleet should know about this run."
          className="w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 font-sans text-base text-stone-900 outline-none transition-colors focus:border-[#4A2A08] focus:ring-2 focus:ring-[#4A2A08]/15 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
        />
      </div>

      {message ? (
        <p
          className={`font-sans text-sm ${
            submitting || message.includes("started") ? "text-stone-700" : "text-red-700"
          }`}
        >
          {message}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-100 dark:text-stone-900"
        >
          <Send className="h-4 w-4" />
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedOrderId("");
            setLabel("");
            setRoute("");
            setScope("");
            setEta("");
            setNotes("");
            setMessage("");
          }}
          className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-700 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-200"
        >
          <CirclePlus className="h-4 w-4" />
          Clear form
        </button>
      </div>
    </form>
  );
}