import { NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit';

const handler = NextAuth(authOptions);

async function rateLimitedHandler(request: NextRequest) {
  // Only rate limit POST (login attempts), not GET (session checks)
  if (request.method === 'POST') {
    const ip = getClientIP(request.headers);
    const rateLimitResult = checkRateLimit(`auth:${ip}`, RATE_LIMITS.auth);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }
  }

  return handler(request, { params: Promise.resolve({}) }) as Promise<Response>;
}

export { handler as GET };
export { rateLimitedHandler as POST };
