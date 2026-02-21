import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit';
import { db } from '@/lib/db';

// Only expose specific public groups
const PUBLIC_GROUPS = ['timeline', 'offices', 'statistics', 'contact', 'general'];

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request.headers);
    const rateLimitResult = checkRateLimit(`public:${ip}`, RATE_LIMITS.public);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)) } }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const group = searchParams.get('group');

    // If a specific group is requested, validate it's public
    if (group && !PUBLIC_GROUPS.includes(group)) {
      return NextResponse.json(
        { error: 'Invalid group' },
        { status: 400 }
      );
    }

    const settings = await db.settings.findMany({
      where: group
        ? { group }
        : { group: { in: PUBLIC_GROUPS } },
      orderBy: { key: 'asc' },
    });

    // Transform settings array to object for easier consumption
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, unknown>);

    return NextResponse.json(settingsObject, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}
