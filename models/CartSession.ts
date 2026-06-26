import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICartProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ICartSession extends Document {
  sessionId: string;
  email?: string;
  products: ICartProduct[];
  total: number;
  orderCompleted: boolean;
  abandoned: boolean;
  recoveryEmailSent: boolean;
  abandonedAt?: Date;
  completedAt?: Date;
  recoveryEmailSentAt?: Date;
  recoveryEmailId?: string;
  recoveryEmailLockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<ICartProduct>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String }
});

const CartSessionSchema = new Schema<ICartSession>(
  {
    // Unique session to track the cart across updates
    sessionId: { type: String, required: true, unique: true, index: true },
    // Email is needed to send the recovery email
    email: { type: String },
    // Products in the cart
    products: [ProductSchema],
    // Total cost of the cart
    total: { type: Number, required: true, default: 0 },
    // Has the user completed the checkout?
    orderCompleted: { type: Boolean, default: false, index: true },
    // Has the cart been marked as abandoned?
    abandoned: { type: Boolean, default: false, index: true },
    // Have we sent the recovery email to prevent duplicates?
    recoveryEmailSent: { type: Boolean, default: false, index: true },
    abandonedAt: { type: Date, index: true },
    completedAt: { type: Date, index: true },
    recoveryEmailSentAt: { type: Date, index: true },
    recoveryEmailId: { type: String, index: true },
    recoveryEmailLockedAt: { type: Date, index: true },
  },
  { timestamps: true }
);

CartSessionSchema.index({ orderCompleted: 1, abandoned: 1, updatedAt: 1 });
CartSessionSchema.index({ recoveryEmailSent: 1, recoveryEmailLockedAt: 1 });

const CartSession: Model<ICartSession> =
  mongoose.models.CartSession || mongoose.model<ICartSession>('CartSession', CartSessionSchema);

export default CartSession;
