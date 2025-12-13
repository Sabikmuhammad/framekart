# Production Deployment Checklist

## ⚠️ CRITICAL - Do This BEFORE Going Live

### 1. Environment Variables (Vercel Dashboard)

Go to your Vercel project → Settings → Environment Variables and add:

#### Authentication (CRITICAL)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx (from Clerk Dashboard)
CLERK_SECRET_KEY=sk_live_xxxxx (from Clerk Dashboard)
CLERK_WEBHOOK_SECRET=whsec_xxxxx (from Clerk Webhooks)
```

**Setup Clerk Webhook:**
1. Go to Clerk Dashboard → Webhooks
2. Add endpoint: `https://framekart.co.in/api/webhooks/clerk`
3. Subscribe to events: `user.created`, `user.updated`
4. Copy signing secret and add as `CLERK_WEBHOOK_SECRET`

#### Payment Gateway (CRITICAL)
```
CASHFREE_APP_ID=[Your Production App ID]
CASHFREE_SECRET_KEY=[Your Production Secret Key]
CASHFREE_ENVIRONMENT=production
NEXT_PUBLIC_CASHFREE_MODE=production
```

**Get Production Keys:**
1. Go to Cashfree Dashboard
2. Complete KYC verification
3. Switch to Production mode
4. Copy App ID and Secret Key

#### Site Configuration
```
NEXT_PUBLIC_APP_URL=https://framekart.co.in
SITE_URL=https://framekart.co.in
ADMIN_USER_ID=[Your Clerk User ID]
```

#### Database
```
MONGODB_URI=[Keep your existing MongoDB URI]
```

#### Cloudinary
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=[Keep existing]
CLOUDINARY_API_KEY=[Keep existing]
CLOUDINARY_API_SECRET=[Keep existing]
```

**Apply to all environments:**
- ✅ Production
- ✅ Preview (optional, can use test keys)
- ✅ Development (optional)

### 2. Security Actions

#### Rotate Exposed Credentials
Your `.env.local` file contains exposed credentials. Rotate these immediately:

1. **MongoDB Password**
   - Go to MongoDB Atlas → Database Access
   - Change password for user `sabikrayya0`
   - Update `MONGODB_URI` in Vercel

2. **Cloudinary API Secret**
   - Go to Cloudinary Dashboard → Settings → Security
   - Reset API Secret
   - Update in Vercel

3. **Cashfree Keys**
   - Switch to production keys (different from test)

#### Verify .gitignore
Ensure `.env.local` is in `.gitignore`:
```bash
git check-ignore .env.local
# Should output: .env.local
```

If not listed, add it and remove from Git:
```bash
echo ".env.local" >> .gitignore
git rm --cached .env.local
git commit -m "Remove .env.local from version control"
```

### 3. Email System Setup (IMPORTANT)

Install and configure Resend for order confirmations:

```bash
npm install resend
```

**Get Resend API Key:**
1. Sign up at https://resend.com
2. Verify your domain `framekart.co.in`:
   - Add DNS records (TXT, MX, CNAME)
   - Wait for verification
3. Generate API key
4. Add to Vercel: `RESEND_API_KEY=re_xxxxx`

**Create Email Service:**
See `PRODUCTION_TODO.md` for implementation details.

### 4. Code Quality Checks

Run these before deploying:

```bash
# Check for TypeScript errors
npm run build

# Verify no sensitive data in code
grep -r "sk_test" app/
grep -r "pk_test" app/
grep -r "TEST1091" app/

