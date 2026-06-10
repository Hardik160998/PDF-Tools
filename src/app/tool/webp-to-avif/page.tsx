import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from '@/components/seo/WebAppSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import Link from "next/link";
import type { Metadata } from "next";
import ImageConverter from "@/components/tools/ImageConverter";
import {
    ImageIcon,
    Upload,
    SlidersHorizontal,
    Download,
    Zap,
    Lock,
    FileText,
    Shield,
    Check,
    HelpCircle,
    ChevronDown,
    ArrowRight,
    Info,
    Star,
} from "lucide-react";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

// 1. Dynamic Metadata Export for Next.js App Router (SEO & Indexing Fix)


// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "WebP to AVIF Converter",
    url: `${siteUrl}/tool/webp-to-avif`,
    image: `${siteUrl}/img/webp-to-avif-og.png`,
    description:
        "Convert WebP images to AVIF format online for free. AVIF provides next-generation compression that compresses files up to 35% smaller than WebP.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires HTML5 support",
    featureList: [
        "100% Local processing in your browser sandbox",
        "No file uploads to servers",
        "Preserves image alpha transparency layers",
        "Batch processing for multiple images",
        "Free with no registrations or watermarks",
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
            name: "WebP to AVIF",
            item: `${siteUrl}/tool/webp-to-avif`,
        },
    ],
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "Will converting my WebP to AVIF support transparency?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, AVIF supports full alpha channel transparency. Converting your WebP to AVIF will retain transparent background structures perfectly.",
            },
        },
        {
            "@type": "Question",
            name: "How much smaller will my AVIF file be compared to WebP?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "On average, AVIF files can compress up to 30-35% smaller than standard WebP files at equivalent visual details, helping websites load much faster.",
            },
        },
        {
            "@type": "Question",
            name: "Is this tool secure to use with company assets?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Absolutely. The converter processes assets entirely local inside your browser memory using WebAssembly/JavaScript. Your files never touch external servers.",
            },
        },
        {
            "@type": "Question",
            name: "Can I convert multiple WebPs to AVIFs in one go?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Upload all target WebPs in batch. The system converts them in parallel and packages the outputs inside a single ZIP file for downloading.",
            },
        },
    ],
};

const STEPS = [
    {
        icon: Upload,
        title: "Upload WebP",
        desc: "Select any WebP image from your device.",
    },
    {
        icon: SlidersHorizontal,
        title: "Auto Convert",
        desc: "Your WebP is converted to AVIF format instantly in your browser.",
    },
    {
        icon: Download,
        title: "Download AVIF",
        desc: "Download the converted AVIF file — smaller and web-optimized.",
    },
];

const RELATED = [
    {
        id: "avif-to-webp",
        title: "AVIF to WebP",
        description: "Convert AVIF images back to WebP format.",
        icon: ImageIcon,
        gradient: "linear-gradient(135deg, #14b8a6, #0f766e)",
        shadow: "rgba(20,184,166,0.3)",
        tag: "Image Convert",
    },
    {
        id: "jpg-to-avif",
        title: "JPG to AVIF",
        description: "Convert JPG images to modern AVIF for smaller file sizes.",
        icon: ImageIcon,
        gradient: "linear-gradient(135deg, #7c3aed, #4c1d95)",
        shadow: "rgba(124,58,237,0.3)",
        tag: "Image Convert",
    },
    {
        id: "avif-to-jpg",
        title: "AVIF to JPG",
        description:
            "Convert AVIF images back to universally compatible JPG format.",
        icon: ImageIcon,
        gradient: "linear-gradient(135deg, #ec4899, #be185d)",
        shadow: "rgba(236,72,153,0.3)",
        tag: "Image Convert",
    },
    {
        id: "png-to-avif",
        title: "PNG to AVIF",
        description:
            "Convert PNG images to AVIF for smaller sizes with transparency support.",
        icon: ImageIcon,
        gradient: "linear-gradient(135deg, #06b6d4, #0e7490)",
        shadow: "rgba(6,182,212,0.3)",
        tag: "Image Convert",
    },
    {
        id: "webp-to-png",
        title: "WebP to PNG",
        description: "Convert WebP images to lossless PNG format instantly.",
        icon: ImageIcon,
        gradient: "linear-gradient(135deg, #22c55e, #15803d)",
        shadow: "rgba(34,197,94,0.3)",
        tag: "Image Convert",
    },
    {
        id: "compress",
        title: "Compress PDF",
        description:
            "Reduce PDF file size while keeping quality sharp and text crisp.",
        icon: Zap,
        gradient: "linear-gradient(135deg, #22c55e, #15803d)",
        shadow: "rgba(34,197,94,0.3)",
        tag: "Optimize",
    },
];


