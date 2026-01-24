import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - List active exhibitions (public)
export async function GET(request: NextRequest) {
  try {
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

    return NextResponse.json(exhibitions);
  } catch (error) {
    console.error('Error fetching exhibitions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exhibitions' },
      { status: 500 }
    );
  }
}
