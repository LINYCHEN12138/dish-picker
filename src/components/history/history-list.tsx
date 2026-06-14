"use client";

import { useRouter } from "next/navigation";
import { useMenu } from "@/providers/menu-provider";

export function HistoryList() {
  const router = useRouter();
  const { history, hydrated, restoreHistory, deleteHistory } = useMenu();
  if (!hydrated) return <div className="loading-card"><span /><span /><span /></div>;
  if (!history.length) return <div className="empty-card large"><span>📖</span><h2>还没有晚餐回忆</h2><p>在今晚菜单里保存一次，就能在这里再次找到它。</p></div>;
  return <div className="history-list">{history.map((entry) => <article key={entry.id}><div className="history-date"><span>{new Date(entry.createdAt).toLocaleDateString("zh-CN", { month: "long", day: "numeric" })}</span><small>{new Date(entry.createdAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}</small></div><div className="history-emojis">{entry.dishSnapshots.map((dish) => dish.emoji).join(" ")}</div><h2>{entry.dishSnapshots.map((dish) => dish.name).join("、")}</h2><p>{entry.dishSnapshots.length} 道菜 · 一顿认真吃过的晚餐</p><div><button onClick={() => { restoreHistory(entry); router.push("/menu"); }}>再吃一次</button><button className="muted-button" onClick={() => deleteHistory(entry.id)}>删除</button></div></article>)}</div>;
}
