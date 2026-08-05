const encoder = new TextEncoder();

async function getCryptoKey(secret: string) {
  const keyData = encoder.encode(secret);
  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Signs a payload into a JWT-like signed token using Web Crypto HMAC SHA-256
 */
export async function signToken(payload: any, secret: string): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = btoa(JSON.stringify(header))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const key = await getCryptoKey(secret);
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${encodedHeader}.${encodedPayload}`)
  );

  const signatureArray = new Uint8Array(signatureBuffer);
  let signatureBinary = "";
  for (let i = 0; i < signatureArray.byteLength; i++) {
    signatureBinary += String.fromCharCode(signatureArray[i]);
  }
  
  const signatureBase64 = btoa(signatureBinary)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${encodedHeader}.${encodedPayload}.${signatureBase64}`;
}

/**
 * Verifies a JWT-like token signature and returns the payload if valid.
 * Returns null if signature is invalid or expired.
 */
export async function verifyToken(token: string, secret: string): Promise<any | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;

  try {
    const key = await getCryptoKey(secret);
    const data = encoder.encode(`${header}.${payload}`);

    const sigString = atob(signature.replace(/-/g, "+").replace(/_/g, "/"));
    const sigBytes = new Uint8Array(sigString.length);
    for (let i = 0; i < sigString.length; i++) {
      sigBytes[i] = sigString.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      data
    );

    if (!isValid) return null;

    // Decode and parse payload
    const payloadStr = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const decodedPayload = JSON.parse(payloadStr);

    // Check expiration
    if (decodedPayload.exp && Date.now() > decodedPayload.exp) {
      return null;
    }

    return decodedPayload;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}
