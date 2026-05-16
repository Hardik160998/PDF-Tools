import { Image as ImageIcon, Clock, ArrowRight, CheckCircle2, ArrowLeft, Settings } from 'lucide-react';

export default function ImageConversionGuidePost() {
  return (
    <article className="min-h-screen">
      <div className="container mx-auto px-4 pt-10 pb-20 max-w-3xl">
        <a href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors font-bold mb-8">
          <ArrowLeft size={14} /> Back to Blog
        </a>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"><ImageIcon size={22} /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 leading-tight mb-1">
              The Ultimate Guide to Image Conversion — Convert Any Format
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Guide</span>
              <span className="flex items-center gap-1"><Clock size={11} /> 5 min read</span>
              <span>Apr 30, 2026</span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl mb-6">
          <img src="/img/word-pdf.png" alt="Ultimate Image Conversion Guide" className="w-full h-auto" />
        </div>

        <p className="text-lg text-slate-500 leading-relaxed mb-8">
          Struggling with incompatible image formats? Whether you need to convert HEIC to JPG, PNG to WebP, or resize images for the web, our all-in-one image converter has you covered.
        </p>

        <div className="prose prose-slate max-w-none space-y-6">
          
          {/* What you'll learn */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
            <p className="font-black text-emerald-800 text-sm mb-2">What you'll learn</p>
            <ul className="space-y-1">
              {[
                'How to convert between popular formats (JPG, PNG, WebP, HEIC)',
                'How to use batch conversion to save time',
                'Understanding quality and compression settings',
              ].map(i => (
                <li key={i} className="flex items-center gap-2 text-sm text-emerald-700"><CheckCircle2 size={13} className="text-emerald-500 shrink-0" />{i}</li>
              ))}
            </ul>
          </div>

          <h2 className="text-xl font-black text-slate-900">Supported Formats</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Our tool supports a wide range of image formats to ensure you can always get the file type you need:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            {['JPG / JPEG', 'PNG', 'WebP', 'HEIC'].map(format => (
              <div key={format} className="bg-white p-3 rounded-xl border border-slate-100 text-center shadow-sm">
                <p className="font-black text-slate-900 text-sm">{format}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-900">Features & Settings Explained</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Our image converter is packed with features to give you full control over your files:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            {[
              { title: 'Batch Processing', desc: 'Upload dozens of images at once and convert them all with a single click.' },
              { title: 'Quality Control', desc: 'Adjust the compression level to balance file size and image quality.' },
              { title: 'Auto-Resizing', desc: 'Optionally resize images to standard dimensions (HD, Full HD) during conversion.' },
              { title: 'Format Presets', desc: 'Quickly select optimized settings for web use or print.' }
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Settings size={14} className="text-emerald-500" />
                  <p className="font-black text-slate-900 text-sm">{title}</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-900">Step-by-Step: How to Convert Images</h2>
          {[
            { step: '1', title: 'Upload Images', desc: 'Drag and drop your images or click to select files from your device.' },
            { step: '2', title: 'Select Output Format', desc: 'Choose the target format (e.g., WebP for web optimization).' },
            { step: '3', title: 'Adjust Settings', desc: 'Fine-tune quality sliders or dimensions if needed.' },
            { step: '4', title: 'Download Files', desc: 'Click "Convert" and download your processed images individually or as a ZIP.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">{step}</div>
              <div><p className="font-black text-slate-900 text-sm">{title}</p><p className="text-sm text-slate-500 mt-0.5">{desc}</p></div>
            </div>
          ))}

          <h2 className="text-xl font-black text-slate-900">Common Use Cases</h2>
          <div className="space-y-3 my-4">
            {[
              { title: 'Converting HEIC to JPG', desc: 'Apple devices take photos in HEIC format. Convert them to JPG to share with non-Apple users.' },
              { title: 'Converting PNG to WebP', desc: 'WebP offers better compression than PNG. Convert your website assets to speed up load times.' },
              { title: 'Batch Resizing', desc: 'Quickly shrink a folder of high-res photos before uploading them to social media.' }
            ].map(({ title, desc }) => (
              <div key={title} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="font-black text-slate-900 text-sm mb-1">{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-900">What is HEIC and Why Convert It?</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            If you use an iPhone or iPad, your photos are likely saved in **HEIC** (High Efficiency Image Container) format. Apple uses this format because it takes up about half the space of a JPEG without losing quality.
          </p>
          <p className="text-slate-600 leading-relaxed text-sm">
            However, the problem is compatibility. Many Windows computers, older devices, and websites cannot open HEIC files. Our tool allows you to convert HEIC files to universally compatible JPG files in seconds, so you can share them anywhere.
          </p>

          <h2 className="text-xl font-black text-slate-900">How to Choose the Right Format</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Not sure which format to choose? Here is a quick guide to help you decide:
          </p>
          <div className="space-y-3 my-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <p className="font-black text-slate-900 text-sm mb-1">JPEG / JPG</p>
              <p className="text-xs text-slate-500 leading-relaxed">Best for photographs and complex images. It offers good compression but loses some detail (lossy).</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <p className="font-black text-slate-900 text-sm mb-1">PNG</p>
              <p className="text-xs text-slate-500 leading-relaxed">Best for graphics, logos, and screenshots that require transparency or sharp edges. It is lossless (no quality loss) but files are larger.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <p className="font-black text-slate-900 text-sm mb-1">WebP</p>
              <p className="text-xs text-slate-500 leading-relaxed">The modern standard for the web. It provides superior compression for both photos and graphics, making your website load faster.</p>
            </div>
          </div>

          <h2 className="text-xl font-black text-slate-900">Pro Tips for Image Conversion</h2>
          <ul className="space-y-2 my-4 mb-6">
            {[
              'Always keep your original high-resolution files in case you need to make changes later.',
              'Use WebP for website images to improve page load speed and SEO.',
              'If you need to edit an image later, convert it to PNG first to avoid generation loss.',
              'Use batch processing to convert entire folders at once and save time.'
            ].map(i => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 size={13} className="text-emerald-500 shrink-0" />{i}</li>
            ))}
          </ul>

          <h2 className="text-xl font-black text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-4 mb-6">
            {[
              { q: 'Is there a file size limit?', a: 'No strict limits, but very large files may take longer to process depending on your device.' },
              { q: 'Will I lose image quality?', a: 'Only if you lower the quality setting. At 100%, conversion is visually lossless.' },
              { q: 'Are my images stored on your server?', a: 'No. All processing happens locally in your browser. Your files never leave your device.' }
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
              <p className="font-black text-slate-900">Ready to convert your images?</p>
              <p className="text-xs text-slate-500 mt-1">Try our fast, browser-based converter.</p>
            </div>
            <a href="/tool/image-converter" className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-sm transition-all">
              Open Image Converter <ArrowRight size={14} />
            </a>
          </div>

        </div>
      </div>
    </article>
  );
}
