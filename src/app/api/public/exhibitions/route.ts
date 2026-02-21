import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseImages } from '@/lib/parse-images';
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit';

// GET - List active exhibitions (public)
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

    const exhibitions = await db.exhibition.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      orderBy: [{ startDate: 'desc' }, { createdAt: 'desc' }],
      ...(limit && { take: limit }),
    });

    // Ensure images is always a proper array
    const transformedExhibitions = exhibitions.map(e => ({
      ...e,
      images: parseImages(e.images),
    }));

    return NextResponse.json(transformedExhibitions, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (error) {
    console.error('Error fetching exhibitions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exhibitions' },
      { status: 500 }
    );
  }
}
