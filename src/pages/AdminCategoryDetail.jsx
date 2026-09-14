import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import {
  DashboardChartPanel,
  DashboardDataTable,
  DashboardEmptyState,
  DashboardFilterBar,
  DashboardFactList,
  DashboardNavBadge,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPagination,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { useTableFilters, useTableQuery } from "@/lib/useTableQuery";
import { getCategoryById } from "@/lib/category-store";
import { useStoreVersion } from "@/lib/store-bus";
import { getAdminContentRows, getPlacementLabel } from "@/lib/content-store";

const relatedLinks = [
  { label: "All categories", to: "/admin/categories" },
  { label: "Content", to: "/admin/content" },
  { label: "Schedule", to: "/admin/schedule" },
  { label: "Governance", to: "/admin/governance" },
  { label: "Pricing", to: "/admin/pricing" },
];

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const matchesSearch = (row, query) =>
  [row.headline, row.placement, row.status, row.publishWindow].some(
    (value) => String(value ?? "").toLowerCase().includes(query),
  );

function CategoryNotFound() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin categories"
        title="Category not found"
        breadcrumbs={[
          { label: "Admin workspace", to: "/admin/overview" },
          { label: "Categories", to: "/admin/categories" },
        ]}
        action={
          <Link
            to="/admin/categories"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to categories
          </Link>
        }
      />
      <DashboardPanel title="Category detail">
        <DashboardEmptyState title="No category record matches this ID." />
      </DashboardPanel>
      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}

