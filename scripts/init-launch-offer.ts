// Script to initialize launch offer settings in database
// Run with: npx tsx scripts/init-launch-offer.ts

import connectDB from "../lib/db";
import OfferSetting from "../models/OfferSetting";

async function initLaunchOffer() {
  try {
    await connectDB();
    console.log("✅ Connected to database");

    // Check if offer already exists
    const existingOffer = await OfferSetting.findOne({ name: "Launch Offer" });

    if (existingOffer) {
      console.log("ℹ️  Launch Offer already exists:");
      console.log({
        active: existingOffer.active,
        discountValue: existingOffer.discountValue,
        maxOrdersPerUser: existingOffer.maxOrdersPerUser,
      });
      return;
    }

    // Create default launch offer
    const offer = await OfferSetting.create({
      name: "Launch Offer",
      active: true,
      discountType: "PERCENT",
      discountValue: 15,
      maxOrdersPerUser: 3,
      minOrderValue: 0,
    });

    console.log("✅ Launch Offer initialized successfully!");
    console.log({
      name: offer.name,
      active: offer.active,
      discountValue: offer.discountValue + "%",
      maxOrdersPerUser: offer.maxOrdersPerUser,
    });
  } catch (error) {
    console.error("❌ Error initializing launch offer:", error);
  } finally {
    process.exit();
  }
}

initLaunchOffer();
