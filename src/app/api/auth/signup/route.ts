import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();

    if (!supabaseUrl) {
      return NextResponse.json({ error: 'Supabase URL configuration is missing.' }, { status: 500 });
    }

    // If service role key is configured, use the admin API to create the user and auto-confirm them
    if (serviceRoleKey) {
      const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });

      const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
        email: emailLower,
        password: password,
        email_confirm: true, // Auto-confirm email instantly
        user_metadata: { full_name: fullName }
      });

      if (adminError) {
        return NextResponse.json({ error: adminError.message }, { status: 400 });
      }

      if (adminData.user) {
        // Manually create profile in public.users table
        const { error: dbError } = await supabaseAdmin
          .from('users')
          .upsert({
            id: adminData.user.id,
            email: emailLower,
            full_name: fullName,
            is_guest: false,
            account_type: 'free',
            credits_merged: false
          }, { onConflict: 'email' });

        if (dbError) {
          console.warn("Could not insert user profile in public users table:", dbError);
        }

        return NextResponse.json({ 
          success: true, 
          message: "Account created and auto-confirmed successfully!",
          autoConfirmed: true
        });
      }
    }

    // No service role key, inform client to proceed with fallback client-side signup
    return NextResponse.json({
      success: false,
      error: "Service role key not configured."
    }, { status: 400 });

  } catch (error: any) {
    console.error('Signup API error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to sign up.' }, { status: 500 });
  }
}
