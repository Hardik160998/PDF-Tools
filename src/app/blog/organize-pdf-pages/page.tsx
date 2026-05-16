import { LayoutGrid, Clock, ArrowRight, CheckCircle2, ArrowLeft, RotateCw, Trash2 } from 'lucide-react';
export default function OrganizePDFPost() {
  return (
    <article className="min-h-screen"><div className="container mx-auto px-4 pt-10 pb-20 max-w-3xl">
      <a href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 font-bold mb-8"><ArrowLeft size={14} /> Back to Blog</a>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"><LayoutGrid size={22} /></div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 leading-tight mb-1">How to Rearrange, Rotate & Delete PDF Pages Online</h1>
          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Tutorial</span>
            <span className="flex items-center gap-1"><Clock size={11} /> 4 min read</span>
            <span>Apr 10, 2026</span>
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-2xl mb-6">
        <img src="/img/word-pdf.png" alt="How to Rearrange, Rotate & Delete PDF Pages Online" className="w-full h-auto" />
      </div>
      <p className="text-lg text-slate-500 leading-relaxed mb-8">The Organize PDF tool gives you full visual control over your document pages. Drag to reorder, rotate sideways scans, and remove unwanted pages.</p>
      <div className="space-y-6">
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5"><p className="font-black text-purple-800 text-sm mb-2">Features covered</p>
          <ul className="space-y-1">{['Drag & drop page reordering', 'Rotating individual pages or all pages', 'Deleting unwanted pages', 'Combining pages from multiple PDFs'].map(i => (<li key={i} className="flex items-center gap-2 text-sm text-purple-700"><CheckCircle2 size={13} className="text-purple-500" />{i}</li>))}</ul></div>
        <h2 className="text-xl font-black text-slate-900">How to Use the Organize PDF Tool</h2>
        {[{ step: '1', title: 'Open Organize PDF', desc: 'Go to SmartPDFs Plus → Organize PDF from the homepage.' }, { step: '2', title: 'Upload Your PDF(s)', desc: 'Click the upload area or drag PDFs in. You can upload multiple PDFs — all pages appear as thumbnails.' }, { step: '3', title: 'Rearrange Pages', desc: 'Drag any page thumbnail to a new position. On mobile, press and hold for 250ms then drag.' }, { step: '4', title: 'Rotate Pages', desc: 'Click the rotate button (↻) on any thumbnail to rotate that page 90°. Click multiple times for 180° or 270°.' }, { step: '5', title: 'Delete Pages', desc: 'Click the trash icon (🗑) on any thumbnail to remove that page from the final document.' }, { step: '6', title: 'Download', desc: 'Click "Organize PDF" in the sidebar and download your reorganized document.' }].map(({ step, title, desc }) => (
          <div key={step} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">{step}</div>
            <div><p className="font-black text-slate-900 text-sm">{title}</p><p className="text-sm text-slate-500 mt-0.5">{desc}</p></div>
          </div>
        ))}
        <h2 className="text-xl font-black text-slate-900">Batch Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[{ icon: RotateCw, title: 'Rotate All', desc: 'Rotate every page 90° at once — useful for scanned documents that are all sideways.', color: 'bg-orange-50 border-orange-100' }, { icon: Trash2, title: 'Reverse Order', desc: 'Flip the entire page order — useful when a scanner outputs pages in reverse.', color: 'bg-blue-50 border-blue-100' }].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className={`p-4 rounded-2xl border ${color}`}><div className="flex items-center gap-2 mb-1"><Icon size={14} className="text-slate-600" /><p className="font-black text-slate-900 text-sm">{title}</p></div><p className="text-xs text-slate-500">{desc}</p></div>
          ))}
        </div>

        <h2 className="text-xl font-black text-slate-900">Frequently Asked Questions</h2>
        <div className="space-y-4 mb-6">
          {[
            { q: 'Can I undo a deletion?', a: 'Yes! If you delete a page, a "Restore" button will appear on the thumbnail or in the undo history, allowing you to bring it back before downloading.' },
            { q: 'Is there a limit on the number of pages I can organize?', a: 'No. The tool can handle documents with hundreds of pages. However, performance may vary depending on your device ram.' },
            { q: 'Can I combine pages from different PDFs?', a: 'Yes! You can upload multiple PDF files, and all their pages will appear as thumbnails in the grid. You can then mix and match them as you like.' }
          ].map(({ q, a }, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="font-black text-slate-900 text-sm mb-1">{q}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
        <div className="bg-white border-2 border-purple-500 rounded-2xl p-6 text-center text-slate-900 space-y-3 shadow-sm hover:shadow-xl transition-all duration-300">
          <p className="font-black">Start organizing your PDF pages</p>
          <a href="/tool/organize" className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-black text-sm transition-all">Open Organize PDF <ArrowRight size={14} /></a>
        </div>
      </div>
    </div></article>
  );
}
