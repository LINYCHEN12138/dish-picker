"use client";

import { forwardRef } from "react";
import { buildShoppingList } from "@/lib/menu-utils";
import { useMobileTheme } from "@/providers/theme-provider";
import type { Dish } from "@/types/dish";

const today = () =>
  new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date());

export const MenuSharePoster = forwardRef<HTMLDivElement, { menu: Dish[] }>(
  function MenuSharePoster({ menu }, ref) {
    const { theme } = useMobileTheme();
    const groups = buildShoppingList(menu);
    const buy = groups.filter((group) => group.category !== "pantry");
    const pantry = groups.find((group) => group.category === "pantry");
    const estimatedTime =
      Math.max(...menu.map((dish) => dish.cookMinutes), 0) +
      (menu.length > 2 ? 10 : 5);

    return (
      <div className="share-poster-capture" aria-hidden="true">
        <article
          className={`share-poster share-poster-${theme.id}`}
          ref={ref}
          style={
            {
              "--poster-primary": theme.primaryColor,
              "--poster-secondary": theme.secondaryColor,
              "--poster-text": theme.textColor,
              "--poster-muted": theme.mutedTextColor,
              "--poster-background": `url(${theme.backgroundImage})`,
              "--poster-character": `url(/assets/themes/${theme.id}-share-character.png)`,
            } as React.CSSProperties
          }
        >
          <div className="share-poster-dots" />

          <header className="share-poster-header">
            <div className="share-poster-heading">
              <span className="share-poster-kicker">今晚的买菜备忘</span>
              <h1>今晚吃这些</h1>
              <p>
                {today()} · 两人晚餐 · 约 {estimatedTime} 分钟
              </p>
            </div>
            <div className="share-poster-character" role="img" aria-label={theme.name}>
              <span>{theme.name}陪你吃饭</span>
            </div>
          </header>

          <section className="share-poster-menu">
            <div className="share-poster-section-heading">
              <span>MENU</span>
              <h2>这顿饭吃什么</h2>
              <b>{menu.length} 道</b>
            </div>
            <div className="share-poster-dishes">
              {menu.map((dish) => (
                <div key={dish.id}>
                  <b>{dish.emoji || "🍽️"}</b>
                  <span>
                    <strong>{dish.name}</strong>
                    <small>
                      {dish.cookMinutes} 分钟 · {dish.difficulty}
                    </small>
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="share-poster-shopping-section">
            <div className="share-poster-section-heading">
              <span>LIST</span>
              <h2>买菜备忘清单</h2>
              <b>照着买就好</b>
            </div>
            <div className="share-poster-shopping">
              {buy.map((group) => (
                <div key={group.category}>
                  <h3>{group.label}</h3>
                  <p>
                    {group.items
                      .map((item) => `${item.name} ${item.displayAmount}`)
                      .join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="share-poster-pantry">
            <span>出门前确认</span>
            <p>
              {pantry?.items.map((item) => `□ ${item.name}`).join("　") ||
                "□ 盐　□ 生抽　□ 食用油"}
            </p>
          </section>

          <footer className="share-poster-footer">
            <div>
              <strong>她负责买菜，我负责期待</strong>
              <span>做饭时打开「今天吃什么」查看今晚菜单和完整教程</span>
            </div>
            <b>dish-picker-web.vercel.app</b>
          </footer>
        </article>
      </div>
    );
  },
);
