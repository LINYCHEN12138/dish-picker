"use client";

import { buildShoppingList } from "@/lib/menu-utils";
import { useMenu } from "@/providers/menu-provider";
import { useDishes } from "@/providers/dish-provider";
import { ThemeTabs } from "@/components/mobile-theme/theme-tabs";
import { DishCarousel } from "./dish-carousel";
import { HeroSection } from "./hero-section";
import { IngredientChecklist } from "./ingredient-checklist";
import { MobileSearchBar } from "./mobile-search-bar";
import { RecipeStepsCard } from "./recipe-steps-card";
import { RecommendationCard } from "./recommendation-card";
import { ShareCard } from "./share-card";
import { AiMenuEntry } from "./ai-menu-entry";

export function MobileHome() {
  const { menu } = useMenu();
  const { dishes, featured, loading, source, notice } = useDishes();
  const recommendation = menu[0] ?? featured[1] ?? dishes[0];
  const previewMenu = menu.length ? menu : [recommendation];
  if (!recommendation) return <div className="empty-card large"><h2>暂时没有可用菜谱</h2></div>;
  return <div className="mobile-v2-home"><MobileSearchBar /><HeroSection /><ThemeTabs />{(loading || source === "fallback") && <div className="data-source-notice">{loading ? "正在同步云端菜谱…" : notice}</div>}<AiMenuEntry /><DishCarousel dishes={featured.length ? featured : dishes.slice(0, 5)} /><RecommendationCard dish={recommendation} /><section className="mobile-v2-pair"><IngredientChecklist groups={buildShoppingList(previewMenu)} /><RecipeStepsCard dish={recommendation} /></section><ShareCard fallbackDish={recommendation} /></div>;
}
