import Link from "next/link";
import type { Metadata } from "next";
import MeeshoCropLabel from "@/components/tools/MeeshoCropLabel";
import MeeshoTitleSync from "@/components/tools/MeeshoTitleSync";
import CreditGate from "@/components/credits/CreditGate";
import {
  ShoppingBag, Upload, Scissors, Download, Zap, FileText, Wand2, Crop, Combine, Lock, Info, ArrowRight, HelpCircle, ChevronDown, Star, Check
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://smartpdfpro.com/";

// 1. Dynamic Metadata Export for Next.js App Router (SEO & Indexing Fix)
export const metadata: Metadata = {
  title: "Meesho Label Crop (Without Invoice) | Auto Crop Shipping Info",
  description: "Crop Meesho shipping label PDFs online for free to keep only the shipping address, return details & barcodes. Automatically removes the TAX INVOICE section completely.",
  keywords: "meshocrop, crop meesho label without invoice, meesho label cropper, remove tax invoice meesho, split meesho pdf, label cropper 2x2 grid",
  alternates: {
    canonical: `${siteUrl}/tool/meshocrop`,
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
    title: "Meesho Label Crop (Without Invoice) | Auto Crop Shipping Info",
    description: "Crop Meesho shipping label PDFs online for free to keep only the shipping address, return details & barcodes. Automatically removes the TAX INVOICE section completely.",
    siteName: "SmartPDFs Plus",
    url: `${siteUrl}/tool/meshocrop`,
    images: [
      {
        url: `${siteUrl}/img/meshocrop-og.png`,
        width: 1200,
        height: 630,
        alt: "Meesho Label Crop (Without Invoice) - SmartPDFs Plus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meesho Label Crop (Without Invoice) | Auto Crop Shipping Info",
    description: "Crop Meesho shipping label PDFs online for free to keep only the shipping address, return details & barcodes. Automatically removes the TAX INVOICE section completely.",
    images: [`${siteUrl}/img/meshocrop-og.png`],
  },
};

// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Meesho Label Crop (Without Invoice)",
  "url": `${siteUrl}/tool/meshocrop`,
  "image": `${siteUrl}/img/meshocrop-og.png`,
  "description": "Crop Meesho shipping label PDFs online for free. Strip invoice details and prepare labels for standard 4-per-page A4 sticker printing.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires HTML5 support",
  "featureList": [
    "Processes files 100% locally in browser WebAssembly sandbox",
    "Auto detects 'TAX INVOICE' text to crop and strip invoice info",
    "Options to organize output into a 2x2 grid layout (4 labels per A4 page)",
    "Sort labels by Quantity, SKU ID, or Courier partner",
    "Download order metadata CSV instantly"
  ],
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": siteUrl
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Tools",
      "item": `${siteUrl}/#tools-grid`
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Meesho Label Crop without Invoice",
      "item": `${siteUrl}/tool/meshocrop`
    }
  ]
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the difference between Meesho Cropper and Meesho Crop (Without Invoice)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The standard Meesho Cropper removes details below the Total line but leaves some shipping tables. The Crop Without Invoice tool goes a step further by scanning for 'TAX INVOICE' and stripping it entirely, generating compact barcodes and address grids suitable for 4 labels per A4 page."
      }
    },
    {
      "@type": "Question",
      "name": "Does this tool support 4 labels per A4 page printing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Check the '4 Labels per A4 page' box in the sidebar settings. The engine will layout the cropped shipping label blocks in a neat 2x2 grid layout automatically."
      }
    },
    {
      "@type": "Question",
      "name": "Are my shipping documents safe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Completely secure. All PDF pages are rendered and cropped inside your browser sandbox. No file packets are transmitted over the web, ensuring absolute privacy."
      }
    }
  ]
};

const STEPS = [
  { icon: Upload, title: 'Upload Meesho Labels', desc: 'Drop one or multiple Meesho shipping label PDFs. Everything runs in your browser — no uploads to any server.' },
  { icon: Scissors, title: 'Auto Crop TAX INVOICE', desc: 'The tool scans each page, finds "TAX INVOICE" text and crops everything from top to just above that line.' },
  { icon: Download, title: 'Download Clean Labels', desc: 'All cropped labels with only shipping info, return address & barcodes are merged into one PDF.' },
];

const RELATED_TOOLS = [
  { id: 'meesho-cropper', title: 'Meesho Invoice Cropper', description: 'Remove invoice section below "Total" from Meesho labels. Complementary to this tool.', icon: ShoppingBag, gradient: 'linear-gradient(135deg, #f26522, #f59e0b)', shadow: 'rgba(242,101,34,0.3)', tag: 'Ecommerce' },
  { id: 'flipkart-cropper', title: 'Flipkart Cropper', description: 'Perfectly crop Flipkart label PDFs using smart OCR detection anchors.', icon: ShoppingBag, gradient: 'linear-gradient(135deg, #f7941d, #c2410c)', shadow: 'rgba(247,148,29,0.3)', tag: 'Ecommerce' },
  { id: 'aadhar-crop', title: 'Aadhar Cropper', description: 'Perfectly crop Aadhar ID cards from e-Aadhar PDF for high quality printing.', icon: Wand2, gradient: 'linear-gradient(135deg, #ef4444, #991b1b)', shadow: 'rgba(239,68,68,0.3)', tag: 'Special' },
  { id: 'crop-pdf', title: 'Crop PDF', description: 'Trim margins and crop any pages of your PDF with custom margin controls.', icon: Crop, gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)', tag: 'Special' },
  { id: 'merge', title: 'Merge PDF', description: 'Combine multiple PDF files into one document in the order you choose.', icon: Combine, gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'rgba(242,101,34,0.3)', tag: 'Organize' },
  { id: 'compress', title: 'Compress PDF', description: 'Reduce PDF file size while keeping text sharp and content intact.', icon: Zap, gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.3)', tag: 'Optimize' },
];

