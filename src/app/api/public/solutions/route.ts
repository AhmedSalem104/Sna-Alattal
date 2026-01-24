import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - List active solutions (public)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const solutions = await db.solution.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        ...(featured && { isFeatured: true }),
      },
      include: {
        products: {
          include: {
            product: {
              select: { id: true, nameAr: true, nameEn: true, nameTr: true, slug: true },
            },
          },
        },
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      ...(limit && { take: limit }),
    });

    return NextResponse.json(solutions);
  } catch (error) {
    console.error('Error fetching solutions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch solutions' },
      { status: 500 }
    );
  }
}
