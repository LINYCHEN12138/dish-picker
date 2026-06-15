"use client";

import { toBlob } from "html-to-image";

export async function createShareImage(node: HTMLElement) {
  const blob = await toBlob(node, { cacheBust: true, pixelRatio: 2, backgroundColor: "#fffdf8" });
  if (!blob) throw new Error("SHARE_IMAGE_EMPTY");
  return new File([blob], "今晚菜单备忘卡.png", { type: "image/png" });
}

export async function shareImageFile(file: File) {
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: "今晚菜单备忘卡", text: "今晚一起吃这些，买菜清单也整理好啦。" });
    return "shared" as const;
  }
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return "downloaded" as const;
}
