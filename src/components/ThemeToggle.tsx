"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // Render a size-matched placeholder during SSR / before hydration
  // This prevents layout shift and hydration mismatch
  if (theme === null) {
    return (
      <div
        className="theme-toggle-pill flex-shrink-0"
        aria-hidden="true"
        style={{ opacity: 0, pointerEvents: 'none' }}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={`theme-toggle-pill focus:outline-none flex-shrink-0 ${isDark ? "theme-toggle-pill--dark" : "theme-toggle-pill--light"}`}
    >
      <Sun  size={11} className="toggle-track-icon toggle-track-icon--sun" />
      <Moon size={11} className="toggle-track-icon toggle-track-icon--moon" />
      <span className="toggle-thumb-pill">
        {isDark ? <Moon size={11} /> : <Sun size={11} />}
      </span>
    </button>
  );
}
