import { Zap, Clock, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
export default function CompressPost() {
  return (
    <article className="min-h-screen">
      <div className="container mx-auto px-4 pt-10 pb-20 max-w-3xl">
        <a href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 font-bold mb-8"><ArrowLeft size={14} /> Back to Blog</a>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"><Zap size={22} /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 leading-tight mb-1">How to Compress a PDF Without Losing Quality</h1>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Guide</span>
              <span className="flex items-center gap-1"><Clock size={11} /> 4 min read</span>
              <span>Apr 18, 2026</span>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl mb-6">
          <img src="/img/word-pdf.png" alt="How to Compress a PDF" className="w-full h-auto" />
        </div>
        <p className="text-lg text-slate-500 leading-relaxed mb-8">Large PDF files are frustrating to email, upload, or share. Learn how to shrink your PDFs while keeping them sharp and readable.</p>
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
            <p className="font-black text-green-800 text-sm mb-2">Key takeaways</p>
            <ul className="space-y-1">{['Why PDFs get large and how compression works','How to compress using SmartPDFs Plus','What affects compression ratio'].map(i => (<li key={i} className="flex items-center gap-2 text-sm text-green-700"><CheckCircle2 size={13} className="text-green-500" />{i}</li>))}</ul>
          </div>
          <h2 className="text-xl font-black text-slate-900">Why Are PDFs So Large?</h2>
          <p className="text-slate-600 leading-relaxed text-sm">PDFs grow large due to embedded fonts, high-resolution images, metadata, and object streams. A scanned document can easily be 10–50MB. Our Compress PDF tool uses object stream optimization and metadata stripping to reduce size without re-encoding images.</p>
          <h2 className="text-xl font-black text-slate-900">How to Compress Your PDF</h2>
          {[{step:'1',title:'Go to Compress PDF',desc:'Open the Compress PDF tool from the homepage.'},{step:'2',title:'Upload Your PDF',desc:'Click the upload area or drag your PDF in. Works with any PDF up to 500MB.'},{step:'3',title:'Click "Compress PDF"',desc:'Processing happens instantly in your browser. No server upload needed.'},{step:'4',title:'See the Size Reduction',desc:'After compression, you\'ll see the exact reduction — e.g. "Reduced from 8.2MB to 1.4MB (-83%)".'},{step:'5',title:'Download',desc:'Click Download PDF to save your compressed file.'}].map(({step,title,desc}) => (
            <div key={step} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">{step}</div>
              <div><p className="font-black text-slate-900 text-sm">{title}</p><p className="text-sm text-slate-500 mt-0.5">{desc}</p></div>
            </div>
          ))}
          <h2 className="text-xl font-black text-slate-900">What Affects Compression?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[{label:'Text-heavy PDFs',result:'Compress very well (60–90% reduction)',color:'text-green-600 bg-green-50'},{label:'Scanned PDFs',result:'Moderate reduction (20–50%)',color:'text-yellow-600 bg-yellow-50'},{label:'Image-heavy PDFs',result:'Smaller reduction (10–30%)',color:'text-orange-600 bg-orange-50'},{label:'Already compressed',result:'Minimal reduction (0–10%)',color:'text-slate-600 bg-slate-50'}].map(({label,result,color}) => (
              <div key={label} className={`p-3 rounded-xl ${color} border border-current/10`}><p className="font-black text-sm">{label}</p><p className="text-xs mt-0.5">{result}</p></div>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-4 mb-6">
            {[
              { q: 'Will I lose text quality after compression?', a: 'No. The tool uses lossless compression for text and vectors, and high-quality downscaling for images, so text remains perfectly sharp.' },
              { q: 'Is there a file size limit?', a: 'You can upload files up to 500MB. However, larger files will take longer to process in your browser.' },
              { q: 'How many files can I compress?', a: 'There is no limit on the number of files you can compress. You can use the tool as many times as you need.' }
            ].map(({ q, a }, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="font-black text-slate-900 text-sm mb-1">{q}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
          <div className="bg-white border-2 border-green-500 rounded-2xl p-6 text-center text-slate-900 space-y-3 shadow-sm hover:shadow-xl transition-all duration-300">
            <p className="font-black">Compress your PDF now — free & instant</p>
            <a href="/tool/compress" className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-black text-sm transition-all">Open Compress PDF <ArrowRight size={14} /></a>
          </div>
        </div>
      </div>
    </article>
  );
}
