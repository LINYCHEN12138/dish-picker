import type { IngredientCategory } from "./dish";

export type ShoppingListItem = {
  id: string;
  listId: string;
  name: string;
  category: IngredientCategory;
  displayAmount: string;
  checked: boolean;
};
