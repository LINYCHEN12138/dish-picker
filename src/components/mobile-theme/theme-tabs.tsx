"use client";

import { mobileThemes } from "@/config/mobile-themes";
import { useMobileTheme } from "@/providers/theme-provider";
import type { MobileThemeId } from "@/types/theme";
import { ThemeAvatar, ThemeIcon } from "./theme-icon";

export function ThemeTabs() {
  const { themeId, setTheme } = useMobileTheme();
  return <div className="mobile-v2-theme-tabs">{(Object.keys(mobileThemes) as MobileThemeId[]).map((id) => {
    const theme = mobileThemes[id];
    return <button className={id === themeId ? "active" : ""} onClick={() => setTheme(id)} key={id}><ThemeAvatar image={theme.backgroundImage} label={theme.name} />{theme.name}<small><ThemeIcon name="sparkle" size={13} /></small></button>;
  })}</div>;
}
