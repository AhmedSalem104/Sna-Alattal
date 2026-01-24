import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - List active catalogues (public)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const catalogues = await db.catalogue.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      ...(limit && { take: limit }),
    });

    return NextResponse.json(catalogues);
  } catch (error) {
    console.error('Error fetching catalogues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch catalogues' },
      { status: 500 }
    );
  }
}
