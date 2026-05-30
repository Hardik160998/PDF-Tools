import Link from "next/link";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  Stamp, Upload, Type, Download, Hash, Settings, Lock, Unlock,
  PenLine, Combine, CheckCircle, Shield, Zap, Info, ArrowRight, Star,
  Check, HelpCircle, ChevronDown, Loader2, Globe
} from 'lucide-react';

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://smartpdfpro.com/';

// 1. Dynamic Metadata Export for Next.js App Router
export const metadata: Metadata = {
  title: 'Watermark PDF Online Free | Add Stamp to PDF Online',
  description: 'Stamp image or text watermarks onto PDF pages online for free. Custom spacing, rotation, transparency, and 100% secure local browser processing.',
  keywords: 'watermark pdf, add watermark to pdf, free pdf watermarker, pdf stamp tool, online watermark pdf, logo to pdf, smartpdfs plus',
  alternates: {
    canonical: `${siteUrl}/tool/watermark`,
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
    title: 'Watermark PDF Online Free | Add Stamp to PDF Online',
    description: 'Stamp image or text watermarks onto PDF pages online for free. Custom spacing, rotation, transparency, and 100% secure local browser processing.',
    siteName: 'SmartPDFs Plus',
    url: `${siteUrl}/tool/watermark`,
    images: [
      {
        url: `${siteUrl}/img/snapdeal-label.png`,
        width: 1200,
        height: 630,
        alt: 'Watermark PDF Tool Online - SmartPDFs Plus',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Watermark PDF Online Free | Add Stamp to PDF Online',
    description: 'Stamp image or text watermarks onto PDF pages online for free. Custom spacing, rotation, transparency, and 100% secure local browser processing.',
    images: [`${siteUrl}/img/snapdeal-label.png`],
  },
};

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Watermark PDF Online Free",
  "url": `${siteUrl}/tool/watermark`,
  "image": `${siteUrl}/img/snapdeal-label.png`,
  "description": "Stamp image or text watermarks onto PDF pages online for free. Custom spacing, rotation, transparency, and 100% secure local browser processing.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires HTML5 support",
  "featureList": [
    "100% Local processing in your browser",
    "No file uploads to servers",
    "Add text watermarks with custom fonts",
    "Add image/logo watermarks",
    "Adjust opacity, scale, and rotation angles"
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
      "name": "Watermark PDF",
      "item": `${siteUrl}/tool/watermark`
    }
  ]
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is the watermarking tool secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, absolutely. Unlike other online tools that upload your files to external servers, our PDF watermark tool performs the entire process 100% locally in your web browser. Your private documents never leave your computer."
      }
    },
    {
      "@type": "Question",
      "name": "Can I adjust the transparency and angle of the watermark?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The editor provides slider controls to set custom transparency, rotate stamps to any angle, and scale font sizes."
      }
    },
    {
      "@type": "Question",
      "name": "Can I stamp watermarks on specific pages?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, you can specify individual page ranges or stamp the watermark across all pages in the PDF document."
      }
    },
    {
      "@type": "Question",
      "name": "Will watermarking add extra file sizes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our system inserts lightweight overlay vectors, ensuring output file sizes remain small."
      }
    }
  ]
};

