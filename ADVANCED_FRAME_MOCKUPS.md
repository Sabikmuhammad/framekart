# Advanced Frame Mockups Guide

## Using PNG Frame Overlays for Realistic Frames

For production-level frame mockups, you can use actual frame PNG images with transparent centers.

---

## 📁 Recommended Folder Structure

```
public/
└── frames/
    ├── black-frame.png
    ├── white-frame.png
    └── wooden-frame.png
```

---

## 🎨 Creating Frame PNG Assets

### Option 1: Design Your Own (Figma/Photoshop)

1. Create a square canvas (e.g., 1000x1000px)
2. Draw frame border around edges
3. Make center transparent
4. Add realistic shadows and bevels
5. Export as PNG with transparency

### Option 2: Use Online Frame Generators

- **Mockup World**: Free frame mockups
- **Smartmockups**: Frame templates
- **Canva**: Frame elements
- **Freepik**: Frame PNGs

### Option 3: Use CSS-Only Frames (Current Implementation)

The current system uses CSS for frames, which is:
- ✅ Lightweight (no image loading)
- ✅ Fast rendering
- ✅ Easily customizable
- ✅ No additional assets needed

---

## 🖼️ Implementation with PNG Overlays

### Basic Implementation

```tsx
interface FrameWithPNGProps {
  imageUrl: string;
  frameStyle: "Black" | "White" | "Wooden";
}

export default function FrameWithPNG({ imageUrl, frameStyle }: FrameWithPNGProps) {
  const frameImages = {
    Black: "/frames/black-frame.png",
    White: "/frames/white-frame.png",
    Wooden: "/frames/wooden-frame.png",
  };

  return (
    <div className="relative w-full h-full">
      {/* User's Image */}
      <img
        src={imageUrl}
        alt="Customer upload"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Frame Overlay */}
      <img
        src={frameImages[frameStyle]}
        alt={`${frameStyle} frame`}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 10 }}
      />
    </div>
  );
}
```

### Advanced Implementation with Shadow Effects

```tsx
export default function AdvancedFrameWithPNG({ 
  imageUrl, 
  frameStyle 
}: FrameWithPNGProps) {
  const frameImages = {
    Black: "/frames/black-frame.png",
    White: "/frames/white-frame.png",
    Wooden: "/frames/wooden-frame.png",
  };

  return (
    <div className="relative w-full h-full">
      {/* Container with 3D effect */}
      <div 
        className="absolute inset-0 rounded-lg"
        style={{
          boxShadow: `
            0 10px 30px -5px rgba(0, 0, 0, 0.3),
            0 20px 50px -10px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `
        }}
      >
        {/* Background Mat */}
        <div className="absolute inset-0 bg-white p-8">
          {/* User's Image */}
          <img
            src={imageUrl}
            alt="Customer upload"
            className="w-full h-full object-cover shadow-lg"
          />
        </div>
        
        {/* Frame Overlay PNG */}
        <img
          src={frameImages[frameStyle]}
          alt={`${frameStyle} frame`}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 10 }}
        />
        
        {/* Glass Reflection Effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(
              135deg, 
              rgba(255,255,255,0.1) 0%, 
              transparent 50%
            )`,
            zIndex: 11
          }}
        />
      </div>
    </div>
  );
}
```

---

## 🎯 Updating Custom Frame Page

To use PNG overlays in the main custom frame page:

```tsx
// In /app/custom-frame/page.tsx

// Replace the current preview div with:

<div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-inner">
  {uploadedImage ? (
    <>
      {/* User's uploaded image */}
      <img
        src={uploadedImage}
        alt="Your uploaded image"
        className="absolute inset-0 w-full h-full object-cover p-8"
      />
      
      {/* Frame PNG overlay */}
      <img
        src={`/frames/${frameStyle.toLowerCase()}-frame.png`}
        alt={`${frameStyle} frame`}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />
    </>
  ) : (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center text-gray-400">
        <Upload className="w-16 h-16 mx-auto mb-4 opacity-30" />
        <p className="text-sm">Upload an image to preview</p>
      </div>
    </div>
  )}
