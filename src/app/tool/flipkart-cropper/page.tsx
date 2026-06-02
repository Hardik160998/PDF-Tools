import { getToolMeta, getToolUrl } from "@/data/toolMeta";
import WebAppSchema from '@/components/seo/WebAppSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import Link from "next/link";
import type { Metadata } from "next";
import FlipkartCropper from "@/components/tools/FlipkartCropper";
import CreditGate from "@/components/credits/CreditGate";
import {
  ShoppingBag,
  Upload,
  Scissors,
  Download,
  Wand2,
  Crop,
  Combine,
  Zap,
  Lock,
  CheckCircle,
  Info,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Star,
  Check,
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

// 1. Dynamic Metadata Export for Next.js App Router (SEO & Indexing Fix)


// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Flipkart Label Cropper",
  url: `${siteUrl}/tool/flipkart-cropper`,
  image: `${siteUrl}/img/flipkart-cropper-og.png`,
  description:
    "Crop Flipkart shipping label PDFs online for free. Automatically extract clean labels with E-kart logistics anchors, reorder by SKU/Quantity, and download printable PDFs or PNGs.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "100% browser local processing for absolute privacy",
    "Precise OCR detection using anchors like 'E-kart Logistics' and 'Not for resale'",
    "Allows sorting by Quantity, SKU ID, or AWB tracking ID",
    "Supports exporting cropped labels as separate PNG images",
    "Visual highlight tools to point out bulk orders",
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
      name: "Flipkart Label Cropper",
      item: `${siteUrl}/tool/flipkart-cropper`,
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does Flipkart Label Cropper detect the labels on each page?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool uses optical text anchors to scan for 'E-kart Logistics' (the top header) and 'Not for resale' (the bottom footer). It crops precisely around these boundaries to prevent any barcode or invoice bleed.",
      },
    },
    {
      "@type": "Question",
      name: "Are my Flipkart PDFs uploaded anywhere?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Never. All parsing, OCR coordinates, and PDF rendering are processed inside your browser runtime. No document files are ever uploaded or transmitted to any servers, providing absolute safety.",
      },
    },
    {
      "@type": "Question",
      name: "Can I crop multiple Flipkart label pages?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can upload multi-page label documents or upload multiple PDFs at once. The tool batch-processes every page and merges the clean labels into a single download document.",
      },
    },
  ],
};

const STEPS = [
  {
    icon: Upload,
    title: "Upload Flipkart Label PDF",
    desc: "Drop one or multiple Flipkart shipping label PDFs. Everything runs in your browser — no uploads to any server.",
  },
  {
    icon: Wand2,
    title: "Smart OCR Detection",
    desc: 'The tool scans for "E-kart Logistics" (top) and "Not for resale" (bottom) anchors to precisely locate the label area.',
  },
  {
    icon: Download,
    title: "Download Clean Labels",
    desc: "Cropped labels with AWB, QR code, address & barcode are merged into one print-ready PDF. PNG export also available.",
  },
];

