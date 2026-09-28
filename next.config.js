/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
    ],
  },
  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' ${process.env.NODE_ENV !== 'production' ? "'unsafe-eval'" : ""} 'unsafe-inline' https://sdk.cashfree.com https://checkout.cashfree.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://res.cloudinary.com;
      font-src 'self' data:;
      connect-src 'self' https://api.cashfree.com https://sandbox.cashfree.com https://checkout.cashfree.com https://payments.cashfree.com https://*.cashfree.com;
      frame-src 'self' https://checkout.cashfree.com https://sandbox.cashfree.com https://payments.cashfree.com https://*.cashfree.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self' https://api.cashfree.com https://checkout.cashfree.com https://sandbox.cashfree.com https://payments.cashfree.com https://*.cashfree.com;
      frame-ancestors 'none';
    `.replace(/\s{2,}/g, ' ').trim()

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN' // Prevent Clickjacking
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff' // Prevent MIME sniffing
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains' // Enforce HTTPS
          },
          {
            key: 'Content-Security-Policy',
            value: cspHeader
          }
        ],
      },
    ]
  },
};

module.exports = nextConfig;
