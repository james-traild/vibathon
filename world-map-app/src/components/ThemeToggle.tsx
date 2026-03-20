"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2 rounded-full bg-zinc-800 dark:bg-zinc-200 px-3 py-2 shadow-lg transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-300"
    >
      <span className="text-sm">{isDark ? "☀️" : "🌙"}</span>
      <div className="relative h-5 w-9 rounded-full bg-zinc-600 dark:bg-zinc-400 transition-colors">
        <div
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            isDark ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </div>
    </button>
  );
}
