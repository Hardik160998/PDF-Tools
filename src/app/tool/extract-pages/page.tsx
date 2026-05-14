"use client";

import dynamic from "next/dynamic";

const ExtractPages = dynamic(() => import("@/components/tools/ExtractPages"), {
  ssr: false,
});

export default function ExtractPagesPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 pt-10 sm:pt-16 pb-10">
        <ExtractPages id="extract-pages" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-16">
          {[
            { 
              title: "Selective Extraction", 
              desc: "Isolate exactly the pages you need. Choose specific ranges or select pages visually.",
              gradient: "linear-gradient(135deg,#f97316,#ea580c)"
            },
            { 
              title: "Instant Results", 
              desc: "Download your extracted pages as a new, high-quality PDF document immediately.",
              gradient: "linear-gradient(135deg,#f97316,#ea580c)"
            },
            { 
              title: "Privacy Guaranteed", 
              desc: "Your documents never leave your browser. All extraction is performed 100% locally.",
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
