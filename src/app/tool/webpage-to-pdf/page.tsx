import Link from "next/link";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  Globe, Upload, Download, CheckCircle, FileText, Zap, Lock,
  ImageIcon, FileSpreadsheet, Presentation, Shield, Info, ArrowRight,
  Star, Check, HelpCircle, ChevronDown, Loader2
} from 'lucide-react';

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://smartpdfpro.com/';

// 1. Dynamic Metadata Export for Next.js App Router
export const metadata: Metadata = {
  title: 'Convert Webpage URL to PDF Online Free | Web to PDF',
  description: 'Convert any public webpage URL into a clean, formatted PDF document online for free. Save news articles, blogs, or documentation.',
  keywords: 'webpage to pdf, web to pdf, convert url to pdf, website to pdf, convert webpage to pdf, free url to pdf, smartpdfs plus',
  alternates: {
    canonical: `${siteUrl}/tool/webpage-to-pdf`,
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
    title: 'Convert Webpage URL to PDF Online Free | Web to PDF',
    description: 'Convert any public webpage URL into a clean, formatted PDF document online for free. Save news articles, blogs, or documentation.',
    siteName: 'SmartPDFs Plus',
    url: `${siteUrl}/tool/webpage-to-pdf`,
    images: [
      {
        url: `${siteUrl}/img/snapdeal-label.png`,
        width: 1200,
        height: 630,
        alt: 'Webpage to PDF Converter Online - SmartPDFs Plus',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Convert Webpage URL to PDF Online Free | Web to PDF',
    description: 'Convert any public webpage URL into a clean, formatted PDF document online for free. Save news articles, blogs, or documentation.',
    images: [`${siteUrl}/img/snapdeal-label.png`],
  },
};

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Webpage to PDF Converter Online Free",
  "url": `${siteUrl}/tool/webpage-to-pdf`,
  "image": `${siteUrl}/img/snapdeal-label.png`,
  "description": "Convert any public webpage URL into a clean, formatted PDF document online for free. Save news articles, blogs, or documentation.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires HTML5 support",
  "featureList": [
    "Converts public website URLs to PDF",
    "High-speed browser-rendering layout engine",
    "Preserves CSS, styling, shapes and margins",
    "Secure cloud sandboxes with automated deletion",
    "Zero watermarks in output PDF file"
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
      "name": "Webpage URL to PDF",
      "item": `${siteUrl}/tool/webpage-to-pdf`
    }
  ]
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I convert a webpage to PDF?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simply copy the website's URL, paste it into the input box at the top, and click 'Convert to PDF'. You can download the generated document in a few seconds."
      }
    },
    {
      "@type": "Question",
      "name": "Does it support pages that require login credentials?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, our converter only supports public URL targets. If the webpage is behind a paywall, registration, or login page, the engine will fail to authenticate and fetch assets."
      }
    },
    {
      "@type": "Question",
      "name": "Will formatting, styling, and images be identical?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, our browser-rendering engine compiles web media stylesheets, margins, and inline grids, reproducing them exactly as they would look in a standard web browser print view."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a page or document length limit?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We render webpages up to 100 pages long, which easily accommodates most blogs, news articles, essays, and online documentation resources."
      }
    }
  ]
};

// 8. Internal links configuration
const RELATED = [
  { id: 'html-to-pdf', title: 'HTML to PDF', description: 'Convert a local HTML file to PDF with full styling preserved.', icon: Globe, gradient: 'linear-gradient(135deg, #6366f1, #4338ca)', shadow: 'rgba(99,102,241,0.3)', tag: 'Convert' },
  { id: 'word-to-pdf', title: 'Word to PDF', description: 'Convert DOCX files to PDF with formatting perfectly preserved.', icon: FileText, gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'rgba(49,130,206,0.3)', tag: 'Convert' },
  { id: 'compress', title: 'Compress PDF', description: 'Reduce PDF file size without losing visible quality.', icon: Zap, gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)', tag: 'Optimize' },
  { id: 'split', title: 'Split PDF', description: 'Split a PDF into individual pages or custom page ranges.', icon: Presentation, gradient: 'linear-gradient(135deg, #f97316, #c2410c)', shadow: 'rgba(249,115,22,0.3)', tag: 'Organize' },
  { id: 'pdf-to-word', title: 'PDF to Word', description: 'Convert PDF files to editable Word documents online for free.', icon: FileText, gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'rgba(49,130,206,0.3)', tag: 'Convert' },
  { id: 'protect', title: 'Protect PDF', description: 'Encrypt your PDF with a password to keep it secure.', icon: Lock, gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', shadow: 'rgba(239,68,68,0.3)', tag: 'Security' },
];

// 12. Breadcrumb Navigation Component
function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
      <Link href="/" className="hover:text-sky-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1">
        Home
      </Link>
      <span aria-hidden="true">/</span>
      <Link href="/tool" className="hover:text-sky-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1">
        Tools
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-slate-600 dark:text-slate-300" aria-current="page">Webpage to PDF</span>
    </nav>
  );
}

