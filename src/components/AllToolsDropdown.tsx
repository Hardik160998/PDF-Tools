"use client";

import { useState, useRef } from "react";
import { ChevronDown, Combine, Scissors, Zap, LifeBuoy, Type, FileJson, ImageIcon, FileText, Presentation, FileSpreadsheet, Globe, Stamp, FileDigit, Settings, Unlock, Lock, Wand2, FileSymlink } from "lucide-react";

const CATEGORIES = [
  {
    name: "Organize",
    color: "#f26522",
    gradient: "linear-gradient(135deg, #f26522, #c2410c)",
    tools: [
      { id: "organize", label: "Organize PDF", icon: FileSymlink },
      { id: "merge",    label: "Merge PDF",    icon: Combine },
      { id: "split",    label: "Split PDF",    icon: Scissors },
    ],
  },
  {
    name: "Optimize",
    color: "#22c55e",
    gradient: "linear-gradient(135deg, #22c55e, #15803d)",
    tools: [
      { id: "compress",   label: "Compress PDF", icon: Zap },
      { id: "repair-pdf", label: "Repair PDF",   icon: LifeBuoy },
    ],
  },
  {
    name: "Convert",
    color: "#3182ce",
    gradient: "linear-gradient(135deg, #3182ce, #1e3a8a)",
    tools: [
      { id: "extract-text", label: "PDF to Text",       icon: Type },
      { id: "pdf-to-xml",   label: "PDF to XML",        icon: FileJson },
      { id: "pdf-to-jpg",   label: "PDF to JPG",        icon: ImageIcon },
      { id: "jpg-to-pdf",   label: "JPG to PDF",        icon: ImageIcon },
      { id: "word-to-pdf",  label: "Word to PDF",       icon: FileText },
      { id: "pdf-to-word",  label: "PDF to Word",       icon: FileText },
      { id: "ppt-to-pdf",   label: "PowerPoint to PDF", icon: Presentation },
      { id: "pdf-to-ppt",   label: "PDF to PowerPoint", icon: Presentation },
      { id: "excel-to-pdf", label: "Excel to PDF",      icon: FileSpreadsheet },
      { id: "pdf-to-excel", label: "PDF to Excel",      icon: FileSpreadsheet },
      { id: "html-to-pdf",  label: "HTML to PDF",       icon: Globe },
    ],
  },
  {
    name: "Edit",
    color: "#E8465D",
    gradient: "linear-gradient(135deg, #E8465D, #843286)",
    tools: [
      { id: "watermark",    label: "Watermark",      icon: Stamp },
      { id: "page-numbers", label: "Page Numbers",   icon: FileDigit },
      { id: "metadata",     label: "Edit Metadata",  icon: Settings },
    ],
  },
  {
    name: "Security",
    color: "#e53e3e",
    gradient: "linear-gradient(135deg, #e53e3e, #7f1d1d)",
    tools: [
      { id: "unlock",  label: "Unlock PDF",  icon: Unlock },
      { id: "protect", label: "Protect PDF", icon: Lock },
    ],
  },
  {
    name: "Special",
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #ef4444, #991b1b)",
    tools: [
      { id: "aadhar-crop", label: "Aadhar Cropper", icon: Wand2 },
    ],
  },
];

export default function AllToolsDropdown() {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const hide = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button className="flex items-center gap-1 text-xs font-black text-slate-700 dark:text-slate-300 hover:text-red-500 transition-colors uppercase tracking-tight">
        ALL PDF TOOLS
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="all-tools-dropdown">
          <div className="all-tools-row">
            {CATEGORIES.map((cat) => (
              <div key={cat.name} className="all-tools-col">
                <div className="all-tools-cat-label" style={{ color: cat.color }}>
                  {cat.name}
                </div>
                {cat.tools.map(({ id, label, icon: Icon }) => (
                  <a key={id} href={`/tool/${id}`} className="all-tools-item">
                    <span className="all-tools-icon" style={{ background: cat.gradient }}>
                      <Icon size={14} />
                    </span>
                    {label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
