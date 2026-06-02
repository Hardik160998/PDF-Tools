import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

// Setup in-memory OTP store
// In a serverless environment, this is kept in-memory for the current container instance.
// For Next.js dev server and VPS hosting, it behaves as a global state.
const otpStore = new Map<string, { code: string; expires: number; fullName?: string }>();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Reuse transporter across requests (connection pooling)
const transporter = nodemailer.createTransport({
 service: 'gmail',
 pool: true,
 maxConnections: 3,
 auth: {
 user: process.env.GMAIL_USER,
 pass: process.env.GMAIL_APP_PASSWORD,
 },
});

export async function POST(request: Request) {
 try {
 const { email, fullName, mode } = await request.json();

 if (!email) {
 return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
 }

 const emailLower = email.toLowerCase().trim();

 // Check if Supabase client config is present
 if (!supabaseUrl || !supabaseAnonKey) {
 return NextResponse.json({ error: 'Supabase configuration is missing.' }, { status: 500 });
 }

 const supabase = createClient(supabaseUrl, supabaseAnonKey);

 // If logging in, check if user exists in the public users table first
 if (mode === 'login') {
 const { data: existingUser, error: checkError } = await supabase
 .from('users')
 .select('email')
 .eq('email', emailLower)
 .maybeSingle();

 if (checkError) {
 console.warn('Error checking user existence:', checkError);
 }

 if (!existingUser) {
 return NextResponse.json({ error: 'No account found with this email. Please sign up first.' }, { status: 404 });
 }
 }

 // Generate a 6-digit verification code
 const otp = Math.floor(100000 + Math.random() * 900000).toString();
 const expires = Date.now() + 5 * 60 * 1000; // 5 minutes validity

 // Store the OTP
 otpStore.set(emailLower, { code: otp, expires, fullName });

 // Setup nodemailer (using module-level pooled transporter)
 // Send email
 await transporter.sendMail({
 from: `"SmartPDFs Plus" <${process.env.GMAIL_USER}>`,
 to: emailLower,
 subject: `[SmartPDFs] Your Verification Code: ${otp}`,
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
 Use the single-use verification code below to complete your ${mode === 'signup' ? 'registration' : 'login'} process. This code is valid for <strong>5 minutes</strong>.
 </p>
 
 <div style="text-align: center; margin: 32px 0;">
 <span style="display: inline-block; font-size: 32px; font-weight: 800; letter-spacing: 0.15em; color: #4f46e5; background-color: #e0e7ff; padding: 12px 28px; border-radius: 12px; font-family: monospace;">${otp}</span>
 </div>
 
 <p style="font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5; margin: 24px 0 0;">
 If you didn't request this code, you can safely ignore this email. Someone else may have typed your address by mistake.
 </p>
 </div>
 
 <div style="text-align: center; margin-top: 32px; font-size: 11px; color: #94a3b8;">
 <p style="margin: 0 0 4px;">&copy; ${new Date().getFullYear()} SmartPDFs Plus. All rights reserved.</p>
 <p style="margin: 0;">100% Free & Secure Local Browser Compilation</p>
 </div>
 </div>
 `,
 });

 return NextResponse.json({ success: true });
 } catch (error: any) {
 console.error('OTP send error:', error);
 return NextResponse.json({ error: error?.message || 'Failed to send verification code.' }, { status: 500 });
 }
}

export async function PUT(request: Request) {
 try {
 const { email, code } = await request.json();

 if (!email || !code) {
 return NextResponse.json({ error: 'Email and verification code are required.' }, { status: 400 });
 }

 const emailLower = email.toLowerCase().trim();
 const stored = otpStore.get(emailLower);

 if (!stored) {
 return NextResponse.json({ error: 'No active code found. Please request a new one.' }, { status: 400 });
 }

 if (stored.code !== code.trim()) {
 return NextResponse.json({ error: 'Incorrect verification code. Please try again.' }, { status: 400 });
 }

 if (Date.now() > stored.expires) {
 otpStore.delete(emailLower);
 return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 });
 }

 // Success! Clear OTP code
 otpStore.delete(emailLower);

 if (!supabaseUrl || !supabaseAnonKey) {
 return NextResponse.json({ error: 'Supabase configuration is missing.' }, { status: 500 });
 }

 const supabase = createClient(supabaseUrl, supabaseAnonKey);

 // Register / Login the user in the public users table
 const { data: profile, error: dbError } = await supabase
 .from('users')
 .upsert(
 {
 email: emailLower,
 ...(stored.fullName ? { full_name: stored.fullName } : {}),
 last_login: new Date().toISOString(),
 },
 { onConflict: 'email' }
 )
 .select(`
 id, email, full_name, created_at, last_login, plan, current_plan, 
 subscription_status, subscription_start_date, subscription_end_date, 
 razorpay_customer_id, daily_usage_count, last_usage_reset, 
 ecommerce_credits, tool_credits, credits_merged, is_guest, 
 guest_session_id, account_type, remaining_credits, used_credits, 
 is_confirmation
 `)
 .single();

 if (dbError) {
 console.error('Database user sync error:', dbError);
 }

 return NextResponse.json({
 success: true,
 profile: profile || {
 email: emailLower,
 full_name: stored.fullName || 'SmartPDFs User',
 created_at: new Date().toISOString(),
 last_login: new Date().toISOString(),
 plan: 'Basic Plan',
 current_plan: 'Basic Plan',
 subscription_status: 'inactive'
 }
 });
 } catch (error: any) {
 console.error('OTP verification error:', error);
 return NextResponse.json({ error: error?.message || 'Verification process failed.' }, { status: 500 });
 }
}
