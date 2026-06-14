import type { Dish, DishCategory, Difficulty, Ingredient, IngredientCategory } from "@/types/dish";
import type { DishIngredientRow, DishRow, IngredientRow, RecipeStepRow } from "@/types/database";

export type DishQueryRow = DishRow & {
  dish_ingredients?: Array<DishIngredientRow & { ingredients?: IngredientRow | null }>;
  recipe_steps?: RecipeStepRow[];
};

const ingredient = (row: DishIngredientRow & { ingredients?: IngredientRow | null }): Ingredient => ({
  name: row.ingredients?.name ?? "未知食材",
  amount: row.amount,
  unit: row.unit,
  displayAmount: row.display_amount,
  category: (row.ingredients?.category ?? "staple") as IngredientCategory,
  optional: row.optional,
});

export function mapDishRow(row: DishQueryRow): Dish {
  const relations = [...(row.dish_ingredients ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as DishCategory,
    tags: row.tags ?? [],
    difficulty: row.difficulty as Difficulty,
    cookMinutes: row.cook_minutes,
    servings: row.servings,
    description: row.description,
    emoji: row.emoji,
    tone: row.tone,
    ingredients: relations.filter((item) => item.kind === "ingredient").map(ingredient),
    seasonings: relations.filter((item) => item.kind === "seasoning").map(ingredient),
    steps: [...(row.recipe_steps ?? [])].sort((a, b) => a.step_number - b.step_number).map((step) => ({ title: step.title, description: step.description })),
    tips: row.tips ?? [],
    videoUrl: row.video_url,
    featured: row.featured,
  };
}
