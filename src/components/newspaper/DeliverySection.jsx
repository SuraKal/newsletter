import React from "react";
import { Link } from "react-router-dom";
import { Truck, Clock, MapPin, Package } from "lucide-react";
import { IMAGES } from "@/lib/constants";

const steps = [
  {
    icon: Clock,
    label: "Press Time",
    desc: "Articles finalized and sent to print",
    time: "3:00 AM",
  },
  {
    icon: Package,
    label: "Distribution",
    desc: "Newspapers packaged and dispatched",
    time: "5:30 AM",
  },
  {
    icon: Truck,
    label: "In Transit",
    desc: "Your edition is on its way",
    time: "7:00 AM",
  },
  {
    icon: MapPin,
    label: "Delivered",
    desc: "Newspaper arrives at your door",
    time: "8:30 AM",
  },
];

export default function DeliverySection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="category-label">For Print Subscribers</span>
          <h2 className="font-display text-3xl md:text-4xl font-black text-ink leading-tight mt-2">
            Track Your Newspaper Delivery in Real Time
          </h2>
          <p className="font-body text-base text-redacted mt-4 leading-relaxed">
            As a print subscriber, you can monitor every step of your
            newspaper's journey — from the printing press to your front door.
            Our real-time tracking system keeps you informed at every stage.
          </p>

          <div className="mt-8 space-y-4">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border-2 border-heritage flex items-center justify-center">
                    <step.icon className="w-4 h-4 text-heritage" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px h-6 border-l border-dashed border-heritage/40" />
                  )}
                </div>
                <div className="pt-1.5">
                  <div className="flex items-baseline gap-3">
                    <h4 className="font-sans text-sm font-bold tracking-wider uppercase text-ink">
                      {step.label}
                    </h4>
                    <span className="meta-text">{step.time}</span>
                  </div>
                  <p className="font-body text-sm text-redacted mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/delivery"
            className="inline-block mt-8 font-sans text-xs font-bold tracking-wider uppercase bg-heritage text-paper px-6 py-3 hover:bg-ink transition-colors"
          >
            Track Delivery
          </Link>
        </div>

        <div className="overflow-hidden">
          <img
            src={IMAGES.delivery}
            alt="Newspaper printing press in action"
            className="w-full aspect-[16/9] object-cover editorial-image"
          />
        </div>
      </div>
    </section>
  );
}
