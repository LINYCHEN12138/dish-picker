import { RandomDishButton } from "./random-dish-button";
import { useMobileTheme } from "@/providers/theme-provider";

export function HeroSection() {
  const { theme } = useMobileTheme();
  return <section className="mobile-v2-hero"><div><small>GOOD FOOD · GOOD MOOD</small><h1>今天吃什么？</h1><p>和她一起做顿好吃的吧～</p><RandomDishButton /></div><div className="mobile-v2-mascot" style={{ backgroundImage: `url("${theme.backgroundImage}")` }} role="img" aria-label={`${theme.name}正在陪你做饭`}><span>{theme.name}</span></div></section>;
}
