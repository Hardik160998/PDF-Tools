import OptimizePdf from "@/components/tools/OptimizePdf";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Zap, FileText, ArrowRight, HelpCircle, Star, Check, ChevronDown
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://smartpdfpro.com/';

// 1. Dynamic Metadata Export for Next.js App Router
export const metadata: Metadata = {
  title: 'Optimize PDF Online Free - Smart PDF Compression | SmartPDFs',
  description: 'Optimize PDF files online for free. Adjust image quality and layouts stream metadata to compress files to your target size. 100% secure local browser processing.',
  keywords: 'optimize pdf, compress pdf, reduce pdf size, pdf optimizer online, free pdf optimizer, local pdf compress, smartpdfs',
  alternates: {
    canonical: `${siteUrl}/tool/optimize-pdf`,
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
    title: 'Optimize PDF Online Free - Smart PDF Compression | SmartPDFs',
    description: 'Optimize PDF files online for free. Adjust image quality and layouts stream metadata to compress files to your target size. 100% secure local browser processing.',
    siteName: 'SmartPDFs',
    url: `${siteUrl}/tool/optimize-pdf`,
    images: [
      {
        url: `${siteUrl}/img/optimize-pdf-og.png`,
        width: 1200,
        height: 630,
        alt: 'Optimize PDF Documents Online - SmartPDFs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Optimize PDF Online Free - Smart PDF Compression | SmartPDFs',
    description: 'Optimize PDF files online for free. Adjust image quality and layouts stream metadata to compress files to your target size. 100% secure local browser processing.',
    images: [`${siteUrl}/img/optimize-pdf-og.png`],
  },
};

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Optimize PDF Online Free",
  "url": `${siteUrl}/tool/optimize-pdf`,
  "image": `${siteUrl}/img/optimize-pdf-og.png`,
  "description": "Optimize PDF files online for free. Adjust image quality and layouts stream metadata to compress files to your target size. 100% secure local browser processing.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires HTML5 support",
  "featureList": [
    "100% Local processing in your browser",
    "No file uploads to servers",
    "Smart image downsampling and re-encoding",
    "Selectable compression levels with quality preview",
    "Cleans layout structures and objects meta streams",
    "Fast in-browser optimization runs"
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
      "name": "Optimize PDF",
      "item": `${siteUrl}/tool/optimize-pdf`
    }
  ]
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How can I optimize and compress a PDF file?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Upload your PDF. Select your desired compression level (Extreme, Recommended, or Low). Click 'Optimize PDF' to run the scanner and download the optimized PDF instantly."
      }
    },
    {
      "@type": "Question",
      "name": "Is my data secure when using the PDF optimizer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, absolutely! The optimization runs 100% locally in your web browser. No files are uploaded to remote servers, securing your confidential documents completely."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between Compress PDF and Optimize PDF?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Compress PDF optimizes index data and stream layouts without changing image quality (lossless). Optimize PDF downsamples and re-compresses embedded images (lossy), yielding much smaller files for graphic-heavy documents."
      }
    },
    {
      "@type": "Question",
      "name": "Is this tool free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, our PDF optimizer is 100% free with no watermarks or email signups required."
      }
    }
  ]
};

