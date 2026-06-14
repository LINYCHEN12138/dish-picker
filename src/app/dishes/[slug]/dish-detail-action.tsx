"use client";

import { useMenu } from "@/providers/menu-provider";
import type { Dish } from "@/types/dish";
import { ThemeIcon } from "@/components/mobile-theme/theme-icon";
import { useFavorites } from "@/providers/favorite-provider";

export function DishDetailAction({ dish }: { dish: Dish }) {
  const { menu, toggleDish } = useMenu();
  const { isFavorite, toggleFavorite } = useFavorites();
  const selected = menu.some((item) => item.id === dish.id);
  return <div className="detail-actions"><button className="soft-button" onClick={() => toggleFavorite(dish.id)}><ThemeIcon name={isFavorite(dish.id) ? "heart" : "star"} size={16} />{isFavorite(dish.id) ? "取消收藏" : "收藏菜谱"}</button><button className={selected ? "primary-button selected-wide" : "primary-button"} onClick={() => toggleDish(dish)}><ThemeIcon name={selected ? "check" : "plus"} size={16} />{selected ? "已加入今晚菜单，点此移除" : "加入今晚菜单"}</button></div>;
}
