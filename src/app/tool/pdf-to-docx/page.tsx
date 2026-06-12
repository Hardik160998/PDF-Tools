import RelatedTools from "@/components/tools/RelatedTools";
import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from "@/components/seo/WebAppSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import Link from "next/link";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  FileText,
  Upload,
  Sparkles,
  Download,
  FileSpreadsheet,
  Presentation,
  Type,
  ImageIcon,
  Lock,
  Shield,
  Zap,
  Info,
  ArrowRight,
  Star,
  Check,
  HelpCircle,
  ChevronDown,
  Loader2,
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

// 1. Dynamic Metadata Export for Next.js App Router

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF to DOCX Converter Online Free",
  url: `${siteUrl}/tool/pdf-to-docx`,
  image: `${siteUrl}/img/snapdeal-label.png`,
  description:
    "Convert PDF files to editable DOCX documents online for free. Advanced layout analysis converts tables, images, and text into Word format.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "Advanced OCR and layout analysis",
    "Generates editable DOCX documents",
    "Secure HTTPS client-server transit",
    "No registration or software required",
    "Files auto-deleted from servers in 1 hour",
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
      name: "PDF to DOCX Converter",
      item: `${siteUrl}/tool/pdf-to-docx`,
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why convert PDF to DOCX?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PDFs are not easily editable. Converting to DOCX lets you update text, reformat content, and repurpose documents in Word or Google Docs.",
      },
    },
    {
      "@type": "Question",
      name: "Will my formatting be preserved?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our engine analyses the PDF layout and recreates fonts, tables, images, and paragraph styles in the DOCX output with high fidelity.",
      },
    },
    {
      "@type": "Question",
      name: "Is my file safe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Files are uploaded over encrypted HTTPS and permanently deleted from our servers within 1 hour of conversion.",
      },
    },
    {
      "@type": "Question",
      name: "What if my PDF is scanned?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Scanned PDFs (image-based) may have reduced accuracy. For best results use PDFs with selectable text.",
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
        className="hover:text-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
      >
        Home
      </Link>
      <span aria-hidden="true">/</span>
      <Link
        href="/tool"
        className="hover:text-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
      >
        Tools
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-slate-600 dark:text-slate-300" aria-current="page">
        PDF to DOCX
      </span>
    </nav>
  );
}

// 5. Loading Skeleton to Improve Core Web Vitals (CLS)
function OfficeToolsSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-12 px-2 sm:px-4 text-center animate-pulse">
      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta("pdf-to-docx");
        return meta ? (
          <>
            <WebAppSchema
              name={`${meta.title} – Free Online Tool`}
              description={meta.description}
              url={getToolUrl("pdf-to-docx")}
            />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema
              items={[
                { label: "Tools", href: "/#tools" },
                { label: meta.title, href: `/tool/pdf-to-docx` },
              ]}
            />
          </>
        ) : null;
      })()}

      <div className="bg-white dark:bg-slate-800 rounded-[1.2rem] sm:rounded-[2.5rem] p-4 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-5 sm:space-y-10">
        <div className="space-y-2 sm:space-y-4 flex flex-col items-center">
          <div className="inline-flex p-3 sm:p-5 rounded-xl sm:rounded-3xl bg-slate-100 dark:bg-slate-700 text-slate-350">
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
const OfficeTools = dynamic(() => import("@/components/tools/OfficeTools"), {
  loading: () => <OfficeToolsSkeleton />,
});

