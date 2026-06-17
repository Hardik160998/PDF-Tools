import RelatedTools from "@/components/tools/RelatedTools";
import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from "@/components/seo/WebAppSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import Link from "next/link";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  Hash,
  Upload,
  AlignRight,
  Download,
  Stamp,
  Settings,
  Lock,
  Unlock,
  PenLine,
  Combine,
  CheckCircle,
  Shield,
  Zap,
  Info,
  ArrowRight,
  Star,
  Check,
  HelpCircle,
  ChevronDown,
  Loader2,
  Globe,
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

// 1. Dynamic Metadata Export for Next.js App Router

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF Page Numbering Tool Online Free",
  url: `${siteUrl}/tool/page-numbers`,
  image: `${siteUrl}/img/snapdeal-label.png`,
  description:
    "Add professional page numbers to your PDF documents automatically online for free. Customize font, size, position, and 100% secure local browser processing.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "100% Local processing in your browser",
    "No file uploads to servers",
    "Customize numbering position and alignments",
    "Exclude specific page ranges (e.g. cover page)",
    "Fast and free with no watermark",
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
      name: "Page Numbers",
      item: `${siteUrl}/tool/page-numbers`,
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is the page numbering tool secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, absolutely. Unlike other online tools that upload your files to external servers, our PDF numbering tool performs the entire process 100% locally in your web browser. Your private documents never leave your computer.",
      },
    },
    {
      "@type": "Question",
      name: "Can I customize the position and styling of page numbers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The editor provides setting panels to position numbers at the top/bottom left, center, or right, adjust margins, and select starting values.",
      },
    },
    {
      "@type": "Question",
      name: "Can I omit page numbering from the first page?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can exclude specific page ranges (such as cover pages or tables of contents) from the numbering process.",
      },
    },
    {
      "@type": "Question",
      name: "Will page numbers overlap with my existing page text?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The editor allows you to set custom margins, letting you position numbers cleanly outside your main paragraph text grids.",
      },
    },
  ],
};

// 8. Internal links configuration


// 12. Breadcrumb Navigation Component
function Breadcrumb() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500"
    >
      <Link
        href="/"
        className="hover:text-indigo-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
      >
        Home
      </Link>
      <span aria-hidden="true">/</span>
      <Link
        href="/tool"
        className="hover:text-indigo-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
      >
        Tools
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-slate-600 dark:text-slate-300" aria-current="page">
        Page Numbers
      </span>
    </nav>
  );
}

// 5. Loading Skeleton to Improve Core Web Vitals (CLS)
function EditToolsSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-12 px-2 sm:px-4 text-center animate-pulse">
      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta("page-numbers");
        return meta ? (
          <>
            <WebAppSchema
              name={`${meta.title} – Free Online Tool`}
              description={meta.description}
              url={getToolUrl("page-numbers")}
            />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema
              items={[
                { label: "Tools", href: "/#tools" },
                { label: meta.title, href: `/tool/page-numbers` },
              ]}
            />
          </>
        ) : null;
      })()}

      <div className="bg-white dark:bg-slate-800 rounded-[1.2rem] sm:rounded-[2.5rem] p-4 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-5 sm:space-y-10">
        <div className="space-y-2 sm:space-y-4 flex flex-col items-center">
          <div className="inline-flex p-3 sm:p-5 rounded-xl sm:rounded-3xl bg-slate-100 dark:bg-slate-700 text-slate-350 font-bold">
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
  loading: () => <EditToolsSkeleton />,
});