export default function MeeshoCropPage() {
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

      <MeeshoTitleSync />

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          <Link href="/" className="hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/tool" className="hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1">
            Tools
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-600 dark:text-slate-300" aria-current="page">Meesho Crop without Invoice</span>
        </nav>

        {/* Dynamic Client Tool Component */}
        <section aria-label="Meesho Crop Label without Invoice Workspace" className="mb-16">
          <CreditGate toolName="meshocrop" showCounter={false}>
            <MeeshoCropLabel id="meshocrop" />
          </CreditGate>
        </section>

        {/* How It Works Quick View */}
        <section aria-label="Tool Steps Overview" className="py-16 bg-white/60 dark:bg-slate-900/60 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm mb-20">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center uppercase">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((step, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                  <div className="inline-flex p-4 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 mb-4">
                    <step.icon size={28} />
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Step {i + 1}</div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Use This Tool */}
        <section aria-label="Tool Features" className="py-16 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800/50 mb-20">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center uppercase">Why Use This Tool</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Zap, color: '#f26522', title: 'Instant Processing', desc: 'All processing happens in your browser using JavaScript — no server, no waiting, instant results.' },
                { icon: FileText, color: '#22c55e', title: '100% Private', desc: 'Your PDF files never leave your device. Zero data collection, fully secure and offline-capable.' },
                { icon: FileText, color: '#3182ce', title: 'Batch PDF Support', desc: 'Upload multiple Meesho label PDFs at once and process them all in a single click.' },
                { icon: Scissors, color: '#8b5cf6', title: 'Smart Auto-Crop', desc: 'Automatically detects "TAX INVOICE" text on each page — no manual selection or configuration needed.' },
              ].map(f => (
                <div key={f.title} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md animate-pulse" style={{ background: f.color }}>
                    <f.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-sm mb-1">{f.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">{f.desc}</p>
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
              Meesho Crop Shipping Labels <br />
              <span className="text-orange-500 dark:text-orange-400">Without Tax Invoice Details</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Quickly strip the invoice layout from your downloads. Generate pure shipping labels and output them in standard grids or single sheets for instant printing.
            </p>
          </div>

          <article className="space-y-16">

            {/* What is Meesho Crop */}
            <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 shrink-0">
                <Info size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  What is Meesho Crop (Without Invoice)?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                  Normally, Meesho downloads bundle the customer shipping details together with detailed tax invoice sheets. For compact thermal printing, or to print multiple labels on a single A4 sticker sheet in a 2x2 grid, you need to extract only the address barcode sections. This cropper tool searches the PDF vectors for the TAX INVOICE header, crops everything below it, and exports clean logistics templates.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  The processing occurs <strong className="text-orange-500 font-black">entirely locally in WebAssembly code</strong> inside your browser frame. No merchant data, customer credentials, or barcode lists are sent over the network, providing ultimate enterprise-grade privacy.
                </p>
              </div>
            </div>

            {/* How to use */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500"><ArrowRight size={24} /></span>
                How to Crop &amp; Print 4 Labels on A4 Sheet
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                {[
                  { step: "01", title: "Drop Files", desc: "Upload your Meesho PDF shipping label sheets into the dashed area above." },
                  { step: "02", title: "Select 4 per A4", desc: "Enable the '4 Labels per A4 page (2x2 Grid)' box in the settings menu." },
                  { step: "03", title: "Print Layout", desc: "Process and download. The tool aligns your labels into standard A4 sheets automatically." }
                ].map((s, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white font-black flex items-center justify-center shadow-lg shadow-orange-500/20">{s.step}</div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase">{s.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">{s.desc}</p>
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
                    q: "Can I split thermal labels by Courier partner?",
                    a: "Yes! If you select the 'Split by Courier' option in settings, the engine automatically clusters your labels into distinct PDF files for Delhivery, Xpressbees, Shadowfax, Valmo, etc."
                  },
                  {
                    q: "Does this tool work on mobile devices?",
                    a: "Yes. Our responsive mobile layout runs fast on tablets and smartphones, allowing you to crop labels on-the-go from any browser."
                  },
                  {
                    q: "What barcode formats are preserved?",
                    a: "The tool preserves all vector bar tags, QR codes, and E-commerce routing IDs at native quality without rasterization blur, keeping scan tools functional."
                  }
                ].map((faq, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                      <span className="font-outfit text-sm sm:text-base font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
                        <HelpCircle size={18} className="text-orange-500 shrink-0" />
                        {faq.q}
                      </span>
                      <ChevronDown size={18} className="text-slate-400 transition-transform duration-300 group-open:rotate-180 shrink-0 ml-4" />
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
