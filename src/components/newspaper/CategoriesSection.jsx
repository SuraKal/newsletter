import React from "react";
import { Link } from "react-router-dom";
import { IMAGES, CATEGORIES } from "@/lib/constants";
import SectionHeader from "@/components/newspaper/SectionHeader";

const categoryImages = {
  Politics: IMAGES.politics,
  Business: IMAGES.business,
  Economy: IMAGES.economy,
  Technology: IMAGES.technology,
  Sports: IMAGES.sports,
  Culture: IMAGES.culture,
  Events: IMAGES.events,
};

export default function CategoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <SectionHeader title="Categories" viewAllLink="/categories" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            to={`/categories?cat=${cat.toLowerCase()}`}
            className="hover-lift group relative aspect-[3/4] overflow-hidden"
          >
            <img
              src={categoryImages[cat]}
              alt={cat}
              className="w-full h-full object-cover editorial-image group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="font-sans text-xs font-extrabold tracking-widest uppercase text-paper">
                {cat}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
