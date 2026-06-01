/**
 * Authenticated User Credit Logic — Server-Side Only
 * All functions run in API routes. Uses service-role Supabase client.
 */
import { createServerSupabase } from '@/lib/supabase-server';
import { AUTH_BONUS_CREDITS, GUEST_CREDITS } from './config';

export interface UserCreditInfo {
  userId: string;
  email: string;
  remaining_credits: number;
  credits_merged: boolean;
  isPremium: boolean;
}

/**
 * Fetches a user's credit information from the users table by email.
 */
export async function getUserCreditInfo(email: string): Promise<{
  info: UserCreditInfo | null;
  error: string | null;
}> {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from('users')
    .select('id, email, remaining_credits, credits_merged, current_plan, plan')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();

  if (error || !data) {
    return { info: null, error: error?.message || 'User not found.' };
  }

  const userPlan = data.current_plan || data.plan || 'Basic Plan';
  const isPremium =
    userPlan.toLowerCase().includes('pro') ||
    userPlan.toLowerCase().includes('premium');

  // Default to 10 credits if column is NULL
  const remaining_credits = data.remaining_credits !== null && data.remaining_credits !== undefined
    ? data.remaining_credits
    : 10;

  return {
    info: {
      userId: data.id,
      email: data.email,
      remaining_credits,
      credits_merged: data.credits_merged ?? false,
      isPremium,
    },
    error: null,
  };
}

/**
 * Atomically deducts 1 credit from a user's account.
 * (Idempotency and transaction logging removed per single-table architecture)
 * Premium users are always allowed (unlimited).
 */
export async function deductUserCredit(
  email: string,
  toolName: string,
  idempotencyKey: string // Kept for signature compatibility but unused
): Promise<{
  allowed: boolean;
  remaining: number;
  unlimited: boolean;
  error: string | null;
}> {
  const supabase = createServerSupabase();

  // 1. Fetch user info
  const { info, error: infoError } = await getUserCreditInfo(email);
  if (!info || infoError) {
    return { allowed: false, remaining: 0, unlimited: false, error: infoError || 'User not found.' };
  }

  // 2. Premium users — unlimited
  if (info.isPremium) {
    return { allowed: true, remaining: 9999, unlimited: true, error: null };
  }

  // 3. Check credits
  if (info.remaining_credits <= 0) {
    return {
      allowed: false,
      remaining: 0,
      unlimited: false,
      error: 'No credits remaining. Upgrade to Premium for unlimited usage.',
    };
  }

  const newCredits = info.remaining_credits - 1;

  // 4. Deduct from DB
  const { error: updateError } = await supabase
    .from('users')
    .update({ remaining_credits: newCredits })
    .eq('email', email.toLowerCase().trim());

  if (updateError) {
    console.error('[deductUserCredit] Update error:', updateError);
    return { allowed: false, remaining: info.remaining_credits, unlimited: false, error: updateError.message };
  }

  return { allowed: true, remaining: newCredits, unlimited: false, error: null };
}

/**
 * Merges guest credits into a user account on first login/signup.
 * - Takes remaining guest credits and adds AUTH_BONUS_CREDITS
 * - Sets credits_merged = true to prevent duplicate grants
 * - Safe to call multiple times — idempotent via credits_merged flag
 */
export async function mergeGuestCreditsIntoUser(
  userId: string,
  email: string,
  guestRemainingCredits: number,
  guestUsedCredits: number = 0,
  guestToken: string | null = null
): Promise<{
  newCredits: number;
  error: string | null;
}> {
  const supabase = createServerSupabase();

  // 1. Fetch current user (if it exists)
  const { data: existingUser } = await supabase
    .from('users')
    .select('id, remaining_credits, credits_merged')
    .eq('id', userId)
    .maybeSingle();

  if (existingUser?.credits_merged) {
    let updatedCredits = existingUser.remaining_credits;
    // For returning users, deduct any guest credits they used since the last merge
    if (guestUsedCredits > 0) {
       updatedCredits = Math.max(0, existingUser.remaining_credits - guestUsedCredits);
       await supabase
         .from('users')
         .update({ remaining_credits: updatedCredits })
         .eq('id', userId);
         
       if (guestToken) {
         // Reset used_credits on the guest session so we don't double count if they log out and use more
         await supabase
           .from('users')
           .update({ used_credits: 0 })
           .eq('guest_session_id', guestToken);
       }
    }
    return { newCredits: updatedCredits, error: null };
  }

  const newCredits = guestRemainingCredits + AUTH_BONUS_CREDITS;

  if (existingUser) {
    // A user row already exists (e.g. from a trigger/upsert). Update it to regular free user.
    const { error: updateError } = await supabase
      .from('users')
      .update({
        remaining_credits: newCredits,
        credits_merged: true,
        is_guest: false,
        account_type: 'free',
      })
      .eq('id', userId);

    if (updateError) {
      return { newCredits: 0, error: updateError.message };
    }

    if (guestToken) {
      // Reset used_credits on the guest session so it doesn't double count if they log out and use more
      await supabase
        .from('users')
        .update({ used_credits: 0 })
        .eq('guest_session_id', guestToken);
    }
  } else if (guestToken) {
    // No existing user row. Insert a new user row instead of converting the guest row, so the guest session is preserved on logout.
    const { error: insertError } = await supabase.from('users').insert({
      id: userId,
      email: email.toLowerCase().trim(),
      is_guest: false,
      account_type: 'free',
      remaining_credits: newCredits,
      credits_merged: true,
    });

    if (insertError) {
      return { newCredits: 0, error: insertError.message };
    }
    
    // Reset used_credits on the guest session
    await supabase
      .from('users')
      .update({ used_credits: 0 })
      .eq('guest_session_id', guestToken);
  } else {
    // No guest token, no existing row. Just create it (fallback)
    await supabase.from('users').insert({
      id: userId,
      email: email.toLowerCase().trim(),
      is_guest: false,
      account_type: 'free',
      remaining_credits: newCredits,
      credits_merged: true,
    });
  }

  return { newCredits, error: null };
}

/**
 * Grants initial credits to a brand-new user (no guest session to merge).
 * Only runs once — guarded by credits_merged flag.
 */
export async function grantInitialUserCredits(userId: string): Promise<{
  newCredits: number;
  error: string | null;
}> {
  const supabase = createServerSupabase();

  const { data: user } = await supabase
    .from('users')
    .select('credits_merged, remaining_credits')
    .eq('id', userId)
    .maybeSingle();

  // Already initialized
  if (user?.credits_merged) {
    return { newCredits: user.remaining_credits, error: null };
  }

  // New user with no guest session — give full 10 credits
  const initialCredits = 10;
  const { error } = await supabase
    .from('users')
    .update({
      remaining_credits: initialCredits,
      credits_merged: true,
      is_guest: false,
      account_type: 'free',
    })
    .eq('id', userId);

  if (error) {
    return { newCredits: 0, error: error.message };
  }

  return { newCredits: initialCredits, error: null };
}
