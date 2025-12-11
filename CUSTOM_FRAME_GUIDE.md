# Custom Frame Ordering System - Complete Guide

## 🎯 Overview

The Custom Frame Ordering System allows customers to upload their own images, choose frame sizes and styles, preview their framed photo in real-time, and complete the purchase through Razorpay. Admins can manage these orders with full tracking capabilities.

---

## 📁 Files Created/Modified

### **New Files Created:**

1. **`/app/custom-frame/page.tsx`**
   - Main customer-facing custom frame creation page
   - Live preview with frame mockups
   - Image upload with validation
   - Size and style selection
   - Add to cart functionality

2. **`/app/api/upload/custom/route.ts`**
   - Handles image uploads to Cloudinary
   - Validates file type (PNG/JPG/WebP)
   - Validates file size (max 10MB)
   - Returns secure URL for uploaded images

3. **`/app/api/custom-frame-order/route.ts`**
   - POST: Creates custom frame orders
   - GET: Fetches all custom orders (admin only)

4. **`/app/api/custom-frame-order/[id]/route.ts`**
   - PATCH: Updates order status (admin only)

5. **`/app/admin/custom-orders/page.tsx`**
   - Admin dashboard for managing custom frame orders
   - View uploaded images with download capability
   - Update order status (Pending → Processing → Printed → Shipped → Delivered)
   - Customer information display

### **Modified Files:**

1. **`/models/Order.ts`**
   - Added `type` field: "regular" | "custom"
   - Added `customFrame` object with:
     - `imageUrl`: Uploaded customer image
     - `frameStyle`: Black/White/Wooden
     - `frameSize`: A4/12x18/18x24/24x36
     - `customerNotes`: Optional instructions
   - Added `status` field for order tracking

2. **`/store/cart.ts`**
   - Added `isCustom` flag to CartItem
   - Added `customFrame` object to CartItem

3. **`/app/checkout/page.tsx`**
   - Updated to handle both regular and custom frame orders
   - Routes to correct API based on cart contents

4. **`/components/layout/Navbar.tsx`**
   - Added "Custom Frame" navigation link

5. **`/components/layout/MobileNav.tsx`**
   - Added "Custom" tab with Palette icon

6. **`/app/admin/page.tsx`**
   - Added custom orders card with link

---

## 💰 Pricing Formula

```javascript
const FRAME_PRICES = {
  "A4": 999,
  "12x18": 1499,
  "18x24": 1999,
  "24x36": 2999,
};
```

- **A4**: ₹999 (8.3 × 11.7 inches)
- **12x18**: ₹1,499 (12 × 18 inches)
- **18x24**: ₹1,999 (18 × 24 inches)
- **24x36**: ₹2,999 (24 × 36 inches)

Price automatically updates when user selects different size.

---

## 🎨 Frame Styles Available

