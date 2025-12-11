# Cashfree Payment Gateway Setup Guide

## Overview
FrameKart has been migrated from Razorpay to Cashfree payment gateway for processing payments.

## Prerequisites
- Cashfree account (Sign up at https://www.cashfree.com/)
- Node.js and npm installed
- MongoDB database

## Step 1: Create Cashfree Account

1. Go to https://www.cashfree.com/
2. Sign up for a merchant account
3. Complete KYC verification (required for production)
4. Access the Cashfree Dashboard

## Step 2: Get API Credentials

### Sandbox (Testing)
1. Log in to Cashfree Dashboard
2. Navigate to "Developers" → "API Keys"
3. Copy your **App ID** and **Secret Key** for sandbox

### Production
1. Complete KYC verification
2. Switch to production mode in dashboard
3. Get production **App ID** and **Secret Key**

## Step 3: Configure Environment Variables

Create or update your `.env.local` file with:

```env
# Cashfree Payment Gateway
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_ENVIRONMENT=sandbox  # or "production"
NEXT_PUBLIC_CASHFREE_MODE=sandbox  # or "production"
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change in production

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Step 4: Install Dependencies

```bash
npm install
```

The `cashfree-pg` package is already included in package.json.

## Step 5: Configure Webhook (Optional but Recommended)

1. In Cashfree Dashboard, go to "Developers" → "Webhooks"
2. Add webhook URL: `https://yourdomain.com/api/cashfree/verify`
3. Select events: `PAYMENT_SUCCESS_WEBHOOK`
4. Save webhook configuration

## Step 6: Testing

### Test in Sandbox Mode
1. Set `CASHFREE_ENVIRONMENT=sandbox`
2. Use test card details:
   - Card Number: `4111111111111111`
   - CVV: Any 3 digits
   - Expiry: Any future date
   - Name: Any name

3. Test the checkout flow:
   ```bash
   npm run dev
   ```
   - Add items to cart
   - Go to checkout
   - Fill shipping details
   - Complete payment with test card

## Step 7: Go Live

### Before Production:
1. ✅ Complete KYC verification on Cashfree
2. ✅ Test all payment flows in sandbox
3. ✅ Set up webhook for payment verification
4. ✅ Update environment variables to production
5. ✅ Test with real card (small amount)

### Production Configuration:
```env
CASHFREE_ENVIRONMENT=production
NEXT_PUBLIC_CASHFREE_MODE=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## API Endpoints

### Create Order
- **POST** `/api/cashfree/order`
- Creates a payment session with Cashfree
- Returns `payment_session_id` for checkout

### Payment Callback
- **GET** `/api/cashfree/callback`
- Handles redirect after payment
- Verifies payment and updates order status

### Verify Payment (Webhook)
- **POST** `/api/cashfree/verify`
- Receives webhook from Cashfree
- Verifies signature and updates order

## Payment Flow

1. **User adds items to cart**
2. **User goes to checkout** → Fills shipping details
3. **Create Order** → Order saved in DB with status "pending"
4. **Create Cashfree Session** → `/api/cashfree/order`
5. **Open Checkout** → Cashfree's hosted checkout page
6. **User completes payment** → Enters card/UPI details
7. **Redirect to callback** → `/api/cashfree/callback`
8. **Verify payment** → Check status with Cashfree API
9. **Update order** → Set status to "completed"
10. **Show success page** → Redirect to order details

## Migration from Razorpay

### What Changed:
- ✅ Removed `razorpay` package
- ✅ Added `cashfree-pg` package
- ✅ Created new API routes: `/api/cashfree/*`
- ✅ Updated checkout flow in `app/checkout/page.tsx`
- ✅ Updated Order model (added `cashfreeOrderId`)
- ✅ Updated environment variables
- ✅ Kept old Razorpay fields for backward compatibility

### Old Orders:
- Orders created with Razorpay remain unchanged
- Database keeps `razorpayOrderId` and `razorpaySignature` fields
- New orders use `cashfreeOrderId` field

## Troubleshooting

### Payment Session Creation Fails
- ✅ Check API credentials are correct
- ✅ Verify environment (sandbox vs production)
- ✅ Check customer details are provided (name, email, phone)

### Payment Verification Fails
- ✅ Check webhook URL is accessible
- ✅ Verify signature validation
- ✅ Check order ID matches

### Checkout Doesn't Open
- ✅ Ensure Cashfree SDK script loads
- ✅ Check `NEXT_PUBLIC_CASHFREE_MODE` is set
- ✅ Verify payment session ID is valid

### Order Status Not Updating
- ✅ Check callback URL is correct
- ✅ Verify database connection
- ✅ Check order ID in callback

## Support

- **Cashfree Docs**: https://docs.cashfree.com/
- **Cashfree Support**: support@cashfree.com
- **API Reference**: https://docs.cashfree.com/reference/pg-new-apis-endpoint

## Security Best Practices

1. ✅ Never expose secret keys in client-side code
2. ✅ Always verify payment signatures
3. ✅ Use HTTPS in production
4. ✅ Implement webhook signature verification
5. ✅ Store API keys in environment variables
6. ✅ Use sandbox for testing, production for live
7. ✅ Monitor failed payments in dashboard
8. ✅ Set up alerts for payment anomalies

## Cashfree vs Razorpay

| Feature | Cashfree | Razorpay |
|---------|----------|----------|
| Transaction Fee | Lower | Higher |
| Settlement Time | T+1 | T+2 |
| API Simplicity | ✅ Modern | Older |
| Checkout UX | ✅ Smoother | Good |
| International | Limited | Better |
| Success Rate | High | High |

## Next Steps

After setup:
1. Test complete checkout flow
2. Verify webhook integration
3. Test refund process (if needed)
4. Monitor transactions in dashboard
5. Set up email notifications
6. Configure invoice generation
