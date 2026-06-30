import RelatedTools from "@/components/tools/RelatedTools";
import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from '@/components/seo/WebAppSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import dynamic from "next/dynamic";
import Link from "next/link";
import {
    Unlock,
    Lock,
    ArrowRight,
    HelpCircle,
    Info,
    Star,
    Check,
    ChevronDown,
} from "lucide-react";
import { CenteredCardSkeleton } from "@/app/tool/[id]/skeletons";

// 8. Internal links configuration
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
                className="hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1"
            >
                Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
                href="/tool"
                className="hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1"
            >
                Tools
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-600 dark:text-slate-300" aria-current="page">
                Unlock PDF
            </span>
        </nav>
    );
}


export function generateMetadata() {
    const id = 'unlock';
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

export default function UnlockPage() {
    return (
        <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

            {/* Dynamic SEO Schemas */}
            {(() => {
                const meta = getToolMeta('unlock');
                return meta ? (
                    <>
                        <WebAppSchema name={`${meta.title} – Free Online Tool`} description={meta.description} url={getToolUrl('unlock')} />
                        {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
                        <BreadcrumbSchema items={[{ label: 'Tools', href: '/#tools' }, { label: meta.title, href: `/tool/unlock` }]} />
                    </>
                ) : null;
            })()}

            {/* 2. Structured data scripts for search indexing */}




            <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-16">
                {/* Breadcrumb navigation */}
                <Breadcrumb />

                {/* Interactive PDF Unlock Tool */}
                <section aria-label="PDF Decryption Application" className="mb-16">
                    <SecurityToolsWrapper id="unlock" />
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
                        {/* Blog Post 1: Protect PDF Guide */}
                        <a href="/blog/protect-pdf-with-password" className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
                            <div className="p-6 flex flex-col flex-1 gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-[#3b82f6] rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-[17px] leading-snug group-hover:text-red-600 transition-colors">
                                        How to Protect a PDF with a Password (Complete Guide)
                                    </h3>
                                </div>
                                <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        4 min read &nbsp; May 28, 2026
                                    </div>
                                    <span className="text-sm font-bold text-red-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Read <ArrowRight size={14} />
                                    </span>
                                </div>
                            </div>
                        </a>

                        {/* Blog Post 2: 10 Common PDF Problems */}
                        <a href="/blog/10-common-pdf-problems-and-how-to-fix-them" className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
                            <div className="p-6 flex flex-col flex-1 gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-[#ef4444] rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-[17px] leading-snug group-hover:text-red-600 transition-colors">
                                        10 Common PDF Problems and How to Fix Them
                                    </h3>
                                </div>
                                <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        10 min read &nbsp; Jun 17, 2026
                                    </div>
                                    <span className="text-sm font-bold text-red-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Read <ArrowRight size={14} />
                                    </span>
                                </div>
                            </div>
                        </a>

                        {/* Blog Post 3: Merge vs Split PDF */}
                        <a href="/blog/merge-vs-split-pdf" className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
                            <div className="p-6 flex flex-col flex-1 gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-[#ea580c] rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="7" rx="2" ry="2"></rect>
                                            <rect x="3" y="14" width="7" height="7" rx="2" ry="2"></rect>
                                            <rect x="14" y="14" width="7" height="7" rx="2" ry="2"></rect>
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-[17px] leading-snug group-hover:text-red-600 transition-colors">
                                        Merge vs Split PDF: When to Use Each Tool (2026 Guide)
                                    </h3>
                                </div>
                                <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        6 min read &nbsp; May 22, 2026
                                    </div>
                                    <span className="text-sm font-bold text-red-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Read <ArrowRight size={14} />
                                    </span>
                                </div>
                            </div>
                        </a>
                    </div>
                </section>

                {/* Feature Cards Grid */}
                <section
                    aria-label="Tool Benefits Quick Overview"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
                >
                    {[
                        {
                            title: "Instant Decryption",
                            desc: "Strip password security and restrictive permissions from your PDF files in a single click.",
                            gradient: "linear-gradient(135deg,#ef4444,#b91c1c)",
                        },
                        {
                            title: "Unlock Restrictions",
                            desc: "Enable copying, printing, editing, and extracting on files that were restricted by authors.",
                            gradient: "linear-gradient(135deg,#ef4444,#b91c1c)",
                        },
                        {
                            title: "Secure Transmission",
                            desc: "All files are processed through secure, encrypted connections and permanently wiped within an hour.",
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

                        <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 uppercase leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-red-650 dark:from-white dark:via-slate-200 dark:to-red-500 bg-clip-text text-transparent">
                            Unlock PDF Files Online <br />
                            <span className="text-red-500 dark:text-red-400">
                                Instantly & Safely
                            </span>
                        </h2>
                        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                            Remove PDF passwords and restrictive locks on copying, printing,
                            and modification. Free up your files immediately with our secure
                            decryption engine.
                        </p>
                    </div>

                    <article className="space-y-16">
                        {/* What is PDF Unlocker Card */}
                        <div className="bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
                            <div className="p-4 rounded-2xl bg-red-500/10 text-red-500 shrink-0">
                                <Info size={32} />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    What is PDF Unlocking?
                                </h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                                    PDF unlocking is the process of removing security restrictions
                                    that prevent users from opening, printing, copying text, or
                                    editing a PDF file. Often, authors lock documents to secure
                                    proprietary details, but this security can hinder legitimate
                                    workflows if passwords are lost or if restrictions need to be
                                    lifted.
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                                    Our unlocker tool accesses the internal encryption tables of
                                    your PDF, strips the security dictionaries, and generates a
                                    new, unlocked version of the file.{" "}
                                    <strong className="text-red-500 font-bold">
                                        Please note:
                                    </strong>{" "}
                                    to decrypt owner password protections (preventing opening),
                                    you must supply the original password. Once entered, all
                                    permissions (copying, editing, printing) are permanently
                                    enabled.
                                </p>
                            </div>
                        </div>

                        {/* How to use the tool card */}
                        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-10 flex items-center gap-3">
                                <span className="p-2 rounded-xl bg-red-500/10 text-red-500">
                                    <ArrowRight size={24} />
                                </span>
                                How to unlock PDFs in 3 Simple Steps
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
                                {/* Connecting Line */}
                                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800/80 -z-0" />

                                {[
                                    {
                                        step: "01",
                                        title: "Select PDF File",
                                        desc: "Select or drop the password-protected PDF you own into the file workspace above.",
                                    },
                                    {
                                        step: "02",
                                        title: "Provide Password",
                                        desc: "Type the document's open password in the prompt box to authorize the removal of security locks.",
                                    },
                                    {
                                        step: "03",
                                        title: "Download Unlocked",
                                        desc: "Click the unlock action. Download your restrictions-free, watermark-free PDF instantly.",
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
                                        <Unlock size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-green-500 transition-colors">
                                        Instant Restriction Removal
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                                        Remove editing limitations, printing locks, and blockages on
                                        copying text and images. Enjoy full authorization over your
                                        digital files within seconds.
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                                        <Lock size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">
                                        Secure Encrypted Session
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                                        Your security is vital to us. All processes are fully
                                        encrypted, and all uploaded files are permanently deleted
                                        from our secure servers within 1 hour.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8">
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        "Strips editing limitations instantly, enabling copy/paste functionality.",
                                        "Optimized for high-speed batching and security permissions modifications.",
                                        "No credit card or user sign-up required for basic conversions.",
                                        "Touch-friendly controls optimized for mobile, tablet, and desktop viewports.",
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
                                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-500">
                                    <HelpCircle size={24} />
                                </span>
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-4">
                                {[
                                    {
                                        q: "How do I unlock a password-protected PDF?",
                                        a: "Upload your protected PDF file, enter the current password, and our unlock engine will decrypt the file and strip all access restrictions. You can then download your fully editable PDF.",
                                    },
                                    {
                                        q: "Can I unlock a PDF if I do not know the password?",
                                        a: "No. For security and legal reasons, you must know the password to unlock the document. This tool is designed to remove protection and restrictions from PDF files you own.",
                                    },
                                    {
                                        q: "Are my files kept secure during the unlock process?",
                                        a: "Yes. All uploads are encrypted via secure HTTPS protocols. Your files are automatically deleted from our secure servers within 1 hour after processing.",
                                    },
                                    {
                                        q: "Does unlocking a PDF affect its formatting or quality?",
                                        a: "No. Unlocking only alters the security dictionary inside the PDF structure. The visual content, images, text, and overall formatting of your document remain perfectly intact.",
                                    },
                                ].map((item, idx) => (
                                    <details
                                        key={idx}
                                        className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
                                    >
                                        <summary className="flex items-center justify-between p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                                            <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                                                <HelpCircle size={22} className="text-orange-500 shrink-0" />
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
