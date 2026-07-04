import React from "react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import SectionHeader from "@/components/newspaper/SectionHeader";
import NewsCard from "@/components/newspaper/NewsCard";
import { CATEGORIES, IMAGES } from "@/lib/constants";
import { categoryArticles, latestNews } from "@/lib/demoData";

const categoryImages = {
  Politics: IMAGES.politics,
  Business: IMAGES.business,
  Economy: IMAGES.economy,
  Technology: IMAGES.technology,
  Sports: IMAGES.sports,
  Culture: IMAGES.culture,
  Events: IMAGES.events,
};

export default function CategoriesPage() {
  const params = new URLSearchParams(window.location.search);
  const selectedCat = params.get("cat");

  if (selectedCat) {
    const catName =
      CATEGORIES.find((c) => c.toLowerCase() === selectedCat.toLowerCase()) ||
      selectedCat;
    const articles = categoryArticles[selectedCat.toLowerCase()] || [];
    const extraArticles = latestNews.filter(
      (a) => a.category.toLowerCase() === selectedCat.toLowerCase(),
    );
    const allCatArticles = [...articles, ...extraArticles];

    return (
      <div className="min-h-screen bg-paper">
        <Masthead />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <SectionHeader title={catName} />
          {allCatArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-0 lg:divide-x lg:divide-stone-300/50">
              {allCatArticles.map((article) => (
                <div
                  key={article.id}
                  className="lg:px-5 first:lg:pl-0 last:lg:pr-0 mb-6"
                >
                  <NewsCard article={article} />
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body text-redacted">
              No articles in this category yet.
            </p>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <SectionHeader title="All Categories" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat) => (
            <a
              key={cat}
              href={`/categories?cat=${cat.toLowerCase()}`}
              className="group relative overflow-hidden aspect-[4/3]"
            >
              <img
                src={categoryImages[cat]}
                alt={cat}
                className="w-full h-full object-cover editorial-image group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-display text-xl font-bold text-paper">
                  {cat}
                </h3>
                <p className="font-sans text-xs text-paper/60 mt-1 tracking-wider uppercase">
                  {(categoryArticles[cat.toLowerCase()] || []).length +
                    latestNews.filter((a) => a.category === cat).length}{" "}
                  articles
                </p>
              </div>
            </a>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
