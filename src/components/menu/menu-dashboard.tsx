"use client";

import Link from "next/link";
import { useMenu } from "@/providers/menu-provider";
import { ThemeIcon } from "@/components/mobile-theme/theme-icon";
import { useShoppingList } from "@/hooks/useShoppingList";
import { ShareImageActions } from "@/components/share/share-image-actions";

export function MenuDashboard() {
  const { menu, hydrated, removeDish, randomize, clearMenu, saveHistory } = useMenu();
  const { groups, items: savedShoppingItems, persist: saveShopping, toggle: toggleShopping, hasSavedList } = useShoppingList(menu);

  if (!hydrated) return <div className="loading-card"><span /><span /><span /></div>;

  if (!menu.length) return (
    <div className="empty-card large"><span><ThemeIcon name="chef" size={42} /></span><h2>今晚的餐桌还空着</h2><p>挑两三道喜欢的，或者让我们帮你搭配一桌。</p><button className="primary-button" onClick={randomize}><ThemeIcon name="random" size={17} />随机搭配三道菜</button><Link href="/dishes" className="text-link">自己慢慢挑 →</Link></div>
  );

  return (
    <div className="menu-stack mobile-v2-core-page">
      <section className="menu-section">
        <div className="section-head"><div><span className="mini-label">Tonight</span><h2>今晚菜单</h2></div><button onClick={randomize}>换一桌</button></div>
        <div className="selected-list">{menu.map((dish) => <div className={`selected-dish tone-${dish.tone}`} key={dish.id}><span>{dish.emoji}</span><div><h3>{dish.name}</h3><p>{dish.cookMinutes} 分钟 · {dish.tags[0]}</p></div><button onClick={() => removeDish(dish.id)} aria-label={`移除${dish.name}`}>×</button></div>)}</div>
      </section>
      <section className="menu-section">
        <div className="section-head"><div><span className="mini-label">Shopping list</span><h2>买菜清单</h2></div><button onClick={saveShopping}>{hasSavedList ? "重新生成" : "保存清单"}</button></div>
        {hasSavedList ? <div className="shopping-groups"><div className="shopping-group"><h3>已保存购物清单</h3>{savedShoppingItems.map((item) => <label key={item.id}><input type="checkbox" checked={item.checked} onChange={() => toggleShopping(item.id)} /><span>{item.name}</span><small>{item.displayAmount}</small></label>)}</div></div> : <div className="shopping-groups">{groups.map((group) => <div className={group.category === "pantry" ? "shopping-group pantry" : "shopping-group"} key={group.category}><h3>{group.label}</h3>{group.items.map((item) => <label key={`${item.name}-${item.unit}`}><input type="checkbox" /><span>{item.name}</span><small>{item.displayAmount}</small></label>)}</div>)}</div>}
      </section>
      <section className="menu-section">
        <div className="section-head"><div><span className="mini-label">How to cook</span><h2>做菜顺序</h2></div></div>
        <div className="tutorial-list">{menu.map((dish, index) => <Link href={`/dishes/${dish.slug}`} key={dish.id}><b>{String(index + 1).padStart(2, "0")}</b><span><strong>{dish.name}</strong><small>{dish.steps.map((step) => step.title).join(" → ")}</small></span><i>→</i></Link>)}</div>
      </section>
      <section className="menu-section menu-share-section"><div className="section-head"><div><span className="mini-label">Share tonight</span><h2>分享今晚备忘卡</h2></div></div><p>把今晚菜单和买菜清单做成一张精美图片，直接发给她。</p><ShareImageActions menu={menu} compact /></section>
      <div className="sticky-actions"><button className="soft-button" onClick={saveHistory}>保存今晚</button></div>
      <button className="danger-link" onClick={clearMenu}>清空今晚菜单</button>
    </div>
  );
}
