import Link from "next/link";
import {
  Combine,
  SplitSquareHorizontal,
  FileText,
  ImageIcon,
  Lock,
  Unlock,
  Zap,
} from "lucide-react";

const RELATED = [
  {
    id: "merge",
    title: "Merge PDF",
    description: "Combine multiple PDF files into one single document instantly.",
    icon: Combine,
    gradient: "linear-gradient(135deg, #f97316, #ea580c)",
    shadow: "rgba(249,115,22,0.3)",
    tag: "Organize",
  },
  {
    id: "split",
    title: "Split PDF",
    description: "Split a PDF into individual pages or custom page ranges.",
    icon: SplitSquareHorizontal,
    gradient: "linear-gradient(135deg, #f97316, #c2410c)",
    shadow: "rgba(249,115,22,0.3)",
    tag: "Organize",
  },
  {
    id: "compress",
    title: "Compress PDF",
    description: "Reduce PDF file size without losing visible quality.",
    icon: Zap,
    gradient: "linear-gradient(135deg, #22c55e, #15803d)",
    shadow: "rgba(34,197,94,0.3)",
    tag: "Optimize",
  },
  {
    id: "pdf-to-word",
    title: "PDF to Word",
    description: "Convert PDF files to editable Word documents online for free.",
    icon: FileText,
    gradient: "linear-gradient(135deg, #3182ce, #1e3a8a)",
    shadow: "rgba(49,130,206,0.3)",
    tag: "Convert",
  },
  {
    id: "pdf-to-jpg",
    title: "PDF to JPG",
    description: "Convert every PDF page into a high-quality JPG image.",
    icon: ImageIcon,
    gradient: "linear-gradient(135deg, #eab308, #a16207)",
    shadow: "rgba(234,179,8,0.3)",
    tag: "Convert",
  },
  {
    id: "protect",
    title: "Protect PDF",
    description: "Encrypt your PDF with a password to keep it secure.",
    icon: Lock,
    gradient: "linear-gradient(135deg, #ef4444, #b91c1c)",
    shadow: "rgba(239,68,68,0.3)",
    tag: "Security",
  },
  {
    id: "unlock",
    title: "Unlock PDF",
    description: "Remove password protection from a PDF instantly.",
    icon: Unlock,
    gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    shadow: "rgba(139,92,246,0.3)",
    tag: "Security",
  },
];

export default function RelatedTools() {
  return (
    <section className="mb-20 text-left">
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 text-center">
        Explore More PDF Tools
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {RELATED.map((t) => (
          <Link
            key={t.id}
            href={`/tool/${t.id}`}
            title={`Use the ${t.title} tool`}
            aria-label={`Open the ${t.title} tool to ${t.description.toLowerCase()}`}
            className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 text-left focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
          >
            <div className="flex items-start justify-between">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                style={{
                  background: t.gradient,
                  boxShadow: `0 8px 20px -4px ${t.shadow}`,
                }}
              >
                <t.icon size={26} aria-hidden="true" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-700">
                {t.tag}
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-orange-500 transition-colors">
                {t.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {t.description}
              </p>
            </div>
            <div className="mt-auto pt-2 text-xs font-bold text-orange-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Open tool <span aria-hidden="true">&#8594;</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
