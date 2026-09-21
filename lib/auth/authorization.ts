import { validateSession } from "./session";
import User, { IUser } from "@/models/User";
import dbConnect from "@/lib/db";

export class AuthenticationError extends Error {
  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = "Forbidden") {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * Ensures the request is authenticated and returns the User.
 * Throws an error if authentication fails or if the user is suspended/deleted.
 */
export async function requireAuth(): Promise<IUser & { _id: string }> {
  const session = await validateSession();
  
  if (!session) {
    throw new AuthenticationError();
  }

  await dbConnect();
  const user = await User.findById(session.userId);

  if (!user) {
    throw new AuthenticationError("User not found.");
  }

  if (user.status !== "ACTIVE") {
    throw new AuthorizationError(`Account is ${user.status.toLowerCase()}.`);
  }

  return user;
}

/**
 * Safely fetches the current authenticated user without throwing errors.
 */
export async function getCurrentUser(): Promise<(IUser & { _id: string }) | null> {
  try {
    return await requireAuth();
  } catch (e) {
    return null;
  }
}

/**
 * Ensures the authenticated user has the required role.
 */
export async function requireRole(allowedRoles: ("ADMIN" | "STAFF" | "CUSTOMER")[]): Promise<IUser & { _id: string }> {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    throw new AuthorizationError("Insufficient permissions.");
  }

  return user;
}
