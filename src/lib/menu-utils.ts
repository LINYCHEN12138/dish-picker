import type { Dish, Ingredient, IngredientCategory, ShoppingGroup } from "@/types/dish";

export const categoryLabels: Record<IngredientCategory, string> = {
  vegetable: "新鲜蔬菜",
  meat: "肉类与海鲜",
  egg: "蛋类",
  staple: "其他主料",
  seasoning: "需要购买的调料",
  pantry: "家中常备调料",
};

export function buildShoppingList(dishes: Dish[]): ShoppingGroup[] {
  const merged = new Map<string, Ingredient>();
  dishes.flatMap((dish) => [...dish.ingredients, ...dish.seasonings]).forEach((ingredient) => {
    const key = `${ingredient.category}:${ingredient.name}:${ingredient.unit}`;
    const current = merged.get(key);
    if (current && current.amount !== null && ingredient.amount !== null && current.unit === ingredient.unit) {
      const amount = current.amount + ingredient.amount;
      merged.set(key, { ...current, amount, displayAmount: `${amount}${current.unit}` });
    } else if (!current) {
      merged.set(key, { ...ingredient });
    }
  });

  return (Object.keys(categoryLabels) as IngredientCategory[])
    .map((category) => ({
      category,
      label: categoryLabels[category],
      items: [...merged.values()].filter((ingredient) => ingredient.category === category),
    }))
    .filter((group) => group.items.length > 0);
}

export function createRandomMenu(allDishes: Dish[], count = 3): Dish[] {
  const meat = allDishes.filter((dish) => ["荤菜", "海鲜"].includes(dish.category));
  const vegetable = allDishes.filter((dish) => dish.category === "素菜");
  const supporting = allDishes.filter((dish) => ["汤羹", "快手菜"].includes(dish.category));
  const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
  const selected = [pick(meat), pick(vegetable), pick(supporting)].filter(Boolean);
  return Array.from(new Map(selected.map((dish) => [dish.id, dish])).values()).slice(0, count);
}

export function createShareText(menu: Dish[]): string {
  const groups = buildShoppingList(menu);
  const buy = groups.filter((group) => group.category !== "pantry");
  const pantry = groups.find((group) => group.category === "pantry");
  const lines = [
    "今晚吃什么 · 我们的晚餐",
    "",
    `今晚菜单：${menu.map((dish) => dish.name).join("、")}`,
    "",
    "需要购买：",
    ...buy.flatMap((group) => [`【${group.label}】`, group.items.map((item) => `${item.name} ${item.displayAmount}`).join("、")]),
    "",
    `常备调料提醒：${pantry?.items.map((item) => item.name).join("、") || "无"}`,
    "",
    "简要做法：",
    ...menu.map((dish) => `${dish.name}：${dish.steps.map((step) => step.title).join(" → ")}`),
  ];
  return lines.join("\n");
}
