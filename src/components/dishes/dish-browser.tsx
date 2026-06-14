"use client";

import { useMemo, useState } from "react";
import { dishCategories } from "@/data/dishes";
import { DishCard } from "./dish-card";
import { ThemeIcon } from "@/components/mobile-theme/theme-icon";
import { useDishes } from "@/providers/dish-provider";

export function DishBrowser() {
  const { dishes, source, notice } = useDishes();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof dishCategories)[number]>("全部");
  const filtered = useMemo(() => dishes.filter((dish) => {
    const matchesCategory = category === "全部" || dish.category === category;
    const matchesQuery = !query || `${dish.name}${dish.tags.join("")}${dish.ingredients.map((i) => i.name).join("")}`.includes(query);
    return matchesCategory && matchesQuery;
  }), [query, category, dishes]);

  return (
    <div className="mobile-v2-core-page">
      <div className="search-box"><span><ThemeIcon name="search" /></span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜菜名或食材，比如“番茄”" /></div>
      {source === "fallback" && <div className="data-source-notice">{notice}</div>}
      <div className="filter-scroll">{dishCategories.map((item) => <button className={item === category ? "filter active" : "filter"} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <div className="result-line"><span>{filtered.length} 道合心意的菜</span><span>今晚慢慢挑</span></div>
      <div className="dish-grid">{filtered.map((dish) => <DishCard dish={dish} key={dish.id} />)}</div>
      {filtered.length === 0 && <div className="empty-card"><span><ThemeIcon name="search" size={34} /></span><h3>还没有找到这道菜</h3><p>换一个食材或分类再看看。</p></div>}
    </div>
  );
}
