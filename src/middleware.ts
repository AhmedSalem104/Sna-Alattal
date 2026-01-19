import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const locales = ['ar', 'en', 'tr'];
const defaultLocale = 'ar';

// Protected admin routes
const protectedRoutes = ['/admin'];
const authRoutes = ['/admin/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle locale from cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
  const locale = localeCookie && locales.includes(localeCookie) ? localeCookie : defaultLocale;

  // Create response with locale header for next-intl
  const response = NextResponse.next();
  response.headers.set('x-next-intl-locale', locale);

  // Check if it's an admin route (except login)
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname.startsWith(route) && !pathname.startsWith('/admin/login')
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute || isAuthRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Redirect to login if not authenticated and trying to access protected route
    if (isProtectedRoute && !token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect to admin if authenticated and trying to access login
    if (isAuthRoute && token) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png$).*)',
  ],
};
