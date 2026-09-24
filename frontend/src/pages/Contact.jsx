import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Clock, Mail, Send } from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import ScrollReveal from "@/components/newspaper/ScrollReveal";
import { useLanguage } from "@/lib/LanguageContext";
import { appParams } from "@/lib/app-params";

const topics = [
  "General Inquiry",
  "Subscription Support",
  "Business Partnership",
  "Editorial Feedback",
  "Delivery Issue",
];

export default function Contact() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [topic, setTopic] = useState(topics[0]);
  const supportEmail = appParams.supportEmail;

  const channels = [
    {
      icon: Mail,
      title: "Reader and editorial support",
      lines: [supportEmail, "Ask about subscriptions, account access, published articles, or print delivery."],
    },
    {
      icon: Clock,
      title: "Business support",
      lines: ["Use this route for company registration, licence approval, delivery locations, bulk orders, invoices, and shipments.", "Include your company name and the request you need help with."],
    },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `${topic}: ${data.get("name") || "Support request"}`;
    const body = [
      `${t("Topic")}: ${topic}`,
      `${t("Name")}: ${data.get("name") || ""}`,
      `${t("Email")}: ${data.get("email") || ""}`,
      "",
      data.get("message") || "",
    ].join("\n");
    window.location.assign(`mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <section className="relative overflow-hidden bg-night">
        <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(circle at 18% 22%, rgba(196,151,114,0.16), transparent 38%), radial-gradient(circle at 82% 8%, rgba(196,151,114,0.10), transparent 34%), linear-gradient(150deg, #100E0B 0%, #1C1712 52%, #2A1F15 100%)" }} />
        <div aria-hidden className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(rgba(236,230,219,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(236,230,219,0.5) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
          <ScrollReveal effect="rise">
            <span className="font-sans text-[0.6rem] font-bold uppercase tracking-widest text-cream/50">{t("Contact support")}</span>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-black leading-tight text-cream md:text-5xl lg:text-6xl">{t("Help with reader access, business approval, bulk orders, or delivery.")}</h1>
            <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-cream/65 sm:text-lg">{t("Use the form to prepare a support email, or manage account-specific subscriptions, delivery, and company operations from the appropriate workspace.")}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <a href={`mailto:${supportEmail}?subject=Reader%20Support`} className="group inline-flex items-center justify-center gap-2 bg-cream px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-night transition-colors hover:bg-warmbeige">{t("Email reader support")}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></a>
              <a href={`mailto:${supportEmail}?subject=Business%20Support`} className="inline-flex items-center justify-center border-2 border-cream/70 px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-cream transition-colors hover:border-cream hover:bg-cream hover:text-night">{t("Email business support")}</a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.9fr)]">
          <ScrollReveal effect="fade">
            <section className="border border-stone-300/70 bg-[#fffdf9] p-6 shadow-[0_24px_60px_-24px_rgba(76,43,8,0.22)] sm:p-10">
              {submitted ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-heritage/10"><CheckCircle2 className="h-8 w-8 text-heritage" /></div>
                  <h2 className="mt-6 font-display text-3xl font-black text-ink">{t("Your email is ready")}</h2>
                  <p className="mt-3 max-w-md font-body text-base leading-relaxed text-redacted">{t("Send the message from your email application to contact support. For account-specific actions, use your reader or business workspace.")}</p>
                  <button type="button" onClick={() => setSubmitted(false)} className="mt-8 inline-flex items-center gap-2 border-b border-heritage pb-1 font-sans text-xs font-bold uppercase tracking-wider text-heritage transition-colors hover:text-ink">{t("Prepare another message")}</button>
                </div>
              ) : (
                <>
                  <div className="border-b border-stone-300/60 pb-6">
                    <span className="font-sans text-[0.6rem] font-bold uppercase tracking-widest text-heritage">{t("Contact support")}</span>
                    <h2 className="mt-2 font-display text-3xl font-black text-ink">{t("Tell us what you need")}</h2>
                    <p className="mt-2 font-body text-sm leading-relaxed text-redacted">{t("Choose a topic and we will prepare an email to the support address configured for this platform.")}</p>
                  </div>
                  <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                    <div><span className="mb-3 block font-sans text-xs font-bold uppercase tracking-wider text-ink">{t("Topic")}</span><div className="flex flex-wrap gap-2.5">{topics.map((item) => <button key={item} type="button" onClick={() => setTopic(item)} className={`border px-4 py-2 font-sans text-[0.7rem] font-bold uppercase tracking-wider transition-colors ${topic === item ? "border-heritage bg-heritage text-paper" : "border-stone-300 bg-transparent text-redacted hover:border-heritage hover:text-heritage"}`}>{t(item)}</button>)}</div></div>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                      <label className="font-sans text-xs font-bold uppercase tracking-wider text-ink">{t("Name")}<input type="text" name="name" required autoComplete="name" placeholder={t("Your full name")} className="mt-2 w-full border-b-2 border-stone-300 bg-transparent py-2.5 font-body text-base text-ink placeholder:text-redacted/60 focus:border-heritage focus:outline-none" /></label>
                      <label className="font-sans text-xs font-bold uppercase tracking-wider text-ink">{t("Email")}<input type="email" name="email" required autoComplete="email" placeholder="you@example.com" className="mt-2 w-full border-b-2 border-stone-300 bg-transparent py-2.5 font-body text-base text-ink placeholder:text-redacted/60 focus:border-heritage focus:outline-none" /></label>
                    </div>
                    <label className="block font-sans text-xs font-bold uppercase tracking-wider text-ink">{t("Message")}<textarea name="message" rows={6} required placeholder={t("Share the details that will help support assist you.")} className="mt-2 w-full resize-none border-2 border-stone-300 bg-transparent p-4 font-body text-base text-ink placeholder:text-redacted/60 focus:border-heritage focus:outline-none" /></label>
                    <div className="flex flex-col gap-4 border-t border-stone-300/60 pt-6 sm:flex-row sm:items-center sm:justify-between"><p className="font-sans text-[0.65rem] uppercase tracking-wider text-redacted"><Clock className="mr-1.5 inline h-3.5 w-3.5" />{t("The form opens an email addressed to platform support.")}</p><button type="submit" className="group inline-flex items-center justify-center gap-2 bg-heritage px-8 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-ink">{t("Prepare email")}<Send className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button></div>
                  </form>
                </>
              )}
            </section>
          </ScrollReveal>
          <aside className="space-y-5">
            {channels.map((channel, index) => {
              const Icon = channel.icon;
              return <ScrollReveal key={channel.title} effect="rise" delay={index * 40}><div className="flex items-start gap-4 border border-stone-300/70 bg-vellum p-5"><div className="flex h-11 w-11 shrink-0 items-center justify-center border border-heritage/25 bg-paper"><Icon className="h-5 w-5 text-heritage" /></div><div className="min-w-0"><h3 className="font-sans text-[0.65rem] font-bold uppercase tracking-widest text-heritage">{t(channel.title)}</h3>{channel.lines.map((line) => <p key={line} className="mt-1 break-words font-body text-sm leading-relaxed text-ink first-of-type:mt-1.5">{line === supportEmail ? line : t(line)}</p>)}</div></div></ScrollReveal>;
            })}
            <ScrollReveal effect="rise" delay={100}><div className="border border-stone-300/70 bg-vellum p-5"><h3 className="font-sans text-[0.65rem] font-bold uppercase tracking-widest text-heritage">{t("Use the right workspace")}</h3><p className="mt-2 font-body text-sm leading-relaxed text-redacted">{t("Readers manage subscriptions and delivery history in the reader workspace. Approved companies manage locations, orders, invoices, and shipments in the business workspace.")}</p></div></ScrollReveal>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
