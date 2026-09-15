import React from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  FileText,
  Mail,
  MapPinned,
} from "lucide-react";
import { businessContactCards } from "@/lib/demoData";

const iconMap = {
  "Commercial email": Mail,
  "Billing desk": FileText,
  "Business intake": MapPinned,
};

export default function BusinessContactSection() {
  return (
    <section className="bg-vellum py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 max-w-2xl">
          <div className="flex items-center gap-3">
            <BriefcaseBusiness className="h-5 w-5 text-heritage" />
            <h2 className="font-display text-2xl font-black uppercase text-ink md:text-3xl">
              Dedicated Business Contact
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {businessContactCards.map((card) => {
            const Icon = iconMap[card.title] || Mail;
            const isExternal =
              card.href.startsWith("http") ||
              card.href.startsWith("mailto:") ||
              card.href.startsWith("tel:");

            return (
              <article
                key={card.title}
                className="border border-stone-300/70 bg-paper p-6 shadow-sm"
              >
                <Icon className="h-5 w-5 text-heritage" />
                <h3 className="mt-4 font-sans text-xs font-bold uppercase tracking-widest text-ink">
                  {card.title}
                </h3>
                <p className="mt-3 font-display text-xl font-bold text-ink">
                  {card.detail}
                </p>
                <p className="mt-3 font-body text-sm leading-relaxed text-redacted">
                  {card.note}
                </p>
                {isExternal ? (
                  <a
                    href={card.href}
                    className="hover-lift mt-5 inline-flex bg-heritage px-5 py-3 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-ink"
                  >
                    {card.action}
                  </a>
                ) : (
                  <Link
                    to={card.href}
                    className="hover-lift mt-5 inline-flex bg-heritage px-5 py-3 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-ink"
                  >
                    {card.action}
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
