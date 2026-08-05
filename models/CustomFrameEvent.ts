import mongoose, { Schema, model, models } from "mongoose";

export interface ICustomFrameEvent {
  visitorId?: string;
  event: "page_opened" | "modal_displayed" | "modal_submitted" | "modal_cancelled" | "returning_visit" | "first_time_visit";
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  timestamp: Date;
}

const CustomFrameEventSchema = new Schema<ICustomFrameEvent>(
  {
    visitorId: {
      type: String,
      index: true,
    },
    event: {
      type: String,
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    referrer: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }
);

const CustomFrameEvent =
  models.CustomFrameEvent ||
  model<ICustomFrameEvent>("CustomFrameEvent", CustomFrameEventSchema, "custom_frame_events");

export default CustomFrameEvent;
