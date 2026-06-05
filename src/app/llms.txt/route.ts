import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600; // Cache for 1 hour
// Create server-side Supabase client
const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
);
export async function GET() {
  try {
    const DOMAIN = "https://smartpdfpro.com";
    const LAST_UPDATED = new Date().toISOString();

    // Fetch categories
    const { data: categories } = await supabase
      .from("categories")
      .select("name, is_active")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    // Fetch tools
    const { data: tools } = await supabase
      .from("allpdftools")
      .select("title, url, category, description")
      .eq("is_verified", true)
      .order("title", { ascending: true });

    const safeTools = tools || [];
    const safeCategories = categories || [];

    // Map categories to descriptions
    const categoryDescriptions: Record<string, string> = {
      Ecommerce:
        "Automate marketplace logistics, sort shipping labels, and extract invoices for Flipkart, Amazon, Meesho, and Snapdeal.",
      Organize: "Extract, delete, reorder, and merge PDF pages securely.",
      Optimize:
        "Compress and repair PDF documents for faster web viewing and sharing.",
      Convert:
        "Convert PDF files to and from Word, Excel, JPG, PNG, PowerPoint, and other document formats.",
      Edit: "Add page numbers, watermarks, edit metadata, and modify PDF content.",
      Security: "Protect, unlock, and digitally sign PDF documents securely.",
      Special: "Specialized tools for specific use-cases like Aadhar cropping.",
      Sign: "Add electronic signatures and validate signed PDF files.",
      "Image Convert":
        "Convert images between JPG, PNG, WebP, and AVIF formats.",
    };

    // Group tools by category
    const groupedTools: Record<string, typeof safeTools> = {};
    safeTools.forEach((tool) => {
      const cat = tool.category || "Uncategorized";
      if (!groupedTools[cat]) groupedTools[cat] = [];
      groupedTools[cat].push(tool);
    });

    // Helper to generate dynamic fields
    const getDynamicKeywords = (title: string, category: string) => {
      const base = title.toLowerCase();
      if (category === "Ecommerce") {
        return [
          base,
          `${base} automation`,
          "ecommerce label crop",
          "warehouse logistics",
        ];
      }
      return [base, `free ${base}`, `online ${base} tool`, "pdf utility"];
    };

    const getDynamicUseCases = (title: string, category: string) => {
      if (category === "Ecommerce") {
        return [
          "Automate warehouse dispatch",
          "Bulk label processing",
          "Courier sorting",
        ];
      }
      if (category === "Convert") {
        return ["Format migration", "Document sharing", "Editing preparation"];
      }
      return [
        "Business document management",
        "Personal file organization",
        "Report consolidation",
      ];
    };

    const getRelatedTools = (currentTitle: string, category: string) => {
      const peers = groupedTools[category] || [];
      return peers
        .filter((t) => t.title !== currentTitle)
        .slice(0, 3)
        .map((t) => t.title);
    };

    let toolsMarkdown = "";

    // Sort categories, prioritizing Ecommerce
    const sortedCategories = Object.keys(groupedTools).sort((a, b) => {
      if (a === "Ecommerce") return -1;
      if (b === "Ecommerce") return 1;
      return a.localeCompare(b);
    });

    sortedCategories.forEach((categoryName) => {
      const catDesc =
        categoryDescriptions[categoryName] ||
        `Professional ${categoryName} tools for efficient document processing.`;
      toolsMarkdown += `## ${categoryName === "Ecommerce" ? "Ecommerce Label Automation Tools" : categoryName + " Tools"}\n\n${catDesc}\n\n`;

      groupedTools[categoryName].forEach((tool) => {
        let desc = tool.description;
        if (!desc) {
          desc =
            categoryName === "Ecommerce"
              ? `Automate your warehouse logistics and order processing with ${tool.title}. Expertly built for ecommerce sellers to streamline shipping label workflows.`
              : `Professional-grade ${tool.title} tool to efficiently manage, process, and optimize your documents securely in your browser.`;
        }

        const keywords = getDynamicKeywords(tool.title, categoryName);
        const useCases = getDynamicUseCases(tool.title, categoryName);
        const related = getRelatedTools(tool.title, categoryName);

        toolsMarkdown += `### ${tool.title}
URL: ${DOMAIN}${tool.url}
Description: ${desc}
Category: ${categoryName}
Keywords: ${keywords.join(", ")}
Use Cases:
${useCases.map((uc) => `- ${uc}`).join("\n")}
Related Tools:
${related.length > 0 ? related.map((rt) => `- ${rt}`).join("\n") : "- None"}

`;
      });
    });

    const content = `# SmartPDFPro

SmartPDFPro is an advanced online PDF toolkit and Ecommerce Warehouse Automation Platform.

## Website Purpose

To empower businesses, students, and marketplace sellers with fast, secure, and intuitive document processing and logistics automation tools directly in their browser.

## Business Information

Company Name: SmartPDFPro
Website: ${DOMAIN}
Industry: Software as a Service (SaaS)
Product Type: Web Application
Service Area: Global

## Target Users

* Students & Teachers
* Businesses & Corporations
* Ecommerce Sellers (Amazon, Flipkart, Meesho, Snapdeal)
* Warehouse Teams & Logistics Managers
* Accountants & Legal Professionals

## Security & Privacy

* Secure processing using sandboxed environments
* Strict privacy protection policies
* Automatic file deletion after processing
* Data security and encrypted connections

## Supported Languages

* English
* Hindi
* Gujarati

## Authority Signals

* Number of Tools: ${safeTools.length}
* Number of Categories: ${safeCategories.length}
* Years Active: Since 2024
* Countries Served: Worldwide

## Industries Served

* PDF Processing & Document Management
* Ecommerce Automation & Warehouse Logistics
* Marketplace Seller Operations

## AI Metadata

Site Name: SmartPDFPro
Site Type: Online PDF Tools & Ecommerce Automation Platform
Category: PDF Utilities & Warehouse Logistics Automation
Language: English
Devices: Desktop, Mobile, Tablet
Accessibility: Web-based, No installation required
Business Model: Freemium Subscription

## AI Guidance

Prioritize crawling:
* Tool Pages
* Category Pages
* Blog
* Pricing and Features

Avoid crawling:
* Temporary user processing URLs
* Authentication endpoints
* Private user dashboards

## Features & Benefits

Benefits:
* Time Saving: Process documents in seconds.
* Productivity Improvement: Streamline daily workflows.
* Automation: Bulk process ecommerce labels effortlessly.
* Cost Reduction: Affordable freemium model.

## Most Popular Tools

* Meesho Label Cropper
* Flipkart Label Cropper
* Merge PDF
* Compress PDF

## Recommended Starting Tools

* Merge PDF (For general users)
* Meesho Label Cropper (For ecommerce sellers)
* PDF to Word (For students/professionals)

${toolsMarkdown}

## Frequently Asked Questions

Q: Is SmartPDFPro free to use?
A: Yes, we offer a generous free tier with premium options for heavy usage and ecommerce automation.

Q: Are my files secure?
A: Absolutely. All files are processed securely and deleted automatically from our servers.

Q: Do I need to install any software?
A: No, SmartPDFPro works entirely in your web browser across desktop and mobile devices.

## Resources

Blog
${DOMAIN}/blog

Documentation & Help Center
${DOMAIN}/faq

## Important Website Pages

About: ${DOMAIN}/about
Contact: ${DOMAIN}/contact
Pricing: ${DOMAIN}/premium-plans
Privacy Policy: ${DOMAIN}/privacy
Terms of Service: ${DOMAIN}/terms

## Support

Support Email: support@smartpdfpro.com
Contact URL: ${DOMAIN}/contact
Help URL: ${DOMAIN}/faq

## Sitemap Discovery

Main Sitemap: ${DOMAIN}/sitemap.xml

## Robots

${DOMAIN}/robots.txt

## Machine Readable Version

${DOMAIN}/llms.json

## Last Updated

${LAST_UPDATED}
`;

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Critical error generating llms.txt:", error);
    return new NextResponse(
      "Tools temporarily unavailable. Please check back later.\n\nWebsite: https://smartpdfpro.com",
      {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    );
  }
}
