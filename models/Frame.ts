import mongoose, { Schema, model, models } from "mongoose";

export interface IFrame {
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  frame_material: string;
  frame_size: string;
  tags: string[];
  imageUrl: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const FrameSchema = new Schema<IFrame>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    frame_material: {
      type: String,
      required: true,
    },
    frame_size: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Frame = models.Frame || model<IFrame>("Frame", FrameSchema);

export default Frame;
