# 📸 How to Add Photos to Categories and Promotion Banners

## 🎨 Adding Category Images

### Method 1: Using Cloudinary (Recommended)

#### Step 1: Upload Images to Cloudinary
1. Go to https://cloudinary.com and log in
2. Click **Media Library** → **Upload**
3. Upload 6 category images (recommended size: **800×800px**)

**Required Images:**
- `custom-frames.jpg`
- `photo-frames.jpg`
- `wall-frames.jpg`
- `birthday-frames.jpg`
- `calligraphy-frames.jpg`
- `home-decor.jpg`

#### Step 2: Organize in Cloudinary
1. Create a folder: `framekart/categories/`
2. Move all uploaded images to this folder
3. The final path should be: `framekart/categories/custom-frames.jpg`

#### Step 3: Images Auto-Load
✅ **No code changes needed!** The images are already configured in `/lib/categories.ts`

The URLs will be:
```
https://res.cloudinary.com/{YOUR_CLOUD_NAME}/image/upload/v1/framekart/categories/custom-frames.jpg
https://res.cloudinary.com/{YOUR_CLOUD_NAME}/image/upload/v1/framekart/categories/photo-frames.jpg
... etc
```

---

### Method 2: Using Local Images (Development Only)

#### Step 1: Create Public Folder Structure
```bash
mkdir -p public/images/categories
```

#### Step 2: Add Images
Place your images in `public/images/categories/`:
```
public/
  images/
    categories/
      custom-frames.jpg
      photo-frames.jpg
      wall-frames.jpg
      birthday-frames.jpg
      calligraphy-frames.jpg
      home-decor.jpg
```

#### Step 3: Update categories.ts
```typescript
// /lib/categories.ts
export const categories = [
  {
    name: "Custom Frames",
    href: "/custom-frame",
    image: "/images/categories/custom-frames.jpg", // Changed path
    gradient: "from-primary/20 via-primary/10 to-background",
    // ... rest of config
  },
  // ... other categories
];

export const getCloudinaryUrl = (path: string) => {
  // For local images, just return the path
  return path;
};
```

---

## 🎯 Adding Promotion Banner Images

### Option 1: Add Background Image to Banner

#### Step 1: Upload Banner Image to Cloudinary
1. Upload a banner image (recommended: **1920×600px**)
2. Place in: `framekart/banners/custom-frame-banner.jpg`

#### Step 2: Update page.tsx
```typescript
// /app/page.tsx - Around line 428

{/* Custom Frame Promotion Banner */}
<section className="py-8 sm:py-12 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
  <div className="container mx-auto px-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Card className="border-2 border-primary/20 overflow-hidden relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/framekart/banners/custom-frame-banner.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <CardContent className="p-6 sm:p-8 md:p-12 relative z-10">
          {/* Existing content */}
```

### Option 2: Replace Gradient Placeholders with Actual Images

#### Current Code (Lines 468-478):
```typescript
<div className="relative">
  <div className="grid grid-cols-2 gap-3">
    <div className="space-y-3">
      <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-white dark:border-gray-800 shadow-lg transform rotate-2"></div>
      <div className="aspect-square rounded-lg bg-gradient-to-br from-blue-200 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-4 border-white dark:border-gray-800 shadow-lg transform -rotate-3"></div>
    </div>
```

#### Updated with Images:
```typescript
<div className="relative">
  <div className="grid grid-cols-2 gap-3">
    <div className="space-y-3">
      {/* Replace gradient with image */}
      <div className="aspect-square rounded-lg border-4 border-white dark:border-gray-800 shadow-lg transform rotate-2 overflow-hidden">
        <img 
          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/framekart/samples/frame-sample-1.jpg`}
          alt="Custom frame example"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="aspect-square rounded-lg border-4 border-white dark:border-gray-800 shadow-lg transform -rotate-3 overflow-hidden">
        <img 
          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/framekart/samples/frame-sample-2.jpg`}
          alt="Custom frame example"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
    <div className="space-y-3">
      <div className="aspect-square rounded-lg border-4 border-white dark:border-gray-800 shadow-lg transform -rotate-1 overflow-hidden">
        <img 
          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/framekart/samples/frame-sample-3.jpg`}
          alt="Custom frame example"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="aspect-square rounded-lg border-4 border-white dark:border-gray-800 shadow-lg transform rotate-2 overflow-hidden">
        <img 
          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/framekart/samples/frame-sample-4.jpg`}
          alt="Custom frame example"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
</div>
```

