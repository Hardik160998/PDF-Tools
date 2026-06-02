"use client";

import React, { useState, useRef, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { recordLocalToolClick } from "@/lib/toolHistory";
import { useAllTools, useDbCategories } from "@/hooks/useTools";
import { TOOL_ICONS } from "@/data/toolIcons";

// Fallback styles for dynamically fetched categories
const CATEGORY_STYLES: Record<string, { color: string; gradient: string }> = {
  Organize: { color: "#f26522", gradient: "linear-gradient(135deg, #f26522, #c2410c)" },
  Optimize: { color: "#22c55e", gradient: "linear-gradient(135deg, #22c55e, #15803d)" },
  Convert: { color: "#3182ce", gradient: "linear-gradient(135deg, #3182ce, #1e3a8a)" },
  Edit: { color: "#E8465D", gradient: "linear-gradient(135deg, #E8465D, #843286)" },
  Security: { color: "#e53e3e", gradient: "linear-gradient(135deg, #e53e3e, #7f1d1d)" },
  'Image Convert': { color: "#06b6d4", gradient: "linear-gradient(135deg, #06b6d4, #0e7490)" },
  Special: { color: "#ef4444", gradient: "linear-gradient(135deg, #ef4444, #991b1b)" },
  Ecommerce: { color: "#f26522", gradient: "linear-gradient(135deg, #f26522, #f59e0b)" },
  Sign: { color: "#8b5cf6", gradient: "linear-gradient(135deg, #8b5cf6, #5b21b6)" },
};

// Categories with many tools get 2 sub-columns
const WIDE_CATS = new Set(["Convert", "Image Convert"]);
const WRAP_CATS = new Set(["Special", "Ecommerce"]);

export default function AllToolsDropdown() {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: dbCategories } = useDbCategories();
  const { data: allTools } = useAllTools();

  const dynamicCategories = useMemo(() => {
    if (!dbCategories || !allTools) return [];

    return dbCategories.map(cat => {
      const catTools = allTools.filter(t => t.category === cat.name).map(t => {
        const iconName = t.icon || TOOL_ICONS[t.tool_key] || 'FileText';
        const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.FileText;
        return {
          id: t.tool_key,
          label: t.title,
          iconName: iconName,
          icon: IconComponent,
          href: t.url,
        };
      });

      const style = CATEGORY_STYLES[cat.name] || { color: "#3182ce", gradient: "linear-gradient(135deg, #3182ce, #1e3a8a)" };

      return {
        name: cat.name,
        color: style.color,
        gradient: style.gradient,
        tools: catTools,
      };
    }).filter(cat => cat.tools.length > 0);
  }, [dbCategories, allTools]);

  const show = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setOpen(true); };
  const hide = () => { timeoutRef.current = setTimeout(() => setOpen(false), 120); };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button className={`flex items-center gap-1 font-semibold transition-colors uppercase tracking-wide whitespace-nowrap ${open ? "text-red-500" : "text-slate-500 dark:text-slate-400 hover:text-red-500"}`}>
        ALL PDF TOOLS
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div onMouseEnter={show} onMouseLeave={hide} className="all-tools-dropdown">
          <div className="all-tools-row">
            {dynamicCategories.map((cat) => (
              <div key={cat.name} className={`all-tools-col${WIDE_CATS.has(cat.name) ? " all-tools-col--wide" : ""}${WRAP_CATS.has(cat.name) ? " all-tools-col--wrap" : ""}`}>
                {/* Category label */}
                <div className="all-tools-cat-label" style={{ color: cat.color }}>
                  {cat.name}
                </div>
                {/* Tools list — wide cats use 2-column grid */}
                <div className={WIDE_CATS.has(cat.name) ? "all-tools-grid2" : ""}>
                  {cat.tools.map(({ id, label, icon: Icon, iconName, href }: any) => (
                    <a
                      key={id}
                      href={href ?? `/tool/${id}`}
                      className="all-tools-item"
                      onClick={() =>
                        recordLocalToolClick({
                          toolKey: id,
                          title: label,
                          url: href ?? `/tool/${id}`,
                          category: cat.name,
                          iconName: iconName,
                          categoryColor: cat.color,
                        })
                      }
                    >
                      <span className="all-tools-icon" style={{ background: cat.gradient }}>
                        {Icon && <Icon size={18} />}
                      </span>
                      <span className="all-tools-label">{label}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}