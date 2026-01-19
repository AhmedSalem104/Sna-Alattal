import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET - List all products
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const includeDeleted = searchParams.get('deleted') === 'true';

    const products = await db.product.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      include: {
        category: {
          select: { id: true, nameAr: true, nameEn: true },
        },
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Check if slug exists
    const existingProduct = await db.product.findUnique({
      where: { slug: body.slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Slug already exists', message: 'هذا الـ Slug موجود مسبقاً' },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        nameAr: body.nameAr,
        nameEn: body.nameEn,
        nameTr: body.nameTr,
        slug: body.slug,
        descriptionAr: body.descriptionAr,
        descriptionEn: body.descriptionEn,
        descriptionTr: body.descriptionTr,
        shortDescAr: body.shortDescAr,
        shortDescEn: body.shortDescEn,
        shortDescTr: body.shortDescTr,
        categoryId: body.categoryId || null,
        images: body.images || [],
        features: body.features || [],
        specifications: body.specifications || {},
        isActive: body.isActive ?? true,
        isFeatured: body.isFeatured ?? false,
        order: body.order || 0,
        seoTitleAr: body.seoTitleAr,
        seoTitleEn: body.seoTitleEn,
        seoTitleTr: body.seoTitleTr,
        seoDescAr: body.seoDescAr,
        seoDescEn: body.seoDescEn,
        seoDescTr: body.seoDescTr,
        seoKeywords: body.seoKeywords || [],
      },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'إنشاء',
        entity: 'منتج',
        entityId: product.id,
        newData: product as object,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product', message: 'فشل في إنشاء المنتج' },
      { status: 500 }
    );
  }
}
