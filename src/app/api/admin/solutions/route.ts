import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const includeDeleted = searchParams.get('deleted') === 'true';

    const solutions = await db.solution.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(solutions);
  } catch (error) {
    console.error('Error fetching solutions:', error);
    return NextResponse.json({ error: 'Failed to fetch solutions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Check if slug exists
    const existing = await db.solution.findUnique({ where: { slug: body.slug } });
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const solution = await db.solution.create({
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
        isActive: body.isActive ?? true,
        isFeatured: body.isFeatured ?? false,
        order: body.order ?? 0,
      },
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'إنشاء',
        entity: 'حل',
        entityId: solution.id,
        newData: solution as object,
      },
    });

    return NextResponse.json(solution, { status: 201 });
  } catch (error) {
    console.error('Error creating solution:', error);
    return NextResponse.json({ error: 'Failed to create solution' }, { status: 500 });
  }
}
