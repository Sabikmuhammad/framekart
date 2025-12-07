import mongoose, { Schema, model, models } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface IOrder {
  userId: string;
  items: IOrderItem[];
  totalAmount: number;
  paymentStatus: "pending" | "completed" | "failed";
  paymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  address: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Frame",
          required: true,
        },
        title: String,
        price: Number,
        quantity: Number,
        imageUrl: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentId: String,
    razorpayOrderId: String,
    razorpaySignature: String,
    address: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
    },
  },
  {
    timestamps: true,
  }
);

const Order = models.Order || model<IOrder>("Order", OrderSchema);

export default Order;
