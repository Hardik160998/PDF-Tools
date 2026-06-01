/**
 * POST /api/credits/deduct
 * Deducts 1 credit for a tool action.
 * Works for both guest sessions and authenticated users.
 * Fully idempotent — uses idempotency key to prevent duplicate deductions.
 *
 * Request body:
 * {
 *   toolName: string        — name of the tool being used
 *   idempotencyKey?: string — unique key for this action (auto-generated if missing)
 *   guestToken?: string     — guest session token (also read from cookie)
 * }
 *
 * Auth header (for logged-in users):
 * Authorization: Bearer <token>
 */
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { GUEST_SESSION_COOKIE, isFreeTool } from '@/lib/credits/config';
import { deductGuestCredit } from '@/lib/credits/guest';
import { deductUserCredit } from '@/lib/credits/user';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function generateIdempotencyKey(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { toolName = 'unknown', idempotencyKey: clientKey, guestToken: bodyGuestToken } = body;

    // Generate idempotency key if not provided
    const idempotencyKey = clientKey || generateIdempotencyKey(`${toolName}`);

    // Check if this tool is free — skip deduction
    if (isFreeTool(toolName)) {
      return NextResponse.json({
        allowed: true,
        remaining: null,
        free: true,
        message: 'This tool is free — no credit deducted.',
      });
    }

    const authHeader = request.headers.get('Authorization');

    // =========================================================
    // AUTHENTICATED USER PATH
    // =========================================================
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      let email = '';

      // Mock session (email-as-token dev pattern)
      if (token.includes('@')) {
        email = token.toLowerCase().trim();
      } else {
        // Verify real JWT
        const supabase = createClient(supabaseUrl, anonKey);
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user?.email) {
          return NextResponse.json({ error: 'Invalid auth session.' }, { status: 401 });
        }
        email = user.email.toLowerCase().trim();
      }

      const { allowed, remaining, unlimited, error } = await deductUserCredit(
        email,
        toolName,
        idempotencyKey
      );

      if (!allowed) {
        return NextResponse.json(
          { allowed: false, remaining: 0, error: error || 'Insufficient credits.' },
          { status: 403 }
        );
      }

      return NextResponse.json({
        allowed: true,
        remaining,
        unlimited,
        isGuest: false,
      });
    }

    // =========================================================
    // GUEST USER PATH
    // =========================================================
    const guestToken =
      bodyGuestToken ||
      request.cookies.get(GUEST_SESSION_COOKIE)?.value;

    if (!guestToken) {
      return NextResponse.json(
        { allowed: false, remaining: 0, error: 'No guest session found. Please refresh the page.' },
        { status: 401 }
      );
    }

    const { allowed, remaining, error } = await deductGuestCredit(
      guestToken,
      toolName,
      idempotencyKey
    );

    if (!allowed) {
      return NextResponse.json(
        {
          allowed: false,
          remaining: 0,
          isGuest: true,
          error: error || 'No credits remaining.',
          requiresAuth: true,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      allowed: true,
      remaining,
      isGuest: true,
    });
  } catch (err: any) {
    console.error('[/api/credits/deduct] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error.' }, { status: 500 });
  }
}
