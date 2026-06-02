import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from '@/components/seo/WebAppSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import MergeSplit from "@/components/tools/MergeSplit";
import Link from "next/link";
import type { Metadata } from "next";
import {
  SplitSquareHorizontal, FileText, ImageIcon,
  Lock, Unlock, Zap, Shield, ArrowRight, HelpCircle, Info, Star, Check, ChevronDown
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// 1. Dynamic Metadata Export for Next.js App Router


// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Merge PDF Online Free",
  "url": `${siteUrl}/tool/merge`,
  "image": `${siteUrl}/img/merge-multiple-pdfs.png`,
  "description": "Merge PDF files online for free. Combine multiple PDF documents into one instantly with 100% secure local browser processing.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires HTML5 support",
  "featureList": [
    "100% Local processing in your browser",
    "No file uploads to servers",
    "Combine multiple PDF documents",
    "Drag and drop reordering",
    "Fast and free with no watermark"
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
      "name": "Merge PDF",
      "item": `${siteUrl}/tool/merge`
    }
  ]
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is this PDF merger tool safe to use with sensitive files?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, absolutely. Unlike other online tools that upload your files to external servers, our PDF merger performs the entire process 100% locally in your web browser. Your private documents never leave your computer."
      }
    },
    {
      "@type": "Question",
      "name": "How many PDF files can I merge at once?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can add and merge multiple PDF files at once. You can also drag and drop them in the queue to rearrange their order before merging."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a limit on the file size of PDFs I can upload?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Because all merging happens client-side in your browser, there is no server-imposed upload limit. It depends only on your local system's memory and CPU."
      }
    },
    {
      "@type": "Question",
      "name": "Will merging PDFs add a watermark or degrade quality?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, our tool does not add any watermarks to your output PDF, and it retains the original high resolution and formatting of your text and images."
      }
    }
  ]
};

// 8. Internal links configuration
const RELATED = [
  { id: 'split', title: 'Split PDF', description: 'Split a PDF into individual pages or custom page ranges.', icon: SplitSquareHorizontal, gradient: 'linear-gradient(135deg, #f97316, #c2410c)', shadow: 'rgba(249,115,22,0.3)', tag: 'Organize' },
  { id: 'compress', title: 'Compress PDF', description: 'Reduce PDF file size without losing visible quality.', icon: Zap, gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)', tag: 'Optimize' },
  { id: 'pdf-to-word', title: 'PDF to Word', description: 'Convert PDF files to editable Word documents online for free.', icon: FileText, gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'rgba(49,130,206,0.3)', tag: 'Convert' },
  { id: 'pdf-to-jpg', title: 'PDF to JPG', description: 'Convert every PDF page into a high-quality JPG image.', icon: ImageIcon, gradient: 'linear-gradient(135deg, #eab308, #a16207)', shadow: 'rgba(234,179,8,0.3)', tag: 'Convert' },
  { id: 'protect', title: 'Protect PDF', description: 'Encrypt your PDF with a password to keep it secure.', icon: Lock, gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', shadow: 'rgba(239,68,68,0.3)', tag: 'Security' },
  { id: 'unlock', title: 'Unlock PDF', description: 'Remove password protection from a PDF instantly.', icon: Unlock, gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', shadow: 'rgba(139,92,246,0.3)', tag: 'Security' },
];

// 12. Breadcrumb Navigation Component
function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
      <Link href="/" className="hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1">
        Home
      </Link>
      <span aria-hidden="true">/</span>
      <Link href="/tool" className="hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1">
        Tools
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-slate-600 dark:text-slate-300" aria-current="page">Merge PDF</span>
    </nav>
  );
}


