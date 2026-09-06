import React from "react";
import { Link } from "react-router-dom";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import NewsCard from "@/components/newspaper/NewsCard";
import SectionHeader from "@/components/newspaper/SectionHeader";
import HeritageOrnament from "@/components/newspaper/HeritageOrnament";
import { useAuth } from "@/lib/AuthContext";
import { hasActiveReaderSubscription } from "@/lib/reader-subscription";
import {
  latestNews,
  editorials,
  sidebarArticles,
  heroArticle,
  categoryArticles,
  getArticleAccessState,
} from "@/lib/demoData";

const allArticles = [
  heroArticle,
  ...sidebarArticles,
  ...latestNews,
  ...editorials,
  ...Object.values(categoryArticles).flat(),
];

export default function News() {
  const { user } = useAuth();
  const hasSubscriberAccess = hasActiveReaderSubscription(user);
  const heroAccess = getArticleAccessState(heroArticle, hasSubscriberAccess);

  return (
    <div className="min-h-screen bg-paper newspaper-page">
      <Masthead />
      <main className="mx-auto max-w-[1320px] px-3 py-3 sm:px-5 lg:px-8">
        <div className="newspaper-sheet border border-stone-400/60 p-3 sm:p-5 lg:p-6">
        <SectionHeader title="All News" />
        <HeritageOrnament className="mx-auto mb-6 h-5 max-w-[520px]" />

        <div className="grid grid-cols-1 gap-6 border-b border-stone-400/70 pb-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6">
          <div className="border-b border-stone-400/70 pb-5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
            <p className="category-label">News Desk</p>
            <h2 className="mt-2 font-display text-2xl font-black leading-tight text-ink">
              The stories shaping today’s edition
            </h2>
            <p className="mt-3 font-body text-sm leading-relaxed text-redacted">
              Follow the latest reporting across politics, business, sport, culture, and community life.
            </p>
            <Link to="/subscriptions" className="mt-5 inline-flex bg-heritage px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-paper hover:bg-ink">
              Read with access
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(240px,0.8fr)]">
          <Link to={`/article/${heroArticle.id}`} className="group">
            <img
              src={heroArticle.image}
              alt={heroArticle.headline}
              className="editorial-image w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
            />
          </Link>
          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-2">
              <span className="category-label">{heroArticle.category}</span>
              <span
                className={`rounded-full border px-2.5 py-1 font-sans text-[0.6rem] font-bold uppercase tracking-[0.14em] ${
                  heroAccess.key === "locked"
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : heroAccess.key === "subscriber"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-stone-300 bg-vellum text-ink"
                }`}
              >
                {heroAccess.shortLabel}
              </span>
            </div>
            <Link to={`/article/${heroArticle.id}`} className="group">
              <h2 className="mt-2 font-display text-2xl font-black leading-tight text-ink transition-colors group-hover:text-heritage md:text-3xl">
                {heroArticle.headline}
              </h2>
            </Link>
            <p className="mt-3 font-body text-base leading-relaxed text-redacted">
              {heroArticle.summary}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="meta-text font-semibold">By {heroArticle.author}</span>
              <span className="meta-text">·</span>
              <span className="meta-text">{heroArticle.date}</span>
            </div>
          </div>
          </div>
        </div>

        <div className="newspaper-rule mb-8 mt-10" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-stone-300/50">
          {allArticles.slice(1, 9).map((article) => (
            <div
              key={article.id}
              className="mb-6 first:lg:pl-0 last:lg:pr-0 lg:px-5"
            >
              <NewsCard article={article} />
            </div>
          ))}
        </div>

        <div className="newspaper-rule my-8" />

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-stone-300/50">
          {allArticles.slice(9).map((article) => (
            <div
              key={article.id}
              className="mb-6 first:lg:pl-0 last:lg:pr-0 lg:px-5"
            >
              <NewsCard article={article} />
            </div>
          ))}
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
