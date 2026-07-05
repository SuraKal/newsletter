import React, { useState } from "react";
import PageWrapper from "@/components/nequdem/PageWrapper";
import { ARTICLES, CATEGORIES } from "@/lib/nequdem-data";
import NewsCard from "@/components/nequdem/NewsCard";
import SectionHeader from "@/components/nequdem/SectionHeader";

export default function News() {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", ...CATEGORIES.map((c) => c.name)];
  const filtered =
    activeCategory === "All"
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === activeCategory);

  return (
    <PageWrapper>
      <div className="nq-container py-10">
        <SectionHeader
          title="All News"
          subtitle="Browse our complete coverage"
        />

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-sans font-semibold uppercase tracking-wider transition-colors ${
                activeCategory === cat
                  ? "bg-heritage text-parchment"
                  : "bg-transparent text-ink border border-rule hover:bg-vellum"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="font-sans text-sm text-muted-foreground">
              No articles found in this category.
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
