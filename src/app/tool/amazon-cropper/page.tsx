import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from '@/components/seo/WebAppSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import Link from "next/link";
import type { Metadata } from "next";
import AmazonCropper from "@/components/tools/AmazonCropper";
import CreditGate from "@/components/credits/CreditGate";
import {
  ShoppingBag,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Crop,
  Combine,
  Info,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Star,
  Check,
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

// 1. Dynamic Metadata Export for Next.js App Router (SEO & Indexing Fix)


// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Amazon Label Cropper",
  url: `${siteUrl}/tool/amazon-cropper`,
  image: `${siteUrl}/img/amazon-cropper-og.png`,
  description:
    "Crop Amazon shipping label PDFs online for free. Automatically detect and remove even-numbered invoice pages, and arrange labels in 4-per-page layouts.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "100% local processing inside browser sandbox",
    "Invoice auto-clear deletes invoice pages instantly",
    "Precision crop protects 'Sold on' and 'ATSPL' barcode anchors",
    "2x2 grid A4 layouts or single-label thermal templates",
    "Completely secure with no file uploads",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteUrl,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Tools",
      item: `${siteUrl}/#tools-grid`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Amazon Label Cropper",
      item: `${siteUrl}/tool/amazon-cropper`,
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does the Amazon Label Cropper remove invoice pages?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool scans the PDF document structure and automatically identifies even-numbered pages which typically contain customer invoices. It strips these pages while preserving the main shipping label pages.",
      },
    },
    {
      "@type": "Question",
      name: "Are my Amazon shipping documents secure on your site?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The parsing, invoice removal, and cropping take place entirely in JavaScript in your browser sandbox. No file packets are transmitted over the internet to remote servers.",
      },
    },
    {
      "@type": "Question",
      name: "Can I layout Amazon labels for standard A4 sticker paper?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our tool arranges the cropped label sheets into a 4-per-page (2x2 grid) layout automatically, optimized for quick thermal or laser printing.",
      },
    },
  ],
};

const RELATED_TOOLS = [
  {
    id: "meesho-cropper",
    title: "Meesho Label Cropper",
    description:
      'Remove invoice section below "Total" from Meesho shipping label PDFs.',
    icon: ShoppingBag,
    gradient: "linear-gradient(135deg, #f26522, #f59e0b)",
    shadow: "rgba(242,101,34,0.3)",
    tag: "Ecommerce",
    href: "/tool/meesho-cropper",
  },
  {
    id: "meshocrop",
    title: "Meesho Crop Label (without invoice)",
    description:
      "Crop Meesho labels to keep only shipping address, return address & barcodes.",
    icon: ShoppingBag,
    gradient: "linear-gradient(135deg, #f26522, #f59e0b)",
    shadow: "rgba(242,101,34,0.3)",
    tag: "Ecommerce",
    href: "/tool/meshocrop",
  },
  {
    id: "flipkart-cropper",
    title: "Flipkart Label Cropper",
    description:
      "Smart OCR crop for Flipkart shipping labels. Keeps AWB & barcodes.",
    icon: ShoppingBag,
    gradient: "linear-gradient(135deg, #f26522, #f59e0b)",
    shadow: "rgba(242,101,34,0.3)",
    tag: "Ecommerce",
    href: "/tool/flipkart-cropper",
  },
  {
    id: "snapdeal-cropper",
    title: "Snapdeal Label Cropper",
    description:
      "Smart border detection to crop Snapdeal shipping labels perfectly.",
    icon: ShoppingBag,
    gradient: "linear-gradient(135deg, #e40046, #f59e0b)",
    shadow: "rgba(228,0,70,0.3)",
    tag: "Ecommerce",
    href: "/tool/snapdeal-cropper",
  },
  {
    id: "crop-pdf",
    title: "Crop PDF",
    description:
      "Trim margins and crop any pages of your PDF with custom margin controls.",
    icon: Crop,
    gradient: "linear-gradient(135deg, #f26522, #c2410c)",
    shadow: "rgba(242,101,34,0.3)",
    tag: "Special",
    href: "/tool/crop-pdf",
  },
  {
    id: "merge",
    title: "Merge PDF",
    description:
      "Combine multiple PDF files into one document in the order you choose.",
    icon: Combine,
    gradient: "linear-gradient(135deg, #f26522, #c2410c)",
    shadow: "rgba(242,101,34,0.3)",
    tag: "Organize",
    href: "/tool/merge",
  },
];


