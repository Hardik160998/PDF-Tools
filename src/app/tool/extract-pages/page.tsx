import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from '@/components/seo/WebAppSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import ExtractPages from "@/components/tools/ExtractPages";
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
 name: "Extract PDF Pages Online Free",
 url: `${siteUrl}/tool/extract-pages`,
 image: `${siteUrl}/img/extract-pages-og.png`,
 description:
 "Extract pages from PDF online for free. Select individual pages or page ranges visually and save them as a new PDF. 100% local, secure, and private.",
 applicationCategory: "UtilityApplication",
 operatingSystem: "All",
 browserRequirements: "Requires HTML5 support",
 featureList: [
 "100% Local processing in your browser",
 "No file uploads to servers",
 "Select page ranges or individual pages visually",
 "Fast PDF extraction with no watermarks",
 "Maintains original document styling and resolution",
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
 name: "Extract Pages",
 item: `${siteUrl}/tool/extract-pages`,
 },
 ],
};

const faqJsonLd = {
 "@context": "https://schema.org",
 "@type": "FAQPage",
 mainEntity: [
 {
 "@type": "Question",
 name: "How can I extract specific pages from a PDF?",
 acceptedAnswer: {
 "@type": "Answer",
 text: "Simply upload your PDF file to our tool. You can visually select the pages you want to keep by clicking on their thumbnails, or type in a page range (e.g., 1-3, 5). Click 'Extract Pages' to instantly download the new PDF containing only your selected pages.",
 },
 },
 {
 "@type": "Question",
 name: "Is my uploaded document secure?",
 acceptedAnswer: {
 "@type": "Answer",
 text: "Yes! Our extractor tool processes your files 100% locally in your web browser. No files are uploaded to any external servers, ensuring complete security and privacy for your documents.",
 },
 },
 {
 "@type": "Question",
 name: "Can I extract pages from password-protected PDFs?",
 acceptedAnswer: {
 "@type": "Answer",
 text: "You will need to unlock the PDF first using our Unlock PDF tool before uploading it to the page extractor tool, as secured PDFs cannot be parsed without password authorization.",
 },
 },
 {
 "@type": "Question",
 name: "Is there a page limit for extracting pages?",
 acceptedAnswer: {
 "@type": "Answer",
 text: "There are no hard page limits. Since the tool executes within your browser tab, it is only limited by your device's memory, allowing you to process large PDFs smoothly.",
 },
 },
 ],
};


