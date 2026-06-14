import Link from "next/link";
import { useMobileTheme } from "@/providers/theme-provider";
import { ThemeAvatar, ThemeIcon } from "@/components/mobile-theme/theme-icon";

export function MobileSearchBar() {
  const { theme } = useMobileTheme();
  return <div className="mobile-v2-search"><ThemeAvatar image={theme.backgroundImage} label={theme.name} /><Link href="/dishes"><b><ThemeIcon name="search" size={17} /></b><em>搜索菜谱、食材或菜系</em></Link><i><ThemeIcon name="sparkle" size={18} /></i></div>;
}
