import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Plus, RotateCcw, Tag, Trash2, Upload, X } from "lucide-react";
import {
  DashboardDataTable,
  DashboardEmptyState,
  DashboardFilterBar,
  DashboardNavBadge,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPagination,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { useTableFilters, useTableQuery } from "@/lib/useTableQuery";
import { IMAGES } from "@/lib/constants";
import { backendCategories, isNetworkError } from "@/api/backendClient";
import {
  deleteCategory,
  getCategories,
  getCategoryArticleCounts,
  moveCategory,
  resetCategoryStore,
  saveCategory,
  syncCategoriesFromBackend,
} from "@/lib/category-store";
import { useStoreVersion } from "@/lib/store-bus";
import { getAdminContentRows } from "@/lib/content-store";
import {
  ARTICLE_TEMPLATES,
  DEFAULT_ARTICLE_TEMPLATE,
  getTemplateLabel,
} from "@/lib/article-templates";

const matchesSearch = (row, query) =>
  [
    row.label,
    row.image,
    row.template,
    row.subcategories.join(", "),
  ].some((value) =>
    String(value ?? "").toLowerCase().includes(query),
  );

const relatedLinks = [
  { label: "Content", to: "/admin/content" },
  { label: "Schedule", to: "/admin/schedule" },
  { label: "Subscribers", to: "/admin/subscribers" },
  { label: "Governance", to: "/admin/governance" },
  { label: "Order requests", to: "/admin/order-requests" },
];

function CategoryThumb({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500">
        <Tag className="h-5 w-5" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-stone-200 dark:ring-stone-700"
    />
  );
}

const emptyForm = {
  label: "",
  image: "",
  subcategories: [],
  template: DEFAULT_ARTICLE_TEMPLATE,
};

const MAX_COVER_DIMENSION = 640;

function toAdminCategory(cat) {
  return {
    id: cat.id,
    label: cat.label,
    image: cat.image,
    subcategories: Array.isArray(cat.subcategories)
      ? cat.subcategories.map((sub) =>
          typeof sub === "string"
            ? { id: null, label: sub }
            : { id: sub.id || null, label: sub.label },
        )
      : [],
    template: cat.templateKey || cat.template || DEFAULT_ARTICLE_TEMPLATE,
    sortOrder: cat.sortOrder ?? null,
  };
}

export default function AdminCategories() {
  useStoreVersion();
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [draftSubcategory, setDraftSubcategory] = useState("");
  const { activeFilters, setFilter, clearFilters } = useTableFilters();
  const [categories, setCategories] = useState([]);

  const loadCategories = () => {
    backendCategories
      .list()
      .then((list) => {
        if (Array.isArray(list) && list.length) {
          syncCategoriesFromBackend(list);
          setCategories(list.map(toAdminCategory));
        } else {
          setCategories([]);
        }
      })
      .catch(() => {
        setCategories(getCategories().map(toAdminCategory));
      });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const articleCounts = getCategoryArticleCounts();
  const contentRows = getAdminContentRows();
  const categoryClicksMap = {};
  contentRows.forEach((row) => {
    const key = row.category || "Other";
    categoryClicksMap[key] = (categoryClicksMap[key] || 0) + row.clicks;
  });

  const rows = categories.map((cat, index) => ({
    id: cat.id,
    label: cat.label,
    image: cat.image,
    subcategories: cat.subcategories.map((sub) => sub.label),
    template: cat.template,
    articleCount: articleCounts[cat.label] || 0,
    totalClicks: categoryClicksMap[cat.label] || 0,
    index,
    isFirst: index === 0,
    isLast: index === categories.length - 1,
    cat,
  }));

  const table = useTableQuery({
    rows,
    query,
    predicate: matchesSearch,
    activeFilters,
    filterGroups: [],
  });

  const publishingCount = rows.reduce(
    (sum, cat) => sum + cat.articleCount,
    0,
  );

  const totalAllClicks = rows.reduce(
    (sum, cat) => sum + cat.totalClicks,
    0,
  );

  const usedCategories = rows.filter((cat) => cat.articleCount > 0).length;

  const handleMove = async (id, direction) => {
    const index = categories.findIndex((cat) => cat.id === id);
    if (index < 0) return;
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= categories.length) return;
    const currentOrder = categories[index].sortOrder ?? index;
    const targetOrder = categories[target].sortOrder ?? target;
    try {
      await backendCategories.adminReorder(id, targetOrder);
      await backendCategories.adminReorder(categories[target].id, currentOrder);
      loadCategories();
    } catch (err) {
      if (isNetworkError(err)) {
        moveCategory(id, direction);
        loadCategories();
      }
    }
  };

  const handleImageUpload = (event) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        try {
          const scale = Math.min(
            1,
            MAX_COVER_DIMENSION / Math.max(img.width, img.height),
          );
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setForm((prev) => ({
            ...prev,
            image: canvas.toDataURL("image/jpeg", 0.82),
          }));
        } catch {
          setForm((prev) => ({
            ...prev,
            image: typeof reader.result === "string" ? reader.result : "",
          }));
        }
        input.value = "";
      };
      if (typeof reader.result !== "string") return;
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setForm({
      label: cat.label,
      image: cat.image,
      subcategories: cat.subcategories,
      template: cat.template || DEFAULT_ARTICLE_TEMPLATE,
    });
    setFormError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  };

  const addSubcategory = () => {
    const value = draftSubcategory.trim();
    if (!value) return;
    if (
      form.subcategories.some(
        (sub) => sub.label.toLowerCase() === value.toLowerCase(),
      )
    ) {
      setDraftSubcategory("");
      return;
    }
    setForm((prev) => ({
      ...prev,
      subcategories: [...prev.subcategories, { id: null, label: value }],
    }));
    setDraftSubcategory("");
  };

  const removeSubcategory = (index) => {
    setForm((prev) => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    const label = form.label.trim();
    if (!label) {
      setFormError("Enter a category label before saving.");
      return;
    }
    const existing = categories.find((cat) => cat.id === editingId);
    const subcategories = form.subcategories
      .map((sub) => ({ ...sub, label: sub.label.trim() }))
      .filter((sub) => sub.label);
    const deduped = [
      ...new Map(subcategories.map((sub) => [sub.label.toLowerCase(), sub])).values(),
    ];
    const payload = {
      label,
      image: form.image.trim() || existing?.image || IMAGES.hero,
      templateKey: form.template || DEFAULT_ARTICLE_TEMPLATE,
      subcategories: deduped.map((sub) => ({
        id: sub.id || undefined,
        label: sub.label,
      })),
    };
    const noticeText = editingId ? `Updated "${label}".` : `Added "${label}".`;
    try {
      if (editingId) {
        await backendCategories.adminUpdate(editingId, payload);
      } else {
        await backendCategories.adminCreate(payload);
      }
      setNotice(noticeText);
      cancelEdit();
      loadCategories();
    } catch (err) {
      if (isNetworkError(err)) {
        saveCategory({
          id: editingId || undefined,
          label,
          image: payload.image,
          subcategories: deduped.map((sub) => sub.label),
          template: payload.templateKey,
        });
        setNotice(noticeText);
        cancelEdit();
        loadCategories();
      } else {
        setFormError(err.message || "Failed to save the category.");
      }
    }
  };

  const handleDelete = async (cat) => {
    if (pendingDelete === cat.id) {
      try {
        await backendCategories.adminDelete(cat.id);
        setNotice(`Deleted "${cat.label}".`);
        setPendingDelete(null);
        loadCategories();
      } catch (err) {
        if (isNetworkError(err)) {
          deleteCategory(cat.id);
          setNotice(`Deleted "${cat.label}".`);
          setPendingDelete(null);
          loadCategories();
        }
      }
      return;
    }
    setPendingDelete(cat.id);
    window.setTimeout(() => setPendingDelete(null), 3000);
  };

  const handleReset = () => {
    resetCategoryStore();
    setNotice("Categories restored to the default list.");
    cancelEdit();
    loadCategories();
  };

  const columns = [
    {
      key: "label",
      label: "Category",
      primary: true,
      render: (value, row) => (
        <Link
          to={`/admin/categories/${row.id}`}
          className="group flex items-center gap-3"
        >
          <CategoryThumb src={row.image} alt={value} />
          <div className="min-w-0">
            <p className="font-sans text-sm font-semibold text-stone-900 transition-colors group-hover:text-heritage dark:text-stone-100">
              {value}
            </p>
            <p className="mt-0.5 max-w-[260px] truncate font-sans text-xs text-stone-500">
              {row.subcategories.length
                ? `${row.subcategories.length} subcategories`
                : "No subcategories"}
            </p>
          </div>
        </Link>
      ),
    },
    {
      key: "subcategories",
      label: "Subcategories",
      hideOnMobile: true,
      render: (value) => {
        if (!value.length) {
          return <span className="font-sans text-xs text-stone-400">None</span>;
        }
        const chips = value.slice(0, 3);
        const extra = value.length - chips.length;
        return (
          <div className="flex max-w-xs flex-wrap gap-1">
            {chips.map((sub) => (
              <span
                key={sub}
                className="rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 font-sans text-[0.66rem] font-medium text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
              >
                {sub}
              </span>
            ))}
            {extra > 0 ? (
              <span className="rounded-full bg-stone-100 px-2 py-0.5 font-sans text-[0.66rem] font-semibold text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                +{extra}
              </span>
            ) : null}
          </div>
        );
      },
    },
    {
      key: "template",
      label: "Template",
      hideOnMobile: true,
      render: (value) => (
        <Link
          to={`/templates?layout=${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 font-sans text-[0.66rem] font-semibold text-stone-700 transition-colors hover:border-heritage hover:text-heritage dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:border-heritage dark:hover:text-heritage"
        >
          {getTemplateLabel(value)}
          <ExternalLink className="h-3 w-3" />
        </Link>
      ),
    },
    {
      key: "articleCount",
      label: "Articles",
      render: (value) => (
        <DashboardStatusBadge
          label={String(value)}
          tone={value > 0 ? "success" : "neutral"}
        />
      ),
    },
    {
      key: "totalClicks",
      label: "Clicks",
      hideOnMobile: true,
      render: (value, row) => {
        const maxClicks = Math.max(...rows.map((r) => r.totalClicks), 1);
        const pct = Math.max(Math.round((value / maxClicks) * 100), 0);
        return (
          <div className="min-w-[100px]">
            <p className="font-sans text-sm font-bold tabular-nums text-stone-900 dark:text-stone-100">
              {value.toLocaleString()}
            </p>
            <div className="mt-1 h-1.5 w-full max-w-[120px] overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
              <div
                className="h-full rounded-full bg-heritage/80 transition-[width]"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "order",
      label: "Flow",
      hideOnMobile: true,
      render: (value, row) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={row.isFirst}
            onClick={() => handleMove(row.id, "up")}
            aria-label={`Move ${row.label} earlier`}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-stone-500 transition-colors enabled:hover:bg-stone-100 enabled:hover:text-stone-900 disabled:opacity-30 dark:text-stone-400 dark:enabled:hover:bg-stone-800 dark:enabled:hover:text-stone-100"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            disabled={row.isLast}
            onClick={() => handleMove(row.id, "down")}
            aria-label={`Move ${row.label} later`}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-stone-500 transition-colors enabled:hover:bg-stone-100 enabled:hover:text-stone-900 disabled:opacity-30 dark:text-stone-400 dark:enabled:hover:bg-stone-800 dark:enabled:hover:text-stone-100"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (value, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => startEdit(row.cat)}
            aria-label={`Edit ${row.label}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-600 transition-colors hover:border-stone-300 hover:text-stone-900 dark:border-stone-700 dark:text-stone-300 dark:hover:text-white"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row.cat)}
            aria-label={`Delete ${row.label}`}
            className={`inline-flex items-center justify-center rounded-full border px-2.5 text-xs font-semibold transition-colors ${
              pendingDelete === row.id
                ? "border-red-600 bg-red-600 text-white"
                : "border-stone-200 text-red-500 hover:border-red-200 hover:bg-red-50 dark:border-stone-700 dark:text-red-400 dark:hover:bg-red-900/20"
            }`}
          >
            {pendingDelete === row.id ? "Sure?" : <Trash2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin content"
        title="Category manager"
        description="Customize the categories that appear on the public /categories page, the home page section, the site navigation, and the article publishing form."
        breadcrumbs={[
          { label: "Admin workspace", to: "/admin/overview" },
          { label: "Categories" },
        ]}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to defaults
            </button>
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
            >
              View on site
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        }
      />

      {notice ? (
        <div
          role="status"
          className="flex items-center justify-between gap-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 font-sans text-xs font-semibold text-emerald-700"
        >
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-emerald-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="dashboard-panel p-5">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            Active categories
          </p>
          <p className="mt-2 font-display text-3xl font-black text-stone-900 dark:text-stone-100">
            {categories.length}
          </p>
          <p className="mt-1 font-sans text-xs text-stone-500">
            Shown across the public site
          </p>
        </div>
        <div className="dashboard-panel p-5">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            Categories in use
          </p>
          <p className="mt-2 font-display text-3xl font-black text-stone-900 dark:text-stone-100">
            {usedCategories}
          </p>
          <p className="mt-1 font-sans text-xs text-stone-500">
            With at least one article
          </p>
        </div>
        <div className="dashboard-panel p-5">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            Tagged articles
          </p>
          <p className="mt-2 font-display text-3xl font-black text-stone-900 dark:text-stone-100">
            {publishingCount}
          </p>
          <p className="mt-1 font-sans text-xs text-stone-500">
            Using a category label
          </p>
        </div>
        <div className="dashboard-panel p-5">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            Total clicks
          </p>
          <p className="mt-2 font-display text-3xl font-black text-stone-900 dark:text-stone-100">
            {totalAllClicks.toLocaleString()}
          </p>
          <p className="mt-1 font-sans text-xs text-stone-500">
            Across all categories
          </p>
        </div>
      </div>

      <DashboardPanel
        title={editingId ? "Edit category" : "New category"}
        description={
          editingId
            ? "Update the label, cover image, subcategories, or article template for this category."
            : "Add a category that immediately appears across the public site and the publishing form."
        }
        className="p-5 sm:p-6"
      >
        {formError ? (
          <div
            role="alert"
            className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 font-sans text-xs font-semibold text-red-700"
          >
            {formError}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block font-sans text-xs font-semibold uppercase tracking-wide text-stone-600 dark:text-stone-300">
              Category label
            </span>
            <input
              type="text"
              value={form.label}
              onChange={(event) => {
                setForm((prev) => ({ ...prev, label: event.target.value }));
                setFormError("");
              }}
              placeholder="e.g. Sports"
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 font-sans text-sm text-stone-900 outline-none transition-colors focus:border-heritage focus:ring-2 focus:ring-heritage/20 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
            />
          </label>

          <div>
            <span className="mb-1.5 block font-sans text-xs font-semibold uppercase tracking-wide text-stone-600 dark:text-stone-300">
              Cover image
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.image}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, image: event.target.value }))
                }
                placeholder="Paste an image URL or upload a file"
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 font-sans text-sm text-stone-900 outline-none transition-colors focus:border-heritage focus:ring-2 focus:ring-heritage/20 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
              />
              <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-2 font-sans text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800">
                <Upload className="h-3.5 w-3.5" />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <CategoryThumb src={form.image} alt="Category preview" />
          <span className="font-sans text-xs text-stone-500">
            Used for the category tile on the public /categories page.
          </span>
        </div>

        <div className="mt-5">
          <span className="mb-1.5 block font-sans text-xs font-semibold uppercase tracking-wide text-stone-600 dark:text-stone-300">
            Subcategories
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              value={draftSubcategory}
              onChange={(event) => setDraftSubcategory(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addSubcategory();
                }
              }}
              placeholder="Type a subcategory and press Enter"
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 font-sans text-sm text-stone-900 outline-none transition-colors focus:border-heritage focus:ring-2 focus:ring-heritage/20 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
            />
            <button
              type="button"
              onClick={addSubcategory}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-stone-300 px-3.5 font-sans text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
          {form.subcategories.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {form.subcategories.map((sub, index) => (
                <span
                  key={`${sub.id || sub.label}-${index}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 font-sans text-xs font-medium text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
                >
                  {sub.label}
                  <button
                    type="button"
                    onClick={() => removeSubcategory(index)}
                    aria-label={`Remove ${sub.label}`}
                    className="inline-flex h-4 w-4 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-200 hover:text-stone-700 dark:hover:bg-stone-700 dark:hover:text-stone-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-3 font-sans text-xs text-stone-400">
              No subcategories yet. Subcategories appear as filters on the category page.
            </p>
          )}
        </div>

        <div className="mt-5">
          <span className="mb-1.5 block font-sans text-xs font-semibold uppercase tracking-wide text-stone-600 dark:text-stone-300">
            Article template
          </span>
          <div className="flex flex-wrap gap-2">
            {ARTICLE_TEMPLATES.map((template) => {
              const active = form.template === template.key;
              return (
                <span key={template.key} className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, template: template.key }))
                    }
                    className={`rounded-full border px-3.5 py-1.5 font-sans text-xs font-semibold transition-colors ${
                      active
                        ? "border-heritage bg-heritage text-white"
                        : "border-stone-300 bg-white text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800"
                    }`}
                  >
                    {template.label}
                  </button>
                  <Link
                    to={`/templates?layout=${template.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Preview ${template.label} layout`}
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                      active
                        ? "text-white/80 hover:text-white"
                        : "text-stone-400 hover:text-heritage dark:text-stone-500 dark:hover:text-heritage"
                    }`}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </span>
              );
            })}
          </div>
          <p className="mt-2 font-sans text-xs text-stone-500">
            Every article tagged under this category renders with this template
            on the public site.
          </p>
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-stone-100 pt-4 dark:border-stone-800">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-heritage"
          >
            {editingId ? "Save changes" : "Add category"}
            {editingId ? <Pencil className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-full border border-stone-300 px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-600 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </DashboardPanel>

      <DashboardPanel
        title="Existing categories"
        description="Drag order is set with the arrow buttons. Deleting a category removes it from the site; its articles keep their label until re-tagged."
        className="p-5 sm:p-6"
      >
        <DashboardFilterBar
          searchPlaceholder="Search categories"
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
          <DashboardDataTable columns={columns} rows={table.rows} minWidth={720} />
        ) : (
          <DashboardEmptyState
            title={categories.length ? "No matching categories" : "No categories yet"}
            description={
              categories.length
                ? "Try clearing your search to see the full category list."
                : "Use the form above to add your first category."
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
        <DashboardNavBadge count={categories.length} />
        <span>Categories are stored in the backend and sync across the public site. If the backend is offline, a local copy is used.</span>
      </div>

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}