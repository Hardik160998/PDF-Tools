import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from '@/components/seo/WebAppSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import Link from "next/link";
import type { Metadata } from "next";
import MeeshoCropper from "@/components/tools/MeeshoCropper";
import MeeshoTitleSync from "@/components/tools/MeeshoTitleSync";
import CreditGate from "@/components/credits/CreditGate";
import {
  ShoppingBag,
  Upload,
  Scissors,
  Download,
  Zap,
  FileText,
  Wand2,
  Crop,
  Combine,
  Lock,
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
  name: "Meesho Label with Invoice Cropper",
  url: `${siteUrl}/tool/meesho-cropper`,
  image: `${siteUrl}/img/meesho-cropper-og.png`,
  description:
    "Crop Meesho shipping label PDFs online for free. Automatically remove the invoice section below 'Total', sort by SKU or Quantity, and download a print-ready PDF.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 support",
  featureList: [
    "100% browser-based local processing for absolute privacy",
    "Auto detects 'Total' row to crop invoice section below it",
    "Sort labels by Quantity, SKU ID, or Courier brand",
    "Highlight SKU ID for easy warehouse verification",
    "Export metadata CSV of all processed orders",
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
      name: "Meesho Label Cropper",
      item: `${siteUrl}/tool/meesho-cropper`,
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does the Meesho Label Cropper remove the invoice section?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool uses local PDF scanning to find the 'Total' text alignment on each shipping label page. It then automatically crops and removes everything below that boundary line, leaving only the clean label layout.",
      },
    },
    {
      "@type": "Question",
      name: "Are my Meesho label PDFs uploaded to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The entire process takes place in your browser memory via JavaScript. No document files are ever uploaded or transmitted to any servers, making it 100% private and secure.",
      },
    },
    {
      "@type": "Question",
      name: "Can I sort Meesho labels by SKU ID?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our advanced warehouse tools allow you to sort pages by SKU ID, Quantity, or Courier partner. You can also highlight SKU IDs with a visible boundary for faster packing.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a limit on the number of pages I can upload?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Since processing happens locally, there are no artificial file size limits. You can drop multiple PDFs with hundreds of combined pages, and they will process instantly.",
      },
    },
  ],
};

const STEPS = [
  {
    icon: Upload,
    title: "Upload Label PDFs",
    desc: "Drop one or multiple Meesho shipping label PDFs. Everything runs in your browser — no uploads to any server.",
  },
  {
    icon: Scissors,
    title: "Auto Crop Invoice",
    desc: 'The tool scans each page, finds the "Total" line and removes everything below it automatically.',
  },
  {
    icon: Download,
    title: "Download Clean PDF",
    desc: "All cropped labels are merged into one clean PDF, ready to print and stick on your packages.",
  },
];

const RELATED_TOOLS = [
  {
    id: "meshocrop",
    title: "Meesho Crop (No Invoice)",
    description:
      "Crop Meesho labels to keep only shipping address & return address details.",
    icon: ShoppingBag,
    gradient: "linear-gradient(135deg, #f26522, #f59e0b)",
    shadow: "rgba(242,101,34,0.3)",
    tag: "Ecommerce",
  },
  {
    id: "flipkart-cropper",
    title: "Flipkart Cropper",
    description:
      "Perfectly crop Flipkart label PDFs using smart OCR detection anchors.",
    icon: ShoppingBag,
    gradient: "linear-gradient(135deg, #f7941d, #c2410c)",
    shadow: "rgba(247,148,29,0.3)",
    tag: "Ecommerce",
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
  },
];


