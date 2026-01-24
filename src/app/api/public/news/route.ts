import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - List active news (public)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const news = await db.news.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        publishedAt: { lte: new Date() },
        ...(featured && { isFeatured: true }),
      },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      ...(limit && { take: limit }),
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
