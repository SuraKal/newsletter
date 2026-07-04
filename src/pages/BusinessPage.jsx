import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  BarChart3,
  FileText,
  Truck,
  Shield,
  Headphones,
} from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import { IMAGES } from "@/lib/constants";

const features = [
  {
    icon: Users,
    title: "Team Management",
    desc: "Add up to 100 team members with individual login credentials and reading profiles.",
  },
  {
    icon: FileText,
    title: "Bulk Newspaper Orders",
    desc: "Order physical newspapers in volume with automated recurring delivery schedules.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Track readership patterns, most-read articles, and team engagement metrics.",
  },
  {
    icon: Truck,
    title: "Consolidated Delivery",
    desc: "Manage all newspaper deliveries across multiple offices from a single dashboard.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "SSO integration, audit logs, and compliance-ready data handling.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "Priority support with a dedicated account manager for your organization.",
  },
];

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main>
        {/* Hero */}
        <section className="relative">
          <img
            src={IMAGES.boardroom}
            alt="Business setting"
            className="w-full h-[400px] md:h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-night/90 via-night/70 to-night/40" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4">
              <span className="font-sans text-[0.6rem] font-bold tracking-widest uppercase text-cream/50">
                For Organizations
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-cream leading-tight mt-2 max-w-2xl">
                Premium Journalism for Your Enterprise
              </h1>
              <p className="font-body text-lg text-cream/70 mt-4 max-w-xl leading-relaxed">
                Keep your team informed with ንቐደም's business subscription.
                Volume pricing, consolidated billing, and enterprise-grade
                management tools.
              </p>
              <div className="flex gap-4 mt-8">
                <Link
                  to="/contact"
                  className="font-sans text-xs font-bold tracking-wider uppercase bg-cream text-night px-6 py-3 hover:bg-warmbeige transition-colors"
                >
                  Contact Sales
                </Link>
                <Link
                  to="/subscriptions"
                  className="font-sans text-xs font-bold tracking-wider uppercase border-2 border-cream text-cream px-6 py-3 hover:bg-cream hover:text-night transition-colors"
                >
                  View Plans
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="font-display text-3xl font-black text-ink text-center mb-12">
            Built for Organizations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="border border-stone-300/50 p-6">
                <f.icon className="w-6 h-6 text-heritage mb-3" />
                <h3 className="font-sans text-sm font-bold tracking-wider uppercase text-ink">
                  {f.title}
                </h3>
                <p className="font-body text-sm text-redacted mt-2 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-vellum py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-display text-3xl font-black text-ink mb-4">
              Volume Pricing
            </h2>
            <p className="font-body text-base text-redacted mb-10">
              Discounted rates for organizations of all sizes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  tier: "Small Team",
                  seats: "5–25 seats",
                  price: "$69",
                  per: "/seat/month",
                },
                {
                  tier: "Department",
                  seats: "26–100 seats",
                  price: "$49",
                  per: "/seat/month",
                },
                {
                  tier: "Enterprise",
                  seats: "100+ seats",
                  price: "Custom",
                  per: "pricing",
                },
              ].map((t) => (
                <div
                  key={t.tier}
                  className="bg-paper border border-stone-300/50 p-6"
                >
                  <h3 className="font-sans text-xs font-bold tracking-widest uppercase text-heritage">
                    {t.tier}
                  </h3>
                  <p className="meta-text mt-1">{t.seats}</p>
                  <p className="font-display text-3xl font-black text-ink mt-4">
                    {t.price}
                  </p>
                  <p className="meta-text">{t.per}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
