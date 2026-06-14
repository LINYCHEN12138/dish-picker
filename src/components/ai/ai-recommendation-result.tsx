"use client";

import { useState } from "react";
import Link from "next/link";
import { buildShoppingList, createShareText } from "@/lib/menu-utils";
import { useMenu } from "@/providers/menu-provider";
import type { AiMenuResponse } from "@/types/ai";
import { copyText, showManualCopy } from "@/lib/copy-text";
import { useDishes } from "@/providers/dish-provider";

export function AiRecommendationResult({ result, onRetry }: { result: AiMenuResponse; onRetry: () => void }) {
  const { dishes } = useDishes();
  const { addDishes } = useMenu();
  const [feedback, setFeedback] = useState("");
  const selected = result.dishIds.map((id) => dishes.find((dish) => dish.id === id)).filter((dish): dish is NonNullable<typeof dish> => Boolean(dish));
  const shopping = buildShoppingList(selected).filter((group) => group.category !== "pantry");
  const applyMenu = () => {
    addDishes(selected);
    setFeedback("已追加到今晚菜单");
    setTimeout(() => setFeedback(""), 1800);
  };
  const copy = async () => {
    const text = `${result.menuName}\n${result.reason}\n\n${createShareText(selected)}`;
    const copied = await copyText(text);
    if (!copied) showManualCopy(text);
    setFeedback(copied ? "推荐和买菜清单已复制" : "请在弹窗中复制");
    setTimeout(() => setFeedback(""), 1800);
  };

  return (
    <section className="ai-result">
      {result.notice && <div className="ai-notice">{result.notice}</div>}
      <div className="ai-result-head"><div><span className="mini-label">{result.source === "ai" ? "AI 推荐" : "本地智能搭配"}</span><h2>{result.menuName}</h2><p>{result.reason}</p></div><div className="time-orb"><b>{result.estimatedTime}</b><small>分钟上桌</small></div></div>
      <div className="ai-menu-cards">{selected.map((dish) => <Link href={`/dishes/${dish.slug}`} className={`ai-menu-card tone-${dish.tone}`} key={dish.id}><span>{dish.emoji}</span><div><h3>{dish.name}</h3><p>{dish.category} · {dish.cookMinutes} 分钟</p></div><i>→</i></Link>)}</div>
      <div className="ai-result-grid">
        <article><span className="mini-label">买菜提醒</span>{result.shoppingTips.map((tip) => <p key={tip}>· {tip}</p>)}{shopping.slice(0, 3).map((group) => <small key={group.category}><b>{group.label}</b>：{group.items.map((item) => item.name).join("、")}</small>)}</article>
        <article><span className="mini-label">做菜顺序</span>{result.cookOrder.map((step) => <p key={step}>{step}</p>)}</article>
      </div>
      {result.notes.length > 0 && <div className="ai-notes">{result.notes.map((note) => <span key={note}>○ {note}</span>)}</div>}
      <div className="ai-result-actions"><button className="soft-button" onClick={onRetry}>换一套</button><button className="soft-button" onClick={copy}>复制分享</button><button className="primary-button" onClick={applyMenu}>{feedback || "加入今晚菜单"}</button></div>
      <Link className="ai-menu-link" href="/menu">查看今晚菜单 →</Link>
    </section>
  );
}
