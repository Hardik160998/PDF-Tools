import { Suspense } from "react";
import OrganizeTool from "@/components/tools/OrganizeTool";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function OrganizePage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 pt-10 sm:pt-16 pb-10">
        <Suspense fallback={<div className="h-[600px] bg-white dark:bg-slate-900 rounded-3xl animate-pulse" />}>
          <OrganizeTool id="organize" />
        </Suspense>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-16">
          {[
            { 
              title: "Visual Reordering", 
              desc: "Simply drag and drop pages to change their order. See exactly how your final PDF will look.",
              gradient: "linear-gradient(135deg,#f97316,#ea580c)"
            },
            { 
              title: "Multi-File Support", 
              desc: "Upload multiple PDFs and merge them into a single organized document in one step.",
              gradient: "linear-gradient(135deg,#f97316,#ea580c)"
            },
            { 
              title: "Local Processing", 
              desc: "All page manipulation happens in your browser. Your data stays 100% private.",
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
