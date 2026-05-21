import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { decryptPayload } from '@/lib/crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  try {
    const { signupToken, userOtp } = await request.json();

    if (!signupToken || !userOtp) {
      return NextResponse.json({ error: 'Token and OTP code are required.' }, { status: 400 });
    }

    if (!supabaseUrl) {
      return NextResponse.json({ error: 'Supabase URL configuration is missing.' }, { status: 500 });
    }

    if (!serviceRoleKey) {
      return NextResponse.json({ error: 'Supabase service role key configuration is missing.' }, { status: 500 });
    }

    // 1. Decrypt and verify signup token
    let signupData;
    try {
      signupData = decryptPayload(signupToken);
    } catch (decryptError) {
      return NextResponse.json({ error: 'Invalid or corrupted verification session. Please sign up again.' }, { status: 400 });
    }

    const { email, password, fullName, otp, expiresAt } = signupData;

    // 2. Validate OTP code and expiration
    if (Date.now() > expiresAt) {
      return NextResponse.json({ error: 'Verification code has expired. Please sign up again.' }, { status: 400 });
    }

    if (userOtp.trim() !== otp) {
      return NextResponse.json({ error: 'Incorrect verification code. Please check your email and try again.' }, { status: 400 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 3. Register user in Supabase with email_confirm = true
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName
      }
    });

    if (authError) {
      console.error("Supabase user creation failed:", authError);
      return NextResponse.json({ error: authError.message || 'Failed to create user account.' }, { status: 400 });
    }

    if (!authData?.user) {
      return NextResponse.json({ error: 'Failed to create user account.' }, { status: 500 });
    }

    // 4. Create user profile in public.users
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .upsert({
        id: authData.user.id,
        email: email,
        full_name: fullName,
        is_guest: false,
        account_type: 'free',
        credits_merged: false,
        is_confirmation: true // Already verified and confirmed!
      }, { onConflict: 'email' });

    if (dbError) {
      console.warn("Could not insert user profile in public users table:", dbError);
    }

    return NextResponse.json({
      success: true,
      message: 'Account verified and created successfully!'
    });

  } catch (error: any) {
    console.error('Verify OTP API error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to verify code.' }, { status: 500 });
  }
}