export default function OptimizePdfPage() {
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
              <Link href="/" className="hover:text-emerald-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5" aria-hidden="true">
              <span>/</span>
              <Link href="/#tools-grid" className="hover:text-emerald-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1">
                Tools
              </Link>
            </li>
            <li className="flex items-center gap-1.5 text-slate-600 dark:text-slate-200" aria-current="page">
              <span>/</span>
              <span>Optimize PDF</span>
            </li>
          </ol>
        </nav>

        {/* Dynamic Client Tool Component */}
        <div className="mb-16">
          <OptimizePdf id="optimize-pdf" />
        </div>

        {/* Rich SEO Content Section */}
        <article className="space-y-16 max-w-7xl mx-auto mt-20">

          {/* Main heading and description */}
          <section className="text-center max-w-4xl mx-auto space-y-4">
            <h2 className="font-outfit text-3xl md:text-5xl font-black tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-emerald-950 to-emerald-600 dark:from-white dark:via-emerald-100 dark:to-emerald-400 uppercase">
              Optimize PDF Files Online — Free &amp; Secure
            </h2>
            <p className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              Compress images and clean document streams to reduce your PDF file size. Tailor compression levels with local browser execution to ensure maximum safety.
            </p>
          </section>

          {/* How It Works Section */}
          <section className="space-y-10">
            <div className="text-center space-y-2">
              <h3 className="font-outfit text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                How to Optimize a PDF Document?
              </h3>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Step-by-step optimization guide</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                {
                  step: "01",
                  title: "Upload Document",
                  desc: "Select or drag & drop your PDF file into our optimizer workspace. The file loads instantly in your browser."
                },
                {
                  step: "02",
                  title: "Select Optimization Level",
                  desc: "Choose from Extreme, Recommended, or Low compression levels depending on your quality needs."
                },
                {
                  step: "03",
                  title: "Download Optimized PDF",
                  desc: "Click 'Optimize PDF' to run. Instantly download the smaller, compressed PDF to your local drive."
                }
              ].map((item, index) => (
                <div key={index} className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-outfit text-4xl font-black text-emerald-500/20 group-hover:text-emerald-500 transition-colors duration-300">
                        {item.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center font-bold text-sm">
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
          <section className="bg-gradient-to-tr from-white to-emerald-50/20 dark:from-slate-900 dark:to-slate-950 p-8 sm:p-12 rounded-[2.5rem] border border-emerald-100/50 dark:border-slate-800/80 space-y-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between border-b border-emerald-100/30 dark:border-slate-800/50 pb-8">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/30">
                  <Star size={12} className="fill-emerald-500" /> Premium Benefits
                </span>
                <h3 className="font-outfit text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  In-Browser PDF Optimization Features
                </h3>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-md">
                Fast browser-based operations without queues or subscriptions. Tailor files instantly and secure privacy.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "No Server Access", desc: "Your PDF is processed inside your browser tab. Zero data uploads, zero security concerns." },
                { title: "Variable Compression", desc: "Balance file size and visual fidelity by selecting from multiple levels." },
                { title: "Image Downsampling", desc: "Downsamples embedded images to 72-150 DPI to reduce size without sacrificing legibility." },
                { title: "Clean object streams", desc: "Clears metadata nodes and structures layout streams to standard PDF formats." }
              ].map((feat, i) => (
                <div key={i} className="space-y-3 p-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
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
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Optimize PDF FAQs</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "How can I optimize and compress a PDF file?",
                  a: "Upload your PDF. Select your desired compression level (Extreme, Recommended, or Low). Click 'Optimize PDF' to run the scanner and download the optimized PDF instantly."
                },
                {
                  q: "Is my data secure when using the PDF optimizer?",
                  a: "Yes, absolutely! The optimization runs 100% locally in your web browser. No files are uploaded to remote servers, securing your confidential documents completely."
                },
                {
                  q: "What is the difference between Compress PDF and Optimize PDF?",
                  a: "Compress PDF optimizes index data and stream layouts without changing image quality (lossless). Optimize PDF downsamples and re-compresses embedded images (lossy), yielding much smaller files for graphic-heavy documents."
                },
                {
                  q: "Is this tool free to use?",
                  a: "Yes, our PDF optimizer is 100% free with no watermarks or email signups required."
                }
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                    <span className="font-outfit text-sm sm:text-base font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
                      <HelpCircle size={18} className="text-emerald-500 shrink-0" />
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
                { name: "Repair PDF", path: "/tool/repair-pdf", desc: "Fix corrupted PDF files" },
                { name: "Split PDF", path: "/tool/split", desc: "Separate documents" },
                { name: "Merge PDF", path: "/tool/merge", desc: "Combine files in order" }
              ].map((tool, idx) => (
                <Link
                  key={idx}
                  href={tool.path}
                  className="group p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col justify-center"
                >
                  <span className="font-outfit text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-emerald-500 transition-colors">
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
