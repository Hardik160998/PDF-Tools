import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from '@/components/seo/WebAppSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import OcrPdf from "@/components/tools/OcrPdf";
import CreditGate from "@/components/credits/CreditGate";
import Link from "next/link";
import type { Metadata } from "next";
import {
 FileText,
 ArrowRight,
 HelpCircle,
 Star,
 Check,
 ChevronDown,
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

// 1. Dynamic Metadata Export for Next.js App Router


// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
 "@context": "https://schema.org",
 "@type": "WebApplication",
 name: "OCR PDF Online Free",
 url: `${siteUrl}/tool/ocr-pdf`,
 image: `${siteUrl}/img/ocr-pdf-og.png`,
 description:
 "OCR PDF files online for free. Convert scanned PDFs and images into fully searchable, selectable PDF documents. 100% secure, local in-browser OCR scanning.",
 applicationCategory: "UtilityApplication",
 operatingSystem: "All",
 browserRequirements: "Requires HTML5 support",
 featureList: [
 "100% Local processing in your browser sandbox",
 "No file uploads to servers",
 "Uses Tesseract OCR engine for text recognition",
 "Generates searchable overlay text layers",
 "Supports multiple document formats and scans",
 "Fast character mapping with zero leaks",
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
 name: "OCR PDF",
 item: `${siteUrl}/tool/ocr-pdf`,
 },
 ],
};

const faqJsonLd = {
 "@context": "https://schema.org",
 "@type": "FAQPage",
 mainEntity: [
 {
 "@type": "Question",
 name: "How can I convert a scanned PDF to a searchable PDF?",
 acceptedAnswer: {
 "@type": "Answer",
 text: "Upload your scanned PDF to our OCR PDF tool. Select your document's language and click 'Run OCR'. Our in-browser Tesseract engine scans the document, injects a selectable text layer, and downloads the searchable PDF.",
 },
 },
 {
 "@type": "Question",
 name: "Is my scanned document uploaded to a server?",
 acceptedAnswer: {
 "@type": "Answer",
 text: "No! Tesseract OCR operates completely inside your web browser sandbox using WebAssembly. No text elements or document pages are ever transmitted to external servers.",
 },
 },
 {
 "@type": "Question",
 name: "What languages does the OCR tool support?",
 acceptedAnswer: {
 "@type": "Answer",
 text: "The OCR engine is configured with English text datasets by default to recognize alphanumeric characters, ensuring fast and accurate layouts parsing.",
 },
 },
 {
 "@type": "Question",
 name: "Does OCR PDF support big file sizes?",
 acceptedAnswer: {
 "@type": "Answer",
 text: "Since OCR runs within your browser, processing speed depends on your machine's processor and memory. We recommend splitting large documents into segments for the fastest performance.",
 },
 },
 ],
};


