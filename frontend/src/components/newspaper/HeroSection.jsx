import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getSyncedPublishedArticles,
} from "@/lib/content-store";
import NewsCard from "@/components/newspaper/NewsCard";
import { IMAGES } from "@/lib/constants";
import { useLanguage } from "@/lib/LanguageContext";
import { useStoreVersion } from "@/lib/store-bus";

const FRONT_PAGE_FALLBACK_IMAGES = [IMAGES.hero, IMAGES.politics, IMAGES.economy, IMAGES.culture];

export default function HeroSection() {
  useStoreVersion();
  const { t } = useLanguage();
  const [api, setApi] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) return undefined;
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  React.useEffect(() => {
    if (!api || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const interval = window.setInterval(() => {
      api.canScrollNext() ? api.scrollNext() : api.scrollTo(0);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [api]);

  const heroSlides = getSyncedPublishedArticles()
    .slice(0, 4)
    .map((article, index) => ({
      id: article.id,
      image: article.image || FRONT_PAGE_FALLBACK_IMAGES[index % FRONT_PAGE_FALLBACK_IMAGES.length],
      category: article.category || "News",
      headline: article.headline,
      summary: article.summary,
      cta: index === 0 ? "Read full coverage" : "Read the story",
      href: `/article/${article.id}`,
    }));
  const lowerStories = getSyncedPublishedArticles().slice(1, 3);
  const sidebarArticles = getSyncedPublishedArticles();

  if (!heroSlides.length) return null;

  return (
    <section className="mx-auto max-w-[1320px] px-3 py-3 sm:px-5 lg:px-8">
      <div className="newspaper-sheet relative border border-stone-400/60 p-3 sm:p-5 lg:p-6">
        <div className="mb-4 flex items-end justify-between border-b border-stone-400/70 pb-2">
          <div>
            <p className="category-label">{t("Today's Front Page")}</p>
            <p className="mt-1 font-body text-xs text-redacted">
              {t("Independent reporting, community stories, and practical access")}
            </p>
          </div>
          <p className="hidden font-sans text-[0.65rem] font-bold uppercase tracking-[0.2em] text-redacted sm:block">
            {t("Edition 01 · Vol. 12")}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6">
          <aside className="border-b border-stone-400/70 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
            <div className="mb-3 border-b border-stone-400/70 pb-3">
              <p className="category-label">{t("News Desk")}</p>
              <h2 className="mt-1 font-display text-xl font-black leading-tight text-ink">
                {t("Stories worth keeping")}
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {sidebarArticles.slice(0, 3).map((article) => (
                <NewsCard key={article.id} article={article} variant="compact" />
              ))}
            </div>
          </aside>

          <div className="min-w-0">
            <Carousel setApi={setApi} opts={{ loop: true }} className="group relative" aria-label="Homepage lead story carousel">
              <CarouselContent>
                {heroSlides.map((slide) => (
                  <CarouselItem key={slide.id}>
                    <Link to={slide.href} className="group block">
                      <article>
                        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_245px]">
                          <div>
                            <span className="category-label">{t(slide.category)}</span>
                            <h1 className="mt-2 line-clamp-3 font-display text-3xl font-black leading-[0.98] text-ink sm:text-4xl lg:text-5xl">
                              {t(slide.headline)}
                            </h1>
                            <p className="mt-2 font-heading text-sm font-semibold leading-snug text-heritage sm:text-base">
                              {t("Fresh reporting, clear context, and the stories shaping the week.")}
                            </p>
                          </div>
                          <div className="border-l-0 border-stone-400/70 bg-vellum/70 p-4 xl:border-l xl:pl-5">
                            <p className="category-label">{t("Editor's Note")}</p>
                            <p className="mt-2 line-clamp-6 font-body text-sm leading-relaxed text-redacted">
                              {t(slide.summary)}
                            </p>
                            <span className="mt-3 inline-flex font-sans text-[0.65rem] font-bold uppercase tracking-[0.16em] text-heritage">
                              {t(slide.cta)} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 overflow-hidden border-y border-stone-400/70 bg-stone-900">
                          <img src={slide.image} alt={t(slide.headline)} className="editorial-image aspect-[16/7] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                        </div>
                      </article>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="mt-3 flex items-center justify-between border-b border-stone-400/70 pb-3">
                <div className="flex items-center gap-2">
                  {heroSlides.map((slide, index) => (
                    <button key={slide.id} type="button" onClick={() => api?.scrollTo(index)} className={cn("h-1.5 transition-all duration-300", selectedIndex === index ? "w-8 bg-heritage" : "w-3 bg-stone-400/70")} aria-label={`Go to slide ${index + 1}`} />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <Button type="button" variant="outline" size="icon" className="h-8 w-8 rounded-none border-stone-400 bg-paper text-ink" onClick={() => api?.scrollPrev()} aria-label="Previous slide"><ArrowLeft className="h-3.5 w-3.5" /></Button>
                  <Button type="button" variant="outline" size="icon" className="h-8 w-8 rounded-none border-stone-400 bg-paper text-ink" onClick={() => api?.scrollNext()} aria-label="Next slide"><ArrowRight className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </Carousel>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {lowerStories.map((article) => (
                <Link key={article.id} to={`/article/${article.id}`} className="group border-t border-stone-400/70 pt-3">
                  <span className="category-label">{t(article.category)}</span>
                  <h3 className="mt-1 line-clamp-2 font-heading text-lg font-bold leading-tight text-ink group-hover:text-heritage">{t(article.headline)}</h3>
                  {article.image ? <img src={article.image} alt={t(article.headline)} className="editorial-image mt-3 aspect-[16/8] w-full object-cover" /> : null}
                  <p className="mt-2 line-clamp-2 font-body text-xs leading-relaxed text-redacted">{t(article.summary)}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
