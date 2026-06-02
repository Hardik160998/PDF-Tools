import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { encryptPayload } from '@/lib/crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Reuse transporter across requests (connection pooling)
const transporter = nodemailer.createTransport({
 service: 'gmail',
 pool: true, // Enable connection pooling
 maxConnections: 3,
 auth: {
 user: process.env.GMAIL_USER,
 pass: process.env.GMAIL_APP_PASSWORD,
 },
});

export async function POST(request: Request) {
 try {
 const { email, password, fullName } = await request.json();

 if (!email || !password || !fullName) {
 return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
 }

 const emailLower = email.toLowerCase().trim();

 if (!supabaseUrl) {
 return NextResponse.json({ error: 'Supabase URL configuration is missing.' }, { status: 500 });
 }

 if (!serviceRoleKey) {
 return NextResponse.json({
 success: false,
 error: "SUPABASE_SERVICE_ROLE_KEY is not defined in .env.local. Please copy your Service Role Key to .env.local to enable signup verification."
 }, { status: 450 });
 }

 const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
 auth: {
 autoRefreshToken: false,
 persistSession: false
 }
 });

 // 1. Check if email is already registered in database
 const { data: existingUser, error: checkError } = await supabaseAdmin
 .from('users')
 .select('id, email')
 .eq('email', emailLower)
 .maybeSingle();

 if (checkError) {
 console.warn("Error checking existing user in public.users:", checkError);
 }

 if (existingUser) {
 return NextResponse.json({ error: 'This email address is already registered.' }, { status: 400 });
 }

 // 2. Generate a random 6-digit OTP code
 const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
 const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

 // 3. Encrypt payload
 const signupToken = encryptPayload({
 email: emailLower,
 password,
 fullName,
 otp: otpCode,
 expiresAt
 });

 // 4. Send email via Gmail SMTP (using module-level pooled transporter)
 await transporter.sendMail({
 from: `"SmartPDFs Plus" <${process.env.GMAIL_USER}>`,
 to: emailLower,
 subject: `[SmartPDFs] Your 6-Digit Verification Code: ${otpCode}`,
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
 <h2 style="font-size: 18px; font-weight: 700; color: #1e293b; margin: 0 0 16px; text-align: center;">Verify Your Email Address</h2>
 <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 24px; text-align: center;">
 Thank you for signing up for SmartPDFs Plus! Please enter the 6-digit verification code below on the signup page to confirm your account.
 </p>
 
 <div style="text-align: center; margin: 32px 0;">
 <div style="display: inline-block; font-family: monospace; font-size: 36px; font-weight: 800; color: #4f46e5; letter-spacing: 6px; background-color: #f5f3ff; padding: 16px 32px; border-radius: 12px; border: 1px solid #ddd6fe;">
 ${otpCode}
 </div>
 </div>

 <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 24px;">
 This code will expire in 10 minutes. If you did not request this verification code, please ignore this email.
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
 signupToken,
 message: "Verification email sent successfully!"
 });

 } catch (error: any) {
 console.error('Signup API error:', error);
 return NextResponse.json({ error: error?.message || 'Failed to send verification code.' }, { status: 500 });
 }
}
