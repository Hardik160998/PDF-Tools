import Link from "next/link";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  PenLine,
  Stamp,
  FileDigit,
  Settings,
  EyeOff,
  Bookmark,
  Layers,
  CheckCircle,
  Info,
  ArrowRight,
  Star,
  Check,
  HelpCircle,
  ChevronDown,
  Loader2,
  Shield,
  Zap,
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

// 1. Dynamic Metadata Export for Next.js App Router
export const metadata: Metadata = {
  title: "Free Online PDF Editor - Edit PDF Files Directly in Browser",
  description:
    "Edit PDF documents online for free. Add text, insert images, draw annotations, and redact content locally inside your browser with 100% privacy.",
  keywords:
    "edit pdf online, free pdf editor, write on pdf, annotate pdf, redact pdf, edit pdf text, smartpdfs plus",
  alternates: {
    canonical: `${siteUrl}/edit`,
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
    title: "Free Online PDF Editor - Edit PDF Files Directly in Browser",
    description:
      "Edit PDF documents online for free. Add text, insert images, draw annotations, and redact content locally inside your browser with 100% privacy.",
    siteName: "SmartPDFs Plus",
    url: `${siteUrl}/edit`,
    images: [
      {
        url: `${siteUrl}/img/snapdeal-label.png`,
        width: 1200,
        height: 630,
        alt: "Edit PDF Tool Online - SmartPDFs Plus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online PDF Editor - Edit PDF Files Directly in Browser",
    description:
      "Edit PDF documents online for free. Add text, insert images, draw annotations, and redact content locally inside your browser with 100% privacy.",
    images: [`${siteUrl}/img/snapdeal-label.png`],
  },
};

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free Online PDF Editor",
  url: `${siteUrl}/edit`,
  image: `${siteUrl}/img/snapdeal-label.png`,
  description:
    "Edit PDF documents online for free. Add text, insert images, draw annotations, and redact content locally inside your browser with 100% privacy.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "100% Local browser processing",
    "Add rich interactive text overlay fields",
    "Place, crop, and scale custom images",
    "Redact or white-out sensitive content details",
    "Fast, free, and no watermark tags",
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
      name: "Edit PDF",
      item: `${siteUrl}/edit`,
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I edit existing text in a PDF with this tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can add new text blocks, place shapes, add images, and draw annotations. To modify existing text, you can use our white-out/redaction tool to cover the original text and write new text over it.",
      },
    },
    {
      "@type": "Question",
      name: "Is this online PDF editor really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! You can edit, annotate, and modify your PDFs completely for free with no watermarks and no sign-up required.",
      },
    },
    {
      "@type": "Question",
      name: "How secure is this online PDF editor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our editor runs 100% client-side in your web browser. Your files are never uploaded to any server or cloud, meaning your private data remains completely private.",
      },
    },
    {
      "@type": "Question",
      name: "Does the edited PDF work in other viewers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All edits are compiled into standard PDF elements compatible with Adobe Acrobat Reader, Google Chrome, Apple Preview, and other readers.",
      },
    },
  ],
};

// 8. Internal links configuration
const RELATED = [
  {
    id: "watermark",
    title: "Watermark PDF",
    description: "Stamp a text or image watermark over every page of your PDF.",
    icon: Stamp,
    gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    shadow: "rgba(139,92,246,0.3)",
    tag: "Edit",
  },
  {
    id: "page-numbers",
    title: "Page Numbers",
    description:
      "Add professional page numbers to any position on your PDF pages.",
    icon: FileDigit,
    gradient: "linear-gradient(135deg, #6366f1, #4338ca)",
    shadow: "rgba(99,102,241,0.3)",
    tag: "Edit",
  },
  {
    id: "metadata",
    title: "Edit Metadata",
    description:
      "Update Author, Title, Subject and other document metadata fields.",
    icon: Settings,
    gradient: "linear-gradient(135deg, #64748b, #334155)",
    shadow: "rgba(100,116,139,0.3)",
    tag: "Edit",
  },
  {
    id: "redact-pdf",
    title: "Redact PDF",
    description:
      "Permanently black out sensitive text and images from your PDF.",
    icon: EyeOff,
    gradient: "linear-gradient(135deg, #e53e3e, #7f1d1d)",
    shadow: "rgba(229,62,62,0.3)",
    tag: "Security",
  },
  {
    id: "bookmark-pdf",
    title: "Bookmark PDF",
    description: "Add clickable bookmarks and a table of contents to your PDF.",
    icon: Bookmark,
    gradient: "linear-gradient(135deg, #f26522, #c2410c)",
    shadow: "rgba(242,101,34,0.3)",
    tag: "Edit",
  },
  {
    id: "flatten-pdf",
    title: "Flatten PDF",
    description:
      "Flatten form fields and annotations into the PDF page content.",
    icon: Layers,
    gradient: "linear-gradient(135deg, #0ea5e9, #0369a1)",
    shadow: "rgba(14,165,233,0.3)",
    tag: "Edit",
  },
];

