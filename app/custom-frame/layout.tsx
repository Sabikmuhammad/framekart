import { Metadata } from "next";
import { cookies, headers } from "next/headers";
import dbConnect from "@/lib/db";
import { verifyToken } from "@/lib/token";
import { trackEvent } from "@/lib/analytics";
import CustomFrameVisitor from "@/models/CustomFrameVisitor";
import { PhoneOnboardingModal } from "@/components/custom-frames/PhoneOnboardingModal";

export const metadata: Metadata = {
  title: "Custom Frame Designer | FrameKart",
  description: "Create your perfect custom frame. Upload your image, choose size and style, and we'll craft a premium quality frame just for you. Fast delivery across India.",
  keywords: "custom frames, personalized frames, photo framing, custom picture frames",
  openGraph: {
    title: "Custom Frame Designer | FrameKart",
    description: "Design and order your custom frame online",
    url: "https://framekart.co.in/custom-frame",
  },
};

export default async function CustomFrameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("framekart_custom_user")?.value;

  let showModal = true;
  let visitorId: string | undefined = undefined;

  const reqHeaders = headers();
  const userAgent = reqHeaders.get("user-agent") || "Unknown";
  const referrer = reqHeaders.get("referer") || "Direct";
  const ipAddress = reqHeaders.get("x-forwarded-for")?.split(",")[0] || reqHeaders.get("x-real-ip") || "127.0.0.1";

  if (token) {
    const secret = process.env.CUSTOM_FRAME_COOKIE_SECRET || "default_framekart_cookie_secret_fallback_key_length_32";
    const payload = await verifyToken(token, secret);

    if (payload && payload.visitorId) {
      visitorId = payload.visitorId;
      showModal = false;

      // Update returning visitor details & track returning_visit in the background
      try {
        dbConnect().then(() => {
          CustomFrameVisitor.updateOne(
            { visitorId },
            {
              $inc: { visitCount: 1 },
              $set: {
                lastVisitedAt: new Date(),
                ipAddress,
                userAgent,
              },
            }
          ).catch(e => console.error("Update error:", e));
        }).catch(e => console.error("DB connection error:", e));

        // Track analytics page load & returning visit
        trackEvent({
          visitorId,
          event: "page_opened",
          ipAddress,
          userAgent,
          referrer,
        });

        trackEvent({
          visitorId,
          event: "returning_visit",
          ipAddress,
          userAgent,
          referrer,
        });
      } catch (error) {
        console.error("Failed to update visitor stats server-side:", error);
      }
    }
  }

  // If no valid visitor session, track as first-time visit page open
  if (showModal) {
    try {
      trackEvent({
        event: "page_opened",
        ipAddress,
        userAgent,
        referrer,
      });
      trackEvent({
        event: "first_time_visit",
        ipAddress,
        userAgent,
        referrer,
      });
    } catch (e) {
      console.error("Failed to track first time visit events:", e);
    }
  }

  return (
    <>
      {children}
      {showModal && <PhoneOnboardingModal />}
    </>
  );
}
