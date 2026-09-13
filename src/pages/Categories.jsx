import React from "react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import SectionHeader from "@/components/newspaper/SectionHeader";
import NewsCard from "@/components/newspaper/NewsCard";
import { CATEGORIES, IMAGES } from "@/lib/constants";
import { getCategoryArticles, getLatestNews } from "@/lib/content-store";

const categoryImages = {
  News: IMAGES.politics,
  Community: IMAGES.culture,
  Business: IMAGES.business,
  "Jobs & Marketplace": IMAGES.economy,
  Events: IMAGES.events,
  "Culture & Lifestyle": IMAGES.culture,
  Technology: IMAGES.technology,
  "Advice Corner": IMAGES.featured,
  "Serial Novels": IMAGES.featured,
  Other: IMAGES.hero,
};

const categoryGroups = [
  {
    title: "News",
    items: ["Local News", "International", "Community Updates"],
  },
  {
    title: "Community",
    items: [
      "Weddings & Love Stories",
      "Birth Announcements",
      "Graduations",
      "Memorials",
      "Success Stories",
      "Community Announcements",
      "Volunteer Opportunities",
    ],
  },
  {
    title: "Business",
    items: [
      "Business News",
      "Featured Businesses",
      "Entrepreneur Stories",
      "Investment",
      "Sponsored Businesses",
    ],
  },
  {
    title: "Jobs & Marketplace",
    items: [
      "Job Vacancies",
      "Businesses Hiring",
      "Buy & Sell",
      "Cars",
      "Houses & Apartments",
      "Services",
    ],
  },
  {
    title: "Events",
    items: [
      "Community Events",
      "Church Events",
      "Festivals",
      "Concerts",
      "Sports Events",
    ],
  },
  {
    title: "Culture & Lifestyle",
    items: ["Culture", "Food", "Health", "Travel", "Fashion", "Entertainment"],
  },
  {
    title: "Technology",
    items: ["AI", "Apps", "Mobile", "Business Technology", "Digital Tips"],
  },
  {
    title: "Advice Corner",
    items: [
      "Anonymous Stories",
      "Relationships",
      "Family",
      "Career Advice",
      "Immigration & Legal Tips",
      "Education",
    ],
  },
  {
    title: "Serial Novels",
    items: ["Romance", "Mystery", "Historical Fiction", "Children's Stories"],
  },
  {
    title: "Other",
    items: ["Announcements", "General Interest", "Archive Picks"],
  },
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CategoriesPage() {
  const params = new URLSearchParams(window.location.search);
  const selectedCat = params.get("cat");

  if (selectedCat) {
    const catName =
      CATEGORIES.find((c) => c.toLowerCase() === selectedCat.toLowerCase()) ||
      selectedCat;
    const categoryArticles = getCategoryArticles();
    const latestNews = getLatestNews();
    const articles = categoryArticles[selectedCat.toLowerCase()] || [];
    const extraArticles = latestNews.filter(
      (a) => a.category.toLowerCase() === selectedCat.toLowerCase(),
    );
    const allCatArticles = [...articles, ...extraArticles].filter(
      (article, index, list) =>
        list.findIndex((candidate) => candidate.id === article.id) === index,
    );

    return (
      <div className="min-h-screen bg-paper">
        <Masthead />
        <main className="mx-auto max-w-7xl px-4 py-8">
          <SectionHeader title={catName} />

          {allCatArticles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-stone-300/50">
              {allCatArticles.map((article) => (
                <div
                  key={article.id}
                  className="mb-6 first:lg:pl-0 last:lg:pr-0 lg:px-5"
                >
                  <NewsCard article={article} />
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-3xl rounded-[1rem] border border-stone-300/60 bg-vellum p-6">
              <p className="font-body text-redacted">
                No articles in this category yet.
              </p>
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <SectionHeader title="All Categories" />

        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((cat) => (
            <a
              key={cat}
              href={`/categories?cat=${slugify(cat)}`}
              className="group relative aspect-[4/3] overflow-hidden"
            >
              <img
                src={categoryImages[cat]}
                alt={cat}
                className="editorial-image h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-display text-xl font-bold text-paper">
                  {cat}
                </h3>
              </div>
            </a>
          ))}
        </div>

        <section className="mt-14">
          <div className="mb-8 max-w-3xl">
            <h2 className="font-display text-3xl font-black text-ink md:text-4xl">
              Browse subcategories
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {categoryGroups.map((group) => (
              <article
                key={group.title}
                className="border border-stone-300/60 bg-vellum p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-display text-2xl font-bold text-ink">
                    {group.title}
                  </h3>
                  <span className="font-sans text-[0.6rem] font-bold uppercase tracking-[0.2em] text-redacted">
                    {group.items.length} items
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  {group.items.map((item) => (
                    <a
                      key={item}
                      href={`/categories?cat=${slugify(group.title)}&sub=${slugify(item)}`}
                      className="inline-flex border border-stone-300/70 bg-paper px-3 py-2 font-sans text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-paper"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
