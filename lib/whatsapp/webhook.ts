import crypto from "crypto";

/**
 * Validates the X-Hub-Signature-256 header sent by Meta Webhooks.
 *
 * @param payload The raw request body as a string.
 * @param signature The signature header (e.g. "sha256=....")
 * @param appSecret The Meta App Secret
 * @returns boolean true if valid, false otherwise.
 */
export function verifyWhatsAppSignature(
  payload: string,
  signature: string | null,
  appSecret: string
): boolean {
  if (!signature || !signature.startsWith("sha256=")) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", appSecret)
    .update(payload)
    .digest("hex");

  const expectedSignatureWithPrefix = `sha256=${expectedSignature}`;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "utf-8"),
      Buffer.from(expectedSignatureWithPrefix, "utf-8")
    );
  } catch (e) {
    return false;
  }
}
