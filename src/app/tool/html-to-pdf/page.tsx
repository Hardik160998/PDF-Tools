import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from "@/components/seo/WebAppSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import Link from "next/link";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  Globe,
  Upload,
  Sparkles,
  Download,
  FileText,
  FileSpreadsheet,
  Presentation,
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
  name: "HTML to PDF Converter Online Free",
  url: `${siteUrl}/tool/html-to-pdf`,
  image: `${siteUrl}/img/snapdeal-label.png`,
  description:
    "Convert local HTML or HTM files into high-quality PDF documents online for free. Renders CSS layouts, visual frames, and assets.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "High-fidelity CSS and grid layouts rendering",
    "Encrypted cloud-based HTML compilation",
    "Secure SSL file transfer protocols",
    "Auto file cleanup within 1 hour",
    "Zero watermarks in output document",
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
      name: "HTML to PDF Converter",
      item: `${siteUrl}/tool/html-to-pdf`,
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Will external CSS and images be rendered in the PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. As long as stylesheets, web fonts, and images use absolute URLs, our engine fetches and renders them correctly. For local assets, we recommend archiving them or using absolute paths.",
      },
    },
    {
      "@type": "Question",
      name: "Does the converter support modern JavaScript execution?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, our HTML to PDF converter focuses on static page layout representation. If you need dynamic JS rendering, we recommend utilizing our Webpage to PDF tool instead.",
      },
    },
    {
      "@type": "Question",
      name: "Is my HTML data private?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. All file uploads are transferred over secure HTTPS connections, processed in isolated server sandboxes, and permanently deleted within 1 hour.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a file size limit constraint?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We support HTML files up to 20MB for free, which covers most landing pages, reports, and code structures.",
      },
    },
  ],
};

