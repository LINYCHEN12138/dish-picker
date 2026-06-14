import type { ShoppingGroup } from "@/types/dish";
import { ThemeIcon } from "@/components/mobile-theme/theme-icon";

export function IngredientChecklist({ groups }: { groups: ShoppingGroup[] }) {
  const items = groups.flatMap((group) => group.items).slice(0, 7);
  return <article className="mobile-v2-info-card"><header><h2><ThemeIcon name="basket" size={18} />食材清单</h2><span>{items.length} 项</span></header><div className="mobile-v2-checklist">{items.map((item) => <label key={`${item.category}-${item.name}`}><input type="checkbox" /><span>{item.name}</span><small>{item.displayAmount}</small></label>)}</div></article>;
}
