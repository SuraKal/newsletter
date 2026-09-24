import React from "react";
import { Link } from "react-router-dom";
import SectionHeader from "@/components/newspaper/SectionHeader";
import { useSyncedCategories } from "@/lib/category-store";
import { useLanguage } from "@/lib/LanguageContext";

export default function CategoriesSection() {
  const categories = useSyncedCategories();
  const { t } = useLanguage();

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <SectionHeader title="Categories" viewAllLink="/categories" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/categories?cat=${cat.label.toLowerCase()}`}
            className="hover-lift group relative aspect-[3/4] overflow-hidden"
          >
            <img
              src={cat.image}
              alt={t(cat.label)}
              className="w-full h-full object-cover editorial-image group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="font-sans text-xs font-extrabold tracking-widest uppercase text-paper">
                {t(cat.label)}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