export function generateMetadata() {
  const id = "pdf-to-docx";
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

export default function PdfToDocxPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* 2. Structured data scripts for search indexing */}

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumb />

        {/* Interactive PDF to DOCX Converter Tool */}
        <section aria-label="PDF to DOCX Application" className="mb-16">
          <OfficeTools id="pdf-to-docx" />
        </section>

        <RelatedTools />

        {/* Feature Cards Grid */}
        <section
          aria-label="Tool Benefits Quick Overview"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {[
            {
              title: "High Accuracy",
              desc: "Advanced layout analysis ensures text, tables, and images are faithfully reproduced in DOCX.",
              icon: Zap,
            },
            {
              title: "100% Secure",
              desc: "Files are transferred over HTTPS and permanently deleted from our servers within 1 hour of conversion.",
              icon: Shield,
            },
            {
              title: "Fully Editable",
              desc: "The output DOCX opens in Microsoft Word, Google Docs, LibreOffice, and any other Word-compatible editor.",
              icon: FileText,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <item.icon size={24} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                {item.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </section>

        {/* 4. Complete SEO Optimized Content Section */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">
          <div className="mb-16 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-blue-500/10 dark:bg-blue-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-blue-600 dark:from-white dark:via-slate-200 dark:to-blue-500 bg-clip-text text-transparent">
              Convert PDF to DOCX Online <br />
              <span className="text-blue-600 dark:text-blue-450">
                Fast, Free & Secure
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Transform non-editable PDF files into fully editable Microsoft
              Word (.docx) documents in seconds. Advanced structure parsing
              ensures layout fidelity and high-quality outputs.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is PDF to DOCX Card */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is PDF to DOCX Conversion?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  Converting PDF to DOCX is a method of layout reconstruction.
                  PDFs are compiled for visual representation and lack page text
                  flow definitions. Our converter analyzes elements like
                  boundaries, vertical lines, font faces, and image blocks,
                  mapping them back into editable flow variables inside native
                  Word document files.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  SmartPDFs Pro processes your documents using secure HTTPS
                  transfer protocols. Files are converted in sandbox servers and
                  {" "}
                  <strong className="text-blue-500 font-bold">
                    automatically removed within 1 hour
                  </strong>
                  {" "}
                  after completion. You get a perfect editable DOCX document
                  without risking document data leaks.
                </p>
              </div>
            </div>

            {/* How to use the tool card */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <ArrowRight size={24} />
                </span>
                How to convert PDFs to DOCX in 3 Simple Steps
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />

                {[
                  {
                    step: "01",
                    title: "Select PDF File",
                    desc: "Drag and drop your PDF file or click to browse files from your local disk or storage.",
                  },
                  {
                    step: "02",
                    title: "Reconstruct layout",
                    desc: "Our analyzer parses document grids, lines, fonts, and inline graphics within seconds.",
                  },
                  {
                    step: "03",
                    title: "Download DOCX",
                    desc: "Download the converted, fully editable Word document. Files are cleaned from our server in 1 hour.",
                  },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="relative z-10 flex flex-col gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-blue-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-blue-500/40 transition-all duration-300">
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
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
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
                    Total Information Privacy
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    We use secure end-to-end HTTPS transfers. To protect your
                    business documents, files are removed automatically and
                    permanently within 1 hour after conversion.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Zap size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-blue-500 transition-colors">
                    Layout Reconstruction
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Our system recognizes tables, headings, list structures,
                    page headers, footers, and page margins to produce a highly
                    editable DOCX file.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Supports both modern .docx (Word 2007+) and legacy formats flawlessly.",
                    "Clean and legible text conversion preserving native alignment, headers, and footers.",
                    "No watermarks added, leaving your converted files completely professional and ready.",
                    "Works across iOS, Android, macOS, and Windows browsers without installing apps.",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium"
                    >
                      <span className="p-0.5 rounded-full bg-blue-500/10 text-blue-600 mt-0.5 shrink-0">
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
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Why convert PDF to DOCX?",
                    a: "PDFs are not easily editable. Converting to DOCX lets you update text, reformat content, and repurpose documents in Word or Google Docs.",
                  },
                  {
                    q: "Will my formatting be preserved?",
                    a: "Yes. Our engine analyses the PDF layout and recreates fonts, tables, images, and paragraph styles in the DOCX output with high fidelity.",
                  },
                  {
                    q: "Is my file safe?",
                    a: "Absolutely. Files are uploaded over encrypted HTTPS and permanently deleted from our servers within 1 hour of conversion.",
                  },
                  {
                    q: "What if my PDF is scanned?",
                    a: "Scanned PDFs (image-based) may have reduced accuracy. For best results use PDFs with selectable text.",
                  },
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                      <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <HelpCircle size={22} className="text-blue-500 shrink-0" />
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
