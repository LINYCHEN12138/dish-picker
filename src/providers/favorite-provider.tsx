"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSession } from "./session-provider";
import { addFavorite, listFavoriteIds, removeFavorite } from "@/services/favoriteService";

const LOCAL_KEY = "meal-planner-favorites-v3";
type FavoriteContextValue = { favoriteIds: string[]; toggleFavorite: (dishId: string) => Promise<void>; isFavorite: (dishId: string) => boolean };
const FavoriteContext = createContext<FavoriteContextValue | null>(null);

export function FavoriteProvider({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try { setFavoriteIds(JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]")); } catch { setFavoriteIds([]); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (user) listFavoriteIds(user.id).then((ids) => { setFavoriteIds(ids); localStorage.setItem(LOCAL_KEY, JSON.stringify(ids)); }).catch((error) => console.error("[FavoriteProvider] Failed to load favorites", error));
  }, [user]);
  const value = useMemo<FavoriteContextValue>(() => ({
    favoriteIds,
    isFavorite: (dishId) => favoriteIds.includes(dishId),
    toggleFavorite: async (dishId) => {
      const previous = favoriteIds;
      const next = previous.includes(dishId) ? previous.filter((id) => id !== dishId) : [...previous, dishId];
      setFavoriteIds(next);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
      if (!user) return;
      try {
        if (previous.includes(dishId)) await removeFavorite(user.id, dishId);
        else await addFavorite(user.id, dishId);
      } catch (error) {
        console.error("[FavoriteProvider] Failed to update favorite", error);
        setFavoriteIds(previous);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(previous));
      }
    },
  }), [favoriteIds, user]);
  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (!context) throw new Error("useFavorites must be used inside FavoriteProvider");
  return context;
}
