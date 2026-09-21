import { cookies } from "next/headers";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import Session from "@/models/Session";

export const SESSION_COOKIE_NAME = "framekart_session";
const SESSION_MAX_AGE_DAYS = 30;

/**
 * Generates a secure random session token.
 */
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

/**
 * Hashes a session token for secure database storage.
 */
function hashSessionToken(token: string): string {
  // A fast, secure hash is sufficient since the token itself is 32 bytes of high entropy
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Creates a new session in the database and sets the HTTP-only cookie.
 */
export async function createSession(userId: string, req?: Request): Promise<string> {
  await dbConnect();

  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_MAX_AGE_DAYS);

  let ipAddress = undefined;
  let userAgent = undefined;

  if (req) {
    ipAddress = req.headers.get("x-forwarded-for") || undefined;
    userAgent = req.headers.get("user-agent") || undefined;
  }

  await Session.create({
    userId,
    tokenHash,
    expiresAt,
    ipAddress,
    userAgent,
  });

  // Set Cookie
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

/**
 * Revokes the current session and clears the cookie.
 */
export async function revokeSession(): Promise<void> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await dbConnect();
    const tokenHash = hashSessionToken(token);
    await Session.findOneAndUpdate(
      { tokenHash, revokedAt: { $exists: false } },
      { revokedAt: new Date() }
    );
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Revokes all sessions for a given user.
 */
export async function revokeAllUserSessions(userId: string): Promise<void> {
  await dbConnect();
  await Session.updateMany(
    { userId, revokedAt: { $exists: false } },
    { revokedAt: new Date() }
  );
}

/**
 * Gets the current raw session token from the cookie.
 */
export function getSessionToken(): string | null {
  const cookieStore = cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value || null;
}

/**
 * Validates the session token against the database.
 * Returns the session object if valid, otherwise null.
 */
export async function validateSession() {
  const token = getSessionToken();
  if (!token) return null;

  await dbConnect();
  const tokenHash = hashSessionToken(token);

  const session = await Session.findOne({
    tokenHash,
    revokedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  });

  if (!session) return null;

  // Update lastUsedAt optionally (could be batched for high traffic)
  // session.lastUsedAt = new Date();
  // await session.save();

  return session;
}
