import React from "react";
import { Link } from "react-router-dom";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import NewsCard from "@/components/newspaper/NewsCard";
import SectionHeader from "@/components/newspaper/SectionHeader";
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
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <SectionHeader title="All News" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
      </main>
      <Footer />
    </div>
  );
}
