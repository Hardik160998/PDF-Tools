"use client";

import { useState, useRef } from "react";
import { ChevronDown, Type, FileJson, ImageIcon, FileText, Presentation, FileSpreadsheet, Globe, ScanText } from "lucide-react";

const TOOLS = [
  { id: "extract-text",   label: "PDF to Text",       icon: Type },
  { id: "ocr-pdf",        label: "OCR PDF",           icon: ScanText },
  { id: "pdf-to-xml",     label: "PDF to XML",        icon: FileJson },
  { id: "pdf-to-jpg",     label: "PDF to JPG",        icon: ImageIcon },
  { id: "jpg-to-pdf",     label: "JPG to PDF",        icon: ImageIcon },
  { id: "word-to-pdf",    label: "Word to PDF",       icon: FileText },
  { id: "pdf-to-word",    label: "PDF to Word",       icon: FileText },
  { id: "docx-to-pdf",    label: "DOCX to PDF",       icon: FileText },
  { id: "pdf-to-docx",    label: "PDF to DOCX",       icon: FileText },
  { id: "ppt-to-pdf",     label: "PowerPoint to PDF", icon: Presentation },
  { id: "pdf-to-ppt",     label: "PDF to PowerPoint", icon: Presentation },
  { id: "excel-to-pdf",   label: "Excel to PDF",      icon: FileSpreadsheet },
  { id: "pdf-to-excel",   label: "PDF to Excel",      icon: FileSpreadsheet },
  { id: "html-to-pdf",    label: "HTML to PDF",       icon: Globe },
  { id: "webpage-to-pdf", label: "Webpage to PDF",    icon: Globe },
];

export default function ConvertDropdown() {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => { if (timeout.current) clearTimeout(timeout.current); setOpen(true); };
  const hide = () => { timeout.current = setTimeout(() => setOpen(false), 150); };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button className={`flex items-center gap-1 text-[15px] font-semibold transition-colors uppercase tracking-wide whitespace-nowrap ${open ? "text-red-500" : "text-slate-500 dark:text-slate-400 hover:text-red-500"}`}>
        CONVERT PDF
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          onMouseEnter={show}
          onMouseLeave={hide}
          className="convert-dropdown-panel"
        >
          {/* Arrow */}
          <div className="convert-dropdown-arrow" />

          {/* Label */}
          <div className="convert-dropdown-label">
            CONVERT PDF TOOLS
          </div>

          {/* Tool list */}
          {TOOLS.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`/tool/${id}`}
              className="convert-dropdown-item"
            >
              <span className="convert-dropdown-icon">
                <Icon size={14} />
              </span>
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
