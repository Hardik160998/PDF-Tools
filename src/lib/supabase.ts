import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ALWAYS_VERIFIED = ['esign', 'edit-pdf', 'extract-pages', 'webpage-to-pdf', 'compare-pdf', 'redact-pdf', 'bookmark-pdf', 'docx-to-pdf', 'pdf-to-docx'];

export async function getVerifiedToolKeys(): Promise<string[]> {
  const { data } = await supabase
    .from('allpdftools')
    .select('tool_key')
    .eq('is_verified', true);
  const dbKeys = data?.map(r => r.tool_key) ?? [];
  return Array.from(new Set([...dbKeys, ...ALWAYS_VERIFIED]));
}

export async function trackToolClick(tool_key: string) {
  const { data } = await supabase
    .from('allpdftools')
    .select('id')
    .eq('tool_key', tool_key)
    .single();
  if (data) await supabase.from('tool_clicks').insert({ tool_id: data.id });
}
