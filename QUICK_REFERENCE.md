# ⚡ FrameKart Quick Reference

## 🚀 Getting Started in 5 Minutes

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.local.example .env.local

# 3. Add your credentials to .env.local

# 4. Run development server
npm run dev

# 5. Visit http://localhost:3000
```

## 🔑 Essential Environment Variables

```env
MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
RAZORPAY_KEY_ID=rzp_test_...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
```

## 📁 Project Structure Quick Reference

```
app/
├── page.tsx                    # Homepage
├── frames/page.tsx             # Frames listing
├── cart/page.tsx               # Shopping cart
├── checkout/page.tsx           # Checkout
├── admin/                      # Admin panel
│   ├── page.tsx               # Dashboard
│   ├── frames/page.tsx        # Manage frames
│   ├── orders/page.tsx        # View orders
│   └── uploads/page.tsx       # Upload images
└── api/                        # API routes
    ├── frames/route.ts        # Frames CRUD
    ├── orders/route.ts        # Orders
    └── razorpay/              # Payment
```

## 🎯 Common Tasks

### Add a New Page
```typescript
// app/new-page/page.tsx
export default function NewPage() {
  return <div>New Page</div>
}
```

### Create API Route
```typescript
// app/api/example/route.ts
export async function GET(req: NextRequest) {
  return NextResponse.json({ data: "Hello" })
}
```

### Add to Cart
```typescript
const addItem = useCartStore((state) => state.addItem);
addItem({ _id, title, price, imageUrl, ... });
```

### Get Cart Total
```typescript
const getTotalPrice = useCartStore((state) => state.getTotalPrice);
const total = getTotalPrice();
```

### Show Toast Notification
```typescript
const { toast } = useToast();
toast({
  title: "Success",
  description: "Item added to cart"
});
```

## 🔧 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Clear cache
rm -rf .next
npm run dev
```

## 📊 Database Operations

### Connect to MongoDB
```typescript
import dbConnect from '@/lib/db';
await dbConnect();
```

### Query Data
```typescript
import Frame from '@/models/Frame';
const frames = await Frame.find({});
```

### Create Document
```typescript
const frame = await Frame.create({ title, price, ... });
```

## 🎨 Styling Quick Tips

### Tailwind Classes
```tsx
className="flex items-center justify-between p-4 rounded-lg"
```

### Responsive Design
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### Dark Mode
```tsx
className="bg-white dark:bg-gray-900"
```

## 🔐 Authentication

### Check if User is Signed In
```typescript
const { isSignedIn, user } = useUser();
```

### Get User ID (Server)
```typescript
import { auth } from '@clerk/nextjs';
const { userId } = auth();
```

### Check Admin Role
```typescript
user?.publicMetadata?.role === 'admin'
```

## 💳 Payment Integration

### Create Order
```typescript
const res = await fetch('/api/razorpay/order', {
  method: 'POST',
  body: JSON.stringify({ amount })
});
```

### Verify Payment
```typescript
await fetch('/api/razorpay/verify', {
  method: 'POST',
  body: JSON.stringify({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId
  })
});
```

## 🖼️ Image Upload

```typescript
const formData = new FormData();
formData.append('file', file);

const res = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});
```

## 🐛 Debugging Tips

### Check Environment Variables
```bash
echo $MONGODB_URI
# or in code:
console.log(process.env.MONGODB_URI)
```

### MongoDB Connection Issues
- ✅ Check IP whitelist in Atlas
- ✅ Verify connection string
- ✅ Ensure password is correct

### Clerk Issues
- ✅ Check API keys
- ✅ Verify webhook URL
- ✅ Ensure public routes in middleware

### Payment Issues
- ✅ Use test mode in development
- ✅ Check amount is in paise
- ✅ Verify signature correctly

## 📱 Testing

### Test Payment Card
```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

### Test URLs
```
Homepage:       http://localhost:3000
Frames:         http://localhost:3000/frames
Cart:           http://localhost:3000/cart
Admin:          http://localhost:3000/admin
```

## 🚀 Deployment

### Deploy to Vercel
```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# Then import in Vercel dashboard
```

### Update Environment Variables
1. Vercel Dashboard → Settings → Environment Variables
2. Add all variables from .env.local
3. Redeploy

## 🔄 Version Control

### Gitignore Essentials
```
node_modules/
.next/
.env.local
.env
.DS_Store
```

### Commit Messages
```bash
git commit -m "feat: add cart functionality"
git commit -m "fix: resolve payment issue"
git commit -m "docs: update README"
```

## 📞 Quick Links

- **Clerk Dashboard**: https://dashboard.clerk.com
- **Razorpay Dashboard**: https://dashboard.razorpay.com
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Cloudinary Console**: https://cloudinary.com/console
- **Vercel Dashboard**: https://vercel.com/dashboard

## 🆘 Common Errors & Fixes

### "Cannot connect to MongoDB"
→ Check MONGODB_URI and IP whitelist

### "Clerk publishable key is missing"
→ Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

### "Module not found"
→ Run `npm install`

### "Port 3000 is already in use"
→ Run `lsof -ti:3000 | xargs kill` or use different port

### "Payment verification failed"
→ Check RAZORPAY_KEY_SECRET is correct

## 🎓 Best Practices

1. **Always use environment variables for secrets**
2. **Test locally before deploying**
3. **Keep dependencies updated**
4. **Use TypeScript for type safety**
5. **Handle errors gracefully**
6. **Add loading states**
7. **Make it responsive**
8. **Optimize images**

## 💡 Pro Tips

- Use `@/` for absolute imports
- Keep components small and reusable
- Use server components when possible
- Cache API responses appropriately
- Add proper error boundaries
- Test on real devices
- Monitor performance

---

**Need more help?** Check the full README.md or SETUP.md!

Happy coding! 🚀
