import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Bookmark, Share2 } from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import {
  ArticleLayoutSwitcher,
  ArticleLayoutView,
  ArticleMoreFromSection,
} from "@/components/newspaper/ArticleTemplateView";

import { useAuth } from "@/lib/AuthContext";
import { appClient } from "@/api/appClient";
import { hasActiveReaderSubscription } from "@/lib/reader-subscription";
import { getArticleById, getHeroArticle, getPublicListingArticles, registerArticleClick } from "@/lib/content-store";
import {
  isArticleSaved,
  recordArticleShare,
  recordArticleView,
  toggleArticleSaved,
} from "@/lib/reading-history";
import { getArticleAccessState } from "@/lib/demoData";
import { getCategoryTemplate } from "@/lib/category-store";
import { isValidArticleTemplate } from "@/lib/article-templates";
import { useStoreVersion } from "@/lib/store-bus";

export default function ArticleDetail() {
  useStoreVersion();
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const article = getArticleById(id) || getHeroArticle();
  const layout = new URLSearchParams(location.search).get("layout");
  const categoryTemplate = getCategoryTemplate(article?.category);
  const layoutKey = isValidArticleTemplate(layout) ? layout : categoryTemplate;

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
      appClient.articles.recordView(article.id);
      appClient.reader
        .recordHistoryEvent({
          articleId: article.id,
          title: article.headline || article.title || "",
          category: article.category || "",
          action: "view",
        })
        .catch(() => {});
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
    appClient.reader
      .recordHistoryEvent({
        articleId: article.id,
        title: article.headline || article.title || "",
        category: article.category || "",
        action: "share",
      })
      .catch(() => {});

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
    appClient.reader
      .recordHistoryEvent({
        articleId: article.id,
        title: article.headline || article.title || "",
        category: article.category || "",
        action: "toggle_save",
      })
      .catch(() => {});
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
              <ArticleLayoutSwitcher layoutKey={layoutKey} options={layoutOptions} />
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

        <ArticleLayoutView
          article={article}
          access={access}
          related={related}
          layoutKey={layoutKey}
        />

        <ArticleMoreFromSection layoutKey={layoutKey} related={related} />
      </main>
      <Footer />
    </div>
  );
}