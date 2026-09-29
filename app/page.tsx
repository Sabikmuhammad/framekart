import {
  LaunchOfferBanner,
  Hero,
  CategoriesSection,
  FeaturedFramesSection,
  CustomFrameBanner,
  BestSellerSection,
  WeddingBirthdaySection,
  BulkOrdersPromotion,
  InstagramSection,
  StatsSection,
  CTASection,
} from "@/components/home";
import dbConnect from "@/lib/db";
import Frame from "@/models/Frame";
import { getLaunchOfferSettings } from "@/lib/launchOffer";

export const revalidate = 3600; // Cache for 1 hour

export default async function HomePage() {
  await dbConnect();

  // Fetch data in parallel
  const [framesData, offerSettings] = await Promise.all([
    Frame.find().sort({ createdAt: -1 }).limit(8).lean(),
    getLaunchOfferSettings()
  ]);

  // Convert MongoDB objects to JSON serializable objects
  const frames = JSON.parse(JSON.stringify(framesData));

  // Determine baseline eligibility for public page
  const eligibility = {
    eligible: true,
    orderCount: 0,
    offerActive: offerSettings?.active || false,
    discountValue: offerSettings?.discountValue || 15,
    offerName: offerSettings?.name || "Launch Offer",
  };

  return (
    <div className="flex flex-col">
      <LaunchOfferBanner eligibility={eligibility} />
      <Hero />
      <CategoriesSection />
      <FeaturedFramesSection
        frames={frames}
        loading={false}
        eligibility={eligibility}
      />
      <CustomFrameBanner />
      <BulkOrdersPromotion />
      <BestSellerSection frames={frames} eligibility={eligibility} />
      <WeddingBirthdaySection />
      <InstagramSection />
      <StatsSection />
      <CTASection />
    </div>
  );
}
