import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get single solution by slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const solution = await db.solution.findFirst({
      where: {
        slug,
        isActive: true,
        deletedAt: null,
      },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                nameAr: true,
                nameEn: true,
                nameTr: true,
                slug: true,
                image: true,
                descriptionAr: true,
                descriptionEn: true,
                descriptionTr: true,
              },
            },
          },
        },
      },
    });

    if (!solution) {
      return NextResponse.json(
        { error: 'Solution not found' },
        { status: 404 }
      );
    }

    // Get related solutions
    const relatedSolutions = await db.solution.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        id: { not: solution.id },
      },
      take: 3,
      orderBy: { order: 'asc' },
      select: {
        id: true,
        nameAr: true,
        nameEn: true,
        nameTr: true,
        slug: true,
        icon: true,
      },
    });

    return NextResponse.json({
      ...solution,
      relatedSolutions,
    });
  } catch (error) {
    console.error('Error fetching solution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch solution' },
      { status: 500 }
    );
  }
}
