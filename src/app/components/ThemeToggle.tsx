"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Initialize theme on component mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (storedTheme === "dark" || storedTheme === "light") {
      setTheme(storedTheme);
    } else {
      setTheme("system");
    }

    setResolvedTheme(
      storedTheme === "dark" || (storedTheme !== "light" && systemPrefersDark)
        ? "dark"
        : "light"
    );

    setMounted(true);
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    if (theme === "system") {
      localStorage.removeItem("theme");
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setResolvedTheme(systemPrefersDark ? "dark" : "light");
    } else {
      localStorage.setItem("theme", theme);
      setResolvedTheme(theme);
    }

    if (resolvedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme, resolvedTheme, mounted]);

  const toggleTheme = () => {
    if (theme === "system") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else setTheme("system");
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={`
        relative w-10 h-10 rounded-full flex items-center justify-center
        transition-all duration-300 ease-in-out
        bg-gradient-to-br from-indigo-100 to-purple-100
        dark:from-indigo-900 dark:to-purple-900
        shadow-lg hover:shadow-xl
        ring-2 ring-transparent hover:ring-indigo-400 dark:hover:ring-purple-300
        focus:outline-none focus:ring-3 focus:ring-indigo-500 dark:focus:ring-purple-400
        overflow-hidden
      `}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 opacity-0 dark:opacity-100 transition-opacity duration-300" />

      {/* Icons container */}
      <div className="relative w-6 h-6">
        {/* Sun icon - light mode */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`
            absolute top-0 left-0 w-full h-full transition-all duration-300
            ${
              resolvedTheme === "light"
                ? "text-amber-500 scale-100 opacity-100"
                : "scale-0 opacity-0"
            }
          `}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>

        {/* Moon icon - dark mode */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`
            absolute top-0 left-0 w-full h-full transition-all duration-300
            ${
              resolvedTheme === "dark"
                ? "text-indigo-200 scale-100 opacity-100"
                : "scale-0 opacity-0"
            }
          `}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>

        {/* System preference indicator */}
        {theme === "system" && (
          <div
            className={`
            absolute -bottom-1 -right-1 w-3 h-3 rounded-full
            transition-all duration-300
            ${resolvedTheme === "dark" ? "bg-purple-400" : "bg-indigo-500"}
          `}
          />
        )}
      </div>

      {/* Tooltip */}
      <div
        className={`
        absolute bottom-full mb-2 px-3 py-1 text-xs font-medium rounded-lg
        bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900
        shadow-lg transition-opacity duration-200 opacity-0 pointer-events-none
        group-hover:opacity-100
        whitespace-nowrap
      `}
      >
        {theme === "system"
          ? `System: ${resolvedTheme === "dark" ? "Dark" : "Light"}`
          : theme === "dark"
          ? "Dark mode"
          : "Light mode"}
      </div>
    </button>
  );
}
