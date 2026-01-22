import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const category = await db.category.findUnique({
      where: { id: params.id },
      include: {
        parent: { select: { id: true, nameAr: true, nameEn: true } },
        children: { select: { id: true, nameAr: true, nameEn: true } },
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const oldCategory = await db.category.findUnique({ where: { id: params.id } });
    if (!oldCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const category = await db.category.update({
      where: { id: params.id },
      data: body,
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'تعديل',
        entity: 'تصنيف',
        entityId: category.id,
        oldData: oldCategory as object,
        newData: category as object,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const oldCategory = await db.category.findUnique({ where: { id: params.id } });
    if (!oldCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if slug is being changed and if it exists
    if (body.slug && body.slug !== oldCategory.slug) {
      const existing = await db.category.findUnique({ where: { slug: body.slug } });
      if (existing) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
      }
    }

    const category = await db.category.update({
      where: { id: params.id },
      data: {
        nameAr: body.nameAr,
        nameEn: body.nameEn,
        nameTr: body.nameTr,
        slug: body.slug,
        descriptionAr: body.descriptionAr,
        descriptionEn: body.descriptionEn,
        descriptionTr: body.descriptionTr,
        image: body.image,
        parentId: body.parentId || null,
        isActive: body.isActive,
        order: body.order,
      },
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'تعديل',
        entity: 'تصنيف',
        entityId: category.id,
        oldData: oldCategory as object,
        newData: category as object,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const permanent = searchParams.get('permanent') === 'true';

    const category = await db.category.findUnique({
      where: { id: params.id },
      include: { _count: { select: { products: true, children: true } } },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check for dependencies
    if (category._count.products > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with products. Please remove products first.' },
        { status: 400 }
      );
    }

    if (category._count.children > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with subcategories. Please remove subcategories first.' },
        { status: 400 }
      );
    }

    if (permanent) {
      await db.category.delete({ where: { id: params.id } });
    } else {
      await db.category.update({
        where: { id: params.id },
        data: { deletedAt: new Date() },
      });
    }

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: permanent ? 'حذف نهائي' : 'حذف',
        entity: 'تصنيف',
        entityId: category.id,
        oldData: category as object,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
