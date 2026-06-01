"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X, Heart, Combine, Scissors, Zap, LifeBuoy, Type, FileJson, ImageIcon, FileText, Presentation, FileSpreadsheet, Globe, Stamp, FileDigit, Settings, Unlock, Lock, Wand2, FileSymlink, Search, Layers, GitCompare, Bookmark, EyeOff, PenLine, ScanText, Crop, ShoppingBag, Crown } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const SECTIONS = [
  {
    label: "Organize", color: "#f26522", gradient: "linear-gradient(135deg, #f26522, #c2410c)",
    links: [
      { href: "/tool/compare-pdf", label: "Compare PDF", icon: GitCompare },
      { href: "/tool/extract-pages", label: "Extract PDF Pages", icon: Layers },
      { href: "/tool/delete-pages", label: "Delete PDF Pages", icon: Scissors },
      { href: "/tool/add-blank-page", label: "Add Blank Page", icon: Layers },
      { href: "/tool/organize", label: "Organize PDF", icon: FileSymlink },
      { href: "/tool/merge", label: "Merge PDF", icon: Combine },
      { href: "/tool/split", label: "Split PDF", icon: Scissors },
    ],
  },
  {
    label: "Optimize", color: "#22c55e", gradient: "linear-gradient(135deg, #22c55e, #15803d)",
    links: [
      { href: "/tool/compress", label: "Compress PDF", icon: Zap },
      { href: "/tool/optimize-pdf", label: "Optimize PDF", icon: Zap },
      { href: "/tool/repair-pdf", label: "Repair PDF", icon: LifeBuoy },
    ],
  },
  {
    label: "Convert", color: "#3182ce", gradient: "linear-gradient(135deg, #3182ce, #1e3a8a)",
    links: [
      { href: "/tool/extract-text", label: "PDF to Text", icon: Type },
      { href: "/tool/ocr-pdf", label: "OCR PDF", icon: ScanText },
      { href: "/tool/pdf-to-xml", label: "PDF to XML", icon: FileJson },
      { href: "/tool/pdf-to-jpg", label: "PDF to JPG", icon: ImageIcon },
      { href: "/tool/jpg-to-pdf", label: "JPG to PDF", icon: ImageIcon },
      { href: "/tool/word-to-pdf", label: "Word to PDF", icon: FileText },
      { href: "/tool/pdf-to-word", label: "PDF to Word", icon: FileText },
      { href: "/tool/docx-to-pdf", label: "DOCX to PDF", icon: FileText },
      { href: "/tool/pdf-to-docx", label: "PDF to DOCX", icon: FileText },
      { href: "/tool/ppt-to-pdf", label: "PowerPoint to PDF", icon: Presentation },
      { href: "/tool/pdf-to-ppt", label: "PDF to PowerPoint", icon: Presentation },
      { href: "/tool/excel-to-pdf", label: "Excel to PDF", icon: FileSpreadsheet },
      { href: "/tool/pdf-to-excel", label: "PDF to Excel", icon: FileSpreadsheet },
      { href: "/tool/html-to-pdf", label: "HTML to PDF", icon: Globe },
      { href: "/tool/webpage-to-pdf", label: "Webpage to PDF", icon: Globe },
    ],
  },
  {
    label: "Image Convert", color: "#06b6d4", gradient: "linear-gradient(135deg, #06b6d4, #0e7490)",
    links: [
      { href: "/tool/jpg-to-png", label: "JPG to PNG", icon: ImageIcon },
      { href: "/tool/png-to-jpg", label: "PNG to JPG", icon: ImageIcon },
      { href: "/tool/jpg-to-webp", label: "JPG to WebP", icon: ImageIcon },
      { href: "/tool/webp-to-jpg", label: "WebP to JPG", icon: ImageIcon },
      { href: "/tool/png-to-webp", label: "PNG to WebP", icon: ImageIcon },
      { href: "/tool/webp-to-png", label: "WebP to PNG", icon: ImageIcon },
      { href: "/tool/jpg-to-avif", label: "JPG to AVIF", icon: ImageIcon },
      { href: "/tool/avif-to-jpg", label: "AVIF to JPG", icon: ImageIcon },
      { href: "/tool/png-to-avif", label: "PNG to AVIF", icon: ImageIcon },
      { href: "/tool/avif-to-png", label: "AVIF to PNG", icon: ImageIcon },
      { href: "/tool/webp-to-avif", label: "WebP to AVIF", icon: ImageIcon },
      { href: "/tool/avif-to-webp", label: "AVIF to WebP", icon: ImageIcon },
    ],
  },
  {
    label: "Edit", color: "#E8465D", gradient: "linear-gradient(135deg, #E8465D, #843286)",
    links: [
      { href: "/tool/edit", label: "Edit PDF", icon: PenLine },
      { href: "/tool/bookmark-pdf", label: "Bookmark PDF", icon: Bookmark },
      { href: "/tool/watermark", label: "Watermark", icon: Stamp },
      { href: "/tool/page-numbers", label: "Page Numbers", icon: FileDigit },
      { href: "/tool/metadata", label: "Edit Metadata", icon: Settings },
      { href: "/tool/flatten-pdf", label: "Flatten PDF", icon: Layers },
      { href: "/tool/remove-ocr", label: "Remove OCR", icon: EyeOff },
    ],
  },
  {
    label: "Security", color: "#e53e3e", gradient: "linear-gradient(135deg, #e53e3e, #7f1d1d)",
    links: [
      { href: "/tool/redact-pdf", label: "Redact PDF", icon: EyeOff },
      { href: "/tool/unlock", label: "Unlock PDF", icon: Unlock },
      { href: "/tool/protect", label: "Protect PDF", icon: Lock },
    ],
  },
  {
    label: "Special", color: "#ef4444", gradient: "linear-gradient(135deg, #ef4444, #991b1b)",
    links: [
      { href: "/tool/aadhar-crop", label: "Aadhar Cropper", icon: Wand2 },
      { href: "/tool/crop-pdf", label: "Crop PDF", icon: Crop },
    ],
  },
  {
    label: "Ecommerce", color: "#f26522", gradient: "linear-gradient(135deg, #f26522, #f59e0b)",
    links: [
      { href: "/tool/meesho-cropper", label: "Meesho Label with Invoice Cropper", icon: ShoppingBag },
      { href: "/tool/meshocrop", label: "Meesho Crop Label (without invoice)", icon: ShoppingBag },
      { href: "/tool/flipkart-cropper", label: "Flipkart Label Cropper", icon: ShoppingBag },
      { href: "/tool/amazon-cropper", label: "Amazon Label Cropper", icon: ShoppingBag },
      { href: "/tool/snapdeal-cropper", label: "Snapdeal Label Cropper", icon: ShoppingBag },
    ],
  },
  {
    label: "Sign", color: "#8b5cf6", gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)",
    links: [
      { href: "/tool/esign", label: "E-Sign PDF", icon: PenLine },
    ],
  },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user, profile, loading, logout } = useAuth();

  const handleLogout = async () => {
    close();
    await logout();
    router.push("/");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

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

      {mounted && open && createPortal(
        <>
          <div className="mob-backdrop" onClick={close} />
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

            {/* Plan Info and View Premium Plans Button */}
            <div style={{
              margin: '0 1rem 0.75rem',
              padding: '1rem',
              borderRadius: '1rem',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(239, 68, 68, 0.08) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Your Plan</span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  background: '#fffbeb',
                  color: '#d97706',
                  border: '1px solid #fef3c7',
                }} className="dark:bg-slate-900/60 dark:text-amber-400 dark:border-amber-500/20">
                  {user ? (profile?.current_plan || profile?.plan || "Basic Plan") : "Free Plan"}
                </span>
              </div>
              <Link
                href="/premium-plans"
                onClick={close}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.65rem',
                  borderRadius: '0.75rem',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #e11d48 100%)',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
                  textDecoration: 'none',
                }}
              >
                <Crown size={14} className="fill-white" /> View Premium Plans
              </Link>
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

            <div className="mob-drawer-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '1.2rem' }}>
              {loading ? (
                <div style={{ height: '40px', backgroundColor: '#e2e8f0', borderRadius: '0.5rem' }} className="skeleton-shimmer" />
              ) : user ? (
                <div className="flex flex-col gap-3 w-full bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-xs font-black text-white shadow-md">
                      {profile?.full_name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || user.email?.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{profile?.full_name || "SmartPDFs User"}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Link
                      href="/profile"
                      onClick={close}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 rounded-xl text-[10px] font-black text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-center"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-black shadow-md shadow-rose-500/10 transition-all cursor-pointer text-center"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Link
                    href="/login"
                    onClick={close}
                    className="flex items-center justify-center py-3 px-4 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-center"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={close}
                    className="flex items-center justify-center py-3 px-4 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-xl text-xs font-black shadow-lg shadow-red-500/20 transition-all text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
