import React from "react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-display text-3xl md:text-4xl font-black text-ink">
          Terms of Service
        </h1>
        <p className="meta-text mt-2 mb-8">Last updated: July 1, 2026</p>
        <div className="font-body text-base text-ink leading-[1.8] space-y-6">
          <p>
            By accessing and using the ንቐደም website and services, you agree to
            be bound by these Terms of Service. Please read them carefully
            before using our platform.
          </p>
          <h2 className="font-display text-xl font-bold text-ink mt-8">
            Subscription Terms
          </h2>
          <p>
            Subscriptions are billed according to the plan selected. Monthly
            subscriptions renew automatically unless cancelled at least 48 hours
            before the renewal date. Annual subscriptions may be cancelled for a
            prorated refund within the first 30 days.
          </p>
          <h2 className="font-display text-xl font-bold text-ink mt-8">
            Content Usage
          </h2>
          <p>
            All content published by ንቐደም is protected by copyright. Subscribers
            may read and share articles for personal use. Reproduction,
            redistribution, or commercial use of our content without written
            permission is strictly prohibited.
          </p>
          <h2 className="font-display text-xl font-bold text-ink mt-8">
            Delivery
          </h2>
          <p>
            Print subscribers will receive their newspaper edition according to
            the delivery schedule of their subscription plan. Delivery times may
            vary by region. We will make reasonable efforts to ensure timely
            delivery and provide tracking information.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
