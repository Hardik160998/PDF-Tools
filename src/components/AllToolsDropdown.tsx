"use client";

import React, { useState, useRef } from "react";
import { ChevronDown, Combine, Scissors, Zap, LifeBuoy, Type, FileJson, ImageIcon, FileText, Presentation, FileSpreadsheet, Globe, Stamp, FileDigit, Settings, Unlock, Lock, Wand2, FileSymlink, PenLine, Layers, GitCompare, EyeOff, Bookmark, Trash2, FilePlus, ScanText, Crop, ShoppingBag } from "lucide-react";

const CATEGORIES = [
  {
    name: "Organize", color: "#f26522", gradient: "linear-gradient(135deg, #f26522, #c2410c)",
    tools: [
      { id: "organize",       label: "Organize PDF",   icon: FileSymlink },
      { id: "compare-pdf",    label: "Compare PDF",    icon: GitCompare },
      { id: "extract-pages",  label: "Extract Pages",  icon: Layers },
      { id: "delete-pages",   label: "Delete Pages",   icon: Trash2 },
      { id: "add-blank-page", label: "Add Blank Page", icon: FilePlus },
      { id: "merge",          label: "Merge PDF",      icon: Combine },
      { id: "split",          label: "Split PDF",      icon: Scissors },
    ],
  },
  {
    name: "Optimize", color: "#22c55e", gradient: "linear-gradient(135deg, #22c55e, #15803d)",
    tools: [
      { id: "compress",     label: "Compress PDF", icon: Zap },
      { id: "repair-pdf",   label: "Repair PDF",   icon: LifeBuoy },
      { id: "optimize-pdf", label: "Optimize PDF", icon: Zap },
    ],
  },
  {
    name: "Convert", color: "#3182ce", gradient: "linear-gradient(135deg, #3182ce, #1e3a8a)",
    // Split into 2 sub-columns via CSS
    tools: [
      { id: "extract-text",   label: "PDF to Text",       icon: Type },
      { id: "ocr-pdf",        label: "OCR PDF",           icon: ScanText },
      { id: "pdf-to-xml",     label: "PDF to XML",        icon: FileJson },
      { id: "pdf-to-jpg",     label: "PDF to JPG",        icon: ImageIcon },
      { id: "jpg-to-pdf",     label: "JPG to PDF",        icon: ImageIcon },
      { id: "word-to-pdf",    label: "Word to PDF",       icon: FileText },
      { id: "pdf-to-word",    label: "PDF to Word",       icon: FileText },
      { id: "docx-to-pdf",    label: "DOCX to PDF",       icon: FileText },
      { id: "pdf-to-docx",    label: "PDF to DOCX",       icon: FileText },
      { id: "ppt-to-pdf",     label: "PPT to PDF",        icon: Presentation },
      { id: "pdf-to-ppt",     label: "PDF to PPT",        icon: Presentation },
      { id: "excel-to-pdf",   label: "Excel to PDF",      icon: FileSpreadsheet },
      { id: "pdf-to-excel",   label: "PDF to Excel",      icon: FileSpreadsheet },
      { id: "html-to-pdf",    label: "HTML to PDF",       icon: Globe },
      { id: "webpage-to-pdf", label: "Webpage to PDF",    icon: Globe },
    ],
  },
  {
    name: "Edit", color: "#E8465D", gradient: "linear-gradient(135deg, #E8465D, #843286)",
    tools: [
      { id: "bookmark-pdf", label: "Bookmark PDF",  icon: Bookmark, href: "/tool/bookmark-pdf" },
      { id: "watermark",    label: "Watermark",     icon: Stamp,    href: "/tool/watermark" },
      { id: "page-numbers", label: "Page Numbers",  icon: FileDigit,href: "/tool/page-numbers" },
      { id: "metadata",     label: "Edit Metadata", icon: Settings, href: "/tool/metadata" },
      { id: "flatten-pdf",  label: "Flatten PDF",   icon: Layers },
      { id: "remove-ocr",   label: "Remove OCR",    icon: EyeOff },
      { id: "esign",        label: "E-Sign PDF",    icon: PenLine,  href: "/esign" },
      { id: "edit-pdf",     label: "Edit PDF",      icon: PenLine,  href: "/edit" },
    ],
  },
  {
    name: "Security", color: "#e53e3e", gradient: "linear-gradient(135deg, #e53e3e, #7f1d1d)",
    tools: [
      { id: "redact-pdf", label: "Redact PDF",  icon: EyeOff },
      { id: "unlock",     label: "Unlock PDF",  icon: Unlock },
      { id: "protect",    label: "Protect PDF", icon: Lock },
    ],
  },
  {
    name: "Image Convert", color: "#06b6d4", gradient: "linear-gradient(135deg, #06b6d4, #0e7490)",
    tools: [
      { id: "jpg-to-png",   label: "JPG to PNG",   icon: ImageIcon },
      { id: "png-to-jpg",   label: "PNG to JPG",   icon: ImageIcon },
      { id: "jpg-to-webp",  label: "JPG to WebP",  icon: ImageIcon },
      { id: "webp-to-jpg",  label: "WebP to JPG",  icon: ImageIcon },
      { id: "png-to-webp",  label: "PNG to WebP",  icon: ImageIcon },
      { id: "webp-to-png",  label: "WebP to PNG",  icon: ImageIcon },
      { id: "jpg-to-avif",  label: "JPG to AVIF",  icon: ImageIcon },
      { id: "avif-to-jpg",  label: "AVIF to JPG",  icon: ImageIcon },
      { id: "png-to-avif",  label: "PNG to AVIF",  icon: ImageIcon },
      { id: "avif-to-png",  label: "AVIF to PNG",  icon: ImageIcon },
      { id: "webp-to-avif", label: "WebP to AVIF", icon: ImageIcon },
      { id: "avif-to-webp", label: "AVIF to WebP", icon: ImageIcon },
    ],
  },
  {
    name: "Special & Ecommerce", color: "#ef4444", gradient: "linear-gradient(135deg, #ef4444, #991b1b)",
    tools: [
      { id: "aadhar-crop",    label: "Aadhar Cropper",   icon: Wand2 },
      { id: "crop-pdf",       label: "Crop PDF",          icon: Crop },
      { id: "meesho-cropper",   label: "Meesho Label with Invoice Crop",      icon: ShoppingBag },
      { id: "meshocrop",         label: "Meesho Crop Label (without invoice)", icon: ShoppingBag },
      { id: "flipkart-cropper",  label: "Flipkart Label Cropper",             icon: ShoppingBag },
    ],
  },
] as const;

