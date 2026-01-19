import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

interface RouteParams {
  params: { id: string };
}

// GET - Get single product
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const product = await db.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        solutions: {
          include: {
            solution: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT - Update product (full update)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Check if slug exists (excluding current product)
    const existingProduct = await db.product.findFirst({
      where: {
        slug: body.slug,
        NOT: { id: params.id },
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Slug already exists', message: 'هذا الـ Slug موجود مسبقاً' },
        { status: 400 }
      );
    }

    // Get old data for activity log
    const oldProduct = await db.product.findUnique({
      where: { id: params.id },
    });

    const product = await db.product.update({
      where: { id: params.id },
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
        isActive: body.isActive,
        isFeatured: body.isFeatured,
        order: body.order,
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
        action: 'تعديل',
        entity: 'منتج',
        entityId: product.id,
        oldData: oldProduct as object,
        newData: product as object,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// PATCH - Partial update (for toggling isActive, isFeatured, etc.)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const product = await db.product.update({
      where: { id: params.id },
      data: body,
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'تعديل',
        entity: 'منتج',
        entityId: product.id,
        newData: body as object,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete product
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const permanent = searchParams.get('permanent') === 'true';

    if (permanent) {
      // Permanent delete
      await db.product.delete({
        where: { id: params.id },
      });

      await db.activityLog.create({
        data: {
          userId: session.user.id,
          action: 'حذف نهائي',
          entity: 'منتج',
          entityId: params.id,
        },
      });
    } else {
      // Soft delete
      await db.product.update({
        where: { id: params.id },
        data: { deletedAt: new Date() },
      });

      await db.activityLog.create({
        data: {
          userId: session.user.id,
          action: 'حذف',
          entity: 'منتج',
          entityId: params.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
