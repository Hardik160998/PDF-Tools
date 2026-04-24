"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Combine, Scissors, Zap, LifeBuoy, Type, FileJson, ImageIcon, FileText, Presentation, FileSpreadsheet, Globe, Stamp, FileDigit, Settings, Unlock, Lock, Wand2, FileSymlink } from "lucide-react";

const TOOLS = [
  { id: "organize",     label: "Organize PDF",       category: "Organize", color: "#f26522", icon: FileSymlink },
  { id: "merge",        label: "Merge PDF",           category: "Organize", color: "#f26522", icon: Combine },
  { id: "split",        label: "Split PDF",           category: "Organize", color: "#f26522", icon: Scissors },
  { id: "compress",     label: "Compress PDF",        category: "Optimize", color: "#22c55e", icon: Zap },
  { id: "repair-pdf",   label: "Repair PDF",          category: "Optimize", color: "#22c55e", icon: LifeBuoy },
  { id: "extract-text", label: "PDF to Text",         category: "Convert",  color: "#3182ce", icon: Type },
  { id: "pdf-to-xml",   label: "PDF to XML",          category: "Convert",  color: "#3182ce", icon: FileJson },
  { id: "pdf-to-jpg",   label: "PDF to JPG",          category: "Convert",  color: "#3182ce", icon: ImageIcon },
  { id: "jpg-to-pdf",   label: "JPG to PDF",          category: "Convert",  color: "#3182ce", icon: ImageIcon },
  { id: "word-to-pdf",  label: "Word to PDF",         category: "Convert",  color: "#3182ce", icon: FileText },
  { id: "pdf-to-word",  label: "PDF to Word",         category: "Convert",  color: "#3182ce", icon: FileText },
  { id: "ppt-to-pdf",   label: "PowerPoint to PDF",   category: "Convert",  color: "#3182ce", icon: Presentation },
  { id: "pdf-to-ppt",   label: "PDF to PowerPoint",   category: "Convert",  color: "#3182ce", icon: Presentation },
  { id: "excel-to-pdf", label: "Excel to PDF",        category: "Convert",  color: "#3182ce", icon: FileSpreadsheet },
  { id: "pdf-to-excel", label: "PDF to Excel",        category: "Convert",  color: "#3182ce", icon: FileSpreadsheet },
  { id: "html-to-pdf",  label: "HTML to PDF",         category: "Convert",  color: "#3182ce", icon: Globe },
  { id: "watermark",    label: "Watermark",           category: "Edit",     color: "#E8465D", icon: Stamp },
  { id: "page-numbers", label: "Page Numbers",        category: "Edit",     color: "#E8465D", icon: FileDigit },
  { id: "metadata",     label: "Edit Metadata",       category: "Edit",     color: "#E8465D", icon: Settings },
  { id: "unlock",       label: "Unlock PDF",          category: "Security", color: "#e53e3e", icon: Unlock },
  { id: "protect",      label: "Protect PDF",         category: "Security", color: "#e53e3e", icon: Lock },
  { id: "aadhar-crop",  label: "Aadhar Cropper",      category: "Special",  color: "#ef4444", icon: Wand2 },
];

export default function NavSearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const results = query.trim()
    ? TOOLS.filter(t =>
        t.label.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapperRef} className="nav-search-wrap">
      <div className="nav-search-box">
        <Search size={16} className="nav-search-icon" />
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search PDF tools..."
          className="nav-search-input"
          style={{ display: 'block', width: '100%' }}
        />
      </div>

      {open && results.length > 0 && (
        <div className="nav-search-dropdown">
          {results.map(({ id, label, category, color, icon: Icon }) => (
            <a
              key={id}
              href={`/tool/${id}`}
              className="nav-search-item"
              onClick={() => { setOpen(false); setQuery(""); }}
            >
              <span className="nav-search-item-icon" style={{ background: color }}>
                <Icon size={13} />
              </span>
              <span className="nav-search-item-label">{label}</span>
              <span className="nav-search-item-cat">{category}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
