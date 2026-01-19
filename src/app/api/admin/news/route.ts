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

    const news = await db.news.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const existing = await db.news.findUnique({ where: { slug: body.slug } });
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const news = await db.news.create({
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
        publishedAt: body.publishedAt || new Date(),
        isActive: body.isActive ?? true,
        isFeatured: body.isFeatured ?? false,
        tags: body.tags || [],
        seoTitleAr: body.seoTitleAr,
        seoTitleEn: body.seoTitleEn,
        seoTitleTr: body.seoTitleTr,
        seoDescAr: body.seoDescAr,
        seoDescEn: body.seoDescEn,
        seoDescTr: body.seoDescTr,
        seoKeywords: body.seoKeywords || [],
      },
    });

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'إنشاء',
        entity: 'خبر',
        entityId: news.id,
        newData: news as object,
      },
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
  }
}
