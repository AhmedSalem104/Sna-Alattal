import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
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

    // Send email notification
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'noreply@sna-alattal.com',
          to: process.env.ADMIN_EMAIL || 'info@sna-alattal.com',
          subject: `رسالة جديدة من الموقع: ${body.subject}`,
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif;">
              <h2>رسالة جديدة من موقع S.N.A العطال</h2>
              <table style="border-collapse: collapse; width: 100%;">
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;"><strong>الاسم:</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${body.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;"><strong>البريد الإلكتروني:</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${body.email}</td>
                </tr>
                ${body.phone ? `
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;"><strong>الهاتف:</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${body.phone}</td>
                </tr>
                ` : ''}
                ${body.company ? `
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;"><strong>الشركة:</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${body.company}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;"><strong>الموضوع:</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${body.subject}</td>
                </tr>
              </table>
              <h3>الرسالة:</h3>
              <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
                ${body.message.replace(/\n/g, '<br>')}
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the request if email fails
      }
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
