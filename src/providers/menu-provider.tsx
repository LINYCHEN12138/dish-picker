"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createRandomMenu } from "@/lib/menu-utils";
import type { Dish, MenuHistory } from "@/types/dish";
import { useDishes } from "./dish-provider";
import { useSession } from "./session-provider";
import { deleteHistory as deleteCloudHistory, listHistory, saveHistory as saveCloudHistory } from "@/services/historyService";

type MenuContextValue = {
  menu: Dish[];
  history: MenuHistory[];
  hydrated: boolean;
  addDish: (dish: Dish) => void;
  addDishes: (dishes: Dish[]) => void;
  removeDish: (id: string) => void;
  toggleDish: (dish: Dish) => void;
  randomize: () => void;
  clearMenu: () => void;
  saveHistory: () => void;
  restoreHistory: (entry: MenuHistory) => void;
  deleteHistory: (id: string) => void;
};

const MenuContext = createContext<MenuContextValue | null>(null);
const MENU_KEY = "meal-planner-menu-v1";
const HISTORY_KEY = "meal-planner-history-v1";
const persist = (key: string, value: unknown) => {
  if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(value));
};

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const { dishes } = useDishes();
  const { user } = useSession();
  const [menu, setMenu] = useState<Dish[]>([]);
  const [history, setHistory] = useState<MenuHistory[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      // Restore before the first interaction so an immediate tap cannot be overwritten.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMenu(JSON.parse(localStorage.getItem(MENU_KEY) || "[]"));
      setHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"));
    } catch {
      setMenu([]);
      setHistory([]);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(MENU_KEY, JSON.stringify(menu));
  }, [menu, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history, hydrated]);

  useEffect(() => {
    if (!user) return;
    listHistory(user.id).then((cloudHistory) => {
      if (cloudHistory.length) setHistory(cloudHistory);
    }).catch((error) => console.error("[MenuProvider] Failed to load cloud history", error));
  }, [user]);

  const value = useMemo<MenuContextValue>(() => ({
    menu,
    history,
    hydrated,
    addDish: (dish) => {
      const next = menu.some((item) => item.id === dish.id) ? menu : [...menu, dish];
      persist(MENU_KEY, next);
      setMenu(next);
    },
    addDishes: (newDishes) => {
      const next = Array.from(new Map([...menu, ...newDishes].map((dish) => [dish.id, dish])).values());
      persist(MENU_KEY, next);
      setMenu(next);
    },
    removeDish: (id) => {
      const next = menu.filter((dish) => dish.id !== id);
      persist(MENU_KEY, next);
      setMenu(next);
    },
    toggleDish: (dish) => {
      const next = menu.some((item) => item.id === dish.id) ? menu.filter((item) => item.id !== dish.id) : [...menu, dish];
      persist(MENU_KEY, next);
      setMenu(next);
    },
    randomize: () => {
      let next = createRandomMenu(dishes);
      const currentIds = menu.map((dish) => dish.id).sort().join(",");
      for (let attempt = 0; attempt < 4 && next.map((dish) => dish.id).sort().join(",") === currentIds; attempt += 1) next = createRandomMenu(dishes);
      persist(MENU_KEY, next);
      setMenu(next);
      const nextHistory = [{ id: crypto.randomUUID(), createdAt: new Date().toISOString(), dishIds: next.map((dish) => dish.id), dishSnapshots: next }, ...history];
      persist(HISTORY_KEY, nextHistory);
      setHistory(nextHistory);
      if (user) saveCloudHistory(user.id, next, "random").catch((error) => console.error("[MenuProvider] Failed to save random history", error));
    },
    clearMenu: () => {
      persist(MENU_KEY, []);
      setMenu([]);
    },
    saveHistory: () => {
      if (!menu.length) return;
      const next = [{ id: crypto.randomUUID(), createdAt: new Date().toISOString(), dishIds: menu.map((dish) => dish.id), dishSnapshots: menu }, ...history];
      persist(HISTORY_KEY, next);
      setHistory(next);
      if (user) saveCloudHistory(user.id, menu, "manual").catch((error) => console.error("[MenuProvider] Failed to save cloud history", error));
    },
    restoreHistory: (entry) => {
      persist(MENU_KEY, entry.dishSnapshots);
      setMenu(entry.dishSnapshots);
    },
    deleteHistory: (id) => {
      const next = history.filter((entry) => entry.id !== id);
      persist(HISTORY_KEY, next);
      setHistory(next);
      if (user) deleteCloudHistory(user.id, id).catch((error) => console.error("[MenuProvider] Failed to delete cloud history", error));
    },
  }), [menu, history, hydrated, dishes, user]);

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenu must be used inside MenuProvider");
  return context;
}
