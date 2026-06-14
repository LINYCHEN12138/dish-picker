"use client";

import { useEffect, useMemo, useState } from "react";
import { buildShoppingList } from "@/lib/menu-utils";
import { listLatestShoppingList, saveShoppingList, updateShoppingChecked } from "@/services/shoppingListService";
import { useSession } from "@/providers/session-provider";
import type { Dish } from "@/types/dish";
import type { ShoppingListItem } from "@/types/shopping";

const LOCAL_KEY = "meal-planner-shopping-v3";

export function useShoppingList(menu: Dish[]) {
  const { user } = useSession();
  const groups = useMemo(() => buildShoppingList(menu), [menu]);
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try { setItems(JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]")); } catch { setItems([]); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (user) listLatestShoppingList(user.id).then((cloudItems) => { if (cloudItems.length) setItems(cloudItems); }).catch((error) => console.error("[useShoppingList] Failed to load shopping list", error));
  }, [user]);
  useEffect(() => { localStorage.setItem(LOCAL_KEY, JSON.stringify(items)); }, [items]);
  const persist = async () => {
    if (!menu.length) return;
    const listId = crypto.randomUUID();
    const localItems = groups.flatMap((group) => group.items.map((item) => ({
      id: crypto.randomUUID(),
      listId,
      name: item.name,
      category: item.category,
      displayAmount: item.displayAmount,
      checked: false,
    })));
    setItems(localItems);
    if (!user) return;
    try { setItems(await saveShoppingList(user.id, menu.map((dish) => dish.id), groups)); }
    catch (error) { console.error("[useShoppingList] Failed to save shopping list", error); }
  };
  const toggle = async (id: string) => {
    const current = items.find((item) => item.id === id);
    if (!current) return;
    setItems((all) => all.map((item) => item.id === id ? { ...item, checked: !item.checked } : item));
    if (!user) return;
    try { await updateShoppingChecked(user.id, id, !current.checked); }
    catch (error) {
      console.error("[useShoppingList] Failed to update shopping item", error);
      setItems((all) => all.map((item) => item.id === id ? current : item));
    }
  };
  return { groups, items, persist, toggle, hasSavedList: items.length > 0 };
}
