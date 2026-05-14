"use client";

import dynamic from "next/dynamic";

const OptimizePdf = dynamic(() => import("@/components/tools/OptimizePdf"), {
  ssr: false,
});

export default function OptimizePage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 pt-10 sm:pt-16 pb-10">
        <OptimizePdf id="optimize-pdf" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-16">
          {[
            { 
              title: "Max Efficiency", 
              desc: "Achieve up to 90% file size reduction by re-encoding images at optimized quality levels.",
              gradient: "linear-gradient(135deg,#10b981,#059669)"
            },
            { 
              title: "Quality Control", 
              desc: "Choose between Low, Medium, and High compression to find the perfect balance for your needs.",
              gradient: "linear-gradient(135deg,#10b981,#059669)"
            },
            { 
              title: "Safe Processing", 
              desc: "Processing happens locally. Your documents never touch a server, ensuring 100% privacy.",
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
