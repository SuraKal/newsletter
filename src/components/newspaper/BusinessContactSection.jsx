import React from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, Mail, Phone, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const contactCards = [
  {
    icon: Mail,
    title: "Business Email",
    detail: "business@neqedem.com",
    note: "Best for partnerships, sponsorships, and media kits.",
    href: "mailto:business@neqedem.com?subject=Business%20Inquiry",
    action: "Email the team",
  },
  {
    icon: Phone,
    title: "Business Phone",
    detail: "+44 (0) 20 7946 0958",
    note: "For urgent commercial requests and enterprise support.",
    href: "tel:+442079460958",
    action: "Call now",
  },
  {
    icon: Sparkles,
    title: "Business Request",
    detail: "Tell us about your organization and goals.",
    note: "We’ll route your request to the right commercial contact.",
    href: "/contact",
    action: "Open contact form",
  },
];

export default function BusinessContactSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-vellum py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 max-w-3xl">
          <div className="flex items-center gap-3">
            <BriefcaseBusiness className="h-5 w-5 text-heritage" />
            <h2 className="font-display text-2xl font-black uppercase text-ink md:text-3xl">
              {t("Dedicated Business Contact")}
            </h2>
          </div>
          <p className="mt-3 font-body text-base leading-relaxed text-redacted">
            {t("This section is for organizations that need advertising, bulk subscriptions, sponsorships, or partnership support. It sits alongside the main contact area so business inquiries have a clear dedicated path.")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {contactCards.map((card) => (
            <article
              key={card.title}
              className="border border-stone-300/70 bg-paper p-6 shadow-sm"
            >
              <card.icon className="h-5 w-5 text-heritage" />
              <h3 className="mt-4 font-sans text-xs font-bold uppercase tracking-widest text-ink">
                {t(card.title)}
              </h3>
              <p className="mt-3 font-display text-xl font-bold text-ink">
                {t(card.detail)}
              </p>
              <p className="mt-3 font-body text-sm leading-relaxed text-redacted">
                {t(card.note)}
              </p>
              {card.href.startsWith("http") ||
              card.href.startsWith("mailto:") ||
              card.href.startsWith("tel:") ? (
                <a
                  href={card.href}
                  className="hover-lift mt-5 inline-flex bg-heritage px-5 py-3 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-ink"
                >
                  {t(card.action)}
                </a>
              ) : (
                <Link
                  to={card.href}
                  className="hover-lift mt-5 inline-flex bg-heritage px-5 py-3 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-ink"
                >
                  {t(card.action)}
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
