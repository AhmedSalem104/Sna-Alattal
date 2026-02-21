import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit';
import { db } from '@/lib/db';

// GET - List active TV interviews (public)
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

    const tvInterviews = await db.tVInterview.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      ...(limit && { take: limit }),
    });

    return NextResponse.json(tvInterviews, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (error) {
    console.error('Error fetching TV interviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TV interviews' },
      { status: 500 }
    );
  }
}
