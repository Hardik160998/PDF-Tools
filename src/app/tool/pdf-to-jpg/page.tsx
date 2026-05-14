"use client";

import ImageConverter from "@/components/tools/ImageConverter";

export default function PdfToJpgPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 pt-10 sm:pt-16 pb-10">
        <ImageConverter id="pdf-to-jpg" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-16">
          {[
            { 
              title: "Pixel Perfect", 
              desc: "Render PDF pages into high-resolution JPG images with crisp text and vibrant colors.",
              gradient: "linear-gradient(135deg,#facc15,#eab308)"
            },
            { 
              title: "Batch Export", 
              desc: "Convert every page of your document in one go and download them as a clean ZIP archive.",
              gradient: "linear-gradient(135deg,#facc15,#eab308)"
            },
            { 
              title: "Private Rendering", 
              desc: "All image generation occurs in your browser sandbox. Your data never leaves your device.",
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
