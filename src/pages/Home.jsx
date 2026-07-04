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

export default function Home() {
  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main>
        <HeroSection />
        <div className="newspaper-rule max-w-7xl mx-auto" />
        <LatestNewsSection />
        <div className="newspaper-rule max-w-7xl mx-auto" />
        <FeaturedStorySection />
        <div className="newspaper-rule max-w-7xl mx-auto" />
        <CategoriesSection />
        <SubscriptionSection />
        <div className="newspaper-rule max-w-7xl mx-auto" />
        <DeliverySection />
        <BusinessSection />
        <MobileAppSection />
        <div className="newspaper-rule max-w-7xl mx-auto" />
        <TestimonialsSection />
        <div className="newspaper-rule max-w-7xl mx-auto" />
        <EditorialsSection />
        <div className="newspaper-rule max-w-7xl mx-auto" />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
