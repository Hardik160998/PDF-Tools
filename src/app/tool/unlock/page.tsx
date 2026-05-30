import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Unlock, Upload, KeyRound, Download, Lock, Stamp, Hash, Settings, PenLine, Combine,
  ArrowRight, HelpCircle, Info, Star, Check, ChevronDown, Zap, SplitSquareHorizontal, FileText
} from 'lucide-react';
import { CenteredCardSkeleton } from "@/app/tool/[id]/skeletons";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'SITE_OFFICIAL_DOMAIN';

// 1. Dynamic Metadata Export for Next.js App Router (Server-side)
export const metadata: Metadata = {
  title: 'Unlock PDF Online Free | Remove PDF Passwords & Restrictions',
  description: 'Unlock PDF files online for free. Remove password protection, printing, copying, and editing restrictions from any PDF securely and instantly.',
  keywords: 'unlock pdf, remove pdf password, free pdf unlocker online, decrypt pdf file, remove pdf restrictions, bypass pdf password, smartpdfs plus',
  alternates: {
    canonical: `${siteUrl}/tool/unlock`,
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
    title: 'Unlock PDF Online Free | Secure PDF Password Remover',
    description: 'Decrypted and unlock your password-protected PDF files instantly. Remove copy, print, and edit restrictions securely.',
    siteName: 'SmartPDFs Plus',
    url: `${siteUrl}/tool/unlock`,
    images: [
      {
        url: `${siteUrl}/img/protect-pdf.png`,
        width: 1200,
        height: 630,
        alt: 'Unlock PDF Documents Online - SmartPDFs Plus',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unlock PDF Online Free | Secure PDF Password Remover',
    description: 'Decrypted and unlock your password-protected PDF files instantly. Remove copy, print, and edit restrictions securely.',
    images: [`${siteUrl}/img/protect-pdf.png`],
  },
};

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Unlock PDF Online Free",
  "url": `${siteUrl}/tool/unlock`,
  "image": `${siteUrl}/img/protect-pdf.png`,
  "description": "Unlock password-protected PDF files online. Instantly strip password security and access limitations from any document.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires HTML5 support",
  "featureList": [
    "Decrypt secure PDF files",
    "Remove print, copy, and modify restrictions",
    "100% secure HTTPS transmission",
    "Automatic file deletion after 1 hour",
    "No registration or watermark"
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
      "name": "Unlock PDF",
      "item": `${siteUrl}/tool/unlock`
    }
  ]
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I unlock a password-protected PDF?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Upload your protected PDF file, enter the current password, and our unlock engine will decrypt the file and strip all access restrictions. You can then download your fully editable PDF."
      }
    },
    {
      "@type": "Question",
      "name": "Can I unlock a PDF if I do not know the password?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. For security and legal reasons, you must know the password to unlock the document. This tool is designed to remove protection and restrictions from PDF files you own."
      }
    },
    {
      "@type": "Question",
      "name": "Are my files kept secure during the unlock process?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. All uploads are encrypted via secure HTTPS protocols. Your files are automatically deleted from our secure servers within 1 hour after processing."
      }
    },
    {
      "@type": "Question",
      "name": "Does unlocking a PDF affect its formatting or quality?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Unlocking only alters the security dictionary inside the PDF structure. The visual content, images, text, and overall formatting of your document remain perfectly intact."
      }
    }
  ]
};

// 8. Internal links configuration
const RELATED = [
  { id: 'compress', title: 'Compress PDF', description: 'Reduce PDF file size without losing visible quality.', icon: Zap, gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)', tag: 'Optimize', href: '/tool/compress' },
  { id: 'split', title: 'Split PDF', description: 'Split a PDF into individual pages or custom page ranges.', icon: SplitSquareHorizontal, gradient: 'linear-gradient(135deg, #f97316, #c2410c)', shadow: 'rgba(249,115,22,0.3)', tag: 'Organize', href: '/tool/split' },
  { id: 'pdf-to-word', title: 'PDF to Word', description: 'Convert PDF files to editable Word documents online for free.', icon: FileText, gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'rgba(49,130,206,0.3)', tag: 'Convert', href: '/tool/pdf-to-word' },
  { id: 'protect', title: 'Protect PDF', description: 'Encrypt your PDF with a password to control who can open it.', icon: Lock, gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', shadow: 'rgba(239,68,68,0.3)', tag: 'Security', href: '/tool/protect' },
  { id: 'watermark', title: 'Watermark PDF', description: 'Stamp a text or image watermark over every page of your PDF.', icon: Stamp, gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', shadow: 'rgba(139,92,246,0.3)', tag: 'Edit', href: '/tool/watermark' },
  { id: 'merge', title: 'Merge PDF', description: 'Combine multiple PDF files into one document in the order you choose.', icon: Combine, gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)', tag: 'Organize', href: '/tool/merge' },
];

const SecurityToolsWrapper = dynamic(() => import("@/components/tools/SecurityToolsWrapper"), {
  loading: () => <CenteredCardSkeleton accent="#ef4444" />,
});

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
      <span className="text-slate-600 dark:text-slate-300" aria-current="page">Unlock PDF</span>
    </nav>
  );
}

