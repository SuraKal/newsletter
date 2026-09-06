import React from "react";
import { Link } from "react-router-dom";
import { FileText, MapPinned, ReceiptText, Users } from "lucide-react";
import { IMAGES } from "@/lib/constants";
import {
  businessBenefits,
  businessHighlights,
} from "@/lib/demoData";
import { useLanguage } from "@/lib/LanguageContext";

const iconMap = {
  "Bulk copy management": FileText,
  "Volume-based pricing": ReceiptText,
  "Consolidated invoicing": Users,
  "Multi-location tracking": MapPinned,
};

export default function BusinessSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-night py-16 text-cream">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="order-2 overflow-hidden lg:order-1">
            <div className="mb-5 grid gap-3 sm:grid-cols-3">
              {businessHighlights.map((item) => (
                <article
                  key={item.label}
                  className="rounded-[1rem] border border-cream/15 bg-cream/5 px-4 py-4 backdrop-blur-sm"
                >
                  <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.2em] text-cream/45">
                    {t(item.label)}
                  </p>
                  <p className="mt-2 font-heading text-base font-bold text-cream">
                    {t(item.value)}
                  </p>
                </article>
              ))}
            </div>
            <img
              src={IMAGES.boardroom}
              alt="Business team reviewing printed newspaper delivery plans"
              className="aspect-[16/9] w-full object-cover opacity-80"
            />
          </div>

          <div className="order-1 lg:order-2">
            <span className="font-sans text-[0.6rem] font-bold uppercase tracking-widest text-cream/40">
              {t("For Organizations")}
            </span>
            <h2 className="mt-2 font-display text-3xl font-black leading-tight text-cream md:text-4xl">
              {t("Business subscriptions built for teams.")}
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {businessBenefits.map((benefit) => {
                const Icon = iconMap[benefit.title] || FileText;

                return (
                  <div key={benefit.title}>
                    <Icon className="mb-2 h-5 w-5 text-heritage" />
                    <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-cream">
                      {t(benefit.title)}
                    </h4>
                    <p className="mt-1 font-body text-sm text-cream/60">
                      {t(benefit.desc)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/business"
                className="inline-block border-2 border-cream px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-cream transition-colors hover:bg-cream hover:text-night"
              >
                {t("View Business Offer")}
              </Link>
              <Link
                to="/contact"
                className="inline-block bg-heritage px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-cream hover:text-night"
              >
                {t("Talk to Sales")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
