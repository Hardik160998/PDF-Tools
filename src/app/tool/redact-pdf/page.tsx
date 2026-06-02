import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from '@/components/seo/WebAppSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import dynamic from "next/dynamic";
import Link from "next/link";
import type { Metadata } from "next";
import {
  EyeOff,
  Upload,
  Shield,
  Download,
  Combine,
  Lock,
  Unlock,
  Layers,
  GitCompare,
  ArrowRight,
  HelpCircle,
  Info,
  Star,
  Check,
  ChevronDown,
  Trash2,
  Zap,
  SplitSquareHorizontal,
  FileText,
} from "lucide-react";
import { CenteredCardSkeleton } from "@/app/tool/[id]/skeletons";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

// 1. Dynamic Metadata Export for Next.js App Router (Server-side)


// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Redact PDF Online Free",
  url: `${siteUrl}/tool/redact-pdf`,
  image: `${siteUrl}/img/redact-pdf.png`,
  description:
    "Permanently redact and black out sensitive text and images from PDF files online. Process documents securely in your web browser.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "100% Local processing in your browser",
    "No server file uploads",
    "Draw black boxes to redact content",
    "Keyword search and auto-redaction",
    "Instant download with no watermarks",
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
      name: "Redact PDF",
      item: `${siteUrl}/tool/redact-pdf`,
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is this PDF redaction tool safe for confidential files?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, absolutely. Unlike other online services that upload your documents to remote servers, our tool processes all PDF files 100% locally in your web browser. Your private data never leaves your computer.",
      },
    },
    {
      "@type": "Question",
      name: "Does this tool actually remove redacted text or just hide it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our tool permanently deletes and strips the redacted text and vector paths under the black boxes. It doesn't just overlay color; it ensures the underlying content cannot be highlighted, copied, or recovered by search tools or conversions.",
      },
    },
    {
      "@type": "Question",
      name: "How does keyword-based auto-redaction work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can select the 'Search' mode, type a keyword or phrase, and our tool will find all matching text occurrences across all pages of your PDF and automatically apply redaction boxes to them instantly.",
      },
    },
    {
      "@type": "Question",
      name: "Will using the PDF redaction tool add any watermarks?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. We believe in providing clean, professional outputs. The redacted PDF is downloaded in high quality without any watermarks or added logos.",
      },
    },
  ],
};

// 8. Internal links configuration
const RELATED = [
  {
    id: "compress",
    title: "Compress PDF",
    description: "Reduce PDF file size without losing visible quality.",
    icon: Zap,
    gradient: "linear-gradient(135deg, #22c55e, #15803d)",
    shadow: "rgba(34,197,94,0.3)",
    tag: "Optimize",
  },
  {
    id: "split",
    title: "Split PDF",
    description: "Split a PDF into individual pages or custom page ranges.",
    icon: SplitSquareHorizontal,
    gradient: "linear-gradient(135deg, #f97316, #c2410c)",
    shadow: "rgba(249,115,22,0.3)",
    tag: "Organize",
  },
  {
    id: "pdf-to-word",
    title: "PDF to Word",
    description:
      "Convert PDF files to editable Word documents online for free.",
    icon: FileText,
    gradient: "linear-gradient(135deg, #3182ce, #1e3a8a)",
    shadow: "rgba(49,130,206,0.3)",
    tag: "Convert",
  },
  {
    id: "protect",
    title: "Protect PDF",
    description: "Encrypt your PDF with a password to control who can open it.",
    icon: Lock,
    gradient: "linear-gradient(135deg, #ef4444, #b91c1c)",
    shadow: "rgba(239,68,68,0.3)",
    tag: "Security",
  },
  {
    id: "unlock",
    title: "Unlock PDF",
    description:
      "Remove password protection and restrictions from a PDF instantly.",
    icon: Unlock,
    gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    shadow: "rgba(139,92,246,0.3)",
    tag: "Security",
  },
  {
    id: "watermark",
    title: "Watermark PDF",
    description: "Stamp a text or image watermark over every page of your PDF.",
    icon: Shield,
    gradient: "linear-gradient(135deg, #10b981, #047857)",
    shadow: "rgba(16,185,129,0.3)",
    tag: "Edit",
  },
];

