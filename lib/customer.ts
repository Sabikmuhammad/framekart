import dbConnect from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import VisitorLead from "@/models/VisitorLead";

import { BulkOrder } from "@/models/BulkOrder";

export async function processCustomerForOrder(orderId: string, orderType: string = "regular") {
  await dbConnect();
  
  const Model = orderType === "bulk" ? BulkOrder : Order;
  const order = await Model.findById(orderId);
  if (!order) return null;

  // Idempotency: If order already has a userId, return it
  if (order.userId) {
    return order.userId.toString();
  }

  const customerDetails = orderType === "bulk" ? {
    name: order.customer.firstName + (order.customer.lastName ? ` ${order.customer.lastName}` : ""),
    phone: order.customer.phone,
    email: order.customer.email,
  } : order.customer;
  
  if (!customerDetails || !customerDetails.phone) return null;

  // Normalize phone number (last 10 digits for India, etc)
  let normalizedPhone = customerDetails.phone.replace(/\D/g, "");
  if (normalizedPhone.length > 10) {
    normalizedPhone = normalizedPhone.slice(-10);
  }

  // 3. Atomically upsert user (find existing or create) to prevent race conditions
  const phoneNumber = `+91${normalizedPhone}`;
  let user = await User.findOneAndUpdate(
    { phoneNumber },
    {
      $setOnInsert: {
        name: customerDetails.name || "Customer",
        role: "CUSTOMER",
        status: "ACTIVE",
      },
      $set: {
        ...(customerDetails.email && { email: customerDetails.email }),
      }
    },
    { new: true, upsert: true }
  );

  // 4. Associate order with user
  order.userId = user._id;
  await order.save();

  // 5. Check if there's a lead for this phone number and convert it
  await VisitorLead.updateMany(
    { mobileNumber: { $regex: new RegExp(`${normalizedPhone}$`) }, status: { $ne: "converted" } },
    { $set: { status: "converted" } }
  );

  return user._id.toString();
}
