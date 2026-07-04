import React from "react";
import { Link } from "react-router-dom";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import NewsCard from "@/components/newspaper/NewsCard";
import SectionHeader from "@/components/newspaper/SectionHeader";
import {
  latestNews,
  editorials,
  sidebarArticles,
  heroArticle,
  categoryArticles,
} from "@/lib/demoData";

const allArticles = [
  heroArticle,
  ...sidebarArticles,
  ...latestNews,
  ...editorials,
  ...Object.values(categoryArticles).flat(),
];

export default function News() {
  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <SectionHeader title="All News" />

        {/* Lead Article */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <Link to={`/article/${heroArticle.id}`} className="group">
            <img
              src={heroArticle.image}
              alt={heroArticle.headline}
              className="w-full aspect-[16/9] object-cover editorial-image group-hover:scale-[1.01] transition-transform duration-500"
            />
          </Link>
          <div className="flex flex-col justify-center">
            <span className="category-label">{heroArticle.category}</span>
            <Link to={`/article/${heroArticle.id}`} className="group">
              <h2 className="font-display text-2xl md:text-3xl font-black text-ink leading-tight mt-2 group-hover:text-heritage transition-colors">
                {heroArticle.headline}
              </h2>
            </Link>
            <p className="font-body text-base text-redacted mt-3 leading-relaxed">
              {heroArticle.summary}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="meta-text font-semibold">
                By {heroArticle.author}
              </span>
              <span className="meta-text">·</span>
              <span className="meta-text">{heroArticle.date}</span>
            </div>
          </div>
        </div>

        <div className="newspaper-rule mb-8" />

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-stone-300/50">
          {allArticles.slice(1, 9).map((article) => (
            <div
              key={article.id}
              className="lg:px-5 first:lg:pl-0 last:lg:pr-0 mb-6"
            >
              <NewsCard article={article} />
            </div>
          ))}
        </div>

        <div className="newspaper-rule my-8" />

        {/* More articles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-0 lg:divide-x lg:divide-stone-300/50">
          {allArticles.slice(9).map((article) => (
            <div
              key={article.id}
              className="lg:px-5 first:lg:pl-0 last:lg:pr-0 mb-6"
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
