import crypto from "crypto";

/**
 * Generates a cryptographically secure 6-digit OTP.
 */
export function generateOTP(): string {
  // Generate a random number between 100000 and 999999
  const min = 100000;
  const max = 999999;
  const otp = crypto.randomInt(min, max + 1);
  return otp.toString();
}

/**
 * Hashes an OTP using SHA-256 for secure storage.
 * (For OTPs with limited lifespan and rate limiting, SHA-256 is generally sufficient).
 */
export function hashOTP(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

/**
 * Verifies an OTP against a hash.
 */
export function verifyOTP(otp: string, hash: string): boolean {
  const inputHash = hashOTP(otp);
  // Prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(inputHash, "utf-8"),
      Buffer.from(hash, "utf-8")
    );
  } catch (e) {
    return false; // In case of length mismatch, though hashes should be same length
  }
}

/**
 * Normalizes an Indian phone number to E.164 format.
 * Defaults to +91 if no country code is provided.
 */
export function normalizePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, ""); // Remove all non-digits

  if (cleaned.length === 10) {
    cleaned = `91${cleaned}`; // Prepend default country code
  } else if (cleaned.length > 10 && cleaned.startsWith("0")) {
    cleaned = `91${cleaned.substring(1)}`; // Replace leading 0 with 91
  }

  return `+${cleaned}`; // Ensure it's E.164 format
}

/**
 * Validates a normalized Indian phone number.
 */
export function isValidIndianPhoneNumber(phone: string): boolean {
  // Must start with +91 and be exactly 13 characters long total
  const regex = /^\+91[6-9]\d{9}$/;
  return regex.test(phone);
}
