import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ALWAYS_VERIFIED = ['esign', 'edit-pdf', 'extract-pages', 'delete-pages', 'add-blank-page', 'flatten-pdf', 'optimize-pdf', 'translate-pdf', 'webpage-to-pdf', 'compare-pdf', 'redact-pdf', 'bookmark-pdf', 'docx-to-pdf', 'pdf-to-docx', 'jpg-to-png', 'png-to-jpg', 'jpg-to-webp', 'webp-to-jpg', 'png-to-webp', 'webp-to-png', 'jpg-to-avif', 'avif-to-jpg', 'png-to-avif', 'avif-to-png', 'webp-to-avif', 'avif-to-webp'];

// Tools with their category — synced to allpdftools.category column
const TOOL_CATEGORIES: Record<string, string> = {
  'compare-pdf': 'Organize', 'extract-pages': 'Organize', 'delete-pages': 'Organize', 'add-blank-page': 'Organize', 'organize': 'Organize', 'merge': 'Organize', 'split': 'Organize',
  'compress': 'Optimize', 'repair-pdf': 'Optimize', 'optimize-pdf': 'Optimize',
  'extract-text': 'Convert', 'pdf-to-xml': 'Convert', 'pdf-to-jpg': 'Convert', 'jpg-to-pdf': 'Convert', 'translate-pdf': 'Convert',
  'word-to-pdf': 'Convert', 'pdf-to-word': 'Convert', 'docx-to-pdf': 'Convert', 'pdf-to-docx': 'Convert',
  'ppt-to-pdf': 'Convert', 'pdf-to-ppt': 'Convert', 'excel-to-pdf': 'Convert', 'pdf-to-excel': 'Convert',
  'html-to-pdf': 'Convert', 'webpage-to-pdf': 'Convert',
  'jpg-to-png': 'Image Convert', 'png-to-jpg': 'Image Convert',
  'jpg-to-webp': 'Image Convert', 'webp-to-jpg': 'Image Convert',
  'png-to-webp': 'Image Convert', 'webp-to-png': 'Image Convert',
  'jpg-to-avif': 'Image Convert', 'avif-to-jpg': 'Image Convert',
  'png-to-avif': 'Image Convert', 'avif-to-png': 'Image Convert',
  'webp-to-avif': 'Image Convert', 'avif-to-webp': 'Image Convert',
  'bookmark-pdf': 'Edit', 'watermark': 'Edit', 'page-numbers': 'Edit', 'metadata': 'Edit', 'flatten-pdf': 'Edit', 'esign': 'Sign', 'edit-pdf': 'Edit',
  'redact-pdf': 'Security', 'unlock': 'Security', 'protect': 'Security',
  'aadhar-crop': 'Special',
};

export async function getCategories(): Promise<string[]> {
  const { data } = await supabase
    .from('categories')
    .select('name')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  return data?.map(r => r.name) ?? ['Organize','Optimize','Convert','Image Convert','Edit','Security','Special','Sign'];
}

export async function getVerifiedToolKeys(): Promise<string[]> {
  const { data } = await supabase
    .from('allpdftools')
    .select('tool_key')
    .eq('is_verified', true);
  const dbKeys = data?.map(r => r.tool_key) ?? [];
  return Array.from(new Set([...dbKeys, ...ALWAYS_VERIFIED]));
}

export async function getImgConvertTools(): Promise<string[]> {
  const { data } = await supabase
    .from('allpdftools')
    .select('tool_key')
    .eq('img_convert', true);
  // fallback to hardcoded if column doesn't exist yet or no rows marked
  if (!data || data.length === 0) return ['jpg-to-png', 'png-to-jpg', 'jpg-to-webp', 'webp-to-jpg', 'png-to-webp', 'webp-to-png', 'jpg-to-avif', 'avif-to-jpg', 'png-to-avif', 'avif-to-png', 'webp-to-avif', 'avif-to-webp'];
  return data.map(r => r.tool_key);
}

export async function getToolsByCategory(category: string): Promise<string[]> {
  const { data } = await supabase
    .from('allpdftools')
    .select('tool_key')
    .eq('category', category)
    .eq('is_verified', true);
  return data?.map(r => r.tool_key) ?? [];
}

export async function syncToolCategories() {
  const entries = Object.entries(TOOL_CATEGORIES).map(([tool_key, category]) => ({ tool_key, category }));
  for (const { tool_key, category } of entries) {
    await supabase
      .from('allpdftools')
      .update({ category })
      .eq('tool_key', tool_key);
  }
}

export async function insertAvifTools() {
  const avifTools = [
    { tool_key: 'jpg-to-avif',  title: 'JPG to AVIF',  url: '/tool/jpg-to-avif',  category: 'Image Convert', is_verified: true, img_convert: true },
    { tool_key: 'avif-to-jpg',  title: 'AVIF to JPG',  url: '/tool/avif-to-jpg',  category: 'Image Convert', is_verified: true, img_convert: true },
    { tool_key: 'png-to-avif',  title: 'PNG to AVIF',  url: '/tool/png-to-avif',  category: 'Image Convert', is_verified: true, img_convert: true },
    { tool_key: 'avif-to-png',  title: 'AVIF to PNG',  url: '/tool/avif-to-png',  category: 'Image Convert', is_verified: true, img_convert: true },
    { tool_key: 'webp-to-avif', title: 'WebP to AVIF', url: '/tool/webp-to-avif', category: 'Image Convert', is_verified: true, img_convert: true },
    { tool_key: 'avif-to-webp', title: 'AVIF to WebP', url: '/tool/avif-to-webp', category: 'Image Convert', is_verified: true, img_convert: true },
  ];
  // Check which ones already exist to avoid conflicts
  const keys = avifTools.map(t => t.tool_key);
  const { data: existing } = await supabase
    .from('allpdftools')
    .select('tool_key')
    .in('tool_key', keys);
  const existingKeys = existing?.map(r => r.tool_key) ?? [];
  const toInsert = avifTools.filter(t => !existingKeys.includes(t.tool_key));
  if (toInsert.length === 0) return null;
  const { error } = await supabase.from('allpdftools').insert(toInsert);
  return error;
}

export async function trackToolClick(tool_key: string) {
  const { data } = await supabase
    .from('allpdftools')
    .select('id')
    .eq('tool_key', tool_key)
    .single();
  if (data) await supabase.from('tool_clicks').insert({ tool_id: data.id });
}
