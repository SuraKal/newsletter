import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Bookmark, Clock, Share2 } from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import NewsCard from "@/components/newspaper/NewsCard";

import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { hasActiveReaderSubscription } from "@/lib/reader-subscription";
import { getArticleById, getHeroArticle, getPublicListingArticles, registerArticleClick } from "@/lib/content-store";
import {
  isArticleSaved,
  recordArticleShare,
  recordArticleView,
  toggleArticleSaved,
} from "@/lib/reading-history";
import { getArticleAccessState } from "@/lib/demoData";
import { useStoreVersion } from "@/lib/store-bus";

function ClassicPressDesk({ related }) {
  const { t } = useLanguage();
  return (
    <aside className="pb-8">
      <div className="border-t-4 border-double border-ink/70 pt-3">
        <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.26em] text-heritage">
          From the News Desk
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
      <div className="mt-6 border-2 border-ink/60 p-4">
        <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.26em] text-heritage">
          In This Edition
        </p>
        <ul className="mt-3 space-y-2 font-body text-sm leading-relaxed text-ink">
          <li>· Today&apos;s council and parliament session calendar</li>
          <li>· Print run ships Friday — biweekly delivery window opens</li>
          <li>· Weekend fixtures and event listings live by desk</li>
          <li>· Subscriber archive opens 30 days after first release</li>
        </ul>
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
          More in this Section
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
      <div className="mt-6 bg-vellum p-4">
        <p className="font-sans text-[0.6rem] font-black uppercase tracking-[0.24em] text-heritage">
          Editor&apos;s Note
        </p>
        <p className="mt-2 font-body text-sm leading-relaxed text-redacted">
          Headlines and summaries are reviewed by the desk before each edition
          ships to readers.
        </p>
      </div>
      <div className="mt-4 border border-stone-300/70 p-4">
        <p className="font-sans text-[0.6rem] font-black uppercase tracking-[0.24em] text-ink">
          In Brief
        </p>
        <ul className="mt-3 space-y-2 font-body text-sm leading-relaxed text-redacted">
          <li>· Today&apos;s council session calendar is live.</li>
          <li>· Weekend fixtures posted by each section desk.</li>
          <li>· Subscriber archive updated with the latest edition.</li>
        </ul>
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
          More Headlines
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
      <div className="mt-6 border-y-4 border-double border-ink bg-[#efe3cd] p-4">
        <p className="font-sans text-[0.62rem] font-black uppercase tracking-[0.24em] text-heritage">
          The Express Line
        </p>
        <p className="mt-2 font-heading text-xl font-bold italic leading-snug text-ink">
          “Stories briefed at full speed every morning — verified, trimmed, and
          on your desk before sunrise.”
        </p>
      </div>
    </aside>
  );
}

