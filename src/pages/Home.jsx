import React from "react";
import Masthead from "@/components/newspaper/Masthead";
import HeroSection from "@/components/newspaper/HeroSection";
import LatestNewsSection from "@/components/newspaper/LatestNewsSection";
import FeaturedStorySection from "@/components/newspaper/FeaturedStorySection";
import CategoriesSection from "@/components/newspaper/CategoriesSection";
import SubscriptionSection from "@/components/newspaper/SubscriptionSection";
import DeliverySection from "@/components/newspaper/DeliverySection";
import BusinessSection from "@/components/newspaper/BusinessSection";
import MobileAppSection from "@/components/newspaper/MobileAppSection";
import TestimonialsSection from "@/components/newspaper/TestimonialsSection";
import EditorialsSection from "@/components/newspaper/EditorialsSection";
import NewsletterSection from "@/components/newspaper/NewsletterSection";
import Footer from "@/components/newspaper/Footer";
import ScrollReveal from "@/components/newspaper/ScrollReveal";

export default function Home() {
  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="overflow-hidden">
        <ScrollReveal effect="wipe" className="section-sheen section-drift">
          <HeroSection />
        </ScrollReveal>
        <div className="newspaper-rule max-w-7xl mx-auto" />
        <ScrollReveal effect="float" delay={40} className="section-spark">
          <LatestNewsSection />
        </ScrollReveal>
        <div className="newspaper-rule max-w-7xl mx-auto" />
        <FeaturedStorySection />
        <div className="newspaper-rule max-w-7xl mx-auto" />
        <ScrollReveal effect="rise" delay={40} className="section-wave">
          <CategoriesSection />
        </ScrollReveal>
        <ScrollReveal effect="fade" delay={35} className="section-panel">
          <SubscriptionSection />
        </ScrollReveal>
        <div className="newspaper-rule max-w-7xl mx-auto" />
        <ScrollReveal effect="wipe" delay={35} className="section-trace">
          <DeliverySection />
        </ScrollReveal>
        <ScrollReveal effect="rise" delay={35} className="section-nightglow">
          <BusinessSection />
        </ScrollReveal>
        <ScrollReveal effect="zoom" delay={45} className="section-techfloat">
          <MobileAppSection />
        </ScrollReveal>
        <div className="newspaper-rule max-w-7xl mx-auto" />
        <ScrollReveal effect="fade" delay={35} className="section-echo">
          <TestimonialsSection />
        </ScrollReveal>
        <div className="newspaper-rule max-w-7xl mx-auto" />
        <ScrollReveal effect="rise" delay={35} className="section-inkflow">
          <EditorialsSection />
        </ScrollReveal>
        <div className="newspaper-rule max-w-7xl mx-auto" />
        <ScrollReveal effect="wipe" delay={35} className="section-mailpulse">
          <NewsletterSection />
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  );
}
