import type { AiMenuRequest, AiMenuResponse, AiModelResponse } from "@/types/ai";
import type { Dish } from "@/types/dish";
import { expectedDishCount, makeFallbackResponse, selectFallbackDishes } from "./fallback";

const strings = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").slice(0, 8) : [];

const text = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value.trim().slice(0, 500) : fallback;

export function validateModelResponse(model: AiModelResponse, request: AiMenuRequest, dishes: Dish[]): AiMenuResponse {
  const validIds = new Set(dishes.map((dish) => dish.id));
  const preferredIds = [...new Set(strings(model.dishIds).filter((id) => validIds.has(id)))];
  const selected = selectFallbackDishes(request, dishes, preferredIds).slice(0, expectedDishCount(request.composition));
  if (!selected.length) return makeFallbackResponse(request, dishes);

  const fallback = makeFallbackResponse(request, dishes, selected.map((dish) => dish.id));
  const modelReason = text(model.reason, "");
  const selectedNames = new Set(selected.map((dish) => dish.name));
  const mentionsSelected = selected.some((dish) => modelReason.includes(dish.name));
  const mentionsUnselected = dishes.some((dish) => !selectedNames.has(dish.name) && modelReason.includes(dish.name));
  return {
    menuName: text(model.menuName, fallback.menuName),
    dishIds: selected.map((dish) => dish.id),
    reason: mentionsSelected && !mentionsUnselected ? modelReason : fallback.reason,
    estimatedTime: typeof model.estimatedTime === "number" && Number.isFinite(model.estimatedTime)
      ? Math.max(10, Math.min(120, Math.round(model.estimatedTime)))
      : fallback.estimatedTime,
    shoppingTips: strings(model.shoppingTips).length ? strings(model.shoppingTips) : fallback.shoppingTips,
    cookOrder: fallback.cookOrder,
    notes: strings(model.notes).length ? strings(model.notes) : fallback.notes,
    source: "ai",
  };
}
