import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Bookmark, Clock, Share2 } from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import NewsCard from "@/components/newspaper/NewsCard";

import { useAuth } from "@/lib/AuthContext";
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

export default function ArticleDetail() {
  useStoreVersion();
  const { id } = useParams();
  const { user } = useAuth();
  const article = getArticleById(id) || getHeroArticle();
  const related = getPublicListingArticles()
    .filter((item) => item.id !== id)
    .slice(0, 3);
  const access = getArticleAccessState(
    article,
    hasActiveReaderSubscription(user),
  );
  const articleBody = article.body || [];

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

  const fallbackParagraphs = [
    "The newsroom continues to track the story as officials, residents, and stakeholders respond to the latest developments.",
    "Our correspondents are speaking with local voices and reviewing the full implications for families, businesses, and public services.",
  ];

  return (
    <div className="min-h-screen bg-paper newspaper-page">
      <Masthead />
      <main>
        <section className="mx-auto max-w-[1320px] px-3 pt-4 sm:px-5 lg:px-8">
          <div className="newspaper-rule-double mb-4" />
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-300/50 pb-4">
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
              <button
                className="p-2 transition-colors hover:text-heritage"
                aria-label="Share this story"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                className={`p-2 transition-colors ${
                  saved ? "text-heritage" : "hover:text-heritage"
                }`}
                aria-label={saved ? "Remove bookmark" : "Bookmark this story"}
                aria-pressed={saved}
                onClick={handleBookmark}
              >
                <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>
          </section>

        <article className="mx-auto grid max-w-[1320px] grid-cols-1 gap-6 px-3 py-6 sm:px-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.9fr)] lg:px-8 lg:py-8">
          <div className="min-w-0 lg:border-r lg:border-stone-300/40 lg:pr-8">
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
              <h1 className="mt-3 font-display text-4xl font-black leading-[1.05] text-ink md:text-5xl lg:text-6xl">
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
              <div className="font-body text-[1.05rem] leading-[1.95] text-ink">
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
                    <p className="mt-6 border-l-4 border-heritage bg-vellum px-4 py-3 font-display text-xl italic text-ink">
                      “The details matter, and the public deserves the full record.”
                    </p>
                    <p className="mt-6">
                      The article will continue to be updated as new information
                      becomes available, with editors placing emphasis on
                      verified sourcing and readable context rather than a
                      generic blog format.
                    </p>
                  </>
                ) : (
                  <div className="mt-8 rounded-[1.25rem] border border-dashed border-amber-300 bg-amber-50/75 p-6">
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

                <div className="mt-12 border-t-4 border-double border-stone-300/60 pt-8">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="font-display text-2xl font-black uppercase text-ink">
                      Reader Comments
                    </h2>
                    <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.22em] text-redacted">
                      {comments.length} Voices
                    </span>
                  </div>

                  <form className="mt-6 border border-stone-300/60 bg-vellum p-5">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-ink">
                      Leave a Comment
                    </label>
                    <textarea
                      rows={4}
                      placeholder={
                        access.canReadFull
                          ? "Share your thoughts on this story..."
                          : `Comments unlock with full access until ${access.publicAccessDate}.`
                      }
                      disabled={!access.canReadFull}
                      className="mt-3 w-full resize-none border border-stone-300/60 bg-paper p-3 font-body text-sm text-ink outline-none placeholder:text-redacted/60 focus:border-heritage disabled:cursor-not-allowed disabled:opacity-70"
                    />
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        disabled={!access.canReadFull}
                        className="bg-heritage px-5 py-3 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Post Comment
                      </button>
                    </div>
                  </form>

                  <div className="mt-6 space-y-4">
                    {comments.map((comment) => (
                      <article
                        key={comment.id}
                        className="border-b border-stone-300/50 pb-4 last:border-b-0 last:pb-0"
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
              </div>
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
                    <NewsCard key={item.id} article={item} />
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </article>

        <div className="mx-auto max-w-[1320px] border-t border-stone-400/70 px-3 py-8 sm:px-5 lg:px-8 lg:py-10">
          <div className="newspaper-rule-double mb-6" />
          <h2 className="mb-6 font-display text-2xl font-black uppercase text-ink">
            More From The Paper
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-stone-300/50">
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
