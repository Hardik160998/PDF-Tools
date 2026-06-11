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
    name: "WebP to JPG Converter",
    url: `${siteUrl}/tool/webp-to-jpg`,
    image: `${siteUrl}/img/webp-to-jpg-og.png`,
    description:
        "Convert WebP images to JPG format online for free. Convert modern WebP files into universally compatible JPGs instantly.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires HTML5 support",
    featureList: [
        "100% Local processing in your browser sandbox",
        "No file uploads to servers",
        "Fills transparent backgrounds with white color during conversion",
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
            name: "WebP to JPG",
            item: `${siteUrl}/tool/webp-to-jpg`,
        },
    ],
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "Why would I convert WebP to JPG?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "While WebP offers superior compression, older image viewers, email clients, print shops, and legacy web portals often fail to support WebP formats. Converting WebP to JPG restores universal compatibility.",
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
            name: "What happens to transparency when converting WebP to JPG?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Because the JPG format does not support transparency, any transparent areas in your WebP file will be automatically filled with a clean white background during the conversion process.",
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
        title: "Upload WebP",
        desc: "Select any WebP image from your device.",
    },
    {
        icon: SlidersHorizontal,
        title: "Auto Convert",
        desc: "Your WebP is converted to JPG with white background fill instantly.",
    },
    {
        icon: Download,
        title: "Download JPG",
        desc: "Download the converted JPG — universally compatible with all apps.",
    },
];

