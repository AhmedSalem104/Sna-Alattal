import { NextRequest, NextResponse } from 'next/server';
import { getNewsBySlug } from '@/lib/static-data';

// GET - Get single news article by slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const result = getNewsBySlug(slug);

    if (!result) {
      return NextResponse.json(
        { error: 'News article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
