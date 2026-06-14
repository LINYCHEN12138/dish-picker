"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { mobileThemes } from "@/config/mobile-themes";
import type { MobileThemeConfig, MobileThemeId } from "@/types/theme";

type ThemeContextValue = { themeId: MobileThemeId; theme: MobileThemeConfig; setTheme: (theme: MobileThemeId) => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);
const KEY = "meal-planner-mobile-theme-v2";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<MobileThemeId>("hachiware");
  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === "hachiware" || saved === "usagi") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeId(saved);
    }
  }, []);
  const setTheme = (next: MobileThemeId) => { localStorage.setItem(KEY, next); setThemeId(next); };
  const value = useMemo(() => ({ themeId, theme: mobileThemes[themeId], setTheme }), [themeId]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useMobileTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useMobileTheme must be used inside ThemeProvider");
  return context;
}
