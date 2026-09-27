import mongoose, { Schema, model, models } from "mongoose";

export interface IBulkOrderItem {
  productId?: mongoose.Types.ObjectId;
  title: string;
  price: number; // Unit price before bulk discount
  quantity: number;
  imageUrl?: string;
  type: "REGULAR" | "CUSTOM" | "TEMPLATE";
  configuration?: any; // Store custom frame configs
}

export interface IBulkOrder {
  orderNumber?: string;
  userId?: mongoose.Types.ObjectId;
  leadId?: mongoose.Types.ObjectId;
  
  orderType: "Wedding" | "Corporate" | "Event" | "School/College" | "Hotel" | "Business" | "Personal" | "Other";
  
  customer: {
    firstName: string;
    lastName?: string;
    phone: string;
    email: string;
  };
  
  organisation?: {
    name: string;
    gstNumber?: string;
    designation?: string;
    website?: string;
  };
  
  delivery: {
    addressLine1: string;
    addressLine2?: string;
    area?: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
  };
  
  items: IBulkOrderItem[];
  
  totalQuantity: number;
  
  pricing: {
    subtotal: number;
    bulkDiscount: number;
    customisationFee: number;
    shipping: number;
    tax: number;
    finalTotal: number;
  };
  
  requiredDate?: Date;
  specialInstructions?: string;
  attachments?: string[]; // URLs of uploaded files
  
  status: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "QUOTE_SENT" | "QUOTE_ACCEPTED" | "PAYMENT_PENDING" | "PAID" | "IN_PRODUCTION" | "QUALITY_CHECK" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  
  paymentStatus: "pending" | "completed" | "failed";
  cashfreeOrderId?: string;
  paymentId?: string;
  
  quote?: {
    validUntil?: Date;
    note?: string;
    adminId?: mongoose.Types.ObjectId;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const BulkOrderSchema = new Schema<IBulkOrder>(
  {
    orderNumber: { type: String, unique: true, sparse: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    leadId: { type: Schema.Types.ObjectId, ref: "VisitorLead" },
    
    orderType: { type: String, required: true },
    
    customer: {
      firstName: { type: String, required: true },
      lastName: { type: String },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    
    organisation: {
      name: { type: String },
      gstNumber: { type: String },
      designation: { type: String },
      website: { type: String },
    },
    
    delivery: {
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      area: { type: String },
      landmark: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Frame" },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        imageUrl: { type: String },
        type: { type: String, enum: ["REGULAR", "CUSTOM", "TEMPLATE"], required: true },
        configuration: { type: Schema.Types.Mixed },
      }
    ],
    
    totalQuantity: { type: Number, required: true },
    
    pricing: {
      subtotal: { type: Number, required: true, default: 0 },
      bulkDiscount: { type: Number, required: true, default: 0 },
      customisationFee: { type: Number, required: true, default: 0 },
      shipping: { type: Number, required: true, default: 0 },
      tax: { type: Number, required: true, default: 0 },
      finalTotal: { type: Number, required: true, default: 0 },
    },
    
    requiredDate: { type: Date },
    specialInstructions: { type: String },
    attachments: [{ type: String }],
    
    status: {
      type: String,
      enum: [
        "DRAFT", "SUBMITTED", "UNDER_REVIEW", "QUOTE_SENT", "QUOTE_ACCEPTED", 
        "PAYMENT_PENDING", "PAID", "IN_PRODUCTION", "QUALITY_CHECK", "PACKED", 
        "SHIPPED", "DELIVERED", "CANCELLED"
      ],
      default: "DRAFT"
    },
    
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending"
    },
    cashfreeOrderId: { type: String },
    paymentId: { type: String },
    
    quote: {
      validUntil: { type: Date },
      note: { type: String },
      adminId: { type: Schema.Types.ObjectId, ref: "User" },
    },
  },
  { timestamps: true }
);

// Pre-save hook to generate orderNumber if not exists
BulkOrderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    try {
      const Model = mongoose.model("BulkOrder");
      const count = await Model.countDocuments();
      const nextNumber = count + 1;
      const date = new Date();
      const year = date.getFullYear();
      this.orderNumber = `FK-BULK-${year}-${String(nextNumber).padStart(6, "0")}`;
    } catch (error) {
      console.error("Error generating BulkOrder number:", error);
    }
  }
  next();
});

// Indexes for performance
BulkOrderSchema.index({ orderNumber: 1 });
BulkOrderSchema.index({ userId: 1 });
BulkOrderSchema.index({ "customer.email": 1 });
BulkOrderSchema.index({ "customer.phone": 1 });
BulkOrderSchema.index({ status: 1 });
BulkOrderSchema.index({ paymentStatus: 1 });
BulkOrderSchema.index({ createdAt: -1 });

export const BulkOrder = models.BulkOrder || model<IBulkOrder>("BulkOrder", BulkOrderSchema);
