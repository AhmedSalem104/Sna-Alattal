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

    const teamMember = await db.teamMember.findUnique({
      where: { id: params.id },
    });

    if (!teamMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json({ error: 'Failed to fetch team member' }, { status: 500 });
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

    const oldMember = await db.teamMember.findUnique({ where: { id: params.id } });
    if (!oldMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    const teamMember = await db.teamMember.update({
      where: { id: params.id },
      data: body,
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'تعديل',
        entity: 'عضو فريق',
        entityId: teamMember.id,
        oldData: oldMember as object,
        newData: teamMember as object,
      },
    });

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
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

    const oldMember = await db.teamMember.findUnique({ where: { id: params.id } });
    if (!oldMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    const teamMember = await db.teamMember.update({
      where: { id: params.id },
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
        isActive: body.isActive,
        order: body.order,
      },
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'تعديل',
        entity: 'عضو فريق',
        entityId: teamMember.id,
        oldData: oldMember as object,
        newData: teamMember as object,
      },
    });

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
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

    const teamMember = await db.teamMember.findUnique({
      where: { id: params.id },
    });

    if (!teamMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    if (permanent) {
      await db.teamMember.delete({ where: { id: params.id } });
    } else {
      await db.teamMember.update({
        where: { id: params.id },
        data: { deletedAt: new Date() },
      });
    }

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: permanent ? 'حذف نهائي' : 'حذف',
        entity: 'عضو فريق',
        entityId: params.id,
        oldData: teamMember as object,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
  }
}
