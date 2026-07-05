import React from "react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-display text-3xl md:text-4xl font-black text-ink">
          Privacy Policy
        </h1>
        <p className="meta-text mt-2 mb-8">Last updated: July 1, 2026</p>
        <div className="font-body text-base text-ink leading-[1.8] space-y-6">
          <p>
            ንቐደም Publishing ("we," "us," or "our") is committed to protecting
            the privacy and security of our subscribers and readers. This
            Privacy Policy explains how we collect, use, and safeguard your
            personal information.
          </p>
          <h2 className="font-display text-xl font-bold text-ink mt-8">
            Information We Collect
          </h2>
          <p>
            We collect information you provide directly, including your name,
            email address, delivery address, and payment information when you
            subscribe to our services. We also collect usage data to improve our
            editorial offerings and personalize your reading experience.
          </p>
          <h2 className="font-display text-xl font-bold text-ink mt-8">
            How We Use Your Information
          </h2>
          <p>
            Your information is used to deliver our newspaper and digital
            content, process payments, manage your subscription, and communicate
            important updates about our services. We never sell your personal
            data to third parties.
          </p>
          <h2 className="font-display text-xl font-bold text-ink mt-8">
            Contact Us
          </h2>
          <p>
            For privacy-related inquiries, please contact our Data Protection
            Officer at privacy@ንቐደም.com.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
