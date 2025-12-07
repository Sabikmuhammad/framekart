# 🚀 Quick Start Guide for FrameKart

## Prerequisites

Before you begin, make sure you have:
- Node.js 18+ installed
- A MongoDB Atlas account (free tier works)
- A Clerk account (free tier works)
- A Razorpay account (test mode works)
- A Cloudinary account (free tier works)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password

### 3. Set Up Clerk Authentication

1. Go to [Clerk](https://clerk.com)
2. Create a new application
3. In the dashboard, go to API Keys
4. Copy the Publishable Key and Secret Key
5. Go to Webhooks → Add Endpoint
6. Set URL: `https://your-domain.com/api/webhooks/clerk`
7. Subscribe to: `user.created`, `user.updated`, `user.deleted`
8. Copy the Signing Secret

### 4. Set Up Razorpay

1. Go to [Razorpay](https://razorpay.com)
2. Sign up and create an account
3. Go to Settings → API Keys
4. Generate Test/Live keys
5. Copy Key ID and Key Secret

### 5. Set Up Cloudinary

1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for free account
3. In Dashboard, find:
   - Cloud Name
   - API Key
   - API Secret

### 6. Configure Environment Variables

Create `.env.local` file in root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/framekart?retryWrites=true&w=majority

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 7. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 8. Create Admin User

1. Sign up for a new account at `/sign-up`
2. In MongoDB Atlas, find your user in the `users` collection
3. Change the `role` field from `"user"` to `"admin"`
4. Refresh the page - you should now see "Admin" link in navbar

### 9. Add Sample Frames

Option A - Using Admin Panel:
1. Go to `/admin/frames`
2. Click "Add Frame"
3. Fill in the form with frame details
4. Upload images using `/admin/uploads`

Option B - Using Seed Data:
1. Check `lib/seed-data.ts` for dummy frames
2. Use the admin panel to add them manually

### 10. Test the Application

#### Test User Flow:
1. Browse frames at `/frames`
2. View frame details
3. Add to cart
4. Go to checkout
5. Test payment with Razorpay test cards:
   - Card: 4111 1111 1111 1111
   - CVV: Any 3 digits
   - Expiry: Any future date

#### Test Admin Flow:
1. Login as admin
2. Go to `/admin`
3. Create/Edit/Delete frames
4. View orders and users
5. Upload images

## 🌐 Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add all environment variables from `.env.local`
6. Click "Deploy"
7. Update Clerk webhook URL to your Vercel domain

## 📱 Important URLs

- **Home**: `/`
- **Frames**: `/frames`
- **Cart**: `/cart`
- **Checkout**: `/checkout`
- **Profile**: `/profile`
- **Admin**: `/admin`
- **Sign In**: `/sign-in`
- **Sign Up**: `/sign-up`

## 🔐 Security Notes

- Never commit `.env.local` to git
- Use environment variables for all secrets
- Enable webhook signature verification in production
- Use Razorpay in test mode for development
- Set up proper CORS in production

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Check your IP is whitelisted in MongoDB Atlas
- Verify connection string is correct
- Ensure password doesn't contain special characters

### Clerk Authentication Issues
- Verify API keys are correct
- Check webhook URL is accessible
- Ensure public routes are configured in middleware

### Razorpay Payment Issues
- Use test credentials in development
- Check browser console for errors
- Verify amount is in paise (₹1 = 100 paise)

### Cloudinary Upload Issues
- Verify cloud name is correct
- Check API credentials
- Ensure file size is within limits

## 📚 Next Steps

1. Customize the design in `tailwind.config.ts`
2. Add more frame categories
3. Implement email notifications
4. Add product reviews
5. Set up analytics
6. Add wishlist functionality
7. Implement advanced filters

## 💡 Tips

- Use the admin panel to manage everything
- Test payments in test mode before going live
- Keep your dependencies updated
- Monitor MongoDB usage to stay within free tier
- Use Vercel Analytics for insights

---

Need help? Check the main README.md or create an issue!
