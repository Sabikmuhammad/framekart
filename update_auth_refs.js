const fs = require('fs');

// 1. Update lib/admin-auth.ts
let adminAuthPath = './lib/admin-auth.ts';
let adminAuth = fs.readFileSync(adminAuthPath, 'utf8');
adminAuth = adminAuth.replace('redirect("/whatsapp-login")', 'redirect("/admin-login")');
fs.writeFileSync(adminAuthPath, adminAuth, 'utf8');

// 2. Update middleware.ts
let middlewarePath = './middleware.ts';
let middleware = fs.readFileSync(middlewarePath, 'utf8');
middleware = middleware.replace(
  `const authRoutes = [
  '/whatsapp-login',
  '/sign-in',
  '/sign-up'
];`, 
  `const authRoutes: string[] = [];`
);
middleware = middleware.replace(
  `  if (isProtectedRoute && !sessionToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/whatsapp-login';
    url.searchParams.set('redirectUrl', path);
    return NextResponse.redirect(url);
  }`,
  `  if (isProtectedRoute && !sessionToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }`
);
fs.writeFileSync(middlewarePath, middleware, 'utf8');

// 3. Update checkout
let checkoutPath = './app/checkout/page.tsx';
let checkout = fs.readFileSync(checkoutPath, 'utf8');
checkout = checkout.replace(
  `    if (!isSignedIn) {
      router.push("/whatsapp-login");
      return;
    }`,
  ``
);
fs.writeFileSync(checkoutPath, checkout, 'utf8');

// 4. Update sitemap.xml
let sitemapPath = './public/sitemap.xml';
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
// Use regex to remove whatsapp-login URL block
sitemap = sitemap.replace(/<url><loc>https:\/\/framekart\.co\.in\/whatsapp-login<\/loc><lastmod>[^<]+<\/lastmod><changefreq>weekly<\/changefreq><priority>0\.7<\/priority><\/url>/, '');
fs.writeFileSync(sitemapPath, sitemap, 'utf8');

console.log("Basic references updated.");
