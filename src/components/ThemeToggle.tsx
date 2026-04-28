"use client";

import { useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className={`theme-toggle-pill focus:outline-none flex-shrink-0 ${dark ? "theme-toggle-pill--dark" : "theme-toggle-pill--light"}`}
    >
      <Sun  size={11} className="toggle-track-icon toggle-track-icon--sun" />
      <Moon size={11} className="toggle-track-icon toggle-track-icon--moon" />
      <span className="toggle-thumb-pill">
        {dark ? <Moon size={11} /> : <Sun size={11} />}
      </span>
    </button>
  );
}