export function generateMetadata() {
  const id = 'amazon-cropper';
  const meta = getToolMeta(id);
  if (!meta) return { title: 'PDF Tool | SmartPDFPro' };

  const url = getToolUrl(id);
  return {
    title: `${meta.title} | SmartPDFPro`,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title: `${meta.title} | SmartPDFPro`,
      description: meta.description,
      url,
      siteName: 'SmartPDFPro',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${meta.title} | SmartPDFPro`,
      description: meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
    },
  };
}

export default function AmazonCropperPage() {
  const ACCENT = "#FF9900";

  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta('amazon-cropper');
        return meta ? (
          <>
            <WebAppSchema name={`${meta.title} – Free Online Tool`} description={meta.description} url={getToolUrl('amazon-cropper')} />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema items={[{ label: 'Tools', href: '/#tools' }, { label: meta.title, href: `/tool/amazon-cropper` }]} />
          </>
        ) : null;
      })()}

      {/* 2. Structured data scripts for search indexing */}
      
      
      

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500"
        >
          <Link
            href="/"
            className="hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1"
          >
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/tool"
            className="hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1"
          >
            Tools
          </Link>
          <span aria-hidden="true">/</span>
          <span
            className="text-slate-600 dark:text-slate-300"
            aria-current="page"
          >
            Amazon Cropper
          </span>
        </nav>

        {/* Dynamic Client Tool Component */}
        <section aria-label="Amazon Label Cropper Workspace" className="mb-16">
          <CreditGate toolName="amazon-cropper" showCounter={false}>
            <AmazonCropper id="amazon-main" />
          </CreditGate>
        </section>

        {/* Feature Grid */}
        <section
          aria-label="Tool Features"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-20"
        >
          {[
            {
              icon: ShoppingBag,
              title: "Invoice Auto-Clear",
              desc: "Even-numbered invoice pages (2,4,6...) are detected and removed instantly.",
            },
            {
              icon: Zap,
              title: "High Precision",
              desc: "Anchor-based cropping ensures 'Sold on' and 'ATSPL' details are never cut off.",
            },
            {
              icon: ShieldCheck,
              title: "Warehouse Ready",
              desc: "Optimized for thermal printers and fast batch processing in busy hubs.",
            },
          ].map((feat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feat.icon className="text-[#FF9900]" size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                {feat.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </section>

        {/* Guidelines */}
        <section
          aria-label="Guidelines and Guide"
          className="bg-[#FF9900]/5 dark:bg-[#FF9900]/10 border border-[#FF9900]/20 rounded-3xl p-8 sm:p-12 mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="text-[#FF9900]" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              How to use
            </h2>
          </div>
          <div className="space-y-4 max-w-3xl">
            <p className="text-slate-700 dark:text-slate-300 font-medium">
              1. Upload your Amazon Label PDF batch.
            </p>
            <p className="text-slate-700 dark:text-slate-300 font-medium">
              2. The tool identifies Labels and automatically filters out the
              Invoice pages.
            </p>
            <p className="text-slate-700 dark:text-slate-300 font-medium">
              3. Labels are arranged in a 4-per-page (2x2) A4 grid for maximum
              efficiency.
            </p>
            <p className="text-slate-700 dark:text-slate-300 font-medium">
              4. Click "Extract" to get your print-ready PDF file.
            </p>
          </div>
        </section>

        {/* 4. Complete SEO Optimized Content Section */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">
          <div className="mb-16 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-orange-500/10 dark:bg-orange-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-orange-600 dark:from-white dark:via-slate-200 dark:to-orange-500 bg-clip-text text-transparent">
              Amazon Shipping Label Cropper <br />
              <span className="text-orange-500 dark:text-orange-400">
                100% Free &amp; Offline
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Instantly extract shipping label pages from Amazon seller PDF
              print sheets. Detect and clear billing/invoice pages automatically
              without cloud servers.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is Amazon Cropper */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is the Amazon Label Cropper?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  Amazon downloads generate mixed PDF streams containing
                  shipping labels (AWB tracking details) and billing pages.
                  Printing these on a label roll results in wasted paper rolls.
                  The Amazon Label Cropper checks text anchors such as "Sold on"
                  and "ATSPL", detects page sequences, and deletes unnecessary
                  invoice documents automatically.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  Our algorithm runs{" "}
                  <strong className="text-orange-500 font-black">
                    100% locally inside your web browser sandbox
                  </strong>
                  . Since no file bytes are sent to cloud storage, your buyer
                  credentials and delivery details remain absolutely secure.
                </p>
              </div>
            </div>

            {/* How to use step grid */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                  <ArrowRight size={24} />
                </span>
                How to Crop Amazon Labels in 3 Easy Steps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                {[
                  {
                    step: "01",
                    title: "Select PDFs",
                    desc: "Drag and drop your Amazon PDF sheets into the crop area.",
                  },
                  {
                    step: "02",
                    title: "Smart Auto-Clear",
                    desc: "The engine automatically separates labels and deletes invoice pages.",
                  },
                  {
                    step: "03",
                    title: "Download PDF",
                    desc: "Click Crop PDF. Download your clean thermal-aligned files instantly.",
                  },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="relative z-10 flex flex-col items-center text-center space-y-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white font-black flex items-center justify-center shadow-lg shadow-orange-500/20">
                      {s.step}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase">
                      {s.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-8 max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Can I print in thermal 4x6 roll format?",
                    a: "Yes! The output PDF can be customized in scale to print on standard 4x6 thermal paper roll stickers or grouped in 2x2 grids for standard A4 labels.",
                  },
                  {
                    q: "What types of Amazon labels are supported?",
                    a: "We support ATSPL, Easy Ship, Self Ship, and FBA labels. The parser automatically detects various document headers.",
                  },
                  {
                    q: "Will this tool affect tracking barcode readability?",
                    a: "No. The system crops by shifting page view boundaries without modifying vectors, keeping tracking tags and barcodes 100% sharp.",
                  },
                ].map((faq, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                      <span className="font-outfit text-sm sm:text-base font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
                        <HelpCircle
                          size={18}
                          className="text-orange-500 shrink-0"
                        />
                        {faq.q}
                      </span>
                      <ChevronDown
                        size={18}
                        className="text-slate-400 transition-transform duration-300 group-open:rotate-180 shrink-0 ml-4"
                      />
                    </summary>
                    <div className="px-6 pb-6 border-t border-slate-50 dark:border-slate-800 pt-4">
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Related Tools Navigation Links */}
            <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
              <h3 className="font-outfit text-sm font-black text-slate-400 uppercase tracking-widest mb-6 text-center">
                Related Ecommerce &amp; PDF Tools
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {RELATED_TOOLS.map((tool, idx) => (
                  <Link
                    key={idx}
                    href={tool.href}
                    className="group p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col justify-center"
                  >
                    <span className="font-outfit text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-orange-500 transition-colors">
                      {tool.title}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium leading-none">
                      {tool.description}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
