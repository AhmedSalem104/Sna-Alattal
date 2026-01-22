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

    const slides = await db.slide.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(slides);
  } catch (error) {
    console.error('Error fetching slides:', error);
    return NextResponse.json({ error: 'Failed to fetch slides' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const slide = await db.slide.create({
      data: {
        titleAr: body.titleAr,
        titleEn: body.titleEn,
        titleTr: body.titleTr,
        subtitleAr: body.subtitleAr,
        subtitleEn: body.subtitleEn,
        subtitleTr: body.subtitleTr,
        descriptionAr: body.descriptionAr,
        descriptionEn: body.descriptionEn,
        descriptionTr: body.descriptionTr,
        image: body.image,
        buttonTextAr: body.buttonTextAr,
        buttonTextEn: body.buttonTextEn,
        buttonTextTr: body.buttonTextTr,
        buttonLink: body.buttonLink,
        isActive: body.isActive ?? true,
        order: body.order ?? 0,
      },
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'إنشاء',
        entity: 'سلايد',
        entityId: slide.id,
        newData: slide as object,
      },
    });

    return NextResponse.json(slide, { status: 201 });
  } catch (error) {
    console.error('Error creating slide:', error);
    return NextResponse.json({ error: 'Failed to create slide' }, { status: 500 });
  }
}
