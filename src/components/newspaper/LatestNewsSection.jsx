import React from "react";
import SectionHeader from "@/components/newspaper/SectionHeader";
import NewsCard from "@/components/newspaper/NewsCard";
import { latestNews } from "@/lib/demoData";

export default function LatestNewsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <SectionHeader title="Latest News" viewAllLink="/news" />
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {latestNews.map((article) => (
          <div key={article.id} className="h-full">
            <NewsCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
