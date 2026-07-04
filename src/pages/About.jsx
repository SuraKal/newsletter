import React from "react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import { IMAGES } from "@/lib/constants";

const values = [
  {
    title: "Independence",
    desc: "We answer to our readers, not to advertisers or political interests. Editorial independence is the foundation of everything we publish.",
  },
  {
    title: "Accuracy",
    desc: "Every fact is verified. Every source is vetted. We hold ourselves to the highest standards of journalistic rigor.",
  },
  {
    title: "Depth",
    desc: "In an age of headlines, we invest in long-form reporting that reveals the full complexity of the stories that matter.",
  },
  {
    title: "Accessibility",
    desc: "Premium journalism should be available to everyone. We keep our pricing fair and our language clear.",
  },
];

const team = [
  {
    name: "Katherine Price",
    role: "Editor-in-Chief",
    desc: "Former senior editor at The Financial Times with 25 years in investigative journalism.",
  },
  {
    name: "Marcus Chen",
    role: "Managing Editor",
    desc: "Award-winning journalist and former bureau chief covering Asia-Pacific affairs.",
  },
  {
    name: "Dr. Amara Osei",
    role: "Head of Analysis",
    desc: "Political scientist and columnist whose work has appeared in leading international publications.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main>
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 py-16 text-center">
          <span className="category-label">About</span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-ink leading-tight mt-3">
            The Newspaper of Record
          </h1>
          <p className="font-body text-lg text-redacted mt-4 max-w-2xl mx-auto leading-relaxed">
            Founded in 2024, ንቐደም was established with a singular mission: to
            deliver journalism of uncompromising quality in an era that demands
            it more than ever.
          </p>
        </section>

        {/* Story */}
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <img
              src={IMAGES.delivery}
              alt="The ንቐደም newsroom"
              className="w-full aspect-[16/9] object-cover editorial-image"
            />
            <div>
              <h2 className="font-display text-3xl font-black text-ink">
                Our Story
              </h2>
              <div className="font-body text-base text-redacted mt-4 leading-relaxed space-y-4">
                <p>
                  ንቐደም emerged from a simple but ambitious conviction: that
                  readers deserve journalism that respects their intelligence,
                  their time, and their trust.
                </p>
                <p>
                  In a media landscape increasingly driven by clicks and
                  algorithms, we chose a different path. We invested in
                  experienced correspondents, rigorous fact-checking, and the
                  kind of deep-dive reporting that takes weeks or months — not
                  minutes.
                </p>
                <p>
                  Today, ንቐደም reaches readers across the globe through our
                  digital platform and biweekly print edition. We remain
                  fiercely independent, funded entirely by our subscribers and
                  guided by our commitment to the public interest.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-vellum py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-display text-3xl font-black text-ink text-center mb-12">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((v) => (
                <div key={v.title} className="text-center">
                  <h3 className="font-display text-xl font-bold text-heritage">
                    {v.title}
                  </h3>
                  <p className="font-body text-sm text-redacted mt-3 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="font-display text-3xl font-black text-ink text-center mb-12">
            Leadership
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((t) => (
              <div key={t.name} className="text-center">
                <div className="w-24 h-24 rounded-full bg-warmbeige mx-auto mb-4 flex items-center justify-center">
                  <span className="font-display text-2xl font-bold text-heritage">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-ink">
                  {t.name}
                </h3>
                <p className="font-sans text-xs font-semibold tracking-wider uppercase text-heritage mt-1">
                  {t.role}
                </p>
                <p className="font-body text-sm text-redacted mt-2 leading-relaxed">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
