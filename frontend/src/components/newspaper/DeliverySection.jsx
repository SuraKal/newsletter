import React from "react";
import { Link } from "react-router-dom";
import { IMAGES } from "@/lib/constants";
import { deliveryCoveragePoints } from "@/lib/demoData";
import { useLanguage } from "@/lib/LanguageContext";

export default function DeliverySection() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="category-label">{t("Print and Logistics")}</span>
          <h2 className="mt-2 font-display text-3xl font-black leading-tight text-ink md:text-4xl">
            {t("Track every print run from press to doorstep.")}
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {deliveryCoveragePoints.map((point) => (
              <article
                key={point.label}
                className="rounded-[1rem] border border-stone-300/50 bg-vellum px-4 py-4"
              >
                <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.22em] text-heritage">
                  {t(point.label)}
                </p>
                <p className="mt-2 font-heading text-base font-bold text-ink">
                  {t(point.value)}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/delivery"
              className="hover-lift inline-block bg-heritage px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-ink"
            >
              {t("Track Delivery")}
            </Link>
            <Link
              to="/subscriptions"
              className="hover-lift inline-block border-2 border-ink px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              {t("See Print Plans")}
            </Link>
          </div>
        </div>

        <div className="overflow-hidden">
          <img
            src={IMAGES.delivery}
            alt={t("Newspaper delivery and print operations")}
            className="editorial-image aspect-[16/9] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
