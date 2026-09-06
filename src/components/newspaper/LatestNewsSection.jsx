import React from "react";
import SectionHeader from "@/components/newspaper/SectionHeader";
import NewsCard from "@/components/newspaper/NewsCard";
import { homepageSectorBriefs, latestNews } from "@/lib/demoData";
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

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <SectionHeader title="Latest News" viewAllLink="/news" />
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {homepageSectorBriefs.map((brief) => (
          <article
            key={brief.title}
            className="rounded-[1rem] border border-stone-300/50 bg-vellum px-4 py-4"
          >
            <p className="category-label">{t(brief.title)}</p>
            <p className="mt-2 font-body text-sm leading-relaxed text-redacted">
              {t(brief.description)}
            </p>
          </article>
        ))}
      </div>

      <div className="rounded-[1.1rem] border border-stone-300/60 bg-paper p-4 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em] text-heritage">
            {t("Subscriber-first access")}
          </p>
          <p className="font-body text-sm text-redacted">
            {t("New stories open to subscribers now and move to the public archive after 30 days.")}
          </p>
        </div>
      </div>

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
            <p className="mt-3 font-body text-xs leading-relaxed text-redacted">
              {t("Public archive date")}: {t(article.publicAccessDate || article.date)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
