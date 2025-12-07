# 📂 FrameKart - Complete Project Structure

```
framekart/
│
├── 📁 app/                                 # Next.js App Directory
│   ├── 📁 about/
│   │   └── page.tsx                       # About page
│   │
│   ├── 📁 admin/                          # Admin Dashboard (Protected)
│   │   ├── layout.tsx                     # Admin layout with sidebar
│   │   ├── page.tsx                       # Admin dashboard
│   │   ├── 📁 frames/
│   │   │   └── page.tsx                   # Manage frames (CRUD)
│   │   ├── 📁 orders/
│   │   │   └── page.tsx                   # View all orders
│   │   ├── 📁 users/
│   │   │   └── page.tsx                   # View all users
│   │   └── 📁 uploads/
│   │       └── page.tsx                   # Upload images to Cloudinary
│   │
│   ├── 📁 api/                            # API Routes
│   │   ├── 📁 frames/
│   │   │   ├── route.ts                   # GET (list), POST (create)
│   │   │   ├── 📁 [slug]/
│   │   │   │   └── route.ts               # GET frame by slug
│   │   │   └── 📁 edit/
│   │   │       └── 📁 [id]/
│   │   │           └── route.ts           # PUT (update), DELETE
│   │   │
│   │   ├── 📁 orders/
│   │   │   ├── route.ts                   # POST (create order)
│   │   │   ├── 📁 user/
│   │   │   │   └── route.ts               # GET user orders
│   │   │   └── 📁 [id]/
│   │   │       └── route.ts               # GET order by ID
│   │   │
│   │   ├── 📁 razorpay/
│   │   │   ├── 📁 order/
│   │   │   │   └── route.ts               # POST create Razorpay order
│   │   │   └── 📁 verify/
│   │   │       └── route.ts               # POST verify payment
│   │   │
│   │   ├── 📁 upload/
│   │   │   └── route.ts                   # POST upload to Cloudinary
│   │   │
│   │   ├── 📁 users/
│   │   │   └── route.ts                   # GET all users (admin)
│   │   │
│   │   └── 📁 webhooks/
│   │       └── 📁 clerk/
│   │           └── route.ts               # POST Clerk user sync
│   │
│   ├── 📁 cart/
│   │   └── page.tsx                       # Shopping cart page
│   │
│   ├── 📁 checkout/
│   │   └── page.tsx                       # Checkout with Razorpay
│   │
│   ├── 📁 contact/
│   │   └── page.tsx                       # Contact form page
│   │
│   ├── 📁 frames/
│   │   ├── page.tsx                       # All frames listing
│   │   └── 📁 [slug]/
│   │       └── page.tsx                   # Frame detail page
│   │
│   ├── 📁 orders/
│   │   └── 📁 [id]/
│   │       └── page.tsx                   # Order details page
│   │
│   ├── 📁 profile/
│   │   └── page.tsx                       # User profile & order history
│   │
│   ├── 📁 sign-in/
│   │   └── 📁 [[...sign-in]]/
│   │       └── page.tsx                   # Clerk sign-in page
│   │
│   ├── 📁 sign-up/
│   │   └── 📁 [[...sign-up]]/
│   │       └── page.tsx                   # Clerk sign-up page
│   │
│   ├── error.tsx                          # Global error boundary
│   ├── globals.css                        # Global styles (Tailwind)
│   ├── layout.tsx                         # Root layout (Navbar, Footer)
│   ├── loading.tsx                        # Global loading component
│   ├── not-found.tsx                      # 404 page
│   └── page.tsx                           # Homepage
│
├── 📁 components/                         # React Components
│   ├── 📁 layout/
│   │   ├── Footer.tsx                     # Site footer
│   │   └── Navbar.tsx                     # Navigation bar
│   │
│   ├── 📁 ui/                             # ShadCN UI Components
│   │   ├── button.tsx                     # Button component
│   │   ├── card.tsx                       # Card component
│   │   ├── input.tsx                      # Input component
│   │   ├── label.tsx                      # Label component
│   │   ├── select.tsx                     # Select dropdown
│   │   ├── textarea.tsx                   # Textarea component
│   │   ├── toast.tsx                      # Toast notification
│   │   ├── toaster.tsx                    # Toast container
│   │   └── use-toast.ts                   # Toast hook
│   │
│   ├── FrameCard.tsx                      # Product card component
│   └── components.json                    # ShadCN config
│
├── 📁 lib/                                # Utilities & Helpers
│   ├── db.ts                              # MongoDB connection
│   ├── seed-data.ts                       # Dummy frames data
│   └── utils.ts                           # Utility functions
│
├── 📁 models/                             # Mongoose Models
│   ├── Frame.ts                           # Frame schema
│   ├── Order.ts                           # Order schema
│   └── User.ts                            # User schema
│
├── 📁 store/                              # State Management
│   └── cart.ts                            # Zustand cart store
│
├── 📁 public/                             # Static assets
│   └── (add your images here)
│
├── .env.local.example                     # Environment variables template
├── .eslintrc.json                         # ESLint configuration
├── .gitignore                             # Git ignore file
├── DEPLOYMENT.md                          # Deployment checklist
├── middleware.ts                          # Next.js middleware (auth)
├── next.config.js                         # Next.js configuration
├── package.json                           # Dependencies
├── postcss.config.js                      # PostCSS configuration
├── PROJECT_SUMMARY.md                     # Project overview
├── QUICK_REFERENCE.md                     # Quick reference guide
├── README.md                              # Main documentation
├── SETUP.md                               # Setup instructions
├── tailwind.config.ts                     # Tailwind configuration
└── tsconfig.json                          # TypeScript configuration

```

