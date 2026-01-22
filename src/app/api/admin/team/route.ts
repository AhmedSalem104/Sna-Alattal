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

    const teamMembers = await db.teamMember.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const teamMember = await db.teamMember.create({
      data: {
        nameAr: body.nameAr,
        nameEn: body.nameEn,
        nameTr: body.nameTr,
        positionAr: body.positionAr,
        positionEn: body.positionEn,
        positionTr: body.positionTr,
        bioAr: body.bioAr,
        bioEn: body.bioEn,
        bioTr: body.bioTr,
        image: body.image,
        email: body.email,
        phone: body.phone,
        linkedin: body.linkedin,
        isActive: body.isActive ?? true,
        order: body.order ?? 0,
      },
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'إنشاء',
        entity: 'عضو فريق',
        entityId: teamMember.id,
        newData: teamMember as object,
      },
    });

    return NextResponse.json(teamMember, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
  }
}
