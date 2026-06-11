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
    name: "JPG to PNG Converter",
    url: `${siteUrl}/tool/jpg-to-png`,
    image: `${siteUrl}/img/jpg-to-png-og.png`,
    description:
        "Convert JPG and JPEG images to PNG format instantly for free. Lossless quality conversion with alpha transparency support.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires HTML5 support",
    featureList: [
        "100% Local processing in your browser sandbox",
        "No file uploads to servers",
        "Preserves image quality with lossless output",
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
            name: "JPG to PNG",
            item: `${siteUrl}/tool/jpg-to-png`,
        },
    ],
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "Will converting my JPG to PNG reduce the quality?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "No, PNG is a lossless format. Converting a JPG to PNG will preserve the exact visual quality of your original image without introducing new compression artifacts.",
            },
        },
        {
            "@type": "Question",
            name: "Are my images uploaded to any remote server?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Never. Our tool runs entirely client-side using Javascript. Your files are processed locally inside your web browser and are never uploaded or stored on any server.",
            },
        },
        {
            "@type": "Question",
            name: "Can I convert multiple JPG images to PNG at the same time?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, you can drop or select multiple JPG files at once. Our batch processor will convert them all in parallel and provide a unified ZIP download.",
            },
        },
        {
            "@type": "Question",
            name: "Is there a file size limit for image uploads?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Because all rendering and formatting occur inside your browser memory, there are no artificial server upload limits. It depends entirely on your device's capacity.",
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
        desc: "Your image is converted to PNG format instantly in your browser.",
    },
    {
        icon: Download,
        title: "Download PNG",
        desc: "Download the converted PNG file immediately — no quality loss.",
    },
];

