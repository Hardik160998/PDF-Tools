/**
 * Server-only Supabase client using the Service Role Key.
 * NEVER import this file in client components — it contains the service key.
 * Used exclusively in Next.js API routes (server-side only).
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let _serverClient: SupabaseClient | null = null;

/**
 * Returns a Supabase client with service role privileges.
 * Falls back to anon key if service role key is not configured.
 */
export function getServerSupabase(): SupabaseClient {
  if (!_serverClient) {
    const key = serviceRoleKey || anonKey;
    if (!supabaseUrl || !key) {
      throw new Error('Supabase URL or key is not configured in environment variables.');
    }
    _serverClient = createClient(supabaseUrl, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return _serverClient;
}

/**
 * Creates a fresh Supabase client for each request (recommended for API routes).
 * Uses service role key for full DB access bypassing RLS.
 */
export function createServerSupabase(): SupabaseClient {
  const key = serviceRoleKey || anonKey;
  if (!supabaseUrl || !key) {
    throw new Error('Supabase URL or key is not configured in environment variables.');
  }
  return createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Creates an authenticated user Supabase client from a JWT token.
 * Used to verify user identity in API routes.
 */
export function createUserSupabase(accessToken: string): SupabaseClient {
  return createClient(supabaseUrl, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
