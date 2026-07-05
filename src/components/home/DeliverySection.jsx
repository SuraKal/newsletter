import React from "react";
import { Link } from "react-router-dom";
import { Truck, MapPin, Clock, Package } from "lucide-react";
import { IMAGES } from "@/lib/nequdem-data";

export default function DeliverySection() {
  return (
    <section className="nq-vellum py-16">
      <div className="nq-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="nq-category-label">Delivery Tracking</span>
            <h2 className="nq-headline text-2xl md:text-4xl mt-3">
              From Our Press to Your Doorstep
            </h2>
            <p className="nq-deck mt-4 text-base leading-relaxed">
              Track your physical newspaper delivery in real time. Know exactly
              when your edition leaves the press, enters transit, and arrives at
              your address. Our proprietary logistics network ensures every
              subscriber receives their newspaper fresh and on schedule.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-8">
              {[
                {
                  icon: Package,
                  label: "Off the Press",
                  desc: "Printed fresh daily",
                },
                {
                  icon: Truck,
                  label: "In Transit",
                  desc: "Real-time GPS tracking",
                },
                {
                  icon: MapPin,
                  label: "Local Delivery",
                  desc: "Last-mile precision",
                },
                { icon: Clock, label: "On Time", desc: "98.7% delivery rate" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-heritage/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-heritage" />
                  </div>
                  <div>
                    <h4 className="font-sans text-sm font-semibold text-ink">
                      {label}
                    </h4>
                    <p className="font-sans text-xs text-muted-foreground">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/delivery"
              className="nq-btn-primary text-xs mt-8 inline-block"
            >
              Track Your Delivery
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl">
            <img
              src={IMAGES.delivery}
              alt="Newspaper delivery"
              className="w-full h-72 md:h-96 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
