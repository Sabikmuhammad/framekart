# 🗺️ SEO & Sitemap Configuration

## ✅ What Was Implemented

### 1. **Automatic Sitemap Generation**
- **Package:** `next-sitemap` installed
- **Config:** `next-sitemap.config.js` created
- **Sitemaps Generated:**
  - `/sitemap.xml` - Main sitemap
  - `/server-sitemap.xml` - Dynamic routes (frame products)
  - `/robots.txt` - Search engine instructions

### 2. **Routes Included in Sitemap**

**Static Routes:**
- `/` (Homepage) - Priority: 1.0, Daily updates
- `/frames` (Product catalog) - Priority: 0.9, Daily updates
- `/about` - Priority: 0.6, Monthly updates
- `/contact` - Priority: 0.6, Monthly updates
- `/cart` - Priority: 0.5, Never updates

**Dynamic Routes:**
- `/frames/[slug]` - All product pages from database
  - Priority: 0.8
  - Weekly updates
  - Automatically updated when products change

### 3. **Routes Excluded from Sitemap**
- `/admin/*` - Admin dashboard
- `/sign-in`, `/sign-up` - Auth pages
- `/checkout` - Checkout flow
- `/profile` - User profile
- `/orders/*` - Order details
- `/api/*` - API routes

### 4. **robots.txt Configuration**

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /checkout
Disallow: /profile
Disallow: /orders

User-agent: Googlebot
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /checkout
Disallow: /profile

Sitemap: https://framekart.co.in/sitemap.xml
Sitemap: https://framekart.co.in/server-sitemap.xml
```

---

## 📁 Files Created/Modified

### New Files:
1. **`next-sitemap.config.js`** - Sitemap configuration
2. **`app/server-sitemap.xml/route.ts`** - Dynamic sitemap for products
3. **`public/sitemap.xml`** - Generated sitemap (auto-created on build)
4. **`public/robots.txt`** - Generated robots.txt (auto-created on build)

### Modified Files:
1. **`package.json`** - Added postbuild script
2. **`.env.local`** - Added SITE_URL variable
3. **`.env.example`** - Added SITE_URL example

---

## 🚀 Deployment Instructions

### **Step 1: Set Environment Variable in Vercel**

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add new variable:
   - **Key:** `SITE_URL`
   - **Value:** `https://framekart.co.in`
   - **Environment:** Production, Preview, Development

### **Step 2: Deploy**

The sitemap will be automatically generated on every build:

```bash
git add .
git commit -m "Add SEO sitemap and robots.txt configuration"
git push origin main
```

Vercel will:
1. Build the project
2. Run `postbuild` script
3. Generate `sitemap.xml` and `robots.txt`
4. Deploy to production

### **Step 3: Verify**

After deployment, verify these URLs work:
- ✅ https://framekart.co.in/sitemap.xml
- ✅ https://framekart.co.in/server-sitemap.xml
- ✅ https://framekart.co.in/robots.txt

---

## 🔍 How It Works

### Build Process:
1. **Next.js builds** the static pages
2. **`postbuild` script runs** automatically
3. **`next-sitemap` generates:**
   - Static routes from `.next` directory
   - Dynamic routes from `/server-sitemap.xml` API
   - `robots.txt` with proper directives

### Dynamic Sitemap:
- **Route:** `/server-sitemap.xml`
- **Purpose:** Fetch all product slugs from MongoDB
- **Updates:** Real-time, queries database on each request
- **Filters:** Only includes products with stock > 0

---

## 📊 SEO Benefits

1. **Better Indexing**
   - Search engines find all pages easily
   - Dynamic products included automatically
   - Priority hints guide crawlers

2. **Faster Discovery**
   - New products appear in Google within days
   - Sitemap submitted to Google Search Console
   - robots.txt prevents wasted crawl budget

3. **Control**
   - Admin pages hidden from search
   - User-specific pages excluded
   - API routes blocked

---

## 🔧 Customization

### Add More Static Routes:

Edit `next-sitemap.config.js`:

```javascript
transform: async (config, path) => {
  if (path === '/new-page') {
    priority = 0.8;
    changefreq = 'weekly';
  }
  // ... rest of config
}
```

### Change Update Frequency:

Modify priorities and changefreq in `next-sitemap.config.js`:
- `daily` - Homepage, catalog
- `weekly` - Product pages
- `monthly` - Static pages
- `never` - Cart, checkout

### Exclude More Routes:

Add to `exclude` array in config:

```javascript
exclude: [
  '/admin/*',
  '/your-new-excluded-route',
],
```

---

## 📈 Google Search Console Setup

### Step 1: Submit Sitemap
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property (framekart.co.in)
3. Go to **Sitemaps** in left menu
4. Enter: `sitemap.xml`
5. Click **Submit**

### Step 2: Monitor
- Check "Coverage" for indexing status
- Review "Sitemap" for errors
- Monitor "Performance" for traffic

---

## 🐛 Troubleshooting

### Sitemap not generating?
```bash
# Run manually
npm run postbuild

# Check output
ls -la public/sitemap.xml
```

### Wrong domain in sitemap?
- Check `SITE_URL` env variable in Vercel
- Should be `https://framekart.co.in` (no trailing slash)

### Dynamic products not showing?
- Verify `/server-sitemap.xml` route works
- Check MongoDB connection
- Ensure products have stock > 0

### Build fails?
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## 📝 Notes

- ✅ Sitemap regenerates on every deployment
- ✅ Dynamic products always up-to-date
- ✅ Compatible with Next.js App Router
- ✅ Works with Vercel's build process
- ✅ No manual updates needed

---

## 🎯 Next Steps

1. ✅ Deploy to production
2. ✅ Verify sitemap URLs work
3. ⏳ Submit sitemap to Google Search Console
4. ⏳ Submit sitemap to Bing Webmaster Tools
5. ⏳ Monitor indexing status weekly
6. ⏳ Add structured data (schema.org) for products
7. ⏳ Implement meta tags optimization

---

**Status:** ✅ Ready for Production Deployment
