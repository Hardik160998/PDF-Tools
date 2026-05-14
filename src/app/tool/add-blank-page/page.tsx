import { Suspense } from "react";
import AddBlankPage from "@/components/tools/AddBlankPage";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AddBlankPagePage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 pt-10 sm:pt-16 pb-10">
        <Suspense fallback={<div className="h-[600px] bg-white dark:bg-slate-900 rounded-3xl animate-pulse" />}>
          <AddBlankPage id="add-blank-page" />
        </Suspense>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-16">
          {[
            { 
              title: "Template Injection", 
              desc: "Insert high-quality blank pages at the start, end, or after specific pages in your document.",
              gradient: "linear-gradient(135deg,#6366f1,#4f46e5)"
            },
            { 
              title: "Smart Sizing", 
              desc: "Automatically match the dimensions of your existing PDF pages or choose from standard sizes like A4.",
              gradient: "linear-gradient(135deg,#6366f1,#4f46e5)"
            },
            { 
              title: "Private Processing", 
              desc: "Page insertion happens 100% locally in your browser. Your documents never touch our servers.",
              gradient: "linear-gradient(135deg,#22c55e,#15803d)"
            }
          ].map((feat, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
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
