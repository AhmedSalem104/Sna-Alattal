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

    const solution = await db.solution.findUnique({
      where: { id: params.id },
      include: {
        products: {
          include: {
            product: { select: { id: true, nameAr: true, nameEn: true } },
          },
        },
      },
    });

    if (!solution) {
      return NextResponse.json({ error: 'Solution not found' }, { status: 404 });
    }

    return NextResponse.json(solution);
  } catch (error) {
    console.error('Error fetching solution:', error);
    return NextResponse.json({ error: 'Failed to fetch solution' }, { status: 500 });
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

    const oldSolution = await db.solution.findUnique({ where: { id: params.id } });
    if (!oldSolution) {
      return NextResponse.json({ error: 'Solution not found' }, { status: 404 });
    }

    const solution = await db.solution.update({
      where: { id: params.id },
      data: body,
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'تعديل',
        entity: 'حل',
        entityId: solution.id,
        oldData: oldSolution as object,
        newData: solution as object,
      },
    });

    return NextResponse.json(solution);
  } catch (error) {
    console.error('Error updating solution:', error);
    return NextResponse.json({ error: 'Failed to update solution' }, { status: 500 });
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

    const oldSolution = await db.solution.findUnique({ where: { id: params.id } });
    if (!oldSolution) {
      return NextResponse.json({ error: 'Solution not found' }, { status: 404 });
    }

    // Check if slug is being changed and if it exists
    if (body.slug && body.slug !== oldSolution.slug) {
      const existing = await db.solution.findUnique({ where: { slug: body.slug } });
      if (existing) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
      }
    }

    const solution = await db.solution.update({
      where: { id: params.id },
      data: {
        titleAr: body.titleAr,
        titleEn: body.titleEn,
        titleTr: body.titleTr,
        slug: body.slug,
        descriptionAr: body.descriptionAr,
        descriptionEn: body.descriptionEn,
        descriptionTr: body.descriptionTr,
        shortDescAr: body.shortDescAr,
        shortDescEn: body.shortDescEn,
        shortDescTr: body.shortDescTr,
        icon: body.icon,
        image: body.image,
        features: body.features || [],
        isActive: body.isActive,
        isFeatured: body.isFeatured,
        order: body.order,
      },
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'تعديل',
        entity: 'حل',
        entityId: solution.id,
        oldData: oldSolution as object,
        newData: solution as object,
      },
    });

    return NextResponse.json(solution);
  } catch (error) {
    console.error('Error updating solution:', error);
    return NextResponse.json({ error: 'Failed to update solution' }, { status: 500 });
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

    const solution = await db.solution.findUnique({
      where: { id: params.id },
      include: { _count: { select: { products: true } } },
    });

    if (!solution) {
      return NextResponse.json({ error: 'Solution not found' }, { status: 404 });
    }

    if (permanent) {
      // Delete product associations first
      await db.solutionProduct.deleteMany({ where: { solutionId: params.id } });
      await db.solution.delete({ where: { id: params.id } });
    } else {
      await db.solution.update({
        where: { id: params.id },
        data: { deletedAt: new Date() },
      });
    }

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: permanent ? 'حذف نهائي' : 'حذف',
        entity: 'حل',
        entityId: params.id,
        oldData: solution as object,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting solution:', error);
    return NextResponse.json({ error: 'Failed to delete solution' }, { status: 500 });
  }
}