const RELATED = [
    {
        id: "jpg-to-webp",
        title: "JPG to WebP",
        description: "Convert JPG images to modern WebP for smaller file sizes.",
        icon: ImageIcon,
        gradient: "linear-gradient(135deg, #7c3aed, #4c1d95)",
        shadow: "rgba(124,58,237,0.3)",
        tag: "Image Convert",
    },
    {
        id: "webp-to-png",
        title: "WebP to PNG",
        description:
            "Convert WebP images to lossless PNG for maximum compatibility.",
        icon: ImageIcon,
        gradient: "linear-gradient(135deg, #14b8a6, #0f766e)",
        shadow: "rgba(20,184,166,0.3)",
        tag: "Image Convert",
    },
    {
        id: "png-to-webp",
        title: "PNG to WebP",
        description:
            "Convert PNG images to WebP for smaller sizes without quality loss.",
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
        id: "jpg-to-pdf",
        title: "JPG to PDF",
        description: "Turn one or multiple JPG images into a single PDF document.",
        icon: ImageIcon,
        gradient: "linear-gradient(135deg, #eab308, #a16207)",
        shadow: "rgba(234,179,8,0.3)",
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
];


export function generateMetadata() {
    const id = 'webp-to-jpg';
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

export default function WebpToJpgPage() {
    return (
        <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

            {/* Dynamic SEO Schemas */}
            {(() => {
                const meta = getToolMeta('webp-to-jpg');
                return meta ? (
                    <>
                        <WebAppSchema name={`${meta.title} – Free Online Tool`} description={meta.description} url={getToolUrl('webp-to-jpg')} />
                        {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
                        <BreadcrumbSchema items={[{ label: 'Tools', href: '/#tools' }, { label: meta.title, href: `/tool/webp-to-jpg` }]} />
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
                        className="hover:text-pink-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded px-1"
                    >
                        Home
                    </Link>
                    <span aria-hidden="true">/</span>
                    <Link
                        href="/tool"
                        className="hover:text-pink-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded px-1"
                    >
                        Tools
                    </Link>
                    <span aria-hidden="true">/</span>
                    <span
                        className="text-slate-600 dark:text-slate-300"
                        aria-current="page"
                    >
                        WebP to JPG
                    </span>
                </nav>

                {/* Dynamic Client Tool Component */}
                <section
                    aria-label="WebP to JPG Image Converter Application"
                    className="mb-16"
                >
                    <ImageConverter id="webp-to-jpg" />
                </section>

                {/* Dynamic visual statistics element */}
                <section className="py-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 border border-pink-100 dark:border-rose-800/60 rounded-3xl p-8">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4 text-center uppercase tracking-tight">
                                When to Use WebP → JPG
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                                {[
                                    {
                                        icon: "📧",
                                        label: "Email Attachments",
                                        sub: "JPG works everywhere",
                                    },
                                    {
                                        icon: "🖨️",
                                        label: "Printing",
                                        sub: "Print shops prefer JPG",
                                    },
                                    {
                                        icon: "📱",
                                        label: "Legacy Apps",
                                        sub: "Older apps need JPG",
                                    },
                                ].map(({ icon, label, sub }) => (
                                    <div key={label} className="space-y-1">
                                        <div className="text-3xl">{icon}</div>
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
                                <s.icon className="text-pink-500" size={24} />
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
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-pink-500/10 dark:bg-pink-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
                        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-pink-600 dark:from-white dark:via-slate-200 dark:to-pink-500 bg-clip-text text-transparent">
                            Convert WebP to JPG Online <br />
                            <span className="text-pink-500 dark:text-pink-400">
                                100% Free & Secure
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                            Convert next-generation WebP files into universally compatible
                            JPGs instantly. Achieve high compatibility with old systems and
                            apps using our 100% browser-based conversion script.
                        </p>
                    </div>

                    <article className="space-y-16">
                        {/* What is WebP to JPG */}
                        <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
                            <div className="p-4 rounded-2xl bg-pink-500/10 text-pink-500 shrink-0">
                                <Info size={32} />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    What is WebP to JPG conversion?
                                </h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                                    WebP provides incredible compression metrics for websites, but
                                    is notoriously rejected by legacy operating systems, specific
                                    print-on-demand services, and strict document management apps.
                                    JPG remains the global standard for universal compatibility.
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                                    Converting WebP assets to JPG restores full software
                                    accessibility. By hosting the converter engine{" "}
                                    <strong className="text-pink-500 font-bold">
                                        entirely client-side in your web browser
                                    </strong>
                                    , we eliminate the security vulnerabilities of third-party
                                    server uploads.
                                </p>
                            </div>
                        </div>

                        {/* How to use */}
                        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                                <span className="p-2 rounded-xl bg-pink-500/10 text-pink-500">
                                    <ArrowRight size={24} />
                                </span>
                                How to convert WebP to JPG in 3 Steps
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                                {[
                                    {
                                        step: "01",
                                        title: "Select WebP Files",
                                        desc: "Drag and drop WebP images directly into the converter block above.",
                                    },
                                    {
                                        step: "02",
                                        title: "Process Automatically",
                                        desc: "The local script translates the layout map and converts WebP layers to JPG pixels instantly.",
                                    },
                                    {
                                        step: "03",
                                        title: "Save Universal JPGs",
                                        desc: "Download JPG files instantly, either individually or packed into a ZIP file.",
                                    },
                                ].map((s, idx) => (
                                    <div
                                        key={idx}
                                        className="relative z-10 flex flex-col gap-4 group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-pink-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-pink-500/40 transition-all duration-300">
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
                                <span className="p-2 rounded-xl bg-pink-500/10 text-pink-500">
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
                                        100% In-Browser Privacy
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                                        Because we run entirely within your browser context, your
                                        images are never sent across the network, keeping your data
                                        confidential.
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                                        <Zap size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-pink-500 transition-colors">
                                        No Conversion Fees
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                                        Convert unlimited images without any paywalls or watermarks.
                                        It is designed to fit directly into your daily publishing
                                        pipeline.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        "Automatically fills canvas alpha transparency with white background.",
                                        "Batch processing lets you optimize multiple files in parallel.",
                                        "Optimized clean layout is fully responsive for all screen sizes.",
                                        "Zero registrations, signups, or email requests.",
                                    ].map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium"
                                        >
                                            <span className="p-0.5 rounded-full bg-pink-500/10 text-pink-600 mt-0.5 shrink-0">
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
                <span className="p-2 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                                    {
                                        q: "Why would I convert WebP to JPG?",
                                        a: "While WebP offers superior compression, older image viewers, email clients, print shops, and legacy web portals often fail to support WebP formats. Converting WebP to JPG restores universal compatibility.",
                                    },
                                    {
                                        q: "Are my files uploaded to any remote server?",
                                        a: "No. The entire conversion process occurs within your local web browser using client-side JavaScript. Your files are processed entirely offline and are never stored or transmitted to our servers.",
                                    },
                                    {
                                        q: "What happens to transparency when converting WebP to JPG?",
                                        a: "Because the JPG format does not support transparency, any transparent areas in your WebP file will be automatically filled with a clean white background during the conversion process.",
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
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500">
                      <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <HelpCircle size={22} className="text-pink-500 shrink-0" />
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
                                className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 text-left focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:outline-none"
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
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-pink-500 transition-colors">
                                        {t.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                        {t.description}
                                    </p>
                                </div>
                                <div className="mt-auto pt-2 text-xs font-bold text-pink-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
