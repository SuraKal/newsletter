import React from "react";

const partners = [
  { name: "Google", slug: "google" },
  { name: "Microsoft", slug: "microsoft" },
  { name: "Stripe", slug: "stripe" },
  { name: "Mastercard", slug: "mastercard" },
  { name: "NVIDIA", slug: "nvidia" },
  { name: "Amazon", slug: "amazon" },
];

const repeatedPartners = [...partners, ...partners];

export default function TrustedPartnersSection() {
  return (
    <section className="bg-paper py-14">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 max-w-3xl">
          <span className="font-sans text-[0.6rem] font-bold uppercase tracking-[0.2em] text-heritage">
            Trusted Partners
          </span>
          <h2 className="mt-2 font-display text-3xl font-black text-ink md:text-4xl">
            Organizations that move with us
          </h2>
          <p className="mt-3 font-body text-base leading-relaxed text-redacted">
            A continuously moving strip of partner wordmarks keeps the section
            visible without interrupting the newspaper flow.
          </p>
        </div>

        <div className="partners-marquee overflow-hidden border-y border-stone-300/60 bg-vellum py-5">
          <div className="partners-marquee-track flex w-max items-center gap-4">
            {repeatedPartners.map((partner, index) => (
              <div
                key={`${partner.slug}-${index}`}
                className="flex h-16 min-w-[180px] items-center justify-center border border-stone-300/60 bg-paper px-6 shadow-sm"
              >
                <img
                  src={`https://cdn.simpleicons.org/${partner.slug}`}
                  alt={`${partner.name} logo`}
                  className="h-8 w-auto max-w-[140px] object-contain opacity-90 grayscale transition-opacity duration-300 hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
