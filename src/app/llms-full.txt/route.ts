import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const DOMAIN = 'https://smartpdfpro.com';
    const LAST_UPDATED = new Date().toISOString();

    // Safe fetch helper
    const fetchSafe = async (table: string, columns: string, filterField?: string, orderField?: string) => {
      try {
        let query = supabase.from(table).select(columns);
        if (filterField) query = query.eq(filterField, true);
        if (orderField) query = query.order(orderField, { ascending: true });
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.warn(`Fallback triggered for table ${table}:`, err);
        return [];
      }
    };

    const categories = await fetchSafe('categories', 'name', 'is_active', 'sort_order');
    const tools = await fetchSafe('allpdftools', 'title, url, category, description, meta_description, short_description, keywords, use_cases, benefits, is_most_used', 'is_verified', 'title');
    const faqs = await fetchSafe('faqs', 'question, answer', 'is_active', 'sort_order');
    const blogs = await fetchSafe('blogs', 'title, slug', 'is_published', 'created_at');
    const integrations = await fetchSafe('integrations', 'name', 'is_active', 'name');

    const safeTools = tools.length > 0 ? tools : [];
    const safeCategories = categories.length > 0 ? categories : [
      { name: 'Ecommerce' }, 
      { name: 'Organize' }, 
      { name: 'Optimize' }, 
      { name: 'Convert' }, 
      { name: 'Edit' }, 
      { name: 'Security' }
    ];
    const safeFaqs = faqs.length > 0 ? faqs : [{ question: 'Is it free?', answer: 'We offer a generous free tier.' }];
    const safeBlogs = blogs.length > 0 ? blogs : [];
    const safeIntegrations = integrations.length > 0 ? integrations : [{ name: 'Google Drive' }, { name: 'Dropbox' }, { name: 'OneDrive' }];

    // Group tools by category
    const groupedTools: Record<string, typeof safeTools> = {};
    safeTools.forEach((tool: any) => {
      const cat = tool.category || 'Uncategorized';
      if (!groupedTools[cat]) groupedTools[cat] = [];
      groupedTools[cat].push(tool);
    });

    const getKeywordsStr = (tool: any) => {
      if (tool.keywords) {
        return Array.isArray(tool.keywords) ? tool.keywords.join(', ') : tool.keywords;
      }
      return `${tool.title.toLowerCase()}, pdf tool, automation`;
    };

    const getList = (field: any, defaultItems: string[]) => {
      if (!field) return defaultItems;
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') return field.split(',').map(s => s.trim());
      return defaultItems;
    };

    let toolsMarkdown = '';
    
    // Sort categories, prioritizing Ecommerce
    const sortedCategories = Object.keys(groupedTools).sort((a, b) => {
      if (a === 'Ecommerce') return -1;
      if (b === 'Ecommerce') return 1;
      return a.localeCompare(b);
    });

    sortedCategories.forEach(categoryName => {
      
      let sectionTitle = `${categoryName} Tools`;
      if (categoryName === 'Ecommerce') sectionTitle = 'Ecommerce Label Automation Tools';
      if (categoryName === 'Organize') sectionTitle = 'PDF Organization Tools';
      if (categoryName === 'Convert') sectionTitle = 'PDF Conversion Tools';
      if (categoryName === 'Edit') sectionTitle = 'PDF Editing Tools';
      if (categoryName === 'Security') sectionTitle = 'PDF Security Tools';
      if (categoryName === 'Optimize') sectionTitle = 'PDF Processing Tools';

      toolsMarkdown += `## ${sectionTitle}\n\n`;
      
      groupedTools[categoryName].forEach((tool: any) => {
        const desc = tool.meta_description || tool.short_description || tool.description || `Professional ${tool.title} tool.`;
        const keywords = getKeywordsStr(tool);
        const benefits = getList(tool.benefits, ['Time saving', 'High accuracy']);
        const useCases = getList(tool.use_cases, ['Business workflow', 'Personal use']);
        const related = groupedTools[categoryName]
          .filter((t: any) => t.title !== tool.title)
          .slice(0, 3)
          .map((t: any) => t.title);

        toolsMarkdown += `### ${tool.title}
URL: ${DOMAIN}${tool.url}
Description: ${desc}
Category: ${categoryName}
Keywords: ${keywords}
Benefits:
${benefits.map((b: string) => `- ${b}`).join('\n')}
Use Cases:
${useCases.map((uc: string) => `- ${uc}`).join('\n')}
Related Tools:
${related.length > 0 ? related.map((rt: string) => `- ${rt}`).join('\n') : '- None'}

`;
      });
    });

    const popularTools = safeTools.filter((t: any) => t.is_most_used).slice(0, 10);
    const fallbackPopularTools = safeTools.slice(0, 10);
    const mainPopular = popularTools.length > 0 ? popularTools : fallbackPopularTools;

    const content = `## AI Metadata

* Site Name: SmartPDFPro
* Site Type: Online PDF Tools & Ecommerce Automation Platform
* Industry: Software as a Service (SaaS)
* Primary Language: English
* Supported Languages: English, Hindi, Gujarati
* Devices: Desktop, Mobile, Tablet
* Accessibility: Web-based, No installation required
* Business Model: Freemium Subscription
* Website URL: ${DOMAIN}

## Website Purpose

SmartPDFPro is an advanced online platform serving as:
* PDF Processing Platform
* PDF Conversion Platform
* Document Management Platform
* Ecommerce Automation Platform
* Warehouse Automation Platform

## Featured Tools

${mainPopular.map((t: any) => `* ${t.title}`).join('\n')}

${toolsMarkdown}## Warehouse Automation Features

* Label Extraction
* Invoice Removal
* SKU Sorting
* Courier Grouping
* Bulk Processing
* Order Segmentation
* Shipping Workflow Automation

## Keywords

PDF Tools, PDF Converter, PDF Editor, Merge PDF, Split PDF, Compress PDF, OCR PDF, Shipping Labels, Warehouse Automation, Marketplace Seller Tools, Flipkart Labels, Amazon Labels, Meesho Labels, Snapdeal Labels, Courier Labels, SKU Sorting, Invoice Extraction, Order Processing.

## Most Popular Tools

${mainPopular.map((t: any) => `* ${t.title}`).join('\n')}

## Frequently Asked Questions

${safeFaqs.map((faq: any) => `Q: ${faq.question}\nA: ${faq.answer}\n`).join('\n')}

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
* Help Center: ${DOMAIN}/faq
* Blog: ${DOMAIN}/blog
${safeBlogs.map((b: any) => `* ${b.title}: ${DOMAIN}/blog/${b.slug}`).join('\n')}

## Resources

* Documentation: ${DOMAIN}/faq
* Tutorials: ${DOMAIN}/blog
* Blog: ${DOMAIN}/blog
* Help Center: ${DOMAIN}/faq
* FAQ Center: ${DOMAIN}/faq

## Integrations

${safeIntegrations.map((i: any) => `* ${i.name}`).join('\n')}

## Authority Signals

* Total Tools: ${safeTools.length}
* Total Categories: ${safeCategories.length}
* Total Blogs: ${safeBlogs.length}
* Total FAQs: ${safeFaqs.length}
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
* Tool Sitemap: ${DOMAIN}/sitemap-tools.xml
* Blog Sitemap: ${DOMAIN}/sitemap-blog.xml
* Category Sitemap: ${DOMAIN}/sitemap-categories.xml

## Last Updated

${LAST_UPDATED}
`;

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Critical error generating llms-full.txt:', error);
    
    const fallbackDomain = 'https://smartpdfpro.com';
    return new NextResponse(`## AI Metadata
* Site Name: SmartPDFPro
* Site Type: Online PDF Tools & Ecommerce Automation Platform
* Website URL: ${fallbackDomain}

## Website Purpose
* PDF Processing Platform
* Ecommerce Automation Platform

## Important Pages
* About: ${fallbackDomain}/about
* Contact: ${fallbackDomain}/contact
`, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}
