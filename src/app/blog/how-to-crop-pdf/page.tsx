import { Scissors, Clock, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function CropPDFPost() {
  return (
    <article className="min-h-screen">
      <div className="container mx-auto px-4 pt-10 pb-20 max-w-3xl">
        <a href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors font-bold mb-8">
          <ArrowLeft size={14} /> Back to Blog
        </a>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"><Scissors size={22} /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 leading-tight mb-1">
              How to Crop PDF Pages Online — Free & Easy
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white text-red-600 border-2 border-red-500 px-2 py-0.5 rounded-full shadow-sm">Special</span>
              <span className="flex items-center gap-1"><Clock size={11} /> 3 min read</span>
              <span>Apr 22, 2026</span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl mb-6">
          <img src="/img/word-pdf.png" alt="How to Crop PDF Pages" className="w-full h-auto" />
        </div>

        <p className="text-lg text-slate-500 leading-relaxed mb-8">
          Need to trim margins, remove white space, or crop specific areas of your PDF pages? SmartPDFs Plus makes it easy and instant — directly in your browser.
        </p>

        <div className="prose prose-slate max-w-none space-y-6">
          
          {/* What you'll learn */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
            <p className="font-black text-indigo-800 text-sm mb-2">What you'll learn</p>
            <ul className="space-y-1">
              {[
                'How to crop single or all pages in a PDF',
                'How to remove white margins for better reading',
                'Tips for precise cropping and aspect ratios',
              ].map(i => (
                <li key={i} className="flex items-center gap-2 text-sm text-indigo-700"><CheckCircle2 size={13} className="text-indigo-500 shrink-0" />{i}</li>
              ))}
            </ul>
          </div>

          <h2 className="text-xl font-black text-slate-900">Why Crop Your PDF?</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Cropping a PDF is useful for many reasons. You might want to remove unnecessary white space around the text to make it more readable on mobile devices. Or you may need to extract a specific chart, table, or image from a page.
          </p>
          <p className="text-slate-600 leading-relaxed text-sm">
            Our tool allows you to visually select the area you want to keep. You can apply the crop to just the current page or to all pages in the document simultaneously.
          </p>

          <h2 className="text-xl font-black text-slate-900">Common Use Cases for PDF Cropping</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            {[
              { title: 'Mobile Reading', desc: 'Remove large white margins to make text bigger and easier to read on small screens.' },
              { title: 'Extracting Content', desc: 'Isolate specific charts, tables, or paragraphs for use in other documents.' },
              { title: 'Standardizing Sizes', desc: 'Crop pages to specific dimensions like A4, Letter, or custom ID card sizes.' },
              { title: 'Hiding Sensitive Info', desc: 'Crop out headers, footers, or margins that contain sensitive or unnecessary data.' }
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <p className="font-black text-slate-900 text-sm mb-1">{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-900">Pro Tips for Best Results</h2>
          <ul className="space-y-2 my-4">
            {[
              'Use the zoom slider for pixel-perfect edge selection.',
              'Preview all pages if you apply the crop to the entire document, as margins may vary.',
              'For e-commerce labels (Flipkart, Amazon), use our specialized cropper tools for better automation.',
              'Remember that cropping hides content but may not delete it permanently depending on the PDF structure.'
            ].map(i => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 size={13} className="text-indigo-500 shrink-0" />{i}</li>
            ))}
          </ul>

          <h2 className="text-xl font-black text-slate-900">Step-by-Step: How to Crop a PDF</h2>
          {[
            { step: '1', title: 'Upload Your PDF', desc: 'Click the upload area or drag and drop your PDF file into the tool.' },
            { step: '2', title: 'Select the Crop Area', desc: 'Use the visual cropper to drag and resize the bounding box over the area you want to keep.' },
            { step: '3', title: 'Apply to Pages', desc: 'Choose whether to apply the crop to the current page only or to all pages in the document.' },
            { step: '4', title: 'Download Cropped PDF', desc: 'Click the "Crop PDF" button to process your file and download the result.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">{step}</div>
              <div><p className="font-black text-slate-900 text-sm">{title}</p><p className="text-sm text-slate-500 mt-0.5">{desc}</p></div>
            </div>
          ))}

          <h2 className="text-xl font-black text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-4 mb-6">
            {[
              { q: 'Does cropping reduce file size?', a: 'Yes. By removing content and margins, the file size usually decreases slightly.' },
              { q: 'Can I crop multiple pages differently?', a: 'Currently, the tool applies the same crop box to all selected pages. For different crops, process pages individually.' },
              { q: 'Is my data safe?', a: 'Yes. All cropping is done locally in your browser. No files are uploaded to our servers.' }
            ].map(({ q, a }, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="font-black text-slate-900 text-sm mb-1">{q}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-white border-2 border-orange-500 rounded-2xl p-6 text-center text-slate-900 space-y-3 mb-6 shadow-sm hover:shadow-xl transition-all duration-300">
            <div>
              <p className="font-black text-slate-900">Ready to crop your PDFs?</p>
              <p className="text-xs text-slate-500 mt-1">Trim margins and remove white space easily.</p>
            </div>
            <a href="/tool/crop-pdf" className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-sm transition-all">
              Open Crop PDF Tool <ArrowRight size={14} />
            </a>
          </div>

        </div>
      </div>
    </article>
  );
}