function StoryBody({ article, access, layoutKey }) {
  const articleBody = article.body || [];
  const fallbackParagraphs = [
    "The newsroom continues to track the story as officials, residents, and stakeholders respond to the latest developments.",
    "Our correspondents are speaking with local voices and reviewing the full implications for families, businesses, and public services.",
  ];
  const comments = [
    {
      id: "c1",
      name: "Amina K.",
      time: "12 min ago",
      text: "This reads much more like a printed front-page analysis than a typical blog post.",
    },
    {
      id: "c2",
      name: "James W.",
      time: "38 min ago",
      text: "The extra context and the sidebar notes help a lot. Keep the newspaper feel going.",
    },
    {
      id: "c3",
      name: "Lina M.",
      time: "1 hour ago",
      text: "The pull quote and the column layout make the article feel more editorial and credible.",
    },
  ];

  const isClassicLayout = layoutKey === "classic";
  const isNewspaperLayout = layoutKey === "newspaper";
  const isMagazineLayout = layoutKey === "magazine";
  const isTabloidLayout = layoutKey === "tabloid";
  const isNewsletterLayout = layoutKey === "newsletter";

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
            "In a world where the pace of change continues to accelerate, careful reporting remains more important than ever."}
        </p>

        {access.canReadFull ? (
          <>
            {(articleBody.length > 0 ? articleBody : fallbackParagraphs).map(
              (paragraph) => (
                <p key={paragraph} className="mt-6">
                  {paragraph}
                </p>
              ),
            )}
            {isTabloidLayout ? (
              <blockquote className="mt-8 border-y-4 border-double border-heritage bg-[#efe3cd] px-6 py-6 text-center">
                <span className="font-display text-4xl font-black text-heritage">
                  “
                </span>
                <p className="mt-1 font-sans text-xl font-black uppercase tracking-wide text-ink md:text-2xl">
                  “The details matter, and the public deserves the full
                  record.”
                </p>
              </blockquote>
            ) : (
              <blockquote
                className={`mt-8 border-y px-6 py-5 text-center font-heading text-xl font-semibold italic leading-snug text-ink md:text-2xl ${styles.pullQuote}`}
              >
                {isClassicLayout ||
                isNewspaperLayout ||
                isMagazineLayout ||
                isNewsletterLayout ? (
                  <>
                    <span className="mb-1 block font-display text-5xl font-black leading-none text-heritage">
                      “
                    </span>
                    The details matter, and the public deserves the full record.
                  </>
                ) : (
                  "“The details matter, and the public deserves the full record.”"
                )}
              </blockquote>
            )}
            <p className="mt-6">
              The article will continue to be updated as new information
              becomes available, with editors placing emphasis on verified
              sourcing and readable context rather than a generic blog format.
            </p>
          </>
        ) : (
          <div
            className={`mt-8 rounded-[1.25rem] border border-dashed border-amber-300 bg-amber-50/75 p-6 ${styles.lockPanel}`}
          >
            <h2 className="font-display text-2xl font-black text-ink">
              Full article stays locked until {access.publicAccessDate}.
            </h2>
            <Link
              to="/subscribe/checkout"
              className="mt-4 inline-block bg-heritage px-5 py-3 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-ink"
            >
              Subscribe now
            </Link>
          </div>
        )}
      </div>

      <div className={`mt-12 pt-8 ${styles.comments}`}>
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-black uppercase text-ink">
            {isClassicLayout
              ? "Letters to the Editor"
              : isNewspaperLayout
                ? "Join the Discussion"
                : isMagazineLayout
                  ? "Reader Voices"
                  : isTabloidLayout
                    ? "Call the Desk"
                    : isNewsletterLayout
                      ? "Reply to This Dispatch"
                      : "Reader Comments"}
          </h2>
          <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.22em] text-redacted">
            {comments.length} Voices
          </span>
        </div>

        <form className={`mt-6 p-5 ${styles.form}`}>
          <label className="font-sans text-xs font-bold uppercase tracking-wider text-ink">
            {styles.label}
          </label>
          <textarea
            rows={4}
            placeholder={
              access.canReadFull
                ? "Share your thoughts on this story..."
                : `Comments unlock with full access until ${access.publicAccessDate}.`
            }
            disabled={!access.canReadFull}
            className={`mt-3 w-full resize-none border border-stone-300/60 bg-paper p-3 font-body text-sm text-ink outline-none placeholder:text-redacted/60 focus:border-heritage disabled:cursor-not-allowed disabled:opacity-70 ${styles.textarea}`}
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              disabled={!access.canReadFull}
              className={`px-5 py-3 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60 ${styles.button}`}
            >
              {styles.buttonLabel}
            </button>
          </div>
        </form>

        <div className="mt-6 space-y-4">
          {comments.map((comment) => (
            <article
              key={comment.id}
              className={`border-b pb-4 last:border-b-0 last:pb-0 ${styles.commentBorder}`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-ink">
                  {comment.name}
                </h3>
                <span className="meta-text">{comment.time}</span>
              </div>
              <p className="mt-2 font-body text-sm leading-relaxed text-redacted">
                {comment.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

export default function ArticleDetail() {
  useStoreVersion();
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const layout = new URLSearchParams(location.search).get("layout");
  const layoutKey =
    layout === "classic"
      ? "classic"
      : layout === "newspaper"
        ? "newspaper"
        : layout === "magazine"
          ? "magazine"
          : layout === "tabloid"
            ? "tabloid"
            : layout === "newsletter"
              ? "newsletter"
              : "feature";
  const isClassicLayout = layoutKey === "classic";
  const isNewspaperLayout = layoutKey === "newspaper";
  const isMagazineLayout = layoutKey === "magazine";
  const isTabloidLayout = layoutKey === "tabloid";
  const isNewsletterLayout = layoutKey === "newsletter";

  const layoutOptions = [
    { key: "feature", label: "Feature", path: `/article/${id}` },
    { key: "classic", label: "Classic", path: `/article/${id}?layout=classic` },
    { key: "newspaper", label: "Newspaper", path: `/article/${id}?layout=newspaper` },
    { key: "magazine", label: "Magazine", path: `/article/${id}?layout=magazine` },
    { key: "tabloid", label: "Tabloid", path: `/article/${id}?layout=tabloid` },
    { key: "newsletter", label: "Newsletter", path: `/article/${id}?layout=newsletter` },
  ];

  const article = getArticleById(id) || getHeroArticle();
  const related = getPublicListingArticles()
    .filter((item) => item.id !== id)
    .slice(0, 3);
  const access = getArticleAccessState(
    article,
    hasActiveReaderSubscription(user),
  );

  const [saved, setSaved] = useState(() => isArticleSaved(article?.id));
  const [actionMessage, setActionMessage] = useState("");
  const messageTimer = useRef(null);
  const trackedArticleId = useRef(null);

  useEffect(() => {
    setSaved(isArticleSaved(article?.id));
    if (article?.id && article?.id !== trackedArticleId.current) {
      trackedArticleId.current = article?.id;
      recordArticleView(article);
      registerArticleClick(article.id);
    }
  }, [article?.id]);

  useEffect(
    () => () => {
      if (messageTimer.current) window.clearTimeout(messageTimer.current);
    },
    [],
  );

  const notify = (message) => {
    setActionMessage(message);
    if (messageTimer.current) window.clearTimeout(messageTimer.current);
    messageTimer.current = window.setTimeout(() => setActionMessage(""), 2500);
  };

  const handleShare = async () => {
    if (!article?.id) return;
    recordArticleShare(article);

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: article.headline,
          text: article.summary,
          url: typeof window !== "undefined" ? window.location.href : "",
        });
        notify("Shared to reading history");
        return;
      } catch {
        // Fall through to clipboard copy when the user cancels the sheet.
      }
    }

    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard?.writeText &&
      typeof window !== "undefined"
    ) {
      await navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    notify("Link copied");
  };

  const handleBookmark = () => {
    if (!article?.id) return;
    const nextSaved = toggleArticleSaved(article);
    setSaved(nextSaved);
    notify(nextSaved ? "Saved to reading history" : "Removed from saved stories");
  };

  return (
    <div className={`min-h-screen bg-paper newspaper-page ${isClassicLayout ? "classic-article-page" : isNewspaperLayout ? "newspaper-article-page" : isMagazineLayout ? "magazine-article-page" : isTabloidLayout ? "tabloid-article-page" : isNewsletterLayout ? "newsletter-article-page" : ""}`}>
      <Masthead />
      <main>
        <section className="mx-auto max-w-[1320px] px-3 pt-4 sm:px-5 lg:px-8">
          <div className="newspaper-rule-double mb-4" />
          <div className={`flex flex-wrap items-center justify-between gap-3 pb-4 ${isClassicLayout ? "classic-folio px-3 py-2.5" : "border-b border-stone-300/50"}`}>
            <Link
              to="/news"
              className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.2em] text-redacted transition-colors hover:text-heritage"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Newsroom
            </Link>
            <div className="flex items-center gap-3">
              {actionMessage ? (
                <span
                  role="status"
                  aria-live="polite"
                  className="font-sans text-xs font-medium text-heritage"
                >
                  {actionMessage}
                </span>
              ) : null}
              <div className="flex items-center border border-stone-300/70 p-0.5">
                {layoutOptions.map((option) => {
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
                      {option.label}
                    </Link>
                  );
                })}
              </div>
              <button
                className="p-2 transition-colors hover:text-heritage"
                aria-label="Share this story"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                className={`p-2 transition-colors ${saved ? "text-heritage" : "hover:text-heritage"}`}
                aria-label={saved ? "Remove bookmark" : "Bookmark this story"}
                aria-pressed={saved}
                onClick={handleBookmark}
              >
                <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>
        </section>

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
                  Front Page — Lead Story
                  <span className="h-px flex-1 bg-heritage/40" />
                </div>
                <div className="mx-auto max-w-4xl text-center">
                  <h1 className="font-heading text-4xl font-black leading-[1.02] text-ink md:text-5xl lg:text-[4.35rem]">
                    {article.headline}
                  </h1>
                  <p className="mx-auto mt-4 max-w-3xl border-y border-ink/40 py-3 font-body text-lg italic leading-relaxed text-redacted lg:text-xl">
                    {article.summary}
                  </p>
                  <div className="mx-auto mt-5 flex max-w-lg flex-wrap items-center justify-center gap-3 border-b border-ink/40 pb-3">
                    {article.author ? (
                      <span className="font-sans text-sm font-bold uppercase tracking-wider text-ink">
                        By {article.author}
                      </span>
                    ) : null}
                    <span className="meta-text">{article.date}</span>
                    {article.readTime ? (
                      <span className="meta-text flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {article.readTime}
                      </span>
                    ) : null}
                  </div>
                </div>

                {article.image ? (
                  <figure className="mt-8 border-y border-ink/40 py-3">
                    <div className="border border-ink/60 bg-[#efe3cd] p-2">
                      <img
                        src={article.image}
                        alt={article.headline}
                        className="classic-plate-img w-full object-cover"
                      />
                    </div>
                    <figcaption className="mt-2 text-center meta-text italic">
                      Photograph: {article.author || "Staff"} / Newspaper Desk
                    </figcaption>
                  </figure>
                ) : null}

                <div className="mt-10 grid grid-cols-1 gap-8">
                  <StoryBody
                    article={article}
                    access={access}
                    layoutKey={layoutKey}
                  />
                </div>
              </div>

              <ClassicPressDesk related={related} />
            </div>
          ) : isNewspaperLayout ? (
            <div className="newspaper-article-page py-6 px-3 sm:px-5 lg:px-8">
              <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-2 border-y-2 border-ink py-2">
                <span className="font-sans text-[0.62rem] font-black uppercase tracking-[0.26em] text-heritage">
                  Front Page Report
                </span>
                <span className="hidden font-sans text-[0.62rem] font-bold uppercase tracking-[0.26em] text-redacted sm:block">
                  {article.date} · {article.category} Desk
                </span>
              </div>

              <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-8 py-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.8fr)]">
                <div className="min-w-0">
                  <div className="max-w-5xl">
                    <div className="flex items-center gap-3">
                      <span className="category-label">{article.category}</span>
                      <span className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.2em] text-redacted">
                        Analysis | Today
                      </span>
                    </div>
                    <h1 className="mt-3 font-heading text-4xl font-black leading-[1.04] text-ink md:text-5xl lg:text-[3.8rem]">
                      {article.headline}
                    </h1>
                    <p className="mt-5 max-w-3xl border-l-4 border-ink pl-4 font-body text-lg leading-relaxed text-redacted lg:text-xl">
                      {article.summary}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-3 border-y border-stone-300/70 py-3">
                      {article.author ? (
                        <span className="font-sans text-sm font-bold uppercase tracking-wider text-ink">
                          By {article.author}
                        </span>
                      ) : null}
                      <span className="meta-text">{article.date}</span>
                      {article.readTime ? (
                        <span className="meta-text flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {article.readTime}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {article.image ? (
                    <figure className="mt-8">
                      <img
                        src={article.image}
                        alt={article.headline}
                        className="w-full border border-stone-300/60 object-cover"
                      />
                      <figcaption className="mt-2 border-b-2 border-ink/70 pb-2 meta-text italic">
                        Photo: {article.author || "Staff"} / Newspaper Desk
                      </figcaption>
                    </figure>
                  ) : null}

                  <div className="mt-10 grid grid-cols-1 gap-8">
                    <StoryBody
                      article={article}
                      access={access}
                      layoutKey={layoutKey}
                    />
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
                    The Magazine — {article.category} Desk
                  </span>
                </div>
                <div className="mt-10">
                  <div className="flex items-center gap-3">
                    <span className="bg-heritage px-2.5 py-1 font-sans text-[0.6rem] font-black uppercase tracking-[0.2em] text-paper">
                      The Big Read
                    </span>
                    <span className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.2em] text-redacted">
                      {article.date}
                    </span>
                  </div>
                  <h1 className="mt-4 font-heading text-5xl font-black leading-[1.02] text-ink md:text-6xl lg:text-7xl">
                    {article.headline}
                  </h1>
                  <p className="mt-6 max-w-[60ch] font-body text-xl italic leading-relaxed text-redacted lg:text-2xl">
                    {article.summary}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-stone-300/70 py-3">
                    {article.author ? (
                      <span className="font-sans text-sm font-bold uppercase tracking-wider text-ink">
                        By {article.author}
                      </span>
                    ) : null}
                    {article.readTime ? (
                      <span className="meta-text flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {article.readTime}
                      </span>
                    ) : null}
                  </div>
                </div>

                {article.image ? (
                  <figure className="mt-10">
                    <img
                      src={article.image}
                      alt={article.headline}
                      className="w-full object-cover shadow-[0_24px_50px_rgba(0,0,0,0.12)]"
                    />
                    <figcaption className="mt-3 border-l-2 border-heritage pl-3 meta-text italic">
                      Photo: {article.author || "Staff"} / The Magazine
                    </figcaption>
                  </figure>
                ) : null}

                <div className="mt-12">
                  <StoryBody
                    article={article}
                    access={access}
                    layoutKey={layoutKey}
                  />
                </div>
              </div>
            </div>
          ) : isTabloidLayout ? (
            <div className="tabloid-article-page">
              <div className="bg-ink px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-2 border-y-2 border-double border-heritage py-1">
                  <span className="font-sans text-[0.66rem] font-black uppercase tracking-[0.3em] text-paper">
                    {article.category} Express
                  </span>
                  <span className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.24em] text-paper/80">
                    {article.date} · Fast Despatch
                  </span>
                </div>
              </div>

              <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-8 px-3 py-8 sm:px-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.8fr)] lg:px-8">
                <div className="min-w-0">
                  <div className="border-y-4 border-double border-ink bg-[#efe3cd] px-4 py-5 text-center">
                    <span className="font-sans text-[0.6rem] font-black uppercase tracking-[0.3em] text-heritage">
                      Breaking · Top of the Hour
                    </span>
                    <h1 className="mt-2 font-sans text-[2rem] font-black uppercase leading-[0.98] tracking-[-0.01em] text-ink md:text-5xl lg:text-[3.4rem]">
                      {article.headline}
                    </h1>
                    <div className="mx-auto mt-4 flex max-w-lg flex-wrap items-center justify-center gap-3 border-t border-ink/40 pt-3">
                      {article.author ? (
                        <span className="font-sans text-sm font-black uppercase tracking-wider text-ink">
                          By {article.author}
                        </span>
                      ) : null}
                      {article.readTime ? (
                        <span className="meta-text flex items-center gap-1 font-black">
                          <Clock className="h-3 w-3" /> {article.readTime}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-6 border-l-8 border-heritage bg-paper px-4 py-4 shadow-[inset_0_0_0_1px_rgba(120,113,108,0.2)]">
                    <p className="font-sans text-lg font-bold leading-relaxed text-ink">
                      {article.summary}
                    </p>
                  </div>

                  {article.image ? (
                    <figure className="mt-8">
                      <img
                        src={article.image}
                        alt={article.headline}
                        className="w-full border-4 border-ink object-cover"
                      />
                      <figcaption className="mt-2 flex items-center justify-between gap-3 border-y-2 border-ink px-1 py-2">
                        <span className="meta-text italic">
                          Photo: {article.author || "Staff"} / Express Desk
                        </span>
                        <span className="hidden font-sans text-[0.58rem] font-black uppercase tracking-[0.2em] text-heritage sm:block">
                          Immediate
                        </span>
                      </figcaption>
                    </figure>
                  ) : null}

                  <div className="mt-10 grid grid-cols-1 gap-8">
                    <StoryBody
                      article={article}
                      access={access}
                      layoutKey={layoutKey}
                    />
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
                    Independent Dispatch — {article.category} Desk
                  </span>
                  <h2 className="mt-2 font-display text-4xl font-black tracking-tight text-ink md:text-5xl">
                    THE DISPATCH
                  </h2>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 border-b-2 border-ink pb-3 font-sans text-[0.62rem] font-bold uppercase tracking-[0.24em] text-redacted">
                  <span>Issue No. 07</span>
                  <span className="h-3 w-px bg-stone-400/70" />
                  <span>{article.date}</span>
                  {article.readTime ? (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {article.readTime}
                    </span>
                  ) : null}
                </div>

                <div className="mt-8">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-stone-300/70 bg-paper px-3 py-1 font-sans text-[0.6rem] font-bold uppercase tracking-[0.18em] text-heritage">
                      {article.category}
                    </span>
                    <span className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.2em] text-redacted">
                      The Read
                    </span>
                  </div>
                  <h1 className="mt-4 font-display text-4xl font-black leading-[1.05] text-ink md:text-5xl">
                    {article.headline}
                  </h1>
                  <p className="mt-5 border-l-4 border-heritage bg-vellum/70 px-4 py-3 font-body text-lg italic leading-relaxed text-redacted lg:text-xl">
                    {article.summary}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3 border-y border-stone-300/70 py-3">
                    {article.author ? (
                      <span className="font-sans text-sm font-bold uppercase tracking-wider text-ink">
                        By {article.author}
                      </span>
                    ) : null}
                    <span className="meta-text flex items-center gap-1">
                      <span className="text-heritage">✉</span> Delivered to {article.author || "readers"}
                    </span>
                  </div>
                </div>

                {article.image ? (
                  <figure className="mt-8 border border-stone-300/60 p-2">
                    <img
                      src={article.image}
                      alt={article.headline}
                      className="w-full object-cover"
                    />
                    <figcaption className="mt-2 px-1 pb-1 meta-text italic">
                      Photo: {article.author || "Staff"} / Dispatch
                    </figcaption>
                  </figure>
                ) : null}

                <div className="mt-10">
                  <StoryBody
                    article={article}
                    access={access}
                    layoutKey={layoutKey}
                  />
                </div>

                <div className="mt-12 border-2 border-dashed border-stone-300/70 bg-vellum/60 p-6 text-center">
                  <p className="font-display text-xl font-black text-ink">
                    Like this briefing?
                  </p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-redacted">
                    The Dispatch lands in your inbox every morning — top
                    headlines, context, and a full subscriber archive.
                  </p>
                  <Link
                    to="/subscribe/checkout"
                    className="mt-4 inline-block bg-heritage px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-ink"
                  >
                    Get The Dispatch
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="min-w-0 lg:border-r lg:pr-8 lg:border-stone-300/40">
                <div className="max-w-4xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="category-label">{article.category}</span>
                    <span
                      className={`rounded-full border px-2.5 py-1 font-sans text-[0.6rem] font-bold uppercase tracking-[0.14em] ${
                        access.key === "locked"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : access.key === "subscriber"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-stone-300 bg-vellum text-ink"
                      }`}
                    >
                      {access.shortLabel}
                    </span>
                  </div>
                  <h1 className="mt-3 font-display text-4xl font-black leading-[1.02] text-ink md:text-5xl lg:text-6xl">
                    {article.headline}
                  </h1>
                  <p className="mt-4 max-w-3xl border-l-4 border-heritage pl-4 font-body text-lg leading-relaxed text-redacted">
                    {article.summary}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3 border-y border-stone-300/50 py-3">
                    {article.author ? (
                      <span className="font-sans text-sm font-semibold uppercase tracking-wider text-ink">
                        By {article.author}
                      </span>
                    ) : null}
                    <span className="meta-text">{article.date}</span>
                    {article.readTime ? (
                      <span className="meta-text flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {article.readTime}
                      </span>
                    ) : null}
                  </div>
                </div>

                {article.image ? (
                  <figure className="mt-8">
                    <img
                      src={article.image}
                      alt={article.headline}
                      className="w-full border border-stone-300/50 object-cover shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
                    />
                    <figcaption className="meta-text mt-2 italic">
                      Photo: {article.author || "Staff"} / Newspaper Desk
                    </figcaption>
                  </figure>
                ) : null}

                <div className="mt-10 grid grid-cols-1 gap-8">
                  <StoryBody
                    article={article}
                    access={access}
                    layoutKey={layoutKey}
                  />
                </div>
              </div>

              <aside className="min-w-0 border-t border-stone-400/70 pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                <div className="sticky top-6 space-y-6">
                  <div className="border border-stone-300/60 bg-paper p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
                    <h2 className="font-display text-2xl font-black text-ink">
                      Related Stories
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

        <div className="mx-auto max-w-[1320px] border-t border-stone-400/70 px-3 py-8 sm:px-5 lg:px-8 lg:py-10">
          <div className="newspaper-rule-double mb-6" />
          <h2 className="mb-6 font-display text-3xl font-black uppercase text-ink">
            {isClassicLayout
            ? "More from this Edition"
            : isNewspaperLayout
              ? "More From Today's Paper"
              : isMagazineLayout
                ? "More From the Magazine"
                : isTabloidLayout
                  ? "More From the Express"
                  : isNewsletterLayout
                    ? "More From the Dispatch"
                    : "More From The Paper"}
          </h2>
          <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isClassicLayout ? "lg:gap-0 lg:divide-x lg:divide-stone-300/60" : "lg:gap-0 lg:divide-x lg:divide-stone-300/50"}`}>
            {related.map((item) => (
              <div key={item.id} className="first:lg:pl-0 last:lg:pr-0 lg:px-5">
                <NewsCard article={item} />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}