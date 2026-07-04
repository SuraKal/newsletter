import React from "react";
import SectionHeader from "@/components/newspaper/SectionHeader";
import NewsCard from "@/components/newspaper/NewsCard";
import { latestNews } from "@/lib/demoData";

export default function LatestNewsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <SectionHeader title="Latest News" viewAllLink="/news" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-stone-300/50">
        {latestNews.map((article) => (
          <div key={article.id} className="lg:px-5 first:lg:pl-0 last:lg:pr-0">
            <NewsCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
