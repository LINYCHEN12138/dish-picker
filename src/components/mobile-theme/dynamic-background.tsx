"use client";

import { useMobileTheme } from "@/providers/theme-provider";

export function DynamicBackground() {
  const { theme } = useMobileTheme();
  return <div className="mobile-v2-background" style={{ backgroundImage: `url("${theme.backgroundImage}")` }} aria-hidden="true"><span /></div>;
}
