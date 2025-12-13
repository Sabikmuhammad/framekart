# 📧 Email System Troubleshooting Guide - FrameKart

## Quick Diagnosis

### Step 1: Test Email Configuration
```bash
# Visit this endpoint in your browser or use curl:
curl http://localhost:3000/api/email/test

# Expected response:
{
  "timestamp": "2025-12-13T...",
  "config": {
    "configured": true,
    "issues": [],
    "env": {
      "RESEND_API_KEY": "✅ Set",
      "EMAIL_FROM": "FrameKart <support@framekart.co.in>",
      "ADMIN_EMAIL": "muhammedsabik@framekart.co.in"
    }
  }
}
```

### Step 2: Send Test Email
```bash
# Send a simple test email
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@gmail.com", "testType": "simple"}'

# Send a full order confirmation test
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@gmail.com", "testType": "order"}'
```

## Common Issues & Solutions

### ❌ Issue 1: "Domain not verified"
**Symptoms:**
- Resend returns error: "Domain not verified"
- Email FROM domain doesn't match verified domain

**Solution:**
1. Go to [Resend Dashboard → Domains](https://resend.com/domains)
2. Verify `framekart.co.in` is listed and shows "Verified" status
3. Check DNS records are properly configured:
   - SPF: `v=spf1 include:_spf.resend.com ~all`
   - DKIM: (provided by Resend)
   - DMARC: (recommended)

4. Ensure `EMAIL_FROM` exactly matches verified domain:
```env
# ✅ Correct
EMAIL_FROM=FrameKart <support@framekart.co.in>

# ❌ Wrong
EMAIL_FROM=support@framekart.co.in  # Missing display name can cause issues
EMAIL_FROM=FrameKart <noreply@gmail.com>  # Using unverified domain
```

### ❌ Issue 2: "Emails not appearing in Resend dashboard"
**Symptoms:**
- No errors but emails don't show in Resend Emails page
- Silent failures

**Possible Causes:**
1. **Using test API key in production** - Test keys may not log emails
2. **API key from wrong account** - Check you're logged into correct Resend account
3. **Rate limiting** - Free tier has daily limits

**Solution:**
```bash
# Check which API key you're using
echo $RESEND_API_KEY

# Verify it starts with:
# re_**** (production key)
# test_**** (test key - may not show in dashboard)
```

### ❌ Issue 3: "Email sent but not received"
**Symptoms:**
- Resend shows email sent successfully
- Email doesn't arrive in inbox

**Solution:**
1. **Check spam folder** - First place to look!
2. **Check recipient email is correct** - Typos are common
3. **Wait 1-2 minutes** - Sometimes there's a delay
4. **Check Resend logs** for delivery status:
   - Go to Resend Dashboard → Emails
   - Click on the email ID
   - Check "Events" tab for delivery status

5. **Test with delivered@resend.dev**:
```bash
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email": "delivered@resend.dev", "testType": "simple"}'
```
This should ALWAYS work if Resend is configured correctly.

### ❌ Issue 4: "Missing API key error at build time"
**Symptoms:**
- Build fails with "Missing API key"
- Error: `new Resend()` called during build

**Solution:**
Already fixed in your code! We use lazy initialization:
```typescript
// ✅ Correct - Lazy initialization
let resendInstance: Resend | null = null;
function getResendClient(): Resend {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

// ❌ Wrong - Runs at build time
const resend = new Resend(process.env.RESEND_API_KEY);
```

### ❌ Issue 5: "Environment variables not loading"
**Symptoms:**
- `process.env.RESEND_API_KEY` is undefined
- Works locally but not in production

**Solution:**

**For Local Development (.env.local):**
```bash
# Check .env.local exists
cat .env.local | grep RESEND

# Restart dev server after changes
npm run dev
```

**For Vercel Production:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add these variables:
```
RESEND_API_KEY=re_****
EMAIL_FROM=FrameKart <support@framekart.co.in>
ADMIN_EMAIL=muhammedsabik@framekart.co.in
```
3. **Important:** Redeploy after adding env vars!

## Verification Checklist

Run through this checklist to ensure everything is configured correctly:

### ✅ Environment Variables
```bash
# Check all required variables are set
[ ] RESEND_API_KEY is set (starts with re_)
[ ] EMAIL_FROM is set (format: "Name <email@framekart.co.in>")
[ ] ADMIN_EMAIL is set (your admin email)
```

### ✅ Resend Dashboard
```bash
[ ] Domain framekart.co.in is verified
[ ] DNS records are configured (SPF, DKIM)
[ ] API key is from correct account
[ ] Not exceeding rate limits (check usage)
```

### ✅ Code Implementation
```bash
[ ] Using lazy initialization (not initializing at module level)
[ ] Proper error handling and logging
[ ] Email sending is server-side only (API routes)
[ ] Using correct EMAIL_FROM format
```

### ✅ Test Results
```bash
[ ] GET /api/email/test returns configured: true
[ ] POST /api/email/test sends email successfully
[ ] Email arrives at delivered@resend.dev
[ ] Email arrives at your Gmail/real email
[ ] Email appears in Resend dashboard
[ ] Order emails work in production flow
```

## Email Flow in Your App

### Current Implementation:
```
1. Customer completes payment (Cashfree)
   ↓
2. app/api/cashfree/callback/route.ts
   - Order status updated to "completed"
   ↓
3. Fetch POST /api/email/send
   - type: "order-confirmation" (customer email)
   - type: "admin-notification" (admin email)
   ↓
4. lib/email-service.ts
   - sendOrderConfirmationEmail()
   - sendAdminNotificationEmail()
   ↓
5. Resend API
   - Emails sent via Resend
   ↓
6. Customer receives order confirmation
7. Admin receives order notification
```

## Best Practices

### ✅ DO:
- Use proper error handling with try-catch
- Log email IDs for tracking: `console.log('Email sent:', emailId)`
- Use tags in Resend for categorization
- Test with delivered@resend.dev first
- Keep EMAIL_FROM consistent with verified domain
- Use replyTo for customer support emails
- Check spam folders when testing

### ❌ DON'T:
- Initialize Resend at module level (causes build errors)
- Send emails from client-side (always use API routes)
- Use unverified domains in EMAIL_FROM
- Expose RESEND_API_KEY in client code
- Send emails in loops without rate limiting
- Ignore error responses from Resend

## Debugging Commands

```bash
# Check if dev server can access env vars
curl http://localhost:3000/api/email/test

# Send test email
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email": "delivered@resend.dev", "testType": "simple"}'

# Test order confirmation
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "type": "order-confirmation",
    "customerEmail": "test@example.com",
    "customerName": "Test User",
    "orderId": "TEST123",
    "totalAmount": 1000,
    "orderItems": [{"title": "Frame", "quantity": 1, "price": 1000}]
  }'

# Check Vercel logs (production)
vercel logs --follow

# Check local logs
npm run dev
# Then make a test purchase and watch console
```

## Resend Dashboard Verification

1. **Go to Resend Dashboard**
   - Visit: https://resend.com/emails

2. **Check Recent Emails**
   - Should see your test emails listed
   - Click on email to see full details

3. **Verify Delivery Status**
   - Status should be "Delivered" (green)
   - If "Bounced" or "Complained", check recipient email

4. **Check Email Content**
   - Click "Preview" to see how email looks
   - Verify HTML renders correctly

## Need More Help?

1. Check server logs: `npm run dev` and watch console
2. Check Vercel deployment logs in dashboard
3. Test with delivered@resend.dev (always works if configured correctly)
4. Verify domain in Resend dashboard shows green checkmark
5. Check spam folder (common issue!)

## Production Deployment Checklist

Before deploying to production:

```bash
[ ] Verified domain in Resend (framekart.co.in)
[ ] DNS records configured (SPF, DKIM, DMARC)
[ ] Environment variables set in Vercel:
    - RESEND_API_KEY
    - EMAIL_FROM
    - ADMIN_EMAIL
[ ] Tested locally with real email addresses
[ ] Tested with delivered@resend.dev
[ ] Confirmed emails appear in Resend dashboard
[ ] Checked spam folders don't receive emails
[ ] Verified email templates look good on mobile
[ ] Set up email monitoring/alerts
```

## Success Indicators

Your email system is working correctly when:
- ✅ GET /api/email/test returns `configured: true`
- ✅ POST /api/email/test sends email successfully
- ✅ Email arrives within 1 minute
- ✅ Email appears in Resend dashboard with "Delivered" status
- ✅ Order confirmation emails sent after payment
- ✅ Admin receives order notifications
- ✅ No errors in server logs
- ✅ Emails not going to spam folder

---

**Last Updated:** December 13, 2025  
**Email System Version:** Production-ready with Resend
