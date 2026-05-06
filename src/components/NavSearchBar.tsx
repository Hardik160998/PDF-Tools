"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Combine, Scissors, Zap, LifeBuoy, Type, FileJson, ImageIcon, FileText, Presentation, FileSpreadsheet, Globe, Stamp, FileDigit, Settings, Unlock, Lock, Wand2, FileSymlink, PenLine, Layers, GitCompare, EyeOff, Bookmark, ScanText, Crop, ShoppingBag } from "lucide-react";

const GRADIENTS: Record<string, string> = {
  Organize: "linear-gradient(135deg, #f26522, #c2410c)",
  Optimize: "linear-gradient(135deg, #22c55e, #15803d)",
  Convert:  "linear-gradient(135deg, #3182ce, #1e3a8a)",
  Edit:     "linear-gradient(135deg, #E8465D, #843286)",
  Security: "linear-gradient(135deg, #e53e3e, #7f1d1d)",
  Special:  "linear-gradient(135deg, #ef4444, #991b1b)",
  Ecommerce:"linear-gradient(135deg, #f26522, #f59e0b)",
  Sign:     "linear-gradient(135deg, #8b5cf6, #ec4899)",
};

const TOOLS = [
  { id: "merge",          label: "Merge PDF",                       category: "Organize",  icon: Combine },
  { id: "split",          label: "Split PDF",                       category: "Organize",  icon: Scissors },
  { id: "organize",       label: "Organize PDF",                    category: "Organize",  icon: FileSymlink },
  { id: "compare-pdf",    label: "Compare PDF",                     category: "Organize",  icon: GitCompare },
  { id: "extract-pages",  label: "Extract Pages",                   category: "Organize",  icon: Layers },
  { id: "delete-pages",   label: "Delete Pages",                    category: "Organize",  icon: Scissors },
  { id: "add-blank-page", label: "Add Blank Page",                  category: "Organize",  icon: Layers },
  { id: "compress",       label: "Compress PDF",                    category: "Optimize",  icon: Zap },
  { id: "optimize-pdf",   label: "Optimize PDF",                    category: "Optimize",  icon: Zap },
  { id: "repair-pdf",     label: "Repair PDF",                      category: "Optimize",  icon: LifeBuoy },
  { id: "extract-text",   label: "PDF to Text",                     category: "Convert",   icon: Type },
  { id: "ocr-pdf",        label: "OCR PDF",                         category: "Convert",   icon: ScanText },
  { id: "pdf-to-xml",     label: "PDF to XML",                      category: "Convert",   icon: FileJson },
  { id: "pdf-to-jpg",     label: "PDF to JPG",                      category: "Convert",   icon: ImageIcon },
  { id: "jpg-to-pdf",     label: "JPG to PDF",                      category: "Convert",   icon: ImageIcon },
  { id: "word-to-pdf",    label: "Word to PDF",                     category: "Convert",   icon: FileText },
  { id: "pdf-to-word",    label: "PDF to Word",                     category: "Convert",   icon: FileText },
  { id: "docx-to-pdf",    label: "DOCX to PDF",                     category: "Convert",   icon: FileText },
  { id: "pdf-to-docx",    label: "PDF to DOCX",                     category: "Convert",   icon: FileText },
  { id: "ppt-to-pdf",     label: "PowerPoint to PDF",               category: "Convert",   icon: Presentation },
  { id: "pdf-to-ppt",     label: "PDF to PowerPoint",               category: "Convert",   icon: Presentation },
  { id: "excel-to-pdf",   label: "Excel to PDF",                    category: "Convert",   icon: FileSpreadsheet },
  { id: "pdf-to-excel",   label: "PDF to Excel",                    category: "Convert",   icon: FileSpreadsheet },
  { id: "html-to-pdf",    label: "HTML to PDF",                     category: "Convert",   icon: Globe },
  { id: "webpage-to-pdf", label: "Webpage to PDF",                  category: "Convert",   icon: Globe },
  { id: "edit-pdf",       label: "Edit PDF",                        category: "Edit",      icon: PenLine,  href: "/edit" },
  { id: "esign",          label: "E-Sign PDF",                      category: "Sign",      icon: PenLine,  href: "/esign" },
  { id: "watermark",      label: "Watermark",                       category: "Edit",      icon: Stamp },
  { id: "page-numbers",   label: "Page Numbers",                    category: "Edit",      icon: FileDigit },
  { id: "metadata",       label: "Edit Metadata",                   category: "Edit",      icon: Settings },
  { id: "bookmark-pdf",   label: "Bookmark PDF",                    category: "Edit",      icon: Bookmark },
  { id: "flatten-pdf",    label: "Flatten PDF",                     category: "Edit",      icon: Layers },
  { id: "remove-ocr",     label: "Remove OCR",                      category: "Edit",      icon: EyeOff },
  { id: "redact-pdf",     label: "Redact PDF",                      category: "Security",  icon: EyeOff },
  { id: "unlock",         label: "Unlock PDF",                      category: "Security",  icon: Unlock },
  { id: "protect",        label: "Protect PDF",                     category: "Security",  icon: Lock },
  { id: "aadhar-crop",    label: "Aadhar Cropper",                  category: "Special",   icon: Wand2 },
  { id: "crop-pdf",       label: "Crop PDF",                        category: "Special",   icon: Crop },
  { id: "meesho-cropper", label: "Meesho Label with Invoice Cropper", category: "Ecommerce", icon: ShoppingBag },
];

const POPULAR = ["merge", "compress", "pdf-to-word", "split", "ocr-pdf", "protect", "esign"];

export default function NavSearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim()
    ? TOOLS.filter(t =>
        t.label.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase())
      )
    : TOOLS.filter(t => POPULAR.includes(t.id));

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
        <Search size={15} className="nav-search-icon" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search tools..."
          className="nav-search-input"
          autoComplete="off"
        />
        {query && (
          <button onClick={() => { setQuery(""); inputRef.current?.focus(); }} style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#94a3b8' }}>
            <X size={13} />
          </button>
        )}
      </div>

      {open && (
        <div className="nav-search-dropdown">
          {!query.trim() && (
            <p style={{ fontSize: '0.58rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', padding: '0.3rem 0.5rem 0.4rem' }}>Popular Tools</p>
          )}
          {results.length > 0 ? results.map(({ id, label, category, icon: Icon, href }) => (
            <a
              key={id}
              href={href ?? `/tool/${id}`}
              className="nav-search-item"
              onClick={() => { setOpen(false); setQuery(""); }}
            >
              <span className="nav-search-item-icon" style={{ background: GRADIENTS[category] }}>
                <Icon size={13} />
              </span>
              <span className="nav-search-item-label">{label}</span>
              <span className="nav-search-item-cat">{category}</span>
            </a>
          )) : (
            <p style={{ textAlign: 'center', padding: '1.5rem 1rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>No results for &quot;{query}&quot;</p>
          )}
        </div>
      )}
    </div>
  );
}
