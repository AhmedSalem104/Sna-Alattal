import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get single product by slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await db.product.findFirst({
      where: {
        slug,
        isActive: true,
        deletedAt: null,
      },
      include: {
        category: {
          select: { id: true, nameAr: true, nameEn: true, nameTr: true, slug: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get related products from same category
    const relatedProducts = await db.product.findMany({
      where: {
        categoryId: product.categoryId,
        isActive: true,
        deletedAt: null,
        id: { not: product.id },
      },
      take: 4,
      orderBy: { order: 'asc' },
      select: {
        id: true,
        nameAr: true,
        nameEn: true,
        nameTr: true,
        slug: true,
        images: true,
      },
    });

    // Transform related products to include image field
    const transformedRelated = relatedProducts.map(p => ({
      ...p,
      image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '/images/placeholders/product.svg',
    }));

    // Get first image for main product
    const productImage = Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : '/images/placeholders/product.svg';

    return NextResponse.json({
      ...product,
      image: productImage,
      relatedProducts: transformedRelated,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
