"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMenu } from "@/providers/menu-provider";
import { ThemeIcon, type ThemeIconName } from "@/components/mobile-theme/theme-icon";

const links: { href: string; label: string; icon: ThemeIconName }[] = [
  { href: "/", label: "首页", icon: "home" },
  { href: "/dishes", label: "点菜", icon: "search" },
  { href: "/menu", label: "今晚", icon: "heart" },
  { href: "/history", label: "回味", icon: "history" },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const { menu } = useMenu();
  return (
    <nav className="bottom-nav mobile-v2-bottom-nav" aria-label="主导航">
      {links.slice(0, 2).map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link href={link.href} className={active ? "nav-item active" : "nav-item"} key={link.href}>
            <span className="nav-icon"><ThemeIcon name={link.icon} /></span>
            <span>{link.label}</span>
            {link.href === "/menu" && menu.length > 0 && <b>{menu.length}</b>}
          </Link>
        );
      })}
      <Link href="/ai" className={pathname.startsWith("/ai") ? "mobile-v2-nav-random active" : "mobile-v2-nav-random"}><span><ThemeIcon name="sparkle" size={25} /></span><small>AI点菜</small></Link>
      {links.slice(2).map((link) => {
        const active = pathname.startsWith(link.href);
        return (
          <Link href={link.href} className={active ? "nav-item active" : "nav-item"} key={link.href}>
            <span className="nav-icon"><ThemeIcon name={link.icon} /></span><span>{link.label}</span>
            {link.href === "/menu" && menu.length > 0 && <b>{menu.length}</b>}
          </Link>
        );
      })}
    </nav>
  );
}