export function generateMetadata() {
 const id = 'extract-pages';
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

export default function ExtractPagesPage() {
 return (
 <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

 {/* Dynamic SEO Schemas */}
 {(() => {
 const meta = getToolMeta('extract-pages');
 return meta ? (
 <>
 <WebAppSchema name={`${meta.title} – Free Online Tool`} description={meta.description} url={getToolUrl('extract-pages')} />
 {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
 <BreadcrumbSchema items={[{ label: 'Tools', href: '/#tools' }, { label: meta.title, href: `/tool/extract-pages` }]} />
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
 className="hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1"
 >
 Home
 </Link>
 </li>
 <li className="flex items-center gap-1.5" aria-hidden="true">
 <span>/</span>
 <Link
 href="/#tools-grid"
 className="hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1"
 >
 Tools
 </Link>
 </li>
 <li
 className="flex items-center gap-1.5 text-slate-600 dark:text-slate-200"
 aria-current="page"
 >
 <span>/</span>
 <span>Extract Pages</span>
 </li>
 </ol>
 </nav>

 {/* Dynamic Client Tool Component */}
 <div className="mb-16">
 <ExtractPages id="extract-pages" />
 </div>

 {/* Rich SEO Content Section */}
 <article className="space-y-16 max-w-7xl mx-auto mt-20">
 {/* Main heading and description */}
 <section className="text-center max-w-4xl mx-auto space-y-4">
 <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-orange-950 to-orange-600 dark:from-white dark:via-orange-100 dark:to-orange-400 uppercase">
 Extract PDF Pages Online — Free &amp; Secure
 </h2>
 <p className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
 Isolate specific sections of your documents by extracting pages.
 Save selected pages as a new, independent PDF file instantly. No
 email registration, no queues, and 100% private.
 </p>
 </section>

 {/* How It Works Section */}
 <section className="space-y-10">
 <div className="text-center space-y-2">
 <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
 How to Extract Pages from a PDF?
 </h3>
 <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
 Visual step-by-step guide
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
 {[
 {
 step: "01",
 title: "Upload Document",
 desc: "Select or drag & drop your PDF file into the extractor workspace. Every page is rendered visually in seconds.",
 },
 {
 step: "02",
 title: "Select Pages",
 desc: "Click on page thumbnails to select them, or type specific page numbers/ranges into the sidebar panel.",
 },
 {
 step: "03",
 title: "Save & Download",
 desc: "Click 'Extract Pages' to compile your chosen pages. Download the newly created, separate PDF instantly.",
 },
 ].map((item, index) => (
 <div
 key={index}
 className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
 >
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-4xl font-bold text-orange-500/20 group-hover:text-orange-500 transition-colors duration-300">
 {item.step}
 </span>
 <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-500 flex items-center justify-center font-bold text-sm">
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
 <section className="bg-gradient-to-tr from-white to-orange-50/20 dark:from-slate-900 dark:to-slate-950 p-8 sm:p-12 rounded-[2.5rem] border border-orange-100/50 dark:border-slate-800/80 space-y-10">
 <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between border-b border-orange-100/30 dark:border-slate-800/50 pb-8">
 <div className="space-y-3">
 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-widest border border-orange-100 dark:border-orange-900/30">
 <Star size={12} className="fill-orange-500" /> Premium
 Benefits
 </span>
 <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
 Visual PDF Extraction Features
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
 title: "No Server Access",
 desc: "Your PDF is processed inside your browser tab. Zero data uploads, zero security concerns.",
 },
 {
 title: "Range Selection",
 desc: "Specify custom ranges like '1-5, 8' to extract non-adjacent blocks of pages at once.",
 },
 {
 title: "High-Quality Preserved",
 desc: "Maintains all fonts, forms, vector graphics, and images from original files.",
 },
 {
 title: "Split PDF Functionality",
 desc: "Easily extract page ranges to divide comprehensive reports into clean segments.",
 },
 ].map((feat, i) => (
 <div key={i} className="space-y-3 p-2">
 <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25">
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
 Extract Pages FAQs
 </p>
 </div>

 <div className="space-y-4">
 {[
 {
 q: "How can I extract specific pages from a PDF?",
 a: "Simply upload your PDF file to our tool. You can visually select the pages you want to keep by clicking on their thumbnails, or type in a page range (e.g., 1-3, 5). Click 'Extract Pages' to instantly download the new PDF containing only your selected pages.",
 },
 {
 q: "Is my uploaded document secure?",
 a: "Yes! Our extractor tool processes your files 100% locally in your web browser. No files are uploaded to any external servers, ensuring complete security and privacy for your documents.",
 },
 {
 q: "Can I extract pages from password-protected PDFs?",
 a: "You will need to unlock the PDF first using our Unlock PDF tool before uploading it to the page extractor tool, as secured PDFs cannot be parsed without password authorization.",
 },
 {
 q: "Is there a page limit for extracting pages?",
 a: "There are no hard page limits. Since the tool executes within your browser tab, it is only limited by your device's memory, allowing you to process large PDFs smoothly.",
 },
 ].map((faq, idx) => (
 <details
 key={idx}
 className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
 >
 <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
 <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
 <HelpCircle size={22} className="text-orange-500 shrink-0" />
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
 name: "Delete Pages",
 path: "/tool/delete-pages",
 desc: "Visual page removal",
 },
 {
 name: "Organize PDF",
 path: "/tool/organize",
 desc: "Reorder & rotate pages",
 },
 {
 name: "Split PDF",
 path: "/tool/split",
 desc: "Extract files pages",
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
 <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-orange-500 transition-colors">
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
