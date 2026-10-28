import React, { createContext, useContext, useEffect, useLayoutEffect, useState, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
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

/**
 * 채널별 고정 단일 테마 판별:
 * - 루시프로 (/chat/pro) -> 밤하늘 다크 테마 ('dark')
 * - 키채널 (/key, /calm, /orb, /gateway, /crystal) -> 라이트 테마 ('light')
 * - 럭키채널 (7대 프리즘 채널, 허브, 핸드북, 옴니워프 등 기타 모든 경로) -> 다크 테마 ('dark')
 */
export function resolveChannelThemeFromPath(pathname?: string): ResolvedTheme {
  const raw = pathname ?? (typeof window !== "undefined" ? window.location.pathname : "/");
  const clean = (raw || "/").split("?")[0].split("#")[0].toLowerCase();

  if (clean === "/chat/pro") return "dark";
  if (["/", "/chat", "/lucy"].includes(clean)) return "light";

  if (
    clean === "/key" ||
    clean.startsWith("/key/") ||
    clean === "/calm" ||
    clean.startsWith("/calm/") ||
    clean === "/orb" ||
    clean.startsWith("/orb/") ||
    clean === "/gateway" ||
    clean.startsWith("/gateway/") ||
    clean === "/crystal" ||
    clean.startsWith("/crystal/")
  ) {
    return "light";
  }

  return "dark";
}

function applyThemeToDocument(resolvedTheme: ResolvedTheme) {
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
}

const defaultThemeContext: ThemeContextType = {
  theme: "light",
  themeMode: "light",
  resolvedTheme: "light",
  setThemeMode: () => {},
  toggleTheme: () => {},
  switchable: false,
};

const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
  switchable?: boolean;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [location] = useLocation();
  const [windowPath, setWindowPath] = useState<string>(() =>
    typeof window !== "undefined" ? window.location.pathname : "/"
  );

  // Clean up any legacy user-selected theme storage keys once
  useEffect(() => {
    try {
      safeLocalStorage.removeItem("prism_theme_mode");
      safeLocalStorage.removeItem("theme");
    } catch (_) {}
  }, []);

  // Keep in sync with custom prism-navigate and browser popstate events
  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncPath = () => {
      setWindowPath(window.location.pathname || "/");
    };
    const handlePrismNavigate = (e: Event) => {
      const target = (e as CustomEvent)?.detail?.path;
      if (typeof target === "string" && target) {
        setWindowPath(target);
      } else {
        syncPath();
      }
    };
    window.addEventListener("popstate", syncPath);
    window.addEventListener("prism-navigate", handlePrismNavigate);
    return () => {
      window.removeEventListener("popstate", syncPath);
      window.removeEventListener("prism-navigate", handlePrismNavigate);
    };
  }, []);

  const activePath = location || windowPath || "/";
  const resolvedTheme: ResolvedTheme = useMemo(
    () => resolveChannelThemeFromPath(activePath),
    [activePath]
  );

  // Synchronously apply theme class before paint on route transitions
  useLayoutEffect(() => {
    applyThemeToDocument(resolvedTheme);

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("prism:theme_changed", {
          detail: { themeMode: resolvedTheme, resolvedTheme },
        })
      );
    }
  }, [resolvedTheme]);

  // No-op setters since theme is strictly bound per channel
  const setThemeMode = useCallback((_mode: ThemeMode) => {}, []);
  const toggleTheme = useCallback(() => {}, []);

  const value = useMemo<ThemeContextType>(
    () => ({
      theme: resolvedTheme,
      themeMode: resolvedTheme,
      resolvedTheme,
      setThemeMode,
      toggleTheme,
      switchable: false,
    }),
    [resolvedTheme, setThemeMode, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  return context || defaultThemeContext;
}
