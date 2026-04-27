import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"SmartPDFs Contact" <${process.env.GMAIL_USER}>`,
      to: 'hardikkotadiya90@gmail.com',
      replyTo: email,
      subject: `[SmartPDFs] ${subject}`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
          <div style="background: #ef4444; padding: 20px 24px; border-radius: 12px; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 900;">New Contact Message</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 13px;">SmartPDFs Plus — Contact Form</p>
          </div>
          <div style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; width: 100px;">Name</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #1e293b; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #1e293b; font-weight: 600;"><a href="mailto:${email}" style="color: #ef4444;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">Subject</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #1e293b; font-weight: 600;">${subject}</td>
              </tr>
            </table>
            <div style="margin-top: 20px;">
              <p style="font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px;">Message</p>
              <div style="background: #f8fafc; padding: 16px; border-radius: 8px; font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            </div>
          </div>
          <p style="text-align: center; color: #94a3b8; font-size: 11px; margin-top: 20px;">Sent from SmartPDFs Plus contact form</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact email error:', error);
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
  }
}
