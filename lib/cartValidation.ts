import Frame from "@/models/Frame";

export interface ValidatedCartResult {
  subtotal: number;
  validatedItems: any[];
}

/**
 * Validates a standard cart by fetching product prices from the database.
 * Prevents clients from manipulating item prices or subtotals.
 */
export async function validateCartItems(items: any[]): Promise<ValidatedCartResult> {
  if (!items || items.length === 0) {
    throw new Error("Cart is empty");
  }

  const productIds = items.map((item: any) => item.productId).filter(Boolean);
  
  if (productIds.length !== items.length) {
    throw new Error("Invalid cart items: Missing productId");
  }

  // Fetch all products from DB
  const dbProducts = await Frame.find({ _id: { $in: productIds } }).lean();
  
  if (dbProducts.length !== productIds.length) {
    // Some products were not found in the DB
    throw new Error("One or more products in your cart are no longer available. Please review your cart.");
  }

  let subtotal = 0;
  const validatedItems = items.map((item: any) => {
    const dbProduct = dbProducts.find((p: any) => p._id.toString() === item.productId.toString());
    
    if (!dbProduct) {
      throw new Error(`Product ${item.productId} not found`);
    }

    if (dbProduct.stock !== undefined && item.quantity > dbProduct.stock) {
      throw new Error(`Only ${dbProduct.stock} items available for ${dbProduct.title}`);
    }

    // Force price to match DB
    const validatedPrice = dbProduct.price;
    subtotal += validatedPrice * item.quantity;

    return {
      ...item,
      price: validatedPrice,
      title: dbProduct.title, // Also force title to match DB for security
    };
  });

  return { subtotal, validatedItems };
}

/**
 * Validates a custom or template frame order.
 * Currently enforces a fixed base price (e.g., A4 -> 999).
 */
export async function validateCustomCart(
  items: any[], 
  frameSize: string = "A4"
): Promise<ValidatedCartResult> {
  if (!items || items.length === 0) {
    throw new Error("Cart is empty");
  }

  // Enforce pricing logic on the backend.
  // Right now, Custom frames and Template frames use a base price of 999 for A4.
  // This can be expanded as more sizes are supported.
  let basePrice = 999;
  
  if (frameSize === "12x18") basePrice = 1499;
  else if (frameSize === "18x24") basePrice = 1999;
  else if (frameSize === "24x36") basePrice = 2999;

  let subtotal = 0;
  const validatedItems = items.map((item: any) => {
    subtotal += basePrice * item.quantity;
    
    return {
      ...item,
      price: basePrice, // Force server-calculated price
    };
  });

  return { subtotal, validatedItems };
}
