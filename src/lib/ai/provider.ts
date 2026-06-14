import type { AiMenuRequest, AiModelResponse } from "@/types/ai";
import type { Dish } from "@/types/dish";
import { buildAiMessages } from "./prompts";

export async function requestDeepSeekRecommendation(request: AiMenuRequest, dishes: Dish[]): Promise<AiModelResponse> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey || apiKey === "your_api_key_here") throw new Error("AI_NOT_CONFIGURED");
  if ((process.env.AI_PROVIDER?.trim().toLowerCase() || "deepseek") !== "deepseek") throw new Error("AI_PROVIDER_UNSUPPORTED");

  const baseUrl = (process.env.DEEPSEEK_BASE_URL?.trim() || "https://api.deepseek.com").replace(/\/+$/, "");
  const model = process.env.DEEPSEEK_MODEL?.trim() || "deepseek-chat";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
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
    try {
      return JSON.parse(content) as AiModelResponse;
    } catch {
      throw new Error("AI_INVALID_JSON");
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw new Error("AI_REQUEST_TIMEOUT");
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function getAiDiagnosticCode(error: unknown) {
  if (!(error instanceof Error)) return "AI_UNKNOWN_ERROR";
  const safeCode = error.message.match(/^AI_[A-Z0-9_]+$/)?.[0];
  return safeCode ?? "AI_UNKNOWN_ERROR";
}
