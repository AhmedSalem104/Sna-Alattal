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

    const certificates = await db.certificate.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const certificate = await db.certificate.create({
      data: {
        nameAr: body.nameAr,
        nameEn: body.nameEn,
        nameTr: body.nameTr,
        issuingBodyAr: body.issuingBodyAr,
        issuingBodyEn: body.issuingBodyEn,
        issuingBodyTr: body.issuingBodyTr,
        descriptionAr: body.descriptionAr,
        descriptionEn: body.descriptionEn,
        descriptionTr: body.descriptionTr,
        image: body.image,
        issueDate: new Date(body.issueDate),
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
        isActive: body.isActive ?? true,
        order: body.order ?? 0,
      },
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'إنشاء',
        entity: 'شهادة',
        entityId: certificate.id,
        newData: certificate as object,
      },
    });

    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error('Error creating certificate:', error);
    return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 });
  }
}
