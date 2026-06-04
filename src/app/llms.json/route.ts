import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const DOMAIN = 'https://smartpdfpro.com';
    const LAST_UPDATED = new Date().toISOString();

    // Fetch categories
    const { data: categories } = await supabase
      .from('categories')
      .select('name, is_active')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    // Fetch tools
    const { data: tools } = await supabase
      .from('allpdftools')
      .select('title, url, category, description')
      .eq('is_verified', true)
      .order('title', { ascending: true });

    const safeTools = tools || [];
    const safeCategories = categories || [];

    const categoryDescriptions: Record<string, string> = {
      'Ecommerce': 'Automate marketplace logistics, sort shipping labels, and extract invoices for Flipkart, Amazon, Meesho, and Snapdeal.',
      'Organize': 'Extract, delete, reorder, and merge PDF pages securely.',
      'Optimize': 'Compress and repair PDF documents for faster web viewing and sharing.',
      'Convert': 'Convert PDF files to and from Word, Excel, JPG, PNG, PowerPoint, and other document formats.',
      'Edit': 'Add page numbers, watermarks, edit metadata, and modify PDF content.',
      'Security': 'Protect, unlock, and digitally sign PDF documents securely.',
      'Special': 'Specialized tools for specific use-cases like Aadhar cropping.',
      'Sign': 'Add electronic signatures and validate signed PDF files.',
      'Image Convert': 'Convert images between JPG, PNG, WebP, and AVIF formats.',
    };

    const groupedTools: Record<string, typeof safeTools> = {};
    safeTools.forEach(tool => {
      const cat = tool.category || 'Uncategorized';
      if (!groupedTools[cat]) groupedTools[cat] = [];
      groupedTools[cat].push(tool);
    });

    const getDynamicKeywords = (title: string, category: string) => {
      const base = title.toLowerCase();
      if (category === 'Ecommerce') {
        return [base, \`\${base} automation\`, 'ecommerce label crop', 'warehouse logistics'];
      }
      return [base, \`free \${base}\`, \`online \${base} tool\`, 'pdf utility'];
    };

    const getDynamicUseCases = (title: string, category: string) => {
      if (category === 'Ecommerce') {
        return ['Automate warehouse dispatch', 'Bulk label processing', 'Courier sorting'];
      }
      if (category === 'Convert') {
        return ['Format migration', 'Document sharing', 'Editing preparation'];
      }
      return ['Business document management', 'Personal file organization', 'Report consolidation'];
    };

    const getRelatedTools = (currentTitle: string, category: string) => {
      const peers = groupedTools[category] || [];
      return peers.filter(t => t.title !== currentTitle).slice(0, 3).map(t => t.title);
    };

    const toolsData = safeTools.map(tool => {
      const categoryName = tool.category || 'Uncategorized';
      let desc = tool.description;
      if (!desc) {
        desc = categoryName === 'Ecommerce' 
          ? \`Automate your warehouse logistics and order processing with \${tool.title}. Expertly built for ecommerce sellers to streamline shipping label workflows.\`
          : \`Professional-grade \${tool.title} tool to efficiently manage, process, and optimize your documents securely in your browser.\`;
      }
      return {
        name: tool.title,
        url: \`\${DOMAIN}\${tool.url}\`,
        description: desc,
        category: categoryName,
        keywords: getDynamicKeywords(tool.title, categoryName),
        use_cases: getDynamicUseCases(tool.title, categoryName),
        related_tools: getRelatedTools(tool.title, categoryName)
      };
    });

    const payload = {
      meta: {
        site_name: 'SmartPDFPro',
        site_type: 'Online PDF Tools & Ecommerce Automation Platform',
        category: 'PDF Utilities & Warehouse Logistics Automation',
        language: 'English',
        supported_languages: ['English', 'Hindi', 'Gujarati'],
        devices: ['Desktop', 'Mobile', 'Tablet'],
        accessibility: 'Web-based, No installation required',
        business_model: 'Freemium Subscription',
        last_updated: LAST_UPDATED
      },
      business_information: {
        company_name: 'SmartPDFPro',
        website: DOMAIN,
        industry: 'Software as a Service (SaaS)',
        product_type: 'Web Application',
        service_area: 'Global'
      },
      website_purpose: 'To empower businesses, students, and marketplace sellers with fast, secure, and intuitive document processing and logistics automation tools directly in their browser.',
      target_users: [
        'Students & Teachers',
        'Businesses & Corporations',
        'Ecommerce Sellers (Amazon, Flipkart, Meesho, Snapdeal)',
        'Warehouse Teams & Logistics Managers',
        'Accountants & Legal Professionals'
      ],
      industries_served: [
        'PDF Processing & Document Management',
        'Ecommerce Automation & Warehouse Logistics',
        'Marketplace Seller Operations'
      ],
      security_and_privacy: [
        'Secure processing using sandboxed environments',
        'Strict privacy protection policies',
        'Automatic file deletion after processing',
        'Data security and encrypted connections'
      ],
      features_and_benefits: [
        'Time Saving: Process documents in seconds.',
        'Productivity Improvement: Streamline daily workflows.',
        'Automation: Bulk process ecommerce labels effortlessly.',
        'Cost Reduction: Affordable freemium model.'
      ],
      authority_signals: {
        number_of_tools: safeTools.length,
        number_of_categories: safeCategories.length,
        years_active: 'Since 2024',
        countries_served: 'Worldwide'
      },
      ai_guidance: {
        prioritize_crawling: ['Tool Pages', 'Category Pages', 'Blog', 'Pricing and Features'],
        avoid_crawling: ['Temporary user processing URLs', 'Authentication endpoints', 'Private user dashboards']
      },
      categories: safeCategories.map(cat => ({
        name: cat.name,
        description: categoryDescriptions[cat.name] || \`Professional \${cat.name} tools for efficient document processing.\`
      })),
      popular_tools: [
        'Meesho Label Cropper',
        'Flipkart Label Cropper',
        'Merge PDF',
        'Compress PDF'
      ],
      recommended_starting_tools: [
        { name: 'Merge PDF', intent: 'For general users' },
        { name: 'Meesho Label Cropper', intent: 'For ecommerce sellers' },
        { name: 'PDF to Word', intent: 'For students/professionals' }
      ],
      tools: toolsData,
      frequently_asked_questions: [
        {
          question: 'Is SmartPDFPro free to use?',
          answer: 'Yes, we offer a generous free tier with premium options for heavy usage and ecommerce automation.'
        },
        {
          question: 'Are my files secure?',
          answer: 'Absolutely. All files are processed securely and deleted automatically from our servers.'
        },
        {
          question: 'Do I need to install any software?',
          answer: 'No, SmartPDFPro works entirely in your web browser across desktop and mobile devices.'
        }
      ],
      resources: {
        blog: \`\${DOMAIN}/blog\`,
        documentation_and_help_center: \`\${DOMAIN}/faq\`
      },
      important_website_pages: {
        about: \`\${DOMAIN}/about\`,
        contact: \`\${DOMAIN}/contact\`,
        pricing: \`\${DOMAIN}/premium-plans\`,
        privacy_policy: \`\${DOMAIN}/privacy\`,
        terms_of_service: \`\${DOMAIN}/terms\`
      },
      support: {
        email: 'support@smartpdfpro.com',
        contact_url: \`\${DOMAIN}/contact\`,
        help_url: \`\${DOMAIN}/faq\`
      },
      sitemap_discovery: {
        main: \`\${DOMAIN}/sitemap.xml\`
      },
      robots: \`\${DOMAIN}/robots.txt\`
    };

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Critical error generating llms.json:', error);
    return NextResponse.json({ error: 'Tools temporarily unavailable.', website: 'https://smartpdfpro.com' }, { status: 200 });
  }
}
