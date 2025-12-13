import { z } from 'zod';

// Order validation schema
export const OrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    title: z.string().min(1).max(200),
    price: z.number().positive().max(1000000),
    quantity: z.number().int().min(1).max(99),
    imageUrl: z.string().url(),
  })).min(1).max(50),
  totalAmount: z.number().positive().max(10000000),
  address: z.object({
    fullName: z.string().min(2).max(100),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
    addressLine1: z.string().min(5).max(200),
    addressLine2: z.string().max(200).optional(),
    city: z.string().min(2).max(100),
    state: z.string().min(2).max(100),
    pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  }),
});

// Cashfree order validation
export const CashfreeOrderSchema = z.object({
  amount: z.number().positive().max(10000000),
  customerPhone: z.string().regex(/^\d{10}$/),
  customerEmail: z.string().email(),
  customerName: z.string().min(2).max(100),
  orderId: z.string().min(1),
});

// Custom frame order validation
export const CustomFrameOrderSchema = z.object({
  imageUrl: z.string().url(),
  frameStyle: z.enum(['Black', 'White', 'Wooden']),
  frameSize: z.enum(['A4', '12x18', '18x24', '24x36']),
  customerNotes: z.string().max(500).optional(),
  totalAmount: z.number().positive().max(10000000),
  address: z.object({
    fullName: z.string().min(2).max(100),
    phone: z.string().regex(/^\d{10}$/),
    addressLine1: z.string().min(5).max(200),
    addressLine2: z.string().max(200).optional(),
    city: z.string().min(2).max(100),
    state: z.string().min(2).max(100),
    pincode: z.string().regex(/^\d{6}$/),
  }),
});

// Contact form validation
export const ContactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(2000),
});
