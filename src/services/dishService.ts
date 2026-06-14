import { dishes as mockDishes } from "@/data/dishes";
import { getSupabaseClient } from "@/lib/supabase";
import { mapDishRow, type DishQueryRow } from "@/lib/mappers/dish-mapper";
import type { Dish } from "@/types/dish";

const select = "*,dish_ingredients(*,ingredients(*)),recipe_steps(*)";

type LegacyDishRow = {
  id: string;
  name: string;
  category: string;
  taste: string | null;
  difficulty: string;
  cook_time_minutes: number;
  servings: number;
  description: string | null;
  reason: string | null;
  tags: string[] | null;
  theme: string | null;
  is_featured: boolean;
};

export type DishCatalogResult = {
  dishes: Dish[];
  source: "supabase" | "fallback";
  error?: string;
};

function mapLegacyDishRow(row: LegacyDishRow): Dish {
  const local = mockDishes.find((dish) => dish.name === row.name);
  return {
    id: row.id,
    slug: local?.slug ?? row.id,
    name: row.name,
    category: (local?.category ?? row.category) as Dish["category"],
    tags: row.tags ?? local?.tags ?? [],
    difficulty: (row.difficulty || local?.difficulty || "简单") as Dish["difficulty"],
    cookMinutes: row.cook_time_minutes || local?.cookMinutes || 30,
    servings: row.servings || local?.servings || 2,
    description: row.description || local?.description || row.reason || "",
    emoji: local?.emoji ?? "🍽️",
    tone: local?.tone ?? (row.theme === "usagi" ? "gold" : "blue"),
    ingredients: local?.ingredients ?? [],
    seasonings: local?.seasonings ?? [],
    steps: local?.steps ?? [],
    tips: local?.tips ?? (row.reason ? [row.reason] : []),
    videoUrl: local?.videoUrl ?? "",
    featured: row.is_featured,
  };
}

function mergeLegacyDishes(rows: LegacyDishRow[]) {
  const cloudDishes = rows.map(mapLegacyDishRow);
  const cloudNames = new Set(cloudDishes.map((dish) => dish.name));
  return [...cloudDishes, ...mockDishes.filter((dish) => !cloudNames.has(dish.name))];
}

export async function getDishes(): Promise<DishCatalogResult> {
  const client = getSupabaseClient();
  if (!client) return { dishes: mockDishes, source: "fallback", error: "Supabase 尚未配置，当前使用本地菜谱。" };
  const { data, error } = await client.from("dishes").select(select).eq("active", true).order("id");
  if (!error && data?.length) return { dishes: (data as unknown as DishQueryRow[]).map(mapDishRow), source: "supabase" };

  const legacy = await client.from("dishes").select("*").eq("is_active" as "active", true).order("id");
  if (!legacy.error && legacy.data?.length) {
    return { dishes: mergeLegacyDishes(legacy.data as unknown as LegacyDishRow[]), source: "supabase" };
  }

  console.warn("[dishService] Supabase dishes query failed; using local fallback", error ?? legacy.error);
  return { dishes: mockDishes, source: "fallback", error: "云端菜谱暂时不可用，已切换到本地菜谱。" };
}

export async function getDishBySlug(slug: string): Promise<{ dish: Dish | null; source: "supabase" | "fallback" }> {
  const client = getSupabaseClient();
  if (client) {
    const { data, error } = await client.from("dishes").select(select).eq("slug", slug).eq("active", true).maybeSingle();
    if (!error && data) return { dish: mapDishRow(data as unknown as DishQueryRow), source: "supabase" };

    const local = mockDishes.find((dish) => dish.slug === slug);
    if (local) return { dish: local, source: "supabase" };

    const legacy = await client.from("dishes").select("*").eq("id", slug).eq("is_active" as "active", true).maybeSingle();
    if (!legacy.error && legacy.data) return { dish: mapLegacyDishRow(legacy.data as unknown as LegacyDishRow), source: "supabase" };
    if (error || legacy.error) console.warn("[dishService] Supabase dish query failed; using local fallback", error ?? legacy.error);
  }
  return { dish: mockDishes.find((dish) => dish.slug === slug) ?? null, source: "fallback" };
}
