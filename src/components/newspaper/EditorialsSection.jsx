import React from "react";
import { editorials } from "@/lib/demoData";
import SectionHeader from "@/components/newspaper/SectionHeader";
import NewsCard from "@/components/newspaper/NewsCard";

export default function EditorialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <SectionHeader title="Opinion & Analysis" viewAllLink="/news" />
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {editorials.map((article) => (
          <div key={article.id} className="h-full">
            <NewsCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
