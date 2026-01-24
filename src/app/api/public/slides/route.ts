import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - List active slides (public)
export async function GET() {
  try {
    const slides = await db.slide.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(slides);
  } catch (error) {
    console.error('Error fetching slides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slides' },
      { status: 500 }
    );
  }
}