// 8. Internal links configuration
const RELATED = [
  { id: 'page-numbers', title: 'Page Numbers', description: 'Add professional page numbers to your PDF at any position.', icon: Hash, gradient: 'linear-gradient(135deg, #6366f1, #4338ca)', shadow: 'rgba(99,102,241,0.3)', tag: 'Edit' },
  { id: 'metadata', title: 'Edit Metadata', description: 'Add or update Author, Title, Subject and other document metadata fields.', icon: Settings, gradient: 'linear-gradient(135deg, #64748b, #334155)', shadow: 'rgba(100,116,139,0.3)', tag: 'Edit' },
  { id: 'protect', title: 'Protect PDF', description: 'Encrypt your watermarked PDF with a password to keep it secure.', icon: Lock, gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', shadow: 'rgba(239,68,68,0.3)', tag: 'Security' },
  { id: 'unlock', title: 'Unlock PDF', description: 'Remove password protection from a PDF and restore full access.', icon: Unlock, gradient: 'linear-gradient(135deg, #f97316, #c2410c)', shadow: 'rgba(249,115,22,0.3)', tag: 'Security' },
  { id: 'merge', title: 'Merge PDF', description: 'Combine multiple PDF files into one document in the order you choose.', icon: Combine, gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)', tag: 'Organize' },
  { id: 'esign', title: 'E-Sign PDF', description: 'Draw or type your signature and place it anywhere on a PDF instantly.', icon: PenLine, gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)', shadow: 'rgba(139,92,246,0.3)', tag: 'Sign' },
];

// 12. Breadcrumb Navigation Component
function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
      <Link href="/" className="hover:text-purple-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded px-1">
        Home
      </Link>
      <span aria-hidden="true">/</span>
      <Link href="/tool" className="hover:text-purple-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded px-1">
        Tools
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-slate-600 dark:text-slate-300" aria-current="page">Watermark PDF</span>
    </nav>
  );
}

// 5. Loading Skeleton to Improve Core Web Vitals (CLS)
function EditToolsSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-12 px-2 sm:px-4 text-center animate-pulse">
      <div className="bg-white dark:bg-slate-800 rounded-[1.2rem] sm:rounded-[2.5rem] p-4 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-5 sm:space-y-10">
        <div className="space-y-2 sm:space-y-4 flex flex-col items-center">
          <div className="inline-flex p-3 sm:p-5 rounded-xl sm:rounded-3xl bg-slate-100 dark:bg-slate-700 text-slate-350 font-black">
            <Loader2 className="w-6 h-6 sm:w-10 sm:h-10 animate-spin text-slate-400 dark:text-slate-600" />
          </div>
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded mx-auto" />
        </div>
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-3xl p-6 sm:p-20 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center gap-4">
          <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-xl inline-block">
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="h-6 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
    </div>
  );
}

// Dynamic Import of Client Component
const EditTools = dynamic(() => import("@/components/tools/EditTools"), {
  loading: () => <EditToolsSkeleton />
});

