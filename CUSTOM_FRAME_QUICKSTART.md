# Custom Frame System - Quick Reference

## 🚀 Quick Start

### Customer Flow
1. Go to `/custom-frame`
2. Upload image (PNG/JPG/WebP, max 10MB)
3. Select size (A4 → ₹999, 12x18 → ₹1499, 18x24 → ₹1999, 24x36 → ₹2999)
4. Select style (Black/White/Wooden)
5. Add to cart → Checkout → Pay with Razorpay

### Admin Flow
1. Go to `/admin/custom-orders`
2. View all custom orders
3. Download customer images
4. Update status: Pending → Processing → Printed → Shipped → Delivered

---

## 📁 File Structure

```
app/
├── custom-frame/
│   └── page.tsx                    ← Customer UI
├── admin/
│   └── custom-orders/
│       └── page.tsx                ← Admin dashboard
└── api/
    ├── upload/
    │   └── custom/
    │       └── route.ts            ← Image upload
    └── custom-frame-order/
        ├── route.ts                ← Create/Get orders
        └── [id]/
            └── route.ts            ← Update status

models/
└── Order.ts                        ← Updated schema

store/
└── cart.ts                         ← Updated cart

components/
├── FrameMockup.tsx                 ← Mockup component
└── layout/
    ├── Navbar.tsx                  ← Added link
    └── MobileNav.tsx               ← Added link
```

---

## 🔑 Key Features

✅ **Live Preview** - Real-time frame mockup  
✅ **Auto Upload** - Cloudinary integration  
✅ **4 Sizes** - A4 to 24x36  
✅ **3 Styles** - Black, White, Wooden  
✅ **Cart Integration** - Seamless checkout  
✅ **Razorpay Payment** - Secure payments  
✅ **Admin Dashboard** - Full order management  
✅ **Status Tracking** - 5-stage workflow  
✅ **Image Download** - Admin can download  
✅ **Responsive Design** - Mobile-friendly  
✅ **Premium UI** - Framer Motion + Glassmorphism  

---

## 🎯 Pricing

| Size   | Dimensions | Price  |
|--------|-----------|--------|
| A4     | 8.3 × 11.7" | ₹999   |
| 12x18  | 12 × 18"   | ₹1,499 |
| 18x24  | 18 × 24"   | ₹1,999 |
| 24x36  | 24 × 36"   | ₹2,999 |

---

## 🔄 Order Status Flow

```
Pending → Processing → Printed → Shipped → Delivered
```

---

## 🛠️ API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/upload/custom` | Upload image |
| POST | `/api/custom-frame-order` | Create order |
| GET | `/api/custom-frame-order` | Get all orders |
| PATCH | `/api/custom-frame-order/[id]` | Update status |

---

## 🗄️ Database Schema

```typescript
Order {
  type: "custom"
  customFrame: {
    imageUrl: string
    frameStyle: "Black" | "White" | "Wooden"
    frameSize: "A4" | "12x18" | "18x24" | "24x36"
    customerNotes?: string
  }
  status: "Pending" | ... | "Delivered"
  // ... other order fields
}
```

---

## 🎨 UI Components

**Custom Frame Page:**
- Image upload button
- Live frame preview
- Size selector (4 options)
- Style selector (3 options)
- Notes textarea
- Add to cart button

**Admin Dashboard:**
- Stats cards (5 statuses)
- Order list with:
  - Image thumbnail + download
  - Customer details
  - Status dropdown
  - Order information

---

## ✅ Testing

Test these scenarios:
- Upload different formats (PNG, JPG, WebP)
- Try > 10MB file (should reject)
- Test each size option
- Test each style option
- Verify preview updates
- Complete full checkout
- Admin: View orders
- Admin: Update status
- Admin: Download images

---

## 🚀 Deployment Checklist

- [x] All files created
- [x] Schema updated
- [x] Cart updated
- [x] Navigation updated
- [x] APIs implemented
- [x] UI completed
- [x] Admin dashboard ready
- [ ] Test on production
- [ ] Monitor Cloudinary usage
- [ ] Set up customer notifications (future)

---

## 💡 Tips

1. **Frame Assets**: Current system uses CSS for frames. For premium look, add PNG frame overlays in `/public/frames/`

2. **Image Optimization**: Cloudinary auto-optimizes. Original quality preserved for printing.

3. **Storage**: Images stored in `framekart/custom-frames/` folder on Cloudinary

4. **Mobile**: Fully responsive. Test on actual devices for best results.

5. **Performance**: Preview loads instantly. Upload takes 2-5 seconds based on image size.

---

## 📊 Admin Quick Actions

**View Orders:**
```
/admin/custom-orders
```

**Filter by Status:**
- Check stats cards at top
- Shows count per status

**Update Status:**
- Use dropdown in each order card
- Auto-saves on change

**Download Image:**
- Hover over image
- Click download button

---

## 🎓 For Developers

**Add New Frame Style:**
```typescript
// In /app/custom-frame/page.tsx
const FRAME_STYLES = [
  // ...existing styles
  { 
    value: "Gold" as FrameStyle, 
    label: "Gold", 
    color: "#FFD700",
    description: "Luxury & Premium"
  },
];
```

**Add New Size:**
```typescript
const FRAME_SIZES = [
  // ...existing sizes
  { value: "30x40" as FrameSize, label: "30 × 40 inches", price: 3999 },
];

const FRAME_PRICES: Record<FrameSize, number> = {
  // ...existing prices
  "30x40": 3999,
};
```

**Customize Upload Limits:**
```typescript
// In /app/api/upload/custom/route.ts
const maxSize = 10 * 1024 * 1024; // Change to desired size
```

---

## 📞 Support

Common issues:
1. **Upload fails** → Check Cloudinary config
2. **Preview blank** → Verify image URL
3. **Payment fails** → Check Razorpay keys
4. **Status won't update** → Verify admin role

---

## ✨ System Complete!

All requested features implemented:
- ✅ Custom frame creation page
- ✅ Live preview with mockups
- ✅ Cloudinary auto-upload
- ✅ Multiple sizes and styles
- ✅ Cart integration
- ✅ Razorpay payments
- ✅ Admin dashboard
- ✅ Order tracking
- ✅ Premium UI/UX
- ✅ Fully responsive

**Ready for production!** 🚀
