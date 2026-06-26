import dbConnect from "@/lib/db";
import CartSession from "@/models/CartSession";

const ABANDONED_AFTER_MS = 30 * 60 * 1000;
const EMAIL_LOCK_STALE_MS = 10 * 60 * 1000;

export function getAbandonedCutoff(now = new Date()) {
  return new Date(now.getTime() - ABANDONED_AFTER_MS);
}

export async function markAbandonedCarts(now = new Date()) {
  await dbConnect();

  const abandonedAt = now;
  const cutoff = getAbandonedCutoff(now);

  const result = await CartSession.updateMany(
    {
      orderCompleted: false,
      abandoned: false,
      updatedAt: { $lt: cutoff },
      "products.0": { $exists: true },
    },
    {
      $set: {
        abandoned: true,
        abandonedAt,
      },
    }
  );

  return result.modifiedCount || 0;
}

export async function markCartSessionCompleted(input: {
  sessionId?: string | null;
  email?: string | null;
}) {
  await dbConnect();

  const filters = [];
  if (input.sessionId) filters.push({ sessionId: input.sessionId });
  if (input.email) filters.push({ email: input.email.toLowerCase() });
  if (!filters.length) return 0;

  const result = await CartSession.updateMany(
    {
      orderCompleted: false,
      $or: filters,
    },
    {
      $set: {
        orderCompleted: true,
        abandoned: false,
        completedAt: new Date(),
      },
      $unset: {
        recoveryEmailLockedAt: 1,
        abandonedAt: 1,
      },
    }
  );

  return result.modifiedCount || 0;
}

export async function claimRecoveryCandidate(now = new Date()) {
  await dbConnect();

  const staleLockCutoff = new Date(now.getTime() - EMAIL_LOCK_STALE_MS);

  return CartSession.findOneAndUpdate(
    {
      abandoned: true,
      orderCompleted: false,
      recoveryEmailSent: false,
      email: { $exists: true, $ne: "" },
      "products.0": { $exists: true },
      $or: [
        { recoveryEmailLockedAt: { $exists: false } },
        { recoveryEmailLockedAt: null },
        { recoveryEmailLockedAt: { $lt: staleLockCutoff } },
      ],
    },
    {
      $set: {
        recoveryEmailLockedAt: now,
      },
    },
    {
      sort: { updatedAt: 1 },
      new: true,
    }
  );
}
