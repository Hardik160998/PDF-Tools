"use client";

import { useEffect, useRef, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  // Start as undefined — renders nothing until client hydrates
  const [dark, setDark] = useState<boolean | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    // Read the class that the inline <head> script already set
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  // Render a size-matched placeholder during SSR / before hydration
  // This prevents layout shift and hydration mismatch
  if (dark === null) {
    return (
      <span
        className="theme-toggle-pill flex-shrink-0"
        aria-hidden="true"
        style={{ visibility: 'hidden', pointerEvents: 'none' }}
      />
    );
  }

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
