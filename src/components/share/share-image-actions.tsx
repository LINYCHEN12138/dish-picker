"use client";

import { useRef, useState } from "react";
import { MenuSharePoster } from "@/components/share/menu-share-poster";
import { ThemeIcon } from "@/components/mobile-theme/theme-icon";
import { copyText, showManualCopy } from "@/lib/copy-text";
import { createShareImage, shareImageFile } from "@/lib/share-image";
import { createShareText } from "@/lib/menu-utils";
import type { Dish } from "@/types/dish";

type Status = "idle" | "generating" | "shared" | "downloaded" | "failed" | "copied";
const labels: Record<Status, string> = { idle: "分享备忘卡", generating: "正在制作小卡片…", shared: "分享面板已打开", downloaded: "图片已保存", failed: "生成失败，请重试", copied: "文字清单已复制" };

export function ShareImageActions({ menu, compact = false }: { menu: Dish[]; compact?: boolean }) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const reset = () => setTimeout(() => setStatus("idle"), 2200);
  const share = async () => {
    if (!posterRef.current || status === "generating") return;
    setStatus("generating");
    try {
      const result = await shareImageFile(await createShareImage(posterRef.current));
      setStatus(result);
    } catch (error) {
      setStatus(error instanceof Error && error.name === "AbortError" ? "idle" : "failed");
    }
    reset();
  };
  const copy = async () => {
    const text = createShareText(menu);
    const copied = await copyText(text);
    if (!copied) showManualCopy(text);
    setStatus(copied ? "copied" : "failed");
    reset();
  };
  return <>
    <MenuSharePoster ref={posterRef} menu={menu} />
    <div className={compact ? "share-image-actions compact" : "share-image-actions"}>
      <button className="primary-button" onClick={share} disabled={status === "generating"}><ThemeIcon name="send" size={17} />{labels[status]}</button>
      <button className="soft-button" onClick={copy}><ThemeIcon name="chat" size={16} />复制文字</button>
    </div>
  </>;
}
