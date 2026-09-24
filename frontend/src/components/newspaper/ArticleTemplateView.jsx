import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import NewsCard from "@/components/newspaper/NewsCard";
import { useLanguage } from "@/lib/LanguageContext";

function ClassicPressDesk({ related }) {
  const { t } = useLanguage();
  return (
    <aside className="pb-8">
      <div className="border-t-4 border-double border-ink/70 pt-3">
        <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.26em] text-heritage">
          {t("From the News Desk")}
        </p>
      </div>
      <div className="mt-2 divide-y divide-stone-400/50 border-b border-stone-400/50">
        {related.map((item) => (
          <Link
            key={item.id}
            to={`/article/${item.id}`}
            className="group block py-4"
          >
            <span className="category-label">{t(item.category)}</span>
            <h3 className="mt-1 font-heading text-base font-bold leading-snug text-ink transition-colors group-hover:text-heritage">
              {t(item.headline)}
            </h3>
            <p className="meta-text mt-1">
              {t(item.date)}
              {item.readTime ? ` · ${t(item.readTime)}` : ""}
            </p>
          </Link>
        ))}
      </div>
    </aside>
  );
}

function NewspaperRail({ related }) {
  const { t } = useLanguage();
  return (
    <aside className="pb-4">
      <div className="border-t-4 border-ink pt-3">
        <h2 className="font-sans text-[0.65rem] font-black uppercase tracking-[0.26em] text-ink">
          {t("More in this Section")}
        </h2>
      </div>
      <div className="mt-2 border-t border-stone-300/60">
        {related.map((item) => (
          <Link
            key={item.id}
            to={`/article/${item.id}`}
            className="group block border-b border-stone-300/60 py-4"
          >
            <span className="category-label">{t(item.category)}</span>
            <h3 className="mt-1 font-heading text-base font-bold leading-snug text-ink transition-colors group-hover:text-heritage">
              {t(item.headline)}
            </h3>
            <p className="meta-text mt-1">
              {t(item.date)}
              {item.readTime ? ` · ${t(item.readTime)}` : ""}
            </p>
          </Link>
        ))}
      </div>
    </aside>
  );
}