export function generateMetadata() {
  const id = "page-numbers";
  const meta = getToolMeta(id);
  if (!meta) return { title: "PDF Tool | SmartPDFPro" };

  const url = getToolUrl(id);
  return {
    title: `${meta.title} | SmartPDFPro`,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: `${meta.title} | SmartPDFPro`,
      description: meta.description,
      url,
      siteName: "SmartPDFPro",
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} | SmartPDFPro`,
      description: meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
      },
    },
  };
}

export default function PageNumbersPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* 2. Structured data scripts for search indexing */}

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumb />

        {/* Interactive Page Numbering Tool */}
        <section aria-label="PDF Page Numbering Application" className="mb-16">
          <EditTools id="page-numbers" />
        </section>

        <RelatedTools />

        {/* -- RELATED BLOG POSTS -- */}
        <section className="mb-20 text-left mt-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 border border-red-100 text-xs font-medium uppercase tracking-widest shadow-sm mb-6">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                  Latest from Blog
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4 text-center">
                  Explore Our PDF Guides
              </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {/* Blog Post 1: Organizing PDFs */}
            <a href="/blog/organize-pdf-pages" className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
                <div className="p-6 flex flex-col flex-1 gap-3">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#a855f7] rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="14" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-slate-800 text-[17px] leading-snug group-hover:text-red-600 transition-colors">
                            How to Organize PDF Pages — Visual Reordering Guide
                        </h3>
                    </div>
                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            4 min read &nbsp; May 10, 2026
                        </div>
                        <span className="text-sm font-bold text-red-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read <ArrowRight size={14} />
                        </span>
                    </div>
                </div>
            </a>

            {/* Blog Post 2: Ultimate Guide to Organizing PDFs */}
            <a href="/blog/ultimate-guide-to-organizing-pdfs" className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
                <div className="p-6 flex flex-col flex-1 gap-3">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#a855f7] rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="14" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-slate-800 text-[17px] leading-snug group-hover:text-red-600 transition-colors">
                            The Ultimate Guide to Organizing PDFs — Merge, Split & Rearrange
                        </h3>
                    </div>
                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            5 min read &nbsp; May 5, 2026
                        </div>
                        <span className="text-sm font-bold text-red-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read <ArrowRight size={14} />
                        </span>
                    </div>
                </div>
            </a>

            {/* Blog Post 3: Organize Large PDFs */}
            <a href="/blog/organize-large-pdf-documents-business" className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
                <div className="p-6 flex flex-col flex-1 gap-3">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#2563eb] rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                            </svg>
                        </div>
                        <h3 className="font-bold text-slate-800 text-[17px] leading-snug group-hover:text-red-600 transition-colors">
                            How to Organize Large PDF Documents for Business Use
                        </h3>
                    </div>
                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            7 min read &nbsp; Jun 18, 2026
                        </div>
                        <span className="text-sm font-bold text-red-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read <ArrowRight size={14} />
                        </span>
                    </div>
                </div>
            </a>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section
          aria-label="Tool Benefits Quick Overview"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 animate-fade-in"
        >
          {[
            {
              title: "Number Placement",
              desc: "Add page numbers to your PDF at any corner or header/footer boundary cleanly.",
              icon: Hash,
            },
            {
              title: "100% Offline",
              desc: "Numbering is executed client-side in browser JS. Your files never touch a server.",
              icon: Shield,
            },
            {
              title: "Flexible Styling",
              desc: "Fidelity is fully preserved. Fine-tune layout margins, start index, and ranges.",
              icon: Settings,
            },
            {
              title: "Works Everywhere",
              desc: "No software to install. Works on any device — Windows, Mac, Linux, iOS, or Android.",
              icon: Globe,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group text-center flex flex-col items-center gap-3"
            >
              <div className="inline-flex p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform">
                <item.icon size={26} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </section>

        {/* 4. Complete SEO Optimized Content Section */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">
          <div className="mb-16 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />

            <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-indigo-600 dark:from-white dark:via-slate-200 dark:to-indigo-500 bg-clip-text text-transparent">
              Add Page Numbers to PDF <br />
              <span className="text-indigo-500 dark:text-indigo-450">
                Free, Fast & Secure
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Insert page numbers into your PDF documents in seconds. Process
              everything inside your web browser — no files are uploaded to any
              server.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is PDF Page Numbering Card */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is PDF Page Numbering?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  PDF page numbering is the process of embedding sequence
                  numbers (such as Page 1, 2, 3 or document section numbering)
                  into the layout of PDF documents. Page numbers are crucial for
                  organizing printouts, legal brief compliance, corporate filing
                  protocols, and academic layouts.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  With SmartPDFs Pro, your numbering is executed{" "}
                  <strong className="text-indigo-550 font-bold">
                    100% locally in your web browser
                  </strong>
                  {" "}
                  using native JavaScript libraries. Your files never touch our
                  servers, guaranteeing complete document privacy and instant
                  offline stamp execution.
                </p>
              </div>
            </div>

            {/* How to use the tool card */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <ArrowRight size={24} />
                </span>
                How to add Page Numbers in 3 Simple Steps
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />

                {[
                  {
                    step: "01",
                    title: "Select PDF File",
                    desc: "Drag and drop your document or click the upload panel to choose a PDF from your computer or mobile device.",
                  },
                  {
                    step: "02",
                    title: "Set Positions",
                    desc: "Select number styles, align top/bottom borders, define margins, and choose target page indexes.",
                  },
                  {
                    step: "03",
                    title: "Apply & Download",
                    desc: "Click Apply Page Numbers and download your numbered PDF instantly. Ready to share.",
                  },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="relative z-10 flex flex-col gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-indigo-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-indigo-500/40 transition-all duration-300">
                      {s.step}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">
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
                <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <Star size={24} />
                </span>
                Key Benefits & Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Shield size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-green-500 transition-colors">
                    100% Client-Side Privacy
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Security is our baseline. Our tool works locally inside your
                    browser sandbox. It reads and numbers the PDFs directly in
                    your computer's memory, so your files are never transmitted
                    across the internet.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Zap size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-indigo-500 transition-colors">
                    Flexible Spacing Formats
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Select number alignments, starting indexes, formatting
                    boundaries, and exclude specific cover layouts from page
                    numbering.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-855 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Supports sequence alignments and start offsets.",
                    "Quick layout margins to avoid overlapping text files.",
                    "Zero signup required — start page numbering immediately without accounts.",
                    "Mobile-friendly layouts that let you stamp page numbers on your phone.",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium"
                    >
                      <span className="p-0.5 rounded-full bg-indigo-500/10 text-indigo-650 mt-0.5 shrink-0">
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
                <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Is the page numbering tool secure?",
                    a: "Yes, absolutely. Unlike other online tools that upload your files to external servers, our PDF numbering tool performs the entire process 100% locally in your web browser. Your private documents never leave your computer.",
                  },
                  {
                    q: "Can I customize the position and styling of page numbers?",
                    a: "Yes. The editor provides setting panels to position numbers at the top/bottom left, center, or right, adjust margins, and select starting values.",
                  },
                  {
                    q: "Can I omit page numbering from the first page?",
                    a: "Yes. You can exclude specific page ranges (such as cover pages or tables of contents) from the numbering process.",
                  },
                  {
                    q: "Will page numbers overlap with my existing page text?",
                    a: "The editor allows you to set custom margins, letting you position numbers cleanly outside your main paragraph text grids.",
                  },
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                      <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <HelpCircle size={22} className="text-indigo-500 shrink-0" />
                        {item.q}
                      </span>
                      <ChevronDown
                        size={18}
                        className="text-slate-400 transition-transform duration-300 group-open:rotate-180 shrink-0 ml-4"
                      />
                    </summary>
                    <div className="mx-6 pb-6 border-t border-slate-200 dark:border-slate-800 pt-4">
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </article>
        </section>

        
      </div>
    </main>
  );
}
