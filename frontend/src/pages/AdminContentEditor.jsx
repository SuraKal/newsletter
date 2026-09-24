import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, FileText, Info, Send } from "lucide-react";
import {
  DashboardPageHeader,
  DashboardPanel,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import AdminArticleForm from "@/components/forms/AdminArticleForm";
import {
  ARTICLE_PLACEMENTS,
  getArticleById,
  getPlacementLabel,
  getRawArticleById,
  saveArticle,
  toStoreArticle,
} from "@/lib/content-store";
import { appClient } from "@/api/appClient";
import { backendArticles, backendCategories, isNetworkError } from "@/api/backendClient";
import {
  adminEditorTemplateFields,
  getArticleAccessState,
  toDisplayDate,
  toDisplayTime,
  toISODate,
  toISOTime,
} from "@/lib/demoData";

const accessToneClassMap = {
  subscriber: "border-emerald-200 bg-emerald-50 text-emerald-700",
  public: "border-stone-300 bg-vellum text-ink",
  locked: "border-amber-200 bg-amber-50 text-amber-700",
};

const placementPrecedence = {
  hero: "Only the first Published Hero story is shown in the hero slider and the News lead.",
  featured:
    "Only the first Published Featured story is shown in the Editor's pick banner.",
  sidebar: "Shown in the home rail cards, in the column under the hero story.",
  latest: "Shown in the Latest News grid and the News lead secondary stories.",
  editorial: "Shown in the Opinion & Analysis editorial grid.",
  admin: "Shown in the main News grid; other placements keep their own reserved slots.",
};

const createDefaultArticle = () => {
  const todayIso = new Date().toISOString().slice(0, 10);
  return {
    id: "new",
    headline: "",
    editor: "Editorial desk",
    status: "Draft",
    tone: "neutral",
    summary: "",
    author: "Nael Desk",
    source: "latest",
    category: "News",
    image: "",
    video: "",
    readTime: "",
    accessLabel: "",
    date: todayIso,
    publicAccessDate: "",
    accessMode: "auto",
    publishDate: todayIso,
    publishTime: "14:00",
    body: "",
    councilSession: "",
    eventDate: "",
    location: "",
    scorelineFocus: "",
    marketImpact: "",
    translations: { ti: {} },
  };
};

// Keys inside the backend `meta` JSON that map onto the editor form's
// category-specific template fields.
const META_FORM_KEYS = [
  "councilSession",
  "eventDate",
  "location",
  "scorelineFocus",
  "marketImpact",
];

const TRANSLATABLE_FORM_KEYS = [
  "headline",
  "summary",
  "body",
  "author",
  "readTime",
  ...META_FORM_KEYS,
];

// Flattens a backend article (camelCase + `meta` JSON) into the editor form
// shape. Falls back to the mock record shape for offline seeding.
function toEditorForm(source, fallback = createDefaultArticle) {
  if (!source) return fallback();
  const meta = source.meta && typeof source.meta === "object" ? source.meta : {};
  const rawPublishDate = source.publishDate || source.date || "";
  const rawPublicAccessDate = source.publicAccessDate || meta.publicAccessDate || "";
  const rawPublishTime = source.publishTime || "";
  const rawDate = source.date || source.publishDate || "";
  const translations =
    source.translations && typeof source.translations === "object"
      ? source.translations
      : meta.translations && typeof meta.translations === "object"
        ? meta.translations
        : {};

  return {
    ...fallback(),
    id: source.id,
    headline: source.headline || "",
    editor: source.editor || "Editorial desk",
    status: source.status || "Draft",
    tone: source.tone || "neutral",
    summary: source.summary || "",
    author: source.author || "Nael Desk",
    source: source.source || "latest",
    category: source.categoryLabel || source.category || "News",
    image: source.image || "",
    video: source.video || meta.video || "",
    readTime: source.readTime || "",
    accessLabel: source.accessLabel || "",
    date: toISODate(rawDate) || rawDate,
    publicAccessDate: toISODate(rawPublicAccessDate),
    accessMode: source.accessMode || meta.accessMode || "auto",
    publishDate: toISODate(rawPublishDate),
    publishTime: toISOTime(rawPublishTime) || rawPublishTime,
    body: Array.isArray(source.body)
      ? source.body.join("\n\n")
      : String(source.body || ""),
    councilSession: source.councilSession || meta.councilSession || "",
    eventDate: source.eventDate || meta.eventDate || "",
    location: source.location || meta.location || "",
    scorelineFocus: source.scorelineFocus || meta.scorelineFocus || "",
    marketImpact: source.marketImpact || meta.marketImpact || "",
    translations: {
      ti:
        translations.ti && typeof translations.ti === "object"
          ? translations.ti
          : {},
    },
  };
}

// Unflattens the editor form back into the API payload, collecting the
// category-specific template fields into the `meta` JSON object.
function toArticlePayload(form) {
  const meta = {};
  META_FORM_KEYS.forEach((key) => {
    const value = String(form[key] || "").trim();
    if (value) meta[key] = value;
  });
  const videoValue = String(form.video || "").trim();
  if (videoValue) meta.video = videoValue;
  meta.accessMode = form.accessMode || "auto";
  const tigrinyaTranslation = {};
  TRANSLATABLE_FORM_KEYS.forEach((key) => {
    const value = String(form.translations?.ti?.[key] || "").trim();
    if (value) tigrinyaTranslation[key] = value;
  });
  if (Object.keys(tigrinyaTranslation).length) {
    meta.translations = { ti: tigrinyaTranslation };
  }

  const displayPublishDate = toDisplayDate(form.publishDate) || form.publishDate || "";
  const displayPublicAccessDate = toDisplayDate(form.publicAccessDate) || form.publicAccessDate || "";
  const displayPublishTime = toDisplayTime(form.publishTime) || form.publishTime || "";

  return {
    headline: form.headline,
    summary: form.summary,
    body: form.body,
    image: form.image || null,
    author: form.author,
    editor: form.editor,
    status: form.status,
    tone: form.tone,
    source: form.source,
    categoryLabel: form.category || "News",
    readTime: form.readTime,
    accessLabel: form.accessLabel,
    date: displayPublishDate || form.date || "",
    publicAccessDate: displayPublicAccessDate,
    accessMode: form.accessMode || "auto",
    publishDate: displayPublishDate,
    publishTime: displayPublishTime,
    clicks: Number(form.clicks) || 0,
    meta,
  };
}

function SectionHeaderMock({ title, viewAll }) {
  return (
    <div>
      <div className="newspaper-rule-double mb-3" />
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-display text-base font-black uppercase tracking-tight text-ink">
          {title}
        </h3>
        {viewAll ? (
          <span className="font-sans text-[0.62rem] font-semibold uppercase tracking-wider text-heritage">
            {viewAll}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function PlacementPreviewPanel({ article }) {
  const placement = ARTICLE_PLACEMENTS.find(
    (option) => option.value === article.source,
  );
  const access = getArticleAccessState(
    {
      ...article,
      date: article.date || article.publishDate || "",
    },
    false,
  );
  const accessToneClass =
    accessToneClassMap[access.key] || accessToneClassMap.public;
  const isLive = article.status === "Published";
  const headline = article.headline || "Untitled article";
  const category = article.category || "News";

  const accessChip = (
    <span
      className={`rounded-full border px-2.5 py-1 font-sans text-[0.6rem] font-bold uppercase tracking-[0.14em] ${accessToneClass}`}
    >
      {access.shortLabel}
    </span>
  );

  const renderSlot = () => {
    if (article.source === "hero") {
      return (
        <div className="relative overflow-hidden rounded-md border border-stone-300/50 bg-stone-950">
          {article.image ? (
            <img
              src={article.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
          <div className="relative z-10 p-4">
            <p className="font-sans text-[0.58rem] font-bold uppercase tracking-[0.2em] text-paper/70">
              Front page slider
            </p>
            <span className="mt-3 inline-flex rounded-full border border-paper/20 bg-paper/10 px-2.5 py-1 font-sans text-[0.6rem] font-bold uppercase tracking-[0.16em] text-paper backdrop-blur-sm">
              {category}
            </span>
            <h4 className="mt-2 font-display text-base font-black leading-tight text-paper">
              {headline}
            </h4>
            <p className="mt-2 line-clamp-2 font-body text-[0.7rem] leading-relaxed text-paper/85">
              {access.detail}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="bg-paper px-3 py-1.5 font-sans text-[0.6rem] font-bold uppercase tracking-wider text-ink">
                Read full coverage
              </span>
              <span className="font-sans text-[0.6rem] font-bold uppercase tracking-wider text-paper/60">
                Read the story
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (article.source === "sidebar") {
      return (
        <div className="rounded-md border border-stone-400/60 bg-paper p-3">
          <div className="mb-2 border-b border-stone-400/70 pb-2">
            <p className="category-label">News Desk</p>
            <p className="mt-0.5 font-display text-sm font-black leading-tight text-ink">
              Stories worth keeping
            </p>
          </div>
          <div className="flex gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="category-label">{category}</span>
                {accessChip}
              </div>
              <h4 className="mt-1 line-clamp-2 font-heading text-sm font-bold leading-snug text-ink">
                {headline}
              </h4>
            </div>
            {article.image ? (
              <img
                src={article.image}
                alt="Cover"
                className="h-14 w-14 flex-shrink-0 rounded-sm object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-sm bg-stone-100 font-sans text-[0.55rem] font-bold uppercase tracking-widest text-stone-400">
                None
              </div>
            )}
          </div>
        </div>
      );
    }

    if (article.source === "featured") {
      return (
        <div className="overflow-hidden rounded-md bg-[#4A2A08] text-cream">
          <div className="px-4 pt-4">
            <div className="flex items-center gap-2">
              <span className="h-px flex-1 bg-cream/25" />
              <span className="font-sans text-[0.6rem] font-bold uppercase tracking-[0.3em] text-cream/65">
                Editor's Selection
              </span>
              <span className="h-px flex-1 bg-cream/25" />
            </div>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-cream/80">
                {category}
              </span>
              {accessChip}
            </div>
            <h4 className="mt-2 line-clamp-2 font-display text-lg font-black leading-tight">
              {headline}
            </h4>
            <p className="mt-2 font-body text-xs leading-relaxed text-cream/75">
              {access.detail}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-cream/20 pt-3">
              <span className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.14em] text-cream/65">
                Inside this edition
              </span>
              <span className="inline-flex items-center font-sans text-xs font-bold uppercase tracking-[0.16em] text-cream">
                Read feature <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (article.source === "editorial") {
      return (
        <div>
          <SectionHeaderMock title="Opinion & Analysis" viewAll="View All >" />
          <div className="rounded-md border border-stone-400/60 bg-vellum p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="category-label">{category}</span>
              {accessChip}
            </div>
            <h4 className="mt-2 line-clamp-2 font-heading text-base font-bold leading-snug text-ink">
              {headline}
            </h4>
            <p className="mt-2 font-body text-xs leading-relaxed text-redacted">
              {access.detail}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div>
        <SectionHeaderMock
          title={article.source === "latest" ? "Latest News" : "All News"}
          viewAll={article.source === "latest" ? "View All >" : null}
        />
        <div className="rounded-md border border-stone-400/60 bg-paper p-3">
          {article.image ? (
            <img
              src={article.image}
              alt="Cover"
              className="aspect-[4/3] w-full rounded-sm object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-sm bg-stone-100 font-sans text-[0.55rem] font-bold uppercase tracking-widest text-stone-400">
              No cover
            </div>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="category-label">{category}</span>
            {accessChip}
          </div>
          <h4 className="mt-1 line-clamp-2 font-heading text-sm font-bold leading-snug text-ink">
            {headline}
          </h4>
          <p className="mt-2 font-body text-xs leading-relaxed text-redacted">
            {access.detail}
          </p>
        </div>
      </div>
    );
  };

  return (
    <DashboardPanel
      title="Public placement"
      description="Mirrors the exact section label and copy readers see for this slot."
      className="h-full"
    >
      <div className="space-y-4">
        <div className="dashboard-panel-soft p-4">
          <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-stone-500">
            Assigned slot
          </p>
          <p className="mt-2 font-sans text-lg font-semibold text-stone-900 dark:text-stone-100">
            {getPlacementLabel(article.source)}
          </p>
          {placement?.note ? (
            <p className="mt-1 font-body text-xs leading-relaxed text-stone-500">
              {placement.note}
            </p>
          ) : null}
        </div>

        <div>
          <p className="mb-2 font-sans text-[0.62rem] font-bold uppercase tracking-[0.18em] text-stone-400">
            Rendered with
          </p>
          {renderSlot()}
        </div>

        {placementPrecedence[article.source] ? (
          <p className="flex items-start gap-2 font-body text-xs leading-relaxed text-stone-500">
            <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            {placementPrecedence[article.source]}
          </p>
        ) : null}

        <div
          className={`flex items-start gap-2 rounded-md border p-3 font-sans text-xs font-semibold ${
            isLive
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {isLive ? (
            <Eye className="mt-0.5 h-4 w-4 flex-shrink-0" />
          ) : (
            <EyeOff className="mt-0.5 h-4 w-4 flex-shrink-0" />
          )}
          <span>
            {isLive
              ? "Live on the public site now."
              : "Hidden on the public site — appears only after this article is marked Published."}
          </span>
        </div>
      </div>
    </DashboardPanel>
  );
}

export default function AdminContentEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(() => toEditorForm(null));
  const [categoryOptions, setCategoryOptions] = useState(null);
  const [editingLanguage, setEditingLanguage] = useState("en");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let active = true;
    backendCategories
      .list()
      .then((list) => {
        if (!active) return;
        const labels = (Array.isArray(list) ? list : [])
          .map((cat) => cat.label)
          .filter(Boolean);
        if (labels.length) {
          setCategoryOptions([...labels, "Editorial", "Opinion", "Analysis"]);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setSuccessMessage("");
    setActionError("");
    setEditingLanguage("en");
    if (!id || id === "new") {
      setForm(toEditorForm(null));
      return () => {
        active = false;
      };
    }
    const localArticle = getArticleById(id) || getRawArticleById(id);
    if (localArticle) {
      setForm(toEditorForm(localArticle));
    }
    (async () => {
      try {
        const fetched = await appClient.articles.get(id);
        if (!active) return;
        if (fetched) {
          setForm(toEditorForm(fetched));
        }
      } catch (error) {
        if (!active) return;
        if (localArticle) {
          setForm(toEditorForm(localArticle));
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const templateFields = adminEditorTemplateFields[form.category] || [];
  const isNewArticle = id === "new";

  const handleChange = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleTranslationChange = (key, value) => {
    setForm((current) => ({
      ...current,
      translations: {
        ...current.translations,
        ti: {
          ...(current.translations?.ti || {}),
          [key]: value,
        },
      },
    }));
  };

  const applySavedArticle = (saved, success) => {
    const stored = saveArticle(toStoreArticle(saved));
    const editorForm = toEditorForm(stored);
    setForm(editorForm);
    setIsSaving(false);
    setSuccessMessage(success);

    if (isNewArticle) {
      navigate(`/admin/content/${stored.id}`, { replace: true });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.headline.trim()) {
      setActionError("Article headline is required before saving.");
      setSuccessMessage("");
      return;
    }
    setIsSaving(true);
    setSuccessMessage("");
    setActionError("");

    const saveFallback = () => {
      window.setTimeout(() => {
        const displayPublishDate = toDisplayDate(form.publishDate) || form.publishDate || "";
        const displayPublicAccessDate = toDisplayDate(form.publicAccessDate) || form.publicAccessDate || "";
        const displayPublishTime = toDisplayTime(form.publishTime) || form.publishTime || "";
        const draft = {
          ...form,
          date: displayPublishDate || form.date || "",
          publishDate: displayPublishDate,
          publicAccessDate: displayPublicAccessDate,
          publishTime: displayPublishTime,
        };
        applySavedArticle(
          draft,
          draft.status === "Published"
            ? "Article is live in the public newsroom and ready for reader access."
            : "Editorial draft saved to the publishing queue.",
        );
      }, 300);
    };

    try {
      const payload = toArticlePayload(form);
      const saved =
        form.id && form.id !== "new"
          ? await backendArticles.adminUpdate(form.id, payload)
          : await backendArticles.adminCreate(payload);
      applySavedArticle(
        saved,
        saved.status === "Published"
          ? "Article is live in the public newsroom and ready for reader access."
          : "Editorial draft saved to the publishing queue.",
      );
    } catch (error) {
      if (isNetworkError(error)) {
        saveFallback();
        return;
      }
      setIsSaving(false);
      setActionError(error.message || "Failed to save the article.");
    }
  };

  const handlePublishNow = async () => {
    if (!form.headline.trim()) {
      setActionError("Add a headline before publishing this article.");
      setSuccessMessage("");
      return;
    }

    setActionError("");
    setIsSaving(true);
    setSuccessMessage("");

    const publishFallback = () => {
      window.setTimeout(() => {
        const displayPublishDate = toDisplayDate(form.publishDate) || form.publishDate || "";
        const displayPublicAccessDate = toDisplayDate(form.publicAccessDate) || form.publicAccessDate || "";
        const displayPublishTime = toDisplayTime(form.publishTime) || form.publishTime || "";
        const draft = {
          ...form,
          status: "Published",
          date: displayPublishDate || form.date || "",
          publishDate: displayPublishDate,
          publicAccessDate: displayPublicAccessDate,
          publishTime: displayPublishTime,
        };
        applySavedArticle(
          { ...draft, id: form.id },
          "Article is live in the public newsroom and ready for reader access.",
        );
      }, 300);
    };

    try {
      let saved;
      if (form.id && form.id !== "new") {
        saved = await backendArticles.adminPublish(form.id);
      } else {
        saved = await backendArticles.adminCreate(
          toArticlePayload({ ...form, status: "Published" }),
        );
      }
      applySavedArticle(
        saved,
        "Article is live in the public newsroom and ready for reader access.",
      );
    } catch (error) {
      if (isNetworkError(error)) {
        publishFallback();
        return;
      }
      setIsSaving(false);
      setActionError(error.message || "Failed to publish the article.");
    }
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin editor"
        title={isNewArticle ? "Create a new article" : "Edit article"}
        description="Write, schedule, and publish a story."
        breadcrumbs={[
          { label: "Admin workspace", to: "/admin/overview" },
          { label: "Content", to: "/admin/content" },
          { label: isNewArticle ? "New article" : "Edit article" },
        ]}
        action={
          <Link
            to="/admin/content"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Back to content list
            <FileText className="h-4 w-4" />
          </Link>
        }
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <DashboardPanel
          title="Article details"
        >
          <AdminArticleForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isSaving={isSaving}
            successMessage={successMessage}
            errorMessage={actionError}
            templateFields={templateFields}
            categoryOptions={categoryOptions}
            editingLanguage={editingLanguage}
            onEditingLanguageChange={setEditingLanguage}
            onTranslationChange={handleTranslationChange}
          />
        </DashboardPanel>

        <div className="space-y-4">
          <DashboardPanel title="Publishing">
            <div className="space-y-4">
              <div className="dashboard-panel-soft p-4">
                <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                  Current status
                </p>
                <div className="mt-3">
                  <DashboardStatusBadge label={form.status} tone={form.tone || "neutral"} />
                </div>
                {form.status !== "Published" ? (
                  <>
                    <button
                      type="button"
                      onClick={handlePublishNow}
                      disabled={isSaving}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-heritage px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-paper transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Send className="h-4 w-4" />
                      Publish now
                    </button>
                    {actionError ? (
                      <p
                        role="alert"
                        className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 font-sans text-xs font-semibold text-red-700"
                      >
                        {actionError}
                      </p>
                    ) : null}
                  </>
                ) : null}
              </div>

            </div>
          </DashboardPanel>

          <PlacementPreviewPanel article={form} />
        </div>
      </section>
    </div>
  );
}