import CreditGate from "@/components/credits/CreditGate";

const RedactPdfWrapper = dynamic(
  () => import("@/components/tools/RedactPdfWrapper"),
  {
    loading: () => <CenteredCardSkeleton accent="#ef4444" />,
  },
);

// 12. Breadcrumb Navigation Component
function Breadcrumb() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500"
    >
      <Link
        href="/"
        className="hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-1"
      >
        Home
      </Link>
      <span aria-hidden="true">/</span>
      <Link
        href="/tool"
        className="hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-1"
      >
        Tools
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-slate-600 dark:text-slate-300" aria-current="page">
        Redact PDF
      </span>
    </nav>
  );
}


export function generateMetadata() {
  const id = 'redact-pdf';
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

export default function RedactPdfPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta('redact-pdf');
        return meta ? (
          <>
            <WebAppSchema name={`${meta.title} – Free Online Tool`} description={meta.description} url={getToolUrl('redact-pdf')} />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema items={[{ label: 'Tools', href: '/#tools' }, { label: meta.title, href: `/tool/redact-pdf` }]} />
          </>
        ) : null;
      })()}

      {/* 2. Structured data scripts for search indexing */}
      
      
      

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">
        {/* Breadcrumb navigation */}
        <Breadcrumb />

        {/* Interactive PDF Redaction Tool */}
        <section aria-label="PDF Redaction Application" className="mb-16">
          <CreditGate toolName="redact-pdf" showCounter={false}>
            <RedactPdfWrapper id="redact-pdf" />
          </CreditGate>
        </section>

        {/* Feature Cards Grid */}
        <section
          aria-label="Tool Benefits Quick Overview"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {[
            {
              title: "Military-Grade Redaction",
              desc: "Permanently delete underlying content beneath blackout boxes. Safe from highlight and extraction.",
              gradient: "linear-gradient(135deg,#ef4444,#b91c1c)",
            },
            {
              title: "Smart Auto-Search",
              desc: "Search for text strings or pattern values to redact all matching occurrences instantly.",
              gradient: "linear-gradient(135deg,#ef4444,#b91c1c)",
            },
            {
              title: "100% Secure & Client-Side",
              desc: "Files never leave your machine. Processing runs inside your browser using secure client logic.",
              gradient: "linear-gradient(135deg,#10b981,#047857)",
            },
          ].map((feat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group text-left"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg"
                style={{ background: feat.gradient }}
              >
                <div className="text-white font-black" aria-hidden="true">
                  {i + 1}
                </div>
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

        {/* 4. Complete SEO Optimized Content Section */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">
          <div className="mb-16 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-red-500/10 dark:bg-red-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-red-600 dark:from-white dark:via-slate-200 dark:to-red-500 bg-clip-text text-transparent">
              Redact PDF Files Online <br />
              <span className="text-red-500 dark:text-red-400">
                Securely & Free
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Remove confidential content, private data, passwords, and
              sensitive images from your PDF files. Our client-side editor
              ensures complete privacy with no document uploads required.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is PDF Redaction Card */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-red-500/10 text-red-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is PDF Redaction?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  PDF Redaction is the process of permanently removing visible
                  text and graphics from a PDF document. It is widely used by
                  lawyers, government bodies, businesses, and individuals before
                  distributing documents to prevent leaks of proprietary
                  information, personal identifiers (PII), or financial data.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  Traditional converters only mask text with color overlays,
                  leaving the source text queryable and extractable. SmartPDFs
                  Plus uses native Client-side WebAssembly to{" "}
                  <strong className="text-red-500 font-black">
                    physically erase and overwrite
                  </strong>{" "}
                  the targeted source content in the PDF structure. Redacted
                  fields are permanently purged from your computer's memory.
                </p>
              </div>
            </div>

            {/* How to use the tool card */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-red-500/10 text-red-500">
                  <ArrowRight size={24} />
                </span>
                How to redact PDFs in 3 Simple Steps
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                {/* Connecting Line */}
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />

                {[
                  {
                    step: "01",
                    title: "Upload PDF",
                    desc: "Select or drop your PDF. The file is loaded securely in your browser's local sandbox memory.",
                  },
                  {
                    step: "02",
                    title: "Select Content",
                    desc: "Draw redact rectangles manually, or switch to search mode to auto-mask specific text strings.",
                  },
                  {
                    step: "03",
                    title: "Apply & Save",
                    desc: "Click 'Apply' to purge data, then download the finalized PDF with zero watermarks added.",
                  },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="relative z-10 flex flex-col gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-outfit text-lg font-black text-red-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-red-500/40 transition-all duration-300">
                      {s.step}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        {s.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Benefits and Features */}
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                <span className="p-2 rounded-xl bg-red-500/10 text-red-500">
                  <Star size={24} />
                </span>
                Key Benefits & Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Shield size={22} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-green-500 transition-colors">
                    Complete Privacy Sandbox
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Privacy is not an afterthought, it is our core architecture.
                    Files are processed within your browser via native client
                    libraries. Your documents are never uploaded to any external
                    server.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <EyeOff size={22} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">
                    Erase vs Masking
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Other tools just draw black rectangles on top of text,
                    leaving it searchable. Our tool deletes the underlying
                    stream content, making it securely non-retrievable.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Supports keyboard navigation and quick canvas magnification.",
                    "Auto-redacts target names or values across all pages automatically.",
                    "Absolutely zero registration or login needed for basic features.",
                    "Vibrant, responsive design optimized for desktop and mobile tablets.",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium"
                    >
                      <span className="p-0.5 rounded-full bg-red-500/10 text-red-650 mt-0.5 shrink-0">
                        <Check size={12} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FAQ Block */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-red-500/10 text-red-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Is this PDF redaction tool safe for confidential files?",
                    a: "Yes, absolutely. Unlike other online services that upload your documents to remote servers, our tool processes all PDF files 100% locally in your web browser. Your private data never leaves your computer.",
                  },
                  {
                    q: "Does this tool actually remove redacted text or just hide it?",
                    a: "Our tool permanently deletes and strips the redacted text and vector paths under the black boxes. It doesn't just overlay color; it ensures the underlying content cannot be highlighted, copied, or recovered by search tools or conversions.",
                  },
                  {
                    q: "How does keyword-based auto-redaction work?",
                    a: "You can select the 'Search' mode, type a keyword or phrase, and our tool will find all matching text occurrences across all pages of your PDF and automatically apply redaction boxes to them instantly.",
                  },
                  {
                    q: "Will using the PDF redaction tool add any watermarks?",
                    a: "No. We believe in providing clean, professional outputs. The redacted PDF is downloaded in high quality without any watermarks or added logos.",
                  },
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden bg-slate-50/20 dark:bg-slate-900/20 open:bg-slate-50/50 dark:open:bg-slate-800/30 transition-all duration-300 text-left"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg">
                      <h3 className="text-base sm:text-base font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-red-500 transition-colors pr-4">
                        {item.q}
                      </h3>
                      <span className="shrink-0 transition-transform duration-300 group-open:rotate-180 text-slate-400 group-hover:text-red-500">
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
            {RELATED.map((t) => (
              <Link
                key={t.id}
                href={`/tool/${t.id}`}
                title={`Use the ${t.title} tool`}
                aria-label={`Open the ${t.title} tool to ${t.description.toLowerCase()}`}
                className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 text-left focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                    style={{
                      background: t.gradient,
                      boxShadow: `0 8px 20px -4px ${t.shadow}`,
                    }}
                  >
                    <t.icon size={26} aria-hidden="true" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-700">
                    {t.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-red-500 transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {t.description}
                  </p>
                </div>
                <div className="mt-auto pt-2 text-xs font-bold text-red-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open tool <span aria-hidden="true">&#8594;</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
