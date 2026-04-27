import { FileText, Clock, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
export default function PDFToWordPost() {
  return (
    <article className="min-h-screen"><div className="container mx-auto px-4 pt-10 pb-20 max-w-3xl">
      <a href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 font-bold mb-8"><ArrowLeft size={14} /> Back to Blog</a>
      <div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><FileText size={22} /></div>
        <div><span className="text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Guide</span>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-medium"><span className="flex items-center gap-1"><Clock size={11} /> 5 min read</span><span>Apr 15, 2026</span></div></div></div>
      <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 mb-4 leading-tight">PDF to Word: The Complete Conversion Guide for 2026</h1>
      <p className="text-lg text-slate-500 leading-relaxed mb-8">Need to edit a PDF? Convert it to a Word document in seconds. Here's everything you need to know about PDF to Word conversion.</p>
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5"><p className="font-black text-blue-800 text-sm mb-2">In this guide</p>
          <ul className="space-y-1">{['When to convert PDF to Word','Step-by-step conversion guide','Tips for preserving formatting','Supported formats'].map(i => (<li key={i} className="flex items-center gap-2 text-sm text-blue-700"><CheckCircle2 size={13} className="text-blue-500" />{i}</li>))}</ul></div>
        <h2 className="text-xl font-black text-slate-900">When Should You Convert PDF to Word?</h2>
        <p className="text-slate-600 leading-relaxed text-sm">PDFs are great for sharing but not for editing. Convert to Word when you need to: edit text content, update tables or charts, reformat the document layout, or extract content for reuse in another document.</p>
        <h2 className="text-xl font-black text-slate-900">How to Convert PDF to Word</h2>
        {[{step:'1',title:'Open PDF to Word Tool',desc:'Go to SmartPDFs Plus and select "PDF to Word" from the Convert section.'},{step:'2',title:'Upload Your PDF',desc:'Click the upload area or drag your PDF file in. Accepts any standard PDF up to 100MB.'},{step:'3',title:'Click "Convert"',desc:'Our cloud conversion engine processes your file. This requires an internet connection.'},{step:'4',title:'Download Your DOCX',desc:'Click "Download Result" to save your editable Word document (.docx format).'}].map(({step,title,desc}) => (
          <div key={step} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">{step}</div>
            <div><p className="font-black text-slate-900 text-sm">{title}</p><p className="text-sm text-slate-500 mt-0.5">{desc}</p></div>
          </div>
        ))}
        <h2 className="text-xl font-black text-slate-900">Tips for Best Results</h2>
        <ul className="space-y-2">{['PDFs with selectable text convert better than scanned PDFs','Complex layouts (multi-column, tables) may need minor formatting adjustments after conversion','Embedded fonts are preserved where possible','Images in the PDF are included in the Word document'].map((tip,i) => (<li key={i} className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 rounded-xl p-3"><CheckCircle2 size={14} className="text-green-500 shrink-0 mt-0.5" />{tip}</li>))}</ul>
        <h2 className="text-xl font-black text-slate-900">Other Supported Conversions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{[['Word → PDF','word-to-pdf'],['Excel → PDF','excel-to-pdf'],['PDF → Excel','pdf-to-excel'],['PPT → PDF','ppt-to-pdf'],['PDF → PPT','pdf-to-ppt'],['HTML → PDF','html-to-pdf']].map(([label,slug]) => (<a key={slug} href={`/tool/${slug}`} className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-xs font-black text-slate-700 hover:text-red-500 hover:border-red-200 transition-all text-center">{label}</a>))}</div>
        <div className="bg-slate-900 rounded-2xl p-6 text-center text-white space-y-3"><p className="font-black">Convert your PDF to Word now</p>
          <a href="/tool/pdf-to-word" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-sm transition-all">Open PDF to Word <ArrowRight size={14} /></a></div>
      </div>
    </div></article>
  );
}
