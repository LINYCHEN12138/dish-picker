import Link from "next/link";
import { ThemeIcon } from "@/components/mobile-theme/theme-icon";
import { useMobileTheme } from "@/providers/theme-provider";

export function AiMenuEntry() {
  const { theme } = useMobileTheme();
  return (
    <Link className="mobile-v2-ai-entry" href="/ai">
      <span className="mobile-v2-ai-entry-icon"><ThemeIcon name="sparkle" size={24} /></span>
      <span>
        <small>AI MENU PLANNER</small>
        <strong>让 AI 帮你安排今晚</strong>
        <em>告诉我时间、口味和现有食材</em>
      </span>
      <i aria-hidden="true">→</i>
      <b>{theme.name}推荐</b>
    </Link>
  );
}
