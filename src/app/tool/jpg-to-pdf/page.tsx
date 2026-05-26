import ImageConverter from "@/components/tools/ImageConverter";
import Link from "next/link";
import type { Metadata } from "next";
import {
  SplitSquareHorizontal, FileText, ImageIcon,
  Lock, Unlock, Zap, Shield, ArrowRight, HelpCircle, Info, Star, Check, ChevronDown
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartpdfsplus.com';

// 1. Dynamic Metadata Export for Next.js App Router
export const metadata: Metadata = {
  title: 'Convert JPG to PDF Online - Free Image to PDF | SmartPDFs',
  description: 'Convert JPG, PNG, and TIFF images to PDF online for free. Combine multiple photos into a single PDF document locally and securely in your web browser.',
  keywords: 'jpg to pdf, convert jpg to pdf, image to pdf, combine images to pdf, free jpg to pdf converter, secure image to pdf, smartpdfs',
  alternates: {
    canonical: `${siteUrl}/tool/jpg-to-pdf`,
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
    title: 'Convert JPG to PDF Online - Free Image to PDF | SmartPDFs',
    description: 'Convert JPG, PNG, and TIFF images to PDF online for free. Combine multiple photos into a single PDF document locally and securely in your web browser.',
    siteName: 'SmartPDFs',
    url: `${siteUrl}/tool/jpg-to-pdf`,
    images: [
      {
        url: `${siteUrl}/img/jpg-to-pdf-og.png`,
        width: 1200,
        height: 630,
        alt: 'Convert JPG to PDF Online Free - SmartPDFs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Convert JPG to PDF Online - Free Image to PDF | SmartPDFs',
    description: 'Convert JPG, PNG, and TIFF images to PDF online for free. Combine multiple photos into a single PDF document locally and securely in your web browser.',
    images: [`${siteUrl}/img/jpg-to-pdf-og.png`],
  },
};

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Convert JPG to PDF Online",
  "url": `${siteUrl}/tool/jpg-to-pdf`,
  "image": `${siteUrl}/img/jpg-to-pdf-og.png`,
  "description": "Convert JPG, PNG, and TIFF images to PDF online for free. Combine multiple photos into a single PDF document locally and securely in your web browser.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires HTML5 support",
  "featureList": [
    "100% Local processing in your browser",
    "No file uploads to servers",
    "Combine multiple images into one PDF",
    "High-resolution PDF output",
    "Free with no watermark"
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
      "name": "JPG to PDF",
      "item": `${siteUrl}/tool/jpg-to-pdf`
    }
  ]
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is converting JPG to PDF secure on your website?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, absolutely. Our converter works 100% locally in your web browser using HTML5 and client-side processing. Your image files and generated PDF documents never leave your device, ensuring complete privacy."
      }
    },
    {
      "@type": "Question",
      "name": "Can I combine multiple images into a single PDF?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, you can upload multiple JPG, PNG, or TIFF files at once, drag them around to arrange the page sequence, and compile them all into a single, organized PDF document."
      }
    },
    {
      "@type": "Question",
      "name": "What image formats are supported?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our converter supports standard web image formats including JPG, JPEG, PNG, WebP, and TIFF, rendering them cleanly into PDF pages."
      }
    },
    {
      "@type": "Question",
      "name": "Will there be a watermark or ads in the output PDF?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, our JPG to PDF tool does not add any watermark or alter your original files. You get clean, professional PDF files for free."
      }
    }
  ]
};

const RELATED = [
  { id: 'pdf-to-jpg', title: 'PDF to JPG', description: 'Convert every PDF page into a high-quality JPG image.', icon: ImageIcon, gradient: 'linear-gradient(135deg, #eab308, #a16207)', shadow: 'rgba(234,179,8,0.3)', tag: 'Convert' },
  { id: 'merge', title: 'Merge PDF', description: 'Combine multiple PDF documents into one unified file easily.', icon: FileText, gradient: 'linear-gradient(135deg, #f97316, #ea580c)', shadow: 'rgba(249,115,22,0.3)', tag: 'Organize' },
  { id: 'split', title: 'Split PDF', description: 'Split a PDF into individual pages or custom page ranges.', icon: SplitSquareHorizontal, gradient: 'linear-gradient(135deg, #f97316, #c2410c)', shadow: 'rgba(249,115,22,0.3)', tag: 'Organize' },
  { id: 'compress', title: 'Compress PDF', description: 'Reduce PDF file size without losing visible quality.', icon: Zap, gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)', tag: 'Optimize' },
  { id: 'protect', title: 'Protect PDF', description: 'Encrypt your PDF with a password to keep it secure.', icon: Lock, gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', shadow: 'rgba(239,68,68,0.3)', tag: 'Security' },
  { id: 'unlock', title: 'Unlock PDF', description: 'Remove password protection from a PDF instantly.', icon: Unlock, gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', shadow: 'rgba(139,92,246,0.3)', tag: 'Security' },
];

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
      <Link href="/" className="hover:text-yellow-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 rounded px-1">
        Home
      </Link>
      <span aria-hidden="true">/</span>
      <Link href="/tool" className="hover:text-yellow-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 rounded px-1">
        Tools
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-slate-600 dark:text-slate-300" aria-current="page">JPG to PDF</span>
    </nav>
  );
}

