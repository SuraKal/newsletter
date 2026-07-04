import React from "react";
import { Link } from "react-router-dom";
import { featuredStory } from "@/lib/demoData";
import SectionHeader from "@/components/newspaper/SectionHeader";

export default function FeaturedStorySection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <SectionHeader title="Featured" />
      <Link to={`/article/${featuredStory.id}`} className="group block">
        <article className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="overflow-hidden">
            <img
              src={featuredStory.image}
              alt={featuredStory.headline}
              className="w-full aspect-[3/2] object-cover editorial-image group-hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="category-label">{featuredStory.category}</span>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-black text-ink leading-tight mt-2 group-hover:text-heritage transition-colors">
              {featuredStory.headline}
            </h2>
            <p className="font-body text-base text-redacted mt-4 leading-relaxed drop-cap">
              {featuredStory.summary}
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="meta-text font-semibold">
                By {featuredStory.author}
              </span>
              <span className="meta-text">·</span>
              <span className="meta-text">{featuredStory.date}</span>
              <span className="meta-text">·</span>
              <span className="meta-text">{featuredStory.readTime}</span>
            </div>
          </div>
        </article>
      </Link>
    </section>
  );
}
