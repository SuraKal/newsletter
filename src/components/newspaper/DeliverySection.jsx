import React from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin, Package, Truck } from "lucide-react";
import { IMAGES } from "@/lib/constants";
import {
  deliveryCoveragePoints,
  deliveryJourney,
} from "@/lib/demoData";
import { useLanguage } from "@/lib/LanguageContext";

const iconMap = {
  Clock,
  Package,
  Truck,
  MapPin,
};

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

          <div className="mt-8 space-y-4">
            {deliveryJourney.map((step, index) => {
              const Icon = iconMap[step.icon];

              return (
                <div key={step.label} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-heritage">
                      <Icon className="h-4 w-4 text-heritage" />
                    </div>
                    {index < deliveryJourney.length - 1 ? (
                      <div className="h-6 w-px border-l border-dashed border-heritage/40" />
                    ) : null}
                  </div>
                  <div className="pt-1.5">
                    <div className="flex items-baseline gap-3">
                      <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-ink">
                        {t(step.label)}
                      </h4>
                      <span className="meta-text">{t(step.time)}</span>
                    </div>
                    <p className="mt-0.5 font-body text-sm text-redacted">
                      {t(step.desc)}
                    </p>
                  </div>
                </div>
              );
            })}
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
          <div className="mb-5 rounded-[1.1rem] border border-stone-300/60 bg-paper p-4 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
            <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.22em] text-heritage">
              {t("Delivery cadence")}
            </p>
            <p className="mt-2 font-body text-sm text-redacted">
              {t("Active print plans follow the same two-week newspaper cycle.")}
            </p>
          </div>
          <img
            src={IMAGES.delivery}
            alt="Newspaper delivery and print operations"
            className="editorial-image aspect-[16/9] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