---

## 🖼️ Image Specifications

### Category Images
- **Size**: 800×800px (square)
- **Format**: JPG or PNG
- **Quality**: High (80-90%)
- **File size**: < 200KB (optimized)

### Banner Images
- **Size**: 1920×600px (wide)
- **Format**: JPG or PNG
- **Quality**: High (80-90%)
- **File size**: < 500KB

### Sample/Preview Images (for promotion)
- **Size**: 600×600px (square)
- **Format**: JPG or PNG
- **Quality**: High (80-90%)
- **File size**: < 150KB each

---

## 🚀 Quick Setup Guide

### 1. Prepare Your Images
```
📁 Prepare these images:
├── categories/
│   ├── custom-frames.jpg (800×800)
│   ├── photo-frames.jpg (800×800)
│   ├── wall-frames.jpg (800×800)
│   ├── birthday-frames.jpg (800×800)
│   ├── calligraphy-frames.jpg (800×800)
│   └── home-decor.jpg (800×800)
├── banners/
│   └── custom-frame-banner.jpg (1920×600)
└── samples/
    ├── frame-sample-1.jpg (600×600)
    ├── frame-sample-2.jpg (600×600)
    ├── frame-sample-3.jpg (600×600)
    └── frame-sample-4.jpg (600×600)
```

### 2. Upload to Cloudinary
```bash
# In Cloudinary dashboard:
1. Create folder: framekart/categories/
2. Upload all category images
3. Create folder: framekart/banners/
4. Upload banner image
5. Create folder: framekart/samples/
6. Upload sample images
```

### 3. Verify Upload
Visit these URLs (replace YOUR_CLOUD_NAME):
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/framekart/categories/custom-frames.jpg
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/framekart/banners/custom-frame-banner.jpg
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/framekart/samples/frame-sample-1.jpg
```

### 4. Test in Browser
```bash
npm run dev
# Visit http://localhost:3000
# Check categories section - images should load
```

---

## 🎨 Free Stock Photo Resources

Need images? Get them from:
- **Unsplash**: https://unsplash.com/s/photos/picture-frame
- **Pexels**: https://www.pexels.com/search/picture%20frame/
- **Pixabay**: https://pixabay.com/images/search/picture%20frame/

Search terms:
- "picture frame wall"
- "photo frame"
- "custom frame"
- "birthday frame"
- "home decor frame"

---

## 🔧 Troubleshooting

### Images Not Showing?
1. ✅ Check NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local
2. ✅ Verify images are uploaded to correct folder
3. ✅ Check image paths match exactly
4. ✅ Restart dev server after .env changes

### Images Too Large/Slow?
```typescript
// Add Cloudinary transformations for optimization
const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/w_800,q_80,f_auto/v1/${path}`;
// w_800 = width 800px
// q_80 = 80% quality
// f_auto = auto format (WebP for supported browsers)
```

### Need Different Images for Mobile?
```typescript
// Use responsive image with srcset
<img 
  src={`.../${path}`}
  srcSet={`
    .../${path}?w=400 400w,
    .../${path}?w=800 800w,
    .../${path}?w=1200 1200w
  `}
  sizes="(max-width: 768px) 400px, 800px"
/>
```

---

## 📝 Summary

**For Categories:**
1. Upload 6 images to Cloudinary: `framekart/categories/`
2. Images auto-load from `/lib/categories.ts`

**For Promotion Banner:**
1. Upload banner to: `framekart/banners/`
2. Upload samples to: `framekart/samples/`
3. Update `/app/page.tsx` with image tags

**That's it!** No complex setup needed. Just upload and go! 🚀
