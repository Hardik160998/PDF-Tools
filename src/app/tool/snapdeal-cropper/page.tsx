import Link from "next/link";
import type { Metadata } from "next";
import SnapdealCropper from "@/components/tools/SnapdealCropper";
import CreditGate from "@/components/credits/CreditGate";
import {
  ShoppingBag, Upload, Download, Wand2, Crop, Combine, Zap, Info, ArrowRight, HelpCircle, ChevronDown, Star, Check
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "SITE_OFFICIAL_DOMAIN";

// 1. Dynamic Metadata Export for Next.js App Router (SEO & Indexing Fix)
export const metadata: Metadata = {
  title: "Snapdeal Label Cropper Free | Auto Border Crop & Sort | SmartPDFs",
  description: "Crop Snapdeal shipping label PDFs online for free. Automatically detects outer borders, highlights barcodes, quantities & addresses. 100% private in-browser tool.",
  keywords: "snapdeal cropper, crop snapdeal labels, snapdeal label cropper free, border detection label crop, thermal label cropper, smartpdfs",
  alternates: {
    canonical: `${siteUrl}/tool/snapdeal-cropper`,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    title: "Snapdeal Label Cropper Free | Auto Border Crop & Sort | SmartPDFs",
    description: "Crop Snapdeal shipping label PDFs online for free. Automatically detects outer borders, highlights barcodes, quantities & addresses. 100% private in-browser tool.",
    siteName: "SmartPDFs Plus",
    url: `${siteUrl}/tool/snapdeal-cropper`,
    images: [
      {
        url: `${siteUrl}/img/snapdeal-cropper-og.png`,
        width: 1200,
        height: 630,
        alt: "Snapdeal Label Cropper - SmartPDFs Plus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Snapdeal Label Cropper Free | Auto Border Crop & Sort | SmartPDFs",
    description: "Crop Snapdeal shipping label PDFs online for free. Automatically detects outer borders, highlights barcodes, quantities & addresses. 100% private in-browser tool.",
    images: [`${siteUrl}/img/snapdeal-cropper-og.png`],
  },
};

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Snapdeal Label Cropper",
  "url": `${siteUrl}/tool/snapdeal-cropper`,
  "image": `${siteUrl}/img/snapdeal-cropper-og.png`,
  "description": "Crop Snapdeal shipping label PDFs online for free. Automatically detects outer borders, highlights barcodes, quantities & addresses.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires HTML5 support",
  "featureList": [
    "100% browser-local processing for file privacy",
    "Smart border detection identifies outer barcode guides",
    "Highlights barcodes and buyer address boundaries",
    "Supports multiple PDF document batch uploads",
    "Clean export to PDF or single-page label segments"
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
      "name": "Snapdeal Label Cropper",
      "item": `${siteUrl}/tool/snapdeal-cropper`
    }
  ]
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does the Snapdeal Cropper detect borders?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The border detection engine parses the text coordinates and layout blocks. It looks for anchors like 'Snapdeal Logo', barcode guides, and address frames to adjust the crop outline."
      }
    },
    {
      "@type": "Question",
      "name": "Are my files uploaded to any servers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. The entire process takes place 100% locally in your web browser. No document files are ever uploaded or transmitted over the network."
      }
    },
    {
      "@type": "Question",
      "name": "Does the cropper prevent text cut-off during printing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The algorithm includes standard padding (10-25px) around all detected label lines to verify zero text cut-off when printing."
      }
    }
  ]
};

const STEPS = [
  { icon: Upload, title: 'Upload Snapdeal Label', desc: 'Drop one or multiple Snapdeal shipping label PDFs. Processing happens instantly in your browser.' },
  { icon: Wand2, title: 'Smart Border Detection', desc: 'Automatically detects the outer borders of the label, protecting barcodes, addresses, and quantity sections.' },
  { icon: Download, title: 'Download Perfect Crop', desc: 'Get perfectly sized PDF labels ready for thermal or A4 printing without any cut-off text.' },
];

const RELATED = [
  { id: 'flipkart-cropper', title: 'Flipkart Label Cropper', description: 'Smart OCR crop for Flipkart shipping labels. Keeps AWB & barcodes.', icon: ShoppingBag, gradient: 'linear-gradient(135deg, #f26522, #f59e0b)', shadow: 'rgba(242,101,34,0.3)', tag: 'Ecommerce', href: '/tool/flipkart-cropper' },
  { id: 'meesho-cropper', title: 'Meesho Label Cropper', description: 'Remove invoice section below "Total" from Meesho shipping label PDFs.', icon: ShoppingBag, gradient: 'linear-gradient(135deg, #f26522, #f59e0b)', shadow: 'rgba(242,101,34,0.3)', tag: 'Ecommerce', href: '/tool/meesho-cropper' },
  { id: 'amazon-cropper', title: 'Amazon Label Cropper', description: 'Extract Amazon shipping labels and automatically remove invoice pages.', icon: ShoppingBag, gradient: 'linear-gradient(135deg, #FF9900, #f59e0b)', shadow: 'rgba(255,153,0,0.3)', tag: 'Ecommerce', href: '/tool/amazon-cropper' },
  { id: 'crop-pdf', title: 'Crop PDF', description: 'Trim margins and crop any pages of your PDF with custom margin controls.', icon: Crop, gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)', tag: 'Special', href: '/tool/crop-pdf' },
  { id: 'merge', title: 'Merge PDF', description: 'Combine multiple PDF files into one document in the order you choose.', icon: Combine, gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)', tag: 'Organize', href: '/tool/merge' },
  { id: 'compress', title: 'Compress PDF', description: 'Reduce PDF file size while keeping text sharp and content intact.', icon: Zap, gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)', tag: 'Optimize', href: '/tool/compress' },
];

