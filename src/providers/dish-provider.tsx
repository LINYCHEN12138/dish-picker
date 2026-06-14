"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dishes as mockDishes } from "@/data/dishes";
import { getDishes } from "@/services/dishService";
import type { Dish } from "@/types/dish";

type DishContextValue = { dishes: Dish[]; featured: Dish[]; loading: boolean; source: "supabase" | "fallback"; notice: string };
const DishContext = createContext<DishContextValue | null>(null);

export function DishProvider({ children }: { children: React.ReactNode }) {
  const [dishes, setDishes] = useState(mockDishes);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"supabase" | "fallback">("fallback");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    getDishes().then((result) => {
      setDishes(result.dishes);
      setSource(result.source);
      setNotice(result.error ?? "");
    }).finally(() => setLoading(false));
  }, []);
  const value = useMemo(() => ({ dishes, featured: dishes.filter((dish) => dish.featured).slice(0, 5), loading, source, notice }), [dishes, loading, source, notice]);
  return <DishContext.Provider value={value}>{children}</DishContext.Provider>;
}

export function useDishes() {
  const context = useContext(DishContext);
  if (!context) throw new Error("useDishes must be used inside DishProvider");
  return context;
}
