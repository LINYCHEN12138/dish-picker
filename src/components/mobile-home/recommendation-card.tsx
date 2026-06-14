"use client";

import Link from "next/link";
import { useMenu } from "@/providers/menu-provider";
import type { Dish } from "@/types/dish";
import { ThemeIcon } from "@/components/mobile-theme/theme-icon";
import { useFavorites } from "@/providers/favorite-provider";

export function RecommendationCard({ dish }: { dish: Dish }) {
  const { menu, toggleDish } = useMenu();
  const { isFavorite, toggleFavorite } = useFavorites();
  const selected = menu.some((item) => item.id === dish.id);
  return <section className="mobile-v2-section"><div className="mobile-v2-heading"><h2>今日推荐 <span><ThemeIcon name="sparkle" size={15} /></span></h2><button className="favorite-action" onClick={() => toggleFavorite(dish.id)}><ThemeIcon name={isFavorite(dish.id) ? "heart" : "star"} size={15} />{isFavorite(dish.id) ? "已收藏" : "收藏"}</button></div><article className="mobile-v2-recommend"><Link className={`tone-${dish.tone}`} href={`/dishes/${dish.slug}`}><span>{dish.emoji}</span></Link><div><small><ThemeIcon name="star" size={11} />人气推荐</small><h2>{dish.name}</h2><p>{dish.description}</p><div><b><ThemeIcon name="clock" size={11} />{dish.cookMinutes}分钟</b><b><ThemeIcon name="difficulty" size={11} />{dish.difficulty}</b><b><ThemeIcon name="people" size={11} />{dish.servings}人份</b></div><button onClick={() => toggleDish(dish)}><ThemeIcon name={selected ? "check" : "plus"} size={13} />{selected ? "已加入今晚菜单" : "加入今晚菜单"}</button></div></article></section>;
}
