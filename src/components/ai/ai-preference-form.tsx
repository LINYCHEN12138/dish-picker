"use client";

import type { AiMenuRequest, MaxMinutes, MealType, MenuComposition } from "@/types/ai";

const times: MaxMinutes[] = [15, 30, 45, 60];
const compositions: MenuComposition[] = ["2菜", "2菜1汤", "3菜1汤"];
const tastes = ["清淡", "下饭", "微辣", "快手", "家常"];
const meals: MealType[] = ["早餐", "午餐", "晚餐"];

export function AiPreferenceForm({
  value,
  loading,
  onChange,
  onSubmit,
}: {
  value: AiMenuRequest;
  loading: boolean;
  onChange: (value: AiMenuRequest) => void;
  onSubmit: () => void;
}) {
  const update = <K extends keyof AiMenuRequest>(key: K, next: AiMenuRequest[K]) => onChange({ ...value, [key]: next });
  const toggleTaste = (taste: string) => update("preferences", value.preferences.includes(taste) ? value.preferences.filter((item) => item !== taste) : [...value.preferences, taste]);
  const parseList = (text: string) => text.split(/[，,、\s]+/).map((item) => item.trim()).filter(Boolean);

  return (
    <section className="ai-form-card">
      <div className="ai-form-intro"><span>✦</span><div><h2>告诉我今晚想怎么吃</h2><p>偏好越具体，搭配越合心意。</p></div></div>
      <div className="ai-field-grid">
        <label className="ai-field"><span>几个人吃</span><div className="stepper"><button onClick={() => update("servings", Math.max(1, value.servings - 1))}>−</button><b>{value.servings} 人</b><button onClick={() => update("servings", Math.min(8, value.servings + 1))}>＋</button></div></label>
        <fieldset className="ai-field"><legend>哪一餐</legend><div className="choice-row">{meals.map((meal) => <button className={value.mealType === meal ? "active" : ""} onClick={() => update("mealType", meal)} key={meal}>{meal}</button>)}</div></fieldset>
        <fieldset className="ai-field"><legend>最多做多久</legend><div className="choice-row">{times.map((time) => <button className={value.maxMinutes === time ? "active" : ""} onClick={() => update("maxMinutes", time)} key={time}>{time} 分钟</button>)}</div></fieldset>
        <fieldset className="ai-field"><legend>想要几道菜</legend><div className="choice-row">{compositions.map((composition) => <button className={value.composition === composition ? "active" : ""} onClick={() => update("composition", composition)} key={composition}>{composition}</button>)}</div></fieldset>
        <fieldset className="ai-field"><legend>偏爱的味道</legend><div className="choice-row wrap">{tastes.map((taste) => <button className={value.preferences.includes(taste) ? "active" : ""} onClick={() => toggleTaste(taste)} key={taste}>{taste}</button>)}</div></fieldset>
        <label className="ai-field"><span>今晚不想吃</span><input value={value.excludedIngredients.join("、")} onChange={(event) => update("excludedIngredients", parseList(event.target.value))} placeholder="例如：鱼、香菜、辣椒" /></label>
        <label className="ai-field"><span>家里已经有</span><input value={value.availableIngredients.join("、")} onChange={(event) => update("availableIngredients", parseList(event.target.value))} placeholder="例如：鸡蛋、土豆" /></label>
        <label className="ai-field"><span>再补充一句</span><textarea value={value.notes} onChange={(event) => update("notes", event.target.value)} maxLength={500} placeholder="例如：今天有点累，想吃暖和又下饭的。" /></label>
      </div>
      <button className="ai-submit" disabled={loading} onClick={onSubmit}>{loading ? "正在翻看今晚的菜谱…" : "✦ 帮我安排今晚"}</button>
    </section>
  );
}
