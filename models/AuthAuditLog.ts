import mongoose, { Schema, model, models } from "mongoose";

export interface IAuthAuditLog {
  userId?: string;
  phoneNumber?: string;
  event: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
  createdAt: Date;
}

const AuthAuditLogSchema = new Schema<IAuthAuditLog>(
  {
    userId: {
      type: String, // String to allow both Clerk IDs and ObjectIds during migration
      index: true,
    },
    phoneNumber: {
      type: String,
      index: true,
    },
    event: {
      type: String,
      required: true,
      index: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Logs don't update
  }
);

const AuthAuditLog = models.AuthAuditLog || model<IAuthAuditLog>("AuthAuditLog", AuthAuditLogSchema);

export default AuthAuditLog;
