import { NextRequest, NextResponse } from 'next/server';
import { getCompressorBySlug } from '@/lib/static-data';

// GET - Get single compressor by slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const result = getCompressorBySlug(slug);

    if (!result) {
      return NextResponse.json(
        { error: 'Compressor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching compressor:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compressor' },
      { status: 500 }
    );
  }
}
