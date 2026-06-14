import type { AiMenuRequest, AiModelResponse } from "@/types/ai";
import type { Dish } from "@/types/dish";
import { buildAiMessages } from "./prompts";

export async function requestDeepSeekRecommendation(request: AiMenuRequest, dishes: Dish[]): Promise<AiModelResponse> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") throw new Error("AI_NOT_CONFIGURED");
  if ((process.env.AI_PROVIDER || "deepseek") !== "deepseek") throw new Error("AI_PROVIDER_UNSUPPORTED");

  const baseUrl = (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com").replace(/\/$/, "");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
        messages: buildAiMessages(request, dishes),
        response_format: { type: "json_object" },
        temperature: 0.5,
      }),
      signal: controller.signal,
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`AI_REQUEST_FAILED_${response.status}`);
    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;
    if (typeof content !== "string") throw new Error("AI_EMPTY_RESPONSE");
    return JSON.parse(content) as AiModelResponse;
  } finally {
    clearTimeout(timeout);
  }
}
