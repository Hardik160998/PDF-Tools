import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (typeof window === 'undefined') return null;
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    _supabase = createClient(url, key);
  }
  return _supabase;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase();
    if (!client) return () => Promise.resolve({ data: null, error: null });
    return (client as any)[prop];
  },
});

const ALWAYS_VERIFIED = ['esign', 'edit-pdf', 'extract-pages', 'delete-pages', 'add-blank-page', 'flatten-pdf', 'optimize-pdf', 'webpage-to-pdf', 'compare-pdf', 'redact-pdf', 'bookmark-pdf', 'docx-to-pdf', 'pdf-to-docx', 'jpg-to-png', 'png-to-jpg', 'jpg-to-webp', 'webp-to-jpg', 'png-to-webp', 'webp-to-png', 'jpg-to-avif', 'avif-to-jpg', 'png-to-avif', 'avif-to-png', 'webp-to-avif', 'avif-to-webp', 'ocr-pdf', 'remove-ocr', 'crop-pdf', 'meesho-cropper', 'meshocrop'];

// Tools with their category — synced to allpdftools.category column
const TOOL_CATEGORIES: Record<string, string> = {
  'compare-pdf': 'Organize', 'extract-pages': 'Organize', 'delete-pages': 'Organize', 'add-blank-page': 'Organize', 'organize': 'Organize', 'merge': 'Organize', 'split': 'Organize',
  'compress': 'Optimize', 'repair-pdf': 'Optimize', 'optimize-pdf': 'Optimize',
  'extract-text': 'Convert', 'pdf-to-xml': 'Convert', 'pdf-to-jpg': 'Convert', 'jpg-to-pdf': 'Convert',
  'word-to-pdf': 'Convert', 'pdf-to-word': 'Convert', 'docx-to-pdf': 'Convert', 'pdf-to-docx': 'Convert',
  'ppt-to-pdf': 'Convert', 'pdf-to-ppt': 'Convert', 'excel-to-pdf': 'Convert', 'pdf-to-excel': 'Convert',
  'html-to-pdf': 'Convert', 'webpage-to-pdf': 'Convert', 'ocr-pdf': 'Convert',
  'jpg-to-png': 'Image Convert', 'png-to-jpg': 'Image Convert',
  'jpg-to-webp': 'Image Convert', 'webp-to-jpg': 'Image Convert',
  'png-to-webp': 'Image Convert', 'webp-to-png': 'Image Convert',
  'jpg-to-avif': 'Image Convert', 'avif-to-jpg': 'Image Convert',
  'png-to-avif': 'Image Convert', 'avif-to-png': 'Image Convert',
  'webp-to-avif': 'Image Convert', 'avif-to-webp': 'Image Convert',
  'bookmark-pdf': 'Edit', 'watermark': 'Edit', 'page-numbers': 'Edit', 'metadata': 'Edit', 'flatten-pdf': 'Edit', 'remove-ocr': 'Edit', 'esign': 'Sign', 'edit-pdf': 'Edit',
  'redact-pdf': 'Security', 'unlock': 'Security', 'protect': 'Security',
  'aadhar-crop': 'Special', 'crop-pdf': 'Special',
  'meesho-cropper': 'Ecommerce',
  'meshocrop': 'Ecommerce',
};

const CATEGORY_ID_MAP: Record<string, number> = {
  'Organize': 1, 'Optimize': 2, 'Convert': 3, 'Edit': 4,
  'Security': 5, 'Special': 6, 'Sign': 7, 'Image Convert': 10, 'Ecommerce': 11,
};

const SPECIAL_URLS: Record<string, string> = {
  'esign': '/esign',
  'edit-pdf': '/edit',
};

export async function getVerifiedToolKeys(): Promise<string[]> {
  try {
    const { data } = await supabase
      .from('allpdftools')
      .select('tool_key')
      .eq('is_verified', true);
    const dbKeys = data?.map(r => r.tool_key) ?? [];
    return Array.from(new Set([...dbKeys, ...ALWAYS_VERIFIED]));
  } catch {
    return ALWAYS_VERIFIED;
  }
}

export async function getImgConvertTools(): Promise<string[]> {
  try {
    const { data } = await supabase
      .from('allpdftools')
      .select('tool_key')
      .eq('img_convert', true);
    if (!data || data.length === 0) return ['jpg-to-png', 'png-to-jpg', 'jpg-to-webp', 'webp-to-jpg', 'png-to-webp', 'webp-to-png', 'jpg-to-avif', 'avif-to-jpg', 'png-to-avif', 'avif-to-png', 'webp-to-avif', 'avif-to-webp'];
    return data.map(r => r.tool_key);
  } catch {
    return ['jpg-to-png', 'png-to-jpg', 'jpg-to-webp', 'webp-to-jpg', 'png-to-webp', 'webp-to-png', 'jpg-to-avif', 'avif-to-jpg', 'png-to-avif', 'avif-to-png', 'webp-to-avif', 'avif-to-webp'];
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const { data } = await supabase
      .from('categories')
      .select('name')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    return data?.map(r => r.name) ?? ['Organize','Optimize','Convert','Image Convert','Edit','Security','Special','Ecommerce','Sign'];
  } catch {
    return ['Organize','Optimize','Convert','Image Convert','Edit','Security','Special','Ecommerce','Sign'];
  }
}

