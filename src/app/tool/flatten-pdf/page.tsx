import Link from "next/link";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  Layers,
  Upload,
  Download,
  CheckCircle,
  Combine,
  Scissors,
  Lock,
  Settings,
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
  title: "Flatten PDF Online Free - Flatten Form Fields & Annotations",
  description:
    "Flatten PDF files online for free. Merge form fields, annotations, and shapes permanently into the PDF page content to prevent further editing.",
  keywords:
    "flatten pdf, flatten form fields pdf, flatten annotations pdf, flatten pdf online, secure pdf flattener, smartpdfs plus",
  alternates: {
    canonical: `${siteUrl}/tool/flatten-pdf`,
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
    title: "Flatten PDF Online Free - Flatten Form Fields & Annotations",
    description:
      "Flatten PDF files online for free. Merge form fields, annotations, and shapes permanently into the PDF page content to prevent further editing.",
    siteName: "SmartPDFs Plus",
    url: `${siteUrl}/tool/flatten-pdf`,
    images: [
      {
        url: `${siteUrl}/img/snapdeal-label.png`,
        width: 1200,
        height: 630,
        alt: "Flatten PDF Tool Online - SmartPDFs Plus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flatten PDF Online Free - Flatten Form Fields & Annotations",
    description:
      "Flatten PDF files online for free. Merge form fields, annotations, and shapes permanently into the PDF page content to prevent further editing.",
    images: [`${siteUrl}/img/snapdeal-label.png`],
  },
};

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Flatten PDF Online Free",
  url: `${siteUrl}/tool/flatten-pdf`,
  image: `${siteUrl}/img/snapdeal-label.png`,
  description:
    "Flatten PDF files online for free. Merge form fields, annotations, and shapes permanently into the PDF page content to prevent further editing.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "100% Local processing in your browser",
    "No file uploads to servers",
    "Flatten form fields and text inputs",
    "Flatten comments, shapes, and annotations",
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
      name: "Flatten PDF",
      item: `${siteUrl}/tool/flatten-pdf`,
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does flattening a PDF mean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Flattening a PDF merges interactive elements like form text fields, checkboxes, drop-downs, and annotations directly into the background page content. This converts interactive layers into static visual elements, preventing anyone from editing, modifying, or changing the form values.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data safe using the Flatten PDF tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, absolutely. Like all tools on SmartPDFs Plus, the Flatten PDF process is run 100% locally in your web browser. Your document is processed in local memory and is never uploaded to any cloud server, ensuring full data privacy.",
      },
    },
    {
      "@type": "Question",
      name: "Does flattening a PDF reduce its file size?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In many cases, yes. Removing interactive form layers and metadata can reduce the overhead of the PDF structure, leading to a smaller, more optimized file size.",
      },
    },
    {
      "@type": "Question",
      name: "Will the links in my PDF still work after flattening?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Annotations such as comments or editable text fields will be flattened and made uneditable. However, standard hypertext links can be preserved depending on the flattener settings. Our tool prioritizes turning interactive fields static.",
      },
    },
  ],
};

// 8. Internal links configuration
const RELATED = [
  {
    id: "merge",
    title: "Merge PDF",
    description:
      "Combine multiple PDF files into one document in the order you choose.",
    icon: Combine,
    gradient: "linear-gradient(135deg, #f26522, #c2410c)",
    shadow: "rgba(242,101,34,0.3)",
    tag: "Organize",
  },
  {
    id: "split",
    title: "Split PDF",
    description: "Split PDF files into individual pages or custom ranges.",
    icon: Scissors,
    gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    shadow: "rgba(59,130,246,0.3)",
    tag: "Organize",
  },
  {
    id: "compress",
    title: "Compress PDF",
    description: "Reduce PDF file size locally without losing quality.",
    icon: Loader2,
    gradient: "linear-gradient(135deg, #10b981, #047857)",
    shadow: "rgba(16,185,129,0.3)",
    tag: "Optimize",
  },
  {
    id: "metadata",
    title: "Edit Metadata",
    description: "Add or change PDF metadata like title, author, and subject.",
    icon: Settings,
    gradient: "linear-gradient(135deg, #E8465D, #843286)",
    shadow: "rgba(232,70,93,0.3)",
    tag: "Edit",
  },
  {
    id: "protect",
    title: "Protect PDF",
    description:
      "Encrypt your PDF with a password to prevent unauthorized access.",
    icon: Lock,
    gradient: "linear-gradient(135deg, #ef4444, #b91c1c)",
    shadow: "rgba(239,68,68,0.3)",
    tag: "Security",
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
        className="hover:text-violet-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded px-1"
      >
        Home
      </Link>
      <span aria-hidden="true">/</span>
      <Link
        href="/tool"
        className="hover:text-violet-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded px-1"
      >
        Tools
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-slate-600 dark:text-slate-300" aria-current="page">
        Flatten PDF
      </span>
    </nav>
  );
}

