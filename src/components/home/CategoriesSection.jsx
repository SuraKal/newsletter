import React from "react";
import { Link } from "react-router-dom";
import { CATEGORIES, IMAGES } from "@/lib/nequdem-data";
import SectionHeader from "@/components/nequdem/SectionHeader";

export default function CategoriesSection() {
  return (
    <section className="nq-container py-12">
      <SectionHeader
        title="Explore Our Coverage"
        subtitle="In-depth reporting across every domain"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            to={`/categories?category=${cat.slug}`}
            className="group relative overflow-hidden h-48 md:h-56 rounded-2xl"
          >
            <img
              src={IMAGES[cat.image]}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-display text-lg md:text-xl font-bold text-parchment">
                {cat.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
