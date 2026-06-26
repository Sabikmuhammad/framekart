import { Schema, model, models } from "mongoose";

export type EmailSendStatus =
  | "queued"
  | "sending"
  | "sent"
  | "delivered"
  | "opened"
  | "clicked"
  | "failed"
  | "bounced";

export interface IEmailSendLog {
  campaignId: string;
  userId?: string;
  email: string;
  name?: string;
  status: EmailSendStatus;
  resendId?: string;
  error?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  failedAt?: Date;
  bouncedAt?: Date;
  lastEventAt?: Date;
}

const EmailSendLogSchema = new Schema<IEmailSendLog>(
  {
    campaignId: { type: String, required: true, index: true },
    userId: { type: String, index: true },
    email: { type: String, required: true, index: true },
    name: String,
    status: {
      type: String,
      enum: [
        "queued",
        "sending",
        "sent",
        "delivered",
        "opened",
        "clicked",
        "failed",
        "bounced",
      ],
      default: "queued",
      index: true,
    },
    resendId: { type: String, index: true },
    error: String,
    sentAt: Date,
    deliveredAt: Date,
    openedAt: Date,
    clickedAt: Date,
    failedAt: Date,
    bouncedAt: Date,
    lastEventAt: Date,
  },
  { timestamps: true }
);

EmailSendLogSchema.index({ campaignId: 1, status: 1 });
EmailSendLogSchema.index({ resendId: 1 });

const EmailSendLog = models.EmailSendLog || model<IEmailSendLog>("EmailSendLog", EmailSendLogSchema);

export default EmailSendLog;
