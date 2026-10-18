import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { safeLocalStorage } from "../utils/safeStorage";

export type ThemeMode = "light" | "dark" | "auto";
export type ResolvedTheme = "light" | "dark";

export interface ThemeContextType {
  theme: ResolvedTheme;
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  switchable: boolean;
}

const defaultThemeContext: ThemeContextType = {
  theme: "dark",
  themeMode: "auto",
  resolvedTheme: "dark",
  setThemeMode: () => {},
  toggleTheme: () => {},
  switchable: true,
};

const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
  switchable?: boolean;
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch (_) {
    return "dark";
  }
}

export function ThemeProvider({
  children,
  defaultMode = "auto",
  switchable = true,
}: ThemeProviderProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return defaultMode;
    try {
      const stored = safeLocalStorage.getItem("prism_theme_mode") || safeLocalStorage.getItem("theme");
      if (stored === "light" || stored === "dark" || stored === "auto") {
        return stored;
      }
    } catch (_) {}
    return defaultMode;
  });

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => getSystemTheme());

  // Listen to OS system color-scheme changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        setSystemTheme(e.matches ? "dark" : "light");
      };
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      } else if ((mediaQuery as any).addListener) {
        (mediaQuery as any).addListener(handleChange);
        return () => (mediaQuery as any).removeListener(handleChange);
      }
    } catch (_) {}
  }, []);

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (themeMode === "auto") {
      return systemTheme;
    }
    return themeMode;
  }, [themeMode, systemTheme]);

  // Synchronize documentElement class and attribute
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
    }

    if (switchable) {
      try {
        safeLocalStorage.setItem("prism_theme_mode", themeMode);
        safeLocalStorage.setItem("theme", resolvedTheme);
      } catch (_) {}
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("prism:theme_changed", {
          detail: { themeMode, resolvedTheme },
        })
      );
    }
  }, [resolvedTheme, themeMode, switchable]);

  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      setThemeModeState(mode);
      if (switchable) {
        try {
          safeLocalStorage.setItem("prism_theme_mode", mode);
        } catch (_) {}
      }
    },
    [switchable]
  );

  const toggleTheme = useCallback(() => {
    setThemeModeState((prev) => (prev === "light" ? "dark" : prev === "dark" ? "auto" : "light"));
  }, []);

  const value = useMemo<ThemeContextType>(
    () => ({
      theme: resolvedTheme,
      themeMode,
      resolvedTheme,
      setThemeMode,
      toggleTheme,
      switchable,
    }),
    [resolvedTheme, themeMode, setThemeMode, toggleTheme, switchable]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  return context || defaultThemeContext;
}
