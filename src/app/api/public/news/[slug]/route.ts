import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get single news article by slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const news = await db.news.findFirst({
      where: {
        slug,
        isActive: true,
        deletedAt: null,
        publishedAt: { lte: new Date() },
      },
    });

    if (!news) {
      return NextResponse.json(
        { error: 'News article not found' },
        { status: 404 }
      );
    }

    // Get related news articles
    const relatedNews = await db.news.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        publishedAt: { lte: new Date() },
        id: { not: news.id },
      },
      take: 3,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        titleAr: true,
        titleEn: true,
        titleTr: true,
        slug: true,
        image: true,
        publishedAt: true,
      },
    });

    return NextResponse.json({
      ...news,
      relatedNews,
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
