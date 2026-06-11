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
    name: "JPG to AVIF Converter",
    url: `${siteUrl}/tool/jpg-to-avif`,
    image: `${siteUrl}/img/jpg-to-avif-og.png`,
    description:
        "Convert JPG and JPEG images to AVIF format online for free. AVIF offers next-generation compression for lightweight web graphics.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires HTML5 support",
    featureList: [
        "100% Local processing in your browser sandbox",
        "No file uploads to servers",
        "Reduces file sizes by up to 50% relative to JPG",
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
            name: "JPG to AVIF",
            item: `${siteUrl}/tool/jpg-to-avif`,
        },
    ],
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "Why should I convert my JPG images to AVIF?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "AVIF is a next-generation image format that features superior compression algorithms compared to JPG and WebP. Converting JPG to AVIF can compress file sizes up to 50% smaller while keeping crisp visual quality, significantly boosting page speed scores.",
            },
        },
        {
            "@type": "Question",
            name: "Are my files uploaded to any remote server?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "No. The entire conversion process occurs within your local web browser using client-side JavaScript. Your files are processed entirely offline and are never stored or transmitted to our servers.",
            },
        },
        {
            "@type": "Question",
            name: "Which web browsers support AVIF files?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "AVIF is supported by almost all major modern browsers, including Google Chrome, Apple Safari, Mozilla Firefox, and Microsoft Edge.",
            },
        },
        {
            "@type": "Question",
            name: "Can I convert multiple images in a batch?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Simply upload multiple files into the workspace. The tool converts them all in parallel, and you can download them at once as a single ZIP archive.",
            },
        },
    ],
};

const STEPS = [
    {
        icon: Upload,
        title: "Upload JPG",
        desc: "Select any JPG or JPEG image from your device.",
    },
    {
        icon: SlidersHorizontal,
        title: "Auto Convert",
        desc: "Your image is converted to modern AVIF format instantly in your browser.",
    },
    {
        icon: Download,
        title: "Download AVIF",
        desc: "Download the converted AVIF file immediately — ultra-compressed and web-ready.",
    },
];

