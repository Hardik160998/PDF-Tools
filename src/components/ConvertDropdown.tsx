"use client";

import { useState, useRef } from "react";
import { ChevronDown, Type, FileJson, ImageIcon, FileText, Presentation, FileSpreadsheet, Globe } from "lucide-react";

const TOOLS = [
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
];

export default function ConvertDropdown() {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => { if (timeout.current) clearTimeout(timeout.current); setOpen(true); };
  const hide = () => { timeout.current = setTimeout(() => setOpen(false), 150); };

  return (
    <div style={{ position: "relative" }} onMouseEnter={show} onMouseLeave={hide}>
      <button className="flex items-center gap-1 text-xs font-black text-slate-700 dark:text-slate-300 hover:text-red-500 transition-colors uppercase tracking-tight">
        CONVERT PDF
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          onMouseEnter={show}
          onMouseLeave={hide}
          style={{
            position: "absolute",
            top: "calc(100% + 14px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "210px",
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "1rem",
            boxShadow: "0 20px 40px -8px rgba(0,0,0,0.15), 0 4px 12px -2px rgba(0,0,0,0.08)",
            padding: "0.6rem",
            zIndex: 9999,
          }}
        >
          {/* Arrow */}
          <div style={{
            position: "absolute",
            top: "-6px",
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
            width: "11px",
            height: "11px",
            background: "white",
            borderLeft: "1px solid #e2e8f0",
            borderTop: "1px solid #e2e8f0",
          }} />

          {/* Label */}
          <div style={{
            fontSize: "0.58rem",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "#3182ce",
            padding: "0.25rem 0.5rem 0.5rem",
            borderBottom: "1.5px solid #3182ce",
            marginBottom: "0.4rem",
          }}>
            CONVERT PDF TOOLS
          </div>

          {/* Tool list */}
          {TOOLS.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`/tool/${id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.45rem 0.5rem",
                borderRadius: "0.5rem",
                fontSize: "0.76rem",
                fontWeight: 700,
                color: "#334155",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "background 0.1s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#eff6ff"; (e.currentTarget as HTMLElement).style.color = "#1d4ed8"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; (e.currentTarget as HTMLElement).style.color = "#334155"; }}
            >
              <span style={{
                width: "26px",
                height: "26px",
                borderRadius: "7px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #3182ce, #1e3a8a)",
                color: "white",
                flexShrink: 0,
                boxShadow: "0 2px 6px rgba(49,130,206,0.35)",
              }}>
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