</div>
```

---

## 🎨 Frame Design Specifications

### Black Frame
```
Dimensions: 1000x1000px
Frame width: 80px
Center opening: 840x840px
Color: #1a1a1a
Effects: Subtle gradient, inner shadow
Format: PNG with transparency
```

### White Frame
```
Dimensions: 1000x1000px
Frame width: 80px
Center opening: 840x840px
Color: #f5f5f5
Effects: Soft shadow, slight texture
Format: PNG with transparency
```

### Wooden Frame
```
Dimensions: 1000x1000px
Frame width: 80px
Center opening: 840x840px
Color: #8B4513 with wood grain
Effects: Wood texture, depth shadows
Format: PNG with transparency
```

---

## 🖼️ Sample Frame Template (SVG)

Here's a simple SVG frame you can use as a starting point:

```svg
<svg width="1000" height="1000" xmlns="http://www.w3.org/2000/svg">
  <!-- Outer frame -->
  <rect width="1000" height="1000" fill="#1a1a1a"/>
  
  <!-- Inner beveled edge -->
  <rect x="40" y="40" width="920" height="920" fill="#2a2a2a"/>
  
  <!-- Mat -->
  <rect x="80" y="80" width="840" height="840" fill="#ffffff"/>
  
  <!-- Inner shadow -->
  <defs>
    <linearGradient id="innerShadow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(0,0,0,0.2);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgba(0,0,0,0);stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="80" y="80" width="840" height="840" fill="url(#innerShadow)"/>
  
  <!-- Transparent center (this is where the image shows through) -->
  <rect x="100" y="100" width="800" height="800" fill="none"/>
</svg>
```

---

## 📊 Performance Comparison

### CSS Frames (Current)
- ✅ Load time: Instant
- ✅ File size: 0 bytes
- ✅ Customizable: Yes
- ⚠️ Realism: Good

### PNG Frames
- ⚠️ Load time: 1-2s (cached: instant)
- ⚠️ File size: ~50-200KB per frame
- ⚠️ Customizable: No (need new asset)
- ✅ Realism: Excellent

### Recommendation
**For FrameKart:** Stick with CSS frames for now. They're fast, lightweight, and look great. Upgrade to PNG frames if customers request more realistic mockups.

---

## 🎯 Best Practices

1. **Optimize PNGs**
   - Use TinyPNG or ImageOptim
   - Target < 100KB per frame
   - Use appropriate compression

2. **Lazy Loading**
   ```tsx
   <img 
     src="/frames/black-frame.png"
     loading="lazy"
     alt="Frame"
   />
   ```

3. **Preload Critical Frames**
   ```tsx
   // In page head
   <link rel="preload" as="image" href="/frames/black-frame.png" />
   ```

4. **Fallback to CSS**
   ```tsx
   const [imageLoaded, setImageLoaded] = useState(false);
   
   <img
     src={frameImage}
     onLoad={() => setImageLoaded(true)}
     onError={() => setImageLoaded(false)}
   />
   
   {!imageLoaded && <CSSFrame />}
   ```

---

## 🔄 Migration Path

**Phase 1:** Current CSS implementation (✅ Complete)  
**Phase 2:** Create/source frame PNGs (if needed)  
**Phase 3:** Update component to use PNGs  
**Phase 4:** A/B test with users  
**Phase 5:** Monitor performance & user feedback  

---

## 🎨 Free Frame Resources

1. **Freepik** - https://freepik.com (search "photo frame PNG")
2. **Pngtree** - https://pngtree.com
3. **Pixabay** - https://pixabay.com
4. **CleanPNG** - https://cleanpng.com
5. **Vecteezy** - https://vecteezy.com

**Search Terms:**
- "Photo frame PNG transparent"
- "Picture frame overlay"
- "Frame mockup PNG"
- "Wood frame transparent background"

---

## ✅ Current Implementation Status

The current FrameKart implementation uses **CSS-based frames** which provides:
- ✅ Zero load time
- ✅ Infinite customization
- ✅ Perfect for MVP
- ✅ Professional appearance
- ✅ Easy to maintain

**No immediate action needed** unless you want photorealistic frames.

---

## 💡 Pro Tips

1. **For Maximum Realism:** Combine both - use PNG for main frame, CSS for shadows/effects

2. **Size Variations:** Create different frame widths for different sizes (A4 gets thinner frame, 24x36 gets thicker)

3. **Shadow Layers:** Stack multiple subtle shadows for depth

4. **Texture Overlays:** Add subtle noise/grain for wooden frames

5. **Lighting Effects:** Use CSS gradients to simulate light sources

---

This guide is optional - your current CSS implementation is production-ready! 🚀
