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

    const news = await db.news.findUnique({
      where: { id: params.id },
    });

    if (!news) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
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
    const news = await db.news.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
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

    const oldNews = await db.news.findUnique({ where: { id: params.id } });
    if (!oldNews) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    if (body.slug && body.slug !== oldNews.slug) {
      const existing = await db.news.findUnique({ where: { slug: body.slug } });
      if (existing) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
      }
    }

    const news = await db.news.update({
      where: { id: params.id },
      data: {
        titleAr: body.titleAr,
        titleEn: body.titleEn,
        titleTr: body.titleTr,
        slug: body.slug,
        contentAr: body.contentAr,
        contentEn: body.contentEn,
        contentTr: body.contentTr,
        excerptAr: body.excerptAr,
        excerptEn: body.excerptEn,
        excerptTr: body.excerptTr,
        image: body.image,
        author: body.author,
        publishedAt: body.publishedAt,
        isActive: body.isActive,
        isFeatured: body.isFeatured,
        tags: body.tags,
      },
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'تعديل',
        entity: 'خبر',
        entityId: news.id,
        oldData: oldNews as object,
        newData: news as object,
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
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

    if (permanent) {
      await db.news.delete({ where: { id: params.id } });
    } else {
      await db.news.update({
        where: { id: params.id },
        data: { deletedAt: new Date() },
      });
    }

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: permanent ? 'حذف نهائي' : 'حذف',
        entity: 'خبر',
        entityId: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