export function generateMetadata() {
    const id = 'webp-to-avif';
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

export default function WebpToAvifPage() {
    return (
        <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

            {/* Dynamic SEO Schemas */}
            {(() => {
                const meta = getToolMeta('webp-to-avif');
                return meta ? (
                    <>
                        <WebAppSchema name={`${meta.title} – Free Online Tool`} description={meta.description} url={getToolUrl('webp-to-avif')} />
                        {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
                        <BreadcrumbSchema items={[{ label: 'Tools', href: '/#tools' }, { label: meta.title, href: `/tool/webp-to-avif` }]} />
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
                        WebP to AVIF
                    </span>
                </nav>

                {/* Dynamic Client Tool Component */}
                <section
                    aria-label="WebP to AVIF Image Converter Application"
                    className="mb-16"
                >
                    <ImageConverter id="webp-to-avif" />
                </section>

                {/* Dynamic visual statistics element */}
                <section className="py-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-r from-cyan-50 to-sky-50 dark:from-cyan-900/10 dark:to-sky-900/10 border border-cyan-100 dark:border-cyan-800 rounded-3xl p-8">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4 text-center uppercase tracking-tight">
                                WebP vs AVIF
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                                {[
                                    {
                                        stat: "~35%",
                                        label: "Smaller file size",
                                        sub: "vs standard WebP",
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

                {/* 4. Complete SEO Optimized Content Section */}
                <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">
                    <div className="mb-16 text-center relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-cyan-500/10 dark:bg-cyan-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
                        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-cyan-600 dark:from-white dark:via-slate-200 dark:to-cyan-500 bg-clip-text text-transparent">
                            Convert WebP to AVIF Online <br />
                            <span className="text-cyan-500 dark:text-cyan-400">
                                100% Free & Secure
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                            Convert standard WebP graphics into lightweight next-generation
                            AVIF formats. Optimize page loading benchmarks and enhance website
                            SEO indexing with zero server uploads.
                        </p>
                    </div>

                    <article className="space-y-16">
                        {/* What is WebP to AVIF */}
                        <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
                            <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 shrink-0">
                                <Info size={32} />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    What is WebP to AVIF conversion?
                                </h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                                    WebP offers extreme compression for web loading, but AVIF
                                    represents the next generational leap in compression
                                    technology. AVIF achieves lossless and lossy structures that
                                    are up to 35% smaller than standard WebP, leading to further
                                    improved page load speeds.
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                                    Converting WebP structures to AVIF is a critical SEO
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
                                How to convert WebP to AVIF in 3 Steps
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                                {[
                                    {
                                        step: "01",
                                        title: "Select WebPs",
                                        desc: "Drag and drop WebP images directly into the converter box above.",
                                    },
                                    {
                                        step: "02",
                                        title: "Compress Automatically",
                                        desc: "The browser script converts the layout structures and processes WebP transparency to AVIF instantly.",
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
                                        "Batch processing lets you optimize multiple WebPs at once.",
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

                        {/* FAQs */}
                        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-850 shadow-sm">
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                                <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
                                    <HelpCircle size={24} />
                                </span>
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-4">
                                {[
                                    {
                                        q: "Will converting my WebP to AVIF support transparency?",
                                        a: "Yes, AVIF supports full alpha channel transparency. Converting your WebP to AVIF will retain transparent background structures perfectly.",
                                    },
                                    {
                                        q: "How much smaller will my AVIF file be compared to WebP?",
                                        a: "On average, AVIF files can compress up to 30-35% smaller than standard WebP files at equivalent visual details, helping websites load much faster.",
                                    },
                                    {
                                        q: "Is this tool secure to use with company assets?",
                                        a: "Absolutely. The converter processes assets entirely local inside your browser memory using WebAssembly/JavaScript. Your files never touch external servers.",
                                    },
                                    {
                                        q: "Can I convert multiple WebPs to AVIFs in one go?",
                                        a: "Yes. Upload all target WebPs in batch. The system converts them in parallel and packages the outputs inside a single ZIP file for downloading.",
                                    },
                                ].map((item, idx) => (
                                    <details
                                        key={idx}
                                        className="group border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 bg-slate-50/20 dark:bg-slate-900/20 open:bg-slate-50/50 dark:open:bg-slate-800/30 transition-all duration-300 text-left"
                                    >
                                        <summary className="flex items-center justify-between cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg">
                                            <h3 className="text-base sm:text-base font-bold text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-cyan-500 transition-colors pr-4">
                                                {item.q}
                                            </h3>
                                            <span className="shrink-0 transition-transform duration-300 group-open:rotate-180 text-slate-400 group-hover:text-cyan-500">
                                                <ChevronDown size={18} />
                                            </span>
                                        </summary>
                                        <div className="mt-3 text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium border-t border-slate-105 dark:border-slate-800 pt-3">
                                            {item.a}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </article>
                </section>

                {/* Related Document & Image Tools (Internal Links) */}
                <section
                    aria-label="Related tools"
                    className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 text-left"
                >
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 text-center">
                        Explore More Image & PDF Tools
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {RELATED.map((t) => (
                            <Link
                                key={t.id}
                                href={`/tool/${t.id}`}
                                title={`Use the ${t.title} tool`}
                                aria-label={`Open the ${t.title} tool to ${t.description.toLowerCase()}`}
                                className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 text-left focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none"
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
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-cyan-500 transition-colors">
                                        {t.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                        {t.description}
                                    </p>
                                </div>
                                <div className="mt-auto pt-2 text-xs font-bold text-cyan-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
