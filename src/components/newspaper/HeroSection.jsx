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
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Column — Sidebar Headlines */}
        <div className="lg:col-span-3 newspaper-rule-vertical pr-4 hidden lg:block">
          <div className="space-y-0">
            {sidebarArticles.map((article, i) => (
              <NewsCard key={article.id} article={article} variant="compact" />
            ))}
          </div>
        </div>

        {/* Center Column — Lead Story */}
        <div className="lg:col-span-6 lg:px-6">
          <Link to={`/article/${heroArticle.id}`} className="group block">
            <article>
              <span className="category-label">{heroArticle.category}</span>
              <div className="overflow-hidden my-3">
                <img
                  src={heroArticle.image}
                  alt={heroArticle.headline}
                  className="w-full aspect-[16/9] object-cover editorial-image group-hover:scale-[1.01] transition-transform duration-700"
                />
              </div>
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-black text-ink leading-tight group-hover:text-heritage transition-colors">
                {heroArticle.headline}
              </h2>
              <p className="font-body text-base text-redacted mt-3 leading-relaxed">
                {heroArticle.summary}
              </p>
              <div className="flex items-center gap-2 mt-3">
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

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 pb-6">
            <Link
              to="/subscriptions"
              className="font-sans text-xs font-bold tracking-wider uppercase bg-heritage text-paper px-6 py-3 hover:bg-ink transition-colors"
            >
              Subscribe Now
            </Link>
            <Link
              to="/news"
              className="font-sans text-xs font-bold tracking-wider uppercase border-2 border-ink text-ink px-6 py-3 hover:bg-ink hover:text-paper transition-colors"
            >
              Read Today's Edition
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 lg:pl-4 lg:border-l border-stone-300/50 hidden lg:block">
          <Link
            to={`/article/${rightColumnArticle.id}`}
            className="group block"
          >
            <article>
              <img
                src={rightColumnArticle.image}
                alt={rightColumnArticle.headline}
                className="w-full aspect-[4/3] object-cover editorial-image mb-3"
              />
              <span className="category-label">
                {rightColumnArticle.category}
              </span>
              <h3 className="font-heading text-lg font-bold text-ink leading-snug mt-1.5 group-hover:text-heritage transition-colors">
                {rightColumnArticle.headline}
              </h3>
              <p className="font-body text-sm text-redacted mt-2 leading-relaxed">
                {rightColumnArticle.summary}
              </p>
              <p className="meta-text mt-2">By {rightColumnArticle.author}</p>
            </article>
          </Link>
        </div>
      </div>

      {/* Mobile: Show sidebar articles below */}
      <div className="lg:hidden mt-6 pt-6 border-t border-stone-300/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sidebarArticles.slice(0, 2).map((article) => (
            <NewsCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}
