/**
 * POST /api/credits/merge
 * Merges guest session credits into an authenticated user account.
 * Called immediately after successful login/signup.
 *
 * - Takes remaining guest credits
 * - Adds 5 bonus account credits
 * - Marks user as credits_merged to prevent duplicate grants
 * - Idempotent — safe to call multiple times
 *
 * Request body:
 * {
 *   guestToken?: string  — guest session token (also read from cookie)
 * }
 *
 * Auth header: Authorization: Bearer <token>
 */
import { NextRequest, NextResponse } from 'next/server';
import { GUEST_SESSION_COOKIE, AUTH_BONUS_CREDITS } from '@/lib/credits/config';
import { getGuestSession } from '@/lib/credits/guest';
import { mergeGuestCreditsIntoUser, grantInitialUserCredits, getUserCreditInfo } from '@/lib/credits/user';
import { createClient } from '@supabase/supabase-js';
import { createServerSupabase } from '@/lib/supabase-server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization required.' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const body = await request.json().catch(() => ({}));
    const guestToken =
      body?.guestToken ||
      request.cookies.get(GUEST_SESSION_COOKIE)?.value;

    let email = '';
    let userId = '';

    // Resolve user identity
    if (token.includes('@')) {
      // Mock session
      email = token.toLowerCase().trim();
      const supabase = createServerSupabase();
      const { data: userRow } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      if (!userRow?.id) {
        return NextResponse.json({ error: 'User not found in database.' }, { status: 404 });
      }
      userId = userRow.id;
    } else {
      // Real JWT
      const supabase = createClient(supabaseUrl, anonKey);
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user?.email) {
        return NextResponse.json({ error: 'Invalid auth session.' }, { status: 401 });
      }
      email = user.email.toLowerCase().trim();
      userId = user.id;
    }

    // Fetch user info (no early return so we can deduct guest usage if applicable)
    const { info } = await getUserCreditInfo(email);


    // --- Merge flow ---
    let guestRemainingCredits = 0;
    let guestUsedCredits = 0;

    if (guestToken) {
      const { session } = await getGuestSession(guestToken);
      if (session) {
        guestRemainingCredits = session.remaining_credits;
        guestUsedCredits = session.used_credits || 0;
      }
    }

    // If no guest session found, give full bonus credits (direct signup, no prior guest usage)
    const { newCredits, error: mergeError } = guestToken && guestRemainingCredits >= 0
      ? await mergeGuestCreditsIntoUser(userId, email, guestRemainingCredits, guestUsedCredits, guestToken)
      : await grantInitialUserCredits(userId);

    if (mergeError) {
      console.error('[/api/credits/merge] Merge error:', mergeError);
      return NextResponse.json({ error: mergeError }, { status: 500 });
    }

    // Clear guest cookie on response
    const response = NextResponse.json({
      success: true,
      newCredits,
      guestCreditsCarried: guestRemainingCredits,
      bonusAdded: AUTH_BONUS_CREDITS,
      message: `🎉 Credits merged! You now have ${newCredits} credits.`,
    });

    // Do not expire guest cookie, so anonymous session resumes on logout

    return response;
  } catch (err: any) {
    console.error('[/api/credits/merge] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error.' }, { status: 500 });
  }
}
