import type { Dish } from "@/types/dish";
import { ThemeIcon } from "@/components/mobile-theme/theme-icon";

export function RecipeStepsCard({ dish }: { dish: Dish }) {
  return <article className="mobile-v2-info-card"><header><h2><ThemeIcon name="chef" size={18} />做法步骤</h2><span>{dish.name}</span></header><ol className="mobile-v2-steps">{dish.steps.map((step, index) => <li key={step.title}><b>{index + 1}</b><span><strong>{step.title}</strong><small>{step.description}</small></span></li>)}</ol><a className="mobile-v2-video" href={dish.videoUrl} target="_blank" rel="noreferrer"><ThemeIcon name="play" size={14} />观看视频教程</a></article>;
}
