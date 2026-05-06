"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Combine, Scissors, Zap, LifeBuoy, Type, FileJson, ImageIcon, FileText, Presentation, FileSpreadsheet, Globe, Stamp, FileDigit, Settings, Unlock, Lock, Wand2, FileSymlink, PenLine, Layers, GitCompare, EyeOff, Bookmark, ScanText, Crop, ShoppingBag } from "lucide-react";

const GRADIENTS: Record<string, string> = {
  Organize:  "linear-gradient(135deg, #f26522, #c2410c)",
  Optimize:  "linear-gradient(135deg, #22c55e, #15803d)",
  Convert:   "linear-gradient(135deg, #3182ce, #1e3a8a)",
  Edit:      "linear-gradient(135deg, #E8465D, #843286)",
  Security:  "linear-gradient(135deg, #e53e3e, #7f1d1d)",
  Special:   "linear-gradient(135deg, #ef4444, #991b1b)",
  Ecommerce: "linear-gradient(135deg, #f26522, #f59e0b)",
  Sign:      "linear-gradient(135deg, #8b5cf6, #ec4899)",
};

const TOOLS = [
  { id: "merge",          label: "Merge PDF",                         category: "Organize",  icon: Combine },
  { id: "split",          label: "Split PDF",                         category: "Organize",  icon: Scissors },
  { id: "organize",       label: "Organize PDF",                      category: "Organize",  icon: FileSymlink },
  { id: "compare-pdf",    label: "Compare PDF",                       category: "Organize",  icon: GitCompare },
  { id: "extract-pages",  label: "Extract Pages",                     category: "Organize",  icon: Layers },
  { id: "delete-pages",   label: "Delete Pages",                      category: "Organize",  icon: Scissors },
  { id: "add-blank-page", label: "Add Blank Page",                    category: "Organize",  icon: Layers },
  { id: "compress",       label: "Compress PDF",                      category: "Optimize",  icon: Zap },
  { id: "optimize-pdf",   label: "Optimize PDF",                      category: "Optimize",  icon: Zap },
  { id: "repair-pdf",     label: "Repair PDF",                        category: "Optimize",  icon: LifeBuoy },
  { id: "extract-text",   label: "PDF to Text",                       category: "Convert",   icon: Type },
  { id: "ocr-pdf",        label: "OCR PDF",                           category: "Convert",   icon: ScanText },
  { id: "pdf-to-xml",     label: "PDF to XML",                        category: "Convert",   icon: FileJson },
  { id: "pdf-to-jpg",     label: "PDF to JPG",                        category: "Convert",   icon: ImageIcon },
  { id: "jpg-to-pdf",     label: "JPG to PDF",                        category: "Convert",   icon: ImageIcon },
  { id: "word-to-pdf",    label: "Word to PDF",                       category: "Convert",   icon: FileText },
  { id: "pdf-to-word",    label: "PDF to Word",                       category: "Convert",   icon: FileText },
  { id: "docx-to-pdf",    label: "DOCX to PDF",                       category: "Convert",   icon: FileText },
  { id: "pdf-to-docx",    label: "PDF to DOCX",                       category: "Convert",   icon: FileText },
  { id: "ppt-to-pdf",     label: "PowerPoint to PDF",                 category: "Convert",   icon: Presentation },
  { id: "pdf-to-ppt",     label: "PDF to PowerPoint",                 category: "Convert",   icon: Presentation },
  { id: "excel-to-pdf",   label: "Excel to PDF",                      category: "Convert",   icon: FileSpreadsheet },
  { id: "pdf-to-excel",   label: "PDF to Excel",                      category: "Convert",   icon: FileSpreadsheet },
  { id: "html-to-pdf",    label: "HTML to PDF",                       category: "Convert",   icon: Globe },
  { id: "webpage-to-pdf", label: "Webpage to PDF",                    category: "Convert",   icon: Globe },
  { id: "edit-pdf",       label: "Edit PDF",                          category: "Edit",      icon: PenLine,  href: "/edit" },
  { id: "esign",          label: "E-Sign PDF",                        category: "Sign",      icon: PenLine,  href: "/esign" },
  { id: "watermark",      label: "Watermark",                         category: "Edit",      icon: Stamp },
  { id: "page-numbers",   label: "Page Numbers",                      category: "Edit",      icon: FileDigit },
  { id: "metadata",       label: "Edit Metadata",                     category: "Edit",      icon: Settings },
  { id: "bookmark-pdf",   label: "Bookmark PDF",                      category: "Edit",      icon: Bookmark },
  { id: "flatten-pdf",    label: "Flatten PDF",                       category: "Edit",      icon: Layers },
  { id: "remove-ocr",     label: "Remove OCR",                        category: "Edit",      icon: EyeOff },
  { id: "redact-pdf",     label: "Redact PDF",                        category: "Security",  icon: EyeOff },
  { id: "unlock",         label: "Unlock PDF",                        category: "Security",  icon: Unlock },
  { id: "protect",        label: "Protect PDF",                       category: "Security",  icon: Lock },
  { id: "aadhar-crop",    label: "Aadhar Cropper",                    category: "Special",   icon: Wand2 },
  { id: "crop-pdf",       label: "Crop PDF",                          category: "Special",   icon: Crop },
  { id: "meesho-cropper", label: "Meesho Label with Invoice Cropper", category: "Ecommerce", icon: ShoppingBag },
];

export default function MobileSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim()
    ? TOOLS.filter(t =>
        t.label.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase())
      )
    : TOOLS;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [open]);

  return (
    <>
      <button className="mob-search-btn" onClick={() => setOpen(true)} aria-label="Search tools">
        <Search size={20} />
      </button>

      {open && (
        <div className="mob-search-overlay">
          <div className="mob-search-header">
            <div className="mob-search-box-wrap">
              <Search size={16} className="mob-search-icon" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search PDF tools..."
                className="mob-search-input"
              />
              {query && (
                <button onClick={() => setQuery("")} className="mob-search-clear">
                  <X size={14} />
                </button>
              )}
            </div>
            <button onClick={() => setOpen(false)} className="mob-search-close">Cancel</button>
          </div>

          <div className="mob-search-results">
            {results.length > 0 ? (
              <>
                <p className="mob-search-hint">{query.trim() ? `${results.length} results` : "All Tools"}</p>
                {results.map(({ id, label, category, icon: Icon, href }) => (
                  <a
                    key={id}
                    href={href ?? `/tool/${id}`}
                    className="nav-search-item"
                    onClick={() => setOpen(false)}
                  >
                    <span className="nav-search-item-icon" style={{ background: GRADIENTS[category] }}>
                      <Icon size={13} />
                    </span>
                    <span className="nav-search-item-label">{label}</span>
                    <span className="nav-search-item-cat">{category}</span>
                  </a>
                ))}
              </>
            ) : (
              <p className="mob-search-empty">No tools found for &quot;{query}&quot;</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
