import mongoose, { Schema, model, models } from "mongoose";

export interface IVisitorLead {
  sessionToken: string;
  name?: string;
  phone?: string;
  email?: string;
  source: string;
  trigger?: string;
  firstVisitedAt: Date;
  lastSeenAt: Date;
  capturedAt?: Date;
  pagesViewed: number;
  productViews: number;
  cartActivity: boolean;
  currentPage?: string;
  status: "active" | "converted" | "inactive";
  consent: {
    marketing: boolean;
  };
  metadata?: {
    userAgent?: string;
    referrer?: string;
  };
  whatsappWelcomeSent?: boolean;
  whatsappWelcomeMessageId?: string;
  whatsappWelcomeError?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VisitorLeadSchema = new Schema<IVisitorLead>(
  {
    sessionToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    source: {
      type: String,
      default: "organic",
    },
    trigger: {
      type: String,
    },
    firstVisitedAt: {
      type: Date,
      default: Date.now,
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
    capturedAt: {
      type: Date,
    },
    pagesViewed: {
      type: Number,
      default: 1,
    },
    productViews: {
      type: Number,
      default: 0,
    },
    cartActivity: {
      type: Boolean,
      default: false,
    },
    currentPage: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "converted", "inactive"],
      default: "active",
    },
    consent: {
      marketing: {
        type: Boolean,
        default: false,
      },
    },
    metadata: {
      userAgent: String,
      referrer: String,
    },
    whatsappWelcomeSent: {
      type: Boolean,
      default: false,
    },
    whatsappWelcomeMessageId: String,
    whatsappWelcomeError: String,
  },
  {
    timestamps: true,
  }
);

// We index phone for faster lookups later when trying to merge guest checkouts
VisitorLeadSchema.index({ phone: 1 }, { sparse: true });

const VisitorLead =
  models.VisitorLead || model<IVisitorLead>("VisitorLead", VisitorLeadSchema);

export default VisitorLead;