// 5. Loading Skeleton to Improve Core Web Vitals (CLS)
function FlattenPdfSkeleton() {
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
const FlattenPdf = dynamic(() => import("@/components/tools/FlattenPdf"), {
  loading: () => <FlattenPdfSkeleton />,
});

export default function FlattenPdfPage() {
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

        {/* Interactive Flatten PDF Tool */}
        <section aria-label="PDF Flattening Application" className="mb-16">
          <FlattenPdf id="flatten-pdf" />
        </section>

        {/* Premium Banner */}
        <section className="py-6 mb-12" aria-label="Premium Upgrades">
          <div className="relative overflow-hidden rounded-2xl border border-violet-100 dark:border-violet-500/20 shadow-lg bg-gradient-to-br from-[#faf5ff] via-[#f3e8ff] to-[#e9d5ff]/20 dark:from-[#1e293b] dark:via-[#1e293b] dark:to-[#581c87]/20">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 80% 50%,rgba(139,92,246,0.12) 0%,transparent 70%)",
              }}
            />
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5">
              <div className="flex items-center gap-4 text-left">
                <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9]">
                  <Star size={22} className="fill-white/20" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-slate-100">
                    Unlock SmartPDFs Plus — Go Premium
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Batch flattening · Complete OCR extraction · Priority
                    processing · No limits
                  </p>
                </div>
              </div>
              <Link
                href="/premium-plans"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-black uppercase tracking-widest shadow-md transition-transform hover:scale-105 bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9]"
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
              title: "Form Field Locking",
              desc: "Convert form input boxes, drop-downs, and checklists into permanent background elements.",
              gradient: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
            },
            {
              title: "Annotation Merging",
              desc: "Permanently merge stamps, comments, sketches, and shapes into your PDF document.",
              gradient: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
            },
            {
              title: "100% Browser Privacy",
              desc: "Your files never leave your computer. All rendering is performed locally in JS.",
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-violet-500/10 dark:bg-violet-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-violet-600 dark:from-white dark:via-slate-200 dark:to-violet-500 bg-clip-text text-transparent">
              Flatten PDF Online Free <br />
              <span className="text-violet-500 dark:text-violet-400">
                Lock Forms & Annotations
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Permanently merge fillable form fields, checklists, signature
              marks, and text boxes into the PDF page content. Ensure security
              and lock values from editing.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is PDF Flattening Card */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-violet-500/10 text-violet-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is PDF Flattening?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  Normally, fillable PDFs contain an interactive layer where
                  users can type text, select check-boxes, or add digital
                  signature blocks. PDF flattening is the process of combining
                  this interactive overlay directly into the main visual
                  background layer.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  SmartPDFs Plus processes your documents{" "}
                  <strong className="text-violet-600 font-black dark:text-violet-450">
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
                <span className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
                  <ArrowRight size={24} />
                </span>
                How to Flatten PDF Online in 3 Simple Steps
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />

                {[
                  {
                    step: "01",
                    title: "Upload PDF",
                    desc: "Drag and drop your fillable PDF document or click the browse panel to load it locally inside your browser.",
                  },
                  {
                    step: "02",
                    title: "Configure Flattening",
                    desc: "Confirm whether you want to flatten all annotations, forms, and overlays permanently.",
                  },
                  {
                    step: "03",
                    title: "Download Secured PDF",
                    desc: "Click Apply to lock all inputs and download the updated, static PDF instantly.",
                  },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="relative z-10 flex flex-col gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-outfit text-lg font-black text-violet-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-violet-500/40 transition-all duration-300">
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
                <span className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
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
                    100% Client-Side Privacy
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Privacy is our baseline. Our tool edits your files inside
                    the browser client memory. Your PDF documents never leave
                    your computer, ensuring absolute safety for business audits.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Zap size={22} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-violet-500 transition-colors">
                    Prevent Values Modification
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Prevents anyone from editing details on invoices,
                    agreements, certificates, or applications after submission.
                    Flattening renders the text immutable.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-855 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Secures interactive text boxes by embedding typography directly into the page canvas.",
                    "Stops unauthorized script runs or form changes inside third-party PDF viewers.",
                    "Free, instant processing with no watermarks and no registration required.",
                    "Optimizes document structures to reduce file sizes for easy emailing.",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium"
                    >
                      <span className="p-0.5 rounded-full bg-violet-500/10 text-violet-600 mt-0.5 shrink-0">
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
                <span className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "What does flattening a PDF mean?",
                    a: "Flattening a PDF merges interactive elements like form text fields, checkboxes, drop-downs, and annotations directly into the background page content. This converts interactive layers into static visual elements, preventing anyone from editing, modifying, or changing the form values.",
                  },
                  {
                    q: "Is my data safe using the Flatten PDF tool?",
                    a: "Yes, absolutely. Like all tools on SmartPDFs Plus, the Flatten PDF process is run 100% locally in your web browser. Your document is processed in local memory and is never uploaded to any cloud server, ensuring full data privacy.",
                  },
                  {
                    q: "Does flattening a PDF reduce its file size?",
                    a: "In many cases, yes. Removing interactive form layers and metadata can reduce the overhead of the PDF structure, leading to a smaller, more optimized file size.",
                  },
                  {
                    q: "Will the links in my PDF still work after flattening?",
                    a: "Annotations such as comments or editable text fields will be flattened and made uneditable. However, standard hypertext links can be preserved depending on the flattener settings. Our tool prioritizes turning interactive fields static.",
                  },
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden bg-slate-50/20 dark:bg-slate-900/20 open:bg-slate-50/50 dark:open:bg-slate-800/30 transition-all duration-300 text-left"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg">
                      <h3 className="text-base sm:text-base font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-violet-500 transition-colors pr-4">
                        {item.q}
                      </h3>
                      <span className="shrink-0 transition-transform duration-300 group-open:rotate-180 text-slate-400 group-hover:text-violet-500">
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
                className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 text-left focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none"
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
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-violet-500 transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {t.description}
                  </p>
                </div>
                <div className="mt-auto pt-2 text-xs font-bold text-violet-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
