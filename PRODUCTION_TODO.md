# Production TODOs

## 🔴 CRITICAL (Must implement before launch)

### 1. Email System Implementation
**Priority:** CRITICAL  
**Time:** 2-3 hours  
**Status:** ⚠️ Not Implemented

The contact form now has an API endpoint but doesn't actually send emails. Order confirmations are also missing.

**Implementation:**

1. Install Resend:
```bash
npm install resend
```

2. Create `/lib/email.ts`:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(order: {
  id: string;
  customerEmail: string;
  customerName: string;
  totalAmount: number;
  items: any[];
  address: any;
}) {
  await resend.emails.send({
    from: 'FrameKart Orders <orders@framekart.co.in>',
    to: order.customerEmail,
    subject: `Order Confirmation #${order.id}`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Hi ${order.customerName},</p>
      <p>Your order has been confirmed.</p>
      <h2>Order Details</h2>
      <ul>
        ${order.items.map(item => `<li>${item.title} x ${item.quantity} - ₹${item.price}</li>`).join('')}
      </ul>
      <p><strong>Total: ₹${order.totalAmount}</strong></p>
      <p>Shipping to: ${order.address.addressLine1}, ${order.address.city}</p>
    `,
  });
}

export async function sendContactFormEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  await resend.emails.send({
    from: 'FrameKart Contact <contact@framekart.co.in>',
    to: 'support@framekart.co.in',
    replyTo: data.email,
    subject: `Contact Form: ${data.subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${data.name} (${data.email})</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `,
  });
}
```

3. Update `/app/api/contact/route.ts`:
```typescript
import { sendContactFormEmail } from '@/lib/email';

// Inside POST handler, after validation:
await sendContactFormEmail(validatedData);
```

4. Update `/app/api/cashfree/callback/route.ts` (create if missing):
```typescript
import { sendOrderConfirmation } from '@/lib/email';

// After payment verification success:
const order = await Order.findById(orderId).populate('items');
await sendOrderConfirmation({
  id: order._id,
  customerEmail: order.customerEmail, // Add this field to Order model
  customerName: order.address.fullName,
  totalAmount: order.totalAmount,
  items: order.items,
  address: order.address,
});
```

5. Add email field to Order model in `/models/Order.ts`:
```typescript
customerEmail: {
  type: String,
  required: true,
},
```

6. Update order creation in `/app/api/orders/route.ts`:
```typescript
const order = await Order.create({
  userId,
  items,
  totalAmount,
  address,
  customerEmail: user.emailAddresses[0].emailAddress, // Get from Clerk
  paymentStatus: "pending",
});
```

**Domain Setup for Resend:**
1. Go to Resend Dashboard → Domains
2. Add domain: `framekart.co.in`
3. Add these DNS records to your domain registrar:
   - TXT record for verification
   - MX records for receiving
   - CNAME records for sending
4. Wait for verification (up to 72 hours)
5. Meanwhile, test with `onboarding@resend.dev`

---

### 2. Rate Limiting Implementation
**Priority:** CRITICAL (Security)  
**Time:** 1 hour  
**Status:** ⚠️ Not Implemented

**Implementation:**

1. Install Upstash Redis:
```bash
npm install @upstash/ratelimit @upstash/redis
```

2. Sign up at https://upstash.com and create Redis database

3. Add to `.env.local`:
```
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxx
```

4. Create `/lib/rate-limit.ts`:
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
  analytics: true,
});
```

5. Apply to sensitive routes (orders, payments, contact):
```typescript
import { ratelimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'anonymous';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }
  
  // ... rest of handler
}
```

---

### 3. Add Customer Email to Checkout
**Priority:** HIGH  
**Time:** 30 minutes  
**Status:** ⚠️ Missing Field

Currently checkout doesn't collect customer email for order confirmations.

**Fix:**

Update `/app/checkout/page.tsx` - add email field:
```typescript
const [formData, setFormData] = useState({
  fullName: user?.fullName || "",
  email: user?.primaryEmailAddress?.emailAddress || "",
  phone: "",
  // ... rest
});

// In the form JSX:
<div className="grid gap-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    name="email"
    type="email"
    value={formData.email}
    onChange={handleInputChange}
    required
  />
</div>
```

Update validation in `/lib/validation.ts`:
```typescript
address: z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(), // Add this
  phone: z.string().regex(/^\d{10}$/),
  // ... rest
}),
```

---

## 🟡 HIGH PRIORITY (Should implement soon)

### 4. Structured Data for Products
**Priority:** HIGH (SEO)  
**Time:** 1 hour

Add JSON-LD schema to product pages for rich snippets.

**Implementation:** See `PRODUCTION_REVIEW.md` Issue #14

---

### 5. Image Optimization
**Priority:** HIGH (Performance)  
**Time:** 30 minutes

Add `priority` to hero images and `loading="lazy"` to below-fold images.

**Files to update:**
- `/app/page.tsx` - Hero image should have `priority`
- `/components/FrameCard.tsx` - Product images should be lazy
- `/app/frames/page.tsx` - Category images should be lazy

---

### 6. Admin Order Status Update with Notifications
**Priority:** HIGH (UX)  
**Time:** 1 hour

When admin updates order status, send email to customer.

---

## 🟢 MEDIUM PRIORITY (Nice to have)

### 7. Analytics Event Tracking
**Priority:** MEDIUM  
**Time:** 1 hour

Track custom events:
- Add to cart
- Checkout initiated
- Payment completed
- Custom frame created

### 8. Customer Order Tracking
**Priority:** MEDIUM  
**Time:** 2 hours

Allow customers to track order status without logging in.

### 9. Abandoned Cart Recovery
**Priority:** MEDIUM  
**Time:** 3 hours

Email customers who added items but didn't checkout.

### 10. Product Reviews System
**Priority:** MEDIUM  
**Time:** 4 hours

Allow customers to review purchased products.

---

## 📝 DOCUMENTATION

### 11. API Documentation
Create API documentation for:
- Order endpoints
- Frame endpoints
- Admin endpoints

### 12. Admin User Guide
Document how to:
- Add new products
- Manage orders
- Upload images
- Update inventory

---

## Testing Checklist

Before marking any TODO as complete, test:

- [ ] Happy path works
- [ ] Error handling works
- [ ] Mobile responsive
- [ ] Loading states shown
- [ ] Success messages clear
- [ ] Error messages helpful
- [ ] No console errors
- [ ] TypeScript compiles
- [ ] Works in production build

---

## Priority Order for Implementation

1. **Email System** (CRITICAL - 2-3 hours)
2. **Rate Limiting** (CRITICAL - 1 hour)
3. **Customer Email Field** (HIGH - 30 min)
4. **Image Optimization** (HIGH - 30 min)
5. **Structured Data** (HIGH - 1 hour)
6. **Analytics Events** (MEDIUM - 1 hour)
7. **Order Tracking** (MEDIUM - 2 hours)

---

**Estimated Total Time:** 8-10 hours for critical and high priority items
