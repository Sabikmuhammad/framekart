import dbConnect from "@/lib/db";
import Frame from "@/models/Frame";
import Order from "@/models/Order";
import VisitorLead from "@/models/VisitorLead";

export async function searchProducts(args: { category?: string; color?: string; maxPrice?: number; query?: string }) {
  await dbConnect();
  
  const query: any = {};
  
  if (args.category && args.category.toLowerCase() !== "all") {
    query.category = { $regex: new RegExp(args.category, "i") };
  }
  
  if (args.color) {
    // Assuming color might be in tags, title, or frame_material
    const colorRegex = new RegExp(args.color, "i");
    query.$or = [
      { tags: { $in: [colorRegex] } },
      { title: colorRegex },
      { frame_material: colorRegex }
    ];
  }
  
  if (args.maxPrice) {
    query.price = { $lte: args.maxPrice };
  }
  
  if (args.query) {
    const qRegex = new RegExp(args.query, "i");
    if (query.$or) {
      query.$and = [
        { $or: query.$or },
        { $or: [{ title: qRegex }, { description: qRegex }, { tags: { $in: [qRegex] } }] }
      ];
      delete query.$or;
    } else {
      query.$or = [{ title: qRegex }, { description: qRegex }, { tags: { $in: [qRegex] } }];
    }
  }

  const products = await Frame.find(query).limit(5).select("title price slug category imageUrl").lean();

  if (!products || products.length === 0) {
    return { results: [], message: "No products found matching the criteria." };
  }

  const normalizeImage = (url: string) => {
    if (!url) return "https://framekart.co.in/images/branding/Frame-2.png";
    if (url.startsWith("http://") || url.startsWith("https://")) return url.replace("http://", "https://");
    if (url.startsWith("/")) return "https://framekart.co.in" + url;
    return "https://framekart.co.in/" + url;
  };

  return {
    results: products.map(p => ({
      name: p.title,
      price: p.price,
      url: `https://framekart.co.in/frames/${p.slug}`,
      image: normalizeImage(p.imageUrl),
    })),
  };
}

export async function getProductBySlug(slug: string) {
  await dbConnect();
  const Frame = (await import("@/models/Frame")).default;
  const product = await Frame.findOne({ slug }).lean() as any;
  if (!product) return null;

  const normalizeImage = (url: string) => {
    if (!url) return "https://framekart.co.in/images/branding/Frame-2.png";
    if (url.startsWith("http://") || url.startsWith("https://")) return url.replace("http://", "https://");
    if (url.startsWith("/")) return "https://framekart.co.in" + url;
    return "https://framekart.co.in/" + url;
  };

  return {
    name: product.title,
    price: product.price,
    slug: product.slug,
    description: product.description,
    image: normalizeImage(product.imageUrl),
    url: `https://framekart.co.in/frames/${product.slug}`
  };
}

export async function getOrderStatus(args: { orderNumber: string }) {
  await dbConnect();
  
  const order: any = await Order.findOne({ orderNumber: args.orderNumber }).select("status totalAmount paymentStatus createdAt").lean();
  
  if (!order) {
    return { error: "Order not found. Please check the order number." };
  }

  return {
    orderNumber: args.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    total: order.totalAmount,
    date: order.createdAt
  };
}

export async function getCustomFrameInformation() {
  return {
    message: "Custom frames allow you to upload your own photo. You can choose frame size, style (Black, White, Wooden), and the occasion. You can create a custom frame directly on our website.",
    url: "https://framekart.co.in/custom-frame",
    pricing: "Starts at ₹899 depending on frame size."
  };
}

export async function humanHandoff() {
  return {
    message: "I will connect you to our support team. A representative will get back to you shortly.",
    status: "HUMAN_HANDOFF"
  };
}

export async function addToCart(args: { productSlug: string; quantity: number; sessionId: string }) {
  await dbConnect();
  
  const frame: any = await Frame.findOne({ slug: args.productSlug }).select("_id title price imageUrl").lean();
  if (!frame) {
    return { error: "Product not found. Cannot add to cart." };
  }

  const { default: CartSession } = await import("@/models/CartSession");

  // Fetch existing cart to append
  let cartSession = await CartSession.findOne({ sessionId: args.sessionId });
  let products = cartSession ? cartSession.products : [];

  const existingIndex = products.findIndex((p: any) => p.productId === frame._id.toString());
  if (existingIndex > -1) {
    products[existingIndex].quantity += args.quantity;
  } else {
    products.push({
      productId: frame._id.toString(),
      name: frame.title,
      price: frame.price,
      quantity: args.quantity,
      image: frame.imageUrl,
    });
  }

  const total = products.reduce((sum: number, p: any) => sum + p.price * p.quantity, 0);

  await CartSession.findOneAndUpdate(
    { sessionId: args.sessionId },
    {
      $set: {
        products,
        total,
        orderCompleted: false,
        abandoned: false,
        recoveryEmailSent: false,
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return {
    success: true,
    message: `Added ${frame.title} to your cart. 🛒`,
    cartTotal: total,
    productName: frame.title,
  };
}
