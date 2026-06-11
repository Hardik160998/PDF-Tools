import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from "@/components/seo/WebAppSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import Link from "next/link";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  Presentation,
  Upload,
  Sparkles,
  Download,
  FileText,
  FileSpreadsheet,
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
  name: "PPT to PDF Converter Online Free",
  url: `${siteUrl}/tool/ppt-to-pdf`,
  image: `${siteUrl}/img/snapdeal-label.png`,
  description:
    "Convert PowerPoint presentations (PPT or PPTX) to high-quality PDF files online for free. Visuals, tables, and layouts perfectly preserved.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "Perfect visual layout and font preservation",
    "High-speed server side presentation parsing",
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
      name: "PowerPoint to PDF Converter",
      item: `${siteUrl}/tool/ppt-to-pdf`,
    },
  ],
};

// 8. Internal links configuration
const RELATED = [
  {
    id: "pdf-to-ppt",
    title: "PDF to PowerPoint",
    description: "Convert your PDF back into an editable PPTX presentation.",
    icon: Presentation,
    gradient: "linear-gradient(135deg, #f97316, #c2410c)",
    shadow: "rgba(249,115,22,0.3)",
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
        className="hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1"
      >
        Home
      </Link>
      <span aria-hidden="true">/</span>
      <Link
        href="/tool"
        className="hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1"
      >
        Tools
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-slate-600 dark:text-slate-300" aria-current="page">
        PPT to PDF
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
        const meta = getToolMeta("ppt-to-pdf");
        return meta ? (
          <>
            <WebAppSchema
              name={`${meta.title} – Free Online Tool`}
              description={meta.description}
              url={getToolUrl("ppt-to-pdf")}
            />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema
              items={[
                { label: "Tools", href: "/#tools" },
                { label: meta.title, href: `/tool/ppt-to-pdf` },
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
  const id = "ppt-to-pdf";
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

export default function PptToPdfPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* 2. Structured data scripts for search indexing */}

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumb />

        {/* Interactive PPT to PDF Converter Tool */}
        <section aria-label="PPT to PDF Application" className="mb-16">
          <OfficeTools id="ppt-to-pdf" />
        </section>

        {/* Feature Cards Grid */}
        <section
          aria-label="Tool Benefits Quick Overview"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {[
            {
              title: "Lightning Fast",
              desc: "Convert PPTX to PDF in seconds using our optimized cloud engine — no waiting, no queue.",
              icon: Zap,
            },
            {
              title: "100% Secure",
              desc: "Files are transferred over HTTPS and permanently deleted from our servers within 1 hour.",
              icon: Shield,
            },
            {
              title: "Visual Fidelity",
              desc: "Vector shapes, text boxes, charts, and slide borders are all preserved in the output PDF.",
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
              <div className="inline-flex p-4 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform">
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-orange-500/10 dark:bg-orange-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-orange-600 dark:from-white dark:via-slate-200 dark:to-orange-550 bg-clip-text text-transparent">
              Convert PPT to PDF Online <br />
              <span className="text-orange-500 dark:text-orange-450">
                Free, Fast & Secure
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Transform Microsoft PowerPoint files (.ppt or .pptx) into
              high-fidelity PDF documents in a single click. Keep slides,
              margins, visual cards, and text layout perfectly preserved.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is PPT to PDF Card */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is PPT to PDF Conversion?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  Converting PowerPoint to PDF is the process of generating
                  static page vectors from slides. Presentation slides often use
                  custom layout boxes, graphic backgrounds, and complex
                  typography that may look broken on devices lacking matching
                  presentation viewers or fonts. Converting to PDF standardizes
                  the slides so they look identical across all computers and web
                  browsers.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  SmartPDFs Pro processes your slides securely over HTTPS. Our
                  conversion engine parses all graphic components, backgrounds,
                  and titles, and{" "}
                  <strong className="text-orange-500 font-bold">
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
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                  <ArrowRight size={24} />
                </span>
                How to convert PowerPoint to PDF in 3 Simple Steps
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />

                {[
                  {
                    step: "01",
                    title: "Upload Slides",
                    desc: "Drag and drop your PPTX or PPT presentation file into the upload zone above.",
                  },
                  {
                    step: "02",
                    title: "Parse Pages",
                    desc: "Our layout parser converts presentation blocks, charts, text fields, and image layers instantly.",
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
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-orange-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-orange-500/40 transition-all duration-300">
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
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
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
                    business presentations, files are removed automatically and
                    permanently within 1 hour after conversion.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Zap size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-orange-500 transition-colors">
                    Perfect Graphic Fidelity
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    Our layout parser supports smart presentation graphics,
                    embedded tables, vector lines, titles, and landscape borders
                    to generate perfect high-quality PDF files.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Supports both modern .pptx and legacy .ppt files.",
                    "Retains layout orientation, landscape styles, and image dimensions.",
                    "No watermark overlays added, leaving your slides 100% professional.",
                    "Works across mobile and tablet browsers without account signups.",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium"
                    >
                      <span className="p-0.5 rounded-full bg-orange-500/10 text-orange-600 mt-0.5 shrink-0">
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
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Why convert PowerPoint to PDF?",
                    a: "PDF documents look identical on every screen. Converting slides to PDF ensures that layout alignment, shapes, font sizes, and image quality remain exactly as intended when shared.",
                  },
                  {
                    q: "Will slide layouts and formatting be altered?",
                    a: "No. Our parser reproduces font styles, text frames, background designs, graphics, tables, and shapes faithfully onto matching PDF pages.",
                  },
                  {
                    q: "Are my uploaded presentations private?",
                    a: "Absolutely. Your presentation files are uploaded over encrypted HTTPS protocols, converted inside our sandbox system, and permanently deleted from our servers within 1 hour.",
                  },
                  {
                    q: "Which PowerPoint document extensions are supported?",
                    a: "We support modern PPTX files (PowerPoint 2007+) as well as legacy PPT files (PowerPoint 97-2003) for seamless PDF creation.",
                  },
                  {
                    q: "What is the best free PowerPoint to PDF converter online?",
                    a: "SmartPDFPro provides a fast and secure PowerPoint to PDF converter that transforms PPT and PPTX presentations into professional PDF documents online for free.",
                  },

                  {
                    q: "Can I convert PowerPoint to PDF online without software?",
                    a: "Yes, SmartPDFPro works entirely online and does not require Microsoft PowerPoint, Adobe Acrobat, or desktop software installation.",
                  },

                  {
                    q: "How do I convert a PowerPoint presentation to PDF?",
                    a: "Upload your PPT or PPTX presentation, click the convert button, and download the generated PDF instantly.",
                  },

                  {
                    q: "Can I convert PPTX files to PDF for free?",
                    a: "Yes, SmartPDFPro supports free PPTX to PDF conversion without signup or account registration.",
                  },

                  {
                    q: "Will slide formatting remain after conversion?",
                    a: "Yes, SmartPDFPro preserves slide layouts, fonts, graphics, images, tables, animations, alignments, and presentation formatting during conversion.",
                  },

                  {
                    q: "Can I convert older PPT files into PDF?",
                    a: "Yes, SmartPDFPro supports both legacy PPT presentations and modern PPTX PowerPoint files.",
                  },

                  {
                    q: "Can I convert PowerPoint presentations on mobile devices?",
                    a: "Yes, the PowerPoint to PDF converter works on Android, iPhone, tablets, Windows, and Mac browsers.",
                  },

                  {
                    q: "Do I need Microsoft PowerPoint to convert presentations to PDF?",
                    a: "No, SmartPDFPro converts PowerPoint presentations online without requiring Microsoft Office or PowerPoint software.",
                  },

                  {
                    q: "Is SmartPDFPro PowerPoint to PDF tool secure?",
                    a: "Yes, SmartPDFPro uses encrypted HTTPS connections and automatically deletes uploaded presentation files after processing.",
                  },

                  {
                    q: "Are uploaded PowerPoint files stored permanently?",
                    a: "No, uploaded presentations are processed securely and automatically removed after conversion.",
                  },

                  {
                    q: "Can businesses use SmartPDFPro PowerPoint to PDF converter?",
                    a: "Yes, businesses, students, teachers, trainers, sales teams, and office professionals use SmartPDFPro for presentation conversion workflows.",
                  },

                  {
                    q: "Can I convert presentation slides for printing or sharing?",
                    a: "Yes, converting PowerPoint to PDF is ideal for printing, sharing, archiving, presentations, and maintaining consistent formatting.",
                  },

                  {
                    q: "Will images and charts remain after conversion?",
                    a: "Yes, SmartPDFPro preserves embedded images, charts, diagrams, backgrounds, and visual slide elements during conversion.",
                  },

                  {
                    q: "Can I convert business presentations and pitch decks to PDF?",
                    a: "Yes, SmartPDFPro supports converting pitch decks, reports, business presentations, lecture slides, proposals, and training materials into PDF.",
                  },

                  {
                    q: "Can I use PowerPoint to PDF converter without registration?",
                    a: "Yes, SmartPDFPro allows users to convert presentations instantly without account creation or login.",
                  },

                  {
                    q: "Does SmartPDFPro add watermarks to converted PDFs?",
                    a: "No, SmartPDFPro does not add watermarks or branding to generated PDF documents.",
                  },

                  {
                    q: "Can students use SmartPDFPro PowerPoint to PDF tool?",
                    a: "Yes, students and teachers use SmartPDFPro to convert lecture slides, assignments, project presentations, and educational content into PDFs.",
                  },

                  {
                    q: "Can I convert large PowerPoint presentations into PDF?",
                    a: "Yes, SmartPDFPro supports converting large presentations depending on upload size and processing limitations.",
                  },

                  {
                    q: "Can I preserve slide orientation and page sizes after conversion?",
                    a: "Yes, SmartPDFPro maintains original slide dimensions, orientations, and layouts during PDF generation.",
                  },

                  {
                    q: "Can I convert PowerPoint presentations offline?",
                    a: "PowerPoint to PDF conversion may require internet connectivity because cloud-based conversion engines are used for accurate rendering.",
                  },

                  {
                    q: "What types of presentations are supported?",
                    a: "SmartPDFPro supports business presentations, pitch decks, training slides, lecture notes, educational presentations, reports, and marketing materials.",
                  },

                  {
                    q: "Why use SmartPDFPro to convert PowerPoint to PDF?",
                    a: "SmartPDFPro offers fast conversion, secure processing, mobile compatibility, formatting preservation, and watermark-free PDF downloads in one modern platform.",
                  },

                  {
                    q: "What makes SmartPDFPro different from other PPT to PDF converters?",
                    a: "SmartPDFPro combines secure cloud conversion, formatting accuracy, fast rendering, and user-friendly browser workflows in a simple interface.",
                  },

                  {
                    q: "Does SmartPDFPro support browser-based presentation conversion?",
                    a: "Yes, SmartPDFPro provides browser-based PDF tools including PowerPoint to PDF, merge, split, compress, organize, convert, protect, and ecommerce warehouse automation workflows.",
                  },
                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                      <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <span className="p-1.5 rounded-full bg-orange-500/10 text-orange-500 shrink-0">
  <HelpCircle size={18} />
</span>
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
                className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 text-left focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
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
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-orange-500 transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {t.description}
                  </p>
                </div>
                <div className="mt-auto pt-2 text-xs font-bold text-orange-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
