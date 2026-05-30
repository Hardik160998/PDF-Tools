import RepairTool from "@/components/tools/RepairTool";
import Link from "next/link";
import type { Metadata } from "next";
import {
  FileText, ArrowRight, HelpCircle, Star, Check, ChevronDown
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://smartpdfpro.com/';

// 1. Dynamic Metadata Export for Next.js App Router
export const metadata: Metadata = {
  title: 'Repair PDF Online Free - Fix Corrupted PDF | SmartPDFs',
  description: 'Repair corrupted PDF files online for free. Scan, recover, and rebuild broken object layout streams or cross-reference tables instantly. 100% secure local processing.',
  keywords: 'repair pdf, fix corrupted pdf, recover broken pdf, fix damaged pdf, rebuild pdf index, repair cross-reference table, free pdf repair online, smartpdfs',
  alternates: {
    canonical: `${siteUrl}/tool/repair-pdf`,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    title: 'Repair PDF Online Free - Fix Corrupted PDF | SmartPDFs',
    description: 'Repair corrupted PDF files online for free. Scan, recover, and rebuild broken object layout streams or cross-reference tables instantly. 100% secure local processing.',
    siteName: 'SmartPDFs',
    url: `${siteUrl}/tool/repair-pdf`,
    images: [
      {
        url: `${siteUrl}/img/repair-pdf-og.png`,
        width: 1200,
        height: 630,
        alt: 'Repair Corrupted PDF Online - SmartPDFs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Repair PDF Online Free - Fix Corrupted PDF | SmartPDFs',
    description: 'Repair corrupted PDF files online for free. Scan, recover, and rebuild broken object layout streams or cross-reference tables instantly. 100% secure local processing.',
    images: [`${siteUrl}/img/repair-pdf-og.png`],
  },
};

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Repair PDF Online Free",
  "url": `${siteUrl}/tool/repair-pdf`,
  "image": `${siteUrl}/img/repair-pdf-og.png`,
  "description": "Repair corrupted PDF files online for free. Scan, recover, and rebuild broken object layout streams or cross-reference tables instantly. 100% secure local processing.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires HTML5 support",
  "featureList": [
    "100% Local processing in your browser",
    "No file uploads to servers",
    "Deep-scans for corrupted structures",
    "Rebuilds broken object layout streams",
    "Fixes cross-reference table indexing errors",
    "Downloads recovered clean PDF instantly"
  ],
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": siteUrl
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Tools",
      "item": `${siteUrl}/#tools-grid`
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Repair PDF",
      "item": `${siteUrl}/tool/repair-pdf`
    }
  ]
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How can I fix a corrupted PDF file online?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simply upload your corrupted or damaged PDF to our tool. The tool runs a repair scanner locally in your browser. Once the scanning is complete, click 'Download PDF' to save your repaired file."
      }
    },
    {
      "@type": "Question",
      "name": "Are my files uploaded to a remote server during repair?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No! Our tool scans and fixes document structural index errors locally on your machine. Your data remains fully secure and confidential."
      }
    },
    {
      "@type": "Question",
      "name": "Can this tool fix all types of corrupted PDFs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It fixes structural issues like missing cross-reference headers and partially corrupted object tables. If a file is completely overwritten or empty, it cannot be rebuilt, but our scanner does its best to restore readable content."
      }
    },
    {
      "@type": "Question",
      "name": "Does repairing a PDF require credit card payment?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, our PDF repair tool is 100% free with no email signups or hidden costs."
      }
    }
  ]
};

