// Launch Offer Configuration
// Client-side calculation helpers (safe for Client Components)

export interface LaunchOffer {
  name: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  active: boolean;
  maxOrdersPerUser: number;
  minOrderValue?: number;
  validUntil?: Date;
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
