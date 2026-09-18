import React, { useState } from "react";
import { Check, ExternalLink, X } from "lucide-react";
import {
  DashboardDataTable,
  DashboardEmptyState,
  DashboardPageHeader,
  DashboardPanel,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { appClient } from "@/api/appClient";
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

const requestColumns = [
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
    label: "Estimate",
    render: (value) => (value ? `€${Number(value).toFixed(2)}` : "—"),
  },
  {
    key: "finalPrice",
    label: "Final price",
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
  { label: "Companies", to: "/admin/companies" },
  { label: "Subscriptions", to: "/admin/subscriptions" },
  { label: "Shipments", to: "/admin/shipments" },
  { label: "Subscribers", to: "/admin/subscribers" },
];

export default function AdminOrderRequests() {
  useStoreVersion();
  const [orders, setOrders] = useState(() => appClient.companyOrders.list());
  const [selected, setSelected] = useState(null);
  const [finalPrice, setFinalPrice] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const reload = async () => {
    const next = await appClient.companyOrders.adminList();
    if (Array.isArray(next)) {
      setOrders(next);
      setSelected((current) =>
        current ? next.find((order) => order.id === current.id) || null : current,
      );
    }
  };

  React.useEffect(() => {
    reload();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pending = orders.filter(
    (order) => order.status === "Pending approval",
  );
  const closed = orders.filter((order) => order.status !== "Pending approval");

  const openReview = (order) => {
    setSelected(order);
    setFinalPrice(
      order.finalPrice == null ? String(order.estimatedPrice || "") : String(order.finalPrice),
    );
    setMessage("");
  };

  const decide = async (approved) => {
    if (!selected) return;
    if (approved && !(Number(finalPrice) >= 0)) {
      setMessage("Enter a final price before approving.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      if (approved) {
        await appClient.companyOrders.adminApprove(selected.id, Number(finalPrice));
      } else {
        await appClient.companyOrders.adminDecline(selected.id);
      }
      setMessage(
        approved
          ? "Request approved. The company now sees a confirmed price and volume."
          : "Request declined.",
      );
      await reload();
    } catch (error) {
      setMessage(error?.message || "The request could not be updated.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin ordering"
        title="Bulk order requests"
        description="Review copy volumes submitted by approved companies and confirm a final price before the request becomes an active order."
        breadcrumbs={[
          { label: "Admin workspace", to: "/admin/overview" },
          { label: "Order requests" },
        ]}
        action={
          <button
            type="button"
            onClick={reload}
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700"
          >
            <ExternalLink className="h-4 w-4" />
            Refresh
          </button>
        }
      />

      <DashboardPanel
        title="Pending requests"
        description="Approve with a confirmed final price, or decline the request."
        className="p-5 sm:p-6"
      >
        {pending.length ? (
          <DashboardDataTable
            columns={[
              ...requestColumns,
              {
                key: "review",
                label: "Review",
                render: (value, row) => (
                  <button
                    type="button"
                    onClick={() => openReview(row)}
                    className="inline-flex items-center gap-1 rounded-full bg-stone-900 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white"
                  >
                    Review
                  </button>
                ),
              },
            ]}
            rows={pending}
            minWidth={820}
          />
        ) : (
          <DashboardEmptyState
            title="No pending requests"
            description="New bulk-order requests from approved companies will appear here."
          />
        )}
      </DashboardPanel>

      {selected && selected.status === "Pending approval" ? (
        <DashboardPanel title="Confirm request" className="p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Company", value: selected.company },
              {
                label: "Article",
                value: selected.articleTitle || "—",
              },
              {
                label: "Copies per cycle",
                value: String(selected.copies),
              },
              {
                label: "Required by",
                value: formatNeededBy(selected.neededBy),
              },
              {
                label: "System estimate",
                value: `€${Number(selected.estimatedPrice).toFixed(2)} (€${Number(selected.rate).toFixed(2)} / copy)`,
              },
            ].map((item) => (
              <div key={item.label}>
                <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                  {item.label}
                </p>
                <p className="mt-1 font-sans text-sm font-semibold text-stone-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {selected.deliveryLocations?.length ? (
            <div className="mt-5">
              <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                Delivery locations
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selected.deliveryLocations.map((location) => (
                  <span
                    key={location}
                    className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 font-sans text-xs text-stone-700"
                  >
                    {location}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6">
            <label
              htmlFor="final-price"
              className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-700"
            >
              Confirmed final price (€)
            </label>
            <input
              id="final-price"
              type="number"
              min="0"
              step="0.01"
              value={finalPrice}
              onChange={(event) => setFinalPrice(event.target.value)}
              className="w-full max-w-xs rounded-xl border border-stone-200 bg-white px-4 py-3 font-sans text-base text-stone-900 outline-none transition-colors focus:border-[#4A2A08] focus:ring-2 focus:ring-[#4A2A08]/15"
            />
          </div>

          {message ? (
            <p className="mt-4 font-sans text-sm text-stone-700">{message}</p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => decide(true)}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              Approve request
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => decide(false)}
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-700 disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Decline request
            </button>
          </div>
        </DashboardPanel>
      ) : null}

      <DashboardPanel
        title="Confirmed and closed requests"
        className="p-5 sm:p-6"
      >
        {closed.length ? (
          <DashboardDataTable
            columns={requestColumns}
            rows={closed}
            minWidth={720}
          />
        ) : (
          <DashboardEmptyState
            title="No confirmed requests yet"
            description="Approved or declined requests will appear here."
          />
        )}
      </DashboardPanel>

      <DashboardRelatedLinks title="Related links" items={relatedLinks} />
    </div>
  );
}