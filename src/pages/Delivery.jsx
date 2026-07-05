import React from "react";
import PageWrapper from "@/components/nequdem/PageWrapper";
import { IMAGES } from "@/lib/nequdem-data";
import {
  Package,
  Truck,
  MapPin,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const trackingSteps = [
  {
    time: "04:00",
    status: "Off the Press",
    detail: "Your edition has been printed and quality-checked",
    icon: Package,
    done: true,
  },
  {
    time: "06:30",
    status: "In Transit",
    detail: "Currently en route via our logistics partner",
    icon: Truck,
    done: true,
  },
  {
    time: "09:15",
    status: "Local Distribution",
    detail: "Arrived at your regional distribution center",
    icon: MapPin,
    done: true,
  },
  {
    time: "11:00",
    status: "Out for Delivery",
    detail: "Your newspaper is with the local courier",
    icon: Truck,
    done: false,
    active: true,
  },
  {
    time: "12:30",
    status: "Delivered",
    detail: "Estimated delivery time",
    icon: CheckCircle,
    done: false,
  },
];

export default function Delivery() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="nq-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="nq-category-label">Delivery Tracking</span>
            <h1 className="nq-headline text-3xl md:text-5xl mt-4">
              Track Your Newspaper, Every Step of the Way
            </h1>
            <p className="nq-deck mt-4 text-base leading-relaxed">
              From the moment your edition leaves the press to the second it
              arrives at your doorstep, you have complete visibility. Our
              proprietary tracking system provides real-time updates on every
              physical delivery.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-heritage">
                  98.7%
                </div>
                <div className="font-sans text-xs text-muted-foreground">
                  On-time rate
                </div>
              </div>
              <div className="h-12 border-l border-rule" />
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-heritage">
                  42
                </div>
                <div className="font-sans text-xs text-muted-foreground">
                  Countries
                </div>
              </div>
              <div className="h-12 border-l border-rule" />
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-heritage">
                  24h
                </div>
                <div className="font-sans text-xs text-muted-foreground">
                  Max transit
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden">
            <img
              src={IMAGES.delivery}
              alt="Delivery tracking"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Tracking demo */}
      <section className="nq-vellum py-16">
        <div className="nq-container">
          <div className="max-w-2xl mx-auto">
            <h2 className="nq-headline text-2xl md:text-3xl text-center mb-2">
              Live Tracking Demo
            </h2>
            <p className="nq-deck text-center mb-10">
              Edition: July 5, 2026 — London
            </p>

            {/* Tracking input */}
            <div className="flex gap-3 mb-10">
              <input
                type="text"
                placeholder="Enter tracking number (e.g. NQ-2026-07-05-LON)"
                defaultValue="NQ-2026-07-05-LON"
                className="flex-1 px-4 py-3 border border-rule bg-parchment font-sans text-sm focus:outline-none focus:border-heritage"
              />
              <button className="nq-btn-primary text-xs">Track</button>
            </div>

            {/* Timeline */}
            <div className="space-y-0">
              {trackingSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${
                          step.done
                            ? "bg-heritage text-parchment"
                            : step.active
                              ? "bg-heritage/20 text-heritage border-2 border-heritage"
                              : "bg-rule/40 text-muted-foreground"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      {i < trackingSteps.length - 1 && (
                        <div
                          className={`w-0.5 h-16 ${step.done ? "bg-heritage" : "bg-rule"}`}
                        />
                      )}
                    </div>
                    <div className="pt-2 pb-8">
                      <div className="flex items-center gap-3">
                        <span className="font-sans text-xs font-bold text-heritage">
                          {step.time}
                        </span>
                        <h4 className="font-sans text-sm font-semibold text-ink">
                          {step.status}
                        </h4>
                        {step.active && (
                          <span className="text-[10px] font-sans bg-heritage/10 text-heritage px-2 py-0.5 font-bold uppercase tracking-wider">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-xs text-muted-foreground mt-1">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Digital mirror CTA */}
            <div className="mt-8 p-6 nq-parchment border border-rule text-center">
              <Clock className="w-6 h-6 text-heritage mx-auto mb-3" />
              <h3 className="font-display text-lg font-bold text-ink">
                Read While You Wait
              </h3>
              <p className="font-sans text-sm text-muted-foreground mt-2">
                Your physical edition is on its way. In the meantime, read
                today's complete edition digitally.
              </p>
              <Link
                to="/news"
                className="nq-btn-outline text-xs mt-4 inline-flex items-center gap-2"
              >
                Read Digital Edition <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
