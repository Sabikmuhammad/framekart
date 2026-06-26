import { NextResponse } from "next/server";
import { Resend } from "resend";
import CartSession from "@/models/CartSession";
import { generateAbandonedCartEmailHtml } from "@/lib/email/abandonedCartTemplate";
import { claimRecoveryCandidate, markAbandonedCarts } from "@/lib/cart/recovery";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);
const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || "FrameKart <orders@framekart.co.in>";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://framekart.co.in";
const MAX_BATCH_SIZE = 25;

export async function GET() {
  try {
    // Always run the abandonment marker first so a single cron call is enough
    // even if the previous job invocation was skipped.
    await markAbandonedCarts();

    let sentCount = 0;
    let attemptedCount = 0;

    for (let i = 0; i < MAX_BATCH_SIZE; i += 1) {
      const cart = await claimRecoveryCandidate();
      if (!cart) break;

      attemptedCount += 1;

      try {
        const checkoutUrl = `${BASE_URL}/checkout?session=${cart.sessionId}`;
        const html = generateAbandonedCartEmailHtml(
          cart.products,
          cart.total,
          checkoutUrl
        );

        const result = await resend.emails.send({
          from: DEFAULT_FROM,
          to: [cart.email!],
          subject: "Complete your FrameKart order",
          html,
        });

        await CartSession.updateOne(
          { _id: cart._id, recoveryEmailSent: false },
          {
            $set: {
              recoveryEmailSent: true,
              recoveryEmailSentAt: new Date(),
              recoveryEmailId: (result as any)?.data?.id || (result as any)?.id,
            },
            $unset: {
              recoveryEmailLockedAt: 1,
            },
          }
        );

        sentCount++;
      } catch (err: any) {
        console.error(`Failed to send recovery email to ${cart.email}:`, err);

        await CartSession.updateOne(
          { _id: cart._id },
          {
            $unset: {
              recoveryEmailLockedAt: 1,
            },
          }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${sentCount} recovery emails`,
      sent: sentCount,
      attempted: attemptedCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to send recovery emails" },
      { status: 500 }
    );
  }
}

export const POST = GET;
