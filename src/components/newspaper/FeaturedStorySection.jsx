import React from "react";
import { Link } from "react-router-dom";
import { featuredStory } from "@/lib/demoData";
import SectionHeader from "@/components/newspaper/SectionHeader";

export default function FeaturedStorySection() {
  return (
    <section className="bg-heritage py-12 text-cream">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          title="Featured"
          titleClassName="text-cream"
          linkClassName="text-cream/75 hover:text-cream"
          ruleClassName="border-cream/40"
        />
        <Link to={`/article/${featuredStory.id}`} className="group block">
          <article className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="overflow-hidden rounded-sm">
              <img
                src={featuredStory.image}
                alt={featuredStory.headline}
                className="aspect-[3/2] w-full object-cover editorial-image transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-cream/70">
                {featuredStory.category}
              </span>
              <h2 className="mt-2 font-display text-2xl font-black leading-tight text-cream transition-colors group-hover:text-white md:text-3xl lg:text-4xl">
                {featuredStory.headline}
              </h2>
              <p className="drop-cap mt-4 font-body text-base leading-relaxed text-cream/80">
                {featuredStory.summary}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-cream/85">
                  By {featuredStory.author}
                </span>
                <span className="text-cream/45">·</span>
                <span className="font-sans text-xs uppercase tracking-[0.14em] text-cream/65">
                  {featuredStory.date}
                </span>
                <span className="text-cream/45">·</span>
                <span className="font-sans text-xs uppercase tracking-[0.14em] text-cream/65">
                  {featuredStory.readTime}
                </span>
              </div>
            </div>
          </article>
        </Link>
      </div>
    </section>
  );
}
