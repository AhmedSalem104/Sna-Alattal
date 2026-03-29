import { NextRequest, NextResponse } from 'next/server';
import { getCompressors } from '@/lib/static-data';
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit';

// GET - List all compressors (public)
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request.headers);
    const rateLimitResult = checkRateLimit(`public:${ip}`, RATE_LIMITS.public);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)) } }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const compressors = getCompressors({
      ...(limit && { limit }),
    });

    return NextResponse.json(compressors, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (error) {
    console.error('Error fetching compressors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compressors' },
      { status: 500 }
    );
  }
}