const RELATED = [
  {
    id: "meesho-cropper",
    title: "Meesho Label Cropper",
    description:
      'Remove invoice section below "Total" from Meesho shipping label PDFs.',
    icon: ShoppingBag,
    gradient: "linear-gradient(135deg, #f26522, #f59e0b)",
    shadow: "rgba(242,101,34,0.3)",
    tag: "Ecommerce",
    href: "/tool/meesho-cropper",
  },
  {
    id: "meshocrop",
    title: "Meesho Crop Label (without invoice)",
    description:
      "Crop Meesho labels to keep only shipping address, return address & barcodes.",
    icon: ShoppingBag,
    gradient: "linear-gradient(135deg, #f26522, #f59e0b)",
    shadow: "rgba(242,101,34,0.3)",
    tag: "Ecommerce",
    href: "/tool/meshocrop",
  },
  {
    id: "aadhar-crop",
    title: "Aadhar Cropper",
    description:
      "Perfectly crop Aadhar ID cards from e-Aadhar PDF for high quality printing.",
    icon: Wand2,
    gradient: "linear-gradient(135deg, #ef4444, #991b1b)",
    shadow: "rgba(239,68,68,0.3)",
    tag: "Special",
    href: "/tool/aadhar-crop",
  },
  {
    id: "crop-pdf",
    title: "Crop PDF",
    description:
      "Trim margins and crop any pages of your PDF with custom margin controls.",
    icon: Crop,
    gradient: "linear-gradient(135deg, #f26522, #c2410c)",
    shadow: "rgba(242,101,34,0.3)",
    tag: "Special",
    href: "/tool/crop-pdf",
  },
  {
    id: "merge",
    title: "Merge PDF",
    description:
      "Combine multiple PDF files into one document in the order you choose.",
    icon: Combine,
    gradient: "linear-gradient(135deg, #f26522, #c2410c)",
    shadow: "rgba(242,101,34,0.3)",
    tag: "Organize",
    href: "/tool/merge",
  },
  {
    id: "compress",
    title: "Compress PDF",
    description:
      "Reduce PDF file size while keeping text sharp and content intact.",
    icon: Zap,
    gradient: "linear-gradient(135deg, #22c55e, #15803d)",
    shadow: "rgba(34,197,94,0.3)",
    tag: "Optimize",
    href: "/tool/compress",
  },
];


