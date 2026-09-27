import mongoose, { Schema, model, models } from "mongoose";

export interface IRateLimit {
  key: string;
  count: number;
  expireAt: Date;
}

const RateLimitSchema = new Schema<IRateLimit>({
  key: { type: String, required: true, index: true, unique: true },
  count: { type: Number, required: true, default: 1 },
  expireAt: { type: Date, required: true, expires: 0 } // TTL index automatically deletes document when expireAt is reached
});

const RateLimit = models.RateLimit || model<IRateLimit>("RateLimit", RateLimitSchema);

export default RateLimit;
