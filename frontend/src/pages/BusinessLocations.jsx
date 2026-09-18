import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Truck, Plus } from "lucide-react";
import {
  DashboardDataTable,
  DashboardEmptyState,
  DashboardFilterBar,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPagination,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { useTableFilters, useTableQuery } from "@/lib/useTableQuery";
import { appClient } from "@/api/appClient";

const locationColumns = [
  {
    key: "location",
    label: "Site",
    primary: true,
    render: (value, row) => (
      <Link
        to={`/business-dashboard/locations/${row.id}`}
        className="font-medium text-stone-900 transition-colors hover:text-heritage dark:text-stone-100"
      >
        {value}
      </Link>
    ),
  },
  { key: "region", label: "Region" },
  { key: "copies", label: "Copies / cycle" },
  { key: "contact", label: "Receiving contact" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
];

const matchesSearch = (row, query) =>
  [row.location, row.region, row.copies, row.contact, row.status].some(
    (value) => String(value ?? "").toLowerCase().includes(query),
  );

const locationFilterGroups = [
  { key: "region", label: "Region" },
  { key: "status", label: "Status" },
];

const relatedLinks = [
  { label: "Team", to: "/business-dashboard/team" },
  { label: "Orders", to: "/business-dashboard/orders" },
  { label: "Invoices", to: "/business-dashboard/invoices" },
  { label: "Shipments", to: "/business-dashboard/shipments" },
  { label: "Settings", to: "/business-dashboard/settings" },
];

export default function BusinessLocations() {
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState(() => appClient.locations.list());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    location: "",
    region: "",
    contact: "",
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const { activeFilters, setFilter, clearFilters } = useTableFilters();

  const reloadLocations = async () => {
    const rows = await appClient.locations.refresh();
    if (Array.isArray(rows)) setLocations(rows);
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    setCreating(true);
    setCreateError("");
    try {
      await appClient.locations.create(createForm);
      setShowCreateModal(false);
      setCreateForm({ location: "", region: "", contact: "" });
      await reloadLocations();
    } catch (error) {
      setCreateError(error?.message || "Failed to create location");
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    reloadLocations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const table = useTableQuery({
    rows: locations,
    query,
    predicate: matchesSearch,
    activeFilters,
    filterGroups: locationFilterGroups,
  });

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business locations"
        title="Delivery destinations"
        description="Review receiving sites and their readiness status."
        breadcrumbs={[
          { label: "Business workspace", to: "/business-dashboard/overview" },
          { label: "Locations" },
        ]}
        action={
          <>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
            >
              <Plus className="h-4 w-4" />
              Add location
            </button>
            <Link
              to="/business-dashboard/shipments"
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
            >
              Open shipments
              <Truck className="h-4 w-4" />
            </Link>
          </>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search site, city, or receiving contact"
        searchValue={query}
        onSearchChange={setQuery}
        resultCount={query.trim() || table.hasActiveFilters ? table.total : null}
        filterGroups={locationFilterGroups}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        filterOptions={table.filterOptions}
        filters={["9 active locations", "Belgium + Germany", "1 review state"]}
        action={
          <Link
            to="/business-dashboard/team"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Receiving owners
            <Building2 className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardPanel title="Location status" className="p-5 sm:p-6">
        {table.total ? (
          <DashboardDataTable
            columns={locationColumns}
            rows={table.rows}
            minWidth={760}
          />
        ) : (
          <DashboardEmptyState
            title="No matching locations"
            description="Try clearing the region or status filters to see the full destination list."
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

      <DashboardRelatedLinks
        title="Related links"
        items={[{ label: "View coverage map", to: "/delivery" }, ...relatedLinks]}
      />

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-stone-900">
            <h2 className="mb-4 font-sans text-lg font-semibold text-stone-900 dark:text-stone-100">
              Add delivery location
            </h2>
            <form onSubmit={handleCreateSubmit} className="grid gap-4">
              <div>
                <label
                  htmlFor="create-location"
                  className="mb-1 block font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-700 dark:text-stone-300"
                >
                  Location name *
                </label>
                <input
                  id="create-location"
                  type="text"
                  value={createForm.location}
                  onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                  placeholder="e.g. Brussels HQ"
                  required
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 font-sans text-base text-stone-900 outline-none transition-colors focus:border-[#4A2A08] focus:ring-2 focus:ring-[#4A2A08]/15 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                />
              </div>
              <div>
                <label
                  htmlFor="create-region"
                  className="mb-1 block font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-700 dark:text-stone-300"
                >
                  Region
                </label>
                <input
                  id="create-region"
                  type="text"
                  value={createForm.region}
                  onChange={(e) => setCreateForm({ ...createForm, region: e.target.value })}
                  placeholder="e.g. Belgium"
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 font-sans text-base text-stone-900 outline-none transition-colors focus:border-[#4A2A08] focus:ring-2 focus:ring-[#4A2A08]/15 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                />
              </div>
              <div>
                <label
                  htmlFor="create-contact"
                  className="mb-1 block font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-700 dark:text-stone-300"
                >
                  Receiving contact
                </label>
                <input
                  id="create-contact"
                  type="text"
                  value={createForm.contact}
                  onChange={(e) => setCreateForm({ ...createForm, contact: e.target.value })}
                  placeholder="e.g. John Doe, +32 470 123 456"
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 font-sans text-base text-stone-900 outline-none transition-colors focus:border-[#4A2A08] focus:ring-2 focus:ring-[#4A2A08]/15 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                />
              </div>
              {createError ? (
                <p className="font-sans text-sm text-red-700">{createError}</p>
              ) : null}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
onClick={() => {
                    setShowCreateModal(false);
                    setCreateForm({ location: "", region: "", contact: "" });
                    setCreateError("");
                  }}
                  disabled={creating}
                  className="flex-1 rounded-full border border-stone-300 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50 disabled:opacity-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !createForm.location}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-100 dark:text-stone-900"
                >
                  {creating ? "Creating..." : "Add location"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}