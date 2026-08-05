import dbConnect from "@/lib/db";
import CustomFrameEvent from "@/models/CustomFrameEvent";

export interface TrackEventParams {
  visitorId?: string;
  event: "page_opened" | "modal_displayed" | "modal_submitted" | "modal_cancelled" | "returning_visit" | "first_time_visit";
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}

export async function trackEvent(params: TrackEventParams) {
  try {
    await dbConnect();
    await CustomFrameEvent.create({
      visitorId: params.visitorId,
      event: params.event,
      sessionId: params.sessionId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      referrer: params.referrer,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Failed to track event:", error);
  }
}
