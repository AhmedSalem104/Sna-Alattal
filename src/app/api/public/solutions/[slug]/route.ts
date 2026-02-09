import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseImages } from '@/lib/parse-images';

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
                images: true,
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

    // Transform products to include image field from images array
    const transformedProducts = solution.products.map(sp => {
      const imgs = parseImages(sp.product.images);
      return {
        ...sp,
        product: {
          ...sp.product,
          image: imgs.length > 0 ? imgs[0] : '/images/placeholders/product.svg',
        },
      };
    });

    // Safely parse features
    let features = solution.features;
    if (typeof features === 'string') {
      try { features = JSON.parse(features); } catch { features = []; }
    }
    if (!Array.isArray(features)) {
      features = [];
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
        titleAr: true,
        titleEn: true,
        titleTr: true,
        slug: true,
        icon: true,
      },
    });

    return NextResponse.json({
      ...solution,
      features,
      products: transformedProducts,
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