export function generateMetadata() {
  const id = 'flipkart-cropper';
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

export default function FlipkartCropperPage() {
  const ACCENT = "#F7941D";

  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta('flipkart-cropper');
        return meta ? (
          <>
            <WebAppSchema name={`${meta.title} – Free Online Tool`} description={meta.description} url={getToolUrl('flipkart-cropper')} />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema items={[{ label: 'Tools', href: '/#tools' }, { label: meta.title, href: `/tool/flipkart-cropper` }]} />
          </>
        ) : null;
      })()}

      {/* 2. Structured data scripts for search indexing */}
      
      
      

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">
        {/* Breadcrumb Navigation */}
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
          <span
            className="text-slate-600 dark:text-slate-300"
            aria-current="page"
          >
            Flipkart Cropper
          </span>
        </nav>

        {/* Dynamic Client Tool Component */}
        <section
          aria-label="Flipkart Label Cropper Workspace"
          className="mb-16"
        >
          <CreditGate toolName="flipkart-cropper" showCounter={false}>
            <FlipkartCropper id="flipkart-cropper" />
          </CreditGate>
        </section>

        {/* How It Works Quick View */}
        <section
          aria-label="Tool Steps Overview"
          className="py-16 bg-white/60 dark:bg-slate-900/60 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm mb-20"
        >
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center uppercase">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center"
                >
                  <div
                    className="inline-flex p-4 rounded-2xl mb-4 text-white animate-bounce"
                    style={{ background: `${ACCENT}22`, color: ACCENT }}
                  >
                    <s.icon size={28} />
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                    Step {i + 1}
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detection Logic Overview */}
        <section
          aria-label="Detection Logic"
          className="py-16 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800/50 mb-20"
        >
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center uppercase">
              Smart Detection Logic
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: "Top Anchor",
                  value: '"E-kart Logistics"',
                  color: "#22c55e",
                  desc: "Crop starts just above this text",
                },
                {
                  label: "Bottom Anchor",
                  value: '"Not for resale"',
                  color: "#ef4444",
                  desc: "Crop ends just before this text",
                },
                {
                  label: "Left Anchor",
                  value: '"STD" text',
                  color: "#3182ce",
                  desc: "Left border of the label area",
                },
                {
                  label: "Right Anchor",
                  value: '"E" routing cell',
                  color: "#8b5cf6",
                  desc: "Right border of the label area",
                },
              ].map((a) => (
                <div
                  key={a.label}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex gap-4 items-start"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md text-xs font-black"
                    style={{ background: a.color }}
                  >
                    {a.label.split(" ")[0][0]}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-sm mb-0.5">
                      {a.label}
                    </h3>
                    <code
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ background: `${a.color}18`, color: a.color }}
                    >
                      {a.value}
                    </code>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed font-medium">
                      {a.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                ⚡ Fallback: If OCR anchors are not found (scanned/image PDFs),
                the tool automatically detects the largest bordered rectangle in
                the upper half of the page.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Complete SEO Optimized Content Section */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">
          <div className="mb-16 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-orange-500/10 dark:bg-orange-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-orange-600 dark:from-white dark:via-slate-200 dark:to-orange-500 bg-clip-text text-transparent">
              Flipkart Shipping Label Cropper <br />
              <span className="text-orange-500 dark:text-orange-400">
                100% Free &amp; Offline
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Extract clean AWB shipping labels from your Flipkart PDF sheets
              without invoice spill or details. Sort sheets by quantity, SKU, or
              tracking ID automatically.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is Flipkart Cropper */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is the Flipkart Label Cropper?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  When fulfilling orders on Flipkart, the downloaded PDF sheets
                  bundle customer delivery details together with extra payment
                  records and invoices. Standard sticky labels need to exclude
                  these billing segments. The Flipkart Label Cropper scans page
                  layouts for coordinates like 'E-kart Logistics' and crops the
                  clean sticker layout perfectly.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  Our tool processes all files{" "}
                  <strong className="text-orange-500 font-black">
                    locally inside your browser engine
                  </strong>
                  . Your files are not uploaded to servers, ensuring maximum
                  security and absolute privacy for your business.
                </p>
              </div>
            </div>

            {/* How to use */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                  <ArrowRight size={24} />
                </span>
                How to Crop Flipkart Labels in 3 Steps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                {[
                  {
                    step: "01",
                    title: "Select PDFs",
                    desc: "Drag and drop your Flipkart label PDFs into the crop workspace.",
                  },
                  {
                    step: "02",
                    title: "Sort & Highlight",
                    desc: "Configure settings to sort by SKU/Quantity and highlight bulk orders.",
                  },
                  {
                    step: "03",
                    title: "Print PDF",
                    desc: "Click Start Extraction to build the clean PDF. Download and print.",
                  },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="relative z-10 flex flex-col items-center text-center space-y-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white font-black flex items-center justify-center shadow-lg shadow-orange-500/20">
                      {s.step}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase">
                      {s.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="space-y-8 max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Can I export cropped labels as images?",
                    a: "Yes! Check the 'Export PNGs' option in settings. The tool will generate a downloadable package of label images alongside the PDF document.",
                  },
                  {
                    q: "What is the fallback logic for scanned Flipkart documents?",
                    a: "If the tool cannot locate optical text labels, the fallback logic automatically detects the largest bordered rectangle in the upper half of the page and crops it.",
                  },
                  {
                    q: "Is there a charge for cropping Flipkart labels?",
                    a: "No, our cropper is completely free to use online, with local client-side processing.",
                  },
                ].map((faq, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                      <span className="font-outfit text-sm sm:text-base font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
                        <HelpCircle
                          size={18}
                          className="text-orange-500 shrink-0"
                        />
                        {faq.q}
                      </span>
                      <ChevronDown
                        size={18}
                        className="text-slate-400 transition-transform duration-300 group-open:rotate-180 shrink-0 ml-4"
                      />
                    </summary>
                    <div className="px-6 pb-6 border-t border-slate-50 dark:border-slate-800 pt-4">
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Related Tools Section */}
            <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
              <h3 className="font-outfit text-sm font-black text-slate-400 uppercase tracking-widest mb-6 text-center">
                Related Ecommerce &amp; PDF Tools
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {RELATED.map((tool, idx) => (
                  <Link
                    key={idx}
                    href={tool.href}
                    className="group p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col justify-center"
                  >
                    <span className="font-outfit text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-orange-500 transition-colors">
                      {tool.title}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium leading-none">
                      {tool.description}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
