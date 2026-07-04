import React from "react";
import { Smartphone } from "lucide-react";
import { IMAGES } from "@/lib/constants";

export default function MobileAppSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="category-label">Mobile</span>
          <h2 className="font-display text-3xl md:text-4xl font-black text-ink leading-tight mt-2">
            ንቐደም in Your Pocket
          </h2>
          <p className="font-body text-base text-redacted mt-4 leading-relaxed">
            Read the latest headlines, save articles for later, and receive
            breaking news alerts — all from the ንቐደም Platform.
          </p>

          <div className="flex flex-wrap gap-4 mt-8 hidden">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-night text-cream px-5 py-3 hover:bg-heritage transition-colors"
            >
              <Smartphone className="w-5 h-5" />
              <div>
                <p className="font-sans text-[0.55rem] tracking-wider uppercase text-cream/60">
                  Download on the
                </p>
                <p className="font-sans text-sm font-bold">App Store</p>
              </div>
            </a>
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-night text-cream px-5 py-3 hover:bg-heritage transition-colors"
            >
              <Smartphone className="w-5 h-5" />
              <div>
                <p className="font-sans text-[0.55rem] tracking-wider uppercase text-cream/60">
                  Get it on
                </p>
                <p className="font-sans text-sm font-bold">Google Play</p>
              </div>
            </a>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative w-64 h-[500px]">
            <div className="absolute inset-0 bg-night rounded-[2.5rem] shadow-2xl overflow-hidden p-3">
              <div className="w-full h-full rounded-[2rem] overflow-hidden bg-paper">
                <img
                  src={IMAGES.mobile}
                  alt="ንቐደም mobile app interface"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