1. **Black** - Modern & Elegant (#000000)
2. **White** - Clean & Minimal (#FFFFFF)
3. **Wooden** - Classic & Warm (#8B4513)

---

## 🔄 User Flow

### Customer Journey:

1. **Navigate** to `/custom-frame`
2. **Upload Image**:
   - Click "Upload Your Image" button
   - Select PNG/JPG/WebP file (max 10MB)
   - Image auto-uploads to Cloudinary
   - Preview appears in frame mockup
3. **Select Size**: Choose from 4 size options
4. **Select Style**: Choose from 3 frame styles
5. **Add Notes** (optional): Special instructions
6. **Add to Cart**: Custom frame added with all details
7. **Checkout**: Standard Razorpay payment flow
8. **Order Placed**: Saved as custom order in database

### Admin Journey:

1. **Navigate** to `/admin/custom-orders`
2. **View Orders**:
   - See all custom frame orders
   - Stats by status (Pending/Processing/Printed/Shipped/Delivered)
3. **Manage Order**:
   - View uploaded image thumbnail
   - Download original image
   - See customer details
   - Update order status via dropdown
4. **Track**: Real-time status updates

---

## 🔧 API Endpoints

### Upload Image
```
POST /api/upload/custom
Content-Type: multipart/form-data

Body:
{
  file: File (PNG/JPG/WebP, max 10MB)
}

Response:
{
  success: true,
  data: {
    url: "https://cloudinary.com/...",
    publicId: "framekart/custom-frames/...",
    width: 2000,
    height: 2000
  }
}
```

### Create Custom Order
```
POST /api/custom-frame-order
Content-Type: application/json

Body:
{
  imageUrl: string,
  frameStyle: "Black" | "White" | "Wooden",
  frameSize: "A4" | "12x18" | "18x24" | "24x36",
  customerNotes: string (optional),
  totalAmount: number,
  address: {
    fullName: string,
    phone: string,
    addressLine1: string,
    addressLine2?: string,
    city: string,
    state: string,
    pincode: string
  }
}

Response:
{
  success: true,
  data: Order
}
```

### Get All Custom Orders (Admin)
```
GET /api/custom-frame-order

Response:
{
  success: true,
  data: Order[]
}
```

### Update Order Status (Admin)
```
PATCH /api/custom-frame-order/[id]
Content-Type: application/json

Body:
{
  status: "Pending" | "Processing" | "Printed" | "Shipped" | "Delivered"
}

Response:
{
  success: true,
  data: Order
}
```

---

## 🗄️ MongoDB Schema Updates

### Order Model

```typescript
{
  userId: string,
  type: "regular" | "custom",  // NEW
  items: [{
    productId: ObjectId | null,  // null for custom frames
    title: string,
    price: number,
    quantity: number,
    imageUrl: string
  }],
  totalAmount: number,
  paymentStatus: "pending" | "completed" | "failed",
  paymentId?: string,
  razorpayOrderId?: string,
  razorpaySignature?: string,
  address: {
    fullName: string,
    phone: string,
    addressLine1: string,
    addressLine2?: string,
    city: string,
    state: string,
    pincode: string
  },
  customFrame?: {  // NEW
    imageUrl: string,
    frameStyle: "Black" | "White" | "Wooden",
    frameSize: "A4" | "12x18" | "18x24" | "24x36",
    customerNotes?: string
  },
  status?: "Pending" | "Processing" | "Printed" | "Shipped" | "Delivered",  // NEW
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 Design Features

### UI/UX Highlights:

1. **Live Preview**:
   - Real-time frame mockup
   - Image updates instantly on upload
   - Frame color changes on style selection
   - Simulated frame border with CSS

2. **Smooth Animations**:
   - Framer Motion for all transitions
   - Hover effects on buttons
   - Scale animations on selection
   - Loading spinners

3. **Glassmorphism**:
   - Backdrop blur effects
   - Translucent cards
   - Modern gradient backgrounds

4. **Premium Typography**:
   - Bold, clean fonts
   - Gradient text effects
   - Proper hierarchy

5. **Responsive Design**:
   - Mobile-first approach
   - Grid layouts adapt to screen size
   - Touch-friendly buttons

### Color Palette:
- Primary: Blue (#3b82f6)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Error: Red (#ef4444)
- Neutral: Gray scale

---

## 📊 Admin Dashboard Features

### Statistics Display:
- Count by status (5 categories)
- Visual indicators with icons
- Color-coded status badges

### Order Management:
1. **Image Preview**:
   - Thumbnail with hover zoom
   - Download button on hover
   - Direct download to local

2. **Customer Details**:
   - Full name and phone
   - Complete address
   - Order date/time

3. **Status Tracking**:
   - Dropdown for status update
   - Instant update to database
   - Visual feedback

4. **Order Information**:
   - Frame size and style
   - Total amount
   - Payment status
   - Customer notes

---

## 🔐 Security Features

1. **Authentication**:
   - Clerk authentication required
   - User ID validation

2. **Authorization**:
   - Admin-only access for order management
   - Role check from user metadata

3. **File Upload Validation**:
   - File type whitelist (PNG/JPG/WebP)
   - File size limit (10MB)
   - Server-side validation

4. **Data Validation**:
   - Required field checks
   - Type validation
   - Enum validation for frame options

---

## 🚀 How to Use

### For Customers:

1. Visit homepage and click "Custom Frame" in navigation
2. Upload your favorite photo
3. Choose your preferred size and style
4. Add optional notes
5. Add to cart and checkout
6. Complete payment via Razorpay

### For Admins:

1. Login as admin
2. Navigate to Admin → Custom Orders
3. View all pending orders
4. Download customer images
5. Update status as you process
6. Track delivery

---

## 🧪 Testing Checklist

- [ ] Upload various image formats (PNG, JPG, WebP)
- [ ] Test file size validation (try > 10MB)
- [ ] Test all frame sizes
- [ ] Test all frame styles
- [ ] Verify live preview updates
- [ ] Add to cart functionality
- [ ] Checkout process
- [ ] Razorpay integration
- [ ] Order creation in database
- [ ] Admin order viewing
- [ ] Status update functionality
- [ ] Image download
- [ ] Mobile responsiveness
- [ ] Error handling

---

## 🎯 Next Steps / Future Enhancements

1. **Email Notifications**:
   - Send confirmation emails
   - Status update notifications

2. **Advanced Editing**:
   - Crop/rotate images
   - Filters and adjustments
   - Text overlay option

3. **Multiple Images**:
   - Upload multiple photos
   - Create collage frames

4. **Preview Enhancements**:
   - 3D frame preview
   - AR preview option

5. **Analytics**:
   - Popular sizes tracking
   - Style preferences
   - Revenue analytics

6. **Bulk Operations**:
   - Bulk status updates
   - Export orders to CSV

---

## 📝 Environment Variables Required

```env
# Cloudinary (already configured)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (already configured)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# MongoDB (already configured)
MONGODB_URI=your_mongodb_uri

# Clerk (already configured)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

---

## 🐛 Troubleshooting

### Upload Issues:
- Check Cloudinary credentials
- Verify file size < 10MB
- Ensure correct file format

### Preview Not Showing:
- Check browser console for errors
- Verify Cloudinary URL is accessible
- Clear browser cache

### Payment Failing:
- Verify Razorpay keys
- Check order creation logs
- Test in Razorpay test mode first

### Status Not Updating:
- Verify admin role in Clerk
- Check network tab for API errors
- Verify MongoDB connection

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Review server logs
3. Verify all environment variables
4. Test API endpoints individually

---

## ✅ System Complete!

All features have been implemented as requested:
- ✅ Custom frame page with upload
- ✅ Live preview with frame mockups
- ✅ Size and style selection
- ✅ Cloudinary integration
- ✅ MongoDB schema updates
- ✅ Cart system integration
- ✅ Razorpay payment flow
- ✅ Admin dashboard
- ✅ Order status tracking
- ✅ Premium UI/UX design
- ✅ Responsive design
- ✅ Framer Motion animations

Ready to deploy! 🚀
