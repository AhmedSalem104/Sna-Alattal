import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - List active categories (public)
export async function GET() {
  try {
    const categories = await db.category.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      include: {
        _count: {
          select: { products: { where: { isActive: true, deletedAt: null } } },
        },
      },
      orderBy: [{ order: 'asc' }, { nameAr: 'asc' }],
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
