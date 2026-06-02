import { getToolMeta, getToolUrl } from "@/data/toolMeta";
import WebAppSchema from '@/components/seo/WebAppSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';


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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-16">
          {[
            { 
              title: "Amazon Labels", 
              desc: "Specialized merging for Amazon warehouse labels with automated SKU/Qty extraction and enrichment.",
              gradient: "linear-gradient(135deg,#f97316,#ea580c)"
            },
            { 
              title: "Smart Sorting", 
              desc: "Reorder files via drag-and-drop to create the perfectly sequenced PDF document.",
              gradient: "linear-gradient(135deg,#f97316,#ea580c)"
            },
            { 
              title: "Local Privacy", 
              desc: "Merging happens 100% in your browser. Sensitive business data stays on your machine.",
              gradient: "linear-gradient(135deg,#22c55e,#15803d)"
            }
          ].map((feat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg" style={{ background: feat.gradient }}>
                <div className="text-white font-black">{i + 1}</div>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{feat.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
