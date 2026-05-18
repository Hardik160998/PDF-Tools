import { Scissors, Clock, ArrowRight, CheckCircle2, ArrowLeft, Settings } from 'lucide-react';

export default function AmazonCropPost() {
  return (
    <article className="min-h-screen">
      <div className="container mx-auto px-4 pt-10 pb-20 max-w-3xl">
        <a href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors font-bold mb-8">
          <ArrowLeft size={14} /> Back to Blog
        </a>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"><Scissors size={22} /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 leading-tight mb-1">
              How to Crop Amazon Labels for Thermal Printing
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white text-red-600 border-2 border-red-500 px-2 py-0.5 rounded-full shadow-sm">Ecommerce</span>
              <span className="flex items-center gap-1"><Clock size={11} /> 4 min read</span>
              <span>Apr 28, 2026</span>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl mb-6 shadow-2xl">
          <img src="/img/word-pdf.png" alt="How to Crop Amazon Labels" className="w-full h-auto" />
        </div>

        <p className="text-lg text-slate-500 leading-relaxed mb-8">
          Amazon sellers often receive shipping labels in full-page PDF formats. Our tool isolates each label and prepares it perfectly for standard 4x6 thermal printers.
        </p>

        <div className="prose prose-slate max-w-none space-y-6">
          
          {/* What you'll learn */}
          <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5">
            <p className="font-black text-yellow-800 text-sm mb-2">What you'll learn</p>
            <ul className="space-y-1">
              {[
                'How to extract Amazon labels from full-page PDFs',
                'How to optimize labels for 4x6 thermal printers',
                'Understanding advanced sorting and layout settings',
              ].map(i => (
                <li key={i} className="flex items-center gap-2 text-sm text-yellow-700"><CheckCircle2 size={13} className="text-yellow-500 shrink-0" />{i}</li>
              ))}
            </ul>
          </div>

          <h2 className="text-xl font-black text-slate-900">Why Crop Amazon Labels?</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Amazon provides labels that often include extra white space or are arranged in a grid on an A4 sheet. Printing them directly on a thermal printer results in tiny, unreadable barcodes. Our tool extracts the exact label area and scales it for perfect printing.
          </p>

          <h2 className="text-xl font-black text-slate-900">Benefits of Cropping Amazon Labels</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            {[
              { title: 'Save Thermal Paper', desc: 'Stop wasting expensive sticker paper on white margins or full-page prints.' },
              { title: 'Super Clear Barcodes', desc: 'Scaling the label to fit the paper ensures the barcode is sharp and easily scannable.' },
              { title: 'Professional Packaging', desc: 'Cleanly cropped labels look professional and build trust with customers.' },
              { title: 'Faster Processing', desc: 'No manual cutting required. Just print, peel, and stick to the package!' }
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <p className="font-black text-slate-900 text-sm mb-1">{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-900">Features & Settings Explained</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Configure the tool to match your exact warehouse workflow:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            {[
              { title: 'Auto-Detection', desc: 'Automatically finds the label boundaries on the page without manual selection.' },
              { title: 'Custom Margins', desc: 'Add or remove padding around the cropped label to fit your printer perfectly.' },
              { title: 'Contrast Boost', desc: 'Enhance the barcode and text contrast for better scannability at the warehouse.' },
              { title: 'Layout Config', desc: 'Choose between 1x1 or 2x2 grid for printing multiple labels on one page.' }
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Settings size={14} className="text-yellow-500" />
                  <p className="font-black text-slate-900 text-sm">{title}</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-900">How Sorting Saves You Time</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Optimize your picking and packing process with these sorting options:
          </p>
          <div className="space-y-3 my-4 mb-6">
            {[
              { title: 'Sort by Quantity', desc: 'Group orders by the number of items. Pack all single-item orders first for maximum speed.' },
              { title: 'Sort by SKU ID', desc: 'Group by unique product ID. Perfect for batch picking items from the shelves.' },
              { title: 'Sort by Courier Wise', desc: 'Group by delivery partner (Delhivery, Ecom Express, etc.). Hand over packages faster when pickup arrives.' }
            ].map(({ title, desc }) => (
              <div key={title} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="font-black text-slate-900 text-sm mb-1">{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-900">Step-by-Step: How to Crop Amazon Labels</h2>
          {[
            { step: '1', title: 'Upload PDF', desc: 'Drag and drop your Amazon order PDF into the upload zone.' },
            { step: '2', title: 'Configure Settings', desc: 'Select your label size and adjust margins if needed.' },
            { step: '3', title: 'Click "Process Labels"', desc: 'The tool will isolate the labels and ignore the invoice content.' },
            { step: '4', title: 'Download Output', desc: 'Save the generated PDF containing only the cropped labels.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">{step}</div>
              <div><p className="font-black text-slate-900 text-sm">{title}</p><p className="text-sm text-slate-500 mt-0.5">{desc}</p></div>
            </div>
          ))}

          <h2 className="text-xl font-black text-slate-900">Pro Tips for Amazon Sellers</h2>
          <ul className="space-y-2 my-4 mb-6">
            {[
              'Use a high-quality thermal printer (like TSC or Xprinter) for clear barcodes.',
              'Always verify that the barcode is readable after boosting contrast.',
              'Use the SKU sorting feature to organize your packing workflow efficiently.',
              'Keep the generated invoices safely; they need to be put inside the package.'
            ].map(i => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 size={13} className="text-yellow-500 shrink-0" />{i}</li>
            ))}
          </ul>

          <h2 className="text-xl font-black text-slate-900">Recommended Printer Settings</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            To ensure your cropped labels print perfectly on your thermal printer, use these settings in your print dialog:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 mb-6">
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
              <p className="font-black text-slate-900 text-xs mb-0.5">Paper Size</p>
              <p className="text-xs text-slate-500 leading-relaxed">Select 4x6 inches or 100x150 mm for standard thermal labels.</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
              <p className="font-black text-slate-900 text-xs mb-0.5">Scale</p>
              <p className="text-xs text-slate-500 leading-relaxed">Set scale to "Fit to Printable Area" or 100% to avoid cutting off edges.</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
              <p className="font-black text-slate-900 text-xs mb-0.5">Darkness / Speed</p>
              <p className="text-xs text-slate-500 leading-relaxed">Increase darkness slightly if the barcode is too light to scan.</p>
            </div>
          </div>

          <h2 className="text-xl font-black text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-4 mb-6">
            {[
              { q: 'Is my seller data safe?', a: 'Yes. All processing is done locally in your browser. Your invoice data is never uploaded to any server.' },
              { q: 'Does it support bulk files?', a: 'Yes, you can upload PDFs containing hundreds of orders at once.' },
              { q: 'Can I print on thermal printers?', a: 'Yes, the output is optimized for 4x6 inch thermal labels.' }
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
              <p className="font-black text-slate-900">Ready to crop your Amazon labels?</p>
              <p className="text-xs text-slate-500 mt-1">Extract labels instantly.</p>
            </div>
            <a href="/tool/amazon-cropper" className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-sm transition-all">
              Open Amazon Cropper Tool <ArrowRight size={14} />
            </a>
          </div>

        </div>
      </div>
    </article>
  );
}
