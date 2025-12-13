# 🎯 Email System - Quick Start Guide

## ✅ Your Email System is Working!

**Test Result:** Email ID `d6a3be77-bb0a-480e-b581-723e60843eba` sent successfully to `delivered@resend.dev`

---

## 📧 Current Configuration

```env
RESEND_API_KEY=re_XmaQBstz_B2tXQyDqf4cUzmuUmEXaBt2i
EMAIL_FROM=FrameKart <support@framekart.co.in>
ADMIN_EMAIL=muhammedsabik@framekart.co.in
```

✅ Domain `framekart.co.in` is **verified** in Resend
✅ Email service is **production-ready**

---

## 🚀 Quick Test Commands

### Test Email Configuration
```bash
node test-email.js
```
This script will:
- Check all environment variables
- Send a test email to `delivered@resend.dev`
- Show email ID for tracking in Resend dashboard

### Test with Real Email
Edit `test-email.js` and change:
```javascript
to: ["your-email@gmail.com"],  // Change this line
```

---

## 📝 How to Use Email Service

### In Your Code

```typescript
import {
  sendOrderConfirmationEmail,
  sendAdminNotificationEmail,
} from "@/lib/email-service";

// Send order confirmation to customer
const result = await sendOrderConfirmationEmail(customerEmail, {
  customerName: "John Doe",
  orderId: "ORDER123",
  totalAmount: 2500,
  orderItems: [
    {
      title: "Wooden Frame 8x10",
      quantity: 1,
      price: 2500,
    },
  ],
  address: {
    fullName: "John Doe",
    phone: "9876543210",
    addressLine1: "123 Main Street",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
  },
});

if (result.success) {
  console.log("✅ Email sent:", result.emailId);
} else {
  console.error("❌ Email failed:", result.error);
}
```

---

## 🔍 Where Emails Are Sent

### Customer Order Confirmation
- **Triggered:** After successful Cashfree payment callback
- **Location:** `/app/api/cashfree/callback/route.ts`
- **Template:** Customer-friendly with order details, delivery address
- **Recipient:** Customer's email from payment data

### Admin Order Notification
- **Triggered:** Same time as customer email
- **Location:** `/app/api/cashfree/callback/route.ts`
- **Template:** Admin-focused with customer details, order summary
- **Recipient:** `muhammedsabik@framekart.co.in` (from ADMIN_EMAIL env var)

---

## 📊 Check Email Logs

### Resend Dashboard
1. Visit: https://resend.com/emails
2. See all sent emails with delivery status
3. Click email to see full details, events, and preview

### Server Logs
When emails are sent, you'll see:
```
📧 Sending emails to: customer@example.com for order: 123456
✅ Email sent successfully: d6a3be77-bb0a-480e-b581-723e60843eba
```

---

## 🎨 Email Templates

### Files
- `/lib/email-templates.ts` - HTML template generators
- `/lib/email-service.ts` - Reusable email sending utilities

### Customize
Edit `/lib/email-templates.ts` to:
- Change email design/colors
- Add/remove sections
- Update branding

---

## 🔧 Common Tasks

### Change Admin Email
Update `.env.local`:
```env
ADMIN_EMAIL=newemail@framekart.co.in
```
Restart dev server: `npm run dev`

### Change Email Sender Name
Update `.env.local`:
```env
EMAIL_FROM=New Name <support@framekart.co.in>
```
**Important:** Email domain must stay `@framekart.co.in` (verified domain)

### Add More Email Types
1. Create template function in `/lib/email-templates.ts`
2. Create sender function in `/lib/email-service.ts`
3. Call from your API route

---

## 🚨 Troubleshooting

### Emails Not Received?
1. **Check spam folder** - Most common issue!
2. Run test: `node test-email.js`
3. Check Resend dashboard for delivery status
4. Verify recipient email address is correct

### "Domain not verified" Error?
- Go to https://resend.com/domains
- Ensure `framekart.co.in` shows "Verified"
- Check DNS records are configured

### "Missing API key" Error?
- Check `.env.local` has `RESEND_API_KEY`
- Restart dev server after adding env vars
- For production, check Vercel environment variables

### No Logs in Resend Dashboard?
- Confirm you're logged into correct Resend account
- API key must be from production (starts with `re_`)
- Test keys may not show in dashboard

---

## 📦 Production Deployment

### Vercel Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

```
RESEND_API_KEY=re_XmaQBstz_B2tXQyDqf4cUzmuUmEXaBt2i
EMAIL_FROM=FrameKart <support@framekart.co.in>
ADMIN_EMAIL=muhammedsabik@framekart.co.in
```

**After adding:** Trigger new deployment or redeploy

### Verify Production
1. Make a test order in production
2. Check customer receives email
3. Check admin receives notification
4. Verify in Resend dashboard

---

## 📚 Documentation Files

- `EMAIL_TROUBLESHOOTING.md` - Comprehensive troubleshooting guide
- `test-email.js` - Quick email configuration test
- `/lib/email-service.ts` - Email service with full error handling
- `/lib/email-templates.ts` - HTML email templates
- `/app/api/email/send/route.ts` - Email API endpoint
- `/app/api/email/test/route.ts` - Email test API (for web testing)

---

## ✅ Checklist - Everything Working

- [x] Domain verified in Resend (`framekart.co.in`)
- [x] Environment variables configured
- [x] Test email sent successfully
- [x] Email service integrated in order flow
- [x] Admin notifications configured
- [x] Error handling and logging in place
- [x] Production-ready code deployed

---

**Your email system is fully configured and working! 🎉**

For detailed troubleshooting, see `EMAIL_TROUBLESHOOTING.md`
