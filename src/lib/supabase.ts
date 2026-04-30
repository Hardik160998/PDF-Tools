import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getVerifiedToolKeys(): Promise<string[]> {
  const { data } = await supabase
    .from('allpdftools')
    .select('tool_key')
    .eq('is_verified', true);
  return data?.map(r => r.tool_key) ?? [];
}

export async function trackToolClick(tool_key: string) {
  const { data } = await supabase
    .from('allpdftools')
    .select('id')
    .eq('tool_key', tool_key)
    .single();
  if (data) await supabase.from('tool_clicks').insert({ tool_id: data.id });
}