export async function getToolsByCategory(category: string): Promise<string[]> {
  const { data } = await supabase
    .from('allpdftools')
    .select('tool_key')
    .eq('category', category)
    .eq('is_verified', true);
  return data?.map(r => r.tool_key) ?? [];
}

// Auto-sync: insert any tool from TOOLS list that is missing in Supabase
export async function syncMissingTools(tools: { id: string; title: string; category: string }[]) {
  const keys = tools.map(t => t.id);
  const { data: existing } = await supabase
    .from('allpdftools')
    .select('tool_key')
    .in('tool_key', keys);
  const existingKeys = new Set(existing?.map(r => r.tool_key) ?? []);
  const toInsert = tools
    .filter(t => !existingKeys.has(t.id))
    .map(t => ({
      tool_key: t.id,
      title: t.title,
      url: SPECIAL_URLS[t.id] ?? `/tool/${t.id}`,
      category: t.category,
      category_id: CATEGORY_ID_MAP[t.category] ?? 6,
      is_verified: true,
      img_convert: t.category === 'Image Convert',
    }));
  if (toInsert.length === 0) return null;
  const { error } = await supabase.from('allpdftools').insert(toInsert);
  if (error) console.error('syncMissingTools error:', error);
  return error;
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

export async function insertMeeshoTool() {

  const { data: existing } = await supabase
    .from('allpdftools')
    .select('tool_key')
    .eq('tool_key', 'meesho-cropper')
    .single();
  if (existing) {
    await supabase.from('allpdftools').update({ category: 'Ecommerce', category_id: 11, is_verified: true }).eq('tool_key', 'meesho-cropper');
    return null;
  }
  const { error } = await supabase.from('allpdftools').insert([{
    tool_key: 'meesho-cropper',
    title: 'Meesho Label with Invoice Cropper',
    url: '/tool/meesho-cropper',
    category: 'Ecommerce',
    category_id: 11,
    is_verified: true,
    img_convert: false,
  }]);
  return error;
}

export async function insertMeeshoCropTool() {

  const { data: existing } = await supabase
    .from('allpdftools')
    .select('tool_key')
    .eq('tool_key', 'meshocrop')
    .single();
  if (existing) {
    await supabase.from('allpdftools').update({ category: 'Ecommerce', category_id: 11, is_verified: true }).eq('tool_key', 'meshocrop');
    return null;
  }
  const { error } = await supabase.from('allpdftools').insert([{
    tool_key: 'meshocrop',
    title: 'Meesho Label Crop (without invoice)',
    url: '/tool/meshocrop',
    category: 'Ecommerce',
    category_id: 11,
    is_verified: true,
    img_convert: false,
  }]);
  return error;
}

export async function insertEcommerceCategory() {
  const { data: existing } = await supabase
    .from('categories')
    .select('name')
    .eq('name', 'Ecommerce')
    .single();
  if (existing) return null;
  const { error } = await supabase
    .from('categories')
    .insert([{ name: 'Ecommerce', is_active: true, sort_order: 9 }]);
  return error;
}

export async function insertAvifTools() {
  const avifTools = [
    { tool_key: 'jpg-to-avif',  title: 'JPG to AVIF',  url: '/tool/jpg-to-avif',  category: 'Image Convert', category_id: 10, is_verified: true, img_convert: true },
    { tool_key: 'avif-to-jpg',  title: 'AVIF to JPG',  url: '/tool/avif-to-jpg',  category: 'Image Convert', category_id: 10, is_verified: true, img_convert: true },
    { tool_key: 'png-to-avif',  title: 'PNG to AVIF',  url: '/tool/png-to-avif',  category: 'Image Convert', category_id: 10, is_verified: true, img_convert: true },
    { tool_key: 'avif-to-png',  title: 'AVIF to PNG',  url: '/tool/avif-to-png',  category: 'Image Convert', category_id: 10, is_verified: true, img_convert: true },
    { tool_key: 'webp-to-avif', title: 'WebP to AVIF', url: '/tool/webp-to-avif', category: 'Image Convert', category_id: 10, is_verified: true, img_convert: true },
    { tool_key: 'avif-to-webp', title: 'AVIF to WebP', url: '/tool/avif-to-webp', category: 'Image Convert', category_id: 10, is_verified: true, img_convert: true },
  ];
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