export default function AdminCategoryDetail() {
  useStoreVersion();
  const { categoryId } = useParams();
  const [query, setQuery] = useState("");
  const { activeFilters, setFilter, clearFilters } = useTableFilters();

  const category = getCategoryById(categoryId);

  const attachedArticles = getAdminContentRows().filter(
    (row) =>
      category &&
      (row.category || "").toLowerCase() === category.label.toLowerCase(),
  );

  const publishedCount = attachedArticles.filter(
    (row) => row.status === "Published",
  ).length;
  const scheduledCount = attachedArticles.filter(
    (row) => row.status === "Scheduled",
  ).length;
  const draftCount = attachedArticles.filter(
    (row) => row.status === "Draft",
  ).length;

  const totalClicks = attachedArticles.reduce(
    (sum, row) => sum + (row.clicks || 0),
    0,
  );
  const avgClicks =
    attachedArticles.length > 0
      ? Math.round(totalClicks / attachedArticles.length)
      : 0;
  const topArticle = attachedArticles.reduce(
    (best, row) => ((row.clicks || 0) > (best?.clicks || 0) ? row : best),
    null,
  );

  const detailsFacts = category
    ? [
        { label: "Category label", value: category.label },
        { label: "Total articles", value: String(attachedArticles.length) },
        {
          label: "Cover image",
          value: category.image.startsWith("http")
            ? "External URL"
            : "Uploaded image",
        },
        ...(topArticle
          ? [
              {
                label: "Most clicked",
                value: (
                  <Link
                    to={`/admin/content/${topArticle.id}`}
                    className="block max-w-full truncate text-heritage underline-offset-2 hover:underline"
                  >
                    {topArticle.headline}
                  </Link>
                ),
              },
              {
                label: "Top clicks",
                value: (
                  <span className="tabular-nums">
                    {(topArticle.clicks || 0).toLocaleString()}
                  </span>
                ),
              },
            ]
          : []),
      ]
    : [];

  const chartData = [...attachedArticles]
    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, 6)
    .map((row, index) => ({
      label: row.headline.length > 20 ? `${row.headline.slice(0, 20)}…` : row.headline,
      value: row.clicks || 0,
      tone: index === 0 ? "accent" : undefined,
    }));

  const table = useTableQuery({
    rows: attachedArticles.map((row) => ({
      ...row,
      placement: getPlacementLabel(row.source),
    })),
    query,
    predicate: matchesSearch,
    activeFilters,
    filterGroups: [],
  });

  if (!category) {
    return <CategoryNotFound />;
  }

  const columns = [
    {
      key: "headline",
      label: "Article",
      primary: true,
      render: (value, row) => (
        <Link
          to={`/admin/content/${row.id}`}
          className="font-semibold text-stone-900 transition-colors hover:text-heritage dark:text-stone-100"
        >
          {value}
        </Link>
      ),
    },
    {
      key: "placement",
      label: "Placement",
      hideOnMobile: true,
    },
    {
      key: "status",
      label: "State",
      render: (value, row) => (
        <DashboardStatusBadge label={value} tone={row.tone} />
      ),
    },
    {
      key: "publishWindow",
      label: "Published",
      hideOnMobile: true,
    },
    {
      key: "clicks",
      label: "Clicks",
      hideOnMobile: true,
      render: (value) => {
        const maxClicks = Math.max(
          ...attachedArticles.map((r) => r.clicks || 0),
          1,
        );
        const pct = Math.max(Math.round(((value || 0) / maxClicks) * 100), 0);
        return (
          <div className="min-w-[80px]">
            <p className="font-sans text-sm font-bold tabular-nums text-stone-900 dark:text-stone-100">
              {(value || 0).toLocaleString()}
            </p>
            <div className="mt-1 h-1.5 w-full max-w-[100px] overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
              <div
                className="h-full rounded-full bg-heritage/80 transition-[width]"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin categories"
        title={category.label}
        description="Articles, analytics, and details for this category."
        breadcrumbs={[
          { label: "Admin workspace", to: "/admin/overview" },
          { label: "Categories", to: "/admin/categories" },
          { label: category.label },
        ]}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/categories"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to categories
            </Link>
            <Link
              to={`/categories?cat=${slugify(category.label)}`}
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
            >
              View on site
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="dashboard-panel p-5">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            Total articles
          </p>
          <p className="mt-2 font-display text-3xl font-black text-stone-900 dark:text-stone-100">
            {attachedArticles.length}
          </p>
          <p className="mt-1 font-sans text-xs text-stone-500">
            In this category
          </p>
        </div>
        <div className="dashboard-panel p-5">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            Total clicks
          </p>
          <p className="mt-2 font-display text-3xl font-black text-stone-900 dark:text-stone-100">
            {totalClicks.toLocaleString()}
          </p>
          <p className="mt-1 font-sans text-xs text-stone-500">
            Sum across all articles
          </p>
        </div>
        <div className="dashboard-panel p-5">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            Avg clicks/article
          </p>
          <p className="mt-2 font-display text-3xl font-black text-stone-900 dark:text-stone-100">
            {avgClicks.toLocaleString()}
          </p>
          <p className="mt-1 font-sans text-xs text-stone-500">
            Average engagement
          </p>
        </div>
        <div className="dashboard-panel p-5">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            Live now
          </p>
          <p className="mt-2 font-display text-3xl font-black text-stone-900 dark:text-stone-100">
            {publishedCount}
          </p>
          <p className="mt-1 font-sans text-xs text-stone-500">
            Published articles
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardChartPanel
            title="Click analytics"
            description="Top articles in this category by click count."
            data={chartData.length ? chartData : [{ label: "No data", value: 1, tone: "neutral" }]}
          />
        </div>
        <div className="space-y-6">
          <DashboardPanel
            title="Category details"
            description="Key facts and figures for this category."
            className="h-full min-w-0 overflow-hidden p-5 sm:p-6"
          >
            <div className="mb-5 flex items-center gap-3">
              <img
                src={category.image}
                alt={category.label}
                className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-stone-200 dark:ring-stone-700"
              />
              <div>
                <p className="font-sans text-sm font-semibold text-stone-900 dark:text-stone-100">
                  {category.label}
                </p>
                <p className="mt-0.5 font-sans text-xs text-stone-500">
                  {category.subcategories.length} subcategories
                </p>
              </div>
            </div>
            <DashboardFactList items={detailsFacts} />
            {category.subcategories.length ? (
              <div className="mt-5">
                <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  Subcategories
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {category.subcategories.map((sub) => (
                    <span
                      key={sub}
                      className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 font-sans text-[0.66rem] font-medium text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </DashboardPanel>
        </div>
      </div>

      <DashboardPanel
        title="Attached articles"
        description={`All articles tagged "${category.label}". Click a headline to edit.`}
        className="p-5 sm:p-6"
      >
        <DashboardFilterBar
          searchPlaceholder="Search article headline, placement, or status"
          searchValue={query}
          onSearchChange={setQuery}
          resultCount={query.trim() ? table.total : null}
          filterGroups={[]}
          activeFilters={activeFilters}
          onFilterChange={setFilter}
          onClearFilters={clearFilters}
          filterOptions={table.filterOptions}
        />

        {table.rows.length ? (
          <DashboardDataTable columns={columns} rows={table.rows} minWidth={780} />
        ) : (
          <DashboardEmptyState
            title={
              attachedArticles.length
                ? "No matching articles"
                : "No articles in this category"
            }
            description={
              attachedArticles.length
                ? "Try clearing your search to see the full list."
                : "Publish or schedule articles with this category label to see them here."
            }
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

      <div className="flex items-center gap-2 font-sans text-xs text-stone-500">
        <DashboardNavBadge count={attachedArticles.length} />
        <span>
          {totalClicks.toLocaleString()} total clicks across {attachedArticles.length} article{attachedArticles.length === 1 ? "" : "s"}.
        </span>
      </div>

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}