function TabloidRail({ related }) {
  const { t } = useLanguage();
  return (
    <aside className="pb-4">
      <div className="border-t-4 border-ink bg-ink pt-2">
        <h2 className="px-2 pb-2 font-sans text-[0.68rem] font-black uppercase tracking-[0.24em] text-paper">
          {t("More Headlines")}
        </h2>
      </div>
      <div className="border-x border-b border-stone-400/60">
        {related.map((item, index) => (
          <Link
            key={item.id}
            to={`/article/${item.id}`}
            className="group flex gap-3 border-b border-stone-300/60 px-2 py-4 last:border-b-0"
          >
            <span className="font-black font-display text-2xl leading-none text-heritage">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0">
              <span className="category-label">{t(item.category)}</span>
              <h3 className="mt-1 font-sans text-base font-black leading-snug text-ink transition-colors group-hover:text-heritage">
                {t(item.headline)}
              </h3>
              <p className="meta-text mt-1">
                {t(item.date)}
                {item.readTime ? ` · ${t(item.readTime)}` : ""}
              </p>
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

function StoryBody({ article, access, layoutKey }) {
  const { t } = useLanguage();
  const rawBody = article?.body;
  const articleBody = Array.isArray(rawBody)
    ? rawBody
    : typeof rawBody === "string" && rawBody.trim()
    ? rawBody.split("\n\n").filter(Boolean)
    : [];

  const styles = {
    classic: {
      body: "classic-body-copy text-[1.02rem] leading-[1.9]",
      pullQuote: "classic-pullquote border-y-2 border-double border-ink/50",
      lockPanel: "classic-lock-panel",
      comments: "classic-comments border-t-4 border-double border-stone-300/60",
      form: "border-2 border-ink/50 bg-[#efe3cd]",
      label: "Send a Letter to the Editor",
      textarea: "rounded-none",
      button: "bg-[#4A2A08] rounded-none",
      buttonLabel: "Send Letter",
      commentBorder: "border-stone-400/50",
    },
    newspaper: {
      body: "newspaper-copy text-base leading-[1.85]",
      pullQuote: "newspaper-pullquote border-y-2 border-ink",
      lockPanel: "newspaper-lock-panel",
      comments: "newspaper-comments border-t-2 border-ink",
      form: "border border-ink/30 bg-paper",
      label: "Join the Discussion",
      textarea: "rounded-sm",
      button: "bg-ink",
      buttonLabel: "Post Comment",
      commentBorder: "border-stone-300/60",
    },
    magazine: {
      body: "magazine-copy text-[1.08rem] leading-[1.9]",
      pullQuote: "magazine-pullquote border-y-2 border-heritage",
      lockPanel: "magazine-lock-panel",
      comments: "border-t-4 border-heritage",
      form: "border border-stone-300/60 bg-paper",
      label: "Share Your Thoughts",
      textarea: "rounded-sm",
      button: "bg-ink",
      buttonLabel: "Post Comment",
      commentBorder: "border-stone-300/60",
    },
    tabloid: {
      body: "tabloid-copy text-[1.1rem] leading-[1.8]",
      pullQuote: "border-y-2 border-double border-heritage",
      lockPanel: "",
      comments: "border-t-4 border-ink",
      form: "border-2 border-ink bg-paper",
      label: "Call the Desk",
      textarea: "rounded-none",
      button: "bg-ink",
      buttonLabel: "Sound Off",
      commentBorder: "border-stone-400/60",
    },
    feature: {
      body: "text-[1.05rem] leading-[1.95]",
      pullQuote: "border-l-4 border-heritage bg-vellum px-4 py-3 text-left font-display text-xl",
      lockPanel: "",
      comments: "border-t-4 border-double border-stone-300/60",
      form: "border border-stone-300/60 bg-vellum",
      label: "Leave a Comment",
      textarea: "",
      button: "bg-heritage",
      buttonLabel: "Post Comment",
      commentBorder: "border-stone-300/50",
    },
    newsletter: {
      body: "newsletter-copy text-[1.06rem] leading-[1.85]",
      pullQuote: "border-y-2 border-ink/60",
      lockPanel: "newsletter-lock-panel",
      comments: "border-t-4 border-double border-ink",
      form: "border border-stone-300/60 bg-paper",
      label: "Reply",
      textarea: "rounded-sm",
      button: "bg-ink",
      buttonLabel: "Send Reply",
      commentBorder: "border-stone-300/60",
    },
  }[layoutKey];

  return (
    <>
      <div className={`font-body text-ink ${styles.body}`}>
        <p className="drop-cap">
          {article.summary ||
            t("In a world where the pace of change continues to accelerate, careful reporting remains more important than ever.")}
        </p>

        {access.canReadFull ? (
          <>
            {articleBody.map((paragraph, index) => (
              <p key={`${index}-${paragraph.slice(0, 24)}`} className="mt-6">
                {paragraph}
              </p>
            ))}
          </>
        ) : (
          <div
            className={`mt-8 rounded-[1.25rem] border border-dashed border-amber-300 bg-amber-50/75 p-6 ${styles.lockPanel}`}
          >
            <h2 className="font-display text-2xl font-black text-ink">
              {access.accessMode === "locked" || !access.publicAccessDate
                ? t("Full article is reserved for active subscribers.")
                : t("Full article stays locked until {date}.").replace("{date}", access.publicAccessDate)}
            </h2>
            <p className="mt-2 font-body text-sm text-stone-600">
              {t(access.detail)}
            </p>
            <Link
              to="/subscribe/checkout"
              className="mt-4 inline-block bg-heritage px-5 py-3 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-ink"
            >
              {t("Subscribe now")}
            </Link>
          </div>
        )}
      </div>

    </>
  );
}

function useLayoutFlags(layoutKey) {
  return {
    isClassicLayout: layoutKey === "classic",
    isNewspaperLayout: layoutKey === "newspaper",
    isMagazineLayout: layoutKey === "magazine",
    isTabloidLayout: layoutKey === "tabloid",
    isNewsletterLayout: layoutKey === "newsletter",
  };
}

export function ArticleLayoutView({ article, access, related, layoutKey }) {
  const { t } = useLanguage();
  const {
    isClassicLayout,
    isNewspaperLayout,
    isMagazineLayout,
    isTabloidLayout,
    isNewsletterLayout,
  } = useLayoutFlags(layoutKey);

  return (
    <article
      className={`mx-auto max-w-[1320px] px-3 sm:px-5 lg:px-8 ${
        isClassicLayout
          ? "classic-article-sheet border-x border-stone-400/60 bg-transparent"
          : isNewspaperLayout || isMagazineLayout || isTabloidLayout || isNewsletterLayout
            ? "border-x border-stone-400/60"
            : "grid grid-cols-1 gap-6 py-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.9fr)] lg:py-8"
      }`}
    >
      {isClassicLayout ? (
        <div className="mt-6 grid grid-cols-1 gap-8 py-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(250px,0.72fr)]">
          <div className="min-w-0">
            <div className="mx-auto mb-3 flex max-w-3xl items-center gap-3 font-sans text-[0.62rem] font-bold uppercase tracking-[0.26em] text-heritage">
              <span className="h-px flex-1 bg-heritage/40" />
              {t("Front Page — Lead Story")}
              <span className="h-px flex-1 bg-heritage/40" />
            </div>
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="font-heading text-4xl font-black leading-[1.02] text-ink md:text-5xl lg:text-[4.35rem]">
                {t(article.headline)}
              </h1>
              <p className="mx-auto mt-4 max-w-3xl border-y border-ink/40 py-3 font-body text-lg italic leading-relaxed text-redacted lg:text-xl">
                {t(article.summary)}
              </p>
              <div className="mx-auto mt-5 flex max-w-lg flex-wrap items-center justify-center gap-3 border-b border-ink/40 pb-3">
                {article.author ? (
                  <span className="font-sans text-sm font-bold uppercase tracking-wider text-ink">
                    {t("By")} {t(article.author)}
                  </span>
                ) : null}
                <span className="meta-text">{t(article.date)}</span>
                {article.readTime ? (
                  <span className="meta-text flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {t(article.readTime)}
                  </span>
                ) : null}
              </div>
            </div>

            {article.image ? (
              <figure className="mt-8 border-y border-ink/40 py-3">
                <div className="border border-ink/60 bg-[#efe3cd] p-2">
                  <img
                    src={article.image}
                    alt={t(article.headline)}
                    className="classic-plate-img w-full object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-center meta-text italic">
                  {t("Photograph:")} {t(article.author || "Staff")} {t("/ Newspaper Desk")}
                </figcaption>
              </figure>
            ) : null}

            <div className="mt-10 grid grid-cols-1 gap-8">
              <StoryBody article={article} access={access} layoutKey={layoutKey} />
            </div>
          </div>

          <ClassicPressDesk related={related} />
        </div>
      ) : isNewspaperLayout ? (
        <div className="newspaper-article-page py-6 px-3 sm:px-5 lg:px-8">
          <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-2 border-y-2 border-ink py-2">
            <span className="font-sans text-[0.62rem] font-black uppercase tracking-[0.26em] text-heritage">
              {t("Front Page Report")}
            </span>
            <span className="hidden font-sans text-[0.62rem] font-bold uppercase tracking-[0.26em] text-redacted sm:block">
              {t(article.date)} · {t(article.category)} {t("Desk")}
            </span>
          </div>

          <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-8 py-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.8fr)]">
            <div className="min-w-0">
              <div className="max-w-5xl">
                <div className="flex items-center gap-3">
                  <span className="category-label">{t(article.category)}</span>
                  <span className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.2em] text-redacted">
                    {t("Analysis | Today")}
                  </span>
                </div>
                <h1 className="mt-3 font-heading text-4xl font-black leading-[1.04] text-ink md:text-5xl lg:text-[3.8rem]">
                  {t(article.headline)}
                </h1>
                <p className="mt-5 max-w-3xl border-l-4 border-ink pl-4 font-body text-lg leading-relaxed text-redacted lg:text-xl">
                  {t(article.summary)}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3 border-y border-stone-300/70 py-3">
                  {article.author ? (
                    <span className="font-sans text-sm font-bold uppercase tracking-wider text-ink">
                      {t("By")} {t(article.author)}
                    </span>
                  ) : null}
                  <span className="meta-text">{t(article.date)}</span>
                  {article.readTime ? (
                    <span className="meta-text flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {t(article.readTime)}
                    </span>
                  ) : null}
                </div>
              </div>

              {article.image ? (
                <figure className="mt-8">
                  <img
                    src={article.image}
                    alt={t(article.headline)}
                    className="w-full border border-stone-300/60 object-cover"
                  />
                  <figcaption className="mt-2 border-b-2 border-ink/70 pb-2 meta-text italic">
                    {t("Photo:")} {t(article.author || "Staff")} {t("/ Newspaper Desk")}
                  </figcaption>
                </figure>
              ) : null}

              <div className="mt-10 grid grid-cols-1 gap-8">
                <StoryBody article={article} access={access} layoutKey={layoutKey} />
              </div>
            </div>

            <NewspaperRail related={related} />
          </div>
        </div>
      ) : isMagazineLayout ? (
        <div className="magazine-article-page py-6 px-3 sm:px-5 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="border-y-4 border-double border-heritage py-2 text-center">
              <span className="font-sans text-[0.62rem] font-black uppercase tracking-[0.3em] text-heritage">
                {t("The Magazine")} — {t(article.category)} {t("Desk")}
              </span>
            </div>
            <div className="mt-10">
              <div className="flex items-center gap-3">
                <span className="bg-heritage px-2.5 py-1 font-sans text-[0.6rem] font-black uppercase tracking-[0.2em] text-paper">
                  {t("The Big Read")}
                </span>
                <span className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.2em] text-redacted">
                  {t(article.date)}
                </span>
              </div>
              <h1 className="mt-4 font-heading text-5xl font-black leading-[1.02] text-ink md:text-6xl lg:text-7xl">
                {t(article.headline)}
              </h1>
              <p className="mt-6 max-w-[60ch] font-body text-xl italic leading-relaxed text-redacted lg:text-2xl">
                {t(article.summary)}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-stone-300/70 py-3">
                {article.author ? (
                  <span className="font-sans text-sm font-bold uppercase tracking-wider text-ink">
                    {t("By")} {t(article.author)}
                  </span>
                ) : null}
                {article.readTime ? (
                  <span className="meta-text flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {t(article.readTime)}
                  </span>
                ) : null}
              </div>
            </div>

            {article.image ? (
              <figure className="mt-10">
                <img
                  src={article.image}
                  alt={t(article.headline)}
                  className="w-full object-cover shadow-[0_24px_50px_rgba(0,0,0,0.12)]"
                />
                <figcaption className="mt-3 border-l-2 border-heritage pl-3 meta-text italic">
                  {t("Photo:")} {t(article.author || "Staff")} {t("/ The Magazine")}
                </figcaption>
              </figure>
            ) : null}

            <div className="mt-12">
              <StoryBody article={article} access={access} layoutKey={layoutKey} />
            </div>
          </div>
        </div>
      ) : isTabloidLayout ? (
        <div className="tabloid-article-page">
          <div className="bg-ink px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-y-2 border-double border-heritage py-1">
              <span className="font-sans text-[0.66rem] font-black uppercase tracking-[0.3em] text-paper">
                {t(article.category)} {t("Express")}
              </span>
              <span className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.24em] text-paper/80">
                {t(article.date)} · {t("Fast Despatch")}
              </span>
            </div>
          </div>

          <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-8 px-3 py-8 sm:px-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.8fr)] lg:px-8">
            <div className="min-w-0">
              <div className="border-y-4 border-double border-ink bg-[#efe3cd] px-4 py-5 text-center">
                <span className="font-sans text-[0.6rem] font-black uppercase tracking-[0.3em] text-heritage">
                  {t("Breaking · Top of the Hour")}
                </span>
                <h1 className="mt-2 font-sans text-[2rem] font-black uppercase leading-[0.98] tracking-[-0.01em] text-ink md:text-5xl lg:text-[3.4rem]">
                  {t(article.headline)}
                </h1>
                <div className="mx-auto mt-4 flex max-w-lg flex-wrap items-center justify-center gap-3 border-t border-ink/40 pt-3">
                  {article.author ? (
                    <span className="font-sans text-sm font-black uppercase tracking-wider text-ink">
                      {t("By")} {t(article.author)}
                    </span>
                  ) : null}
                  {article.readTime ? (
                    <span className="meta-text flex items-center gap-1 font-black">
                      <Clock className="h-3 w-3" /> {t(article.readTime)}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mt-6 border-l-8 border-heritage bg-paper px-4 py-4 shadow-[inset_0_0_0_1px_rgba(120,113,108,0.2)]">
                <p className="font-sans text-lg font-bold leading-relaxed text-ink">
                  {t(article.summary)}
                </p>
              </div>

              {article.image ? (
                <figure className="mt-8">
                  <img
                    src={article.image}
                    alt={t(article.headline)}
                    className="w-full border-4 border-ink object-cover"
                  />
                  <figcaption className="mt-2 flex items-center justify-between gap-3 border-y-2 border-ink px-1 py-2">
                    <span className="meta-text italic">
                      {t("Photo:")} {t(article.author || "Staff")} {t("/ Express Desk")}
                    </span>
                    <span className="hidden font-sans text-[0.58rem] font-black uppercase tracking-[0.2em] text-heritage sm:block">
                      {t("Immediate")}
                    </span>
                  </figcaption>
                </figure>
              ) : null}

              <div className="mt-10 grid grid-cols-1 gap-8">
                <StoryBody article={article} access={access} layoutKey={layoutKey} />
              </div>
            </div>

            <TabloidRail related={related} />
          </div>
        </div>
      ) : isNewsletterLayout ? (
        <div className="newsletter-article-page px-3 py-8 sm:px-5 lg:px-8">
          <div className="mx-auto max-w-[780px]">
            <div className="newsletter-masthead py-3 text-center">
              <span className="font-sans text-[0.6rem] font-black uppercase tracking-[0.34em] text-heritage">
                {t("Independent Dispatch")} — {t(article.category)} {t("Desk")}
              </span>
              <h2 className="mt-2 font-display text-4xl font-black tracking-tight text-ink md:text-5xl">
                {t("THE DISPATCH")}
              </h2>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 border-b-2 border-ink pb-3 font-sans text-[0.62rem] font-bold uppercase tracking-[0.24em] text-redacted">
              <span>{t("Issue No. 07")}</span>
              <span className="h-3 w-px bg-stone-400/70" />
              <span>{t(article.date)}</span>
              {article.readTime ? (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {t(article.readTime)}
                </span>
              ) : null}
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-stone-300/70 bg-paper px-3 py-1 font-sans text-[0.6rem] font-bold uppercase tracking-[0.18em] text-heritage">
                  {t(article.category)}
                </span>
                <span className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.2em] text-redacted">
                  {t("The Read")}
                </span>
              </div>
              <h1 className="mt-4 font-display text-4xl font-black leading-[1.05] text-ink md:text-5xl">
                {t(article.headline)}
              </h1>
              <p className="mt-5 border-l-4 border-heritage bg-vellum/70 px-4 py-3 font-body text-lg italic leading-relaxed text-redacted lg:text-xl">
                {t(article.summary)}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3 border-y border-stone-300/70 py-3">
                {article.author ? (
                  <span className="font-sans text-sm font-bold uppercase tracking-wider text-ink">
                    {t("By")} {t(article.author)}
                  </span>
                ) : null}
                {article.readTime ? (
                  <span className="meta-text flex items-center gap-1">
                    <span className="text-heritage">✉</span> {t("Delivered to")} {t(article.author || "readers")}
                  </span>
                ) : null}
              </div>
            </div>

            {article.image ? (
              <figure className="mt-8 border border-stone-300/60 p-2">
                <img
                  src={article.image}
                  alt={t(article.headline)}
                  className="w-full object-cover"
                />
                <figcaption className="mt-2 px-1 pb-1 meta-text italic">
                  {t("Photo:")} {t(article.author || "Staff")} {t("/ Dispatch")}
                </figcaption>
              </figure>
            ) : null}

            <div className="mt-10">
              <StoryBody article={article} access={access} layoutKey={layoutKey} />
            </div>

          </div>
        </div>
      ) : (
        <>
          <div className="min-w-0 lg:border-r lg:pr-8 lg:border-stone-300/40">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="category-label">{t(article.category)}</span>
                <span
                  className={`rounded-full border px-2.5 py-1 font-sans text-[0.6rem] font-bold uppercase tracking-[0.14em] ${
                    access.key === "locked"
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : access.key === "subscriber"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-stone-300 bg-vellum text-ink"
                  }`}
                >
                  {t(access.shortLabel)}
                </span>
              </div>
              <h1 className="mt-3 font-display text-4xl font-black leading-[1.02] text-ink md:text-5xl lg:text-6xl">
                {t(article.headline)}
              </h1>
              <p className="mt-4 max-w-3xl border-l-4 border-heritage pl-4 font-body text-lg leading-relaxed text-redacted">
                {t(article.summary)}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3 border-y border-stone-300/50 py-3">
                {article.author ? (
                  <span className="font-sans text-sm font-semibold uppercase tracking-wider text-ink">
                    {t("By")} {t(article.author)}
                  </span>
                ) : null}
                <span className="meta-text">{t(article.date)}</span>
                {article.readTime ? (
                  <span className="meta-text flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {t(article.readTime)}
                  </span>
                ) : null}
              </div>
            </div>

            {article.image ? (
              <figure className="mt-8">
                <img
                  src={article.image}
                  alt={t(article.headline)}
                  className="w-full border border-stone-300/50 object-cover shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
                />
                <figcaption className="meta-text mt-2 italic">
                  {t("Photo:")} {t(article.author || "Staff")} {t("/ Newspaper Desk")}
                </figcaption>
              </figure>
            ) : null}

            <div className="mt-10 grid grid-cols-1 gap-8">
              <StoryBody article={article} access={access} layoutKey={layoutKey} />
            </div>
          </div>

          <aside className="min-w-0 border-t border-stone-400/70 pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div className="sticky top-6 space-y-6">
              <div className="border border-stone-300/60 bg-paper p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
                <h2 className="font-display text-2xl font-black text-ink">
                  {t("Related Stories")}
                </h2>
                <div className="mt-5 grid grid-cols-1 gap-4">
                  {related.map((item) => (
                    <NewsCard key={item.id} article={item} variant="default" />
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </article>
  );
}

export function ArticleLayoutSwitcher({ layoutKey, options }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <>
      <div className="sm:hidden">
        <select
          value={layoutKey}
          onChange={(e) => {
            const opt = options.find((o) => o.key === e.target.value);
            if (opt) navigate(opt.path);
          }}
          className="rounded border border-stone-300 bg-paper px-2 py-1 font-sans text-xs font-semibold text-stone-700 outline-none"
          aria-label={t("Select layout style")}
        >
          {options.map((option) => (
            <option key={option.key} value={option.key}>
              {t(option.label)}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:flex flex-wrap items-center border border-stone-300/70 p-0.5">
        {options.map((option) => {
          const active = layoutKey === option.key;
          return (
            <Link
              key={option.key}
              to={option.path}
              aria-current={active ? "page" : undefined}
              className={`px-2.5 py-1.5 font-sans text-[0.6rem] font-bold uppercase tracking-[0.12em] transition-colors ${
                active
                  ? "bg-heritage text-paper"
                  : "text-redacted hover:text-heritage"
              }`}
            >
              {t(option.label)}
            </Link>
          );
        })}
      </div>
    </>
  );
}

export function ArticleMoreFromSection({ layoutKey, related }) {
  const { t } = useLanguage();
  const {
    isClassicLayout,
    isNewspaperLayout,
    isMagazineLayout,
    isTabloidLayout,
    isNewsletterLayout,
  } = useLayoutFlags(layoutKey);

  return (
    <div className="mx-auto max-w-[1320px] border-t border-stone-400/70 px-3 py-8 sm:px-5 lg:px-8 lg:py-10">
      <div className="newspaper-rule-double mb-6" />
      <h2 className="mb-6 font-display text-3xl font-black uppercase text-ink">
        {isClassicLayout
          ? t("More from this Edition")
          : isNewspaperLayout
            ? t("More From Today's Paper")
            : isMagazineLayout
              ? t("More From the Magazine")
              : isTabloidLayout
                ? t("More From the Express")
                : isNewsletterLayout
                  ? t("More From the Dispatch")
                  : t("More From The Paper")}
      </h2>
      <div
        className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${
          isClassicLayout
            ? "lg:gap-0 lg:divide-x lg:divide-stone-300/60"
            : "lg:gap-0 lg:divide-x lg:divide-stone-300/50"
        }`}
      >
        {related.map((item) => (
          <div key={item.id} className="first:lg:pl-0 last:lg:pr-0 lg:px-5">
            <NewsCard article={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
