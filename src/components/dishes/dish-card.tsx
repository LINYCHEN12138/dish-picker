"use client";

import Link from "next/link";
import { useMenu } from "@/providers/menu-provider";
import type { Dish } from "@/types/dish";
import { ThemeIcon } from "@/components/mobile-theme/theme-icon";

export function DishCard({ dish, compact = false }: { dish: Dish; compact?: boolean }) {
  const { menu, toggleDish } = useMenu();
  const selected = menu.some((item) => item.id === dish.id);
  return (
    <article className={`dish-card tone-${dish.tone} ${compact ? "compact" : ""}`}>
      <Link href={`/dishes/${dish.slug}`} className="dish-visual" aria-label={`查看${dish.name}`}>
        <span>{dish.emoji}</span><small>{dish.category}</small>
      </Link>
      <div className="dish-body">
        <div className="tag-row">{dish.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}</div>
        <Link href={`/dishes/${dish.slug}`}><h3>{dish.name}</h3></Link>
        <p className="dish-meta">约 {dish.cookMinutes} 分钟 · {dish.difficulty} · {dish.servings} 人份</p>
        {!compact && <p className="dish-main">{dish.ingredients.slice(0, 3).map((i) => i.name).join(" · ")}</p>}
        <button className={selected ? "add-button selected" : "add-button"} onClick={() => toggleDish(dish)}>
          <ThemeIcon name={selected ? "check" : "plus"} size={13} />{selected ? "已加入，点此移除" : "加入今晚菜单"}
        </button>
      </div>
    </article>
  );
}
