import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileBadge, Package, Truck } from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import { useLanguage } from "@/lib/LanguageContext";

const benefits = [
  { icon: Package, title: "Bulk orders", text: "Order physical newspaper copies for approved company locations." },
  { icon: Truck, title: "Delivery locations", text: "Save verified delivery locations and follow shipment progress." },
  { icon: FileBadge, title: "Approved company access", text: "Company sign-in is enabled after an admin approves the uploaded business licence." },
];

export default function BusinessPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <section className="rounded-3xl bg-night px-6 py-12 text-cream sm:px-10 sm:py-16">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-cream/60">{t("Business account")}</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-black leading-tight sm:text-5xl">{t("Newspapers for your organization.")}</h1>
          <p className="mt-4 max-w-xl font-body text-base leading-7 text-cream/75">{t("Register your company, upload its business licence for approval, then add delivery locations and place bulk newspaper orders from your workspace.")}</p>
          <Link to="/register?journey=business" className="mt-8 inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.16em] text-night transition-colors hover:bg-warmbeige">{t("Register your company")} <ArrowRight className="h-4 w-4" /></Link>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {benefits.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-stone-300/60 bg-white p-5">
              <Icon className="h-6 w-6 text-heritage" />
              <h2 className="mt-4 font-display text-xl font-bold text-ink">{t(title)}</h2>
              <p className="mt-2 font-body text-sm leading-6 text-redacted">{t(text)}</p>
            </article>
          ))}
        </section>

        <p className="mt-8 text-center font-body text-sm text-redacted">{t("Already approved?")} <Link to="/login?journey=business" className="font-semibold text-heritage hover:underline">{t("Sign in")}</Link></p>
      </main>
      <Footer />
    </div>
  );
}
