import React from "react";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Globe2,
  LifeBuoy,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import { Link } from "react-router-dom";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import ScrollReveal from "@/components/newspaper/ScrollReveal";
import { IMAGES } from "@/lib/constants";

const stats = [
  { label: "Founded", value: "2024" },
  { label: "Biweekly editions", value: "104" },
  { label: "Countries reached", value: "30+" },
  { label: "Independent desks", value: "6" },
];

const values = [
  {
    icon: Compass,
    title: "Independence",
    desc: "We answer to our readers, not to advertisers or political interests. Editorial independence is the foundation of everything we publish.",
  },
  {
    icon: ShieldCheck,
    title: "Accuracy",
    desc: "Every fact is verified. Every source is vetted. We hold ourselves to the highest standards of journalistic rigor.",
  },
  {
    icon: BookOpen,
    title: "Depth",
    desc: "In an age of headlines, we invest in long-form reporting that reveals the full complexity of the stories that matter.",
  },
  {
    icon: Globe2,
    title: "Accessibility",
    desc: "Premium journalism should be available to everyone. We keep our pricing fair and our language clear.",
  },
];

const story = [
  "ንቐደም emerged from a simple but ambitious conviction: that readers deserve journalism that respects their intelligence, their time, and their trust.",
  "In a media landscape increasingly driven by clicks and algorithms, we chose a different path. We invested in experienced correspondents, rigorous fact-checking, and the kind of deep-dive reporting that takes weeks or months — not minutes.",
  "Today, ንቐደም reaches readers across the globe through our digital platform and biweekly print edition. We remain fiercely independent, funded entirely by our subscribers and guided by our commitment to the public interest.",
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

const pillars = [
  { icon: Sprout, title: "Reader funded", desc: "Subscribers, not advertisers, keep the newsroom running." },
  { icon: LifeBuoy, title: "Fact checked", desc: "A dedicated desk verifies every claim before it prints." },
  { icon: Compass, title: "No agenda", desc: "Reporting serves the public interest — nothing else." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-paper">
      <Masthead />

      {/* Hero */}
      <section className="relative overflow-hidden bg-night">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 18% 22%, rgba(196,151,114,0.16), transparent 38%), radial-gradient(circle at 82% 8%, rgba(196,151,114,0.10), transparent 34%), linear-gradient(150deg, #100E0B 0%, #1C1712 52%, #2A1F15 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(236,230,219,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(236,230,219,0.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
          <ScrollReveal effect="rise">
            <span className="font-sans text-[0.6rem] font-bold uppercase tracking-widest text-cream/50">
              About ንቐደም
            </span>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-black leading-tight text-cream md:text-5xl lg:text-6xl">
              The newspaper of record, built on trust and the public interest.
            </h1>
            <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-cream/65 sm:text-lg">
              Founded in 2024, ንቐደም was established with a singular mission:
              to deliver journalism of uncompromising quality in an era that
              demands it more than ever.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                to="/news"
                className="group inline-flex items-center justify-center gap-2 bg-cream px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-night transition-colors hover:bg-warmbeige"
              >
                Read the latest edition
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/subscriptions"
                className="inline-flex items-center justify-center border-2 border-cream/70 px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-cream transition-colors hover:border-cream hover:bg-cream hover:text-night"
              >
                Become a subscriber
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats band */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} effect="rise" delay={index * 40}>
              <article className="rounded-[1.15rem] border border-stone-300/60 bg-vellum p-6 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
                <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.22em] text-heritage">
                  {stat.label}
                </p>
                <h2 className="mt-3 font-heading text-2xl font-bold leading-tight text-ink md:text-3xl">
                  {stat.value}
                </h2>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <ScrollReveal effect="wipe">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -left-3 -top-3 h-full w-full rounded-[1.15rem] border border-heritage/25"
              />
              <img
                src={IMAGES.boardroom}
                alt="The ንቐደም newsroom"
                className="editorial-image relative aspect-[16/10] w-full rounded-[1.15rem] object-cover shadow-[0_24px_60px_-24px_rgba(76,43,8,0.32)]"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal effect="fade" delay={80}>
            <div>
              <span className="font-sans text-[0.6rem] font-bold uppercase tracking-widest text-heritage">
                Our story
              </span>
              <h2 className="mt-3 font-display text-3xl font-black leading-tight text-ink md:text-4xl">
                Journalism that respects the reader
              </h2>
              <div className="mt-6 space-y-4 font-body text-base leading-relaxed text-redacted">
                {story.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-vellum py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal effect="rise">
            <div className="mx-auto max-w-2xl text-center">
              <span className="font-sans text-[0.6rem] font-bold uppercase tracking-widest text-heritage">
                What we stand for
              </span>
              <h2 className="mt-3 font-display text-3xl font-black leading-tight text-ink md:text-4xl">
                Our values
              </h2>
              <p className="mt-4 font-body text-base leading-relaxed text-redacted">
                Four commitments shape every story we publish, every desk we
                staff, and every edition we roll off the press.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <ScrollReveal key={value.title} effect="rise" delay={index * 40}>
                  <article className="hover-lift h-full rounded-[1.15rem] border border-stone-300/60 bg-paper p-6 shadow-[0_12px_28px_rgba(0,0,0,0.04)]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-heritage/30 bg-vellum">
                      <Icon className="h-6 w-6 text-heritage" />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold text-ink">
                      {value.title}
                    </h3>
                    <p className="mt-3 font-body text-sm leading-relaxed text-redacted">
                      {value.desc}
                    </p>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <ScrollReveal effect="rise">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-sans text-[0.6rem] font-bold uppercase tracking-widest text-heritage">
              The masthead
            </span>
            <h2 className="mt-3 font-display text-3xl font-black leading-tight text-ink md:text-4xl">
              Leadership
            </h2>
            <p className="mt-4 font-body text-base leading-relaxed text-redacted">
              The editors who set the standard that every report in the paper is
              held to.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {team.map((member, index) => (
            <ScrollReveal key={member.name} effect="rise" delay={index * 60}>
              <article className="flex h-full flex-col items-center rounded-[1.15rem] border border-stone-300/60 bg-vellum p-8 text-center shadow-[0_12px_28px_rgba(0,0,0,0.04)]">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-heritage font-display text-2xl font-bold text-cream shadow-[0_12px_28px_-12px_rgba(76,43,8,0.5)]">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="mt-5 font-heading text-lg font-bold text-ink">
                  {member.name}
                </h3>
                <p className="mt-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-heritage">
                  {member.role}
                </p>
                <p className="mt-4 font-body text-sm leading-relaxed text-redacted">
                  {member.desc}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <ScrollReveal effect="fade">
          <div className="relative overflow-hidden rounded-[1.35rem] bg-night p-8 md:p-12">
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(236,230,219,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(236,230,219,0.5) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />
            <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div key={pillar.title} className="border-l border-cream/15 pl-5">
                    <Icon className="h-6 w-6 text-cream/70" />
                    <h3 className="mt-3 font-sans text-sm font-bold uppercase tracking-wider text-cream">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 font-body text-sm leading-relaxed text-cream/60">
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}