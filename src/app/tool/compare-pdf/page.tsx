import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from '@/components/seo/WebAppSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import ComparePdf from "@/components/tools/ComparePdf";
import Link from "next/link";
import type { Metadata } from "next";
import {
 GitCompare,
 FileText,
 Upload,
 Search,
 Lock,
 RefreshCw,
 Zap,
 Shield,
 ArrowRight,
 HelpCircle,
 Info,
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
 name: "Compare PDF Files Online Free",
 url: `${siteUrl}/tool/compare-pdf`,
 image: `${siteUrl}/img/compare-pdf-og.png`,
 description:
 "Compare two PDF documents side-by-side to highlight text differences and visual page edits. Pixel-by-pixel accuracy, 100% private in-browser analysis.",
 applicationCategory: "UtilityApplication",
 operatingSystem: "All",
 browserRequirements: "Requires HTML5 support",
 featureList: [
 "100% Local processing in your browser",
 "No file uploads to servers",
 "Side-by-side visual and text comparisons",
 "Highlight additions and removals",
 "Shows percentage differences",
 "Instant comparison with no delays",
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
 name: "Compare PDF",
 item: `${siteUrl}/tool/compare-pdf`,
 },
 ],
};

const faqJsonLd = {
 "@context": "https://schema.org",
 "@type": "FAQPage",
 mainEntity: [
 {
 "@type": "Question",
 name: "How can I compare two PDF files online?",
 acceptedAnswer: {
 "@type": "Answer",
 text: "Upload the two PDF documents you want to compare into the 'PDF A' and 'PDF B' zones. Click 'Compare PDFs'. The tool renders each page side-by-side, displaying visual similarities and highlighting added or removed text lines.",
 },
 },
 {
 "@type": "Question",
 name: "Does this tool upload my documents to a server?",
 acceptedAnswer: {
 "@type": "Answer",
 text: "No! All text extraction and page comparisons are performed 100% locally in your web browser. No files are uploaded to remote servers, giving you complete privacy and confidence for sensitive data.",
 },
 },
 {
 "@type": "Question",
 name: "Can I compare scanned PDFs?",
 acceptedAnswer: {
 "@type": "Answer",
 text: "The tool uses pixel-by-pixel comparisons, so it will highlight visual differences on scanned pages. However, text line differences are generated from embedded document text, which requires selectable text elements (non-scanned or OCR-processed files).",
 },
 },
 {
 "@type": "Question",
 name: "Is there a limit on file size for PDF comparisons?",
 acceptedAnswer: {
 "@type": "Answer",
 text: "Since files are analyzed entirely within your web browser, size limits depend mostly on your computer's memory. We optimize memory usage so you can compare large documents smoothly.",
 },
 },
 ],
};