export function generateMetadata() {
  const id = 'merge';
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

export default function MergePage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta('merge');
        return meta ? (
          <>
            <WebAppSchema name={`${meta.title} – Free Online Tool`} description={meta.description} url={getToolUrl('merge')} />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema items={[{ label: 'Tools', href: '/#tools' }, { label: meta.title, href: `/tool/merge` }]} />
          </>
        ) : null;
      })()}

      {/* 2. Structured data scripts for search indexing */}
      
      
      

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">

        {/* Breadcrumb navigation */}
        <Breadcrumb />

        {/* Interactive PDF Merger Tool */}
        <section aria-label="PDF Merger Application" className="mb-16">
          <MergeSplit id="merge" />
        </section>

        {/* Feature Cards Grid */}
        <section aria-label="Tool Benefits Quick Overview" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { title: "Smart Merging", desc: "Combine multiple PDF files into one while maintaining high-quality text and images.", gradient: "linear-gradient(135deg,#f97316,#ea580c)" },
            { title: "Label Enrichment", desc: "Automatically detects Amazon labels and enriches them with SKU information during merge.", gradient: "linear-gradient(135deg,#f97316,#ea580c)" },
            { title: "Secure Handling", desc: "Your files never leave your computer. Merging is performed 100% locally.", gradient: "linear-gradient(135deg,#22c55e,#15803d)" }
          ].map((feat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group text-left">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg" style={{ background: feat.gradient }}>
                <div className="text-white font-black" aria-hidden="true">{i + 1}</div>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{feat.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </section>

        {/* 4. Complete SEO Optimized Content Section */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">

          <div className="mb-16 text-center relative">
            {/* Background glowing gradient accents */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-orange-500/10 dark:bg-orange-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-orange-600 dark:from-white dark:via-slate-200 dark:to-orange-500 bg-clip-text text-transparent">
              Merge PDF Files Online <br />
              <span className="text-orange-500 dark:text-orange-400">100% Free & Secure</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Combine multiple PDF documents into a single file in seconds. Work with total privacy—your files are processed locally in your browser and never uploaded to any server.
            </p>
          </div>

          <article className="space-y-16">

            {/* What is PDF Merge Card */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is PDF Merge?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  PDF merging is the process of combining two or more PDF documents into a single, unified file. This is crucial for organizing digital paperwork, archiving records, and assembling reports.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  Unlike conventional online services that require you to upload private files to external servers (exposing your sensitive data to security risks), SmartPDFs Plus combines your files <strong className="text-orange-500 font-black">100% locally in your web browser</strong> using native Client-side WebAssembly logic. Your files never touch our servers, guaranteeing complete privacy and instant processing.
                </p>
              </div>
            </div>

            {/* How to use the tool card */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500"><ArrowRight size={24} /></span>
                How to combine PDFs in 3 Simple Steps
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                {/* Connecting Line (Only visible on desktop/md) */}
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />

                {[
                  { step: "01", title: "Select Files", desc: "Click 'Choose Files' or drag and drop your PDFs directly into the workspace above." },
                  { step: "02", title: "Arrange Order", desc: "Drag and drop the files in the list to change the order they will appear in the merged document." },
                  { step: "03", title: "Merge & Save", desc: "Click 'Merge All' to combine the files. Download your watermark-free output PDF instantly." }
                ].map((s, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-outfit text-lg font-black text-orange-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-orange-500/40 transition-all duration-300">
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
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500"><Star size={24} /></span>
                Key Benefits & Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300"><Shield size={22} /></div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-green-500 transition-colors">100% Client-Side Privacy</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Security is our baseline. Our tool works locally inside your browser sandbox. It reads and merges the PDFs directly in your computer's memory, so your files are never transmitted across the internet.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300"><Zap size={22} /></div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-orange-500 transition-colors">No Watermarks & Instant Execution</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    We do not force ads or watermarks onto your final documents. Output files are created in original resolution, preserving layout format, text, and vector resolution instantly.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Amazon Label Enrichment detects barcodes and injects SKU labels dynamically.",
                    "Supports mixing of different page dimensions (A4, Letter, Custom) inside one document.",
                    "Zero signup required — start merging files immediately without creating an account.",
                    "Mobile-friendly layouts that let you combine documents on your phone or tablet."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                      <span className="p-0.5 rounded-full bg-orange-500/10 text-orange-600 mt-0.5 shrink-0"><Check size={12} /></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FAQ Block */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500"><HelpCircle size={24} /></span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Is this PDF merger tool safe to use with sensitive files?",
                    a: "Yes, absolutely. Unlike other online tools that upload your files to external servers, our PDF merger performs the entire process 100% locally in your web browser. Your private documents never leave your computer."
                  },
                  {
                    q: "How many PDF files can I merge at once?",
                    a: "You can add and merge multiple PDF files at once. You can also drag and drop them in the queue to rearrange their order before merging."
                  },
                  {
                    q: "Is there a limit on the file size of PDFs I can upload?",
                    a: "Because all merging happens client-side in your browser, there is no server-imposed upload limit. It depends only on your local system's memory and CPU."
                  },
                  {
                    q: "Will merging PDFs add a watermark or degrade quality?",
                    a: "No, our tool does not add any watermarks to your output PDF, and it retains the original high resolution and formatting of your text and images."
                  }
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden bg-slate-50/20 dark:bg-slate-900/20 open:bg-slate-50/50 dark:open:bg-slate-800/30 transition-all duration-300 text-left"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg">
                      <h3 className="text-base sm:text-base font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-orange-500 transition-colors pr-4">
                        {item.q}
                      </h3>
                      <span className="shrink-0 transition-transform duration-300 group-open:rotate-180 text-slate-400 group-hover:text-orange-500">
                        <ChevronDown size={18} />
                      </span>
                    </summary>
                    <div className="mt-3 text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium border-t border-slate-105 dark:border-slate-800 pt-3">
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
                className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 text-left focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
              >
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: t.gradient, boxShadow: `0 8px 20px -4px ${t.shadow}` }}>
                    <t.icon size={26} aria-hidden="true" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-700">{t.tag}</span>
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-orange-500 transition-colors">{t.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t.description}</p>
                </div>
                <div className="mt-auto pt-2 text-xs font-bold text-orange-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool <span aria-hidden="true">&#8594;</span></div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
