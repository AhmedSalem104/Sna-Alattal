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

    const exhibitions = await db.exhibition.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      orderBy: [{ startDate: 'desc' }, { order: 'asc' }],
    });

    return NextResponse.json(exhibitions);
  } catch (error) {
    console.error('Error fetching exhibitions:', error);
    return NextResponse.json({ error: 'Failed to fetch exhibitions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const exhibition = await db.exhibition.create({
      data: {
        nameAr: body.nameAr,
        nameEn: body.nameEn,
        nameTr: body.nameTr,
        locationAr: body.locationAr,
        locationEn: body.locationEn,
        locationTr: body.locationTr,
        descriptionAr: body.descriptionAr,
        descriptionEn: body.descriptionEn,
        descriptionTr: body.descriptionTr,
        images: body.images || [],
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        isActive: body.isActive ?? true,
        order: body.order ?? 0,
      },
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'إنشاء',
        entity: 'معرض',
        entityId: exhibition.id,
        newData: exhibition as object,
      },
    });

    return NextResponse.json(exhibition, { status: 201 });
  } catch (error) {
    console.error('Error creating exhibition:', error);
    return NextResponse.json({ error: 'Failed to create exhibition' }, { status: 500 });
  }
}
