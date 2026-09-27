export const BULK_MIN_QUANTITY = 50;

export interface BulkPricingTier {
  minQuantity: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
}

export const CUSTOM_FRAME_PRICES: Record<string, number> = {
  "A4": 999,
  "12x18": 1499,
  "18x24": 1999,
  "24x36": 2999,
};

// Configurable pricing tiers
export const BULK_PRICING_TIERS: BulkPricingTier[] = [
  { minQuantity: 50, discountType: "percentage", discountValue: 15 },
  { minQuantity: 100, discountType: "percentage", discountValue: 25 },
  { minQuantity: 250, discountType: "percentage", discountValue: 35 },
  { minQuantity: 500, discountType: "percentage", discountValue: 50 },
];

export const QUOTE_REQUIRED_THRESHOLD = 500;

export function canDirectCheckout(totalQuantity: number): boolean {
  return totalQuantity < QUOTE_REQUIRED_THRESHOLD;
}

export interface BulkPricingResult {
  totalQuantity: number;
  subtotal: number;
  bulkDiscount: number;
  customisationFee: number;
  shipping: number;
  tax: number;
  finalTotal: number;
  appliedDiscountPercentage: number;
}

export function calculateBulkPricing(items: Array<{ price: number; quantity: number }>): BulkPricingResult {
  let totalQuantity = 0;
  let subtotal = 0;
  let customisationFee = 0; // Reserved for specific bulk customisations

  for (const item of items) {
    totalQuantity += item.quantity;
    subtotal += item.price * item.quantity;
  }

  let discountPercentage = 0;
  
  // Find applicable tier by reversing the sorted array and taking the first match
  for (const tier of [...BULK_PRICING_TIERS].sort((a, b) => b.minQuantity - a.minQuantity)) {
    if (totalQuantity >= tier.minQuantity) {
      if (tier.discountType === "percentage") {
        discountPercentage = tier.discountValue;
      }
      break;
    }
  }

  const bulkDiscount = Math.round(subtotal * (discountPercentage / 100));
  
  // FrameKart Business Rule: Bulk orders get free shipping
  const shipping = 0; 
  const tax = 0; // Assuming inclusive

  const finalTotal = subtotal - bulkDiscount + customisationFee + shipping + tax;

  return {
    totalQuantity,
    subtotal,
    bulkDiscount,
    customisationFee,
    shipping,
    tax,
    finalTotal,
    appliedDiscountPercentage: discountPercentage,
  };
}
