export type MealType = "早餐" | "午餐" | "晚餐";
export type MaxMinutes = 15 | 30 | 45 | 60;
export type MenuComposition = "2菜" | "2菜1汤" | "3菜1汤";

export interface AiMenuRequest {
  servings: number;
  mealType: MealType;
  maxMinutes: MaxMinutes;
  composition: MenuComposition;
  preferences: string[];
  excludedIngredients: string[];
  availableIngredients: string[];
  notes: string;
}

export interface AiModelResponse {
  menuName?: unknown;
  dishIds?: unknown;
  reason?: unknown;
  estimatedTime?: unknown;
  shoppingTips?: unknown;
  cookOrder?: unknown;
  notes?: unknown;
}

export interface AiMenuResponse {
  menuName: string;
  dishIds: string[];
  reason: string;
  estimatedTime: number;
  shoppingTips: string[];
  cookOrder: string[];
  notes: string[];
  source: "ai" | "fallback";
  notice?: string;
}
