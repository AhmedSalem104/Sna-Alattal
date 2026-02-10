import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit';

const FORMSPREE_URL = 'https://formspree.io/f/xvzbgjny';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request.headers);
    const rateLimitResult = checkRateLimit(`contact:${clientIP}`, RATE_LIMITS.contact);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          },
        }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create contact message in database
    const message = await db.contactMessage.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        company: body.company || null,
        subject: body.subject,
        message: body.message,
      },
    });

    // Send email notification via Formspree
    try {
      await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: body.name,
          email: body.email,
          phone: body.phone || '',
          company: body.company || '',
          subject: body.subject,
          message: body.message,
          _subject: `رسالة جديدة من الموقع: ${body.subject}`,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send Formspree notification:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, id: message.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating contact message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
