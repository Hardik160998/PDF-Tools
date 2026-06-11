import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from '@/components/seo/WebAppSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import dynamic from "next/dynamic";
import Link from "next/link";
import type { Metadata } from "next";
import {
    Lock,
    Upload,
    KeyRound,
    Download,
    Unlock,
    Stamp,
    Hash,
    Settings,
    PenLine,
    Combine,
    ArrowRight,
    HelpCircle,
    Info,
    Star,
    Check,
    ChevronDown,
    Zap,
    SplitSquareHorizontal,
    FileText,
} from "lucide-react";
import { CenteredCardSkeleton } from "@/app/tool/[id]/skeletons";

// Site URL for canonical/SEO links
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartpdfpro.com";

// 1. Dynamic Metadata Export for Next.js App Router (Server-side)


// 3. Structured Data (JSON-LD Schemas)
const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Protect PDF Online Free",
    url: `${siteUrl}/tool/protect`,
    image: `${siteUrl}/img/protect-pdf.png`,
    description:
        "Password protect and encrypt PDF files online. Secure documents with strong AES encryption to control editing, printing, and copying.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires HTML5 support",
    featureList: [
        "Secure document encryption with passwords",
        "Restricts copying, editing, and printing",
        "Uses advanced AES cryptographic algorithms",
        "100% secure file processing with HTTPS",
        "Automatic cleanup of files within 1 hour",
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
            name: "Protect PDF",
            item: `${siteUrl}/tool/protect`,
        },
    ],
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "How do I password-protect a PDF?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Upload your PDF, enter a strong password in the prompt box, and our security engine will encrypt the file. Anyone who attempts to open the document thereafter will need the password to view it.",
            },
        },
        {
            "@type": "Question",
            name: "What level of encryption is used for PDF protection?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Our security engine uses industry-standard 128-bit or 256-bit AES encryption to lock and secure your PDF documents, providing high-grade protection against unauthorized decryption.",
            },
        },
        {
            "@type": "Question",
            name: "Can someone bypass the password by converting the PDF?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "No. Standard converters will prompt the user to input the password before converting, and they cannot bypass the built-in PDF security dictionary protection.",
            },
        },
        {
            "@type": "Question",
            name: "How long are my files stored on your servers?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "All uploaded documents are processed securely and deleted automatically from our servers within 1 hour after conversion. We do not keep or read your files.",
            },
        },
    ],
};

// 8. Internal links configuration
const RELATED = [
    {
        id: "compress",
        title: "Compress PDF",
        description: "Reduce PDF file size without losing visible quality.",
        icon: Zap,
        gradient: "linear-gradient(135deg, #22c55e, #15803d)",
        shadow: "rgba(34,197,94,0.3)",
        tag: "Optimize",
        href: "/tool/compress",
    },
    {
        id: "split",
        title: "Split PDF",
        description: "Split a PDF into individual pages or custom page ranges.",
        icon: SplitSquareHorizontal,
        gradient: "linear-gradient(135deg, #f97316, #c2410c)",
        shadow: "rgba(249,115,22,0.3)",
        tag: "Organize",
        href: "/tool/split",
    },
    {
        id: "pdf-to-word",
        title: "PDF to Word",
        description:
            "Convert PDF files to editable Word documents online for free.",
        icon: FileText,
        gradient: "linear-gradient(135deg, #3182ce, #1e3a8a)",
        shadow: "rgba(49,130,206,0.3)",
        tag: "Convert",
        href: "/tool/pdf-to-word",
    },
    {
        id: "unlock",
        title: "Unlock PDF",
        description:
            "Remove password protection and access restrictions from a PDF instantly.",
        icon: Unlock,
        gradient: "linear-gradient(135deg, #ef4444, #b91c1c)",
        shadow: "rgba(239,68,68,0.3)",
        tag: "Security",
        href: "/tool/unlock",
    },
    {
        id: "watermark",
        title: "Watermark PDF",
        description: "Stamp a text or image watermark over every page of your PDF.",
        icon: Stamp,
        gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
        shadow: "rgba(139,92,246,0.3)",
        tag: "Edit",
        href: "/tool/watermark",
    },
    {
        id: "merge",
        title: "Merge PDF",
        description:
            "Combine multiple PDF files into one document in the order you choose.",
        icon: Combine,
        gradient: "linear-gradient(135deg, #f26522, #c2410c)",
        shadow: "rgba(242,101,34,0.3)",
        tag: "Organize",
        href: "/tool/merge",
    },
];

