import React from "react";
import { ARTICLES } from "@/lib/nequdem-data";
import NewsCard from "@/components/nequdem/NewsCard";
import SectionHeader from "@/components/nequdem/SectionHeader";

export default function LatestNewsSection() {
  const newsItems = ARTICLES.slice(1, 7);

  return (
    <section className="nq-container py-12">
      <SectionHeader
        title="Latest News"
        subtitle="Today's most important stories from around the world"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newsItems.map((article) => (
          <div
            key={article.id}
            className="pb-8 border-b border-rule last:border-b-0 lg:border-b-0 lg:pb-0"
          >
            <NewsCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
