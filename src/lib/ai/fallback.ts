import type { AiMenuRequest, AiMenuResponse, MenuComposition } from "@/types/ai";
import type { Dish } from "@/types/dish";

const compositionCount: Record<MenuComposition, number> = {
  "2菜": 2,
  "2菜1汤": 3,
  "3菜1汤": 4,
};

const textOfDish = (dish: Dish) =>
  [dish.name, dish.category, ...dish.tags, ...dish.ingredients.map((item) => item.name)].join(" ");

export function isDishExcluded(dish: Dish, excluded: string[]) {
  const text = textOfDish(dish);
  return excluded.some((term) => term && text.includes(term));
}

function scoreDish(dish: Dish, request: AiMenuRequest) {
  let score = 0;
  const text = textOfDish(dish);
  if (dish.cookMinutes <= request.maxMinutes) score += 5;
  else score -= Math.ceil((dish.cookMinutes - request.maxMinutes) / 10) * 2;
  score += request.preferences.filter((preference) => text.includes(preference)).length * 4;
  score += request.availableIngredients.filter((ingredient) => text.includes(ingredient)).length * 5;
  if (dish.category === "快手菜" && request.maxMinutes <= 30) score += 3;
  if (dish.servings === request.servings) score += 1;
  return score;
}

export function selectFallbackDishes(request: AiMenuRequest, dishes: Dish[], preferredIds: string[] = []) {
  const valid = dishes.filter((dish) => !isDishExcluded(dish, request.excludedIngredients));
  const ranked = [...valid].sort((a, b) => scoreDish(b, request) - scoreDish(a, request) || a.cookMinutes - b.cookMinutes);
  const count = compositionCount[request.composition];
  const needsSoup = request.composition.includes("汤");
  const selected: Dish[] = [];

  const add = (dish?: Dish) => {
    if (dish && !selected.some((item) => item.id === dish.id) && selected.length < count) selected.push(dish);
  };

  preferredIds.forEach((id) => add(ranked.find((dish) => dish.id === id)));
  if (needsSoup && !selected.some((dish) => dish.category === "汤羹")) add(ranked.find((dish) => dish.category === "汤羹"));
  if (!selected.some((dish) => ["荤菜", "海鲜"].includes(dish.category))) add(ranked.find((dish) => ["荤菜", "海鲜"].includes(dish.category)));
  if (!selected.some((dish) => dish.category === "素菜")) add(ranked.find((dish) => dish.category === "素菜"));
  ranked.forEach(add);
  return selected;
}

export function makeFallbackResponse(request: AiMenuRequest, dishes: Dish[], preferredIds: string[] = []): AiMenuResponse {
  const selected = selectFallbackDishes(request, dishes, preferredIds);
  const availableText = request.availableIngredients.length
    ? `优先用上家里的${request.availableIngredients.join("、")}。`
    : "兼顾荤素与做菜节奏。";
  return {
    menuName: `${request.servings}人${request.maxMinutes}分钟${request.composition}`,
    dishIds: selected.map((dish) => dish.id),
    reason: `根据你的时间和口味，从现有家常菜中搭配了这一桌。${availableText}`,
    estimatedTime: Math.min(90, Math.max(...selected.map((dish) => dish.cookMinutes), 0) + (selected.length > 2 ? 8 : 5)),
    shoppingTips: request.availableIngredients.length
      ? [`家里已有：${request.availableIngredients.join("、")}，买菜时可以跳过。`, "常备调料先检查余量，避免重复购买。"]
      : ["出发前先检查家中常备调料。", "肉类和蔬菜分袋购买，回家处理更方便。"],
    cookOrder: selected
      .sort((a, b) => b.cookMinutes - a.cookMinutes)
      .map((dish, index) => `${index + 1}. ${dish.name}：${index === 0 ? "先备料并开始制作" : "按上桌时间衔接制作"}`),
    notes: request.notes ? [`已考虑补充说明：${request.notes}`] : ["推荐结果来自本地菜品库，可点进菜品查看完整教程。"],
    source: "fallback",
    notice: "AI 服务暂时不可用，已根据你的偏好完成本地智能搭配。",
  };
}

export function expectedDishCount(composition: MenuComposition) {
  return compositionCount[composition];
}
