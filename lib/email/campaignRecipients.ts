import User from "@/models/User";
import Order from "@/models/Order";

export interface RecipientFilter {
  filterType:
    | "all"
    | "recent_buyers"
    | "high_value"
    | "inactive"
    | "country"
    | "total_orders";
  minOrders?: number;
  minSpend?: number;
  daysSinceOrder?: number;
  country?: string;
}

export async function resolveRecipients(filter: RecipientFilter) {
  if (filter.filterType === "all") {
    const users = await User.find({}).lean();
    return users.map((user) => ({
      userId: user.clerkId,
      email: user.email,
      name: user.name,
    }));
  }

  if (filter.filterType === "recent_buyers") {
    const since = new Date(Date.now() - (filter.daysSinceOrder || 30) * 24 * 60 * 60 * 1000);
    const orders = await Order.aggregate([
      { $match: { createdAt: { $gte: since }, paymentStatus: "completed" } },
      { $group: { _id: "$userId" } },
    ]);
    const userIds = orders.map((order) => order._id).filter(Boolean);
    const users = await User.find({ clerkId: { $in: userIds } }).lean();
    return users.map((user) => ({ userId: user.clerkId, email: user.email, name: user.name }));
  }

  if (filter.filterType === "high_value") {
    const minSpend = filter.minSpend || 5000;
    const orders = await Order.aggregate([
      { $match: { paymentStatus: "completed" } },
      { $group: { _id: "$userId", total: { $sum: "$totalAmount" } } },
      { $match: { total: { $gte: minSpend } } },
    ]);
    const userIds = orders.map((order) => order._id).filter(Boolean);
    const users = await User.find({ clerkId: { $in: userIds } }).lean();
    return users.map((user) => ({ userId: user.clerkId, email: user.email, name: user.name }));
  }

  if (filter.filterType === "total_orders") {
    const minOrders = filter.minOrders || 2;
    const orders = await Order.aggregate([
      { $match: { paymentStatus: "completed" } },
      { $group: { _id: "$userId", total: { $sum: 1 } } },
      { $match: { total: { $gte: minOrders } } },
    ]);
    const userIds = orders.map((order) => order._id).filter(Boolean);
    const users = await User.find({ clerkId: { $in: userIds } }).lean();
    return users.map((user) => ({ userId: user.clerkId, email: user.email, name: user.name }));
  }

  if (filter.filterType === "inactive") {
    const days = filter.daysSinceOrder || 60;
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const recentOrders = await Order.aggregate([
      { $match: { createdAt: { $gte: cutoff }, paymentStatus: "completed" } },
      { $group: { _id: "$userId" } },
    ]);
    const recentIds = new Set(recentOrders.map((order) => order._id));
    const users = await User.find({}).lean();
    return users
      .filter((user) => !recentIds.has(user.clerkId))
      .map((user) => ({ userId: user.clerkId, email: user.email, name: user.name }));
  }

  if (filter.filterType === "country") {
    return [];
  }

  return [];
}
