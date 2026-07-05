import React from "react";
import { TESTIMONIALS, IMAGES } from "@/lib/nequdem-data";
import SectionHeader from "@/components/nequdem/SectionHeader";
import { Quote } from "lucide-react";

export default function TestimonialsSection() {
  return (
    <section className="nq-container py-16">
      <SectionHeader
        title="What Our Readers Say"
        subtitle="Trusted by industry leaders and discerning readers worldwide"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.name}
            className="border border-rule p-8 rounded-2xl nq-parchment"
          >
            <Quote className="w-6 h-6 text-heritage/30 mb-4" />
            <p className="font-body text-base text-ink/80 leading-relaxed italic">
              "{t.quote}"
            </p>
            <div className="flex items-center gap-3 mt-6">
              <img
                src={IMAGES[t.image]}
                alt={t.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-sans text-sm font-semibold text-ink">
                  {t.name}
                </h4>
                <p className="font-sans text-xs text-muted-foreground">
                  {t.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
