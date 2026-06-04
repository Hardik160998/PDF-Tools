import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Revalidate the cache every hour (3600 seconds) so that when new tools 
// are added to the database, the llms.txt file is updated dynamically.
export const revalidate = 3600;

export async function GET() {
  try {
    // 1. Fetch active categories ordered by sort_order
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('name, is_active')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (catError) {
      console.error('Error fetching categories for llms.txt:', catError);
    }

    // 2. Fetch all verified tools ordered by title
    const { data: tools, error: toolError } = await supabase
      .from('allpdftools')
      .select('title, url, category')
      .eq('is_verified', true)
      .order('title', { ascending: true });

    if (toolError) {
      console.error('Error fetching tools for llms.txt:', toolError);
    }

    // Format the tools section
    let toolsMarkdown = '';
    if (tools && tools.length > 0) {
      toolsMarkdown = tools.map((tool) => {
        const description = `Easily process your documents with the ${tool.title} tool.`;
        return `* **${tool.title}**\n  * URL: https://www.smartpdfpro.com${tool.url}\n  * Category: ${tool.category || 'Tool'}\n  * Description: ${description}`;
      }).join('\n\n');
    } else {
      toolsMarkdown = '* No active tools found at the moment.';
    }

    // Format the categories section
    let categoriesMarkdown = '';
    if (categories && categories.length > 0) {
      categoriesMarkdown = categories.map((cat) => `* ${cat.name}`).join('\n');
    } else {
      categoriesMarkdown = '* PDF Tools';
    }

    // Since a blog table doesn't exist yet based on our schema, we can safely leave 
    // a placeholder or link to the main blog directory if one gets added later.
    const blogMarkdown = `* [SmartPDFPro Blog](https://www.smartpdfpro.com/blog)`;

    const content = `# SmartPDFPro

SmartPDFPro is an online PDF toolkit that helps users manage, convert, edit, organize, compress, and secure PDF documents.

## Main Tools

${toolsMarkdown}

## Categories

${categoriesMarkdown}

## Features

* Browser-based PDF processing
* No software installation required
* Secure file handling
* Fast document processing
* Mobile friendly
* Cross-platform compatibility

## Blog

${blogMarkdown}

## Website

https://www.smartpdfpro.com

## Sitemap

https://www.smartpdfpro.com/sitemap.xml

## Robots

https://www.smartpdfpro.com/robots.txt
`;

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Critical error generating llms.txt:', error);
    return new NextResponse('Internal Server Error generating llms.txt', { status: 500 });
  }
}

