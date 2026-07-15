"use client";

import { useState, useEffect } from "react";
import {
  LaunchOfferBanner,
  Hero,
  CategoriesSection,
  FeaturedFramesSection,
  CustomFrameBanner,
  LimitedOfferBanner,
  BestSellerSection,
  WeddingBirthdaySection,
  InstagramSection,
  StatsSection,
  NewsletterSection,
  CTASection,
} from "@/components/home";

export default function HomePage() {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState({
    eligible: true,
    discountValue: 15,
    offerActive: true,
    offerName: "Launch Offer",
  });

  useEffect(() => {
    fetch("/api/frames")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFrames(data.data.slice(0, 8));
        }
      })
      .finally(() => setLoading(false));

    // Fetch eligibility
    fetch("/api/offers/eligibility")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setEligibility({
            eligible: data.eligible ?? true,
            discountValue: data.discountValue ?? 15,
            offerActive: data.offerActive ?? true,
            offerName: data.offerName ?? "Launch Offer",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching eligibility:", error);
      });
  }, []);

  return (
    <div className="flex flex-col">
      <LaunchOfferBanner eligibility={eligibility} />
      <Hero />
      <CategoriesSection />
      <FeaturedFramesSection
        frames={frames}
        loading={loading}
        eligibility={eligibility}
      />
      <CustomFrameBanner />
      <LimitedOfferBanner eligibility={eligibility} />
      <BestSellerSection frames={frames} eligibility={eligibility} />
      <WeddingBirthdaySection />
      <InstagramSection />
      <StatsSection />
      <NewsletterSection />
      <CTASection />
    </div>
  );
}
