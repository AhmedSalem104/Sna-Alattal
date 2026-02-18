import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - List active TV interviews (public)
export async function GET(request: NextRequest) {
  try {
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
