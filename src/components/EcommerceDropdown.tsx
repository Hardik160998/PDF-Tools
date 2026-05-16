"use client";

import { useState, useRef } from "react";
import { ChevronDown, ShoppingBag } from "lucide-react";

const ECOMMERCE_TOOLS = [
  {
    href: "/tool/meesho-cropper",
    label: "Meesho Label with Invoice Cropper",
    desc: "Remove invoice section from Meesho shipping labels",
    icon: ShoppingBag,
    gradient: "linear-gradient(135deg, #f26522, #f59e0b)",
  },
  {
    href: "/tool/meshocrop",
    label: "Meesho Crop Label (without invoice)",
    desc: "Crop to keep shipping address & barcodes only",
    icon: ShoppingBag,
    gradient: "linear-gradient(135deg, #f26522, #f59e0b)",
  },
  {
    href: "/tool/flipkart-cropper",
    label: "Flipkart Label Cropper",
    desc: "Smart OCR crop for Flipkart / E-kart shipping labels",
    icon: ShoppingBag,
    gradient: "linear-gradient(135deg, #F7941D, #f59e0b)",
  },
  {
    href: "/tool/amazon-cropper",
    label: "Amazon Label Cropper",
    desc: "Auto-remove invoice pages and extract full-height labels",
    icon: ShoppingBag,
    gradient: "linear-gradient(135deg, #FF9900, #f59e0b)",
  },
  {
    href: "/tool/snapdeal-cropper",
    label: "Snapdeal Label Cropper",
    desc: "Smart border detection to crop Snapdeal shipping labels",
    icon: ShoppingBag,
    gradient: "linear-gradient(135deg, #E40046, #f59e0b)",
  },
];

export default function EcommerceDropdown() {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setOpen(true); };
  const hide = () => { timeoutRef.current = setTimeout(() => setOpen(false), 120); };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button className={`flex items-center gap-1 text-[15px] font-semibold transition-colors uppercase tracking-wide whitespace-nowrap ${open ? "text-red-500" : "text-slate-500 dark:text-slate-400 hover:text-red-500"}`}>
        ECOMMERCE
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="convert-dropdown-panel !z-[9999] !bg-white dark:!bg-slate-900 !shadow-2xl !border !border-slate-200 dark:!border-slate-700" onMouseEnter={show} onMouseLeave={hide}>
          <div className="convert-dropdown-arrow !bg-white dark:!bg-slate-900 !border-slate-200 dark:!border-slate-700" />
          <div className="convert-dropdown-label" style={{ color: '#f26522', borderColor: '#f26522' }}>ECOMMERCE TOOLS</div>
          {ECOMMERCE_TOOLS.map(({ href, label, icon: Icon, gradient }) => (
            <a key={href} href={href} className="convert-dropdown-item wrap-text hover:!bg-slate-50 dark:hover:!bg-slate-800">
              <span className="convert-dropdown-icon shrink-0 mt-0.5" style={{ background: gradient }}>
                <Icon size={18} />
              </span>
              <span className="text-[0.85rem] font-bold text-slate-800 dark:text-white leading-snug">{label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
