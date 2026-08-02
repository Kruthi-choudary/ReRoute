import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const THEME_KEY = "reroute_theme";

function applyTheme(theme: Theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    if (stored === "dark" || stored === "light") return stored;
    return "light";
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  function toggle() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  return { theme, setTheme, toggle, isDark: theme === "dark" };
}

export function initTheme() {
  if (typeof document === "undefined") return;
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  const theme: Theme = stored ?? "light";
  applyTheme(theme);
}