export default function UnlockPage() {
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

        {/* Breadcrumb navigation */}
        <Breadcrumb />

        {/* Interactive PDF Unlock Tool */}
        <section aria-label="PDF Decryption Application" className="mb-16">
          <SecurityToolsWrapper id="unlock" />
        </section>

        {/* Feature Cards Grid */}
        <section aria-label="Tool Benefits Quick Overview" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { title: "Instant Decryption", desc: "Strip password security and restrictive permissions from your PDF files in a single click.", gradient: "linear-gradient(135deg,#ef4444,#b91c1c)" },
            { title: "Unlock Restrictions", desc: "Enable copying, printing, editing, and extracting on files that were restricted by authors.", gradient: "linear-gradient(135deg,#ef4444,#b91c1c)" },
            { title: "Secure Transmission", desc: "All files are processed through secure, encrypted connections and permanently wiped within an hour.", gradient: "linear-gradient(135deg,#10b981,#047857)" }
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-red-500/10 dark:bg-red-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-red-650 dark:from-white dark:via-slate-200 dark:to-red-500 bg-clip-text text-transparent">
              Unlock PDF Files Online <br />
              <span className="text-red-500 dark:text-red-400">Instantly & Safely</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Remove PDF passwords and restrictive locks on copying, printing, and modification. Free up your files immediately with our secure decryption engine.
            </p>
          </div>

          <article className="space-y-16">

            {/* What is PDF Unlocker Card */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-red-500/10 text-red-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is PDF Unlocking?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  PDF unlocking is the process of removing security restrictions that prevent users from opening, printing, copying text, or editing a PDF file. Often, authors lock documents to secure proprietary details, but this security can hinder legitimate workflows if passwords are lost or if restrictions need to be lifted.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  Our unlocker tool accesses the internal encryption tables of your PDF, strips the security dictionaries, and generates a new, unlocked version of the file. <strong className="text-red-500 font-black">Please note:</strong> to decrypt owner password protections (preventing opening), you must supply the original password. Once entered, all permissions (copying, editing, printing) are permanently enabled.
                </p>
              </div>
            </div>

            {/* How to use the tool card */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-red-500/10 text-red-500"><ArrowRight size={24} /></span>
                How to unlock PDFs in 3 Simple Steps
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                {/* Connecting Line */}
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />

                {[
                  { step: "01", title: "Select PDF File", desc: "Select or drop the password-protected PDF you own into the file workspace above." },
                  { step: "02", title: "Provide Password", desc: "Type the document's open password in the prompt box to authorize the removal of security locks." },
                  { step: "03", title: "Download Unlocked", desc: "Click the unlock action. Download your restrictions-free, watermark-free PDF instantly." }
                ].map((s, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-outfit text-lg font-black text-red-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-red-500/40 transition-all duration-300">
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
                <span className="p-2 rounded-xl bg-red-500/10 text-red-500"><Star size={24} /></span>
                Key Benefits & Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300"><Unlock size={22} /></div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-green-500 transition-colors">Instant Restriction Removal</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Remove editing limitations, printing locks, and blockages on copying text and images. Enjoy full authorization over your digital files within seconds.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300"><Lock size={22} /></div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">Secure Encrypted Session</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Your security is vital to us. All processes are fully encrypted, and all uploaded files are permanently deleted from our secure servers within 1 hour.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Strips editing limitations instantly, enabling copy/paste functionality.",
                    "Optimized for high-speed batching and security permissions modifications.",
                    "No credit card or user sign-up required for basic conversions.",
                    "Touch-friendly controls optimized for mobile, tablet, and desktop viewports."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                      <span className="p-0.5 rounded-full bg-red-500/10 text-red-650 mt-0.5 shrink-0"><Check size={12} /></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FAQ Block */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-red-500/10 text-red-500"><HelpCircle size={24} /></span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "How do I unlock a password-protected PDF?",
                    a: "Upload your protected PDF file, enter the current password, and our unlock engine will decrypt the file and strip all access restrictions. You can then download your fully editable PDF."
                  },
                  {
                    q: "Can I unlock a PDF if I do not know the password?",
                    a: "No. For security and legal reasons, you must know the password to unlock the document. This tool is designed to remove protection and restrictions from PDF files you own."
                  },
                  {
                    q: "Are my files kept secure during the unlock process?",
                    a: "Yes. All uploads are encrypted via secure HTTPS protocols. Your files are automatically deleted from our secure servers within 1 hour after processing."
                  },
                  {
                    q: "Does unlocking a PDF affect its formatting or quality?",
                    a: "No. Unlocking only alters the security dictionary inside the PDF structure. The visual content, images, text, and overall formatting of your document remain perfectly intact."
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