## 📊 File Count Summary

### Total Files: ~60 files

#### By Directory:
- **app/**: ~30 files (pages, layouts, API routes)
- **components/**: ~12 files (UI + custom components)
- **models/**: 3 files (database schemas)
- **lib/**: 3 files (utilities)
- **store/**: 1 file (cart state)
- **config files**: ~10 files
- **documentation**: 5 files

#### By Type:
- **TypeScript/TSX**: ~45 files
- **CSS**: 1 file
- **JSON**: ~5 files
- **JavaScript**: ~4 files
- **Markdown**: 5 files

## 🎯 Key File Purposes

### Configuration Files
- `next.config.js` → Next.js settings
- `tailwind.config.ts` → Styling configuration
- `tsconfig.json` → TypeScript settings
- `package.json` → Dependencies
- `.env.local` → Environment variables

### Core Application
- `app/layout.tsx` → Global layout wrapper
- `app/page.tsx` → Homepage
- `middleware.ts` → Authentication middleware

### Database Layer
- `lib/db.ts` → MongoDB connection
- `models/*.ts` → Data schemas

### State Management
- `store/cart.ts` → Shopping cart logic

### API Layer
- `app/api/**` → Backend endpoints

### UI Components
- `components/ui/**` → Reusable UI elements
- `components/layout/**` → Layout components

## 📝 Documentation Files

1. **README.md** - Main project documentation
2. **SETUP.md** - Step-by-step setup guide
3. **DEPLOYMENT.md** - Production deployment checklist
4. **PROJECT_SUMMARY.md** - Complete feature overview
5. **QUICK_REFERENCE.md** - Quick reference for common tasks
6. **FILE_STRUCTURE.md** - This file!

## 🔍 Finding Specific Code

### Need to find...?

**Homepage content** → `app/page.tsx`
**Navigation bar** → `components/layout/Navbar.tsx`
**Cart logic** → `store/cart.ts`
**Payment handling** → `app/api/razorpay/**`
**Admin panel** → `app/admin/**`
**Frame CRUD** → `app/api/frames/**`
**Database models** → `models/**`
**Styling** → `app/globals.css` + `tailwind.config.ts`

## 💾 Database Files

```
MongoDB (Cloud)
└── framekart database
    ├── users collection (User.ts)
    ├── frames collection (Frame.ts)
    └── orders collection (Order.ts)
```

## 🌐 External Services

```
Third-Party Integrations
├── Clerk (Authentication)
│   └── Webhook → /api/webhooks/clerk
│
├── Razorpay (Payments)
│   ├── Order → /api/razorpay/order
│   └── Verify → /api/razorpay/verify
│
└── Cloudinary (Images)
    └── Upload → /api/upload
```

## 🎨 UI Component Hierarchy

```
RootLayout (app/layout.tsx)
├── Navbar
├── Main Content (children)
│   ├── Page Components
│   │   ├── FrameCard (product display)
│   │   ├── Card, Button, Input (UI primitives)
│   │   └── Toast (notifications)
│   └── Admin Layout (admin/layout.tsx)
│       └── Admin Pages
└── Footer
└── Toaster (global)
```

## 🔐 Protected Routes

```
Public Routes
├── / (homepage)
├── /frames (browse)
├── /frames/[slug] (details)
├── /about
└── /contact

User Routes (Login Required)
├── /cart
├── /checkout
├── /profile
└── /orders/[id]

Admin Routes (Admin Role Required)
├── /admin
├── /admin/frames
├── /admin/orders
├── /admin/users
└── /admin/uploads
```

---

**This structure provides a complete, production-ready e-commerce platform!** 🎉
