"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    const isDark = saved === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  if (!mounted) return <div className="theme-toggle-btn flex-shrink-0" />;

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="relative w-14 h-7 theme-toggle-btn rounded-full transition-colors duration-300 focus:outline-none flex-shrink-0"
      style={{ background: dark ? "#334155" : "#e2e8f0" }}
    >
      <Sun
        size={12}
        className="absolute left-1.5 top-1/2 -translate-y-1/2 text-amber-400 transition-opacity duration-200"
        style={{ opacity: dark ? 0 : 1 }}
      />
      <Moon
        size={12}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-300 transition-opacity duration-200"
        style={{ opacity: dark ? 1 : 0 }}
      />
      <span
        className={`absolute top-0.5 toggle-thumb rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${dark ? "toggle-thumb--dark" : "toggle-thumb--light"}`}
        style={{ background: dark ? "#0f172a" : "#ffffff" }}
      >
        {dark
          ? <Moon size={12} className="text-blue-400" />
          : <Sun size={12} className="text-amber-500" />
        }
      </span>
    </button>
  );
}
