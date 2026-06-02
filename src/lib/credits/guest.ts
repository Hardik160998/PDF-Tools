/**
 * Guest Session Credit Logic — Server-Side Only
 * All functions run in API routes. Uses service-role Supabase client.
 */
import { createServerSupabase } from '@/lib/supabase-server';
import { GUEST_CREDITS } from './config';

/** Uses Node.js built-in crypto — no external package required */
function generateId(): string {
 return crypto.randomUUID().replace(/-/g, '');
}

export interface GuestSession {
 session_token: string;
 remaining_credits: number;
 used_credits?: number;
}

/**
 * Creates a new guest session in the users table.
 */
export async function createGuestSession(existingToken?: string): Promise<{
 session: GuestSession | null;
 error: string | null;
}> {
 const supabase = createServerSupabase();
 const sessionToken = existingToken || `gst_${generateId()}${generateId()}`;

 // Check if a session already exists
 const { data: existing } = await supabase
 .from('users')
 .select('guest_session_id, remaining_credits')
 .eq('guest_session_id', sessionToken)
 .maybeSingle();

 if (existing) {
 return { session: { session_token: sessionToken, remaining_credits: existing.remaining_credits }, error: null };
 }

 // Insert true guest row (no fake email needed)
 const { data, error } = await supabase
 .from('users')
 .insert({
 is_guest: true,
 guest_session_id: sessionToken,
 account_type: 'guest',
 remaining_credits: GUEST_CREDITS,
 used_credits: 0,
 })
 .select('remaining_credits')
 .single();

 if (error) {
 // Handle concurrent insertion (unique constraint violation on guest_session_id)
 if (error.code === '23505') {
 const { data: retryData } = await supabase
 .from('users')
 .select('remaining_credits')
 .eq('guest_session_id', sessionToken)
 .maybeSingle();
 
 if (retryData) {
 return { session: { session_token: sessionToken, remaining_credits: retryData.remaining_credits }, error: null };
 }
 }
 console.error('[createGuestSession] Error:', error);
 return { session: null, error: error.message };
 }

 return { session: { session_token: sessionToken, remaining_credits: data.remaining_credits }, error: null };
}

/**
 * Fetches a guest session by session token from the users table.
 */
export async function getGuestSession(sessionToken: string): Promise<{
 session: GuestSession | null;
 error: string | null;
}> {
 const supabase = createServerSupabase();

 const { data, error } = await supabase
 .from('users')
 .select('remaining_credits, used_credits')
 .eq('guest_session_id', sessionToken)
 .maybeSingle();

 if (error) {
 return { session: null, error: error.message };
 }

 if (!data) {
 return { session: null, error: 'Guest session not found.' };
 }

 return { session: { session_token: sessionToken, remaining_credits: data.remaining_credits, used_credits: data.used_credits || 0 }, error: null };
}

/**
 * Atomically deducts 1 credit from a guest session in the users table.
 */
export async function deductGuestCredit(
 sessionToken: string,
 toolName: string,
 idempotencyKey: string // Kept for signature compatibility but unused
): Promise<{
 allowed: boolean;
 remaining: number;
 error: string | null;
}> {
 const supabase = createServerSupabase();

 // 1. Fetch current session credits
 const { data: user, error: userError } = await supabase
 .from('users')
 .select('remaining_credits, used_credits')
 .eq('guest_session_id', sessionToken)
 .maybeSingle();

 if (!user || userError) {
 return { allowed: false, remaining: 0, error: userError?.message || 'Session not found.' };
 }

 // 2. Check credits
 if (user.remaining_credits <= 0) {
 return {
 allowed: false,
 remaining: 0,
 error: 'No credits remaining. Please sign up to get more credits.',
 };
 }

 const newCredits = user.remaining_credits - 1;
 const newUsed = (user.used_credits || 0) + 1;

 // 3. Deduct credit in DB
 const { error: updateError } = await supabase
 .from('users')
 .update({ 
 remaining_credits: newCredits,
 used_credits: newUsed 
 })
 .eq('guest_session_id', sessionToken);

 if (updateError) {
 console.error('[deductGuestCredit] Update error:', updateError);
 return { allowed: false, remaining: user.remaining_credits, error: updateError.message };
 }

 return { allowed: true, remaining: newCredits, error: null };
}

/**
 * Gets remaining credits for a guest by session token.
 */
export async function getGuestCredits(sessionToken: string): Promise<{
 credits: number;
 error: string | null;
}> {
 const { session, error } = await getGuestSession(sessionToken);
 if (!session) {
 return { credits: 0, error };
 }
 return { credits: session.remaining_credits, error: null };
}
