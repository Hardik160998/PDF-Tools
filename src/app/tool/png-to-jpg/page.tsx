import RelatedTools from "@/components/tools/RelatedTools";
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
    name: "PNG to JPG Converter",
    url: `${siteUrl}/tool/png-to-jpg`,
    image: `${siteUrl}/img/png-to-jpg-og.png`,
    description:
        "Convert PNG images to JPG format online for free. Compress and convert images to lightweight JPGs instantly.",
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
            name: "PNG to JPG",
            item: `${siteUrl}/tool/png-to-jpg`,
        },
    ],
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What happens to the transparent background of my PNG when converting to JPG?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Because the JPG format does not support transparency, any transparent areas in your PNG image will be automatically filled with a clean white background during the conversion process.",
            },
        },
        {
            "@type": "Question",
            name: "Are my files secure when using this tool?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Absolutely. The converter processes images 100% inside your local web browser. None of your data or files are transmitted to external servers, protecting your privacy completely.",
            },
        },
        {
            "@type": "Question",
            name: "Can I convert multiple PNG files at once?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Our tool supports queue-based batch conversions. You can upload multiple files simultaneously, and they will be packaged into a single ZIP archive for fast downloading.",
            },
        },
        {
            "@type": "Question",
            name: "Will converting to JPG reduce the file size?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Generally, yes. JPG uses lossy compression, which is highly efficient for photographic elements and complex visuals, resulting in smaller file sizes compared to lossless PNG.",
            },
        },
    ],
};

const STEPS = [
    {
        icon: Upload,
        title: "Upload PNG",
        desc: "Select any PNG image from your device.",
    },
    {
        icon: SlidersHorizontal,
        title: "Auto Convert",
        desc: "Your PNG is converted to JPG with a white background fill instantly.",
    },
    {
        icon: Download,
        title: "Download JPG",
        desc: "Download the converted JPG file immediately — smaller and web-ready.",
    },
];




export function generateMetadata() {
    const id = 'png-to-jpg';
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

export default function PngToJpgPage() {
    return (
        <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

            {/* Dynamic SEO Schemas */}
            {(() => {
                const meta = getToolMeta('png-to-jpg');
                return meta ? (
                    <>
                        <WebAppSchema name={`${meta.title} – Free Online Tool`} description={meta.description} url={getToolUrl('png-to-jpg')} />
                        {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
                        <BreadcrumbSchema items={[{ label: 'Tools', href: '/#tools' }, { label: meta.title, href: `/tool/png-to-jpg` }]} />
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
                        className="hover:text-amber-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded px-1"
                    >
                        Home
                    </Link>
                    <span aria-hidden="true">/</span>
                    <Link
                        href="/tool"
                        className="hover:text-amber-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded px-1"
                    >
                        Tools
                    </Link>
                    <span aria-hidden="true">/</span>
                    <span
                        className="text-slate-600 dark:text-slate-300"
                        aria-current="page"
                    >
                        PNG to JPG
                    </span>
                </nav>

                {/* Dynamic Client Tool Component */}
                <section
                    aria-label="PNG to JPG Image Converter Application"
                    className="mb-16"
                >
                    <ImageConverter id="png-to-jpg" />
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
                                <s.icon className="text-amber-500" size={24} />
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

        {/* 4. Complete SEO Optimized Content Section */}
                <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">
                    <div className="mb-16 text-center relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-amber-500/10 dark:bg-amber-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
                        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-amber-600 dark:from-white dark:via-slate-200 dark:to-amber-500 bg-clip-text text-transparent">
                            Convert PNG to JPG Online <br />
                            <span className="text-amber-500 dark:text-amber-400">
                                100% Free & Secure
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                            Convert your transparent or high-quality PNGs to optimized JPG
                            format online. No remote uploads, zero signup, and incredibly fast
                            local conversion inside your web browser.
                        </p>
                    </div>

                    <article className="space-y-16">
                        {/* What is PNG to JPG */}
                        <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
                            <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shrink-0">
                                <Info size={32} />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    Why convert PNG to JPG format?
                                </h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                                    PNG is excellent for web graphics needing transparency, but it
                                    creates significantly larger files for photographs and complex
                                    artwork. JPG uses a lossy compression model that is highly
                                    optimized to represent rich visual gradations in a fraction of
                                    the digital footprint.
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                                    Converting PNG to JPG makes images easier to share via email,
                                    upload to strict forms, or host on speed-optimized website
                                    layouts. By using our tool, your documents are read{" "}
                                    <strong className="text-amber-500 font-bold">
                                        100% locally in your browser memory
                                    </strong>
                                    , preventing third parties or server operators from accessing
                                    your files.
                                </p>
                            </div>
                        </div>

                        {/* How to use */}
                        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                                    <ArrowRight size={24} />
                                </span>
                                How to convert PNG to JPG in 3 Steps
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />
                                {[
                                    {
                                        step: "01",
                                        title: "Select PNGs",
                                        desc: "Drag and drop your PNG images directly into the converter workspace above.",
                                    },
                                    {
                                        step: "02",
                                        title: "Fill Background",
                                        desc: "Our converter fills transparent layers with white and compiles the file into high-quality JPG structure.",
                                    },
                                    {
                                        step: "03",
                                        title: "Download JPG",
                                        desc: "Save the optimized, compressed JPG files individually or as a single batch ZIP file.",
                                    },
                                ].map((s, idx) => (
                                    <div
                                        key={idx}
                                        className="relative z-10 flex flex-col gap-4 group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-amber-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-amber-500/40 transition-all duration-300">
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
                                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
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
                                        100% Client-Side Privacy
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                                        Because we run purely client-side code, none of your
                                        uploaded image assets are ever sent to remote hosts. All
                                        processes happen inside your local computer memory.
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                                        <Zap size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-amber-500 transition-colors">
                                        Instant and Free
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
                                        "Fills layout alpha transparency with a crisp white background.",
                                        "Batch process dozens of PNGs at once with ZIP compilation.",
                                        "Highly responsive and touch-friendly interface.",
                                        "No user account, credit card, or email registration required.",
                                    ].map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium"
                                        >
                                            <span className="p-0.5 rounded-full bg-amber-500/10 text-amber-600 mt-0.5 shrink-0">
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
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-500">
                  <HelpCircle size={24} />
                </span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                                    {
                                        q: "What happens to the transparent background of my PNG when converting to JPG?",
                                        a: "Because the JPG format does not support transparency, any transparent areas in your PNG image will be automatically filled with a clean white background during the conversion process.",
                                    },
                                    {
                                        q: "Are my files secure when using this tool?",
                                        a: "Absolutely. The converter processes images 100% inside your local web browser. None of your data or files are transmitted to external servers, protecting your privacy completely.",
                                    },
                                    {
                                        q: "Can I convert multiple PNG files at once?",
                                        a: "Yes. Our tool supports queue-based batch conversions. You can upload multiple files simultaneously, and they will be packaged into a single ZIP archive for fast downloading.",
                                    },
                                    {
                                        q: "Will converting to JPG reduce the file size?",
                                        a: "Generally, yes. JPG uses lossy compression, which is highly efficient for photographic elements and complex visuals, resulting in smaller file sizes compared to lossless PNG.",
                                    },
                                ].map((item, idx) => (
                  <details
                    key={idx}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
                      <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <HelpCircle size={22} className="text-amber-500 shrink-0" />
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
