export type IngredientCategory =
  | "staple"
  | "vegetable"
  | "meat"
  | "egg"
  | "seasoning"
  | "pantry";

export type DishCategory = "快手菜" | "荤菜" | "素菜" | "汤羹" | "海鲜" | "主食";
export type Difficulty = "简单" | "适中" | "进阶";

export interface Ingredient {
  name: string;
  amount: number | null;
  unit: string;
  displayAmount: string;
  category: IngredientCategory;
  optional?: boolean;
}

export interface CookingStep {
  title: string;
  description: string;
}

export interface Dish {
  id: string;
  slug: string;
  name: string;
  category: DishCategory;
  tags: string[];
  difficulty: Difficulty;
  cookMinutes: number;
  servings: number;
  description: string;
  emoji: string;
  tone: string;
  ingredients: Ingredient[];
  seasonings: Ingredient[];
  steps: CookingStep[];
  tips: string[];
  videoUrl: string;
  featured?: boolean;
}

export interface ShoppingGroup {
  category: IngredientCategory;
  label: string;
  items: Ingredient[];
}

export interface MenuHistory {
  id: string;
  createdAt: string;
  dishIds: string[];
  dishSnapshots: Dish[];
}
