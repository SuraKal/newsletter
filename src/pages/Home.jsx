import React from "react";
import PageWrapper from "@/components/nequdem/PageWrapper";
import HeroSection from "@/components/home/HeroSection";
import LatestNewsSection from "@/components/home/LatestNewsSection";
import FeaturedStorySection from "@/components/home/FeaturedStorySection";
import CategoriesSection from "@/components/home/CategoriesSection";
import SubscriptionSection from "@/components/home/SubscriptionSection";
import DeliverySection from "@/components/home/DeliverySection";
import BusinessSection from "@/components/home/BusinessSection";
import MobileAppSection from "@/components/home/MobileAppSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BlogPreviewSection from "@/components/home/BlogPreviewSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function Home() {
  return (
    <PageWrapper>
      <HeroSection />
      <div className="nq-hairline" />
      <LatestNewsSection />
      <FeaturedStorySection />
      <CategoriesSection />
      <div className="nq-hairline" />
      <SubscriptionSection />
      <DeliverySection />
      <BusinessSection />
      <MobileAppSection />
      <TestimonialsSection />
      <BlogPreviewSection />
      <div className="nq-hairline" />
      <NewsletterSection />
    </PageWrapper>
  );
}
