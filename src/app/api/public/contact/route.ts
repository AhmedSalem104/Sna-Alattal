import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const FORMSPREE_URL = 'https://formspree.io/f/xvzbgjny';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(2, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// POST - Submit contact message (Formspree only, no database)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = contactSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, email, phone, company, subject, message } = validationResult.data;

    // Send via Formspree
    const formspreeResponse = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        phone: phone || '',
        company: company || '',
        subject,
        message,
        _subject: `رسالة جديدة من الموقع: ${subject}`,
      }),
    });

    if (!formspreeResponse.ok) {
      console.error('Formspree error:', formspreeResponse.status);
      return NextResponse.json(
        { error: 'Failed to submit message' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting contact message:', error);
    return NextResponse.json(
      { error: 'Failed to submit message' },
      { status: 500 }
    );
  }
}
