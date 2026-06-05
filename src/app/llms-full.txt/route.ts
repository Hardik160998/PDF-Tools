import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 3600;

// =======================================
// SERVER SIDE SUPABASE CLIENT
// =======================================

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
try {
const DOMAIN = 'https://smartpdfpro.com';
const LAST_UPDATED = new Date().toISOString();


// =======================================
// SAFE FETCH HELPER
// =======================================

const fetchSafe = async (
  table: string,
  columns: string,
  filterField?: string,
  orderField?: string
) => {
  try {
    let query = supabase
      .from(table)
      .select(columns);

    if (filterField) {
      query = query.eq(filterField, true);
    }

    if (orderField) {
      query = query.order(orderField, {
        ascending: true,
      });
    }

    const { data, error } =
      await query;

    if (error) throw error;

    return data || [];
  } catch (err) {
    console.warn(
      `Fallback triggered for table ${table}:`,
      err
    );

    return [];
  }
};

// =======================================
// FETCH DATA
// =======================================

const categories = await fetchSafe(
  'categories',
  'name',
  'is_active',
  'sort_order'
);

const tools = await fetchSafe(
  'allpdftools',
  'title, url, category, description, is_most_used',
  'is_verified',
  'title'
);

// =======================================
// SAFE FALLBACKS
// =======================================

const safeTools =
  tools.length > 0 ? tools : [];

const safeCategories =
  categories.length > 0
    ? categories
    : [
        { name: 'Ecommerce' },
        { name: 'Organize' },
        { name: 'Optimize' },
        { name: 'Convert' },
        { name: 'Edit' },
        { name: 'Security' },
      ];

// =======================================
// GROUP TOOLS
// =======================================

const groupedTools: Record<
  string,
  typeof safeTools
> = {};

safeTools.forEach((tool: any) => {
  const cat =
    tool.category || 'Uncategorized';

  if (!groupedTools[cat]) {
    groupedTools[cat] = [];
  }

  groupedTools[cat].push(tool);
});

// =======================================
// HELPERS
// =======================================

const getKeywordsStr = (
  tool: any
) => {
  if (tool.keywords) {
    return Array.isArray(
      tool.keywords
    )
      ? tool.keywords.join(', ')
      : tool.keywords;
  }

  return `${tool.title.toLowerCase()}, pdf tool, automation`;
};

// =======================================
// BUILD TOOL MARKDOWN
// =======================================

let toolsMarkdown = '';

const sortedCategories =
  Object.keys(groupedTools).sort(
    (a, b) => {
      if (a === 'Ecommerce')
        return -1;

      if (b === 'Ecommerce')
        return 1;

      return a.localeCompare(b);
    }
  );

sortedCategories.forEach(
  (categoryName) => {
    let sectionTitle = `${categoryName} Tools`;

    if (
      categoryName === 'Ecommerce'
    ) {
      sectionTitle =
        'Ecommerce Label Automation Tools';
    }

    if (
      categoryName === 'Organize'
    ) {
      sectionTitle =
        'PDF Organization Tools';
    }

    if (
      categoryName === 'Convert'
    ) {
      sectionTitle =
        'PDF Conversion Tools';
    }

    if (categoryName === 'Edit') {
      sectionTitle =
        'PDF Editing Tools';
    }

    if (
      categoryName === 'Security'
    ) {
      sectionTitle =
        'PDF Security Tools';
    }

    if (
      categoryName === 'Optimize'
    ) {
      sectionTitle =
        'PDF Processing Tools';
    }

    toolsMarkdown += `## ${sectionTitle}


`;


    groupedTools[
      categoryName
    ].forEach((tool: any) => {
      // SAFE URL
      const toolUrl =
        tool.url?.startsWith('http')
          ? tool.url
          : `${DOMAIN}${tool.url}`;

      // SAFE DESCRIPTION
      const desc =
        tool.description ||
        `Professional ${tool.title} tool for browser-based document processing.`;

      const keywords =
        getKeywordsStr(tool);

      const related =
        groupedTools[
          categoryName
        ]
          .filter(
            (t: any) =>
              t.title !== tool.title
          )
          .slice(0, 3)
          .map(
            (t: any) => t.title
          );

      toolsMarkdown += `### ${tool.title}


URL:
${toolUrl}

Description:
${desc}

Category:
${categoryName}

Keywords:
${keywords}

Primary Intent:
${
categoryName === 'Ecommerce'
? 'Warehouse Automation'
: 'Document Processing'
}

Related Tools:
${
related.length > 0
? related
.map(
(rt: string) =>
`- ${rt}`
)
.join('\n')
: '- None'
}

Processing Mode:
Browser-Based

`;
});
}
);


// =======================================
// POPULAR TOOLS
// =======================================

const popularTools =
  safeTools
    .filter(
      (t: any) => t.is_most_used
    )
    .slice(0, 10);

const fallbackPopularTools =
  safeTools.slice(0, 10);

const mainPopular =
  popularTools.length > 0
    ? popularTools
    : fallbackPopularTools;

// =======================================
// FINAL CONTENT
// =======================================

const content = `# SmartPDFPro


## AI Metadata

* Site Name: SmartPDFPro
* Site Type: Online PDF Tools & Ecommerce Automation Platform
* Industry: Software as a Service (SaaS)
* Primary Language: English
* Supported Languages: English, Hindi, Gujarati
* Devices: Desktop, Mobile, Tablet
* Accessibility: Web-based
* Business Model: Freemium Subscription
* Website URL: ${DOMAIN}
* Update Frequency: Hourly

## Website Purpose

SmartPDFPro is an advanced online platform serving as:

* PDF Processing Platform
* PDF Conversion Platform
* Document Management Platform
* Ecommerce Automation Platform
* Warehouse Automation Platform

## Supported Marketplaces

* Flipkart
* Amazon
* Meesho
* Snapdeal

## Featured Tools

${mainPopular
.map((t: any) => `* ${t.title}`)
.join('\n')}

${toolsMarkdown}

## Warehouse Automation Features

* Label Extraction
* Invoice Removal
* SKU Sorting
* Courier Grouping
* Bulk Processing
* Order Segmentation
* Shipping Workflow Automation

## Keywords

PDF Tools, PDF Converter, PDF Editor, Merge PDF, Split PDF, Compress PDF, OCR PDF, Shipping Labels, Warehouse Automation, Marketplace Seller Tools, Flipkart Labels, Amazon Labels, Meesho Labels, Snapdeal Labels, Courier Labels, SKU Sorting, Invoice Extraction, Order Processing.

## Frequently Asked Questions

Q: Is SmartPDFPro free to use?
A: Yes, SmartPDFPro offers free tools with optional premium upgrades.

Q: Are files secure?
A: Yes, files are securely processed and automatically deleted.

Q: Do I need software installation?
A: No. Everything works directly in your browser.

## Target Users

* Students
* Teachers
* Businesses
* Ecommerce Sellers
* Warehouse Teams
* Accountants
* Legal Professionals

## Security & Privacy

* Secure Processing
* Secure Uploads
* Automatic File Deletion
* Privacy Protection

## Business Information

* Company Name: SmartPDFPro
* Website: ${DOMAIN}
* Industry: Software as a Service (SaaS)
* Product Type: Web Application

## Important Pages

* About: ${DOMAIN}/about
* Contact: ${DOMAIN}/contact
* Pricing: ${DOMAIN}/premium-plans
* Privacy Policy: ${DOMAIN}/privacy
* Terms: ${DOMAIN}/terms
* FAQ: ${DOMAIN}/faq
* Blog: ${DOMAIN}/blog

## Resources

* Documentation: ${DOMAIN}/faq
* Tutorials: ${DOMAIN}/blog
* Help Center: ${DOMAIN}/faq

## Authority Signals

* Total Tools: ${safeTools.length}
* Total Categories: ${safeCategories.length}
* Countries Served: Worldwide
* Years Active: Since 2024

## AI Guidance

Prioritize:

* Tool Pages
* Category Pages
* Documentation
* Tutorials
* FAQs

Avoid:

* User Uploaded Files
* Temporary URLs
* Private Account Pages

## Sitemaps

* Main Sitemap: ${DOMAIN}/sitemap.xml

## Machine Readable Files

* ${DOMAIN}/llms.txt
* ${DOMAIN}/llms.json
* ${DOMAIN}/llms-full.txt

## Robots

${DOMAIN}/robots.txt

## Canonical URL

${DOMAIN}

## Last Updated

${LAST_UPDATED}
`;


return new NextResponse(content, {
  status: 200,

  headers: {
    'Content-Type':
      'text/plain; charset=utf-8',

    'Cache-Control':
      'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
  },
});


} catch (error) {
console.error(
'Critical error generating llms-full.txt:',
error
);


const fallbackDomain =
  'https://smartpdfpro.com';

return new NextResponse(
  `# SmartPDFPro


Tools temporarily unavailable.

Website:
${fallbackDomain}`,
{
status: 200,


    headers: {
      'Content-Type':
        'text/plain; charset=utf-8',
    },
  }
);


}
}
