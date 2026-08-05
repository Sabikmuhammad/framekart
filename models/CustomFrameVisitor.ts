import mongoose, { Schema, model, models } from "mongoose";

export interface ICustomFrameVisitor {
  visitorId: string;
  name?: string;
  phone: string;
  source: string;
  firstVisitedAt: Date;
  lastVisitedAt: Date;
  visitCount: number;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomFrameVisitorSchema = new Schema<ICustomFrameVisitor>(
  {
    visitorId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
      index: true,
    },
    source: {
      type: String,
      default: "custom-frame",
    },
    firstVisitedAt: {
      type: Date,
      default: Date.now,
    },
    lastVisitedAt: {
      type: Date,
      default: Date.now,
    },
    visitCount: {
      type: Number,
      default: 1,
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
  },
  {
    timestamps: true,
  }
);

const CustomFrameVisitor =
  models.CustomFrameVisitor ||
  model<ICustomFrameVisitor>("CustomFrameVisitor", CustomFrameVisitorSchema, "custom_frame_visitors");

export default CustomFrameVisitor;
