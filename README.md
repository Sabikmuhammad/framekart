# FrameKart - Modern Online Frame Store

A complete, production-ready e-commerce website for selling wall frames, built with Next.js 14, TypeScript, MongoDB, and integrated with Clerk Authentication, Razorpay Payments, and Cloudinary.

## 🚀 Features

### 🛍️ E-Commerce Features
- Browse frames with category filtering
- Product detail pages with image gallery
- Shopping cart with local storage persistence
- Secure checkout with Razorpay integration
- Order tracking and history

### 👤 User Features
- Authentication with Clerk (Login/Register)
- User profile management
- Order history
- Protected routes

### 🔐 Admin Dashboard
- Complete CRUD operations for frames
- User management
- Order management
- Image upload to Cloudinary
- Analytics dashboard

### 🎨 Design Features
- Modern, clean UI with ShadCN components
- Responsive design (mobile-first)
- Dark/Light mode support
- Smooth animations with Framer Motion
- Glassmorphism effects

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk
- **Payment**: Razorpay
- **Image Storage**: Cloudinary
- **State Management**: Zustand
- **Animations**: Framer Motion

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd framekart
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
framekart/
├── app/
│   ├── (pages)/
│   │   ├── about/
│   │   ├── contact/
│   │   ├── frames/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── profile/
│   │   └── orders/
│   ├── admin/
│   │   ├── frames/
│   │   ├── orders/
│   │   ├── users/
│   │   └── uploads/
│   ├── api/
│   │   ├── frames/
│   │   ├── orders/
│   │   ├── users/
│   │   ├── razorpay/
│   │   ├── upload/
│   │   └── webhooks/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── ui/
│   └── FrameCard.tsx
├── lib/
│   ├── db.ts
│   └── utils.ts
├── models/
│   ├── User.ts
│   ├── Frame.ts
│   └── Order.ts
├── store/
│   └── cart.ts
└── public/
```

## 🔑 Key Features Explained

### Authentication
- Clerk handles all authentication
- Webhook syncs user data to MongoDB
- Role-based access control (admin/user)

### Shopping Cart
- Managed with Zustand
- Persisted in local storage
- Automatically calculates totals

### Payments
- Razorpay integration
- Secure payment verification
- Order creation on successful payment

### Admin Dashboard
- Protected routes
- Full CRUD for products
- Image uploads to Cloudinary
- User and order management

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### MongoDB Atlas Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Add to `MONGODB_URI` in environment variables

### Clerk Setup

1. Create account at [Clerk](https://clerk.com)
2. Create new application
3. Get API keys
4. Set up webhook for user sync at `/api/webhooks/clerk`

### Razorpay Setup

1. Create account at [Razorpay](https://razorpay.com)
2. Get API keys from dashboard
3. Add to environment variables

### Cloudinary Setup

1. Create account at [Cloudinary](https://cloudinary.com)
2. Get cloud name and API credentials
3. Add to environment variables

## 📝 API Routes

### Frames
- `GET /api/frames` - List all frames
- `POST /api/frames` - Create frame (admin)
- `GET /api/frames/[slug]` - Get frame by slug
- `PUT /api/frames/edit/[id]` - Update frame (admin)
- `DELETE /api/frames/edit/[id]` - Delete frame (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/user` - Get user orders
- `GET /api/orders/[id]` - Get order by ID

### Razorpay
- `POST /api/razorpay/order` - Create Razorpay order
- `POST /api/razorpay/verify` - Verify payment

### Upload
- `POST /api/upload` - Upload image to Cloudinary

### Users
- `GET /api/users` - Get all users (admin)

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to customize the color scheme.

### Components
All UI components are in `components/ui/` and can be customized.

### Database Models
Modify schemas in `models/` directory.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email info@framekart.com or create an issue in the repository.

---

Built with ❤️ using Next.js and TypeScript