export default function RepairPdfPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Dynamic JSON-LD structured script injections for Google Crawler */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 pt-6 sm:pt-10 pb-16">
        {/* Navigation Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <li>
              <Link href="/" className="hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-1">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5" aria-hidden="true">
              <span>/</span>
              <Link href="/#tools-grid" className="hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-1">
                Tools
              </Link>
            </li>
            <li className="flex items-center gap-1.5 text-slate-600 dark:text-slate-200" aria-current="page">
              <span>/</span>
              <span>Repair PDF</span>
            </li>
          </ol>
        </nav>

        {/* Dynamic Client Tool Component */}
        <div className="mb-16">
          <RepairTool id="repair-pdf" />
        </div>

        {/* Rich SEO Content Section */}
        <article className="space-y-16 max-w-7xl mx-auto mt-20">

          {/* Main heading and description */}
          <section className="text-center max-w-4xl mx-auto space-y-4">
            <h2 className="font-outfit text-3xl md:text-5xl font-black tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-red-950 to-red-600 dark:from-white dark:via-red-100 dark:to-red-400 uppercase">
              Repair PDF Online Free — Fast &amp; Secure
            </h2>
            <p className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              Scan, rebuild, and restore readability to your damaged or corrupted PDF files. Fast and secure local processing ensures your files never leave your device.
            </p>
          </section>

          {/* How It Works Section */}
          <section className="space-y-10">
            <div className="text-center space-y-2">
              <h3 className="font-outfit text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                How to Repair a Corrupted PDF?
              </h3>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Step-by-step restoration guide</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                {
                  step: "01",
                  title: "Upload Damaged PDF",
                  desc: "Select or drag & drop your corrupted PDF file into our repair workspace. The file loads instantly in your browser."
                },
                {
                  step: "02",
                  title: "Scan & Rebuild Structure",
                  desc: "Our scanner analyzes broken cross-reference tables, stream segments, and missing index entries locally."
                },
                {
                  step: "03",
                  title: "Download Restored File",
                  desc: "Click 'Repair Document' to run. Instantly download the recovered, clean PDF to your local drive."
                }
              ].map((item, index) => (
                <div key={index} className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-outfit text-4xl font-black text-red-500/20 group-hover:text-red-500 transition-colors duration-300">
                        {item.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-500 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <h4 className="font-outfit text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 text-slate-300 dark:text-slate-700 animate-pulse">
                      <ArrowRight size={24} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Features and Benefits Grid */}
          <section className="bg-gradient-to-tr from-white to-red-50/20 dark:from-slate-900 dark:to-slate-950 p-8 sm:p-12 rounded-[2.5rem] border border-red-100/50 dark:border-slate-800/80 space-y-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between border-b border-red-100/30 dark:border-slate-800/50 pb-8">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-widest border border-red-100 dark:border-red-900/30">
                  <Star size={12} className="fill-red-500" /> Premium Benefits
                </span>
                <h3 className="font-outfit text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  In-Browser PDF Repair Features
                </h3>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-md">
                Fast browser-based operations without queues or subscriptions. Tailor files instantly and secure privacy.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "No Server Access", desc: "Your PDF is processed inside your browser tab. Zero data uploads, zero security concerns." },
                { title: "Cross-Reference Scan", desc: "Attempts to reconstruct corrupt index lines and resolve syntax errors." },
                { title: "Format Extraction", desc: "Extracts undamaged layouts, text blocks, and vector drawings from corrupt files." },
                { title: "Clean Restored Files", desc: "Compiles recovered components into a clean layout conforming to standard PDF specs." }
              ].map((feat, i) => (
                <div key={i} className="space-y-3 p-2">
                  <div className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/25">
                    <Check size={16} className="stroke-[3]" />
                  </div>
                  <h4 className="font-outfit text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {feat.title}
                  </h4>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQs Accordion */}
          <section className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <h3 className="font-outfit text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Frequently Asked Questions
              </h3>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Repair PDF FAQs</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "How can I fix a corrupted PDF file online?",
                  a: "Simply upload your corrupted or damaged PDF to our tool. The tool runs a repair scanner locally in your browser. Once the scanning is complete, click 'Download PDF' to save your repaired file."
                },
                {
                  q: "Are my files uploaded to a remote server during repair?",
                  a: "No! Our tool scans and fixes document structural index errors locally on your machine. Your data remains fully secure and confidential."
                },
                {
                  q: "Can this tool fix all types of corrupted PDFs?",
                  a: "It fixes structural issues like missing cross-reference headers and partially corrupted object tables. If a file is completely overwritten or empty, it cannot be rebuilt, but our scanner does its best to restore readable content."
                },
                {
                  q: "Does repairing a PDF require credit card payment?",
                  a: "No, our PDF repair tool is 100% free with no email signups or hidden costs."
                }
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                    <span className="font-outfit text-sm sm:text-base font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
                      <HelpCircle size={18} className="text-red-500 shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown size={18} className="text-slate-400 transition-transform duration-300 group-open:rotate-180 shrink-0 ml-4" />
                  </summary>
                  <div className="px-6 pb-6 border-t border-slate-50 dark:border-slate-800 pt-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Internal Links/Related tools */}
          <section className="pt-10 border-t border-slate-100 dark:border-slate-800/80">
            <h3 className="font-outfit text-sm font-black text-slate-400 uppercase tracking-widest mb-6 text-center">
              Related Document Tools
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Compress PDF", path: "/tool/compress", desc: "Shrink file size locally" },
                { name: "Optimize PDF", path: "/tool/optimize-pdf", desc: "Select compression levels" },
                { name: "Split PDF", path: "/tool/split", desc: "Separate documents" },
                { name: "Merge PDF", path: "/tool/merge", desc: "Combine files in order" }
              ].map((tool, idx) => (
                <Link
                  key={idx}
                  href={tool.path}
                  className="group p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col justify-center"
                >
                  <span className="font-outfit text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">
                    {tool.name}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 font-medium leading-none">
                    {tool.desc}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
