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

    const catalogues = await db.catalogue.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(catalogues);
  } catch (error) {
    console.error('Error fetching catalogues:', error);
    return NextResponse.json({ error: 'Failed to fetch catalogues' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const catalogue = await db.catalogue.create({
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
        isActive: body.isActive ?? true,
        order: body.order || 0,
      },
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'إنشاء',
        entity: 'كتالوج',
        entityId: catalogue.id,
        newData: catalogue as object,
      },
    });

    return NextResponse.json(catalogue, { status: 201 });
  } catch (error) {
    console.error('Error creating catalogue:', error);
    return NextResponse.json({ error: 'Failed to create catalogue' }, { status: 500 });
  }
}
