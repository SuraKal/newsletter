import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CirclePlus, Save } from "lucide-react";
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
import { backendArticles, isNetworkError } from "@/api/backendClient";
import { getAdminContentRows, getPlacementLabel } from "@/lib/content-store";

const contentColumns = [
  {
    key: "image",
    label: "",
    hideOnMobile: true,
    render: (value, row) =>
      value ? (
        <img
          src={value}
          alt={row.headline}
          className="h-10 w-16 rounded-sm object-cover"
        />
      ) : (
        <span className="inline-flex h-10 w-16 items-center justify-center rounded-sm bg-stone-100 text-[0.6rem] font-semibold uppercase tracking-widest text-stone-400 dark:bg-stone-800">
          None
        </span>
      ),
  },
  {
    key: "headline",
    label: "Headline",
    primary: true,
    render: (value, row) => (
      <Link
        to={`/admin/content/${row.id}`}
        className="font-semibold text-stone-900 hover:text-heritage dark:text-stone-100"
      >
        {value}
      </Link>
    ),
  },
  {
    key: "source",
    label: "Placement",
    render: (value) => getPlacementLabel(value),
  },
  { key: "category", label: "Category" },
  {
    key: "status",
    label: "State",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
];

const matchesSearch = (row, query) =>
  [row.headline, getPlacementLabel(row.source), row.category, row.status].some(
    (value) => String(value ?? "").toLowerCase().includes(query),
  );

const contentFilterGroups = [
  { key: "category", label: "Category" },
  { key: "status", label: "State" },
];

const relatedLinks = [
  { label: "Schedule", to: "/admin/schedule" },
  { label: "Subscribers", to: "/admin/subscribers" },
  { label: "Companies", to: "/admin/companies" },
  { label: "Shipments", to: "/admin/shipments" },
  { label: "Governance", to: "/admin/governance" },
  { label: "Order requests", to: "/admin/order-requests" },
];

// Maps a backend article into the row shape `getAdminContentRows()` produces so
// the list, filters, and links behave identically for DB and mock data.
function toAdminContentRow(article) {
  return {
    id: article.id,
    headline: article.headline,
    sector: article.categoryLabel || "News",
    editor: article.editor || "Editorial desk",
    status: article.status,
    tone: article.tone,
    publishWindow:
      [article.publishDate, article.publishTime].filter(Boolean).join(" · ") ||
      "Awaiting editor sign-off",
    image: article.image || null,
    category: article.categoryLabel || "News",
    source: article.source || "admin",
    clicks: Number(article.clicks) || 0,
  };
}

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

function extractYoutubeId(value) {
  const text = String(value || "").trim();
  if (!text) {
    return null;
  }
  const watchMatch = text.match(
    /(?:youtube\.com\/(?:watch\?(?:[^"'\s]*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  if (watchMatch) {
    return watchMatch[1];
  }
  const iframeMatch = text.match(/iframe[^>]*\bsrc=["']([^"']+)["']/i);
  if (iframeMatch) {
    return extractYoutubeId(iframeMatch[1]);
  }
  return YOUTUBE_ID_PATTERN.test(text) ? text : null;
}

function AdminGuideVideoPanel() {
  const [raw, setRaw] = useState("");
  const [videoId, setVideoId] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    appClient.siteSettings
      .getUserGuideVideo()
      .then((video) => {
        if (!active) return;
        setRaw(video?.raw || "");
        setLoaded(true);
      })
      .catch(() => {
        if (!active) return;
        setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const detected = extractYoutubeId(raw);

  const handleSave = async () => {
    if (!detected) {
      setMessage("No YouTube video detected in that link or embed.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const video = await appClient.siteSettings.updateUserGuideVideo(raw.trim());
      if (video?.embedSrc) {
        setVideoId(video.videoId);
        setMessage("Guide video updated for the public website.");
      } else {
        setMessage("Saved, but the backend could not confirm the video.");
      }
    } catch (error) {
      setMessage(error?.message || "Could not save the guide video.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardPanel
      title="User guide video"
      description="Paste a YouTube share link or the full embed code. The home-page guide section plays the detected video."
      className="p-5 sm:p-6"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          <label
            htmlFor="guide-video-raw"
            className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400"
          >
            YouTube link or embed code
          </label>
          <textarea
            id="guide-video-raw"
            value={raw}
            disabled={!loaded}
            onChange={(event) => setRaw(event.target.value)}
            rows={4}
            placeholder="https://www.youtube.com/watch?v=Dscc0ILZwfo or paste an <iframe ...></iframe> snippet"
            className="mt-2 w-full resize-y rounded-lg border border-stone-300 bg-white px-3 py-2.5 font-sans text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-heritage/40 disabled:opacity-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          />
          {detected ? (
            <p className="mt-2 font-sans text-xs text-emerald-700 dark:text-emerald-400">
              Video detected: {detected}
            </p>
          ) : raw.trim() ? (
            <p className="mt-2 font-sans text-xs text-amber-700 dark:text-amber-400">
              No YouTube video detected yet — paste a watch link or embed code.
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !loaded || !detected}
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Save guide video"}
            </button>
            {message ? (
              <span className="font-sans text-xs text-stone-600 dark:text-stone-300">
                {message}
              </span>
            ) : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-stone-200 bg-ink dark:border-stone-700">
          {detected ? (
            <iframe
              src={`https://www.youtube.com/embed/${detected}`}
              title="User guide video preview"
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="User guide video preview"
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center bg-stone-900 px-4 text-center font-sans text-xs uppercase tracking-[0.18em] text-stone-400 dark:bg-stone-800">
              Preview appears here
            </div>
          )}
        </div>
      </div>
    </DashboardPanel>
  );
}

export default function AdminContentList() {
  const [adminContentRows, setAdminContentRows] = useState(() =>
    getAdminContentRows(),
  );
  const [query, setQuery] = useState("");
  const { activeFilters, setFilter, clearFilters } = useTableFilters();

  useEffect(() => {
    let active = true;
    backendArticles
      .adminList()
      .then((list) => {
        if (!active) return;
        setAdminContentRows(
          Array.isArray(list) && list.length ? list.map(toAdminContentRow) : [],
        );
      })
      .catch((error) => {
        if (!active) return;
        if (isNetworkError(error)) {
          setAdminContentRows(getAdminContentRows());
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const table = useTableQuery({
    rows: adminContentRows,
    query,
    predicate: matchesSearch,
    activeFilters,
    filterGroups: contentFilterGroups,
  });

  const draftCount = adminContentRows.filter(
    (row) => row.status === "Draft",
  ).length;
  const scheduledCount = adminContentRows.filter(
    (row) => row.status === "Scheduled",
  ).length;
  const publishedCount = adminContentRows.filter(
    (row) => row.status === "Published",
  ).length;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin content"
        title="Publishing queue"
        description="Review drafts, scheduled items, and live pieces. Placement mirrors exactly where each story appears on the public site."
        breadcrumbs={[
          { label: "Admin workspace", to: "/admin/overview" },
          { label: "Content" },
        ]}
        action={
          <Link
            to="/admin/content/new"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            New article
            <CirclePlus className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search headline, placement, or category"
        searchValue={query}
        onSearchChange={setQuery}
        resultCount={query.trim() || table.hasActiveFilters ? table.total : null}
        filterGroups={contentFilterGroups}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        filterOptions={table.filterOptions}
        filters={[
          `${draftCount} drafts`,
          `${scheduledCount} scheduled`,
          `${publishedCount} published`,
        ]}
        action={
          <Link
            to="/admin/schedule"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Open schedule
            <CalendarDays className="h-4 w-4" />
          </Link>
        }
      />

      <AdminGuideVideoPanel />

      <DashboardPanel title="Article queue" className="p-5 sm:p-6">
        {table.total ? (
          <>
            <DashboardDataTable
              columns={contentColumns}
              rows={table.rows}
              minWidth={620}
            />
            <DashboardPagination
              page={table.page}
              pageCount={table.pageCount}
              total={table.total}
              pageSize={table.pageSize}
              onPageChange={table.setPage}
            />
          </>
        ) : (
          <DashboardEmptyState
            title="No matching articles"
            description="Try clearing the category or state filters to see the full publishing queue."
          />
        )}
      </DashboardPanel>

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}