import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Clock3, Eye, EyeOff, FileText, Info } from "lucide-react";
import {
  DashboardFilterBar,
  DashboardPageHeader,
  DashboardPanel,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import AdminArticleForm from "@/components/forms/AdminArticleForm";
import {
  ARTICLE_PLACEMENTS,
  getPlacementLabel,
  getRawArticleById,
  saveArticle,
} from "@/lib/content-store";
import { adminEditorTemplateFields, getArticleAccessState } from "@/lib/demoData";

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

const createDefaultArticle = () => ({
  id: "new",
  headline: "",
  sector: "Politics",
  editor: "Editorial desk",
  status: "Draft",
  tone: "neutral",
  summary: "",
  author: "Nael Desk",
  source: "latest",
  category: "News",
  image: "",
  readTime: "",
  accessLabel: "",
  date: "",
  publicAccessDate: "September 11, 2026",
  publishDate: "August 11, 2026",
  publishTime: "2:00 PM",
  body: "",
  councilSession: "",
  eventDate: "",
  location: "",
  scorelineFocus: "",
  marketImpact: "",
});

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
  const seed = useMemo(() => {
    if (!id || id === "new") {
      return createDefaultArticle();
    }

    return {
      ...createDefaultArticle(),
      ...(getRawArticleById(id) || {}),
    };
  }, [id]);

  const [form, setForm] = useState(seed);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setForm(seed);
    setSuccessMessage("");
  }, [seed]);

  const templateFields = adminEditorTemplateFields[form.sector] || [];
  const isNewArticle = id === "new";

  const handleChange = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");

    window.setTimeout(() => {
      const draft = { ...form, date: form.date || form.publishDate || "" };
      const saved = saveArticle(draft);
      setIsSaving(false);
      if (form.id === "new") {
        handleChange("id", saved.id);
      }
      setSuccessMessage(
        saved.status === "Published"
          ? "Article is live in the public newsroom and ready for reader access."
          : "Editorial draft saved to the publishing queue.",
      );
    }, 300);
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin editor"
        title={isNewArticle ? "Create a new article" : "Edit sector article"}
        description="The editor should make sector-specific fields, publish timing, and article state obvious without sending admins back to a generic article list."
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

      <DashboardFilterBar
        searchPlaceholder="Search editorial notes or template fields"
        filters={[
          `${form.sector} template`,
          form.status,
          `${form.publishDate} · ${form.publishTime}`,
        ]}
        action={
          <Link
            to="/admin/schedule"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Publishing schedule
            <Clock3 className="h-4 w-4" />
          </Link>
        }
      />

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <DashboardPanel
          title="Sector-aware editor"
          description="Template fields change with the article desk so publishing stays structured across politics, business, sports, and events."
        >
          <AdminArticleForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isSaving={isSaving}
            successMessage={successMessage}
            templateFields={templateFields}
          />
        </DashboardPanel>

        <div className="space-y-4">
          <DashboardPanel
            title="Editorial state"
            description="Article state should stay visible while the editor works."
          >
            <div className="space-y-4">
              <div className="dashboard-panel-soft p-4">
                <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                  Current status
                </p>
                <div className="mt-3">
                  <DashboardStatusBadge label={form.status} tone={form.tone || "neutral"} />
                </div>
              </div>
              <div className="dashboard-panel-soft p-4">
                <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                  Publish window
                </p>
                <p className="mt-2 font-sans text-lg font-semibold text-stone-900 dark:text-stone-100">
                  {form.publishDate} · {form.publishTime}
                </p>
              </div>
              <div className="dashboard-panel-soft p-4">
                <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                  Public archive date
                </p>
                <p className="mt-2 font-sans text-lg font-semibold text-stone-900 dark:text-stone-100">
                  {form.publicAccessDate}
                </p>
              </div>
            </div>
          </DashboardPanel>

          <PlacementPreviewPanel article={form} />
        </div>
      </section>
    </div>
  );
}
