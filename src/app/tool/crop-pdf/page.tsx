import Link from "next/link";
import type { Metadata } from "next";
import CropPdf from "@/components/tools/CropPdf";
import {
  Upload, Crop, Download, Lock, Unlock, FileText, ImageIcon, Merge, SplitSquareHorizontal,
  Shield, Check, HelpCircle, ChevronDown, ArrowRight, Info, Star, Zap
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://smartpdfpro.com/";

// 1. Dynamic Metadata Export for Next.js App Router (SEO & Indexing Fix)
export const metadata: Metadata = {
  title: "Crop PDF Online Free | Adjust PDF Margins & Page Size",
  description: "Crop PDF pages online for free. Adjust page margins, trim borders, and crop individual pages or whole documents instantly. 100% private in-browser tool.",
  keywords: "crop pdf, crop pdf online, trim pdf, adjust pdf margins, crop pdf page size, pdf cropper free, secure pdf crop, smartpdfs",
  alternates: {
    canonical: `${siteUrl}/tool/crop-pdf`,
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
    title: "Crop PDF Online Free | Adjust PDF Margins & Page Size",
    description: "Crop PDF pages online for free. Adjust page margins, trim borders, and crop individual pages or whole documents instantly. 100% private in-browser tool.",
    siteName: "SmartPDFs Plus",
    url: `${siteUrl}/tool/crop-pdf`,
    images: [
      {
        url: `${siteUrl}/img/crop-pdf-og.png`,
        width: 1200,
        height: 630,
        alt: "Crop PDF Online Free - SmartPDFs Plus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crop PDF Online Free | Adjust PDF Margins & Page Size",
    description: "Crop PDF pages online for free. Adjust page margins, trim borders, and crop individual pages or whole documents instantly. 100% private in-browser tool.",
    images: [`${siteUrl}/img/crop-pdf-og.png`],
  },
};

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Crop PDF Online Free",
  "url": `${siteUrl}/tool/crop-pdf`,
  "image": `${siteUrl}/img/crop-pdf-og.png`,
  "description": "Crop PDF pages online for free. Adjust page margins, trim borders, and crop individual pages or whole documents instantly.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires HTML5 support",
  "featureList": [
    "100% Local processing in your browser sandbox",
    "No file uploads to servers",
    "Set uniform crop area or specify per-page crop areas",
    "Interactive visual crop guides",
    "Free with no registrations or watermarks"
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
      "name": "Crop PDF",
      "item": `${siteUrl}/tool/crop-pdf`
    }
  ]
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can I crop all pages in a PDF document at the same time?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, our tool allows you to apply the selected crop area uniformly to all pages in your document, or customize the margins on a page-by-page basis."
      }
    },
    {
      "@type": "Question",
      "name": "Are my confidential PDFs uploaded to a server?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. The entire cropping process occurs locally inside your web browser. Your private documents are processed completely offline and are never transmitted to our servers."
      }
    },
    {
      "@type": "Question",
      "name": "Will cropping my PDF reduce the quality of text or images?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, the crop action simply adjusts the page boundary definitions (MediaBox/CropBox parameters) without re-encoding text or compressed image components, preserving original visual details."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a limit on the file size of PDFs I can crop?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Since processing happens locally on your computer, there are no artificial server limits. Performance depends entirely on your local system's processor and memory capacity."
      }
    }
  ]
};

const STEPS = [
  { icon: Upload, title: "Upload Your PDF", desc: "Select or drop your PDF file. All processing happens entirely in your browser — your file never leaves your device." },
  { icon: Crop, title: "Set the Crop Area", desc: "Drag the orange handles to define exactly which area to keep. Apply the same crop to all pages or set a different crop per page." },
  { icon: Download, title: "Download Cropped PDF", desc: "Click 'Crop PDF' and instantly download your cropped PDF with all pages trimmed to your selected area." },
];

const RELATED = [
  { id: "merge", title: "Merge PDF", description: "Combine multiple PDF files into one document in seconds.", icon: Merge, gradient: "linear-gradient(135deg, #f97316, #c2410c)", shadow: "rgba(249,115,22,0.3)", tag: "Organize", href: "/tool/merge" },
  { id: "split", title: "Split PDF", description: "Split a PDF into individual pages or custom page ranges.", icon: SplitSquareHorizontal, gradient: "linear-gradient(135deg, #f97316, #c2410c)", shadow: "rgba(249,115,22,0.3)", tag: "Organize", href: "/tool/split" },
  { id: "compress", title: "Compress PDF", description: "Reduce PDF file size without losing visible quality.", icon: FileText, gradient: "linear-gradient(135deg, #22c55e, #15803d)", shadow: "rgba(34,197,94,0.3)", tag: "Optimize", href: "/tool/compress" },
  { id: "pdf-to-jpg", title: "PDF to JPG", description: "Convert every PDF page into a high-quality JPG image.", icon: ImageIcon, gradient: "linear-gradient(135deg, #eab308, #a16207)", shadow: "rgba(234,179,8,0.3)", tag: "Convert", href: "/tool/pdf-to-jpg" },
  { id: "protect", title: "Protect PDF", description: "Encrypt your PDF with a password to keep it secure.", icon: Lock, gradient: "linear-gradient(135deg, #ef4444, #b91c1c)", shadow: "rgba(239,68,68,0.3)", tag: "Security", href: "/tool/protect" },
  { id: "unlock", title: "Unlock PDF", description: "Remove password protection from a PDF instantly.", icon: Unlock, gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)", shadow: "rgba(139,92,246,0.3)", tag: "Security", href: "/tool/unlock" },
];

