"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 animate-pulse"></div>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 transition-colors duration-300 ring-1 ring-black/5 dark:ring-white/5 focus:outline-none"
      aria-label="Toggle Theme"
    >
      <Sun className={`w-5 h-5 absolute inset-0 m-auto transition-transform duration-500 ${isDark ? "rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"}`} />
      <Moon className={`w-5 h-5 absolute inset-0 m-auto transition-transform duration-500 ${isDark ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50"}`} />
      {/* Invisible placeholder to keep button size stable */}
      <div className="w-5 h-5 opacity-0"></div>
    </button>
  );
}
