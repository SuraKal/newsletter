import React from "react";
import { ArrowRight, BookOpen, Globe2, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import ScrollReveal from "@/components/newspaper/ScrollReveal";
import { IMAGES } from "@/lib/constants";
import { useLanguage } from "@/lib/LanguageContext";

const stats = [
  { label: "Reader access", value: "Digital + print" },
  { label: "Print cadence", value: "Every two weeks" },
  { label: "Company workflow", value: "Licence approval" },
  { label: "Delivery", value: "Saved locations" },
];

const values = [
  { icon: Globe2, title: "Bilingual publishing", desc: "Editors can publish English and Tigrinya versions of the same article." },
  { icon: ShieldCheck, title: "Managed access", desc: "Reader subscriptions and approved company licences control the relevant workspace." },
  { icon: Truck, title: "Delivery ready", desc: "Saved delivery locations support reader and company shipment operations." },
  { icon: BookOpen, title: "Editorial control", desc: "Subscriber-only articles can be released publicly on an editor-selected date." },
];

const story = [
  "ንቐደም is a bilingual digital and print news platform built around clear reader access, editorial publishing, and reliable delivery operations.",
  "Readers can subscribe for digital access and scheduled print editions. Recent articles can stay subscriber-only until an editorially controlled public release date.",
  "Approved companies manage delivery locations, bulk newspaper orders, invoices, and shipments from one workspace after an administrator verifies their business licence.",
];

const pillars = [
  { icon: Globe2, title: "Two languages", desc: "Article content can be maintained in English and Tigrinya." },
  { icon: ShieldCheck, title: "Clear access", desc: "Subscriptions and company approval decide what each account can use." },
  { icon: Truck, title: "Connected delivery", desc: "Saved locations and shipment status support fulfilment operations." },
];

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <section className="relative overflow-hidden bg-night">
        <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(circle at 18% 22%, rgba(196,151,114,0.16), transparent 38%), radial-gradient(circle at 82% 8%, rgba(196,151,114,0.10), transparent 34%), linear-gradient(150deg, #100E0B 0%, #1C1712 52%, #2A1F15 100%)" }} />
        <div aria-hidden className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(rgba(236,230,219,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(236,230,219,0.5) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
          <ScrollReveal effect="rise">
            <span className="font-sans text-[0.6rem] font-bold uppercase tracking-widest text-cream/50">{t("About ንቐደም")}</span>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-black leading-tight text-cream md:text-5xl lg:text-6xl">{t("News, subscriptions, and delivery operations in one platform.")}</h1>
            <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-cream/65 sm:text-lg">{t("ንቐደም combines a bilingual newsroom with reader subscriptions, print delivery, and approved company workspaces for bulk newspaper ordering.")}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link to="/news" className="group inline-flex items-center justify-center gap-2 bg-cream px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-night transition-colors hover:bg-warmbeige">{t("Read the latest edition")}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
              <Link to="/subscriptions" className="inline-flex items-center justify-center border-2 border-cream/70 px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-cream transition-colors hover:border-cream hover:bg-cream hover:text-night">{t("View subscription plans")}</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, index) => <ScrollReveal key={stat.label} effect="rise" delay={index * 40}><article className="rounded-[1.15rem] border border-stone-300/60 bg-vellum p-6 shadow-[0_12px_30px_rgba(0,0,0,0.04)]"><p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.22em] text-heritage">{t(stat.label)}</p><h2 className="mt-3 font-heading text-2xl font-bold leading-tight text-ink md:text-3xl">{t(stat.value)}</h2></article></ScrollReveal>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <ScrollReveal effect="wipe"><div className="relative"><div aria-hidden className="absolute -left-3 -top-3 h-full w-full rounded-[1.15rem] border border-heritage/25" /><img src={IMAGES.boardroom} alt={t("Nekedem platform operations")} className="editorial-image relative aspect-[16/10] w-full rounded-[1.15rem] object-cover shadow-[0_24px_60px_-24px_rgba(76,43,8,0.32)]" /></div></ScrollReveal>
          <ScrollReveal effect="fade" delay={80}><div><span className="font-sans text-[0.6rem] font-bold uppercase tracking-widest text-heritage">{t("How the platform works")}</span><h2 className="mt-3 font-display text-3xl font-black leading-tight text-ink md:text-4xl">{t("A platform built for readers and delivery teams")}</h2><div className="mt-6 space-y-4 font-body text-base leading-relaxed text-redacted">{story.map((paragraph) => <p key={paragraph.slice(0, 24)}>{t(paragraph)}</p>)}</div></div></ScrollReveal>
        </div>
      </section>

      <section className="bg-vellum py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal effect="rise"><div className="mx-auto max-w-2xl text-center"><span className="font-sans text-[0.6rem] font-bold uppercase tracking-widest text-heritage">{t("Platform capabilities")}</span><h2 className="mt-3 font-display text-3xl font-black leading-tight text-ink md:text-4xl">{t("Built around clear workflows")}</h2><p className="mt-4 font-body text-base leading-relaxed text-redacted">{t("The product connects editorial publishing, reader access, business approval, and delivery status without separate manual workflows.")}</p></div></ScrollReveal>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => { const Icon = value.icon; return <ScrollReveal key={value.title} effect="rise" delay={index * 40}><article className="hover-lift h-full rounded-[1.15rem] border border-stone-300/60 bg-paper p-6 shadow-[0_12px_28px_rgba(0,0,0,0.04)]"><div className="flex h-12 w-12 items-center justify-center rounded-full border border-heritage/30 bg-vellum"><Icon className="h-6 w-6 text-heritage" /></div><h3 className="mt-5 font-display text-xl font-bold text-ink">{t(value.title)}</h3><p className="mt-3 font-body text-sm leading-relaxed text-redacted">{t(value.desc)}</p></article></ScrollReveal>; })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <ScrollReveal effect="fade"><div className="relative overflow-hidden rounded-[1.35rem] bg-night p-8 md:p-12"><div aria-hidden className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(rgba(236,230,219,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(236,230,219,0.5) 1px, transparent 1px)", backgroundSize: "44px 44px" }} /><div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">{pillars.map((pillar) => { const Icon = pillar.icon; return <div key={pillar.title} className="border-l border-cream/15 pl-5"><Icon className="h-6 w-6 text-cream/70" /><h3 className="mt-3 font-sans text-sm font-bold uppercase tracking-wider text-cream">{t(pillar.title)}</h3><p className="mt-2 font-body text-sm leading-relaxed text-cream/60">{t(pillar.desc)}</p></div>; })}</div></div></ScrollReveal>
      </section>
      <Footer />
    </div>
  );
}
