import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { MenuProvider } from "@/providers/menu-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { SessionProvider } from "@/providers/session-provider";
import { DishProvider } from "@/providers/dish-provider";
import { FavoriteProvider } from "@/providers/favorite-provider";

export const metadata: Metadata = {
  title: "今天吃什么",
  description: "认真选好今晚的每一道菜",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body><ThemeProvider><SessionProvider><DishProvider><MenuProvider><FavoriteProvider><AppShell>{children}</AppShell></FavoriteProvider></MenuProvider></DishProvider></SessionProvider></ThemeProvider></body></html>;
}
