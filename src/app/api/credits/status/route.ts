/**
 * GET /api/credits/status
 * Returns current credit status for guest or authenticated user.
 * Never deducts — read-only endpoint.
 */
import { NextRequest, NextResponse } from 'next/server';
import { GUEST_SESSION_COOKIE } from '@/lib/credits/config';
import { getGuestSession } from '@/lib/credits/guest';
import { getUserCreditInfo } from '@/lib/credits/user';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    // --- Authenticated user path ---
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      // Handle mock sessions (email-as-token pattern)
      if (token.includes('@')) {
        const email = token.toLowerCase().trim();
        const { info, error } = await getUserCreditInfo(email);
        if (!info || error) {
          return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }
        if (info.isPremium) {
          return NextResponse.json({ isGuest: false, isPremium: true, remaining: 9999, unlimited: true });
        }
        return NextResponse.json({
          isGuest: false,
          isPremium: false,
          remaining: info.remaining_credits,
          unlimited: false,
          creditsMerged: info.credits_merged,
        });
      }

      // Real JWT token
      const supabase = createClient(supabaseUrl, anonKey);
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user?.email) {
        return NextResponse.json({ error: 'Invalid session.' }, { status: 401 });
      }

      const { info, error } = await getUserCreditInfo(user.email);
      if (!info || error) {
        return NextResponse.json({ error: 'User not found.' }, { status: 404 });
      }

      if (info.isPremium) {
        return NextResponse.json({ isGuest: false, isPremium: true, remaining: 9999, unlimited: true });
      }

      return NextResponse.json({
        isGuest: false,
        isPremium: false,
        remaining: info.remaining_credits,
        unlimited: false,
        creditsMerged: info.credits_merged,
      });
    }

    // --- Guest path — check cookie ---
    const guestToken = request.cookies.get(GUEST_SESSION_COOKIE)?.value
      || request.nextUrl.searchParams.get('token');

    if (!guestToken) {
      return NextResponse.json({ isGuest: true, remaining: 0, needsSession: true });
    }

    const { session, error } = await getGuestSession(guestToken);
    if (!session || error) {
      return NextResponse.json({ isGuest: true, remaining: 0, needsSession: true });
    }

    return NextResponse.json({
      isGuest: true,
      remaining: session.remaining_credits,
    });
  } catch (err: any) {
    console.error('[/api/credits/status] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error.' }, { status: 500 });
  }
}
