import React from "react";
import { Smartphone, Download } from "lucide-react";
import { IMAGES } from "@/lib/nequdem-data";

export default function MobileAppSection() {
  return (
    <section className="bg-ink py-16">
      <div className="nq-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-sans uppercase tracking-widest font-semibold text-parchment/50">
              Mobile App
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-parchment mt-3">
              Nequdem in Your Pocket
            </h2>
            <p className="font-sans text-base text-parchment/70 mt-4 leading-relaxed">
              Access every article, track your deliveries, and manage your
              subscription from anywhere. The Nequdem app delivers the same
              premium reading experience optimized for your mobile device.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <button className="flex items-center gap-3 bg-parchment/10 hover:bg-parchment/20 border border-parchment/20 px-5 py-3 rounded-2xl transition-colors">
                <Download className="w-5 h-5 text-parchment" />
                <div className="text-left">
                  <div className="text-[10px] font-sans text-parchment/60 uppercase">
                    Download on the
                  </div>
                  <div className="font-sans text-sm font-semibold text-parchment">
                    App Store
                  </div>
                </div>
              </button>
              <button className="flex items-center gap-3 bg-parchment/10 hover:bg-parchment/20 border border-parchment/20 px-5 py-3 rounded-2xl transition-colors">
                <Smartphone className="w-5 h-5 text-parchment" />
                <div className="text-left">
                  <div className="text-[10px] font-sans text-parchment/60 uppercase">
                    Get it on
                  </div>
                  <div className="font-sans text-sm font-semibold text-parchment">
                    Google Play
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src={IMAGES.mobile}
              alt="Nequdem mobile app"
              className="w-full max-w-md h-72 md:h-96 object-cover rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
