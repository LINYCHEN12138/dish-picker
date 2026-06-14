"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMenu } from "@/providers/menu-provider";
import { ThemeIcon } from "@/components/mobile-theme/theme-icon";

export function RandomDishButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { randomize } = useMenu();
  const [rolling, setRolling] = useState(false);
  const roll = () => {
    setRolling(true);
    window.setTimeout(() => { randomize(); router.push("/menu"); }, 520);
  };
  return <button className={`mobile-v2-random ${compact ? "compact" : ""} ${rolling ? "rolling" : ""}`} onClick={roll} disabled={rolling}><span><ThemeIcon name={rolling ? "sparkle" : "random"} size={17} /></span>{rolling ? "正在挑今晚的菜…" : "随机点菜"}</button>;
}
