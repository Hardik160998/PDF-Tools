import RelatedTools from "@/components/tools/RelatedTools";
import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from '@/components/seo/WebAppSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import BlogImage from "@/components/BlogImage";
import { Zap, BookOpen, Clock, ArrowRight } from "lucide-react";


import MergeSplit from "@/components/tools/MergeSplit";


export function generateMetadata() {
 const id = 'merge-pdf';
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

export default function MergePdfPage() {
 return (
 <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

 {/* Dynamic SEO Schemas */}
 {(() => {
 const meta = getToolMeta('merge-pdf');
 return meta ? (
 <>
 <WebAppSchema name={`${meta.title} – Free Online Tool`} description={meta.description} url={getToolUrl('merge-pdf')} />
 {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
 <BreadcrumbSchema items={[{ label: 'Tools', href: '/#tools' }, { label: meta.title, href: `/tool/merge-pdf` }]} />
 </>
 ) : null;
 })()}

 <div className="max-w-7xl mx-auto px-4 pt-10 sm:pt-16 pb-10">
 <MergeSplit id="merge" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {[
              {
                slug: "reduce-pdf-size-without-losing-quality",
                title: "Reduce PDF File Size Without Losing Quality (2026 Guide)",
                excerpt: "Learn how to reduce PDF file size without losing quality. Discover the best methods, online PDF compressors, and tips for optimizing PDFs efficiently.",
                label: "Optimize",
                icon: Zap,
                iconBg: "bg-teal-500",
                readTime: "8 min read",
                date: "Jun 17, 2026",
                image: "/img/compress-pdf.png",
              },
              {
                slug: "how-to-merge-pdf",
                title: "How to Merge Multiple PDFs into One File (Free & Easy)",
                excerpt: "Learn how to combine multiple PDF files into a single document in seconds using SmartPDFs Pro — no software installation required.",
                label: "Organize",
                icon: Zap,
                iconBg: "bg-orange-500",
                readTime: "3 min read",
                date: "Apr 20, 2026",
                image: "/img/merge-multiple-pdfs.png",
              },
              {
                slug: "ultimate-guide-to-organizing-pdfs",
                title: "The Ultimate Guide to Organizing PDFs — Merge, Split & Rearrange",
                excerpt: "Do you need to combine reports or split a large document? Learn how to use our organization tools to manage your PDFs.",
                label: "Organize",
                icon: Zap,
                iconBg: "bg-purple-600",
                readTime: "5 min read",
                date: "May 5, 2026",
                image: "/img/organizing-pdfs.png",
              }
            ].map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
              >
                <div className="relative overflow-hidden">
                  <BlogImage
                    src={post.image || "/img/word-pdf.png"}
                    alt={post.title}
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center z-10">
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-red-500 rounded-full p-2.5 shadow-xl opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 ease-out flex items-center justify-center">
                      <BookOpen size={16} className="stroke-[2.5]" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 z-20">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white text-red-600 border-2 border-red-500 shadow-sm">
                      {post.label}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 ${post.iconBg} rounded-md flex items-center justify-center text-white shrink-0 shadow-sm`}
                    >
                      <post.icon size={12} />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug group-hover:text-red-500 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> {post.readTime}
                      </span>
                      <span>{post.date}</span>
                    </div>
                    <span className="text-xs font-bold text-red-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
 </div>
 </div>
 );
}