// 8. Internal links configuration
const RELATED = [
  {
    id: "webpage-to-pdf",
    title: "Webpage to PDF",
    description:
      "Convert any public website URL into a formatted PDF document.",
    icon: Globe,
    gradient: "linear-gradient(135deg, #0ea5e9, #0369a1)",
    shadow: "rgba(14,165,233,0.3)",
    tag: "Convert",
  },
  {
    id: "word-to-pdf",
    title: "Word to PDF",
    description:
      "Convert DOCX files to PDF with formatting perfectly preserved.",
    icon: FileText,
    gradient: "linear-gradient(135deg, #3182ce, #1e3a8a)",
    shadow: "rgba(49,130,206,0.3)",
    tag: "Convert",
  },
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
    icon: Presentation,
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
    description: "Encrypt your PDF with a password to keep it secure.",
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
        HTML to PDF
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
        const meta = getToolMeta("html-to-pdf");
        return meta ? (
          <>
            <WebAppSchema
              name={`${meta.title} – Free Online Tool`}
              description={meta.description}
              url={getToolUrl("html-to-pdf")}
            />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema
              items={[
                { label: "Tools", href: "/#tools" },
                { label: meta.title, href: `/tool/html-to-pdf` },
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
  const id = "html-to-pdf";
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

export default function HtmlToPdfPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* 2. Structured data scripts for search indexing */}

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumb />

        {/* Interactive HTML to PDF Converter Tool */}
        <section aria-label="HTML to PDF Application" className="mb-16">
          <OfficeTools id="html-to-pdf" />
        </section>

        {/* Feature Cards Grid */}
        <section
          aria-label="Tool Benefits Quick Overview"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {[
            {
              title: "CSS Rendering",
              desc: "Converts HTML with stylesheets, styles, backgrounds, and layout rules fully rendered.",
              icon: Zap,
            },
            {
              title: "100% Secure",
              desc: "Files are transferred over HTTPS and permanently deleted from our servers within 1 hour.",
              icon: Shield,
            },
            {
              title: "Visual Fidelity",
              desc: "Vector text layers, images, page bounds, and borders are all preserved in the output PDF.",
              icon: FileText,
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

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-indigo-600 dark:from-white dark:via-slate-200 dark:to-indigo-500 bg-clip-text text-transparent">
              Convert HTML to PDF Online <br />
              <span className="text-indigo-500 dark:text-indigo-455">
                Free, Fast & Secure
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Transform local HTML or HTM code documents into high-fidelity PDF
              documents in a single click. Keep CSS templates, margins, visual
              frames, and styles perfectly preserved.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is HTML to PDF Card */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is HTML to PDF Conversion?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  Converting HTML to PDF is the process of generating static
                  page vectors from layout source code. HTML documents use
                  dynamic stylesheets, margins, and external assets that may
                  look broken on devices lacking matching browsers or active
                  assets. Converting to PDF standardizes the HTML designs so
                  they look identical across all computers and printers.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  SmartPDFs Pro processes your HTML files securely over HTTPS.
                  Our conversion engine renders all CSS properties, backgrounds,
                  media screens, and asset boxes, and{""}
                  <strong className="text-indigo-550 font-bold">
                    automatically wipes them from our servers within 1 hour
                  </strong>
                  {""}
                  to protect your document privacy.
                </p>
              </div>
            </div>

            {/* How to use the tool card */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <ArrowRight size={24} />
                </span>
                How to convert HTML to PDF in 3 Simple Steps
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />

                {[
                  {
                    step: "01",
                    title: "Upload HTML File",
                    desc: "Drag and drop your HTML or HTM file into the upload zone above.",
                  },
                  {
                    step: "02",
                    title: "Render Layout",
                    desc: "Our engine renders layout code, styles, images, and fonts instantly.",
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
                    Rigorous Data Protection
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    We use secure end-to-end HTTPS transfers. To protect your
                    business codes, files are removed automatically and
                    permanently within 1 hour after conversion.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Zap size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-indigo-500 transition-colors">
                    High-Fidelity CSS Render
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Our layout parser supports dynamic media screens, grid
                    systems, custom Google fonts, and inline styles to generate
                    clean PDF documents.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-855 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Supports both modern HTML5 and legacy HTML codes.",
                    "Retains layout orientation, page margins, and visual dimensions.",
                    "No watermark overlays added, leaving your pages 100% professional.",
                    "Works across mobile and tablet browsers without account signups.",
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
                <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Will external CSS and images be rendered in the PDF?",
                    a: "Yes. As long as stylesheets, web fonts, and images use absolute URLs, our engine fetches and renders them correctly. For local assets, we recommend archiving them or using absolute paths.",
                  },
                  {
                    q: "Does the converter support modern JavaScript execution?",
                    a: "No, our HTML to PDF converter focuses on static page layout representation. If you need dynamic JS rendering, we recommend utilizing our Webpage to PDF tool instead.",
                  },
                  {
                    q: "Is my HTML data private?",
                    a: "Absolutely. All file uploads are transferred over secure HTTPS connections, processed in isolated server sandboxes, and permanently deleted within 1 hour.",
                  },
                  {
                    q: "Is there a file size limit constraint?",
                    a: "We support HTML files up to 20MB for free, which covers most landing pages, reports, and code structures.",
                  },
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden bg-slate-50/20 dark:bg-slate-900/20 open:bg-slate-50/50 dark:open:bg-slate-800/30 transition-all duration-300 text-left"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg">
                      <h3 className="text-base sm:text-base font-bold text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-indigo-500 transition-colors pr-4">
                        {item.q}
                      </h3>
                      <span className="shrink-0 transition-transform duration-300 group-open:rotate-180 text-slate-400 group-hover:text-indigo-500">
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
                href={`/tool/${t.id}`}
                title={`Use the ${t.title} tool`}
                aria-label={`Open the ${t.title} tool to ${t.description.toLowerCase()}`}
                className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 text-left focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
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
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-700">
                    {t.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-500 transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {t.description}
                  </p>
                </div>
                <div className="mt-auto pt-2 text-xs font-bold text-indigo-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
