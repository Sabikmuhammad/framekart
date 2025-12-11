# Custom Frame System - Testing Guide

## 🧪 Complete Testing Checklist

Use this guide to thoroughly test your Custom Frame Ordering System.

---

## ✅ Pre-Testing Setup

### 1. Environment Variables
Verify all required variables are set in `.env.local`:

```bash
# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# MongoDB
MONGODB_URI=your_mongodb_uri

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

### 2. Start Development Server
```bash
npm run dev
```

Server should start on: http://localhost:3000

### 3. Prepare Test Images
Download or create test images:
- **test-image.png** (PNG format, ~2MB)
- **test-photo.jpg** (JPG format, ~3MB)
- **test-image.webp** (WebP format, ~1MB)
- **large-image.jpg** (>10MB for testing rejection)
- **test.pdf** (Invalid format for testing rejection)

---

## 📋 Test Cases

### **A. Navigation Tests**

#### A1. Desktop Navigation
- [ ] Open http://localhost:3000
- [ ] Click "Custom Frame" in navbar
- [ ] Verify redirects to `/custom-frame`
- [ ] URL should be: `http://localhost:3000/custom-frame`

#### A2. Mobile Navigation
- [ ] Open in mobile view (DevTools responsive mode)
- [ ] Look at bottom navigation bar
- [ ] Find "Custom" tab with Palette icon
- [ ] Tap it
- [ ] Verify redirects to `/custom-frame`

#### A3. Admin Navigation
- [ ] Login as admin user
- [ ] Go to `/admin`
- [ ] Find "Custom Frame Orders" card
- [ ] Click "View Custom Orders" button
- [ ] Verify redirects to `/admin/custom-orders`

**Expected Results:**
✅ All navigation links work  
✅ URLs are correct  
✅ Pages load without errors  

---

### **B. Image Upload Tests**

#### B1. Valid PNG Upload
- [ ] Go to `/custom-frame`
- [ ] Click "Upload Your Image"
- [ ] Select `test-image.png`
- [ ] Wait for upload
- [ ] Verify success toast appears
- [ ] Verify image appears in preview
- [ ] Verify frame border shows around image

**Expected Results:**
✅ Upload completes in 2-5 seconds  
✅ Toast says "Image uploaded successfully!"  
✅ Preview shows uploaded image  
✅ Frame mockup visible  

#### B2. Valid JPG Upload
- [ ] Click "Change Image" button
- [ ] Select `test-photo.jpg`
- [ ] Wait for upload
- [ ] Verify image replaces previous one
- [ ] Check preview updates

**Expected Results:**
✅ JPG uploads successfully  
✅ Preview updates immediately  

#### B3. Valid WebP Upload
- [ ] Click "Change Image"
- [ ] Select `test-image.webp`
- [ ] Verify upload works

**Expected Results:**
✅ WebP format accepted  

#### B4. File Size Rejection (>10MB)
- [ ] Click "Change Image"
- [ ] Try to select `large-image.jpg` (>10MB)
- [ ] Verify error toast appears
- [ ] Error says: "File too large"

**Expected Results:**
✅ Large file rejected  
✅ Error toast shown  
✅ Upload doesn't proceed  

#### B5. Invalid File Type
- [ ] Click "Change Image"
- [ ] Try to select `test.pdf`
- [ ] Verify error toast appears
- [ ] Error says: "Invalid file type"

**Expected Results:**
✅ PDF rejected  
✅ Only image files allowed  

#### B6. Upload Without Login
- [ ] Sign out from Clerk
- [ ] Go to `/custom-frame`
- [ ] Try to upload image
- [ ] Verify redirected to sign-in

**Expected Results:**
✅ Unauthenticated users redirected  

---

### **C. Frame Customization Tests**

#### C1. Size Selection
With an uploaded image:
- [ ] Click "A4" option
- [ ] Verify price shows ₹999
- [ ] Verify checkmark appears on A4
- [ ] Click "12x18" option
- [ ] Verify price changes to ₹1,499
- [ ] Verify checkmark moves to 12x18
- [ ] Click "18x24" option
- [ ] Verify price changes to ₹1,999
- [ ] Click "24x36" option
- [ ] Verify price changes to ₹2,999

**Expected Results:**
✅ Price updates instantly  
✅ Only one size selected at a time  
✅ Smooth transitions  