const RELATED = [
    {
        id: "png-to-jpg",
        title: "PNG to JPG",
        description: "Convert PNG images to JPG format instantly.",
        icon: ImageIcon,
        gradient: "linear-gradient(135deg, #f59e0b, #b45309)",
        shadow: "rgba(245,158,11,0.3)",
        tag: "Convert",
    },
    {
        id: "jpg-to-pdf",
        title: "JPG to PDF",
        description: "Turn one or multiple JPG images into a single PDF document.",
        icon: ImageIcon,
        gradient: "linear-gradient(135deg, #eab308, #a16207)",
        shadow: "rgba(234,179,8,0.3)",
        tag: "Convert",
    },
    {
        id: "pdf-to-jpg",
        title: "PDF to JPG",
        description:
            "Convert every PDF page into a high-quality JPG image instantly.",
        icon: ImageIcon,
        gradient: "linear-gradient(135deg, #eab308, #a16207)",
        shadow: "rgba(234,179,8,0.3)",
        tag: "Convert",
    },
    {
        id: "word-to-pdf",
        title: "Word to PDF",
        description: "Convert DOCX files to PDF instantly with perfect formatting.",
        icon: FileText,
        gradient: "linear-gradient(135deg, #3182ce, #1e3a8a)",
        shadow: "rgba(49,130,206,0.3)",
        tag: "Convert",
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


export function generateMetadata() {
    const id = 'jpg-to-png';
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

export default function JpgToPngPage() {
    return (
        <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

            {/* Dynamic SEO Schemas */}
            {(() => {
                const meta = getToolMeta('jpg-to-png');
                return meta ? (
                    <>
                        <WebAppSchema name={`${meta.title} – Free Online Tool`} description={meta.description} url={getToolUrl('jpg-to-png')} />
                        {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
                        <BreadcrumbSchema items={[{ label: 'Tools', href: '/#tools' }, { label: meta.title, href: `/tool/jpg-to-png` }]} />
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
                        className="hover:text-emerald-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1"
                    >
                        Home
                    </Link>
                    <span aria-hidden="true">/</span>
                    <Link
                        href="/tool"
                        className="hover:text-emerald-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1"
                    >
                        Tools
                    </Link>
                    <span aria-hidden="true">/</span>
                    <span
                        className="text-slate-600 dark:text-slate-300"
                        aria-current="page"
                    >
                        JPG to PNG
                    </span>
                </nav>

                {/* Dynamic Client Tool Component */}
                <section
                    aria-label="JPG to PNG Image Converter Application"
                    className="mb-16"
                >
                    <ImageConverter id="jpg-to-png" />
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
                                <s.icon className="text-emerald-500" size={24} />
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
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
                        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-emerald-600 dark:from-white dark:via-slate-200 dark:to-emerald-500 bg-clip-text text-transparent">
                            Convert JPG to PNG Online <br />
                            <span className="text-emerald-500 dark:text-emerald-400">
                                100% Free & Secure
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                            Convert your JPEG images into PNG files instantly. Benefit from
                            lossless conversion that supports transparency, completed entirely
                            inside your browser for total file privacy.
                        </p>
                    </div>

                    <article className="space-y-16">
                        {/* What is JPG to PNG */}
                        <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
                            <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 shrink-0">
                                <Info size={32} />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    What is JPG to PNG conversion?
                                </h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                                    JPG (Joint Photographic Experts Group) is a compressed lossy
                                    format ideal for digital photos but doesn't support
                                    transparent backgrounds. PNG (Portable Network Graphics) is a
                                    lossless format designed specifically for the web, supporting
                                    alpha channel transparency, crisp text, and solid vector-like
                                    elements.
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                                    Converting JPG images to PNG preserves existing image fidelity
                                    without adding extra compression compression noise. Since our
                                    tool operates{" "}
                                    <strong className="text-emerald-500 font-bold">
                                        100% locally in your web browser
                                    </strong>
                                    , your personal snapshots, business charts, and confidential
                                    graphics never travel across any external servers.
                                </p>
                            </div>
                        </div>

                        {/* How to use */}
                        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                                    <ArrowRight size={24} />
                                </span>
                                How to convert JPG to PNG in 3 Steps
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                                {[
                                    {
                                        step: "01",
                                        title: "Select JPGs",
                                        desc: "Drag and drop your JPG or JPEG images directly into the converter box above.",
                                    },
                                    {
                                        step: "02",
                                        title: "Convert Automatically",
                                        desc: "Our offline browser engine converts the file structure to standard PNG format instantly.",
                                    },
                                    {
                                        step: "03",
                                        title: "Download Lossless",
                                        desc: "Save your new PNG images individually, or download all converted files as a batch ZIP.",
                                    },
                                ].map((s, idx) => (
                                    <div
                                        key={idx}
                                        className="relative z-10 flex flex-col gap-4 group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-emerald-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-emerald-500/40 transition-all duration-300">
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
                                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
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
                                        Ironclad Device Security
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                                        Because we value privacy, our client-side JavaScript
                                        processes everything within your local browser runtime
                                        sandbox. We never send your graphics to external cloud
                                        databases.
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                                        <Zap size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-emerald-500 transition-colors">
                                        Fast Lossless Conversion
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                                        Convert image files instantly. There is no waiting for queue
                                        lines or file transmission. The output PNG preserves
                                        original resolution details faithfully.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        "Zero account signups or software installations required.",
                                        "Batch processing handles dozens of images simultaneously.",
                                        "Provides high performance through optimized dynamic imports.",
                                        "Optimized responsive layout is friendly for phone and tablet devices.",
                                    ].map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium"
                                        >
                                            <span className="p-0.5 rounded-full bg-emerald-500/10 text-emerald-600 mt-0.5 shrink-0">
                                                <Check size={12} />
                                            </span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* FAQs */}
                        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                                    <HelpCircle size={24} />
                                </span>
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-4">
                                {[
                                    {
                                        q: "Will converting my JPG to PNG reduce the quality?",
                                        a: "No, PNG is a lossless format. Converting a JPG to PNG will preserve the exact visual quality of your original image without introducing new compression artifacts.",
                                    },
                                    {
                                        q: "Are my images uploaded to any remote server?",
                                        a: "Never. Our tool runs entirely client-side using Javascript. Your files are processed locally inside your web browser and are never uploaded or stored on any server.",
                                    },
                                    {
                                        q: "Can I convert multiple JPG images to PNG at the same time?",
                                        a: "Yes, you can drop or select multiple JPG files at once. Our batch processor will convert them all in parallel and provide a unified ZIP download.",
                                    },
                                    {
                                        q: "Is there a file size limit for image uploads?",
                                        a: "Because all rendering and formatting occur inside your browser memory, there are no artificial server upload limits. It depends entirely on your device's capacity.",
                                    },
                                ].map((item, idx) => (
                                    <details
                                        key={idx}
                                        className="group border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 bg-slate-50/20 dark:bg-slate-900/20 open:bg-slate-50/50 dark:open:bg-slate-800/30 transition-all duration-300 text-left"
                                    >
                                        <summary className="flex items-center justify-between cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg">
                                            <div className="flex items-center gap-3 pr-4">
  <span className="p-1.5 rounded-full bg-emerald-500/10 text-emerald-500 shrink-0">
    <HelpCircle size={18} />
  </span>
  <h3 className="text-base sm:text-base font-bold text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-emerald-500 transition-colors">
                                                {item.q}
                                            </h3>
</div>
                                            <span className="shrink-0 transition-transform duration-300 group-open:rotate-180 text-slate-400 group-hover:text-emerald-500">
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
                                className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 text-left focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
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
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-500 transition-colors">
                                        {t.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                        {t.description}
                                    </p>
                                </div>
                                <div className="mt-auto pt-2 text-xs font-bold text-emerald-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
