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

    const exhibition = await db.exhibition.findUnique({
      where: { id: params.id },
    });

    if (!exhibition) {
      return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 });
    }

    return NextResponse.json(exhibition);
  } catch (error) {
    console.error('Error fetching exhibition:', error);
    return NextResponse.json({ error: 'Failed to fetch exhibition' }, { status: 500 });
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

    const oldExhibition = await db.exhibition.findUnique({ where: { id: params.id } });
    if (!oldExhibition) {
      return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 });
    }

    const exhibition = await db.exhibition.update({
      where: { id: params.id },
      data: body,
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'تعديل',
        entity: 'معرض',
        entityId: exhibition.id,
        oldData: oldExhibition as object,
        newData: exhibition as object,
      },
    });

    return NextResponse.json(exhibition);
  } catch (error) {
    console.error('Error updating exhibition:', error);
    return NextResponse.json({ error: 'Failed to update exhibition' }, { status: 500 });
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

    const oldExhibition = await db.exhibition.findUnique({ where: { id: params.id } });
    if (!oldExhibition) {
      return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 });
    }

    const exhibition = await db.exhibition.update({
      where: { id: params.id },
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
        isActive: body.isActive,
        order: body.order,
      },
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'تعديل',
        entity: 'معرض',
        entityId: exhibition.id,
        oldData: oldExhibition as object,
        newData: exhibition as object,
      },
    });

    return NextResponse.json(exhibition);
  } catch (error) {
    console.error('Error updating exhibition:', error);
    return NextResponse.json({ error: 'Failed to update exhibition' }, { status: 500 });
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

    const exhibition = await db.exhibition.findUnique({
      where: { id: params.id },
    });

    if (!exhibition) {
      return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 });
    }

    if (permanent) {
      await db.exhibition.delete({ where: { id: params.id } });
    } else {
      await db.exhibition.update({
        where: { id: params.id },
        data: { deletedAt: new Date() },
      });
    }

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: permanent ? 'حذف نهائي' : 'حذف',
        entity: 'معرض',
        entityId: params.id,
        oldData: exhibition as object,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting exhibition:', error);
    return NextResponse.json({ error: 'Failed to delete exhibition' }, { status: 500 });
  }
}