export function generateMetadata() {
  const id = 'meesho-cropper';
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

export default function MeeshoCropperPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

      {/* Dynamic SEO Schemas */}
      {(() => {
        const meta = getToolMeta('meesho-cropper');
        return meta ? (
          <>
            <WebAppSchema name={`${meta.title} – Free Online Tool`} description={meta.description} url={getToolUrl('meesho-cropper')} />
            {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
            <BreadcrumbSchema items={[{ label: 'Tools', href: '/#tools' }, { label: meta.title, href: `/tool/meesho-cropper` }]} />
          </>
        ) : null;
      })()}

      {/* 2. Structured data scripts for search indexing */}
      
      
      

      <MeeshoTitleSync />

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
            Meesho Cropper
          </span>
        </nav>

        {/* Dynamic Client Tool Component */}
        <section
          aria-label="Meesho Shipping Label Cropper Workspace"
          className="mb-16"
        >
          <CreditGate toolName="meesho-cropper" showCounter={false}>
            <MeeshoCropper id="meesho-cropper" />
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
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center"
                >
                  <div className="inline-flex p-4 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 mb-4">
                    <step.icon size={28} />
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                    Step {i + 1}
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Use This Tool */}
        <section
          aria-label="Tool Features"
          className="py-16 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800/50 mb-20"
        >
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center uppercase">
              Why Use This Tool
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Zap,
                  color: "#f26522",
                  title: "Instant Processing",
                  desc: "All processing happens in your browser using JavaScript — no server, no waiting, instant results.",
                },
                {
                  icon: FileText,
                  color: "#22c55e",
                  title: "100% Private",
                  desc: "Your PDF files never leave your device. Zero data collection, fully secure and offline-capable.",
                },
                {
                  icon: FileText,
                  color: "#3182ce",
                  title: "Batch PDF Support",
                  desc: "Upload multiple Meesho label PDFs at once and process them all in a single click.",
                },
                {
                  icon: Scissors,
                  color: "#8b5cf6",
                  title: "Smart Auto-Crop",
                  desc: 'Automatically detects the "Total" row on each page — no manual selection or configuration needed.',
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex gap-4 items-start"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md animate-pulse"
                    style={{ background: f.color }}
                  >
                    <f.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-sm mb-1">
                      {f.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Complete SEO Optimized Content Section */}
        <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">
          <div className="mb-16 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-orange-500/10 dark:bg-orange-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-orange-600 dark:from-white dark:via-slate-200 dark:to-orange-500 bg-clip-text text-transparent">
              Meesho Label &amp; Invoice Cropper <br />
              <span className="text-orange-500 dark:text-orange-400">
                100% Free &amp; Private
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Remove invoice details below the total line on Meesho shipping
              labels. Sort your PDF labels by SKU, courier, or quantity
              automatically in your browser sandbox.
            </p>
          </div>

          <article className="space-y-16">
            {/* What is Meesho Cropper */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is the Meesho Label Cropper?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  When sellers download shipping labels from Meesho, each page
                  contains both the shipping label and the customer invoice
                  block. Printing the whole sheet wastes expensive sticker label
                  space and ink. The Meesho Label Cropper scans the label
                  layouts, locates the billing boundaries, and strips away the
                  invoice segment.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  Our tool runs{" "}
                  <strong className="text-orange-500 font-black">
                    100% offline inside your browser sandbox
                  </strong>
                  . No shipping labels, names, order IDs, or tracking barcodes
                  are uploaded to cloud servers, keeping your customer databases
                  completely secure.
                </p>
              </div>
            </div>

            {/* How to use */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                  <ArrowRight size={24} />
                </span>
                Crop Meesho Labels in 3 Easy Steps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                {[
                  {
                    step: "01",
                    title: "Select Labels",
                    desc: "Drag and drop your Meesho PDF labels directly into the secure upload area above.",
                  },
                  {
                    step: "02",
                    title: "Configure Sorting",
                    desc: "Enable SKU ID grouping, courier sorting, or highlight features in the settings sidebar.",
                  },
                  {
                    step: "03",
                    title: "Save PDF",
                    desc: "Click Crop PDF. The tool merges clean cropped sheets into one file. Save and print instantly.",
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
                    q: "Does this Meesho cropper crop multiple pages at once?",
                    a: "Yes! You can select and process multi-page PDF documents or upload multiple independent PDF files simultaneously. The engine batch-processes all pages instantly.",
                  },
                  {
                    q: "What settings are available in the cropper panel?",
                    a: "You can check settings to sort sheets by quantity, group pages by SKU code, highlight product SKUs for packing verification, sort courier groups, and export metadata into a clean CSV spreadsheet.",
                  },
                  {
                    q: "Will this tool affect barcode rendering or scannability?",
                    a: "No. The cropper uses vector path cropping. It strips the coordinate view area of the invoice page boundary without editing text characters or barcode graphics, keeping tracking tags 100% sharp.",
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
                {RELATED_TOOLS.map((tool, idx) => (
                  <Link
                    key={idx}
                    href={`/tool/${tool.id}`}
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
