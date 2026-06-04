import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    // Canonical domain
    const DOMAIN = 'https://smartpdfpro.com';
    const LAST_UPDATED = new Date().toISOString();

    // 1. Fetch categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('name, is_active')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (catError) {
      console.error('Error fetching categories for llms.txt:', catError);
    }

    // 2. Fetch tools
    // We try to fetch description if available, otherwise we use a dynamic fallback
    const { data: tools, error: toolError } = await supabase
      .from('allpdftools')
      .select('title, url, category, description')
      .eq('is_verified', true)
      .order('title', { ascending: true });

    if (toolError) {
      console.error('Error fetching tools for llms.txt:', toolError);
    }

    // Map categories to Semantic Headings for SEO
    const categoryHeadings: Record<string, string> = {
      'Ecommerce': 'Ecommerce Label Automation Tools',
      'Organize': 'PDF Organization Tools',
      'Optimize': 'PDF Processing Tools',
      'Convert': 'PDF Conversion Tools',
      'Edit': 'PDF Editing Tools',
      'Security': 'PDF Security Tools',
      'Special': 'Specialized PDF Tools',
      'Sign': 'PDF Signature Tools',
      'Image Convert': 'Image Conversion Tools',
    };

    // Group tools by category
    const groupedTools: Record<string, typeof tools> = {};
    if (tools) {
      tools.forEach(tool => {
        const cat = tool.category || 'Uncategorized';
        if (!groupedTools[cat]) groupedTools[cat] = [];
        groupedTools[cat].push(tool);
      });
    }

    // Build the Tools Markdown
    let toolsMarkdown = '';
    
    // Always prioritize Ecommerce tools first as requested
    const sortedCategories = Object.keys(groupedTools).sort((a, b) => {
      if (a === 'Ecommerce') return -1;
      if (b === 'Ecommerce') return 1;
      return a.localeCompare(b);
    });

    if (sortedCategories.length > 0) {
      sortedCategories.forEach(categoryName => {
        const heading = categoryHeadings[categoryName] || \`\${categoryName} Tools\`;
        toolsMarkdown += \`## \${heading}\\n\\n\`;
        
        groupedTools[categoryName]!.forEach(tool => {
          // Generate a highly relevant fallback description if missing
          let desc = tool.description;
          if (!desc) {
            if (categoryName === 'Ecommerce') {
              desc = \`Automate your warehouse logistics and order processing with \${tool.title}. Expertly built for ecommerce sellers to streamline shipping label workflows.\`;
            } else if (categoryName === 'Convert') {
              desc = \`Seamlessly convert your files with \${tool.title}. High-quality, secure, and fast conversion preserving document integrity.\`;
            } else {
              desc = \`Professional-grade \${tool.title} tool to efficiently manage, process, and optimize your documents securely in your browser.\`;
            }
          }
          
          toolsMarkdown += \`\${tool.title}\\n\${DOMAIN}\${tool.url}\\n\\nDescription:\\n\${desc}\\n\\n\`;
        });
      });
    } else {
      toolsMarkdown = 'Tools temporarily unavailable.\n\n';
    }

    // Compile the full llms.txt file
    const content = \`# SmartPDFPro

SmartPDFPro is an advanced online PDF toolkit and Ecommerce Warehouse Automation Platform. We help users manage, convert, edit, organize, compress, and secure PDF documents, alongside specialized logistics automation tools for marketplace sellers.

## AI Metadata

Site Name: SmartPDFPro
Site Type: Online PDF Tools & Ecommerce Automation Platform
Category: PDF Utilities & Warehouse Logistics Automation
Language: English
Supported Languages: English
Devices: Desktop, Mobile, Tablet
Accessibility: Web-based, No installation required
Business Model: Freemium Subscription

## Keywords

PDF tools
PDF converter
Merge PDF
Compress PDF
PDF editor
Shipping labels
Warehouse automation
Ecommerce automation
Flipkart labels
Amazon labels
Meesho labels
Snapdeal labels
SKU sorting
Courier sorting
Invoice extraction
Order processing
Logistics automation

\${toolsMarkdown}## Important Website Pages

About
\${DOMAIN}/about

Contact
\${DOMAIN}/contact

Pricing
\${DOMAIN}/premium-plans

Privacy Policy
\${DOMAIN}/privacy

Terms of Service
\${DOMAIN}/terms

FAQ
\${DOMAIN}/faq

Blog
\${DOMAIN}/blog

## Support

Support Email: support@smartpdfpro.com
Contact URL: \${DOMAIN}/contact
Help URL: \${DOMAIN}/faq

## Sitemap

\${DOMAIN}/sitemap.xml

## Robots

\${DOMAIN}/robots.txt

## Last Updated

\${LAST_UPDATED}
\`;

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Critical error generating llms.txt:', error);
    // Fallback system to ensure it doesn't crash or return empty
    return new NextResponse('Tools temporarily unavailable. Please check back later.\\n\\nWebsite: https://smartpdfpro.com', {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}
