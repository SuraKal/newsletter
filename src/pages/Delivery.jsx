import React from "react";
import { Truck, Package, MapPin, Clock, CheckCircle } from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import { IMAGES } from "@/lib/constants";

const deliveries = [
  {
    id: "NQ-20260704",
    edition: "July 4, 2026 Edition",
    status: "Delivered",
    statusColor: "text-green-700",
    date: "July 4, 2026 · 8:22 AM",
  },
  {
    id: "NQ-20260620",
    edition: "June 20, 2026 Edition",
    status: "Delivered",
    statusColor: "text-green-700",
    date: "June 20, 2026 · 8:15 AM",
  },
  {
    id: "NQ-20260606",
    edition: "June 6, 2026 Edition",
    status: "Delivered",
    statusColor: "text-green-700",
    date: "June 6, 2026 · 8:31 AM",
  },
];

const trackingSteps = [
  {
    icon: Clock,
    label: "Press Time",
    desc: "Content finalized and sent to print",
    time: "3:00 AM",
    done: true,
  },
  {
    icon: Package,
    label: "Packaged",
    desc: "Edition printed and packaged for delivery",
    time: "5:15 AM",
    done: true,
  },
  {
    icon: Truck,
    label: "In Transit",
    desc: "Your newspaper is on its way",
    time: "6:45 AM",
    done: true,
  },
  {
    icon: MapPin,
    label: "Out for Delivery",
    desc: "Driver is in your area",
    time: "7:50 AM",
    done: true,
  },
  {
    icon: CheckCircle,
    label: "Delivered",
    desc: "Left at front door",
    time: "8:22 AM",
    done: true,
  },
];

export default function Delivery() {
  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="newspaper-rule-double mb-6" />
        <h1 className="font-display text-3xl md:text-4xl font-black text-ink uppercase">
          Delivery Tracking
        </h1>
        <p className="font-body text-base text-redacted mt-2 mb-8">
          Monitor your newspaper deliveries in real time.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Delivery */}
          <div className="lg:col-span-2">
            <div className="border border-stone-300/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="category-label">Current Delivery</span>
                  <h2 className="font-display text-xl font-bold text-ink mt-1">
                    July 4, 2026 Edition
                  </h2>
                  <p className="meta-text mt-1">Tracking ID: NQ-20260704</p>
                </div>
                <span className="font-sans text-xs font-bold tracking-wider uppercase text-green-700 bg-green-50 px-3 py-1">
                  Delivered
                </span>
              </div>

              {/* Tracking Steps */}
              <div className="space-y-0">
                {trackingSteps.map((step, i) => (
                  <div key={step.label} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${step.done ? "bg-heritage text-paper" : "border-2 border-stone-300 text-redacted"}`}
                      >
                        <step.icon className="w-4 h-4" />
                      </div>
                      {i < trackingSteps.length - 1 && (
                        <div
                          className={`w-px h-8 ${step.done ? "bg-heritage" : "border-l border-dashed border-stone-300"}`}
                        />
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="flex items-baseline gap-3">
                        <h4 className="font-sans text-sm font-bold text-ink">
                          {step.label}
                        </h4>
                        <span className="meta-text">{step.time}</span>
                      </div>
                      <p className="font-body text-sm text-redacted">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-6 overflow-hidden">
              <img
                src={IMAGES.delivery}
                alt="Delivery illustration"
                className="w-full aspect-[16/9] object-cover editorial-image"
              />
            </div>
          </div>

          {/* Delivery History */}
          <div>
            <h3 className="font-sans text-xs font-bold tracking-widest uppercase text-ink mb-4">
              Delivery History
            </h3>
            <div className="space-y-0">
              {deliveries.map((d) => (
                <div key={d.id} className="py-4 border-b border-stone-300/30">
                  <p className="font-heading text-sm font-bold text-ink">
                    {d.edition}
                  </p>
                  <p className="meta-text mt-1">{d.id}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`font-sans text-xs font-bold tracking-wider uppercase ${d.statusColor}`}
                    >
                      {d.status}
                    </span>
                    <span className="meta-text">{d.date}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-vellum">
              <h4 className="font-sans text-xs font-bold tracking-widest uppercase text-ink">
                Next Delivery
              </h4>
              <p className="font-heading text-sm font-bold text-ink mt-2">
                July 18, 2026 Edition
              </p>
              <p className="meta-text mt-1">Estimated delivery: 8:00–9:00 AM</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
