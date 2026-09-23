import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
  '/profile',
  '/orders',
  '/admin',
];

const authRoutes: string[] = [];

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('framekart_session')?.value;
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route) && !path.startsWith('/admin'));
  const isAdminRoute = path.startsWith('/admin') && path !== '/admin-login';
  const isAuthRoute = authRoutes.some(route => path.startsWith(route));

  if (isAdminRoute && !sessionToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin-login';
    url.searchParams.set('redirectUrl', path);
    return NextResponse.redirect(url);
  }

  if (isProtectedRoute && !sessionToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && sessionToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/profile';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