export function generateMetadata() {
 const id = 'ocr-pdf';
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

export default function OcrPdfPage() {
 return (
 <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

 {/* Dynamic SEO Schemas */}
 {(() => {
 const meta = getToolMeta('ocr-pdf');
 return meta ? (
 <>
 <WebAppSchema name={`${meta.title} – Free Online Tool`} description={meta.description} url={getToolUrl('ocr-pdf')} />
 {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
 <BreadcrumbSchema items={[{ label: 'Tools', href: '/#tools' }, { label: meta.title, href: `/tool/ocr-pdf` }]} />
 </>
 ) : null;
 })()}

 {/* Dynamic JSON-LD structured script injections for Google Crawler */}
 
 
 

 <div className="max-w-7xl mx-auto px-4 pt-6 sm:pt-10 pb-16">
 {/* Navigation Breadcrumbs */}
 <nav aria-label="Breadcrumb" className="mb-8">
 <ol className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
 <li>
 <Link
 href="/"
 className="hover:text-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
 >
 Home
 </Link>
 </li>
 <li className="flex items-center gap-1.5" aria-hidden="true">
 <span>/</span>
 <Link
 href="/#tools-grid"
 className="hover:text-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
 >
 Tools
 </Link>
 </li>
 <li
 className="flex items-center gap-1.5 text-slate-600 dark:text-slate-200"
 aria-current="page"
 >
 <span>/</span>
 <span>OCR PDF</span>
 </li>
 </ol>
 </nav>

 {/* Dynamic Client Tool Component with CreditGate wrapper */}
 <div className="mb-16">
 <CreditGate toolName="ocr-pdf" showCounter={false}>
 <OcrPdf id="ocr-pdf" />
 </CreditGate>
 </div>

 {/* Rich SEO Content Section */}
 <article className="space-y-16 max-w-7xl mx-auto mt-20">
 {/* Main heading and description */}
 <section className="text-center max-w-4xl mx-auto space-y-4">
 <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-950 to-blue-600 dark:from-white dark:via-blue-100 dark:to-blue-400 uppercase">
 OCR PDF Online — Convert Scans to Searchable PDF
 </h2>
 <p className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
 Unlock scanned documents by generating an invisible, selectable
 text layer using Tesseract OCR. Select, search, and copy text from
 scanned PDFs without data uploads.
 </p>
 </section>

 {/* How It Works Section */}
 <section className="space-y-10">
 <div className="text-center space-y-2">
 <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
 How to OCR a scanned PDF?
 </h3>
 <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
 Step-by-step character recognition guide
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
 {[
 {
 step: "01",
 title: "Upload Scanned PDF",
 desc: "Select or drag & drop your image-only PDF into the OCR scanner workspace. The document opens instantly.",
 },
 {
 step: "02",
 title: "Run OCR Process",
 desc: "Set document language parameters and click 'Run OCR'. Tesseract extracts text and builds layers locally.",
 },
 {
 step: "03",
 title: "Download PDF",
 desc: "Click 'Download PDF' to save your file. Open the document to search, highlight, and copy text freely.",
 },
 ].map((item, index) => (
 <div
 key={index}
 className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
 >
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-4xl font-bold text-blue-500/20 group-hover:text-blue-500 transition-colors duration-300">
 {item.step}
 </span>
 <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-500 flex items-center justify-center font-bold text-sm">
 {index + 1}
 </div>
 </div>
 <h4 className="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-tight">
 {item.title}
 </h4>
 <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
 {item.desc}
 </p>
 </div>
 {index < 2 && (
 <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 text-slate-300 dark:text-slate-700 animate-pulse">
 <ArrowRight size={24} />
 </div>
 )}
 </div>
 ))}
 </div>
 </section>

 {/* Features and Benefits Grid */}
 <section className="bg-gradient-to-tr from-white to-blue-50/20 dark:from-slate-900 dark:to-slate-950 p-8 sm:p-12 rounded-[2.5rem] border border-blue-100/50 dark:border-slate-800/80 space-y-10">
 <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between border-b border-blue-100/30 dark:border-slate-800/50 pb-8">
 <div className="space-y-3">
 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-100 dark:border-blue-900/30">
 <Star size={12} className="fill-blue-500" /> Premium Benefits
 </span>
 <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
 In-Browser OCR PDF Features
 </h3>
 </div>
 <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-md">
 Fast browser-based operations without queues or subscriptions.
 Tailor files instantly and secure privacy.
 </p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 {[
 {
 title: "No Data Uploads",
 desc: "Scan and build layers inside your browser sandbox. 100% confidential, secure, and private.",
 },
 {
 title: "Searchable Layer Injected",
 desc: "Injects an invisible text overlay exactly matching original scans, enabling search.",
 },
 {
 title: "Preserves Scans Layout",
 desc: "Text is positioned dynamically at original coordinate positions, matching images.",
 },
 {
 title: "Extract Text Sister",
 desc: "Need raw text blocks only? Use our Extract Text tool to parse characters instantly.",
 },
 ].map((feat, i) => (
 <div key={i} className="space-y-3 p-2">
 <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
 <Check size={16} className="stroke-[3]" />
 </div>
 <h4 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">
 {feat.title}
 </h4>
 <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
 {feat.desc}
 </p>
 </div>
 ))}
 </div>
 </section>

 {/* FAQs Accordion */}
 <section className="space-y-8 max-w-4xl mx-auto">
 <div className="text-center space-y-2">
 <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
 Frequently Asked Questions
 </h3>
 <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
 OCR PDF FAQs
 </p>
 </div>

 <div className="space-y-4">
 {[
 {
 q: "How can I convert a scanned PDF to a searchable PDF?",
 a: "Upload your scanned PDF to our OCR PDF tool. Select your document's language and click 'Run OCR'. Our in-browser Tesseract engine scans the document, injects a selectable text layer, and downloads the searchable PDF.",
 },
 {
 q: "Is my scanned document uploaded to a server?",
 a: "No! Tesseract OCR operates completely inside your web browser sandbox using WebAssembly. No text elements or document pages are ever transmitted to external servers.",
 },
 {
 q: "What languages does the OCR tool support?",
 a: "The OCR engine is configured with English text datasets by default to recognize alphanumeric characters, ensuring fast and accurate layouts parsing.",
 },
 {
 q: "Does OCR PDF support big file sizes?",
 a: "Since OCR runs within your browser, processing speed depends on your machine's processor and memory. We recommend splitting large documents into segments for the fastest performance.",
 },
 ].map((faq, idx) => (
 <details
 key={idx}
 className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
 >
 <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
 <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
 <HelpCircle size={22} className="text-blue-500 shrink-0" />
 {faq.q}
 </span>
 <ChevronDown
 size={18}
 className="text-slate-400 transition-transform duration-300 group-open:rotate-180 shrink-0 ml-4"
 />
 </summary>
 <div className="mx-6 pb-6 border-t border-slate-200 dark:border-slate-800 pt-4">
 <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
 {faq.a}
 </p>
 </div>
 </details>
 ))}
 </div>
 </section>

 {/* Internal Links/Related tools */}
 <section className="pt-10 border-t border-slate-100 dark:border-slate-800/80">
 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">
 Related Document Tools
 </h3>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 {[
 {
 name: "Extract Text",
 path: "/tool/extract-text",
 desc: "Copy raw text blocks",
 },
 {
 name: "PDF to XML",
 path: "/tool/pdf-to-xml",
 desc: "Format structured XML tags",
 },
 {
 name: "Split PDF",
 path: "/tool/split",
 desc: "Separate documents",
 },
 {
 name: "Merge PDF",
 path: "/tool/merge",
 desc: "Combine files in order",
 },
 ].map((tool, idx) => (
 <Link
 key={idx}
 href={tool.path}
 className="group p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col justify-center"
 >
 <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-blue-500 transition-colors">
 {tool.name}
 </span>
 <span className="text-[10px] text-slate-400 mt-1 font-medium leading-none">
 {tool.desc}
 </span>
 </Link>
 ))}
 </div>
 </section>
 </article>
 </div>
 </div>
 );
}
