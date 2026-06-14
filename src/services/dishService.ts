import { dishes as mockDishes } from "@/data/dishes";
import { getSupabaseClient } from "@/lib/supabase";
import { mapDishRow, type DishQueryRow } from "@/lib/mappers/dish-mapper";
import type { Dish } from "@/types/dish";

const select = "*,dish_ingredients(*,ingredients(*)),recipe_steps(*)";

export type DishCatalogResult = {
  dishes: Dish[];
  source: "supabase" | "fallback";
  error?: string;
};

export async function getDishes(): Promise<DishCatalogResult> {
  const client = getSupabaseClient();
  if (!client) return { dishes: mockDishes, source: "fallback", error: "Supabase 尚未配置，当前使用本地菜谱。" };
  const { data, error } = await client.from("dishes").select(select).eq("active", true).order("id");
  if (error || !data?.length) {
    console.warn("[dishService] Supabase dishes query failed; using local fallback", error);
    return { dishes: mockDishes, source: "fallback", error: "云端菜谱暂时不可用，已切换到本地菜谱。" };
  }
  return { dishes: (data as unknown as DishQueryRow[]).map(mapDishRow), source: "supabase" };
}

export async function getDishBySlug(slug: string): Promise<{ dish: Dish | null; source: "supabase" | "fallback" }> {
  const client = getSupabaseClient();
  if (client) {
    const { data, error } = await client.from("dishes").select(select).eq("slug", slug).eq("active", true).maybeSingle();
    if (!error && data) return { dish: mapDishRow(data as unknown as DishQueryRow), source: "supabase" };
    if (error) console.warn("[dishService] Supabase dish query failed; using local fallback", error);
  }
  return { dish: mockDishes.find((dish) => dish.slug === slug) ?? null, source: "fallback" };
}
