import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { topSliderSlides } from "@/lib/demoData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";

export default function TopSlider() {
  const { t } = useLanguage();
  const [api, setApi] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [headerHeight, setHeaderHeight] = React.useState(0);

  React.useEffect(() => {
    const header = document.getElementById("masthead");
    if (!header) {
      return undefined;
    }

    const measure = () => {
      setHeaderHeight(header.offsetHeight);
    };

    measure();
    const frame = window.requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, []);

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
    <section
      className="mx-auto w-full overflow-hidden px-4 pt-2"
      style={{
        height: `calc(100vh - ${headerHeight}px)`,
        minHeight: `calc(100vh - ${headerHeight}px)`,
      }}
    >
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        className="group relative h-full"
        aria-label="Top stories carousel"
      >
        <CarouselContent viewportClassName="h-full" className="h-full">
          {topSliderSlides.map((slide) => (
            <CarouselItem key={slide.id} className="h-full">
              <Link to={slide.href} className="group block h-full">
                <article className="relative h-full overflow-hidden rounded-none border border-stone-300/50 bg-stone-950 shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
                  <img
                    src={slide.image}
                    alt={t(slide.headline)}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

                  <div className="relative z-10 flex h-full flex-col justify-end p-5 pb-20 sm:p-6 lg:p-8 sm:pb-24">
                    <div className="max-w-[86%] sm:max-w-[70%] lg:max-w-[60%]">
                      <span className="inline-flex rounded-full border border-paper/20 bg-paper/10 px-2.5 py-1 font-sans text-[0.6rem] font-bold uppercase tracking-[0.16em] text-paper backdrop-blur-sm">
                        {t(slide.category)}
                      </span>
                      <h1 className="mt-2 overflow-hidden font-display text-lg font-black leading-tight text-paper [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:text-xl lg:text-3xl">
                        {t(slide.headline)}
                      </h1>
                      <p className="mt-2 max-w-xl overflow-hidden font-body text-[0.72rem] leading-relaxed text-paper/85 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:text-[0.8rem] lg:text-[0.92rem]">
                        {t(slide.summary)}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="hover-lift inline-flex bg-paper px-4 py-2.5 font-sans text-[0.68rem] font-bold uppercase tracking-wider text-ink transition-colors hover:bg-heritage hover:text-paper">
                          {t(slide.cta)}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-4 pb-4 sm:px-6">
          <div className="flex items-center gap-2">
            {topSliderSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "pointer-events-auto h-2.5 rounded-full transition-all duration-300",
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
              className="pointer-events-auto h-10 w-10 rounded-none border-stone-300 bg-paper text-ink hover:bg-ink hover:text-paper"
              onClick={() => api?.scrollPrev()}
              aria-label="Previous slide"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="pointer-events-auto h-10 w-10 rounded-none border-stone-300 bg-paper text-ink hover:bg-ink hover:text-paper"
              onClick={() => api?.scrollNext()}
              aria-label="Next slide"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Carousel>
    </section>
  );
}