import React from "react";
import { testimonials } from "@/lib/demoData";
import SectionHeader from "@/components/newspaper/SectionHeader";

export default function TestimonialsSection() {
  return (
    <section className="bg-vellum py-16">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader title="What Readers Say" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-0 lg:divide-x lg:divide-stone-300/50">
          {testimonials.map((t) => (
            <div key={t.name} className="lg:px-8 first:lg:pl-0 last:lg:pr-0">
              <blockquote>
                <p className="font-body text-base text-ink leading-relaxed italic">
                  "{t.quote}"
                </p>
                <footer className="mt-4">
                  <p className="font-sans text-sm font-bold text-ink">
                    {t.name}
                  </p>
                  <p className="meta-text">{t.role}</p>
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
