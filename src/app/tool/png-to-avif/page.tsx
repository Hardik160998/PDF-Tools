import RelatedTools from "@/components/tools/RelatedTools";
import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from '@/components/seo/WebAppSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import Link from "next/link";
import ImageConverter from "@/components/tools/ImageConverter";
import {
    Upload,
    SlidersHorizontal,
    Download,
    Zap,
    Shield,
    Check,
    HelpCircle,
    ChevronDown,
    ArrowRight,
    Info,
    Star,
} from "lucide-react";

const STEPS = [
    {
        icon: Upload,
        title: "Upload PNG",
        desc: "Select any PNG image from your device.",
    },
    {
        icon: SlidersHorizontal,
        title: "Auto Convert",
        desc: "Your PNG is converted to AVIF format instantly in your browser.",
    },
    {
        icon: Download,
        title: "Download AVIF",
        desc: "Download the converted AVIF file — smaller and web-optimized.",
    },
];




export function generateMetadata() {
    const id = 'png-to-avif';
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

export default function PngToAvifPage() {
    return (
        <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

            {/* Dynamic SEO Schemas */}
            {(() => {
                const meta = getToolMeta('png-to-avif');
                return meta ? (
                    <>
                        <WebAppSchema name={`${meta.title} – Free Online Tool`} description={meta.description} url={getToolUrl('png-to-avif')} />
                        {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
                        <BreadcrumbSchema items={[{ label: 'Tools', href: '/#tools' }, { label: meta.title, href: `/tool/png-to-avif` }]} />
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
                        className="hover:text-cyan-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded px-1"
                    >
                        Home
                    </Link>
                    <span aria-hidden="true">/</span>
                    <Link
                        href="/tool"
                        className="hover:text-cyan-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded px-1"
                    >
                        Tools
                    </Link>
                    <span aria-hidden="true">/</span>
                    <span
                        className="text-slate-600 dark:text-slate-300"
                        aria-current="page"
                    >
                        PNG to AVIF
                    </span>
                </nav>

                {/* Dynamic Client Tool Component */}
                <section
                    aria-label="PNG to AVIF Image Converter Application"
                    className="mb-16"
                >
                    <ImageConverter id="png-to-avif" />
                </section>

                {/* Dynamic visual statistics element */}
                <section className="py-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-r from-cyan-50 to-sky-50 dark:from-cyan-900/10 dark:to-sky-900/10 border border-cyan-100 dark:border-cyan-800 rounded-3xl p-8">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4 text-center uppercase tracking-tight">
                                PNG vs AVIF
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                                {[
                                    {
                                        stat: "~35%",
                                        label: "Smaller file size",
                                        sub: "vs lossless PNG",
                                    },
                                    {
                                        stat: "✓",
                                        label: "Transparency kept",
                                        sub: "Alpha channel preserved",
                                    },
                                    {
                                        stat: "⚡",
                                        label: "Faster loading",
                                        sub: "Better web performance",
                                    },
                                ].map(({ stat, label, sub }) => (
                                    <div key={label} className="space-y-1">
                                        <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                                            {stat}
                                        </div>
                                        <div className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tighter">
                                            {label}
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                            {sub}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Quick View */}
                <section
                    aria-label="Tool Steps Overview"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
                >
                    {STEPS.map((s, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group text-left"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <s.icon className="text-cyan-500" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                                {s.title}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                {s.desc}
                            </p>
                        </div>
                    ))}
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
            {/* Blog Post 1: Image Conversion Guide */}
            <a href="/blog/ultimate-image-conversion-guide" className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
                <div className="p-6 flex flex-col flex-1 gap-3">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#8b5cf6] rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                        </div>
                        <h3 className="font-bold text-slate-800 text-[17px] leading-snug group-hover:text-red-600 transition-colors">
                            The Ultimate Image Conversion Guide (Format Best Practices)
                        </h3>
                    </div>
                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            5 min read &nbsp; Jun 01, 2026
                        </div>
                        <span className="text-sm font-bold text-red-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read <ArrowRight size={14} />
                        </span>
                    </div>
                </div>
            </a>
          </div>
        </section>

        {/* 4. Complete SEO Optimized Content Section */}
                <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">
                    <div className="mb-16 text-center relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-cyan-500/10 dark:bg-cyan-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
                        <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-cyan-600 dark:from-white dark:via-slate-200 dark:to-cyan-500 bg-clip-text text-transparent">
                            Convert PNG to AVIF Online <br />
                            <span className="text-cyan-500 dark:text-cyan-400">
                                100% Free & Secure
                            </span>
                        </h2>
                        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                            Convert transparent or solid PNG graphics into lightweight
                            next-generation AVIF formats. Optimize page loading benchmarks and
                            enhance website SEO indexing with zero server uploads.
                        </p>
                    </div>

                    <article className="space-y-16">
                        {/* What is PNG to AVIF */}
                        <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
                            <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 shrink-0">
                                <Info size={32} />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    What is PNG to AVIF conversion?
                                </h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                                    PNG is the web standard for transparency, but files are often
                                    unnecessarily large. AVIF achieves lossless and lossy
                                    structures that are much smaller while maintaining identical
                                    alpha transparencies and vector definitions, leading to
                                    improved page load speeds.
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                                    Converting PNG structures to AVIF is a critical SEO
                                    performance optimization. Our tool runs{" "}
                                    <strong className="text-cyan-500 font-bold">
                                        entirely client-side inside your browser sandbox
                                    </strong>
                                    , meaning your files are never uploaded, stored, or processed
                                    on external servers.
                                </p>
                            </div>
                        </div>

                        {/* How to use */}
                        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                                <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
                                    <ArrowRight size={24} />
                                </span>
                                How to convert PNG to AVIF in 3 Steps
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                                {[
                                    {
                                        step: "01",
                                        title: "Select PNGs",
                                        desc: "Drag and drop PNG images directly into the converter box above.",
                                    },
                                    {
                                        step: "02",
                                        title: "Compress Automatically",
                                        desc: "The browser script converts the layout structures and processes PNG transparency to AVIF instantly.",
                                    },
                                    {
                                        step: "03",
                                        title: "Download AVIF",
                                        desc: "Export the lightweight AVIF files individually or as a single batch ZIP file.",
                                    },
                                ].map((s, idx) => (
                                    <div
                                        key={idx}
                                        className="relative z-10 flex flex-col gap-4 group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-cyan-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-cyan-500/40 transition-all duration-300">
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

                        {/* Benefits & Features */}
                        <div className="space-y-8">
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                                <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
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
                                        Complete Device Security
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                                        Because we value privacy, our client-side JavaScript
                                        processes everything within your local browser runtime
                                        sandbox. We never send your graphics to external cloud
                                        databases.
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                                        <Zap size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-cyan-500 transition-colors">
                                        Fast and Watermark-Free
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                                        Convert assets instantly with zero wait times. We do not
                                        insert watermarks, limit files, or charge for usage. It's
                                        built for rapid production environments.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        "Supports full alpha transparency options.",
                                        "Batch processing lets you optimize multiple PNGs at once.",
                                        "Clean layout matches responsive sizing for mobile devices.",
                                        "No signup or user configurations required.",
                                    ].map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium"
                                        >
                                            <span className="p-0.5 rounded-full bg-cyan-500/10 text-cyan-600 mt-0.5 shrink-0">
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
                <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                                    {
                                        q: "Will converting my PNG to AVIF support transparency?",
                                        a: "Yes, AVIF supports full alpha channel transparency. Converting your PNG to AVIF will retain transparent background structures perfectly.",
                                    },
                                    {
                                        q: "How much smaller will my AVIF file be compared to PNG?",
                                        a: "On average, AVIF files are up to 35-40% smaller than lossless PNG files at equivalent visual details, helping websites load much faster.",
                                    },
                                    {
                                        q: "Is this tool secure to use with company assets?",
                                        a: "Absolutely. The converter processes assets entirely local inside your browser memory using WebAssembly/JavaScript. Your files never touch external servers.",
                                    },
                                    {
                                        q: "Can I convert multiple PNGs to AVIFs in one go?",
                                        a: "Yes. Upload all target PNGs in batch. The system converts them in parallel and packages the outputs inside a single ZIP file for downloading.",
                                    },
                                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">
                      <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <HelpCircle size={22} className="text-cyan-500 shrink-0" />
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