// 5. Loading Skeleton to Improve Core Web Vitals (CLS)
function WebpageToPdfSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-12 px-2 sm:px-4 text-center animate-pulse">
      <div className="bg-white dark:bg-slate-800 rounded-[1.2rem] sm:rounded-[2.5rem] p-4 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-6 sm:space-y-10">
        <div className="space-y-2 sm:space-y-4 flex flex-col items-center">
          <div className="inline-flex p-3 sm:p-5 rounded-xl sm:rounded-3xl bg-slate-100 dark:bg-slate-700 text-slate-350 font-black">
            <Loader2 className="w-6 h-6 sm:w-10 sm:h-10 animate-spin text-slate-400 dark:text-slate-600" />
          </div>
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded mx-auto" />
        </div>
        <div className="space-y-2 sm:space-y-3 text-left">
          <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-14 bg-slate-50 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl border-2 border-slate-200 dark:border-slate-700" />
        </div>
        <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl sm:rounded-2xl" />
      </div>
    </div>
  );
}

// Dynamic Imports
const CreditGate = dynamic(() => import("@/components/credits/CreditGate"), {
  loading: () => <WebpageToPdfSkeleton />
});

const WebpageToPdf = dynamic(() => import("@/components/tools/WebpageToPdf"), {
  loading: () => <WebpageToPdfSkeleton />
});