const SecurityToolsWrapper = dynamic(
    () => import("@/components/tools/SecurityToolsWrapper"),
    {
        loading: () => <CenteredCardSkeleton accent="#ef4444" />,
    },
);

// 12. Breadcrumb Navigation Component
function Breadcrumb() {
    return (
        <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500"
        >
            <Link
                href="/"
                className="hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-1"
            >
                Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
                href="/tool"
                className="hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-1"
            >
                Tools
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-600 dark:text-slate-300" aria-current="page">
                Protect PDF
            </span>
        </nav>
    );
}


export function generateMetadata() {
    const id = 'protect';
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

export default function ProtectPage() {
    return (
        <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

            {/* Dynamic SEO Schemas */}
            {(() => {
                const meta = getToolMeta('protect');
                return meta ? (
                    <>
                        <WebAppSchema name={`${meta.title} – Free Online Tool`} description={meta.description} url={getToolUrl('protect')} />
                        {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
                        <BreadcrumbSchema items={[{ label: 'Tools', href: '/#tools' }, { label: meta.title, href: `/tool/protect` }]} />
                    </>
                ) : null;
            })()}

            {/* 2. Structured data scripts for search indexing */}




            <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">
                {/* Breadcrumb navigation */}
                <Breadcrumb />

                {/* Interactive PDF Protect Tool */}
                <section aria-label="PDF Encryption Application" className="mb-16">
                    <SecurityToolsWrapper id="protect" />
                </section>

                {/* Feature Cards Grid */}
                <section
                    aria-label="Tool Benefits Quick Overview"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
                >
                    {[
                        {
                            title: "Military-Grade AES",
                            desc: "Lock your PDF with 128-bit or 256-bit AES encryption schemas. Make files completely secure.",
                            gradient: "linear-gradient(135deg,#ef4444,#b91c1c)",
                        },
                        {
                            title: "Granular Controls",
                            desc: "Prevent unauthorized users from editing, copying text, or printing your PDF content.",
                            gradient: "linear-gradient(135deg,#ef4444,#b91c1c)",
                        },
                        {
                            title: "Safe Deletion Rules",
                            desc: "All documents processed on our servers are permanently deleted within 1 hour.",
                            gradient: "linear-gradient(135deg,#10b981,#047857)",
                        },
                    ].map((feat, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group text-left"
                        >
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg"
                                style={{ background: feat.gradient }}
                            >
                                <div className="text-white font-bold" aria-hidden="true">
                                    {i + 1}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                                {feat.title}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                {feat.desc}
                            </p>
                        </div>
                    ))}
                </section>

                {/* 4. Complete SEO Optimized Content Section */}
                <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 max-w-7xl mx-auto text-left">
                    <div className="mb-16 text-center relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-red-500/10 dark:bg-red-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />

                        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-red-650 dark:from-white dark:via-slate-200 dark:to-red-500 bg-clip-text text-transparent">
                            Password Protect PDFs Online <br />
                            <span className="text-red-500 dark:text-red-400">
                                100% Free & Secure
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                            Encrypt your PDF documents to protect sensitive records, financial
                            sheets, and confidential information from unauthorized opening,
                            modification, or copying.
                        </p>
                    </div>

                    <article className="space-y-16">
                        {/* What is PDF Protection Card */}
                        <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
                            <div className="p-4 rounded-2xl bg-red-500/10 text-red-500 shrink-0">
                                <Info size={32} />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    What is PDF Protection?
                                </h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                                    PDF Protection is the process of applying encryption
                                    parameters to a PDF document to restrict viewing or editing
                                    permissions. By embedding password strings into the document
                                    header structure, you ensure that only recipients with the
                                    authorized key can decrypt and display the contents.
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                                    Our encrypter integrates advanced AES cryptographic logic to
                                    build robust passwords into your PDF files. This security
                                    applies to any standard reader (Adobe Acrobat, Chrome/Firefox,
                                    Apple Preview), guaranteeing{" "}
                                    <strong className="text-red-500 font-bold">
                                        complete compliance and confidentiality
                                    </strong>{" "}
                                    across all systems.
                                </p>
                            </div>
                        </div>

                        {/* How to use the tool card */}
                        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                                <span className="p-2 rounded-xl bg-red-500/10 text-red-500">
                                    <ArrowRight size={24} />
                                </span>
                                How to password-protect PDFs in 3 Simple Steps
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                                {/* Connecting Line */}
                                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />

                                {[
                                    {
                                        step: "01",
                                        title: "Select PDF",
                                        desc: "Select or drop the PDF document you wish to encrypt into the workspace above.",
                                    },
                                    {
                                        step: "02",
                                        title: "Configure Password",
                                        desc: "Type in a strong password. Be sure to memorize it so you can open the file later.",
                                    },
                                    {
                                        step: "03",
                                        title: "Encrypt & Download",
                                        desc: "Click the add password action to encrypt the file, then download the locked document.",
                                    },
                                ].map((s, idx) => (
                                    <div
                                        key={idx}
                                        className="relative z-10 flex flex-col gap-4 group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-red-500 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:border-red-500/40 transition-all duration-300">
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

                        {/* Detailed Benefits and Features */}
                        <div className="space-y-8">
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                                <span className="p-2 rounded-xl bg-red-500/10 text-red-500">
                                    <Star size={24} />
                                </span>
                                Key Benefits & Features
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                                        <Lock size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-green-500 transition-colors">
                                        Robust AES Encryption
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                                        Lock down your sensitive reports, statements, or contracts
                                        using highly secure, industrial standard cryptographic
                                        algorithms.
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                                        <Unlock size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">
                                        Comprehensive Restrictions
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                                        Control viewer authorization. Encrypted PDFs prevent users
                                        from extracting, editing, or printing text unless they have
                                        the password.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        "Protects layout and vector graphics from copy or edit access.",
                                        "Zero account creation or subscriptions required to protect documents.",
                                        "Files are automatically deleted within 1 hour for high privacy compliance.",
                                        "Touch-responsive buttons and focus rings for seamless keyboard navigation.",
                                    ].map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium"
                                        >
                                            <span className="p-0.5 rounded-full bg-red-500/10 text-red-650 mt-0.5 shrink-0">
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
                                <span className="p-2 rounded-xl bg-red-500/10 text-red-500">
                                    <HelpCircle size={24} />
                                </span>
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-4">
                                {[
                                    {
                                        q: "How do I password-protect a PDF?",
                                        a: "Upload your PDF, enter a strong password in the prompt box, and our security engine will encrypt the file. Anyone who attempts to open the document thereafter will need the password to view it.",
                                    },
                                    {
                                        q: "What level of encryption is used for PDF protection?",
                                        a: "Our security engine uses industry-standard 128-bit or 256-bit AES encryption to lock and secure your PDF documents, providing high-grade protection against unauthorized decryption.",
                                    },
                                    {
                                        q: "Can someone bypass the password by converting the PDF?",
                                        a: "No. Standard converters will prompt the user to input the password before converting, and they cannot bypass the built-in PDF security dictionary protection.",
                                    },
                                    {
                                        q: "How long are my files stored on your servers?",
                                        a: "All uploaded documents are processed securely and deleted automatically from our servers within 1 hour after conversion. We do not keep or read your files.",
                                    },
                                ].map((item, idx) => (
                                    <details
                                        key={idx}
                                        className="group border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden bg-slate-50/20 dark:bg-slate-900/20 open:bg-slate-50/50 dark:open:bg-slate-800/30 transition-all duration-300 text-left"
                                    >
                                        <summary className="flex items-center justify-between cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg">
                                            <div className="flex items-center gap-3 pr-4">
  <span className="p-1.5 rounded-full bg-red-500/10 text-red-500 shrink-0">
    <HelpCircle size={18} />
  </span>
  <h3 className="text-base sm:text-base font-bold text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">
                                                {item.q}
                                            </h3>
</div>
                                            <span className="shrink-0 transition-transform duration-300 group-open:rotate-180 text-slate-400 group-hover:text-red-500">
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

                {/* 8. Internal Linking Section with Accessibility improvements */}
                <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 text-left">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 text-center">
                        Explore More PDF Tools
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {RELATED.map((t) => (
                            <Link
                                key={t.id}
                                href={t.href}
                                title={`Use the ${t.title} tool`}
                                aria-label={`Open the ${t.title} tool to ${t.description.toLowerCase()}`}
                                className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 text-left focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
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
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-red-500 transition-colors">
                                        {t.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                        {t.description}
                                    </p>
                                </div>
                                <div className="mt-auto pt-2 text-xs font-bold text-red-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