// 12. Breadcrumb Navigation Component
function Breadcrumb() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500"
    >
      <Link
        href="/"
        className="hover:text-pink-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded px-1"
      >
        Home
      </Link>
      <span aria-hidden="true">/</span>
      <Link
        href="/tool"
        className="hover:text-pink-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded px-1"
      >
        Tools
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-slate-600 dark:text-slate-300" aria-current="page">
        Edit PDF
      </span>
    </nav>
  );
}

// 5. Loading Skeleton to Improve Core Web Vitals (CLS)
function EditSkeleton() {
  return (
    <div className="max-w-[1600px] mx-auto py-4 sm:py-6 px-2 sm:px-4 text-center animate-pulse">
      <div className="bg-white dark:bg-slate-800 rounded-[1.2rem] sm:rounded-[2.5rem] p-4 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-6 sm:space-y-10">
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
const PdfEditor = dynamic(() => import("@/components/tools/PdfEditor"), {
  loading: () => <EditSkeleton />,
});

export default function EditPage() {
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

      <div className="max-w-[1600px] mx-auto px-4 pt-8 sm:pt-12 pb-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumb />

        {/* Interactive PdfEditor Tool */}
        <section aria-label="PDF Editor Application" className="mb-16">
          <PdfEditor />
        </section>

        {/* Premium Banner */}
        <section className="py-6 mb-12" aria-label="Premium Upgrades">
          <div className="relative overflow-hidden rounded-2xl border border-pink-100 dark:border-pink-500/20 shadow-lg bg-gradient-to-br from-[#fdf2f8] via-[#fce7f3] to-[#fbcfe8]/20 dark:from-[#1e293b] dark:via-[#1e293b] dark:to-[#831843]/20">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 80% 50%,rgba(219,39,119,0.12) 0%,transparent 70%)",
              }}
            />
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5">
              <div className="flex items-center gap-4 text-left">
                <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md bg-gradient-to-br from-[#db2777] to-[#9d174d]">
                  <Star size={22} className="fill-white/20" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-slate-100">
                    Unlock SmartPDFs Plus — Go Premium
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Vector path drawings · Layer sorting tools · Advanced
                    metadata editor · Priority processing
                  </p>
                </div>
              </div>
              <Link
                href="/premium-plans"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-black uppercase tracking-widest shadow-md transition-transform hover:scale-105 bg-gradient-to-br from-[#db2777] to-[#9d174d]"
              >
                Upgrade Now <span aria-hidden="true">&#8594;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section
          aria-label="Tool Benefits Quick Overview"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {[
            {
              title: "Interactive Overlays",
              desc: "Easily overlay text blocks, headers, signature panels, or note blocks on any page coordinate.",
              gradient: "linear-gradient(135deg,#db2777,#9d174d)",
            },
            {
              title: "Custom Image Insertion",
              desc: "Place external PNG/JPG graphics, crop images, scale overlays, and position icons precisely.",
              gradient: "linear-gradient(135deg,#db2777,#9d174d)",
            },
            {
              title: "100% Secure & Private",
              desc: "Your documents never touch a server. All canvas drawing and merging run locally on your device.",
              gradient: "linear-gradient(135deg,#22c55e,#15803d)",
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-pink-500/10 dark:bg-pink-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-pink-600 dark:from-white dark:via-slate-200 dark:to-pink-500 bg-clip-text text-transparent">
              Free Online PDF Editor <br />
              <span className="text-pink-500 dark:text-pink-400">
                Edit PDF Files in Your Browser
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Add text, write notes, drop images, draw shapes, and mask
              sensitive page areas. Edit files locally with absolute compliance
              and total privacy.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is PDF Editor Card */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-pink-500/10 text-pink-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is the Online PDF Editor?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  An online PDF editor lets you annotate and draw on top of PDF
                  page coordinates. Whether you are correcting errors, adding
                  custom watermarks, placing signature blocks, or white-out
                  masking incorrect text structures, our editor offers a suite
                  of tools that runs directly inside your internet browser.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  SmartPDFs Plus processes your documents{" "}
                  <strong className="text-pink-600 font-black dark:text-pink-450">
                    100% locally in your browser's memory
                  </strong>
                  . No uploads are sent to server folders, which completely
                  eliminates data intercept risks and ensures instant rendering.
                </p>
              </div>
            </div>

            {/* How to use the tool card */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-pink-500/10 text-pink-500">
                  <ArrowRight size={24} />
                </span>
                How to Edit PDF Online in 3 Simple Steps
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />

                {[
                  {
                    step: "01",
                    title: "Select PDF Document",
                    desc: "Drag and drop your PDF file or click browse to load the file directly in the local browser canvas.",
                  },
                  {
                    step: "02",
                    title: "Add Text, Images & Marks",
                    desc: "Use the top panel options to type text overlays, draw shapes, redact paragraphs, or paste graphics.",
                  },
                  {
                    step: "03",
                    title: "Download Updated PDF",
                    desc: "Confirm the page layout edits and download your final, watermark-free document instantly.",
                  },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="relative z-10 flex flex-col gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-outfit text-lg font-black text-pink-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-pink-500/40 transition-all duration-300">
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
                <span className="p-2 rounded-xl bg-pink-500/10 text-pink-500">
                  <Star size={24} />
                </span>
                Key Features & Benefits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Shield size={22} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-green-500 transition-colors">
                    100% Local privacy
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Security is our core policy. Unlike other platforms that
                    request file transfers to their servers, your files remain
                    strictly local on your storage system.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <PenLine size={22} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-pink-500 transition-colors">
                    Rich editing elements
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Quickly place dynamic text containers, add high-quality logo
                    images, white-out private information, and save the updated
                    file without any watermarks.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-855 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Supports large visual documents with automatic thumbnail preview compilation.",
                    "Quick layout zoom controls for precise editing coordinate selections.",
                    "Zero account requirements — start editing files instantly without registration.",
                    "Touch-friendly sliders for smooth mobile page navigation.",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium"
                    >
                      <span className="p-0.5 rounded-full bg-pink-500/10 text-pink-600 mt-0.5 shrink-0">
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
                <span className="p-2 rounded-xl bg-pink-500/10 text-pink-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Can I edit existing text in a PDF with this tool?",
                    a: "You can add new text blocks, place shapes, add images, and draw annotations. To modify existing text, you can use our white-out/redaction tool to cover the original text and write new text over it.",
                  },
                  {
                    q: "Is this online PDF editor really free?",
                    a: "Yes! You can edit, annotate, and modify your PDFs completely for free with no watermarks and no sign-up required.",
                  },
                  {
                    q: "How secure is this online PDF editor?",
                    a: "Our editor runs 100% client-side in your web browser. Your files are never uploaded to any server or cloud, meaning your private data remains completely private.",
                  },
                  {
                    q: "Does the edited PDF work in other viewers?",
                    a: "Yes. All edits are compiled into standard PDF elements compatible with Adobe Acrobat Reader, Google Chrome, Apple Preview, and other readers.",
                  },
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden bg-slate-50/20 dark:bg-slate-900/20 open:bg-slate-50/50 dark:open:bg-slate-800/30 transition-all duration-300 text-left"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded-lg">
                      <h3 className="text-base sm:text-base font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-pink-500 transition-colors pr-4">
                        {item.q}
                      </h3>
                      <span className="shrink-0 transition-transform duration-300 group-open:rotate-180 text-slate-400 group-hover:text-pink-500">
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
            {RELATED.map((t) => (
              <Link
                key={t.id}
                href={t.id.startsWith("/") ? t.id : `/tool/${t.id}`}
                title={`Use the ${t.title} tool`}
                aria-label={`Open the ${t.title} tool to ${t.description.toLowerCase()}`}
                className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 text-left focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:outline-none"
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
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-pink-500 transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {t.description}
                  </p>
                </div>
                <div className="mt-auto pt-2 text-xs font-bold text-pink-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
