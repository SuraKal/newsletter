import React from "react";
import { Link } from "react-router-dom";
import { Users, BarChart3, FileText, Truck } from "lucide-react";
import { IMAGES } from "@/lib/constants";

const benefits = [
  {
    icon: Users,
    title: "Team Access",
    desc: "Provide your entire team with unlimited ንቐደም access under a single account.",
  },
  {
    icon: FileText,
    title: "Bulk Orders",
    desc: "Order physical newspapers in volume for offices, lobbies, and client meetings.",
  },
  {
    icon: BarChart3,
    title: "Company Dashboard",
    desc: "Manage subscriptions, billing, and usage analytics from a centralized dashboard.",
  },
  {
    icon: Truck,
    title: "Consolidated Delivery",
    desc: "Track all deliveries across your organization from one unified view.",
  },
];

export default function BusinessSection() {
  return (
    <section className="bg-night text-cream py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 overflow-hidden">
            <img
              src={IMAGES.boardroom}
              alt="Corporate boardroom with newspaper"
              className="w-full aspect-[16/9] object-cover opacity-80"
            />
          </div>
          <div className="order-1 lg:order-2">
            <span className="font-sans text-[0.6rem] font-bold tracking-widest uppercase text-cream/40">
              For Organizations
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-black text-cream leading-tight mt-2">
              ንቐደም for Business
            </h2>
            <p className="font-body text-base text-cream/70 mt-4 leading-relaxed">
              Equip your team with premium journalism. Our business
              subscriptions offer volume pricing, consolidated billing, and a
              dedicated account manager.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((b) => (
                <div key={b.title}>
                  <b.icon className="w-5 h-5 text-warmbeige mb-2" />
                  <h4 className="font-sans text-sm font-bold tracking-wider uppercase text-cream">
                    {b.title}
                  </h4>
                  <p className="font-body text-sm text-cream/60 mt-1">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>

            <Link
              to="/business"
              className="inline-block mt-8 font-sans text-xs font-bold tracking-wider uppercase border-2 border-cream text-cream px-6 py-3 hover:bg-cream hover:text-night transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
