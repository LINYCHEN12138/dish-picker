import { getSupabaseClient } from "@/lib/supabase";

export async function listFavoriteIds(userId: string) {
  const client = getSupabaseClient();
  if (!client) return [];
  const { data, error } = await client.from("favorites").select("dish_id").eq("user_id", userId);
  if (error) throw error;
  return data.map((item) => item.dish_id);
}

export async function addFavorite(userId: string, dishId: string) {
  const client = getSupabaseClient();
  if (!client) return;
  const { error } = await client.from("favorites").upsert({ user_id: userId, dish_id: dishId }, { onConflict: "user_id,dish_id" });
  if (error) throw error;
}

export async function removeFavorite(userId: string, dishId: string) {
  const client = getSupabaseClient();
  if (!client) return;
  const { error } = await client.from("favorites").delete().eq("user_id", userId).eq("dish_id", dishId);
  if (error) throw error;
}
