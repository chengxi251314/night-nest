"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Theme = "dark" | "warm";

const ThemeCtx = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({ theme: "dark", setTheme: () => {} });
export function useTheme() { return useContext(ThemeCtx); }

const themeCSS: Record<Theme, string> = {
  dark: `
    :root { --bg: #030310; --surface: rgba(14,14,36,0.75); --text: #f0edf6; --muted: #8a87a0; --border: rgba(255,255,255,0.05); }
    body { background: var(--bg); color: var(--text); }
  `,
  light: `
    :root { --bg: #f5f3fa; --surface: rgba(255,255,255,0.9); --text: #1a1a2e; --muted: #6b6880; --border: rgba(0,0,0,0.06); }
    body { background: var(--bg); color: var(--text); }
    body::before { opacity: 0.3 !important; }
    #stars-canvas { opacity: 0.15; }
  `,
  warm: `
    :root { --bg: #1a1410; --surface: rgba(30,22,16,0.85); --text: #f0e8d8; --muted: #a09880; --border: rgba(255,215,138,0.08); }
    body { background: var(--bg); color: var(--text); }
    body::before { background: radial-gradient(ellipse 80% 50% at 20% 15%, rgba(200,152,80,0.08), transparent 50%), radial-gradient(ellipse 60% 40% at 80% 25%, rgba(255,142,199,0.04), transparent 50%), radial-gradient(ellipse 40% 30% at 50% 80%, rgba(255,180,100,0.04), transparent 50%) !important; }
  `,
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("nn_theme") as Theme;
    if (saved && themeCSS[saved]) setTheme(saved);
  }, []);

  useEffect(() => {
    const style = document.getElementById("theme-style") || document.createElement("style");
    style.id = "theme-style";
    style.textContent = themeCSS[theme];
    if (!document.getElementById("theme-style")) document.head.appendChild(style);
    localStorage.setItem("nn_theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return <ThemeCtx.Provider value={{ theme, setTheme }}>{children}</ThemeCtx.Provider>;
}
