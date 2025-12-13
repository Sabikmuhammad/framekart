/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://framekart.co.in',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/admin/*',
    '/sign-in',
    '/sign-up',
    '/api/*',
    '/checkout',
    '/profile',
    '/orders/*',
    '/test-admin',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api',
          '/checkout',
          '/profile',
          '/orders',
          '/sign-in',
          '/sign-up',
          '/test-admin',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/api', '/checkout', '/profile', '/orders'],
      },
    ],
    additionalSitemaps: [
      'https://framekart.co.in/server-sitemap.xml', // For dynamic routes
    ],
  },
  // Default transformation for all pages
  transform: async (config, path) => {
    // Custom priority and changefreq based on route
    let priority = 0.7;
    let changefreq = 'weekly';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path === '/frames') {
      priority = 0.9;
      changefreq = 'daily';
    } else if (path.startsWith('/frames/')) {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (path === '/about' || path === '/contact') {
      priority = 0.6;
      changefreq = 'monthly';
    } else if (path === '/cart') {
      priority = 0.5;
      changefreq = 'never';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: [],
    };
  },
  autoLastmod: true,
};
