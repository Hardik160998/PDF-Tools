"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
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
  Ecommerce: "linear-gradient(135deg, #f26522, #f59e0b)",
  Sign: "linear-gradient(135deg, #8b5cf6, #ec4899)",
};

export default function MobileSearch() {
 const [open, setOpen] = useState(false);
 const [query, setQuery] = useState("");
 const inputRef = useRef<HTMLInputElement>(null);

 const { data: allTools } = useAllTools();

 const dynamicTools = useMemo(() => {
 if (!allTools) return [];
 return allTools.map(t => {
 const iconName = t.icon || TOOL_ICONS[t.tool_key] || 'FileText';
 const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.FileText;
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
 : dynamicTools;

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
 <span className="nav-search-item-icon" style={{ background: GRADIENTS[category] || "linear-gradient(135deg, #3182ce, #1e3a8a)" }}>
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
