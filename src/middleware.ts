import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['ar', 'en', 'tr'];
const defaultLocale = 'ar';

// Suspicious patterns to block
const BLOCKED_PATTERNS = [
  /\.\.\//, // Path traversal
  /\.(php|asp|aspx|jsp|cgi|sh|bash|cmd|bat|exe|dll)$/i, // Dangerous extensions
  /wp-admin|wp-login|wordpress|xmlrpc/i, // WordPress probes
  /phpmyadmin|adminer|mysql/i, // DB admin probes
  /\.env|\.git|\.svn|\.htaccess/i, // Sensitive files
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block suspicious requests
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(pathname)) {
      return new NextResponse('Not Found', { status: 404 });
    }
  }

  // Block excessively large URLs (potential buffer overflow attacks)
  if (request.url.length > 4096) {
    return new NextResponse('URI Too Long', { status: 414 });
  }

  // Handle locale from cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
  const locale = localeCookie && locales.includes(localeCookie) ? localeCookie : defaultLocale;

  // Create response with locale header for next-intl
  const response = NextResponse.next();
  response.headers.set('x-next-intl-locale', locale);

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
