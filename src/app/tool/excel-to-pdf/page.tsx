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
  Globe,
  Zap,
  Lock,
  Shield,
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
  name: "Excel to PDF Converter Online Free",
  url: `${siteUrl}/tool/excel-to-pdf`,
  image: `${siteUrl}/img/snapdeal-label.png`,
  description:
    "Convert Microsoft Excel spreadsheets (XLSX or XLS) to high-quality PDF files online for free. Tables, sheets, and layouts perfectly preserved.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "Perfect cell margin and gridline preservation",
    "High-speed server side spreadsheet parsing",
    "Secure SSL file transfer protocols",
    "Auto file cleanup within 1 hour",
    "Zero ads or watermarks in output PDF",
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
      name: "Excel to PDF Converter",
      item: `${siteUrl}/tool/excel-to-pdf`,
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
        Excel to PDF
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
        const meta = getToolMeta("excel-to-pdf");
        return meta ? (
          <>
            <WebAppSchema
              name={`${meta.title} – Free Online Tool`}
              description={meta.description}
              url={getToolUrl("excel-to-pdf")}
            />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema
              items={[
                { label: "Tools", href: "/#tools" },
                { label: meta.title, href: `/tool/excel-to-pdf` },
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
  const id = "excel-to-pdf";
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

export default function ExcelToPdfPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* 2. Structured data scripts for search indexing */}

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumb />

        {/* Interactive Excel to PDF Converter Tool */}
        <section aria-label="Excel to PDF Application" className="mb-16">
          <OfficeTools id="excel-to-pdf" />
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {[
            {
              title: "Lightning Fast",
              desc: "Convert Excel to PDF in seconds using our optimized cloud engine — no waiting, no queue.",
              icon: Zap,
            },
            {
              title: "100% Secure",
              desc: "Files are transferred over HTTPS and permanently deleted from our servers within 1 hour.",
              icon: Shield,
            },
            {
              title: "Visual Fidelity",
              desc: "Gridlines, colors, columns, tables, and margins are all preserved in the output PDF.",
              icon: FileSpreadsheet,
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
              <div className="inline-flex p-4 rounded-2xl bg-green-50 dark:bg-green-500/10 text-green-500 group-hover:scale-110 transition-transform">
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-green-500/10 dark:bg-green-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-green-600 dark:from-white dark:via-slate-200 dark:to-green-500 bg-clip-text text-transparent">
              Convert Excel to PDF Online <br />
              <span className="text-green-500 dark:text-green-450">
                Free, Fast & Secure
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Transform Microsoft Excel files (.xlsx or .xls) into high-fidelity
              PDF documents in a single click. Keep spreadsheets, tables, visual
              cards, and text layout perfectly preserved.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is Excel to PDF Card */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-green-500/10 text-green-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is Excel to PDF Conversion?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  Converting Excel to PDF is the process of generating static
                  page vectors from spreadsheets. Excel sheets often use custom
                  formulas, border styles, and text alignment that may look
                  broken on devices lacking matching office suites or font
                  packages. Converting to PDF standardizes the spreadsheets so
                  they look identical across all computers and web browsers.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  SmartPDFs Pro processes your sheets securely over HTTPS. Our
                  conversion engine parses all cell frames, values, and
                  calculations, and{" "}
                  <strong className="text-green-500 font-bold">
                    automatically wipes them from our servers within 1 hour
                  </strong>
                  {" "}
                  to protect your document privacy.
                </p>
              </div>
            </div>

            {/* How to use the tool card */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-green-500/10 text-green-500">
                  <ArrowRight size={24} />
                </span>
                How to convert Excel to PDF in 3 Simple Steps
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />

                {[
                  {
                    step: "01",
                    title: "Upload Spreadsheet",
                    desc: "Drag and drop your XLSX or XLS file into the upload zone above.",
                  },
                  {
                    step: "02",
                    title: "Render Sheets",
                    desc: "Our layout parser converts cells, tables, charts, and spacing instantly.",
                  },
                  {
                    step: "03",
                    title: "Download PDF",
                    desc: "Download the converted, watermark-free PDF. Uploaded files are cleaned in 1 hour.",
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
                    Rigorous Data Protection
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
                    Perfect Cell Spacing
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Our layout parser supports cell colors, text borders,
                    formulas, grid lines, tables, and borders to generate
                    perfect high-quality PDF files.
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
                      <span className="p-0.5 rounded-full bg-green-500/10 text-green-600 mt-0.5 shrink-0">
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
                    q: "Why convert Excel to PDF?",
                    a: "PDF documents look identical on every screen. Converting sheets to PDF ensures that cell layouts, gridlines, values, and formatting remain exactly as intended when shared.",
                  },
                  {
                    q: "Will spreadsheet layouts and formatting be altered?",
                    a: "No. Our parser reproduces cell borders, background colors, font styles, charts, tables, and sheet spacing faithfully onto matching PDF pages.",
                  },
                  {
                    q: "Are my uploaded spreadsheets private?",
                    a: "Absolutely. Your spreadsheet files are uploaded over encrypted HTTPS protocols, converted inside our sandbox system, and permanently deleted from our servers within 1 hour.",
                  },
                  {
                    q: "Which Excel extensions are supported?",
                    a: "We support modern XLSX files (Excel 2007+) as well as legacy XLS files (Excel 97-2003) for seamless PDF creation.",
                  },
                  {
                    q: "What is the best free Excel to PDF converter online?",
                    a: "SmartPDFPro provides a fast and secure Excel to PDF converter that transforms XLS and XLSX spreadsheets into professional PDF documents online for free.",
                  },

                  {
                    q: "Can I convert Excel to PDF online without software?",
                    a: "Yes, SmartPDFPro works entirely online and does not require Microsoft Excel, Adobe Acrobat, or desktop software installation.",
                  },

                  {
                    q: "How do I convert an Excel spreadsheet to PDF?",
                    a: "Upload your XLS or XLSX spreadsheet, click the convert button, and download the generated PDF instantly.",
                  },

                  {
                    q: "Can I convert XLSX files to PDF for free?",
                    a: "Yes, SmartPDFPro supports free XLSX to PDF conversion without signup or account registration.",
                  },

                  {
                    q: "Will spreadsheet formatting remain after conversion?",
                    a: "Yes, SmartPDFPro preserves tables, cell layouts, fonts, colors, formulas, borders, charts, and spreadsheet formatting during conversion.",
                  },

                  {
                    q: "Can I convert old XLS files into PDF?",
                    a: "Yes, SmartPDFPro supports both legacy XLS spreadsheets and modern XLSX Excel file formats.",
                  },

                  {
                    q: "Can I convert Excel spreadsheets on mobile devices?",
                    a: "Yes, the Excel to PDF converter works on Android, iPhone, tablets, Windows, and Mac browsers.",
                  },

                  {
                    q: "Do I need Microsoft Excel to convert spreadsheets to PDF?",
                    a: "No, SmartPDFPro converts Excel spreadsheets online without requiring Microsoft Office or Excel software.",
                  },

                  {
                    q: "Is SmartPDFPro Excel to PDF tool secure?",
                    a: "Yes, SmartPDFPro uses encrypted HTTPS connections and automatically deletes uploaded spreadsheet files after processing.",
                  },

                  {
                    q: "Are uploaded Excel files stored permanently?",
                    a: "No, uploaded spreadsheets are processed securely and automatically removed after conversion.",
                  },

                  {
                    q: "Can businesses use SmartPDFPro Excel to PDF converter?",
                    a: "Yes, businesses, accountants, students, financial analysts, teachers, and office professionals use SmartPDFPro for spreadsheet conversion workflows.",
                  },

                  {
                    q: "Can I convert invoices and financial reports from Excel to PDF?",
                    a: "Yes, SmartPDFPro supports converting invoices, reports, budgets, financial statements, schedules, tables, and business spreadsheets into PDF documents.",
                  },

                  {
                    q: "Will charts and tables remain after conversion?",
                    a: "Yes, SmartPDFPro preserves charts, graphs, tables, colors, formatting, and spreadsheet structures during PDF generation.",
                  },

                  {
                    q: "Can I convert multiple Excel sheets into one PDF?",
                    a: "Yes, SmartPDFPro supports converting multi-sheet spreadsheets into organized PDF documents.",
                  },

                  {
                    q: "Can I use Excel to PDF converter without registration?",
                    a: "Yes, SmartPDFPro allows users to convert Excel files instantly without account creation or login.",
                  },

                  {
                    q: "Does SmartPDFPro add watermarks to converted PDFs?",
                    a: "No, SmartPDFPro does not add watermarks or branding to generated PDF documents.",
                  },

                  {
                    q: "Can students use SmartPDFPro Excel to PDF tool?",
                    a: "Yes, students and teachers use SmartPDFPro to convert assignments, tables, calculations, reports, and academic spreadsheets into PDFs.",
                  },

                  {
                    q: "Can I preserve page orientation and print layout after conversion?",
                    a: "Yes, SmartPDFPro maintains spreadsheet layouts, print formatting, and page orientation during PDF conversion.",
                  },

                  {
                    q: "Can I convert large Excel spreadsheets into PDF?",
                    a: "Yes, SmartPDFPro supports converting large spreadsheets depending on upload size and processing limitations.",
                  },

                  {
                    q: "Can I convert Excel spreadsheets offline?",
                    a: "Excel to PDF conversion may require internet connectivity because cloud-based rendering engines are used for accurate spreadsheet formatting.",
                  },

                  {
                    q: "What spreadsheet types are supported?",
                    a: "SmartPDFPro supports invoices, reports, financial spreadsheets, schedules, attendance sheets, business tables, calculations, and accounting documents.",
                  },

                  {
                    q: "Why use SmartPDFPro to convert Excel to PDF?",
                    a: "SmartPDFPro offers fast spreadsheet conversion, secure processing, mobile compatibility, formatting preservation, and watermark-free PDF downloads in one modern platform.",
                  },

                  {
                    q: "What makes SmartPDFPro different from other Excel to PDF converters?",
                    a: "SmartPDFPro combines secure cloud conversion, spreadsheet formatting accuracy, fast rendering, and user-friendly browser workflows in a simple interface.",
                  },

                  {
                    q: "Does SmartPDFPro support browser-based spreadsheet conversion?",
                    a: "Yes, SmartPDFPro provides browser-based PDF tools including Excel to PDF, merge, split, compress, organize, convert, protect, and ecommerce warehouse automation workflows.",
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
