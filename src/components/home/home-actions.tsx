"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMenu } from "@/providers/menu-provider";

export function HomeActions() {
  const router = useRouter();
  const { menu, randomize } = useMenu();
  const doRandom = () => { randomize(); router.push("/menu"); };
  return (
    <>
      <section className="hero">
        <div className="hero-copy"><p className="eyebrow">SUNDAY · 好好吃饭</p><h1>今晚，想和你<br /><em>吃点什么？</em></h1><p>不必纠结太久。选几道喜欢的菜，把普通的一天认真收尾。</p></div>
        <div className="plate"><div className="plate-inner"><span>{menu.length ? menu.slice(0, 3).map((d) => d.emoji).join("") : "🍚🥬🍅"}</span><small>{menu.length ? `${menu.length} 道菜已摆上桌` : "等你来点菜"}</small></div></div>
        <div className="hero-actions"><Link href="/dishes" className="primary-button">开始点菜 <span>→</span></Link><button onClick={doRandom} className="soft-button">✦ 随机搭配</button></div>
      </section>
      <Link href="/ai" className="ai-entry"><span>✦</span><div><small>AI 点菜</small><h2>告诉我今晚的心情</h2><p>时间、口味、家里有的食材，都交给我来搭配。</p></div><i>→</i></Link>
      <section className="tonight-strip">
        <div><span className="mini-label">今晚菜单</span><h2>{menu.length ? `已经选好 ${menu.length} 道菜` : "还空着，等一道心动的菜"}</h2><p>{menu.length ? menu.map((dish) => dish.name).join(" · ") : "选好后，会自动整理买菜清单"}</p></div>
        <Link href="/menu">{menu.length ? "去看看" : "去点菜"} →</Link>
      </section>
    </>
  );
}
