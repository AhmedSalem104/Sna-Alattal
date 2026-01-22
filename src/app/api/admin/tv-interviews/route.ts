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

    const interviews = await db.tVInterview.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      orderBy: [{ date: 'desc' }, { order: 'asc' }],
    });

    return NextResponse.json(interviews);
  } catch (error) {
    console.error('Error fetching TV interviews:', error);
    return NextResponse.json({ error: 'Failed to fetch TV interviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const interview = await db.tVInterview.create({
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
        isActive: body.isActive ?? true,
        order: body.order ?? 0,
      },
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'إنشاء',
        entity: 'مقابلة تلفزيونية',
        entityId: interview.id,
        newData: interview as object,
      },
    });

    return NextResponse.json(interview, { status: 201 });
  } catch (error) {
    console.error('Error creating TV interview:', error);
    return NextResponse.json({ error: 'Failed to create TV interview' }, { status: 500 });
  }
}
