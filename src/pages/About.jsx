import React from "react";
import PageWrapper from "@/components/nequdem/PageWrapper";
import { IMAGES } from "@/lib/nequdem-data";
import { Award, Globe, Users, Newspaper } from "lucide-react";

export default function About() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="nq-container py-16">
        <div className="max-w-3xl">
          <span className="nq-category-label">About Nequdem</span>
          <h1 className="nq-headline text-3xl md:text-5xl mt-4">
            The Standard of Distinguished Journalism Since 1897
          </h1>
          <p className="nq-deck mt-4 text-base leading-relaxed">
            For over a century, Nequdem has set the benchmark for rigorous,
            independent journalism. From our founding in a modest printing house
            to our position as a globally distributed publication, we remain
            committed to the principle that informed citizens are the foundation
            of a functioning democracy.
          </p>
        </div>
      </section>

      {/* Full-width image */}
      <div className="nq-container pb-16">
        <img
          src={IMAGES.about}
          alt="Nequdem newsroom"
          className="w-full h-64 md:h-96 object-cover"
        />
      </div>

      {/* Mission */}
      <section className="nq-vellum py-16">
        <div className="nq-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="nq-headline text-2xl md:text-3xl">Our Mission</h2>
              <div className="mt-6 space-y-4 text-base text-ink/80 leading-relaxed">
                <p>
                  We believe that journalism is not merely a profession but a
                  public trust. Every article we publish, every investigation we
                  undertake, and every opinion we platform is measured against
                  the question: does this serve the reader's need to understand
                  the world?
                </p>
                <p>
                  In an age of information overload, Nequdem's editors exercise
                  the discipline of selection — choosing not what generates the
                  most clicks, but what carries the most consequence. This
                  editorial philosophy extends from our digital platform to our
                  biweekly print edition, which we consider a curated artifact
                  of contemporary history.
                </p>
              </div>
            </div>
            <div>
              <h2 className="nq-headline text-2xl md:text-3xl">Our Values</h2>
              <div className="mt-6 space-y-6">
                {[
                  {
                    title: "Independence",
                    desc: "Our editorial decisions are never influenced by commercial interests, political pressure, or audience metrics.",
                  },
                  {
                    title: "Accuracy",
                    desc: "Every fact is verified. Every source is vetted. We correct errors publicly and promptly.",
                  },
                  {
                    title: "Depth",
                    desc: "We invest in long-form journalism because understanding requires context, nuance, and patience.",
                  },
                  {
                    title: "Accountability",
                    desc: "We hold the powerful to account and subject ourselves to the same scrutiny we apply to others.",
                  },
                ].map(({ title, desc }) => (
                  <div key={title}>
                    <h4 className="font-sans text-sm font-bold text-heritage uppercase tracking-wider">
                      {title}
                    </h4>
                    <p className="font-sans text-sm text-ink/80 mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="nq-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: Newspaper, value: "129", label: "Years of Publishing" },
            { icon: Globe, value: "42", label: "Countries Served" },
            { icon: Users, value: "2.4M", label: "Active Subscribers" },
            { icon: Award, value: "67", label: "Journalism Awards" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label}>
              <Icon className="w-8 h-8 text-heritage mx-auto mb-3" />
              <div className="font-display text-3xl md:text-4xl font-bold text-ink">
                {value}
              </div>
              <div className="font-sans text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
