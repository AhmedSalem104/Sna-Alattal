import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - List active products (public)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const categoryId = searchParams.get('categoryId');

    const products = await db.product.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        ...(featured && { isFeatured: true }),
        ...(categoryId && { categoryId }),
      },
      include: {
        category: {
          select: { id: true, nameAr: true, nameEn: true, nameTr: true, slug: true },
        },
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      ...(limit && { take: limit }),
    });

    // Helper to parse images field (could be string or array)
    const parseImages = (images: unknown): string[] => {
      if (Array.isArray(images)) return images;
      if (typeof images === 'string') {
        try {
          const parsed = JSON.parse(images);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
      return [];
    };

    // Transform products to ensure images is always an array
    const transformedProducts = products.map(p => ({
      ...p,
      images: parseImages(p.images),
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