export function generateMetadata() {
 const id = 'compare-pdf';
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

export default function ComparePdfPage() {
 return (
 <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

 {/* Dynamic SEO Schemas */}
 {(() => {
 const meta = getToolMeta('compare-pdf');
 return meta ? (
 <>
 <WebAppSchema name={`${meta.title} – Free Online Tool`} description={meta.description} url={getToolUrl('compare-pdf')} />
 {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
 <BreadcrumbSchema items={[{ label: 'Tools', href: '/#tools' }, { label: meta.title, href: `/tool/compare-pdf` }]} />
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
 className="hover:text-indigo-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
 >
 Home
 </Link>
 </li>
 <li className="flex items-center gap-1.5" aria-hidden="true">
 <span>/</span>
 <Link
 href="/#tools-grid"
 className="hover:text-indigo-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
 >
 Tools
 </Link>
 </li>
 <li
 className="flex items-center gap-1.5 text-slate-600 dark:text-slate-200"
 aria-current="page"
 >
 <span>/</span>
 <span>Compare PDF</span>
 </li>
 </ol>
 </nav>

 {/* Dynamic Client Tool Component */}
 <div className="mb-16">
 <ComparePdf id="compare-pdf" />
 </div>

 {/* Rich SEO Content Section */}
 <article className="space-y-16 max-w-7xl mx-auto mt-20">
 {/* Main heading and description */}
 <section className="text-center max-w-4xl mx-auto space-y-4">
 <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-600 dark:from-white dark:via-indigo-100 dark:to-indigo-400 uppercase">
 Compare PDF Files Online — Free &amp; Secure
 </h2>
 <p className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
 Compare two PDF documents side-by-side to highlight text
 differences and visual page edits. Spot modifications, additions,
 and removals with pixel-level precision, processed completely
 locally in your browser.
 </p>
 </section>

 {/* How It Works Section */}
 <section className="space-y-10">
 <div className="text-center space-y-2">
 <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
 How to Compare PDF Documents?
 </h3>
 <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
 Step-by-step diff guide
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
 {[
 {
 step: "01",
 title: "Upload Documents",
 desc: "Select or drag & drop two files into the PDF A and PDF B zones. Both files load instantly in your browser.",
 },
 {
 step: "02",
 title: "Click Compare",
 desc: "Click 'Compare PDFs'. The tool reads both files and matches pages pixel-by-pixel and line-by-line.",
 },
 {
 step: "03",
 title: "Review Differences",
 desc: "Examine diff lines. Added lines are highlighted in green, deleted in red, and identical pages in green outline.",
 },
 ].map((item, index) => (
 <div
 key={index}
 className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
 >
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-4xl font-bold text-indigo-500/20 group-hover:text-indigo-500 transition-colors duration-300">
 {item.step}
 </span>
 <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center font-bold text-sm">
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
 <section className="bg-gradient-to-tr from-white to-indigo-50/20 dark:from-slate-900 dark:to-slate-950 p-8 sm:p-12 rounded-[2.5rem] border border-indigo-100/50 dark:border-slate-800/80 space-y-10">
 <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between border-b border-indigo-100/30 dark:border-slate-800/50 pb-8">
 <div className="space-y-3">
 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/30">
 <Star size={12} className="fill-indigo-500" /> Premium
 Benefits
 </span>
 <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
 Why Compare PDFs Locally?
 </h3>
 </div>
 <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-md">
 Fast browser-based operations without queues or subscriptions.
 Spot contract differences and revisions instantly.
 </p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 {[
 {
 title: "Privacy Guaranteed",
 desc: "No remote file servers. All processing operates in the browser sandbox. 100% confidential.",
 },
 {
 title: "Double Viewmodes",
 desc: "Toggle between visual page differences (image rendering) or inline text diff lines.",
 },
 {
 title: "Line-Level LCS Diff",
 desc: "Accurate text analysis lists exact characters added or deleted between versions.",
 },
 {
 title: "Summary Reports",
 desc: "Instantly see the number of changed pages, lines added, and lines removed.",
 },
 ].map((feat, i) => (
 <div key={i} className="space-y-3 p-2">
 <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
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
 Compare PDF FAQs
 </p>
 </div>

 <div className="space-y-4">
 {[
 {
 q: "How can I compare two PDF files online?",
 a: "Upload the two PDF documents you want to compare into the 'PDF A' and 'PDF B' zones. Click 'Compare PDFs'. The tool renders each page side-by-side, displaying visual similarities and highlighting added or removed text lines.",
 },
 {
 q: "Does this tool upload my documents to a server?",
 a: "No! All text extraction and page comparisons are performed 100% locally in your web browser. No files are uploaded to remote servers, giving you complete privacy and confidence for sensitive data.",
 },
 {
 q: "Can I compare scanned PDFs?",
 a: "The tool uses pixel-by-pixel comparisons, so it will highlight visual differences on scanned pages. However, text line differences are generated from embedded document text, which requires selectable text elements (non-scanned or OCR-processed files).",
 },
 {
 q: "Is there a limit on file size for PDF comparisons?",
 a: "Since files are analyzed entirely within your web browser, size limits depend mostly on your computer's memory. We optimize memory usage so you can compare large documents smoothly.",
 },
 ].map((faq, idx) => (
 <details
 key={idx}
 className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
 >
 <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
 <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
 <HelpCircle
 size={18}
 className="text-indigo-500 shrink-0"
 />
 {faq.q}
 </span>
 <ChevronDown
 size={18}
 className="text-slate-400 transition-transform duration-300 group-open:rotate-180 shrink-0 ml-4"
 />
 </summary>
 <div className="px-6 pb-6 border-t border-slate-200 dark:border-slate-800 pt-4">
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
 name: "Organize PDF",
 path: "/tool/organize",
 desc: "Reorder & rotate pages",
 },
 {
 name: "Merge PDF",
 path: "/tool/merge",
 desc: "Combine files in order",
 },
 {
 name: "Split PDF",
 path: "/tool/split",
 desc: "Extract files pages",
 },
 {
 name: "Compress PDF",
 path: "/tool/compress",
 desc: "Shrink file size locally",
 },
 ].map((tool, idx) => (
 <Link
 key={idx}
 href={tool.path}
 className="group p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col justify-center"
 >
 <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-indigo-500 transition-colors">
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
