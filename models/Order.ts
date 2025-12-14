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
  customerEmail: string; // Customer email for order confirmation
  items: IOrderItem[];
  totalAmount: number;
  paymentStatus: "pending" | "completed" | "failed";
  paymentId?: string;
  cashfreeOrderId?: string;
  razorpayOrderId?: string; // Keep for backward compatibility
  razorpaySignature?: string; // Keep for backward compatibility
  address: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  // Custom Frame fields
  type?: "regular" | "custom";
  customFrame?: {
    imageUrl: string;
    frameStyle: "Black" | "White" | "Wooden";
    frameSize: "A4" | "12x18" | "18x24" | "24x36";
    customerNotes?: string;
  };
  status?: "Pending" | "Processing" | "Printed" | "Shipped" | "Delivered";
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Frame",
          required: false, // Optional for custom frames
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
    cashfreeOrderId: String,
    razorpayOrderId: String, // Keep for backward compatibility
    razorpaySignature: String, // Keep for backward compatibility
    address: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
    },
    type: {
      type: String,
      enum: ["regular", "custom"],
      default: "regular",
    },
    customFrame: {
      imageUrl: String,
      frameStyle: {
        type: String,
        enum: ["Black", "White", "Wooden"],
      },
      frameSize: {
        type: String,
        enum: ["A4", "12x18", "18x24", "24x36"],
      },
      customerNotes: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Printed", "Shipped", "Delivered"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = models.Order || model<IOrder>("Order", OrderSchema);

export default Order;
