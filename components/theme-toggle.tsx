"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const storageKey = "codingdolphin-theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      const preferred =
        saved === "dark" ||
        (saved === null && matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.dataset.theme = preferred ? "dark" : "light";
      setDark(preferred);
    } catch {
      document.documentElement.dataset.theme = "light";
    }
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem(storageKey, next ? "dark" : "light");
    } catch {
      /* The switch still works for this visit. */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="site-theme-toggle"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
    >
      {dark ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}
      <span>{dark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
