"use client";

import { useState } from "react";
import { createShareText } from "@/lib/menu-utils";
import { useMenu } from "@/providers/menu-provider";
import type { Dish } from "@/types/dish";
import { ThemeIcon, type ThemeIconName } from "@/components/mobile-theme/theme-icon";
import { copyText, showManualCopy } from "@/lib/copy-text";

export function ShareCard({ fallbackDish }: { fallbackDish: Dish }) {
  const { menu, saveHistory } = useMenu();
  const [message, setMessage] = useState("");
  const shareMenu = menu.length ? menu : [fallbackDish];
  const copy = async (label: string) => {
    const text = createShareText(shareMenu);
    const copied = await copyText(text);
    if (!copied) showManualCopy(text);
    setMessage(copied ? `${label}内容已复制` : "请在弹窗中复制");
    setTimeout(() => setMessage(""), 1600);
  };
  const actions: { icon: ThemeIconName; label: string }[] = [{ icon: "send", label: "发给她" }, { icon: "chat", label: "微信" }, { icon: "chat", label: "QQ" }, { icon: "together", label: "一起做饭" }];
  return <section className="mobile-v2-share"><header><h2>分享给她 <ThemeIcon name="heart" size={16} /></h2><small>{message || "今晚一起好好吃饭"}</small></header><div>{actions.map((action) => <button onClick={() => copy(action.label)} key={action.label}><span><ThemeIcon name={action.icon} /></span>{action.label}</button>)}<button onClick={saveHistory}><span><ThemeIcon name="star" /></span>保存今晚</button></div></section>;
}
