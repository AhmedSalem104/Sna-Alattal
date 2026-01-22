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

    const interview = await db.tVInterview.findUnique({
      where: { id: params.id },
    });

    if (!interview) {
      return NextResponse.json({ error: 'TV Interview not found' }, { status: 404 });
    }

    return NextResponse.json(interview);
  } catch (error) {
    console.error('Error fetching TV interview:', error);
    return NextResponse.json({ error: 'Failed to fetch TV interview' }, { status: 500 });
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

    const oldInterview = await db.tVInterview.findUnique({ where: { id: params.id } });
    if (!oldInterview) {
      return NextResponse.json({ error: 'TV Interview not found' }, { status: 404 });
    }

    const interview = await db.tVInterview.update({
      where: { id: params.id },
      data: body,
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'تعديل',
        entity: 'مقابلة تلفزيونية',
        entityId: interview.id,
        oldData: oldInterview as object,
        newData: interview as object,
      },
    });

    return NextResponse.json(interview);
  } catch (error) {
    console.error('Error updating TV interview:', error);
    return NextResponse.json({ error: 'Failed to update TV interview' }, { status: 500 });
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

    const oldInterview = await db.tVInterview.findUnique({ where: { id: params.id } });
    if (!oldInterview) {
      return NextResponse.json({ error: 'TV Interview not found' }, { status: 404 });
    }

    const interview = await db.tVInterview.update({
      where: { id: params.id },
      data: {
        titleAr: body.titleAr,
        titleEn: body.titleEn,
        titleTr: body.titleTr,
        channelAr: body.channelAr,
        channelEn: body.channelEn,
        channelTr: body.channelTr,
        descriptionAr: body.descriptionAr,
        descriptionEn: body.descriptionEn,
        descriptionTr: body.descriptionTr,
        videoUrl: body.videoUrl,
        thumbnail: body.thumbnail,
        date: new Date(body.date),
        isActive: body.isActive,
        order: body.order,
      },
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'تعديل',
        entity: 'مقابلة تلفزيونية',
        entityId: interview.id,
        oldData: oldInterview as object,
        newData: interview as object,
      },
    });

    return NextResponse.json(interview);
  } catch (error) {
    console.error('Error updating TV interview:', error);
    return NextResponse.json({ error: 'Failed to update TV interview' }, { status: 500 });
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

    const interview = await db.tVInterview.findUnique({
      where: { id: params.id },
    });

    if (!interview) {
      return NextResponse.json({ error: 'TV Interview not found' }, { status: 404 });
    }

    if (permanent) {
      await db.tVInterview.delete({ where: { id: params.id } });
    } else {
      await db.tVInterview.update({
        where: { id: params.id },
        data: { deletedAt: new Date() },
      });
    }

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: permanent ? 'حذف نهائي' : 'حذف',
        entity: 'مقابلة تلفزيونية',
        entityId: params.id,
        oldData: interview as object,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting TV interview:', error);
    return NextResponse.json({ error: 'Failed to delete TV interview' }, { status: 500 });
  }
}
