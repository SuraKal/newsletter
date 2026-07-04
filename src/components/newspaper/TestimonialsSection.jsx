import React from "react";
import { testimonials } from "@/lib/demoData";
import SectionHeader from "@/components/newspaper/SectionHeader";

export default function TestimonialsSection() {
  return (
    <section className="bg-heritage py-16 text-cream">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          title="What Readers Say"
          titleClassName="text-cream"
          linkClassName="text-cream/75 hover:text-cream"
          ruleClassName="border-cream/40"
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-cream/15">
          {testimonials.map((t) => (
            <div key={t.name} className="lg:px-8 first:lg:pl-0 last:lg:pr-0">
              <blockquote className="rounded-[1.25rem] border border-cream/10 bg-white/[0.03] p-6 lg:border-0 lg:bg-transparent lg:p-0">
                <p className="font-body text-base italic leading-relaxed text-cream/85">
                  "{t.quote}"
                </p>
                <footer className="mt-4">
                  <p className="font-sans text-sm font-bold text-cream">
                    {t.name}
                  </p>
                  <p className="font-sans text-[0.7rem] uppercase tracking-[0.14em] text-cream/60">
                    {t.role}
                  </p>
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
