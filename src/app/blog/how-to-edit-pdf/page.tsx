import { FileText, Clock, ArrowRight, CheckCircle2, ArrowLeft, Settings, Wand2 } from 'lucide-react';

export default function EditPdfPost() {
  return (
    <article className="min-h-screen">
      <div className="container mx-auto px-4 pt-10 pb-20 max-w-3xl">
        <a href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors font-bold mb-8">
          <ArrowLeft size={14} /> Back to Blog
        </a>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"><Wand2 size={22} /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 leading-tight mb-1">
              How to Edit PDF Online — Add Text, Images & Annotations
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Tutorial</span>
              <span className="flex items-center gap-1"><Clock size={11} /> 4 min read</span>
              <span>May 2, 2026</span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl mb-6">
          <img src="/img/word-pdf.png" alt="How to Edit PDF Online" className="w-full h-auto" />
        </div>

        <p className="text-lg text-slate-500 leading-relaxed mb-8">
          Need to fill out a form, add a signature, or correct a typo in a PDF? Our online PDF editor gives you the tools to modify your documents without needing expensive software.
        </p>

        <div className="prose prose-slate max-w-none space-y-6">
          
          {/* What you'll learn */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
            <p className="font-black text-indigo-800 text-sm mb-2">What you'll learn</p>
            <ul className="space-y-1">
              {[
                'How to add text and fill out interactive or non-interactive forms',
                'How to insert images, logos, or signatures into your PDF',
                'Using drawing tools and shapes for annotations',
              ].map(i => (
                <li key={i} className="flex items-center gap-2 text-sm text-indigo-700"><CheckCircle2 size={13} className="text-indigo-500 shrink-0" />{i}</li>
              ))}
            </ul>
          </div>

          <h2 className="text-xl font-black text-slate-900">Features & Settings Explained</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Our editor provides a complete toolkit for modifying your PDFs:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            {[
              { title: 'Add Text', desc: 'Click anywhere to add text. Customize font size, color, and style to match the document.' },
              { title: 'Insert Images', desc: 'Upload JPG or PNG files to add logos, stamps, or photos to your PDF.' },
              { title: 'Draw & Annotate', desc: 'Freehand drawing tool for circling important areas or adding a signature.' },
              { title: 'Whiteout Tool', desc: 'Cover up existing text or images with a white box to "erase" them.' }
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Settings size={14} className="text-indigo-500" />
                  <p className="font-black text-slate-900 text-sm">{title}</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-900">Step-by-Step: How to Edit a PDF</h2>
          {[
            { step: '1', title: 'Upload PDF', desc: 'Drag and drop your PDF file into the editor zone.' },
            { step: '2', title: 'Select Tool', desc: 'Choose Text, Image, or Draw from the top toolbar.' },
            { step: '3', title: 'Make Edits', desc: 'Click on the page to add content or fill out forms.' },
            { step: '4', title: 'Download Output', desc: 'Save your edited PDF to your device.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">{step}</div>
              <div><p className="font-black text-slate-900 text-sm">{title}</p><p className="text-sm text-slate-500 mt-0.5">{desc}</p></div>
            </div>
          ))}

          <h2 className="text-xl font-black text-slate-900">Common Use Cases</h2>
          <div className="space-y-3 my-4">
            {[
              { title: 'Filling Out Forms', desc: 'Fill out tax forms, applications, or surveys that are not interactive.' },
              { title: 'Signing Documents', desc: 'Draw your signature or upload an image of it to sign contracts.' },
              { title: 'Adding Notes', desc: 'Leave feedback or instructions on a document before sharing it with a team.' }
            ].map(({ title, desc }) => (
              <div key={title} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="font-black text-slate-900 text-sm mb-1">{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-900">How to Sign a PDF Document</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Signing contracts or agreements is one of the most common reasons people need to edit PDFs. Here is how to do it with our tool:
          </p>
          <div className="space-y-3 my-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <p className="font-black text-slate-900 text-sm mb-1">Option 1: Draw Your Signature</p>
              <p className="text-xs text-slate-500 leading-relaxed">Select the Draw tool from the toolbar. Use your mouse, trackpad, or touch screen to draw your signature directly on the document.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <p className="font-black text-slate-900 text-sm mb-1">Option 2: Upload an Image</p>
              <p className="text-xs text-slate-500 leading-relaxed">If you have a scanned image of your signature, select the Image tool and upload it. You can resize and position it perfectly on the signature line.</p>
            </div>
          </div>

          <h2 className="text-xl font-black text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-4 mb-6">
            {[
              { q: 'Can I edit the existing text?', a: 'Our tool allows you to add new text and cover up old text with the whiteout tool, but it does not allow direct editing of original text characters.' },
              { q: 'Is my data safe?', a: 'Yes. All edits are made locally in your browser. Your files are never uploaded to any server.' },
              { q: 'Does it support scanned PDFs?', a: 'Yes, you can add text and drawings on top of scanned pages.' }
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
              <p className="font-black text-slate-900">Ready to edit your PDF?</p>
              <p className="text-xs text-slate-500 mt-1">Add text and images instantly.</p>
            </div>
            <a href="/tool/edit-pdf" className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-sm transition-all">
              Open PDF Editor Tool <ArrowRight size={14} />
            </a>
          </div>

        </div>
      </div>
    </article>
  );
}