const RELATED = [
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
        id: "jpg-to-png",
        title: "JPG to PNG",
        description: "Convert JPG images to lossless PNG format instantly.",
        icon: ImageIcon,
        gradient: "linear-gradient(135deg, #22c55e, #15803d)",
        shadow: "rgba(34,197,94,0.3)",
        tag: "Image Convert",
    },
    {
        id: "png-to-jpg",
        title: "PNG to JPG",
        description: "Convert PNG images to JPG for smaller file sizes.",
        icon: ImageIcon,
        gradient: "linear-gradient(135deg, #f59e0b, #b45309)",
        shadow: "rgba(245,158,11,0.3)",
        tag: "Image Convert",
    },
    {
        id: "jpg-to-webp",
        title: "JPG to WebP",
        description:
            "Optimize JPG images for the web by converting them to WebP format.",
        icon: ImageIcon,
        gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
        shadow: "rgba(6,182,212,0.3)",
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
    const id = 'jpg-to-avif';
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

export default function JpgToAvifPage() {
    return (
        <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

            {/* Dynamic SEO Schemas */}
            {(() => {
                const meta = getToolMeta('jpg-to-avif');
                return meta ? (
                    <>
                        <WebAppSchema name={`${meta.title} – Free Online Tool`} description={meta.description} url={getToolUrl('jpg-to-avif')} />
                        {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
                        <BreadcrumbSchema items={[{ label: 'Tools', href: '/#tools' }, { label: meta.title, href: `/tool/jpg-to-avif` }]} />
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
                        className="hover:text-fuchsia-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 rounded px-1"
                    >
                        Home
                    </Link>
                    <span aria-hidden="true">/</span>
                    <Link
                        href="/tool"
                        className="hover:text-fuchsia-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 rounded px-1"
                    >
                        Tools
                    </Link>
                    <span aria-hidden="true">/</span>
                    <span
                        className="text-slate-600 dark:text-slate-300"
                        aria-current="page"
                    >
                        JPG to AVIF
                    </span>
                </nav>

                {/* Dynamic Client Tool Component */}
                <section
                    aria-label="JPG to AVIF Image Converter Application"
                    className="mb-16"
                >
                    <ImageConverter id="jpg-to-avif" />
                </section>

                {/* Dynamic visual statistics element */}
                <section className="py-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-r from-fuchsia-50 to-pink-50 dark:from-fuchsia-900/10 dark:to-pink-900/10 border border-fuchsia-100 dark:border-fuchsia-800/60 rounded-3xl p-8">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4 text-center uppercase tracking-tight">
                                Why Convert to AVIF?
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                                {[
                                    {
                                        stat: "~50%",
                                        label: "Smaller than JPG",
                                        sub: "Same visual quality",
                                    },
                                    {
                                        stat: "~35%",
                                        label: "Smaller than WebP",
                                        sub: "Next-gen compression format",
                                    },
                                    {
                                        stat: "100%",
                                        label: "Browser Support",
                                        sub: "All modern browsers",
                                    },
                                ].map(({ stat, label, sub }) => (
                                    <div key={label} className="space-y-1">
                                        <div className="text-3xl font-bold text-fuchsia-600 dark:text-fuchsia-400">
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
                                <s.icon className="text-fuchsia-500" size={24} />
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
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-fuchsia-500/10 dark:bg-fuchsia-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
                        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-fuchsia-600 dark:from-white dark:via-slate-200 dark:to-fuchsia-500 bg-clip-text text-transparent">
                            Convert JPG to AVIF Online <br />
                            <span className="text-fuchsia-500 dark:text-fuchsia-400">
                                100% Free & Secure
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                            Convert JPG pictures to next-generation AVIF images. Yield files
                            up to 50% smaller while keeping the same visual quality. 100%
                            client-side in-browser tool.
                        </p>
                    </div>

                    <article className="space-y-16">
                        {/* What is JPG to AVIF */}
                        <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
                            <div className="p-4 rounded-2xl bg-fuchsia-500/10 text-fuchsia-500 shrink-0">
                                <Info size={32} />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    What is JPG to AVIF format optimization?
                                </h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                                    AVIF (AV1 Image File Format) is the next-generation image
                                    format that represents the biggest leap in compression
                                    technology since WebP. Built on open source standards, AVIF
                                    files can compress up to 50% smaller than legacy JPG files,
                                    dramatically improving Core Web Vitals and LCP loading speeds.
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                                    Converting standard JPG images to AVIF helps your site load
                                    faster. Since our tool executes{" "}
                                    <strong className="text-fuchsia-500 font-bold">
                                        100% client-side inside your browser
                                    </strong>
                                    , your proprietary graphs, charts, and digital photo layouts
                                    are protected locally on your device hardware.
                                </p>
                            </div>
                        </div>

                        {/* How to use */}
                        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                                <span className="p-2 rounded-xl bg-fuchsia-500/10 text-fuchsia-500">
                                    <ArrowRight size={24} />
                                </span>
                                How to convert JPG to AVIF in 3 Steps
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                                {[
                                    {
                                        step: "01",
                                        title: "Select JPGs",
                                        desc: "Drag and drop your JPG or JPEG images into the optimization converter block above.",
                                    },
                                    {
                                        step: "02",
                                        title: "Compress Instantly",
                                        desc: "Our engine optimizes the character byte map to produce highly efficient AVIF files in seconds.",
                                    },
                                    {
                                        step: "03",
                                        title: "Save and Optimize",
                                        desc: "Download the converted AVIF images individually, or export them altogether as a ZIP package.",
                                    },
                                ].map((s, idx) => (
                                    <div
                                        key={idx}
                                        className="relative z-10 flex flex-col gap-4 group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-fuchsia-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-fuchsia-500/40 transition-all duration-300">
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
                                <span className="p-2 rounded-xl bg-fuchsia-500/10 text-fuchsia-500">
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
                                        Total Privacy Shield
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                                        Security is central to our features. Conversions occur in
                                        the local browser context; your files are never transmitted
                                        to external servers.
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 text-fuchsia-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                                        <Zap size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-fuchsia-500 transition-colors">
                                        Accelerate Page Load Speeds
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                                        AVIF helps websites render up to 5 times faster by reducing
                                        image transfer payloads without degrading visually
                                        perceptible quality.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        "Compresses images while maintaining lossless colors.",
                                        "Batch optimize dozens of pictures concurrently with zip pack downloads.",
                                        "Fully mobile-responsive layout designed for touch gestures.",
                                        "Free with no registrations, daily limits, or watermarks.",
                                    ].map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium"
                                        >
                                            <span className="p-0.5 rounded-full bg-fuchsia-500/10 text-fuchsia-600 mt-0.5 shrink-0">
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
                <span className="p-2 rounded-xl bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                                    {
                                        q: "Why should I convert my JPG images to AVIF?",
                                        a: "AVIF is a next-generation image format that features superior compression algorithms compared to JPG and WebP. Converting JPG to AVIF can compress file sizes up to 50% smaller while keeping crisp visual quality, significantly boosting page speed scores.",
                                    },
                                    {
                                        q: "Are my files uploaded to any remote server?",
                                        a: "No. The entire conversion process occurs within your local web browser using client-side JavaScript. Your files are processed entirely offline and are never stored or transmitted to our servers.",
                                    },
                                    {
                                        q: "Which web browsers support AVIF files?",
                                        a: "AVIF is supported by almost all major modern browsers, including Google Chrome, Apple Safari, Mozilla Firefox, and Microsoft Edge.",
                                    },
                                    {
                                        q: "Can I convert multiple images in a batch?",
                                        a: "Yes. Simply upload multiple files into the workspace. The tool converts them all in parallel, and you can download them at once as a single ZIP archive.",
                                    },
                                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500">
                      <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <HelpCircle size={22} className="text-fuchsia-500 shrink-0" />
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
                                className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 text-left focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:outline-none"
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
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-fuchsia-500 transition-colors">
                                        {t.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                        {t.description}
                                    </p>
                                </div>
                                <div className="mt-auto pt-2 text-xs font-bold text-fuchsia-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