export default function WebpageToPdfPage() {
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
        <Breadcrumb />

        {/* Interactive Webpage to PDF Converter Tool inside Credit Gate */}
        <section aria-label="Webpage to PDF Application" className="mb-16">
          <CreditGate toolName="webpage-to-pdf" showCounter={false}>
            <WebpageToPdf id="webpage-to-pdf" />
          </CreditGate>
        </section>

        {/* Feature Cards Grid */}
        <section aria-label="Tool Benefits Quick Overview" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { title: 'Print Rendering', desc: 'Converts websites using headless browser rendering, preserving print templates, fonts, and assets.', icon: Zap },
            { title: '100% Secure', desc: 'URLs are loaded in isolated sandboxes and rendered files are permanently deleted in 1 hour.', icon: Shield },
            { title: 'Visual Fidelity', desc: 'Vector text layers, images, page bounds, and stylesheet colors are all preserved.', icon: FileText },
            { title: 'Works Everywhere', desc: 'No software to install. Works on any device — Windows, Mac, Linux, iOS, or Android.', icon: Globe },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group text-center flex flex-col items-center gap-3">
              <div className="inline-flex p-4 rounded-2xl bg-sky-50 dark:bg-sky-500/10 text-sky-500 group-hover:scale-110 transition-transform"><item.icon size={26} /></div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* 4. Complete SEO Optimized Content Section */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">

          <div className="mb-16 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-sky-500/10 dark:bg-sky-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-sky-600 dark:from-white dark:via-slate-200 dark:to-sky-500 bg-clip-text text-transparent">
              Convert URL to PDF Online <br />
              <span className="text-sky-500 dark:text-sky-455">Free, Fast & Secure</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Transform any public website webpage URL into a high-fidelity PDF document in a single click. Save news articles, blogs, documentation pages, or wiki nodes instantly.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is Webpage to PDF Card */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-sky-500/10 text-sky-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is Webpage to PDF Conversion?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  Converting Webpage URL to PDF is the process of print rendering. Our server engine loads the target URL in a headless virtual browser sandbox, compiles the web layouts, reads stylesheet variables, and prints the result into a standardized multipage PDF file. This is highly useful for archiving internet documentation, recipes, blogs, and portfolio references.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  SmartPDFs Plus processes URL tasks securely. The compiled files are <strong className="text-sky-550 font-black">automatically removed from our servers within 1 hour</strong> to guarantee data privacy.
                </p>
              </div>
            </div>

            {/* How to use the tool card */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-sky-500/10 text-sky-500"><ArrowRight size={24} /></span>
                How to convert Webpage URL to PDF in 3 Simple Steps
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />

                {[
                  { step: "01", title: "Enter Website URL", desc: "Paste the public URL link of the webpage you want to convert into the input box above." },
                  { step: "02", title: "Process Page", desc: "Our engine executes browser rendering rules and writes the layout coordinates instantly." },
                  { step: "03", title: "Download PDF", desc: "Download the generated PDF document. Converted files are wiped from the server in 1 hour." }
                ].map((s, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-outfit text-lg font-black text-sky-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-sky-500/40 transition-all duration-300">
                      {s.step}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{s.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Benefits and Features */}
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                <span className="p-2 rounded-xl bg-sky-500/10 text-sky-500"><Star size={24} /></span>
                Key Benefits & Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300"><Shield size={22} /></div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-green-500 transition-colors">Information Confidentiality</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    We use secure end-to-end HTTPS transfers. Converted webpage files are removed automatically and permanently within 1 hour after conversion.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300"><Zap size={22} /></div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-sky-550 transition-colors">Print Layout Adaptability</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Our server engine optimizes media styles, column layouts, text boxes, and asset images, outputting clean, printable layout coordinates.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-855 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Supports public HTTP and HTTPS webpage URL links.",
                    "Retains layout orientation, page margins, and visual dimensions.",
                    "No watermark overlays added, leaving your pages 100% professional.",
                    "Works across mobile and tablet browsers without account signups."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                      <span className="p-0.5 rounded-full bg-sky-500/10 text-sky-600 mt-0.5 shrink-0"><Check size={12} /></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FAQ Block */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-sky-500/10 text-sky-500"><HelpCircle size={24} /></span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "How do I convert a webpage to PDF?",
                    a: "Simply copy the website's URL, paste it into the input box at the top, and click 'Convert to PDF'. You can download the generated document in a few seconds."
                  },
                  {
                    q: "Does it support pages that require login credentials?",
                    a: "No, our converter only supports public URL targets. If the webpage is behind a paywall, registration, or login page, the engine will fail to authenticate and fetch assets."
                  },
                  {
                    q: "Will formatting, styling, and images be identical?",
                    a: "Yes, our browser-rendering engine compiles web media stylesheets, margins, and inline grids, reproducing them exactly as they would look in a standard web browser print view."
                  },
                  {
                    q: "Is there a page or document length limit?",
                    a: "We render webpages up to 100 pages long, which easily accommodates most blogs, news articles, essays, and online documentation resources."
                  }
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden bg-slate-50/20 dark:bg-slate-900/20 open:bg-slate-50/50 dark:open:bg-slate-800/30 transition-all duration-300 text-left"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg">
                      <h3 className="text-base sm:text-base font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-sky-500 transition-colors pr-4">
                        {item.q}
                      </h3>
                      <span className="shrink-0 transition-transform duration-300 group-open:rotate-180 text-slate-400 group-hover:text-sky-500">
                        <ChevronDown size={18} />
                      </span>
                    </summary>
                    <div className="mt-3 text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium border-t border-slate-100 dark:border-slate-800 pt-3">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </article>
        </section>

        {/* 8. Internal Linking Section with Accessibility improvements */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 text-center">
            Explore More PDF Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RELATED.map(t => (
              <Link
                key={t.id}
                href={`/tool/${t.id}`}
                title={`Use the ${t.title} tool`}
                aria-label={`Open the ${t.title} tool to ${t.description.toLowerCase()}`}
                className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 text-left focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
              >
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: t.gradient, boxShadow: `0 8px 20px -4px ${t.shadow}` }}>
                    <t.icon size={26} aria-hidden="true" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-700">{t.tag}</span>
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-sky-500 transition-colors">{t.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t.description}</p>
                </div>
                <div className="mt-auto pt-2 text-xs font-bold text-sky-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool <span aria-hidden="true">&#8594;</span></div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
