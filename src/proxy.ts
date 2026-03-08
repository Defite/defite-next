import { auth } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl } = req;
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');
  const isAuthRoute = nextUrl.pathname === '/admin/login';

  // Allow access to login page if not authenticated
  if (isAuthRoute && !req.auth) {
    return NextResponse.next();
  }

  // Redirect to login if accessing admin routes without auth
  if (isAdminRoute && !req.auth) {
    return NextResponse.redirect(new URL('/admin/login', nextUrl));
  }

  // Redirect to admin dashboard if already authenticated and on login page
  if (isAuthRoute && req.auth) {
    return NextResponse.redirect(new URL('/admin', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*'],
};