export default function JpgToPdfPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
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
        <Breadcrumb />

        <section aria-label="JPG to PDF Converter Application" className="mb-16">
          <ImageConverter id="jpg-to-pdf" />
        </section>

        {/* Feature Cards Grid */}
        <section aria-label="Tool Benefits Quick Overview" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { 
              title: "Instant Conversion", 
              desc: "Convert multiple JPG, PNG, or TIFF images into a single professional PDF document.",
              gradient: "linear-gradient(135deg,#facc15,#eab308)"
            },
            { 
              title: "High Fidelity", 
              desc: "Maintains original image resolution and color profiles for high-quality printing and sharing.",
              gradient: "linear-gradient(135deg,#facc15,#eab308)"
            },
            { 
              title: "Private Processing", 
              desc: "All image-to-PDF merging occurs locally in your browser. No files are uploaded to our servers.",
              gradient: "linear-gradient(135deg,#22c55e,#15803d)"
            }
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

        {/* SEO Content Section */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">
          <div className="mb-16 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-yellow-500/10 dark:bg-yellow-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-yellow-600 dark:from-white dark:via-slate-200 dark:to-yellow-500 bg-clip-text text-transparent">
              Convert JPG to PDF Online <br />
              <span className="text-yellow-500 dark:text-yellow-400">100% Free & Secure</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Combine multiple images into a single professional PDF document in seconds. Work with absolute security—all conversion occurs directly on your local device.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is JPG to PDF Card */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-yellow-500/10 text-yellow-650 dark:text-yellow-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is JPG to PDF Conversion?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  JPG to PDF conversion is the process of importing one or more image files (such as JPG, PNG, WebP) and compiling them into a unified PDF document. This is highly useful for scanning documents with your phone camera, compiling photo portfolios, or submitting multi-page image documents.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  With SmartPDFs, you can build a PDF from images <strong className="text-yellow-650 dark:text-yellow-400 font-black">without uploading your private photos to external servers</strong>. Using advanced HTML5 and web capabilities, your browser handles the formatting and rendering locally. This guarantees absolute data confidentiality.
                </p>
              </div>
            </div>

            {/* How to use the tool card */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-500"><ArrowRight size={24} /></span>
                How to convert JPG to PDF in 3 Simple Steps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                {[
                  { step: "01", title: "Select Images", desc: "Drag and drop your images or click the choose button to select JPG, PNG, or TIFF files." },
                  { step: "02", title: "Arrange Sequence", desc: "Drag and reorder your image previews to customize which order they appear as pages inside your PDF." },
                  { step: "03", title: "Convert & Save", desc: "Click the conversion button. Download your watermark-free PDF document instantly." }
                ].map((s, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-outfit text-lg font-black text-yellow-600 dark:text-yellow-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-yellow-500/40 transition-all duration-300">
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
                <span className="p-2 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-500"><Star size={24} /></span>
                Key Benefits & Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300"><Shield size={22} /></div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-green-500 transition-colors">Complete Privacy Sandbox</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Your photos and documents contain private data. By converting locally in your browser, your files never touch external servers, keeping you safe from internet security breaches.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300"><Zap size={22} /></div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-yellow-500 transition-colors">Lossless Formatting Preservation</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    The rendering engine embeds your images into the PDF document in their original resolution and color structure, ensuring they print and display beautifully on any screen.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Supports multiple formats (JPG, PNG, WebP, TIFF) concurrently.",
                    "Interactive drag-and-drop workspace for easy slide reordering.",
                    "No file upload restrictions, no delays, and no watermark stamps.",
                    "100% responsive and optimized for mobile, tablet, and desktop viewports."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                      <span className="p-0.5 rounded-full bg-yellow-500/10 text-yellow-600 mt-0.5 shrink-0"><Check size={12} /></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FAQ Block */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-500"><HelpCircle size={24} /></span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Is converting JPG to PDF secure on your website?",
                    a: "Yes, absolutely. Our converter works 100% locally in your web browser using HTML5 and client-side processing. Your image files and generated PDF documents never leave your device, ensuring complete privacy."
                  },
                  {
                    q: "Can I combine multiple images into a single PDF?",
                    a: "Yes, you can upload multiple JPG, PNG, or TIFF files at once, drag them around to arrange the page sequence, and compile them all into a single, organized PDF document."
                  },
                  {
                    q: "What image formats are supported?",
                    a: "Our converter supports standard web image formats including JPG, JPEG, PNG, WebP, and TIFF, rendering them cleanly into PDF pages."
                  },
                  {
                    q: "Will there be a watermark or ads in the output PDF?",
                    a: "No, our JPG to PDF tool does not add any watermark or alter your original files. You get clean, professional PDF files for free."
                  }
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden bg-slate-50/20 dark:bg-slate-900/20 open:bg-slate-50/50 dark:open:bg-slate-800/30 transition-all duration-300 text-left"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 rounded-lg">
                      <h3 className="text-base sm:text-base font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-yellow-500 transition-colors pr-4">
                        {item.q}
                      </h3>
                      <span className="shrink-0 transition-transform duration-300 group-open:rotate-180 text-slate-400 group-hover:text-yellow-500">
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

        {/* RELATED TOOLS */}
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
                className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 text-left focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:outline-none"
              >
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: t.gradient, boxShadow: `0 8px 20px -4px ${t.shadow}` }}>
                    <t.icon size={26} aria-hidden="true" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-700">{t.tag}</span>
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-yellow-500 transition-colors">{t.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t.description}</p>
                </div>
                <div className="mt-auto pt-2 text-xs font-bold text-yellow-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool <span aria-hidden="true">&#8594;</span></div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
