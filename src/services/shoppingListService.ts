import { getSupabaseClient } from "@/lib/supabase";
import type { ShoppingGroup } from "@/types/dish";
import type { ShoppingListItem } from "@/types/shopping";

export async function saveShoppingList(userId: string, dishIds: string[], groups: ShoppingGroup[]) {
  const client = getSupabaseClient();
  if (!client) return [];
  const listId = crypto.randomUUID();
  const rows = groups.flatMap((group) => group.items.map((item) => ({
    list_id: listId,
    user_id: userId,
    dish_ids: dishIds,
    ingredient_id: null,
    item_name: item.name,
    category: item.category,
    display_amount: item.displayAmount,
    checked: false,
  })));
  const { data, error } = await client.from("shopping_list").insert(rows).select("*");
  if (error) throw error;
  return data.map(mapShoppingItem);
}

export async function listLatestShoppingList(userId: string) {
  const client = getSupabaseClient();
  if (!client) return [];
  const { data: latest } = await client.from("shopping_list").select("list_id").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (!latest) return [];
  const { data, error } = await client.from("shopping_list").select("*").eq("user_id", userId).eq("list_id", latest.list_id).order("created_at");
  if (error) throw error;
  return data.map(mapShoppingItem);
}

export async function updateShoppingChecked(userId: string, id: string, checked: boolean) {
  const client = getSupabaseClient();
  if (!client) return;
  const { error } = await client.from("shopping_list").update({ checked, updated_at: new Date().toISOString() }).eq("user_id", userId).eq("id", id);
  if (error) throw error;
}

const mapShoppingItem = (row: { id: string; list_id: string; item_name: string; category: string; display_amount: string; checked: boolean }): ShoppingListItem => ({
  id: row.id,
  listId: row.list_id,
  name: row.item_name,
  category: row.category as ShoppingListItem["category"],
  displayAmount: row.display_amount,
  checked: row.checked,
});
