import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCurrentUserEligibility, getLaunchOfferSettings } from "@/lib/launchOffer";

// GET - Check if current user is eligible for launch offer
export async function GET() {
  try {
    const { userId } = await auth();
    
    // For guest users, show offer as active but assume eligible
    if (!userId) {
      try {
        const offerSettings = await getLaunchOfferSettings();
        console.log("Guest user - Offer settings:", offerSettings);
        return NextResponse.json({
          success: true,
          eligible: true, // Assume eligible for guests
          orderCount: 0,
          offerActive: offerSettings?.active || false,
          discountValue: offerSettings?.discountValue || 15,
          offerName: offerSettings?.name || "Launch Offer",
        });
      } catch (dbError) {
        console.error("Database error for guest user:", dbError);
        // Return default offer settings even if DB fails
        return NextResponse.json({
          success: true,
          eligible: true,
          orderCount: 0,
          offerActive: true, // Default to active
          discountValue: 15, // Default discount
          offerName: "Launch Offer",
        });
      }
    }

    const eligibility = await getCurrentUserEligibility(userId);

    return NextResponse.json({
      success: true,
      eligible: eligibility.eligible,
      orderCount: eligibility.orderCount,
      offerActive: eligibility.offerActive,
      discountValue: eligibility.discountValue,
      offerName: eligibility.offerName,
    });
  } catch (error: any) {
    console.error("Error checking eligibility:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
