import { getSupabaseClient } from "@/lib/supabase";
import type { Dish, MenuHistory } from "@/types/dish";
import type { Json } from "@/types/database";

export async function listHistory(userId: string): Promise<MenuHistory[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  const { data, error } = await client.from("menu_history").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return data.map((entry) => ({ id: entry.id, createdAt: entry.created_at, dishIds: entry.dish_ids, dishSnapshots: entry.dish_snapshots as unknown as Dish[] }));
}

export async function saveHistory(userId: string, menu: Dish[], source: "random" | "manual" | "ai" = "manual") {
  const client = getSupabaseClient();
  if (!client || !menu.length) return null;
  const { data, error } = await client.from("menu_history").insert({
    user_id: userId,
    source,
    dish_ids: menu.map((dish) => dish.id),
    dish_snapshots: menu as unknown as Json,
  }).select("id,created_at").single();
  if (error) throw error;
  return data;
}

export async function deleteHistory(userId: string, id: string) {
  const client = getSupabaseClient();
  if (!client) return;
  const { error } = await client.from("menu_history").delete().eq("user_id", userId).eq("id", id);
  if (error) throw error;
}
