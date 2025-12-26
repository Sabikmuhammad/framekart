import mongoose, { Schema, model, models } from "mongoose";

export interface IOfferSetting {
  name: string; // e.g., "Launch Offer"
  active: boolean;
  discountType: "PERCENT" | "FIXED";
  discountValue: number; // e.g., 15 for 15%
  maxOrdersPerUser: number; // e.g., 3 for first 3 orders only
  minOrderValue?: number; // Minimum cart value to qualify
  validUntil?: Date; // Optional expiry date
  createdAt: Date;
  updatedAt: Date;
}

const OfferSettingSchema = new Schema<IOfferSetting>(
  {
    name: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    discountType: {
      type: String,
      enum: ["PERCENT", "FIXED"],
      default: "PERCENT",
    },
    discountValue: {
      type: Number,
      required: true,
    },
    maxOrdersPerUser: {
      type: Number,
      default: 3,
    },
    minOrderValue: {
      type: Number,
      default: 0,
    },
    validUntil: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const OfferSetting =
  models.OfferSetting || model<IOfferSetting>("OfferSetting", OfferSettingSchema);

export default OfferSetting;
