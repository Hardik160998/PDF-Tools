import RelatedTools from "@/components/tools/RelatedTools";
import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from "@/components/seo/WebAppSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import Link from "next/link";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  FileSpreadsheet,
  Upload,
  Sparkles,
  Download,
  FileText,
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
  name: "PDF to Excel Converter Online Free",
  url: `${siteUrl}/tool/pdf-to-excel`,
  image: `${siteUrl}/img/snapdeal-label.png`,
  description:
    "Extract tables from PDF files into editable XLSX spreadsheets online for free. Highly accurate structure analysis keeps columns intact.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "Generates editable XLSX spreadsheets",
    "High-fidelity visual table and grid analysis",
    "Secure cloud-based conversion systems",
    "Automatic file cleanup in 1 hour",
    "No registration or user login required",
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
      name: "PDF to Excel Converter",
      item: `${siteUrl}/tool/pdf-to-excel`,
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
        className="hover:text-green-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded px-1"
      >
        Home
      </Link>
      <span aria-hidden="true">/</span>
      <Link
        href="/tool"
        className="hover:text-green-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded px-1"
      >
        Tools
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-slate-600 dark:text-slate-300" aria-current="page">
        PDF to Excel
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
        const meta = getToolMeta("pdf-to-excel");
        return meta ? (
          <>
            <WebAppSchema
              name={`${meta.title} – Free Online Tool`}
              description={meta.description}
              url={getToolUrl("pdf-to-excel")}
            />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema
              items={[
                { label: "Tools", href: "/#tools" },
                { label: meta.title, href: `/tool/pdf-to-excel` },
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
  const id = "pdf-to-excel";
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

export default function PdfToExcelPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* 2. Structured data scripts for search indexing */}

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumb />

        {/* Interactive PDF to Excel Converter Tool */}
        <section aria-label="PDF to Excel Application" className="mb-16">
          <OfficeTools id="pdf-to-excel" />
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
          
          <div className="max-w-xl mx-auto mb-12">
            {/* Blog Post 1: PDF to Word Guide */}
            <a href="/blog/pdf-to-word-conversion-guide" className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
                <div className="p-6 flex flex-col flex-1 gap-3">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#3b82f6] rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                        </div>
                        <h3 className="font-bold text-slate-800 text-[17px] leading-snug group-hover:text-red-600 transition-colors">
                            The Ultimate PDF to Word Conversion Guide
                        </h3>
                    </div>
                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            4 min read &nbsp; May 25, 2026
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
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {[
            {
              title: "Editable Excel Output",
              desc: "Easily modify all text, values, tables, and layouts in standard XLSX format.",
              gradient: "linear-gradient(135deg,#22c55e,#15803d)",
            },
            {
              title: "Safe & Secure Servers",
              desc: "Files are transferred over HTTPS and permanently deleted within 1 hour after conversion.",
              gradient: "linear-gradient(135deg,#22c55e,#15803d)",
            },
            {
              title: "Structure Integrity",
              desc: "Our layout analyzer ensures that columns, fonts, images, and cell margins remain intact.",
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
                <div className="text-white font-bold" aria-hidden="true">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-2">
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-green-500/10 dark:bg-green-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />

            <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-green-600 dark:from-white dark:via-slate-200 dark:to-green-500 bg-clip-text text-transparent">
              Convert PDF to Excel Online <br />
              <span className="text-green-500 dark:text-green-440">
                100% Free & Secure
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Transform your non-editable PDF documents into fully customizable
              Excel spreadsheets (.xlsx) in seconds. 100% secure processing with
              automatic files deletion.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is PDF to Excel Card */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-green-500/10 text-green-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is PDF to Excel Conversion?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  PDF (Portable Document Format) is designed to look identical
                  across all computers, which makes it extremely hard to extract
                  cell content or columns. PDF to Excel conversion solves this
                  by extracting tabular structures, font faces, coordinate
                  bounds, and column gutters from the PDF and converting them
                  into editable cells inside a `.xlsx` spreadsheet.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  With SmartPDFs Pro, your conversion is executed on our
                  isolated cloud servers via HTTPS. Your uploads are stored
                  securely, handled by top-tier parser scripts to guarantee
                  layout accuracy, and{" "}
                  <strong className="text-green-500 font-bold">
                    permanently wiped from our servers within 1 hour
                  </strong>
                  . You get a perfect editable grid layout without compromising
                  your information privacy.
                </p>
              </div>
            </div>

            {/* How to use the tool card */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-green-500/10 text-green-500">
                  <ArrowRight size={24} />
                </span>
                How to convert PDFs to Excel in 3 Simple Steps
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
                    title: "Wait for Conversion",
                    desc: "Our high-speed cloud engine extracts the column grids, values, graphics, and structures in seconds.",
                  },
                  {
                    step: "03",
                    title: "Download Sheet",
                    desc: "Save the generated editable XLSX file immediately. No watermark, fully compatible with MS Excel.",
                  },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="relative z-10 flex flex-col gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-green-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-green-500/40 transition-all duration-300">
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
                <span className="p-2 rounded-xl bg-green-500/10 text-green-500">
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
                    Complete File Confidentiality
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    We use secure end-to-end HTTPS transfers. To protect your
                    business sheets, files are removed automatically and
                    permanently within 1 hour after conversion.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Zap size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-green-500 transition-colors">
                    Tabular Grid Integrity
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Our analyzer correctly recognizes column boundaries, row
                    borders, titles, cell margins, and background colors, saving
                    you from tedious manual layout rebuilding in Excel.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-855 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Supports both modern .xlsx and legacy .xls files.",
                    "Retains layout orientation, landscape styles, and cell coordinates.",
                    "No watermark overlays added, leaving your sheets 100% professional.",
                    "Works across mobile and tablet browsers without account signups.",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium"
                    >
                      <span className="p-0.5 rounded-full bg-green-500/10 text-green-650 mt-0.5 shrink-0">
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
                <span className="p-2 rounded-xl bg-green-500/10 text-green-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Is the PDF to Excel conversion secure?",
                    a: "Yes. All file transit occurs over encrypted HTTPS connections, processed in an isolated sandbox, and permanently deleted from our servers within 1 hour.",
                  },
                  {
                    q: "Will my table alignment remain intact?",
                    a: "Yes. Our conversion engine analyzes row coordinates and column gutters, recreating the original table structure inside standard XLSX cells.",
                  },
                  {
                    q: "Can I convert scanned PDF pages into Excel sheets?",
                    a: "Yes, scanned tables are supported, but standard scans will be placed as pictures inside the sheet. For editable cells from scans, we recommend utilizing our OCR tool first.",
                  },
                  {
                    q: "Is there a file limit constraint?",
                    a: "We support files up to 50MB for free conversion, ensuring fast processing times without compromising quality.",
                  },
                  {
                    q: "What is the best free PDF to Excel converter online?",
                    a: "SmartPDFPro provides a fast and secure PDF to Excel converter that transforms PDF tables and reports into editable XLSX spreadsheets online for free.",
                  },

                  {
                    q: "Can I convert PDF to Excel online without software?",
                    a: "Yes, SmartPDFPro works entirely online and does not require Microsoft Excel, Adobe Acrobat, or desktop software installation.",
                  },

                  {
                    q: "How do I convert a PDF file to Excel?",
                    a: "Upload your PDF document, click the convert button, and download the editable Excel XLSX file instantly.",
                  },

                  {
                    q: "Can I convert PDF tables into editable Excel spreadsheets?",
                    a: "Yes, SmartPDFPro detects rows, columns, and table structures to recreate editable Excel spreadsheets from PDF documents.",
                  },

                  {
                    q: "Will table formatting remain after conversion?",
                    a: "Yes, SmartPDFPro preserves rows, columns, table alignment, fonts, borders, layouts, and spreadsheet structures during conversion.",
                  },

                  {
                    q: "Can I convert scanned PDF tables into Excel files?",
                    a: "Yes, scanned PDF documents are supported. OCR-based extraction may help generate editable spreadsheet cells from scanned tables.",
                  },

                  {
                    q: "Can I convert PDF files on mobile devices?",
                    a: "Yes, the PDF to Excel converter works on Android, iPhone, tablets, Windows, and Mac browsers.",
                  },

                  {
                    q: "Do I need Microsoft Excel to convert PDFs?",
                    a: "No, SmartPDFPro converts PDF documents into Excel spreadsheets online without requiring Microsoft Office or Excel software.",
                  },

                  {
                    q: "Is SmartPDFPro PDF to Excel tool secure?",
                    a: "Yes, SmartPDFPro uses encrypted HTTPS connections and automatically deletes uploaded documents after processing.",
                  },

                  {
                    q: "Are uploaded PDF files stored permanently?",
                    a: "No, uploaded documents are processed securely and automatically removed after conversion.",
                  },

                  {
                    q: "Can businesses use SmartPDFPro PDF to Excel converter?",
                    a: "Yes, businesses, accountants, financial analysts, students, teachers, and office professionals use SmartPDFPro for spreadsheet extraction workflows.",
                  },

                  {
                    q: "Can I convert invoices and reports from PDF to Excel?",
                    a: "Yes, SmartPDFPro supports converting invoices, financial reports, tables, schedules, forms, and business documents into editable Excel spreadsheets.",
                  },

                  {
                    q: "Will charts and tables remain after conversion?",
                    a: "Yes, SmartPDFPro preserves tables, charts, formatting, cell structures, and spreadsheet layouts during PDF to Excel conversion.",
                  },

                  {
                    q: "Can I edit the converted Excel spreadsheet?",
                    a: "Yes, the generated XLSX file is fully editable in Microsoft Excel, Google Sheets, and compatible spreadsheet applications.",
                  },

                  {
                    q: "Can I convert large PDF files into Excel spreadsheets?",
                    a: "Yes, SmartPDFPro supports converting large PDF documents depending on upload size and processing limitations.",
                  },

                  {
                    q: "Can I use PDF to Excel converter without registration?",
                    a: "Yes, SmartPDFPro allows users to convert PDF files instantly without account creation or login.",
                  },

                  {
                    q: "Does SmartPDFPro add watermarks to converted spreadsheets?",
                    a: "No, SmartPDFPro does not add watermarks or branding to generated Excel files.",
                  },

                  {
                    q: "Can students use SmartPDFPro PDF to Excel tool?",
                    a: "Yes, students and teachers use SmartPDFPro to extract tables, calculations, research data, and academic reports into editable spreadsheets.",
                  },

                  {
                    q: "Can I extract financial statements from PDFs into Excel?",
                    a: "Yes, SmartPDFPro is commonly used for extracting accounting tables, bank statements, invoices, and financial data into spreadsheets.",
                  },

                  {
                    q: "Can I preserve spreadsheet structure after conversion?",
                    a: "Yes, SmartPDFPro maintains table structures, alignments, columns, and formatting during PDF to Excel conversion.",
                  },

                  {
                    q: "Can I convert PDFs offline?",
                    a: "PDF to Excel conversion may require internet connectivity because cloud-based extraction engines are used for accurate spreadsheet reconstruction.",
                  },

                  {
                    q: "What types of PDF files are supported?",
                    a: "SmartPDFPro supports invoices, reports, bank statements, financial tables, schedules, scanned documents, business reports, and academic files.",
                  },

                  {
                    q: "Why use SmartPDFPro to convert PDF to Excel?",
                    a: "SmartPDFPro offers fast spreadsheet extraction, secure processing, mobile compatibility, editable XLSX output, and watermark-free downloads in one modern platform.",
                  },

                  {
                    q: "What makes SmartPDFPro different from other PDF to Excel converters?",
                    a: "SmartPDFPro combines secure cloud conversion, table recognition accuracy, OCR support, fast processing, and user-friendly browser workflows in a simple interface.",
                  },

                  {
                    q: "Does SmartPDFPro support browser-based spreadsheet conversion?",
                    a: "Yes, SmartPDFPro provides browser-based PDF tools including PDF to Excel, merge, split, compress, organize, convert, protect, and ecommerce warehouse automation workflows.",
                  },
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500">
                      <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <HelpCircle size={22} className="text-green-500 shrink-0" />
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
