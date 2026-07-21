import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const session = request.cookies.get('session');

  // Protect the following routes
  const protectedRoutes = ['/book', '/consent-form', '/clients', '/therapists'];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Prevent logged-in users from accessing the login page
  if (session && request.nextUrl.pathname.startsWith('/login')) {
    // If the server tells us to clear the session (e.g. it expired), do so
    if (request.nextUrl.searchParams.get('clear_session') === '1') {
      const response = NextResponse.next();
      response.cookies.delete('session');
      return response;
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/book/:path*', '/consent-form/:path*', '/clients/:path*', '/therapists/:path*', '/login'],
};
