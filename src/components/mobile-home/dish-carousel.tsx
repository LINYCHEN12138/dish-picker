"use client";

import Link from "next/link";
import { useMenu } from "@/providers/menu-provider";
import type { Dish } from "@/types/dish";
import { ThemeIcon } from "@/components/mobile-theme/theme-icon";

export function DishCarousel({ dishes }: { dishes: Dish[] }) {
  const { menu, toggleDish } = useMenu();
  return <section className="mobile-v2-section"><div className="mobile-v2-heading"><h2>今日精选 <span><ThemeIcon name="sparkle" size={15} /></span></h2><Link href="/dishes">查看更多 →</Link></div><div className="mobile-v2-carousel">{dishes.map((dish) => {
    const chosen = menu.some((item) => item.id === dish.id);
    return <article className={`mobile-v2-dish-card tone-${dish.tone}`} key={dish.id}><Link href={`/dishes/${dish.slug}`}><span>{dish.emoji}</span><small><ThemeIcon name="clock" size={10} />{dish.cookMinutes}分钟</small></Link><div><h3>{dish.name}</h3><button onClick={() => toggleDish(dish)}><ThemeIcon name={chosen ? "check" : "plus"} size={14} /></button></div></article>;
  })}</div></section>;
}