export default function WatermarkPage() {
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

        {/* Interactive Watermarking Tool */}
        <section aria-label="PDF Watermarking Application" className="mb-16">
          <EditTools id="watermark" />
        </section>

        {/* Feature Cards Grid */}
        <section aria-label="Tool Benefits Quick Overview" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 animate-fade-in">
          {[
            { title: 'Text & Images', desc: 'Type custom labels (like DRAFT) or upload image/logo watermarks to stamp PDF pages.', icon: Stamp },
            { title: '100% Offline', desc: 'Watermarking is executed client-side in browser JS. Your files never touch a server.', icon: Shield },
            { title: 'Flexible Styling', desc: 'Fidelity is fully preserved. Fine-tune opacity, scale, page margins, and stamp rotation.', icon: Settings },
            { title: 'Works Everywhere', desc: 'No software to install. Works on any device — Windows, Mac, Linux, iOS, or Android.', icon: Globe },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group text-center flex flex-col items-center gap-3">
              <div className="inline-flex p-4 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform"><item.icon size={26} /></div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* 4. Complete SEO Optimized Content Section */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">

          <div className="mb-16 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-purple-500/10 dark:bg-purple-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-purple-600 dark:from-white dark:via-slate-200 dark:to-purple-500 bg-clip-text text-transparent">
              Watermark PDF Online <br />
              <span className="text-purple-600 dark:text-purple-450">Free, Fast & Secure</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Stamp custom text or graphic images onto your PDF documents in seconds. Process everything inside your web browser — no files are uploaded to any server.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is PDF Watermarking Card */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is PDF Watermark?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  A PDF watermark is an overlay image, logo, or text (such as "CONFIDENTIAL", "SAMPLE", or a company branding logo) stamped onto the document pages. Watermarks are crucial for protecting intellectual property, demarcating draft versions, preventing document fraud, and enforcing copyrights.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  With SmartPDFs Plus, your watermarking is executed <strong className="text-purple-550 font-black">100% locally in your web browser</strong> using native JavaScript libraries. Your files never touch our servers, guaranteeing complete document privacy and instant offline stamp execution.
                </p>
              </div>
            </div>

            {/* How to use the tool card */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-purple-500/10 text-purple-500"><ArrowRight size={24} /></span>
                How to Watermark PDFs in 3 Simple Steps
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />

                {[
                  { step: "01", title: "Select PDF File", desc: "Drag and drop your document or click the upload panel to choose a PDF from your computer or mobile device." },
                  { step: "02", title: "Apply Watermark", desc: "Type custom text labels or upload a branding image, then adjust rotation angle, transparency, and size." },
                  { step: "03", title: "Download Result", desc: "Click Apply Watermark and download your stamped PDF document instantly. Free from watermarks." }
                ].map((s, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-outfit text-lg font-black text-purple-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-purple-500/40 transition-all duration-300">
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
                <span className="p-2 rounded-xl bg-purple-500/10 text-purple-500"><Star size={24} /></span>
                Key Benefits & Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300"><Shield size={22} /></div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-green-500 transition-colors">100% Client-Side Privacy</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Security is our baseline. Our tool works locally inside your browser sandbox. It reads and stamps the PDFs directly in your computer's memory, so your files are never transmitted across the internet.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300"><Zap size={22} /></div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-purple-500 transition-colors">Flexible Styling Stamp</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Adjust watermark opacity, angles, scale font sizes, and select page bounds to place your stamps exactly where they are needed.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-855 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Supports both text stamping and visual image/logo overlays.",
                    "Quick transparency sliders to ensure background text remains readable.",
                    "Zero signup required — start watermarking immediately without accounts.",
                    "Mobile-friendly layouts that let you stamp documents on your phone."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                      <span className="p-0.5 rounded-full bg-purple-500/10 text-purple-650 mt-0.5 shrink-0"><Check size={12} /></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FAQ Block */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-purple-500/10 text-purple-500"><HelpCircle size={24} /></span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Is the watermarking tool secure?",
                    a: "Yes, absolutely. Unlike other online tools that upload your files to external servers, our PDF watermark tool performs the entire process 100% locally in your web browser. Your private documents never leave your computer."
                  },
                  {
                    q: "Can I adjust the transparency and angle of the watermark?",
                    a: "Yes. The editor provides slider controls to set custom transparency, rotate stamps to any angle, and scale font sizes."
                  },
                  {
                    q: "Can I stamp watermarks on specific pages?",
                    a: "Yes, you can specify individual page ranges or stamp the watermark across all pages in the PDF document."
                  },
                  {
                    q: "Will watermarking add extra file sizes?",
                    a: "Our system inserts lightweight overlay vectors, ensuring output file sizes remain small."
                  }
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden bg-slate-50/20 dark:bg-slate-900/20 open:bg-slate-50/50 dark:open:bg-slate-800/30 transition-all duration-300 text-left"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg">
                      <h3 className="text-base sm:text-base font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-purple-500 transition-colors pr-4">
                        {item.q}
                      </h3>
                      <span className="shrink-0 transition-transform duration-300 group-open:rotate-180 text-slate-400 group-hover:text-purple-500">
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
                className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 text-left focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none"
              >
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: t.gradient, boxShadow: `0 8px 20px -4px ${t.shadow}` }}>
                    <t.icon size={26} aria-hidden="true" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-700">{t.tag}</span>
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-purple-500 transition-colors">{t.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t.description}</p>
                </div>
                <div className="mt-auto pt-2 text-xs font-bold text-purple-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open tool <span aria-hidden="true">&#8594;</span></div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
