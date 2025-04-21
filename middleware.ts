import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get token from cookies
  const token = request.cookies.get('token');

  // If token exists, redirect to dashboard
  if (token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Continue with request if no token
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - dashboard (already on dashboard)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|dashboard).*)',
  ],
};
