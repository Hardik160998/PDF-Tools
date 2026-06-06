"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import { IconMap } from "@/lib/icons";
import { useAllTools } from "@/hooks/useTools";
import { TOOL_ICONS } from "@/data/toolIcons";

const GRADIENTS: Record<string, string> = {
  Organize: "linear-gradient(135deg, #f26522, #c2410c)",
  Optimize: "linear-gradient(135deg, #22c55e, #15803d)",
  Convert: "linear-gradient(135deg, #3182ce, #1e3a8a)",
  Edit: "linear-gradient(135deg, #E8465D, #843286)",
  Security: "linear-gradient(135deg, #e53e3e, #7f1d1d)",
  'Image Convert': "linear-gradient(135deg, #06b6d4, #0e7490)",
  Special: "linear-gradient(135deg, #ef4444, #991b1b)",
  Ecommerce:"linear-gradient(135deg, #f26522, #f59e0b)",
  Sign: "linear-gradient(135deg, #8b5cf6, #ec4899)",
};

const POPULAR_KEYS = ["merge", "compress", "pdf-to-word", "split", "ocr-pdf", "protect", "esign"];

export default function NavSearchBar() {
 const [query, setQuery] = useState("");
 const [open, setOpen] = useState(false);
 const wrapperRef = useRef<HTMLDivElement>(null);
 const inputRef = useRef<HTMLInputElement>(null);

 const { data: allTools } = useAllTools();

 const dynamicTools = useMemo(() => {
 if (!allTools) return [];
 return allTools.map(t => {
 const iconName = t.icon || TOOL_ICONS[t.tool_key] || 'FileText';
 const IconComponent = IconMap[iconName] || IconMap['FileText'];
 return {
 id: t.tool_key,
 label: t.title,
 category: t.category,
 icon: IconComponent,
 href: t.url,
 };
 });
 }, [allTools]);

 const results = query.trim()
 ? dynamicTools.filter(t =>
 t.label.toLowerCase().includes(query.toLowerCase()) ||
 t.category.toLowerCase().includes(query.toLowerCase())
 )
 : dynamicTools.filter(t => POPULAR_KEYS.includes(t.id));

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
 <span className="nav-search-item-icon" style={{ background: GRADIENTS[category] || "linear-gradient(135deg, #3182ce, #1e3a8a)" }}>
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
