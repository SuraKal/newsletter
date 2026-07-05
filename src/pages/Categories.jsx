import React from "react";
import PageWrapper from "@/components/nequdem/PageWrapper";
import { CATEGORIES, ARTICLES, IMAGES } from "@/lib/nequdem-data";
import NewsCard from "@/components/nequdem/NewsCard";
import SectionHeader from "@/components/nequdem/SectionHeader";
import { Link } from "react-router-dom";

export default function Categories() {
  const params = new URLSearchParams(window.location.search);
  const selectedCategory = params.get("category");

  if (selectedCategory) {
    const cat = CATEGORIES.find((c) => c.slug === selectedCategory);
    const articles = ARTICLES.filter(
      (a) => a.category.toLowerCase() === selectedCategory,
    );
    return (
      <PageWrapper>
        <div className="nq-container py-10">
          <div className="flex items-center gap-2 text-xs font-sans text-muted-foreground mb-8">
            <Link to="/" className="hover:text-heritage transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/categories"
              className="hover:text-heritage transition-colors"
            >
              Categories
            </Link>
            <span>/</span>
            <span className="text-heritage">
              {cat?.name || selectedCategory}
            </span>
          </div>
          <SectionHeader
            title={cat?.name || selectedCategory}
            subtitle={`Latest coverage in ${cat?.name || selectedCategory}`}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((a) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
          {articles.length === 0 && (
            <p className="font-sans text-sm text-muted-foreground text-center py-16">
              No articles in this category yet.
            </p>
          )}
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="nq-container py-10">
        <SectionHeader
          title="All Categories"
          subtitle="Explore our comprehensive coverage areas"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/categories?category=${cat.slug}`}
              className="group relative overflow-hidden h-56"
            >
              <img
                src={IMAGES[cat.image]}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-2xl font-bold text-parchment">
                  {cat.name}
                </h3>
                <p className="font-sans text-xs text-parchment/70 mt-1">
                  {
                    ARTICLES.filter(
                      (a) => a.category.toLowerCase() === cat.slug,
                    ).length
                  }{" "}
                  articles
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
