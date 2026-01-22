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
    const group = searchParams.get('group');

    const settings = await db.settings.findMany({
      where: group ? { group } : {},
      orderBy: { key: 'asc' },
    });

    // Transform settings array to object for easier consumption
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, unknown>);

    return NextResponse.json(settingsObject);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { settings: settingsData, group = 'general' } = body;

    // Update each setting
    const operations = Object.entries(settingsData).map(([key, value]) =>
      db.settings.upsert({
        where: { key },
        update: { value: value as object },
        create: { key, value: value as object, group },
      })
    );

    await db.$transaction(operations);

    // Log activity
    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'تحديث',
        entity: 'إعدادات',
        entityId: group,
        newData: settingsData as object,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