// Categories with many tools get 2 sub-columns
const WIDE_CATS = new Set(["Convert", "Image Convert"]);
const WRAP_CATS = new Set(["Special & Ecommerce"]);

export default function AllToolsDropdown() {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setOpen(true); };
  const hide = () => { timeoutRef.current = setTimeout(() => setOpen(false), 120); };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button className={`flex items-center gap-1 font-semibold transition-colors uppercase tracking-wide whitespace-nowrap ${open ? "text-red-500" : "text-slate-500 dark:text-slate-400 hover:text-red-500"}`}>
        ALL PDF TOOLS
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div onMouseEnter={show} onMouseLeave={hide} className="all-tools-dropdown">
          <div className="all-tools-row">
            {CATEGORIES.map((cat) => (
              <div key={cat.name} className={`all-tools-col${WIDE_CATS.has(cat.name) ? " all-tools-col--wide" : ""}${WRAP_CATS.has(cat.name) ? " all-tools-col--wrap" : ""}`}>
                {/* Category label */}
                <div className="all-tools-cat-label" style={{ color: cat.color }}>
                  {cat.name}
                </div>
                {/* Tools list — wide cats use 2-column grid */}
                <div className={WIDE_CATS.has(cat.name) ? "all-tools-grid2" : ""}>
                  {cat.tools.map(({ id, label, icon: Icon, href }: any) => (
                    <a key={id} href={href ?? `/tool/${id}`} className="all-tools-item">
                      <span className="all-tools-icon" style={{ background: cat.gradient }}>
                        <Icon size={12} />
                      </span>
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
