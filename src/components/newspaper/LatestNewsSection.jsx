import React from "react";
import SectionHeader from "@/components/newspaper/SectionHeader";
import NewsCard from "@/components/newspaper/NewsCard";
import { getLatestNews } from "@/lib/content-store";
import { useLanguage } from "@/lib/LanguageContext";

const accessToneClassMap = {
  subscriber: "bg-heritage text-paper",
  archive: "bg-stone-200 text-ink",
  public: "bg-vellum text-heritage border border-heritage/20",
};

const getAccessTone = (label) => {
  if (label.toLowerCase().includes("subscribers")) {
    return accessToneClassMap.subscriber;
  }

  if (label.toLowerCase().includes("public")) {
    return accessToneClassMap.public;
  }

  return accessToneClassMap.archive;
};

export default function LatestNewsSection() {
  const { t } = useLanguage();
  const latestNews = getLatestNews();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <SectionHeader title="Latest News" viewAllLink="/news" />
      <div className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {latestNews.map((article) => (
          <div key={article.id} className="h-full">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-redacted">
                {t(article.sector || article.category)}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-[0.62rem] font-sans font-bold uppercase tracking-[0.14em] ${getAccessTone(article.accessLabel || "Archive")}`}
              >
                {t(article.accessLabel || "Archive")}
              </span>
            </div>
            <NewsCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
