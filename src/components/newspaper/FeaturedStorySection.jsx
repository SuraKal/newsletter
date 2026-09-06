import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { featuredStory } from "@/lib/demoData";
import HeritageOrnament from "@/components/newspaper/HeritageOrnament";
import { useLanguage } from "@/lib/LanguageContext";

export default function FeaturedStorySection() {
  const { t } = useLanguage();

  return (
    <section className="bg-[#4A2A08] py-12 text-cream sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1320px] px-3 sm:px-5 lg:px-8">
        <div className="mb-8 flex items-center gap-4 sm:mb-10">
          <span className="h-px flex-1 bg-cream/25" />
          <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.3em] text-cream/65">
            {t("Editor's Selection")}
          </span>
          <span className="h-px flex-1 bg-cream/25" />
        </div>

        <article className="overflow-hidden border border-cream/20 bg-[#351d08] shadow-[0_28px_70px_rgba(0,0,0,0.2)]">
          <Link to={`/article/${featuredStory.id}`} className="group block">
            <div className="relative overflow-hidden border-b border-cream/20">
              <img
                src={featuredStory.image}
                alt={t(featuredStory.headline)}
                className="editorial-image aspect-[21/8] w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#351d08]/45 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 border border-cream/35 bg-[#4A2A08]/85 px-3 py-1.5 font-sans text-[0.62rem] font-bold uppercase tracking-[0.2em] text-cream backdrop-blur-sm sm:bottom-5 sm:left-6">
                {t(featuredStory.category)}
              </span>
            </div>

            <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(240px,0.65fr)] lg:gap-12 lg:p-10">
              <div>
                <h2 className="font-display text-3xl font-black leading-[1.02] text-cream transition-colors group-hover:text-white sm:text-4xl lg:text-5xl">
                  {t(featuredStory.headline)}
                </h2>
                <p className="mt-5 max-w-3xl font-body text-base leading-relaxed text-cream/75 sm:text-lg">
                  {t(featuredStory.summary)}
                </p>
              </div>

              <div className="flex flex-col justify-between border-t border-cream/20 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <div>
                  <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.22em] text-cream/45">
                    {t("Inside this edition")}
                  </p>
                  <p className="mt-3 font-heading text-xl font-bold leading-snug text-cream/90">
                    {t("A considered story for readers who want context, not noise.")}
                  </p>
                </div>
                <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-cream/20 pt-4">
                  <span className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-cream/65">
                    {t("By")} {t(featuredStory.author)} · {t(featuredStory.readTime)}
                  </span>
                  <span className="inline-flex items-center font-sans text-xs font-bold uppercase tracking-[0.16em] text-cream transition-colors group-hover:text-white">
                    {t("Read feature")} <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </article>

        <HeritageOrnament className="mx-auto mt-8 h-5 max-w-[520px] opacity-90" />
      </div>
    </section>
  );
}
