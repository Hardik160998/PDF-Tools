"use client";

import { useState, useEffect } from "react";
import { Menu, X, Heart, Combine, Scissors, Zap, LifeBuoy, Type, FileJson, ImageIcon, FileText, Presentation, FileSpreadsheet, Globe, Stamp, FileDigit, Settings, Unlock, Lock, Wand2, FileSymlink, Search } from "lucide-react";

const SECTIONS = [
  {
    label: "Organize", color: "#f26522",
    links: [
      { href: "/tool/organize",    label: "Organize PDF",       icon: FileSymlink },
      { href: "/tool/merge",       label: "Merge PDF",          icon: Combine },
      { href: "/tool/split",       label: "Split PDF",          icon: Scissors },
    ],
  },
  {
    label: "Optimize", color: "#22c55e",
    links: [
      { href: "/tool/compress",    label: "Compress PDF",       icon: Zap },
      { href: "/tool/repair-pdf",  label: "Repair PDF",         icon: LifeBuoy },
    ],
  },
  {
    label: "Convert", color: "#3182ce",
    links: [
      { href: "/tool/extract-text",label: "PDF to Text",        icon: Type },
      { href: "/tool/pdf-to-xml",  label: "PDF to XML",         icon: FileJson },
      { href: "/tool/pdf-to-jpg",  label: "PDF to JPG",         icon: ImageIcon },
      { href: "/tool/jpg-to-pdf",  label: "JPG to PDF",         icon: ImageIcon },
      { href: "/tool/word-to-pdf", label: "Word to PDF",        icon: FileText },
      { href: "/tool/pdf-to-word", label: "PDF to Word",        icon: FileText },
      { href: "/tool/ppt-to-pdf",  label: "PowerPoint to PDF",  icon: Presentation },
      { href: "/tool/pdf-to-ppt",  label: "PDF to PowerPoint",  icon: Presentation },
      { href: "/tool/excel-to-pdf",label: "Excel to PDF",       icon: FileSpreadsheet },
      { href: "/tool/pdf-to-excel",label: "PDF to Excel",       icon: FileSpreadsheet },
      { href: "/tool/html-to-pdf", label: "HTML to PDF",        icon: Globe },
    ],
  },
  {
    label: "Edit", color: "#E8465D",
    links: [
      { href: "/tool/watermark",    label: "Watermark",         icon: Stamp },
      { href: "/tool/page-numbers", label: "Page Numbers",      icon: FileDigit },
      { href: "/tool/metadata",     label: "Edit Metadata",     icon: Settings },
    ],
  },
  {
    label: "Security", color: "#e53e3e",
    links: [
      { href: "/tool/unlock",  label: "Unlock PDF",  icon: Unlock },
      { href: "/tool/protect", label: "Protect PDF", icon: Lock },
    ],
  },
  {
    label: "Special", color: "#ef4444",
    links: [
      { href: "/tool/aadhar-crop", label: "Aadhar Cropper", icon: Wand2 },
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
      {/* Hamburger button — only visible on mobile */}
      <button
        className="mob-hamburger"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Backdrop */}
      {open && <div className="mob-backdrop" onClick={close} />}

      {/* Slide-in Drawer */}
      <div className={`mob-drawer ${open ? "mob-drawer--open" : ""}`}>
        {/* Drawer Header */}
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

        {/* Search inside drawer */}
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

        {/* Links */}
        <div className="mob-drawer-body">
          {filtered ? (
            /* Search results */
            filtered.length > 0 ? filtered.map(({ href, label, icon: Icon }) => (
              <a key={href} href={href} className="mob-drawer-item" onClick={close}>
                <span className="mob-drawer-item-dot" />
                {label}
              </a>
            )) : (
              <p className="mob-drawer-empty">No tools found</p>
            )
          ) : (
            /* Grouped sections */
            SECTIONS.map(section => (
              <div key={section.label} className="mob-drawer-section">
                <div className="mob-drawer-section-label" style={{ color: section.color }}>
                  {section.label}
                </div>
                {section.links.map(({ href, label, icon: Icon }) => (
                  <a key={href} href={href} className="mob-drawer-item" onClick={close}>
                    <span className="mob-drawer-item-icon" style={{ background: section.color }}>
                      <Icon size={13} />
                    </span>
                    {label}
                  </a>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="mob-drawer-footer">
          <button className="mob-drawer-login">Login</button>
          <button className="mob-drawer-signup">Sign Up</button>
        </div>
      </div>
    </>
  );
}
