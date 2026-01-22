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

    const certificate = await db.certificate.findUnique({
      where: { id: params.id },
    });

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json(certificate);
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return NextResponse.json({ error: 'Failed to fetch certificate' }, { status: 500 });
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

    const oldCertificate = await db.certificate.findUnique({ where: { id: params.id } });
    if (!oldCertificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    const certificate = await db.certificate.update({
      where: { id: params.id },
      data: body,
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'تعديل',
        entity: 'شهادة',
        entityId: certificate.id,
        oldData: oldCertificate as object,
        newData: certificate as object,
      },
    });

    return NextResponse.json(certificate);
  } catch (error) {
    console.error('Error updating certificate:', error);
    return NextResponse.json({ error: 'Failed to update certificate' }, { status: 500 });
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

    const oldCertificate = await db.certificate.findUnique({ where: { id: params.id } });
    if (!oldCertificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    const certificate = await db.certificate.update({
      where: { id: params.id },
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
        isActive: body.isActive,
        order: body.order,
      },
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'تعديل',
        entity: 'شهادة',
        entityId: certificate.id,
        oldData: oldCertificate as object,
        newData: certificate as object,
      },
    });

    return NextResponse.json(certificate);
  } catch (error) {
    console.error('Error updating certificate:', error);
    return NextResponse.json({ error: 'Failed to update certificate' }, { status: 500 });
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

    const certificate = await db.certificate.findUnique({
      where: { id: params.id },
    });

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    if (permanent) {
      await db.certificate.delete({ where: { id: params.id } });
    } else {
      await db.certificate.update({
        where: { id: params.id },
        data: { deletedAt: new Date() },
      });
    }

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: permanent ? 'حذف نهائي' : 'حذف',
        entity: 'شهادة',
        entityId: params.id,
        oldData: certificate as object,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    return NextResponse.json({ error: 'Failed to delete certificate' }, { status: 500 });
  }
}
