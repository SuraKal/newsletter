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

        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-10 lg:gap-14">
            <div>
              <span className="font-sans text-[0.6rem] font-bold tracking-widest uppercase text-heritage">
                Business Inquiry
              </span>
              <h2 className="mt-2 font-display text-3xl font-black text-ink md:text-4xl">
                Send a business request
              </h2>
              <p className="mt-4 max-w-2xl font-body text-base leading-relaxed text-redacted">
                Use this form for sponsorships, advertising, bulk subscriptions,
                enterprise partnerships, or newsroom collaboration requests.
                We will route it to the right commercial contact.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="border border-stone-300/60 bg-vellum p-6">
                  <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-ink">
                    Response Time
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-redacted">
                    Most business inquiries receive a reply within 1 business
                    day.
                  </p>
                </div>
                <div className="border border-stone-300/60 bg-vellum p-6">
                  <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-ink">
                    Best For
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-redacted">
                    Advertising, partnerships, sponsorships, and enterprise
                    access.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-stone-300/60 bg-paper p-6 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
              <h3 className="font-display text-2xl font-black text-ink">
                Business Contact Form
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-redacted">
                Tell us about your organization and we’ll follow up with the
                right plan or contact person.
              </p>

              <form className="mt-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block font-sans text-xs font-bold uppercase tracking-wider text-ink">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full border border-stone-300/60 bg-transparent p-3 font-body text-sm text-ink outline-none focus:border-heritage"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-sans text-xs font-bold uppercase tracking-wider text-ink">
                      Work Email
                    </label>
                    <input
                      type="email"
                      className="w-full border border-stone-300/60 bg-transparent p-3 font-body text-sm text-ink outline-none focus:border-heritage"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block font-sans text-xs font-bold uppercase tracking-wider text-ink">
                      Company
                    </label>
                    <input
                      type="text"
                      className="w-full border border-stone-300/60 bg-transparent p-3 font-body text-sm text-ink outline-none focus:border-heritage"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-sans text-xs font-bold uppercase tracking-wider text-ink">
                      Request Type
                    </label>
                    <select className="w-full border border-stone-300/60 bg-transparent p-3 font-body text-sm text-ink outline-none focus:border-heritage">
                      <option>Advertising</option>
                      <option>Bulk Subscription</option>
                      <option>Partnership</option>
                      <option>Sponsorship</option>
                      <option>Enterprise Access</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block font-sans text-xs font-bold uppercase tracking-wider text-ink">
                      Company Size
                    </label>
                    <select className="w-full border border-stone-300/60 bg-transparent p-3 font-body text-sm text-ink outline-none focus:border-heritage">
                      <option>1-10</option>
                      <option>11-50</option>
                      <option>51-200</option>
                      <option>200+</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block font-sans text-xs font-bold uppercase tracking-wider text-ink">
                      Preferred Contact
                    </label>
                    <select className="w-full border border-stone-300/60 bg-transparent p-3 font-body text-sm text-ink outline-none focus:border-heritage">
                      <option>Email</option>
                      <option>Phone</option>
                      <option>WhatsApp</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-sans text-xs font-bold uppercase tracking-wider text-ink">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="w-full resize-none border border-stone-300/60 bg-transparent p-3 font-body text-sm text-ink outline-none focus:border-heritage"
                    placeholder="Tell us about your company, goals, and what you need from us."
                  />
                </div>

                <button
                  type="button"
                  className="inline-flex bg-heritage px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-ink"
                >
                  Send Business Request
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
