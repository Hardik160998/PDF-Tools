/**
 * POST /api/credits/session
 * Creates a new guest session with 5 free credits.
 * Safe to call on every page load — idempotent via guestId.
 */
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createGuestSession } from '@/lib/credits/guest';
import { GUEST_SESSION_COOKIE } from '@/lib/credits/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const guestId = body?.guestId || undefined;

    const { session, error } = await createGuestSession(guestId);

    if (error || !session) {
      return NextResponse.json(
        { error: error || 'Failed to create guest session.' },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      sessionToken: session.session_token,
      credits: session.remaining_credits,
    });

    // Set session token as HTTP-only cookie for 30 days
    response.cookies.set(GUEST_SESSION_COOKIE, session.session_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (err: any) {
    console.error('[/api/credits/session] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Allow GET to fetch session from cookie
  try {
    const token = request.cookies.get(GUEST_SESSION_COOKIE)?.value;
    if (!token) {
      return NextResponse.json({ exists: false, credits: 0 });
    }

    const { getGuestSession } = await import('@/lib/credits/guest');
    const { session, error } = await getGuestSession(token);

    if (!session || error) {
      return NextResponse.json({ exists: false, credits: 0 });
    }

    return NextResponse.json({
      exists: true,
      sessionToken: session.session_token,
      credits: session.remaining_credits,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
