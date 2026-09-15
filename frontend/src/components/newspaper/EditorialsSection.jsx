import React from "react";
import { getEditorials } from "@/lib/content-store";
import SectionHeader from "@/components/newspaper/SectionHeader";
import NewsCard from "@/components/newspaper/NewsCard";
import { useStoreVersion } from "@/lib/store-bus";

export default function EditorialsSection() {
  useStoreVersion();
  const editorials = getEditorials();
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
