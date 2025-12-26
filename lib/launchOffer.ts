// Launch Offer Configuration
// Server-side eligibility and calculation logic (Server Components only)

import connectDB from "./db";
import OfferSetting from "@/models/OfferSetting";
import Order from "@/models/Order";

export interface LaunchOffer {
  name: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  active: boolean;
  maxOrdersPerUser: number;
  minOrderValue?: number;
  validUntil?: Date;
}

// Fetch launch offer settings from database
export async function getLaunchOfferSettings(): Promise<LaunchOffer | null> {
  try {
    await connectDB();
    // Fetch any active offer (not hardcoded to "Launch Offer" name)
    const settings = await OfferSetting.findOne({ active: true }).lean() as any;
    
    if (!settings) {
      return null;
    }

    return {
      name: settings.name,
      discountType: settings.discountType,
      discountValue: settings.discountValue,
      active: settings.active,
      maxOrdersPerUser: settings.maxOrdersPerUser,
      minOrderValue: settings.minOrderValue,
      validUntil: settings.validUntil,
    };
  } catch (error) {
    console.error("Error fetching launch offer settings:", error);
    return null;
  }
}

// Check if user is eligible for launch offer (< 3 completed orders)
export async function checkLaunchOfferEligibility(
  userIdOrEmail: string,
  isEmail: boolean = false
): Promise<{ eligible: boolean; orderCount: number }> {
  try {
    await connectDB();
    
    const offerSettings = await getLaunchOfferSettings();
    if (!offerSettings || !offerSettings.active) {
      return { eligible: false, orderCount: 0 };
    }

    // Count completed orders
    const query = isEmail
      ? { customerEmail: userIdOrEmail, paymentStatus: "completed" }
      : { userId: userIdOrEmail, paymentStatus: "completed" };

    const orderCount = await Order.countDocuments(query);

    return {
      eligible: orderCount < offerSettings.maxOrdersPerUser,
      orderCount,
    };
  } catch (error) {
    console.error("Error checking launch offer eligibility:", error);
    return { eligible: false, orderCount: 0 };
  }
}

// Server action to get eligibility for current user
// Must be called from Server Components or API routes
export async function getCurrentUserEligibility(userId: string): Promise<{
  eligible: boolean;
  orderCount: number;
  offerActive: boolean;
  discountValue: number;
  offerName: string;
}> {
  try {
    const offerSettings = await getLaunchOfferSettings();

    if (!offerSettings || !offerSettings.active) {
      return { eligible: false, orderCount: 0, offerActive: false, discountValue: 0, offerName: "Launch Offer" };
    }

    if (!userId) {
      // For guest users, we'll check eligibility at checkout with email
      return {
        eligible: true, // Assume eligible until checkout
        orderCount: 0,
        offerActive: true,
        discountValue: offerSettings.discountValue,
        offerName: offerSettings.name,
      };
    }

    const { eligible, orderCount } = await checkLaunchOfferEligibility(userId, false);

    return {
      eligible,
      orderCount,
      offerActive: true,
      discountValue: offerSettings.discountValue,
      offerName: offerSettings.name,
    };
  } catch (error) {
    console.error("Error getting current user eligibility:", error);
    return { eligible: false, orderCount: 0, offerActive: false, discountValue: 0, offerName: "Launch Offer" };
  }
}


// Helper function to calculate discount amount
export function calculateDiscount(
  subtotal: number,
  offerSettings: LaunchOffer | null,
  isEligible: boolean = true
): number {
  if (!offerSettings || !offerSettings.active || !isEligible) {
    return 0;
  }

  if (offerSettings.minOrderValue && subtotal < offerSettings.minOrderValue) {
    return 0;
  }

  if (offerSettings.validUntil && new Date() > offerSettings.validUntil) {
    return 0;
  }

  if (offerSettings.discountType === "PERCENT") {
    return Math.round((subtotal * offerSettings.discountValue) / 100);
  }

  return offerSettings.discountValue;
}

// Helper function to calculate final total with discount and shipping
export async function calculateOrderTotal(
  subtotal: number,
  userIdOrEmail?: string,
  isEmail: boolean = false
): Promise<{
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  eligible: boolean;
}> {
  const offerSettings = await getLaunchOfferSettings();
  
  let eligible = false;
  if (offerSettings && offerSettings.active && userIdOrEmail) {
    const eligibilityCheck = await checkLaunchOfferEligibility(userIdOrEmail, isEmail);
    eligible = eligibilityCheck.eligible;
  }

  const discount = calculateDiscount(subtotal, offerSettings, eligible);
  const subtotalAfterDiscount = subtotal - discount;
  const shipping = 0; // Free shipping for all orders
  const total = subtotalAfterDiscount + shipping;

  return {
    subtotal,
    discount,
    shipping,
    total,
    eligible,
  };
}

// Client-side calculation helper (for display only, not for payment)
export function calculateDiscountClient(
  subtotal: number,
  discountValue: number,
  isEligible: boolean = true
): number {
  if (!isEligible || discountValue <= 0) {
    return 0;
  }

  return Math.round((subtotal * discountValue) / 100);
}

// Client-side total calculation (for display only)
export function calculateOrderTotalClient(
  subtotal: number,
  discountValue: number,
  isEligible: boolean = true
): {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
} {
  const discount = calculateDiscountClient(subtotal, discountValue, isEligible);
  const subtotalAfterDiscount = subtotal - discount;
  const shipping = 0; // Free shipping
  const total = subtotalAfterDiscount + shipping;

  return {
    subtotal,
    discount,
    shipping,
    total,
  };
}
