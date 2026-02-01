import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get counts
    const [
      productsCount,
      clientsCount,
      messagesCount,
      unreadMessagesCount,
      downloadsCount,
      recentActivities,
      recentMessages,
    ] = await Promise.all([
      db.product.count({ where: { deletedAt: null } }),
      db.client.count({ where: { deletedAt: null } }),
      db.contactMessage.count({ where: { deletedAt: null } }),
      db.contactMessage.count({ where: { deletedAt: null, isRead: false } }),
      db.catalogue.aggregate({
        _sum: { downloadCount: true },
      }),
      db.activityLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true },
          },
        },
      }),
      db.contactMessage.findMany({
        where: { deletedAt: null },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          isRead: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        products: productsCount,
        clients: clientsCount,
        messages: {
          total: messagesCount,
          unread: unreadMessagesCount,
        },
        downloads: downloadsCount._sum.downloadCount || 0,
      },
      recentActivities: recentActivities.map((activity) => {
        // Try to get entity name from newData
        let entityName = activity.entityId;
        if (activity.newData && typeof activity.newData === 'object') {
          const data = activity.newData as Record<string, unknown>;
          entityName = (data.nameEn || data.titleEn || data.name || activity.entityId) as string;
        }
        return {
          id: activity.id,
          action: activity.action,
          entity: activity.entity,
          entityName,
          createdAt: activity.createdAt,
          userName: activity.user.name,
        };
      }),
      recentMessages,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
