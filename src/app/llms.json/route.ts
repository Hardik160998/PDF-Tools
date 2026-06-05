import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 3600;

// Create server-side Supabase client
const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
try {
const DOMAIN = 'https://smartpdfpro.com';
const LAST_UPDATED = new Date().toISOString();


// ===============================
// FETCH CATEGORIES
// ===============================

const { data: categories, error: categoriesError } = await supabase
  .from('categories')
  .select('name, is_active')
  .eq('is_active', true)
  .order('sort_order', { ascending: true });

if (categoriesError) {
  console.error('Categories fetch error:', categoriesError);
}

// ===============================
// FETCH TOOLS
// ===============================

const { data: tools, error: toolsError } = await supabase
  .from('allpdftools')
  .select('title, url, category, description')
  .eq('is_verified', true)
  .order('title', { ascending: true });

if (toolsError) {
  console.error('Tools fetch error:', toolsError);
}

const safeTools = tools || [];
const safeCategories = categories || [];

// ===============================
// CATEGORY DESCRIPTIONS
// ===============================

const categoryDescriptions: Record<string, string> = {
  Ecommerce:
    'Automate marketplace logistics, sort shipping labels, and extract invoices for Flipkart, Amazon, Meesho, and Snapdeal.',

  Organize:
    'Extract, delete, reorder, and merge PDF pages securely.',

  Optimize:
    'Compress and repair PDF documents for faster web viewing and sharing.',

  Convert:
    'Convert PDF files to and from Word, Excel, JPG, PNG, PowerPoint, and other formats.',

  Edit:
    'Add page numbers, watermarks, edit metadata, and modify PDF content.',

  Security:
    'Protect, unlock, and digitally sign PDF documents securely.',

  Special:
    'Specialized tools for use-cases like Aadhar cropping.',

  Sign:
    'Add electronic signatures and validate signed PDF files.',

  'Image Convert':
    'Convert images between JPG, PNG, WebP, and AVIF formats.',
};

// ===============================
// GROUP TOOLS
// ===============================

const groupedTools: Record<string, typeof safeTools> = {};

safeTools.forEach((tool) => {
  const cat = tool.category || 'Uncategorized';

  if (!groupedTools[cat]) {
    groupedTools[cat] = [];
  }

  groupedTools[cat].push(tool);
});

// ===============================
// HELPERS
// ===============================

const getDynamicKeywords = (
  title: string,
  category: string
) => {
  const base = title.toLowerCase();

  if (category === 'Ecommerce') {
    return [
      base,
      `${base} automation`,
      'ecommerce label crop',
      'warehouse logistics',
    ];
  }

  return [
    base,
    `free ${base}`,
    `online ${base} tool`,
    'pdf utility',
  ];
};

const getDynamicUseCases = (
  title: string,
  category: string
) => {
  if (category === 'Ecommerce') {
    return [
      'Automate warehouse dispatch',
      'Bulk label processing',
      'Courier sorting',
    ];
  }

  if (category === 'Convert') {
    return [
      'Format migration',
      'Document sharing',
      'Editing preparation',
    ];
  }

  return [
    'Business document management',
    'Personal file organization',
    'Report consolidation',
  ];
};

const getRelatedTools = (
  currentTitle: string,
  category: string
) => {
  const peers = groupedTools[category] || [];

  return peers
    .filter((t) => t.title !== currentTitle)
    .slice(0, 3)
    .map((t) => t.title);
};

// ===============================
// BUILD TOOL DATA
// ===============================

const toolsData = safeTools.map((tool) => {
  const categoryName =
    tool.category || 'Uncategorized';

  const toolUrl = tool.url?.startsWith('http')
    ? tool.url
    : `${DOMAIN}${tool.url}`;

  let desc = tool.description;

  if (!desc) {
    desc =
      categoryName === 'Ecommerce'
        ? `Automate warehouse logistics and order processing with ${tool.title}.`
        : `Professional-grade ${tool.title} tool for secure browser-based document processing.`;
  }

  return {
    name: tool.title,

    slug: tool.url
      ?.replace('/tool/', '')
      ?.replace(/\//g, ''),

    url: toolUrl,

    short_summary: `${tool.title} online tool.`,

    description: desc,

    category: categoryName,

    keywords: getDynamicKeywords(
      tool.title,
      categoryName
    ),

    use_cases: getDynamicUseCases(
      tool.title,
      categoryName
    ),

    related_tools: getRelatedTools(
      tool.title,
      categoryName
    ),

    capabilities:
      categoryName === 'Ecommerce'
        ? [
            'Shipping Label Extraction',
            'SKU Sorting',
            'Courier Grouping',
            'Invoice Removal',
          ]
        : [
            'PDF Processing',
            'Document Optimization',
          ],

    processing_mode: 'Browser-Based',

    primary_intent:
      categoryName === 'Ecommerce'
        ? 'Warehouse Automation'
        : 'Document Processing',
  };
});

// ===============================
// FINAL JSON PAYLOAD
// ===============================

const payload = {
  meta: {
    site_name: 'SmartPDFPro',

    canonical_url: DOMAIN,

    site_type:
      'Online PDF Tools & Ecommerce Automation Platform',

    category:
      'PDF Utilities & Warehouse Logistics Automation',

    language: 'English',

    supported_languages: [
      'English',
      'Hindi',
      'Gujarati',
    ],

    devices: [
      'Desktop',
      'Mobile',
      'Tablet',
    ],

    accessibility:
      'Web-based, No installation required',

    business_model: 'Freemium Subscription',

    update_frequency: 'Hourly',

    last_updated: LAST_UPDATED,
  },

  supported_marketplaces: [
    'Flipkart',
    'Amazon',
    'Meesho',
    'Snapdeal',
  ],

  tools: toolsData,

  authority_signals: {
    number_of_tools: safeTools.length,
    number_of_categories:
      safeCategories.length,
    years_active: 'Since 2024',
    countries_served: 'Worldwide',
  },

  sitemap_discovery: {
    main: `${DOMAIN}/sitemap.xml`,
  },

  robots: `${DOMAIN}/robots.txt`,
};

return NextResponse.json(payload, {
  status: 200,
  headers: {
    'Cache-Control':
      'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
  },
});


} catch (error) {
console.error(
'Critical error generating llms.json:',
error
);


return NextResponse.json(
  {
    error: 'Tools temporarily unavailable.',
    website: 'https://smartpdfpro.com',
  },
  {
    status: 200,
  }
);


}
}
