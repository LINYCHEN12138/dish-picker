"use client";

import { BottomNavigation } from "./bottom-navigation";
import { DynamicBackground } from "@/components/mobile-theme/dynamic-background";
import { useMobileTheme } from "@/providers/theme-provider";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { themeId, theme } = useMobileTheme();
  return (
    <div className="app-shell mobile-v2-shell" data-theme={themeId} style={{
      "--theme-primary": theme.primaryColor,
      "--theme-secondary": theme.secondaryColor,
      "--theme-accent": theme.accentColor,
      "--theme-text": theme.textColor,
      "--theme-muted": theme.mutedTextColor,
      "--theme-card": theme.cardBackground,
      "--theme-border": theme.cardBorder,
      "--theme-button-gradient": theme.buttonGradient,
      "--theme-shadow": theme.shadowColor,
    } as React.CSSProperties}>
      <DynamicBackground />
      <main className="page">{children}</main>
      <BottomNavigation />
    </div>
  );
}
