import { NextResponse } from "next/server";
import { getDishes } from "@/services/dishService";
import { makeFallbackResponse } from "@/lib/ai/fallback";
import { getAiDiagnosticCode, requestDeepSeekRecommendation } from "@/lib/ai/provider";
import { validateModelResponse } from "@/lib/ai/validation";
import type { AiMenuRequest, MaxMinutes, MealType, MenuComposition } from "@/types/ai";

const meals: MealType[] = ["早餐", "午餐", "晚餐"];
const times: MaxMinutes[] = [15, 30, 45, 60];
const compositions: MenuComposition[] = ["2菜", "2菜1汤", "3菜1汤"];

const cleanList = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 12)
    : [];

function parseRequest(value: unknown): AiMenuRequest | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (
    typeof data.servings !== "number" || data.servings < 1 || data.servings > 8 ||
    !meals.includes(data.mealType as MealType) ||
    !times.includes(data.maxMinutes as MaxMinutes) ||
    !compositions.includes(data.composition as MenuComposition)
  ) return null;
  return {
    servings: Math.round(data.servings),
    mealType: data.mealType as MealType,
    maxMinutes: data.maxMinutes as MaxMinutes,
    composition: data.composition as MenuComposition,
    preferences: cleanList(data.preferences),
    excludedIngredients: cleanList(data.excludedIngredients),
    availableIngredients: cleanList(data.availableIngredients),
    notes: typeof data.notes === "string" ? data.notes.trim().slice(0, 500) : "",
  };
}

export async function POST(request: Request) {
  let input: AiMenuRequest | null = null;
  try {
    input = parseRequest(await request.json());
  } catch {
    return NextResponse.json({ error: "请求内容不是有效 JSON。" }, { status: 400 });
  }
  if (!input) return NextResponse.json({ error: "请检查人数、时间和菜单组合。" }, { status: 400 });

  const { dishes } = await getDishes();
  try {
    const modelResponse = await requestDeepSeekRecommendation(input, dishes);
    return NextResponse.json(validateModelResponse(modelResponse, input, dishes));
  } catch (error) {
    const diagnosticCode = getAiDiagnosticCode(error);
    console.error("[AI recommendation]", diagnosticCode);
    return NextResponse.json(makeFallbackResponse(input, dishes, [], diagnosticCode));
  }
}
