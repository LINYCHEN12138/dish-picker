"use client";

import { useState } from "react";
import { AiPreferenceForm } from "./ai-preference-form";
import { AiRecommendationResult } from "./ai-recommendation-result";
import type { AiMenuRequest, AiMenuResponse } from "@/types/ai";

const initial: AiMenuRequest = {
  servings: 2,
  mealType: "晚餐",
  maxMinutes: 30,
  composition: "2菜1汤",
  preferences: ["下饭", "家常"],
  excludedIngredients: [],
  availableIngredients: [],
  notes: "",
};

export function AiMenuPlanner() {
  const [form, setForm] = useState(initial);
  const [result, setResult] = useState<AiMenuResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const recommend = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/ai/recommend-menu", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "暂时没能完成搭配。");
      setResult(data as AiMenuResponse);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "暂时没能完成搭配，请再试一次。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-planner">
      <section className="ai-hero"><div><p className="eyebrow">AI MENU PLANNER</p><h1>把今晚的心情<br />说给我听</h1><p>我会从家里的菜谱中，认真搭配一桌刚刚好的晚餐。</p></div><span>✦</span></section>
      <AiPreferenceForm value={form} loading={loading} onChange={setForm} onSubmit={recommend} />
      {loading && <div className="ai-thinking"><span>✦</span><div><h3>正在想一桌合心意的菜</h3><p>会考虑时间、口味和家里已有的食材。</p></div></div>}
      {error && <div className="ai-error">{error}</div>}
      {result && !loading && <AiRecommendationResult result={result} onRetry={recommend} />}
    </div>
  );
}
