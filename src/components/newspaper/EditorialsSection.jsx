import React from "react";
import { editorials } from "@/lib/demoData";
import SectionHeader from "@/components/newspaper/SectionHeader";
import NewsCard from "@/components/newspaper/NewsCard";

export default function EditorialsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <SectionHeader title="Opinion & Analysis" viewAllLink="/news" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-0 lg:grid-cols-3 lg:divide-x lg:divide-stone-300/50">
        {editorials.map((article) => (
          <div key={article.id} className="lg:px-5 first:lg:pl-0 last:lg:pr-0">
            <NewsCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
