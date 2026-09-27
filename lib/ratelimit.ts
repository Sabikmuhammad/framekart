import dbConnect from "./db";
import RateLimit from "@/models/RateLimit";

/**
 * Validates whether a given key has exceeded its rate limit.
 * 
 * @param key Unique identifier (e.g., "login_admin_ip_192.168.1.1")
 * @param limit Maximum allowed requests in the window
 * @param windowMs Time window in milliseconds
 * @returns boolean True if allowed, false if rate limited
 */
export async function checkRateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  await dbConnect();
  
  const now = new Date();
  
  // Use findOneAndUpdate with upsert to increment or create atomically
  const record = await RateLimit.findOneAndUpdate(
    { key },
    {
      $inc: { count: 1 },
      $setOnInsert: { expireAt: new Date(now.getTime() + windowMs) }
    },
    { upsert: true, new: true }
  );

  if (record.count > limit) {
    return false; // Rate limited
  }

  return true; // Allowed
}
