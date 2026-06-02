import { getToolMeta, getToolUrl } from "@/data/toolData";
import WebAppSchema from '@/components/seo/WebAppSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';


import OptimizePdf from "@/components/tools/OptimizePdf";


export function generateMetadata() {
 const id = 'compress-pdf';
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

export default function CompressPdfPage() {
 return (
 <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">

 {/* Dynamic SEO Schemas */}
 {(() => {
 const meta = getToolMeta('compress-pdf');
 return meta ? (
 <>
 <WebAppSchema name={`${meta.title} – Free Online Tool`} description={meta.description} url={getToolUrl('compress-pdf')} />
 {meta.faqs.length > 0 && <FAQSchema faqs={meta.faqs} />}
 <BreadcrumbSchema items={[{ label: 'Tools', href: '/#tools' }, { label: meta.title, href: `/tool/compress-pdf` }]} />
 </>
 ) : null;
 })()}

 <div className="max-w-7xl mx-auto px-4 pt-10 sm:pt-16 pb-10">
 <OptimizePdf id="compress-pdf" />

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-16">
 {[
 { 
 title: "Extreme Compression", 
 desc: "Reduce massive PDF files by up to 90% using high-priority image re-encoding streams.",
 gradient: "linear-gradient(135deg,#10b981,#059669)"
 },
 { 
 title: "Batch Efficiency", 
 desc: "Quickly compress large documents for email attachments or cloud storage limits.",
 gradient: "linear-gradient(135deg,#10b981,#059669)"
 },
 { 
 title: "Local Privacy", 
 desc: "All compression logic runs in your browser sandbox. No file uploads required.",
 gradient: "linear-gradient(135deg,#22c55e,#15803d)"
 }
 ].map((feat, i) => (
 <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
 <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg" style={{ background: feat.gradient }}>
 <div className="text-white font-bold">{i + 1}</div>
 </div>
 <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-2">{feat.title}</h3>
 <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
}
