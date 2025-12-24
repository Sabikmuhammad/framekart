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
  // Discount/Offer fields
  discount?: {
    name: string; // e.g., "Launch Offer"
    type: "PERCENT" | "FIXED";
    value: number; // e.g., 15 for 15%
    amount: number; // Actual discount amount in rupees
  };
  subtotal?: number; // Original subtotal before discount
  shipping?: number; // Shipping cost
  // Custom Frame fields
  type?: "regular" | "custom";
  customFrame?: {
    imageUrl: string;
    frameStyle: "Black" | "White" | "Wooden";
    frameSize: "A4" | "12x18" | "18x24" | "24x36";
    customerNotes?: string;
    occasion?: "custom" | "birthday" | "wedding";
    occasionMetadata?: {
      // Birthday-specific
      name?: string;
      age?: string;
      date?: string;
      message?: string;
      // Wedding-specific
      brideName?: string;
      groomName?: string;
      weddingDate?: string;
      quote?: string;
    };
  };
  // Template Frame fields (NEW)
  productType?: "REGULAR" | "CUSTOM" | "TEMPLATE";
  templateFrame?: {
    occasion: "birthday" | "wedding";
    templateImage: string; // Fixed template image URL
    uploadedPhoto?: string; // Optional customer photo
    frameSize: "A4";
    frameStyle: "Black" | "White" | "Wooden";
    metadata: {
      // Birthday fields
      name?: string;
      age?: string;
      date?: string;
      message?: string;
      // Wedding fields
      brideName?: string;
      groomName?: string;
      weddingDate?: string;
      quote?: string;
    };
    designStatus: "PENDING" | "COMPLETED";
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
    discount: {
      name: String,
      type: {
        type: String,
        enum: ["PERCENT", "FIXED"],
      },
      value: Number,
      amount: Number,
    },
    subtotal: Number,
    shipping: Number,
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
      occasion: {
        type: String,
        enum: ["custom", "birthday", "wedding"],
        default: "custom",
      },
      occasionMetadata: {
        // Birthday fields
        name: String,
        age: String,
        date: String,
        message: String,
        // Wedding fields
        brideName: String,
        groomName: String,
        weddingDate: String,
        quote: String,
      },
    },
    productType: {
      type: String,
      enum: ["REGULAR", "CUSTOM", "TEMPLATE"],
      default: "REGULAR",
    },
    templateFrame: {
      occasion: {
        type: String,
        enum: ["birthday", "wedding"],
      },
      templateImage: String,
      uploadedPhoto: String,
      frameSize: {
        type: String,
        enum: ["A4"],
        default: "A4",
      },
      frameStyle: {
        type: String,
        enum: ["Black", "White", "Wooden"],
        default: "Black",
      },
      metadata: {
        // Birthday fields
        name: String,
        age: String,
        date: String,
        message: String,
        // Wedding fields
        brideName: String,
        groomName: String,
        weddingDate: String,
        quote: String,
      },
      designStatus: {
        type: String,
        enum: ["PENDING", "COMPLETED"],
        default: "PENDING",
      },
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
