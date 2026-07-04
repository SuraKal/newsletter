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
    <section className="bg-night py-16 text-cream">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="order-2 overflow-hidden lg:order-1">
            <img
              src={IMAGES.boardroom}
              alt="Corporate boardroom with newspaper"
              className="aspect-[16/9] w-full object-cover opacity-80"
            />
          </div>
          <div className="order-1 lg:order-2">
            <span className="font-sans text-[0.6rem] font-bold uppercase tracking-widest text-cream/40">
              For Organizations
            </span>
            <h2 className="mt-2 font-display text-3xl font-black leading-tight text-cream md:text-4xl">
              ንቐደም for Business
            </h2>
            <p className="mt-4 font-body text-base leading-relaxed text-cream/70">
              Equip your team with premium journalism. Our business
              subscriptions offer volume pricing, consolidated billing, and a
              dedicated account manager.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit.title}>
                  <benefit.icon className="mb-2 h-5 w-5 text-heritage" />
                  <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-cream">
                    {benefit.title}
                  </h4>
                  <p className="mt-1 font-body text-sm text-cream/60">
                    {benefit.desc}
                  </p>
                </div>
              ))}
            </div>

            <Link
              to="/business"
              className="mt-8 inline-block border-2 border-cream px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-cream transition-colors hover:bg-cream hover:text-night"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
