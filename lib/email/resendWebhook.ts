import crypto from "crypto";

export function verifyResendSignature(rawBody: string, signature?: string | null) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return true;
  if (!signature) return false;

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