#### C2. Style Selection
- [ ] Click "Black" style
- [ ] Verify frame border turns black (#1a1a1a)
- [ ] Click "White" style
- [ ] Verify frame border turns white (#f5f5f5)
- [ ] Click "Wooden" style
- [ ] Verify frame border turns brown (#8B4513)

**Expected Results:**
✅ Frame color changes instantly  
✅ Preview updates in real-time  
✅ Checkmark shows selected style  

#### C3. Customer Notes
- [ ] Type in notes textarea: "Please use glossy finish"
- [ ] Verify character count updates
- [ ] Type 500 characters
- [ ] Verify can't type more than 500
- [ ] Clear notes
- [ ] Verify count shows 0/500

**Expected Results:**
✅ Text input works  
✅ Character counter accurate  
✅ 500 character limit enforced  

---

### **D. Live Preview Tests**

#### D1. Preview Updates on Upload
- [ ] Upload new image
- [ ] Verify preview updates within 1 second
- [ ] Image should fill frame area

#### D2. Preview Updates on Style Change
- [ ] With image uploaded
- [ ] Click each style option
- [ ] Verify frame border color changes instantly
- [ ] No flickering or delays

#### D3. Preview Aspect Ratio
- [ ] Upload portrait image (taller than wide)
- [ ] Verify image fills frame
- [ ] Upload landscape image (wider than tall)
- [ ] Verify image fills frame
- [ ] No distortion or stretching

**Expected Results:**
✅ All preview updates smooth  
✅ Images maintain aspect ratio  
✅ Frame always visible  

---

### **E. Add to Cart Tests**

#### E1. Add Custom Frame to Cart
- [ ] Upload image
- [ ] Select size: 12x18
- [ ] Select style: Black
- [ ] Add notes: "Test order"
- [ ] Click "Add to Cart"
- [ ] Verify success toast
- [ ] Verify redirect to `/cart` after 1 second

**Expected Results:**
✅ Item added to cart  
✅ Redirect works  

#### E2. Cart Display
- [ ] Check cart page
- [ ] Verify custom frame shows:
  - [ ] Title: "Custom Frame - 12x18 Black"
  - [ ] Price: ₹1,499
  - [ ] Image: Your uploaded image
  - [ ] Quantity: 1

**Expected Results:**
✅ Custom frame visible in cart  
✅ All details correct  

#### E3. Add to Cart Without Image
- [ ] Go back to `/custom-frame`
- [ ] Don't upload image
- [ ] Select size and style
- [ ] Click "Add to Cart"
- [ ] Verify error toast: "No image uploaded"

**Expected Results:**
✅ Can't add without image  
✅ Error message shown  

---

### **F. Checkout Tests**

#### F1. Custom Frame Checkout
With custom frame in cart:
- [ ] Go to `/checkout`
- [ ] Fill address form:
  - Full Name: "John Doe"
  - Phone: "9876543210"
  - Address Line 1: "123 Main St"
  - City: "Mumbai"
  - State: "Maharashtra"
  - Pincode: "400001"
- [ ] Click "Pay Now"
- [ ] Verify Razorpay modal opens

**Note:** Use Razorpay test mode for testing

#### F2. Payment Completion (Test Mode)
- [ ] In Razorpay modal, use test card:
  - Card: 4111 1111 1111 1111
  - Expiry: Any future date
  - CVV: 123
- [ ] Complete payment
- [ ] Verify success toast
- [ ] Verify redirect to order page
- [ ] Cart should be empty

**Expected Results:**
✅ Payment flows smoothly  
✅ Order created in database  
✅ Cart cleared  

---

### **G. Admin Dashboard Tests**

#### G1. Access Admin Page
- [ ] Login as admin
- [ ] Go to `/admin/custom-orders`
- [ ] Verify page loads
- [ ] Verify stats cards show

**Expected Results:**
✅ Only admins can access  
✅ Stats display correctly  

#### G2. View Custom Orders
- [ ] After placing test order
- [ ] Refresh admin page
- [ ] Verify new order appears
- [ ] Check order shows:
  - [ ] Order ID (last 8 chars)
  - [ ] Created date
  - [ ] Frame size: 12x18
  - [ ] Frame style: Black
  - [ ] Total: ₹1,499
  - [ ] Status: Pending
  - [ ] Customer name: John Doe
  - [ ] Full address
  - [ ] Notes: "Test order"

**Expected Results:**
✅ Order visible immediately  
✅ All details accurate  

#### G3. Image Preview & Download
- [ ] Hover over order image
- [ ] Verify download button appears
- [ ] Click download button
- [ ] Verify image downloads to local machine
- [ ] Open downloaded image
- [ ] Verify it's the uploaded image

**Expected Results:**
✅ Hover effect works  
✅ Download successful  
✅ Correct image downloaded  

#### G4. Update Order Status
- [ ] Find status dropdown on order
- [ ] Currently shows: "Pending"
- [ ] Change to: "Processing"
- [ ] Verify status updates
- [ ] Verify success toast
- [ ] Change to: "Printed"
- [ ] Verify update
- [ ] Continue through: Shipped → Delivered
- [ ] Verify each update works

**Expected Results:**
✅ Dropdown changes status  
✅ Updates saved to database  
✅ Toast confirms each update  

#### G5. Statistics Update
- [ ] Check stats at top of page
- [ ] Note "Pending" count
- [ ] Update an order status to "Processing"
- [ ] Refresh page
- [ ] Verify "Pending" count decreased by 1
- [ ] Verify "Processing" count increased by 1

**Expected Results:**
✅ Stats accurate  
✅ Updates reflect immediately  

---

### **H. Responsive Design Tests**

#### H1. Mobile (375px)
- [ ] Open DevTools
- [ ] Set to iPhone SE (375px)
- [ ] Go to `/custom-frame`
- [ ] Verify:
  - [ ] Layout stacks vertically
  - [ ] Preview visible
  - [ ] Size buttons readable
  - [ ] Style buttons fit
  - [ ] Add to cart button accessible
  - [ ] Bottom nav visible

#### H2. Tablet (768px)
- [ ] Set to iPad (768px)
- [ ] Verify:
  - [ ] 2-column layout
  - [ ] Navbar appears
  - [ ] Content readable
  - [ ] Images scale properly

#### H3. Desktop (1920px)
- [ ] Set to desktop size
- [ ] Verify:
  - [ ] Max-width container
  - [ ] Centered layout
  - [ ] Proper spacing
  - [ ] All elements aligned

**Expected Results:**
✅ Responsive on all sizes  
✅ No horizontal scroll  
✅ Touch targets >= 44px  

---

### **I. Error Handling Tests**

#### I1. Network Error Simulation
- [ ] Open DevTools Network tab
- [ ] Set to "Offline"
- [ ] Try to upload image
- [ ] Verify error toast appears
- [ ] Set back to "Online"

#### I2. Invalid MongoDB Connection
- [ ] Temporarily change MONGODB_URI
- [ ] Try to place order
- [ ] Verify graceful error
- [ ] Fix MONGODB_URI

#### I3. Invalid Cloudinary Config
- [ ] Temporarily change Cloudinary key
- [ ] Try to upload
- [ ] Verify error message
- [ ] Fix configuration

**Expected Results:**
✅ Errors handled gracefully  
✅ User-friendly messages  
✅ No app crashes  

---

### **J. Performance Tests**

#### J1. Page Load Speed
- [ ] Clear browser cache
- [ ] Go to `/custom-frame`
- [ ] Measure time to interactive
- [ ] Should be < 2 seconds

#### J2. Upload Speed
- [ ] Upload 2MB image
- [ ] Measure upload time
- [ ] Should be < 5 seconds

#### J3. Preview Update Speed
- [ ] Change frame style
- [ ] Measure preview update time
- [ ] Should be < 100ms (instant)

#### J4. Cart Performance
- [ ] Add 5 custom frames
- [ ] Go to cart
- [ ] Verify smooth scrolling
- [ ] No lag

**Expected Results:**
✅ Fast load times  
✅ Smooth interactions  
✅ No performance issues  

---

### **K. Security Tests**

#### K1. Authentication Required
- [ ] Sign out
- [ ] Try to access `/custom-frame`
- [ ] Try to upload image
- [ ] Verify redirect to sign-in

#### K2. Admin Authorization
- [ ] Login as regular user (not admin)
- [ ] Try to access `/admin/custom-orders`
- [ ] Verify 403 Forbidden or redirect

#### K3. File Upload Security
- [ ] Try to upload PHP file
- [ ] Try to upload EXE file
- [ ] Try to upload SVG with scripts
- [ ] Verify all rejected

**Expected Results:**
✅ Auth enforced everywhere  
✅ Only admins access admin routes  
✅ File types strictly validated  

---

### **L. Database Verification**

#### L1. Order Saved Correctly
- [ ] Place custom frame order
- [ ] Open MongoDB (Compass or CLI)
- [ ] Find the order
- [ ] Verify fields:
  ```javascript
  {
    type: "custom",
    customFrame: {
      imageUrl: "https://res.cloudinary.com/...",
      frameStyle: "Black",
      frameSize: "12x18",
      customerNotes: "..."
    },
    status: "Pending",
    // ... other fields
  }
  ```

#### L2. Status Update Persisted
- [ ] Update status in admin
- [ ] Refresh MongoDB
- [ ] Verify status changed in database

**Expected Results:**
✅ Data structured correctly  
✅ All fields present  
✅ Updates persist  

---

### **M. Edge Cases**

#### M1. Multiple Quick Uploads
- [ ] Upload image
- [ ] Immediately upload another
- [ ] Upload a third quickly
- [ ] Verify last upload shows
- [ ] No race conditions

#### M2. Rapid Status Changes
- [ ] In admin, rapidly change status
- [ ] Click dropdown multiple times fast
- [ ] Verify final status is correct
- [ ] No duplicate requests

#### M3. Large Notes
- [ ] Type exactly 500 characters
- [ ] Try to type more
- [ ] Verify stopped at 500
- [ ] Submit order
- [ ] Verify notes saved fully

**Expected Results:**
✅ Handles edge cases  
✅ No crashes or bugs  

---

## 📊 Test Results Template

Use this to track your testing:

```
┌────────────────────────────────────────────────┐
│          CUSTOM FRAME SYSTEM TEST REPORT      │
├────────────────────────────────────────────────┤
│ Date: _______________                         │
│ Tester: _____________                         │
│ Environment: Development / Production         │
└────────────────────────────────────────────────┘

A. Navigation Tests          [ ] Pass  [ ] Fail
B. Image Upload Tests        [ ] Pass  [ ] Fail
C. Customization Tests       [ ] Pass  [ ] Fail
D. Live Preview Tests        [ ] Pass  [ ] Fail
E. Add to Cart Tests         [ ] Pass  [ ] Fail
F. Checkout Tests            [ ] Pass  [ ] Fail
G. Admin Dashboard Tests     [ ] Pass  [ ] Fail
H. Responsive Design Tests   [ ] Pass  [ ] Fail
I. Error Handling Tests      [ ] Pass  [ ] Fail
J. Performance Tests         [ ] Pass  [ ] Fail
K. Security Tests            [ ] Pass  [ ] Fail
L. Database Tests            [ ] Pass  [ ] Fail
M. Edge Case Tests           [ ] Pass  [ ] Fail

Overall Status: [ ] Ready for Production
                [ ] Needs Fixes

Issues Found:
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

Notes:
_____________________________________________
_____________________________________________
```

---

## 🚀 Production Deployment Checklist

Before deploying to production:

- [ ] All tests passed
- [ ] Environment variables set on production
- [ ] Cloudinary quota sufficient
- [ ] MongoDB connection stable
- [ ] Razorpay in live mode (if ready)
- [ ] Error logging set up
- [ ] Backup strategy in place
- [ ] Admin users configured
- [ ] Performance acceptable
- [ ] Security audit complete

---

## 🐛 Common Issues & Solutions

### Issue: Image won't upload
**Solution:** Check Cloudinary credentials, verify file size < 10MB

### Issue: Preview shows broken image
**Solution:** Check Cloudinary URL, verify network connection

### Issue: Can't access admin page
**Solution:** Verify user has admin role in Clerk metadata

### Issue: Payment fails
**Solution:** Use Razorpay test mode first, check API keys

### Issue: Status won't update
**Solution:** Check MongoDB connection, verify admin auth

---

## ✅ Testing Complete!

When all tests pass:
1. ✅ Mark "Ready for Production"
2. ✅ Document any known issues
3. ✅ Proceed with deployment

**Happy Testing! 🎉**
