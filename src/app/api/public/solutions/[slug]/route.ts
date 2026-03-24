import { NextRequest, NextResponse } from 'next/server';
import { getSolutionBySlug } from '@/lib/static-data';

// GET - Get single solution by slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const result = getSolutionBySlug(slug);

    if (!result) {
      return NextResponse.json(
        { error: 'Solution not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching solution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch solution' },
      { status: 500 }
    );
  }
}
