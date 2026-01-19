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
      recentActivities: recentActivities.map((activity) => ({
        id: activity.id,
        action: activity.action,
        entity: activity.entity,
        entityName: activity.entityId,
        createdAt: activity.createdAt,
        userName: activity.user.name,
      })),
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
