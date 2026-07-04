import React from "react";
import { Link } from "react-router-dom";
import {
  heroArticle,
  sidebarArticles,
  rightColumnArticle,
} from "@/lib/demoData";
import NewsCard from "@/components/newspaper/NewsCard";

export default function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-12">
        <div className="hidden pr-4 lg:col-span-3 lg:block newspaper-rule-vertical">
          <div className="space-y-0">
            {sidebarArticles.map((article) => (
              <NewsCard key={article.id} article={article} variant="compact" />
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 lg:px-6">
          <Link to={`/article/${heroArticle.id}`} className="group block">
            <article>
              <span className="category-label">{heroArticle.category}</span>
              <div className="my-3 overflow-hidden">
                <img
                  src={heroArticle.image}
                  alt={heroArticle.headline}
                  className="editorial-image aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                />
              </div>
              <h2 className="font-display text-2xl font-black leading-tight text-ink transition-colors group-hover:text-heritage md:text-3xl lg:text-4xl">
                {heroArticle.headline}
              </h2>
              <p className="mt-3 font-body text-base leading-relaxed text-redacted">
                {heroArticle.summary}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="meta-text font-semibold">
                  By {heroArticle.author}
                </span>
                <span className="meta-text">·</span>
                <span className="meta-text">{heroArticle.date}</span>
                <span className="meta-text">·</span>
                <span className="meta-text">{heroArticle.readTime}</span>
              </div>
            </article>
          </Link>

          <div className="mt-6 flex flex-wrap gap-3 pb-6">
            <Link
              to="/subscriptions"
              className="hover-lift bg-heritage px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-ink"
            >
              Subscribe Now
            </Link>
            <Link
              to="/news"
              className="hover-lift border-2 border-ink px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Read Today's Edition
            </Link>
          </div>
        </div>

        <div className="hidden border-l border-stone-300/50 lg:col-span-3 lg:block lg:pl-4">
          <Link to={`/article/${rightColumnArticle.id}`} className="group block">
            <article className="section-sheen">
              <img
                src={rightColumnArticle.image}
                alt={rightColumnArticle.headline}
                className="editorial-image mb-3 aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
              />
              <span className="category-label">
                {rightColumnArticle.category}
              </span>
              <h3 className="mt-1.5 font-heading text-lg font-bold leading-snug text-ink transition-colors group-hover:text-heritage">
                {rightColumnArticle.headline}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-redacted">
                {rightColumnArticle.summary}
              </p>
              <p className="meta-text mt-2">By {rightColumnArticle.author}</p>
            </article>
          </Link>
        </div>
      </div>

      <div className="mt-6 border-t border-stone-300/30 pt-6 lg:hidden">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sidebarArticles.slice(0, 2).map((article) => (
            <NewsCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}
