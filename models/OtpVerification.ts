import mongoose, { Schema, model, models } from "mongoose";

export interface IOtpVerification {
  phoneNumber: string;
  codeHash: string;
  purpose: "LOGIN" | "SIGNUP" | "PHONE_CHANGE" | "ACCOUNT_RECOVERY";
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
  resendCount: number;
  lastSentAt: Date;
  verifiedAt?: Date;
  consumedAt?: Date;
  createdAt: Date;
}

const OtpVerificationSchema = new Schema<IOtpVerification>(
  {
    phoneNumber: {
      type: String,
      required: true,
      index: true,
    },
    codeHash: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ["LOGIN", "SIGNUP", "PHONE_CHANGE", "ACCOUNT_RECOVERY"],
      default: "LOGIN",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
      required: true,
    },
    maxAttempts: {
      type: Number,
      default: 5,
      required: true,
    },
    resendCount: {
      type: Number,
      default: 0,
      required: true,
    },
    lastSentAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    verifiedAt: {
      type: Date,
    },
    consumedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index to automatically delete expired OTPs after 10 minutes from expiresAt
OtpVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 600 });

const OtpVerification = models.OtpVerification || model<IOtpVerification>("OtpVerification", OtpVerificationSchema);

export default OtpVerification;
