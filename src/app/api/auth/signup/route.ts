import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  try {
    const { email, password, fullName, redirectToUrl } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();

    if (!supabaseUrl) {
      return NextResponse.json({ error: 'Supabase URL configuration is missing.' }, { status: 500 });
    }

    if (!serviceRoleKey) {
      return NextResponse.json({
        success: false,
        error: "SUPABASE_SERVICE_ROLE_KEY is not defined in .env.local. Please copy your Service Role Key to .env.local to enable email signup."
      }, { status: 400 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 1. Generate confirmation action link
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email: emailLower,
      password: password,
      options: {
        redirectTo: redirectToUrl || '/',
        data: {
          full_name: fullName
        }
      }
    });

    if (linkError) {
      console.error("Link generation failed:", linkError);
      return NextResponse.json({ error: linkError.message }, { status: 400 });
    }

    const actionLink = linkData?.properties?.action_link;

    if (!actionLink) {
      return NextResponse.json({ error: 'Failed to generate confirmation link.' }, { status: 500 });
    }

    // 2. Create the user profile in public.users (not confirmed yet)
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .upsert({
        id: linkData.user.id,
        email: emailLower,
        full_name: fullName,
        is_guest: false,
        account_type: 'free',
        credits_merged: false,
        is_confirmation: false // Turned to true upon login / email verification
      }, { onConflict: 'email' });

    if (dbError) {
      console.warn("Could not insert user profile in public users table:", dbError);
    }

    // 3. Send email via Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"SmartPDFs Plus" <${process.env.GMAIL_USER}>`,
      to: emailLower,
      subject: '[SmartPDFs] Confirm Your Signup',
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f8fafc; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 24px; font-weight: 800; color: #0f172a; text-decoration: none;">
              <span style="text-transform: uppercase;">Smart</span>
              <span style="color: #ef4444; font-size: 24px;">❤️</span>
              <span style="text-transform: uppercase;">PDFs</span>
            </div>
            <p style="margin-top: 8px; font-size: 14px; color: #64748b; font-weight: 500;">Secure, Private, and Fast PDF Processing</p>
          </div>
          
          <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <h2 style="font-size: 18px; font-weight: 700; color: #1e293b; margin: 0 0 16px; text-align: center;">Confirm Your Account</h2>
            <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 24px; text-align: center;">
              Thank you for signing up for SmartPDFs Plus! Please click the button below to verify your email address and activate your account.
            </p>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${actionLink}" style="display: inline-block; font-size: 14px; font-weight: 600; color: #ffffff; background-color: #4f46e5; padding: 12px 32px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">Confirm Your Email</a>
            </div>

            <p style="font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5; margin: 24px 0 0;">
              If the button doesn't work, copy and paste the link below into your browser:
            </p>
            <p style="font-size: 11px; color: #4f46e5; text-align: center; word-break: break-all; margin: 8px 0 0;">
              <a href="${actionLink}" style="color: #4f46e5;">${actionLink}</a>
            </p>
            
            <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 24px;">
              If you did not request this email, you can safely ignore it.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 32px; font-size: 11px; color: #94a3b8;">
            <p style="margin: 0 0 4px;">&copy; ${new Date().getFullYear()} SmartPDFs Plus. All rights reserved.</p>
            <p style="margin: 0;">100% Free & Secure Local Browser Compilation</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Verification email sent successfully!"
    });

  } catch (error: any) {
    console.error('Signup API error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to sign up.' }, { status: 500 });
  }
}
