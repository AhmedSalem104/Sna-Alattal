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

    const catalogue = await db.catalogue.findUnique({
      where: { id: params.id },
    });

    if (!catalogue) {
      return NextResponse.json({ error: 'Catalogue not found' }, { status: 404 });
    }

    return NextResponse.json(catalogue);
  } catch (error) {
    console.error('Error fetching catalogue:', error);
    return NextResponse.json({ error: 'Failed to fetch catalogue' }, { status: 500 });
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

    const oldCatalogue = await db.catalogue.findUnique({ where: { id: params.id } });
    if (!oldCatalogue) {
      return NextResponse.json({ error: 'Catalogue not found' }, { status: 404 });
    }

    const catalogue = await db.catalogue.update({
      where: { id: params.id },
      data: body,
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'تعديل',
        entity: 'كتالوج',
        entityId: catalogue.id,
        oldData: oldCatalogue as object,
        newData: catalogue as object,
      },
    });

    return NextResponse.json(catalogue);
  } catch (error) {
    console.error('Error updating catalogue:', error);
    return NextResponse.json({ error: 'Failed to update catalogue' }, { status: 500 });
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

    const oldCatalogue = await db.catalogue.findUnique({ where: { id: params.id } });
    if (!oldCatalogue) {
      return NextResponse.json({ error: 'Catalogue not found' }, { status: 404 });
    }

    const catalogue = await db.catalogue.update({
      where: { id: params.id },
      data: {
        nameAr: body.nameAr,
        nameEn: body.nameEn,
        nameTr: body.nameTr,
        descriptionAr: body.descriptionAr,
        descriptionEn: body.descriptionEn,
        descriptionTr: body.descriptionTr,
        fileUrl: body.fileUrl,
        thumbnail: body.thumbnail,
        fileSize: body.fileSize || 0,
        isActive: body.isActive,
        order: body.order,
      },
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'تعديل',
        entity: 'كتالوج',
        entityId: catalogue.id,
        oldData: oldCatalogue as object,
        newData: catalogue as object,
      },
    });

    return NextResponse.json(catalogue);
  } catch (error) {
    console.error('Error updating catalogue:', error);
    return NextResponse.json({ error: 'Failed to update catalogue' }, { status: 500 });
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

    const catalogue = await db.catalogue.findUnique({
      where: { id: params.id },
    });

    if (!catalogue) {
      return NextResponse.json({ error: 'Catalogue not found' }, { status: 404 });
    }

    if (permanent) {
      await db.catalogue.delete({ where: { id: params.id } });
    } else {
      await db.catalogue.update({
        where: { id: params.id },
        data: { deletedAt: new Date() },
      });
    }

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: permanent ? 'حذف نهائي' : 'حذف',
        entity: 'كتالوج',
        entityId: params.id,
        oldData: catalogue as object,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting catalogue:', error);
    return NextResponse.json({ error: 'Failed to delete catalogue' }, { status: 500 });
  }
}
