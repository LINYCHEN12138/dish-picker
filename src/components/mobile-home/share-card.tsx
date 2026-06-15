"use client";

import { useMenu } from "@/providers/menu-provider";
import type { Dish } from "@/types/dish";
import { ThemeIcon } from "@/components/mobile-theme/theme-icon";
import { ShareImageActions } from "@/components/share/share-image-actions";

export function ShareCard({ fallbackDish }: { fallbackDish: Dish }) {
  const { menu, saveHistory } = useMenu();
  const shareMenu = menu.length ? menu : [fallbackDish];
  return <section className="mobile-v2-share"><header><h2>分享给她 <ThemeIcon name="heart" size={16} /></h2><small>今晚菜单和买菜清单，做成一张小卡片</small></header><ShareImageActions menu={shareMenu} /><button className="share-save-history" onClick={saveHistory}><ThemeIcon name="star" size={16} />保存今晚菜单</button></section>;
}
