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
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="category-label">For Print Subscribers</span>
            <h2 className="mt-2 font-display text-3xl font-black leading-tight text-ink md:text-4xl">
              Track Your Newspaper Delivery in Real Time
            </h2>
            <p className="mt-4 font-body text-base leading-relaxed text-redacted">
              As a print subscriber, you can monitor every step of your
              newspaper&apos;s journey from the printing press to your front door.
              Our real-time tracking system keeps you informed at every stage.
            </p>

            <div className="mt-8 space-y-4">
              {steps.map((step, i) => (
                <div key={step.label} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-heritage">
                      <step.icon className="h-4 w-4 text-heritage" />
                    </div>
                    {i < steps.length - 1 && (
                      <div className="h-6 w-px border-l border-dashed border-heritage/40" />
                    )}
                  </div>
                  <div className="pt-1.5">
                    <div className="flex items-baseline gap-3">
                      <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-ink">
                        {step.label}
                      </h4>
                      <span className="meta-text">{step.time}</span>
                    </div>
                    <p className="mt-0.5 font-body text-sm text-redacted">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/delivery"
              className="hover-lift mt-8 inline-block bg-heritage px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-ink"
            >
              Track Delivery
            </Link>
          </div>

          <div className="overflow-hidden">
            <img
              src={IMAGES.delivery}
              alt="Newspaper printing press in action"
              className="editorial-image aspect-[16/9] w-full object-cover"
            />
          </div>
        </div>
      </section>
  );
}
