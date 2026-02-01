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

    // Parse product images
    const productImages = parseImages(product.images);

    // Transform related products to include image field
    const transformedRelated = relatedProducts.map(p => {
      const imgs = parseImages(p.images);
      return {
        ...p,
        images: imgs,
        image: imgs.length > 0 ? imgs[0] : '/images/placeholders/product.svg',
      };
    });

    // Get first image for main product
    const productImage = productImages.length > 0
      ? productImages[0]
      : '/images/placeholders/product.svg';

    return NextResponse.json({
      ...product,
      images: productImages,
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