# Should return nothing
```

### 5. Vercel Project Settings

#### Enable Security Headers
Settings → Headers → Add:
```json
{
  "source": "/(.*)",
  "headers": [
    {
      "key": "X-Frame-Options",
      "value": "DENY"
    },
    {
      "key": "X-Content-Type-Options",
      "value": "nosniff"
    },
    {
      "key": "Referrer-Policy",
      "value": "strict-origin-when-cross-origin"
    },
    {
      "key": "Permissions-Policy",
      "value": "geolocation=(), microphone=(), camera=()"
    }
  ]
}
```

#### Enable Production Protection
- Settings → General → Enable "Vercel Authentication"
- Add team members who need access

### 6. Testing Checklist

Before announcing launch:

#### Payment Testing
- [ ] Create test order with ₹1 amount
- [ ] Complete payment successfully
- [ ] Verify order appears in admin dashboard
- [ ] Check payment status updates correctly
- [ ] Test payment failure scenario

#### Authentication
- [ ] Sign up with new email
- [ ] Sign in with Google
- [ ] Verify profile page loads
- [ ] Logout and login again

#### Admin Access
- [ ] Verify only admin can access `/admin`
- [ ] Test creating new frame
- [ ] Test updating order status
- [ ] Test uploading images

#### Custom Frame Flow
- [ ] Upload custom image
- [ ] Select size and style
- [ ] Add to cart
- [ ] Complete checkout
- [ ] Verify order in admin

#### Mobile Experience
- [ ] Test on real mobile device
- [ ] Check navigation works
- [ ] Verify cart functions
- [ ] Test checkout form

### 7. Monitoring Setup (Recommended)

#### Sentry for Error Tracking
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Add to Vercel:
```
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

#### Vercel Analytics
Already installed ✅ - Just verify in Vercel dashboard

### 8. Post-Launch Monitoring

After deployment:

#### First Hour
- [ ] Monitor Vercel deployment logs
- [ ] Check error rates in dashboard
- [ ] Test live payment with small amount
- [ ] Verify Clerk webhooks working

#### First Day
- [ ] Check Cashfree dashboard for transactions
- [ ] Monitor order creation rate
- [ ] Verify email deliverability (if implemented)
- [ ] Check Google Search Console for crawling

#### First Week
- [ ] Review error logs daily
- [ ] Check customer feedback
- [ ] Monitor payment success rate
- [ ] Verify sitemap indexed by Google

### 9. Rollback Plan

If critical issues occur:

1. **Revert Deployment:**
   ```
   Vercel Dashboard → Deployments → [Previous Deployment] → Promote to Production
   ```

2. **Disable Payment:**
   - Set Cashfree back to sandbox mode
   - Add maintenance banner

3. **Communication:**
   - Update status page
   - Inform customers via social media

### 10. Go-Live Command

Once all above steps are complete:

```bash
# Final check
npm run build

# Commit fixes
git add .
git commit -m "Production ready - security fixes and optimizations"
git push

# Vercel will auto-deploy
```

## Post-Deployment URLs to Check

- ✅ https://framekart.co.in
- ✅ https://framekart.co.in/sitemap.xml
- ✅ https://framekart.co.in/robots.txt
- ✅ https://framekart.co.in/admin (should require auth)
- ✅ https://framekart.co.in/api/frames (should return JSON)

## Support Contacts

- **Clerk Support:** https://clerk.com/support
- **Cashfree Support:** support@cashfree.com
- **Vercel Support:** vercel.com/support
- **MongoDB Support:** mongodb.com/support

---

## Estimated Timeline

- **Environment Setup:** 30 minutes
- **Credential Rotation:** 15 minutes
- **Email Setup:** 1 hour
- **Testing:** 2 hours
- **Monitoring Setup:** 30 minutes

**Total:** ~4-5 hours to production ready

## Final Pre-Launch Checklist

- [ ] All environment variables set in Vercel
- [ ] Clerk webhook configured and tested
- [ ] Cashfree production keys active
- [ ] Credentials rotated
- [ ] Email system working (or documented as TODO)
- [ ] Test payment completed successfully
- [ ] Admin access verified
- [ ] Mobile testing complete
- [ ] Monitoring configured
- [ ] Team briefed on rollback plan

**Once all checked, you're ready to launch! 🚀**
