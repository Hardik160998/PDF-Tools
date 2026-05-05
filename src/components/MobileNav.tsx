"use client";

import { useState, useEffect } from "react";
import { Menu, X, Heart, Combine, Scissors, Zap, LifeBuoy, Type, FileJson, ImageIcon, FileText, Presentation, FileSpreadsheet, Globe, Stamp, FileDigit, Settings, Unlock, Lock, Wand2, FileSymlink, Search, Layers, GitCompare, Bookmark, EyeOff, PenLine, ScanText } from "lucide-react";

const SECTIONS = [
  {
    label: "Organize", color: "#f26522", gradient: "linear-gradient(135deg, #f26522, #c2410c)",
    links: [
      { href: "/tool/compare-pdf",   label: "Compare PDF",        icon: GitCompare },
      { href: "/tool/extract-pages", label: "Extract PDF Pages",  icon: Layers },
      { href: "/tool/delete-pages",  label: "Delete PDF Pages",   icon: Scissors },
      { href: "/tool/add-blank-page",label: "Add Blank Page",     icon: Layers },
      { href: "/tool/organize",      label: "Organize PDF",       icon: FileSymlink },
      { href: "/tool/merge",         label: "Merge PDF",          icon: Combine },
      { href: "/tool/split",         label: "Split PDF",          icon: Scissors },
    ],
  },
  {
    label: "Optimize", color: "#22c55e", gradient: "linear-gradient(135deg, #22c55e, #15803d)",
    links: [
      { href: "/tool/compress",     label: "Compress PDF",   icon: Zap },
      { href: "/tool/optimize-pdf", label: "Optimize PDF",   icon: Zap },
      { href: "/tool/repair-pdf",   label: "Repair PDF",     icon: LifeBuoy },
    ],
  },
  {
    label: "Convert", color: "#3182ce", gradient: "linear-gradient(135deg, #3182ce, #1e3a8a)",
    links: [
      { href: "/tool/extract-text",  label: "PDF to Text",        icon: Type },
      { href: "/tool/ocr-pdf",        label: "OCR PDF",            icon: ScanText },
      { href: "/tool/pdf-to-xml",    label: "PDF to XML",         icon: FileJson },
      { href: "/tool/pdf-to-jpg",    label: "PDF to JPG",         icon: ImageIcon },
      { href: "/tool/jpg-to-pdf",    label: "JPG to PDF",         icon: ImageIcon },
      { href: "/tool/word-to-pdf",   label: "Word to PDF",        icon: FileText },
      { href: "/tool/pdf-to-word",   label: "PDF to Word",        icon: FileText },
      { href: "/tool/docx-to-pdf",   label: "DOCX to PDF",        icon: FileText },
      { href: "/tool/pdf-to-docx",   label: "PDF to DOCX",        icon: FileText },
      { href: "/tool/ppt-to-pdf",    label: "PowerPoint to PDF",  icon: Presentation },
      { href: "/tool/pdf-to-ppt",    label: "PDF to PowerPoint",  icon: Presentation },
      { href: "/tool/excel-to-pdf",  label: "Excel to PDF",       icon: FileSpreadsheet },
      { href: "/tool/pdf-to-excel",  label: "PDF to Excel",       icon: FileSpreadsheet },
      { href: "/tool/html-to-pdf",   label: "HTML to PDF",        icon: Globe },
      { href: "/tool/webpage-to-pdf",label: "Webpage to PDF",     icon: Globe },
    ],
  },
  {
    label: "Image Convert", color: "#06b6d4", gradient: "linear-gradient(135deg, #06b6d4, #0e7490)",
    links: [
      { href: "/tool/jpg-to-png",   label: "JPG to PNG",   icon: ImageIcon },
      { href: "/tool/png-to-jpg",   label: "PNG to JPG",   icon: ImageIcon },
      { href: "/tool/jpg-to-webp",  label: "JPG to WebP",  icon: ImageIcon },
      { href: "/tool/webp-to-jpg",  label: "WebP to JPG",  icon: ImageIcon },
      { href: "/tool/png-to-webp",  label: "PNG to WebP",  icon: ImageIcon },
      { href: "/tool/webp-to-png",  label: "WebP to PNG",  icon: ImageIcon },
      { href: "/tool/jpg-to-avif",  label: "JPG to AVIF",  icon: ImageIcon },
      { href: "/tool/avif-to-jpg",  label: "AVIF to JPG",  icon: ImageIcon },
      { href: "/tool/png-to-avif",  label: "PNG to AVIF",  icon: ImageIcon },
      { href: "/tool/avif-to-png",  label: "AVIF to PNG",  icon: ImageIcon },
      { href: "/tool/webp-to-avif", label: "WebP to AVIF", icon: ImageIcon },
      { href: "/tool/avif-to-webp", label: "AVIF to WebP", icon: ImageIcon },
    ],
  },
  {
    label: "Edit", color: "#E8465D", gradient: "linear-gradient(135deg, #E8465D, #843286)",
    links: [
      { href: "/edit",               label: "Edit PDF",      icon: PenLine },
      { href: "/tool/bookmark-pdf",  label: "Bookmark PDF",  icon: Bookmark },
      { href: "/tool/watermark",     label: "Watermark",     icon: Stamp },
      { href: "/tool/page-numbers",  label: "Page Numbers",  icon: FileDigit },
      { href: "/tool/metadata",      label: "Edit Metadata", icon: Settings },
      { href: "/tool/flatten-pdf",   label: "Flatten PDF",   icon: Layers },
      { href: "/tool/remove-ocr",    label: "Remove OCR",    icon: EyeOff },
    ],
  },
  {
    label: "Security", color: "#e53e3e", gradient: "linear-gradient(135deg, #e53e3e, #7f1d1d)",
    links: [
      { href: "/tool/redact-pdf", label: "Redact PDF",   icon: EyeOff },
      { href: "/tool/unlock",     label: "Unlock PDF",   icon: Unlock },
      { href: "/tool/protect",    label: "Protect PDF",  icon: Lock },
    ],
  },
  {
    label: "Special", color: "#ef4444", gradient: "linear-gradient(135deg, #ef4444, #991b1b)",
    links: [
      { href: "/tool/aadhar-crop", label: "Aadhar Cropper", icon: Wand2 },
    ],
  },
  {
    label: "Sign", color: "#8b5cf6", gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)",
    links: [
      { href: "/esign", label: "E-Sign PDF", icon: PenLine },
    ],
  },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("drawer-open");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("drawer-open");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("drawer-open");
    };
  }, [open]);

  const close = () => { setOpen(false); setQuery(""); };

  const allLinks = SECTIONS.flatMap(s => s.links);
  const filtered = query.trim()
    ? allLinks.filter(l => l.label.toLowerCase().includes(query.toLowerCase()))
    : null;

  return (
    <>
      <button
        className="mob-hamburger"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && <div className="mob-backdrop" onClick={close} />}

      <div className={`mob-drawer ${open ? "mob-drawer--open" : ""}`}>
        <div className="mob-drawer-header">
          <a href="/" className="mob-drawer-logo" onClick={close}>
            <span>Smart</span>
            <Heart className="fill-red-500 text-red-500" size={18} />
            <span>PDFs</span>
          </a>
          <button className="mob-drawer-close" onClick={close}>
            <X size={20} />
          </button>
        </div>

        <div className="mob-drawer-search">
          <Search size={15} className="mob-drawer-search-icon" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="mob-drawer-search-input"
          />
        </div>

        <div className="mob-drawer-body">
          {filtered ? (
            filtered.length > 0 ? filtered.map(({ href, label, icon: Icon }) => {
              const section = SECTIONS.find(s => s.links.some(l => l.href === href));
              return (
                <a key={href} href={href} className="mob-drawer-item" onClick={close}>
                  <span className="mob-drawer-item-icon" style={{ background: section?.gradient }}>
                    <Icon size={13} />
                  </span>
                  {label}
                </a>
              );
            }) : (
              <p className="mob-drawer-empty">No tools found</p>
            )
          ) : (
            SECTIONS.map(section => (
              <div key={section.label} className="mob-drawer-section">
                <div className="mob-drawer-section-label" style={{ color: section.color }}>
                  {section.label}
                </div>
                {section.links.map(({ href, label, icon: Icon }) => (
                  <a key={href} href={href} className="mob-drawer-item" onClick={close}>
                    <span className="mob-drawer-item-icon" style={{ background: section.gradient }}>
                      <Icon size={13} />
                    </span>
                    {label}
                  </a>
                ))}
              </div>
            ))
          )}
        </div>

        <div className="mob-drawer-footer">
          <button className="mob-drawer-login">Login</button>
          <button className="mob-drawer-signup">Sign Up</button>
        </div>
      </div>
    </>
  );
}