export default function CropPdfPage() {
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
          <span className="text-slate-600 dark:text-slate-300" aria-current="page">Crop PDF</span>
        </nav>

        {/* Dynamic Client Tool Component */}
        <section aria-label="PDF Crop Application Workspace" className="mb-16">
          <CropPdf id="crop-pdf" />
        </section>

        {/* How It Works Quick View */}
        <section aria-label="Tool Steps Overview" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {STEPS.map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group text-left">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <s.icon className="text-orange-500" size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{s.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </section>

        {/* 4. Complete SEO Optimized Content Section */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">

          <div className="mb-16 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-orange-500/10 dark:bg-orange-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-orange-600 dark:from-white dark:via-slate-200 dark:to-orange-500 bg-clip-text text-transparent">
              Crop PDF Pages Online <br />
              <span className="text-orange-500 dark:text-orange-400">100% Free & Secure</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Isolate and trim specific page layouts inside your PDF files. Format margins and crop sheets locally in your browser memory for absolute file privacy.
            </p>
          </div>

          <article className="space-y-16">

            {/* What is PDF Cropper */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is PDF page cropping?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  Cropping a PDF involves trimming unnecessary margin borders, headers, or footers to focus on the key contents of a document page. It is highly useful for optimizing slides, adjusting scanner margins, or preparing sheets for specific printer layouts.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  Unlike conventional online tools that upload your files to external servers, our PDF cropper performs the entire process <strong className="text-orange-500 font-black">100% locally in your web browser</strong>. Your private documents never leave your computer, ensuring complete data confidentiality.
                </p>
              </div>
            </div>

            {/* How to use */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500"><ArrowRight size={24} /></span>
                How to crop PDF in 3 Simple Steps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                {[
                  { step: "01", title: "Select PDF", desc: "Choose your PDF document from your file directory or drag & drop it directly into the workspace above." },
                  { step: "02", title: "Select Boundary Area", desc: "Drag the orange crop handle margins to outline the specific area to keep. Apply to all pages or configure page-by-page." },
                  { step: "03", title: "Download Trimmed PDF", desc: "Export your newly formatted, trimmed PDF instantly in original resolution." }
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

            {/* Benefits & Features */}
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
                    We process documents locally inside your browser memory using client-side JavaScript. No file elements are transmitted over the web.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300"><Zap size={22} /></div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-orange-500 transition-colors">Retains Layout Fidelity</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Adjusts bounding coordinates without re-rendering vector structures, meaning text outlines and visual details remain perfectly crisp.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Supports cropping all pages together or individually.",
                    "Provides interactive visual drag-and-crop margin frames.",
                    "Highly optimized for mobile screens and phone browsers.",
                    "Free with no conversion limits, accounts, or watermarks."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                      <span className="p-0.5 rounded-full bg-orange-500/10 text-orange-600 mt-0.5 shrink-0"><Check size={12} /></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500"><HelpCircle size={24} /></span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Can I crop all pages in a PDF document at the same time?",
                    a: "Yes, our tool allows you to apply the selected crop area uniformly to all pages in your document, or customize the margins on a page-by-page basis."
                  },
                  {
                    q: "Are my confidential PDFs uploaded to a server?",
                    a: "No. The entire cropping process occurs locally inside your web browser. Your private documents are processed completely offline and are never transmitted to our servers."
                  },
                  {
                    q: "Will cropping my PDF reduce the quality of text or images?",
                    a: "No, the crop action simply adjusts the page boundary definitions (MediaBox/CropBox parameters) without re-encoding text or compressed image components, preserving original visual details."
                  },
                  {
                    q: "Is there a limit on the file size of PDFs I can crop?",
                    a: "Since processing happens locally on your computer, there are no artificial server limits. Performance depends entirely on your local system's processor and memory capacity."
                  }
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 bg-slate-50/20 dark:bg-slate-900/20 open:bg-slate-50/50 dark:open:bg-slate-800/30 transition-all duration-300 text-left"
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

        {/* Related Document & Image Tools (Internal Links) */}
        <section aria-label="Related tools" className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 text-center">
            Explore More Image & PDF Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RELATED.map(t => (
              <Link
                key={t.id}
                href={t.href}
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