export default function SnapdealCropperPage() {
  const ACCENT = '#E40046';

  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* 2. Structured data scripts for search indexing */}
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

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          <Link href="/" className="hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/tool" className="hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1">
            Tools
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-600 dark:text-slate-300" aria-current="page">Snapdeal Cropper</span>
        </nav>

        {/* Dynamic Client Tool Component */}
        <section aria-label="Snapdeal Label Cropper Workspace" className="mb-16">
          <CreditGate toolName="snapdeal-cropper" showCounter={false}>
            <SnapdealCropper id="snapdeal-cropper" />
          </CreditGate>
        </section>

        {/* How It Works Quick View */}
        <section aria-label="Tool Steps Overview" className="py-16 bg-white/60 dark:bg-slate-900/60 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm mb-20 animate-in fade-in duration-500">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center uppercase">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((s, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                  <div className="inline-flex p-4 rounded-2xl mb-4 text-white" style={{ background: `${ACCENT}22`, color: ACCENT }}>
                    <s.icon size={28} />
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Step {i + 1}</div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detection Logic Overview */}
        <section aria-label="Detection Logic" className="py-16 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800/50 mb-20">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center uppercase">Snapdeal Detection Logic</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Top Anchor', value: 'Snapdeal Logo / Header', color: '#e40046', desc: 'Crop includes logo with safe white margin' },
                { label: 'Bottom Anchor', value: 'Reference Barcode', color: '#10b981', desc: 'Crop extends safely below the bottom reference barcode' },
                { label: 'Left Anchor', value: 'Shipped From', color: '#3b82f6', desc: 'Crop starts safely to the left of the address border' },
                { label: 'Right Anchor', value: 'Total Items', color: '#f59e0b', desc: 'Crop includes the quantity number & right border' },
              ].map(a => (
                <div key={a.label} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md text-xs font-black" style={{ background: a.color }}>
                    {a.label.split(' ')[0][0]}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-sm mb-0.5">{a.label}</h3>
                    <code className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: `${a.color}18`, color: a.color }}>{a.value}</code>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed font-medium">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                ⚡ Safe Padding: The engine adds 10-25px of safe white margin around all detected borders to ensure zero text cut-off during printing.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Complete SEO Optimized Content Section */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">

          <div className="mb-16 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-orange-500/10 dark:bg-orange-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-orange-600 dark:from-white dark:via-slate-200 dark:to-orange-500 bg-clip-text text-transparent">
              Snapdeal Shipping Label Cropper <br />
              <span className="text-orange-500 dark:text-orange-400">100% Free &amp; Offline</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Extract printable shipping labels from Snapdeal PDF invoices. Detect outer barcode boundaries and crop sheets locally in your browser memory for absolute privacy.
            </p>
          </div>

          <article className="space-y-16">

            {/* What is Snapdeal Cropper */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is the Snapdeal Label Cropper?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  When fulfilling orders on Snapdeal, downloaded PDF packets include large invoices along with the thermal-sized labels. Processing these directly wastes ink and sticker space. The Snapdeal Label Cropper automatically scans the PDF, locates borders such as logo graphics and tracking barcodes, and trims the exact logistics layout.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  Our algorithm processes everything <strong className="text-orange-500 font-black">locally inside your browser engine</strong>. No file uploads or internet transmissions occur, keeping customer data completely private.
                </p>
              </div>
            </div>

            {/* How to use */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500"><ArrowRight size={24} /></span>
                How to Crop Snapdeal Labels in 3 Steps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                {[
                  { step: "01", title: "Upload PDF", desc: "Drag and drop your Snapdeal PDF documents into the crop canvas above." },
                  { step: "02", title: "Auto Border Detection", desc: "The engine automatically locates the barcodes, logo, and address boundaries." },
                  { step: "03", title: "Download", desc: "Click Crop PDF. Get a printable, clean PDF document instantly." }
                ].map((s, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white font-black flex items-center justify-center shadow-lg shadow-orange-500/20">{s.step}</div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase">{s.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">{s.desc}</p>
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
                    q: "Does this cropper handle multiple PDFs at once?",
                    a: "Yes! You can upload multiple PDFs or multi-page files. The border detection parses and crops them all in batch mode."
                  },
                  {
                    q: "Is there any padding added to the crop areas?",
                    a: "Yes. The engine automatically adds standard white padding (10-25px) around borders to ensure zero scanner clipping when printing."
                  },
                  {
                    q: "Does this tool work offline?",
                    a: "Yes. Since the processing runs entirely client-side using JavaScript, you can keep the web application tab open and crop files even without an active internet connection."
                  }
                ].map((faq, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                      <span className="font-outfit text-sm sm:text-base font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
                        <HelpCircle size={18} className="text-orange-500 shrink-0" />
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
            </div>

            {/* Related Tools Navigation Links */}
            <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
              <h3 className="font-outfit text-sm font-black text-slate-400 uppercase tracking-widest mb-6 text-center">
                Related Ecommerce &amp; PDF Tools
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {RELATED.map((tool, idx) => (
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
