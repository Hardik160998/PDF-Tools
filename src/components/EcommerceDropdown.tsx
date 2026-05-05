"use client";

import { useState, useRef } from "react";
import { ChevronDown, ShoppingBag } from "lucide-react";

const ECOMMERCE_TOOLS = [
  {
    href: "/tool/meesho-cropper",
    label: "Meesho Label Cropper",
    desc: "Remove invoice section from Meesho shipping labels",
    icon: ShoppingBag,
    gradient: "linear-gradient(135deg, #f26522, #f59e0b)",
  },
];

export default function EcommerceDropdown() {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setOpen(true); };
  const hide = () => { timeoutRef.current = setTimeout(() => setOpen(false), 120); };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button className="flex items-center gap-1 text-xs font-black text-slate-700 dark:text-slate-300 hover:text-red-500 transition-colors uppercase tracking-tight">
        ECOMMERCE
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#f26522] px-2 pb-2">Ecommerce Tools</div>
          {ECOMMERCE_TOOLS.map(({ href, label, desc, icon: Icon, gradient }) => (
            <a
              key={href}
              href={href}
              className="flex items-start gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
            >
              <span className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow" style={{ background: gradient }}>
                <Icon size={15} />
              </span>
              <div>
                <div className="text-sm font-black text-slate-900 dark:text-white group-hover:text-[#f26522] transition-colors">{label}</div>
                <div className="text-[11px] text-slate-400 leading-snug">{desc}</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
