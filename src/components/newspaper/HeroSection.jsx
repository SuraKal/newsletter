import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  homepageHeroSlides,
  rightColumnArticle,
  sidebarArticles,
} from "@/lib/demoData";
import NewsCard from "@/components/newspaper/NewsCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();
  const [api, setApi] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return undefined;
    }

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  React.useEffect(() => {
    if (!api) {
      return undefined;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);

    return () => window.clearInterval(interval);
  }, [api]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-12 lg:gap-6 xl:gap-8">
        <div className="hidden lg:col-span-3 lg:block lg:pr-4 newspaper-rule-vertical">
          <div className="mb-5">
            <p className="category-label">{t("Top Stories")}</p>
            <h2 className="mt-2 font-display text-2xl font-black leading-tight text-ink">
              {t("Today's lead reporting")}
            </h2>
          </div>
          <div className="space-y-3">
            {sidebarArticles.map((article) => (
              <NewsCard key={article.id} article={article} variant="compact" />
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 lg:px-2 xl:px-4">
          <Carousel
            setApi={setApi}
            opts={{ loop: true }}
            className="group relative"
            aria-label="Homepage lead story carousel"
          >
            <CarouselContent>
              {homepageHeroSlides.map((slide) => (
                <CarouselItem key={slide.id}>
                  <Link to={slide.href} className="group block">
                    <article className="relative overflow-hidden rounded-none border border-stone-300/50 bg-stone-950 shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={slide.image}
                          alt={t(slide.headline)}
                          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
                      </div>

                      <div className="absolute inset-x-0 bottom-0 max-w-[86%] p-4 text-paper sm:max-w-[78%] sm:p-5 lg:max-w-[72%] lg:p-6">
                        <span className="inline-flex rounded-full border border-paper/20 bg-paper/10 px-2.5 py-1 font-sans text-[0.6rem] font-bold uppercase tracking-[0.16em] text-paper backdrop-blur-sm">
                          {t(slide.category)}
                        </span>
                        <h1 className="mt-2 overflow-hidden font-display text-lg font-black leading-tight text-paper [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:text-xl lg:text-2xl">
                          {t(slide.headline)}
                        </h1>
                        <p className="mt-1.5 max-w-xl overflow-hidden font-body text-[0.72rem] leading-relaxed text-paper/85 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:text-[0.8rem] lg:text-[0.88rem]">
                          {t(slide.summary)}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <span className="hover-lift inline-flex bg-paper px-3.5 py-2 font-sans text-[0.68rem] font-bold uppercase tracking-wider text-ink transition-colors hover:bg-heritage hover:text-paper">
                            {t(slide.cta)}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {homepageHeroSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => api?.scrollTo(index)}
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-300",
                      selectedIndex === index
                        ? "w-8 bg-heritage"
                        : "w-2.5 bg-stone-400/60 hover:bg-stone-600",
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-none border-stone-300 bg-paper text-ink hover:bg-ink hover:text-paper"
                  onClick={() => api?.scrollPrev()}
                  aria-label="Previous slide"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-none border-stone-300 bg-paper text-ink hover:bg-ink hover:text-paper"
                  onClick={() => api?.scrollNext()}
                  aria-label="Next slide"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Carousel>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/subscriptions"
              className="hover-lift bg-heritage px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-ink"
            >
              {t("Compare Plans")}
            </Link>
            <Link
              to="/delivery"
              className="hover-lift border-2 border-ink px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              {t("See Delivery Tracking")}
            </Link>
            <Link
              to="/business"
              className="hover-lift border border-stone-400 px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:border-ink hover:bg-paper"
            >
              {t("Business Ordering")}
            </Link>
          </div>
        </div>

        <div className="hidden border-l border-stone-300/50 lg:col-span-3 lg:block lg:pl-6">
          <Link to={`/article/${rightColumnArticle.id}`} className="group block">
            <article className="section-sheen">
              <img
                src={rightColumnArticle.image}
                alt={t(rightColumnArticle.headline)}
                className="editorial-image mb-4 aspect-[5/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
              />
              <span className="category-label">
                {t(rightColumnArticle.category)}
              </span>
              <h3 className="mt-2 font-heading text-lg font-bold leading-snug text-ink transition-colors group-hover:text-heritage">
                {t(rightColumnArticle.headline)}
              </h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-redacted">
                {t(rightColumnArticle.summary)}
              </p>
              <p className="meta-text mt-3">
                {t("By")} {t(rightColumnArticle.author)}
              </p>
            </article>
          </Link>
        </div>
      </div>

      <div className="mt-6 border-t border-stone-300/30 pt-6 lg:hidden">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sidebarArticles.slice(0, 2).map((article) => (
            <NewsCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}
