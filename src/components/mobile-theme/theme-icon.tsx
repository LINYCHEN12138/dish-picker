import type { CSSProperties } from "react";

export type ThemeIconName =
  | "home" | "search" | "random" | "heart" | "history"
  | "send" | "chat" | "together" | "star" | "basket"
  | "chef" | "play" | "sparkle" | "clock" | "difficulty"
  | "people" | "plus" | "check";

const paths: Record<ThemeIconName, React.ReactNode> = {
  home: <><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V21h13V10.5"/><path d="M9.5 21v-6h5v6"/></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></>,
  random: <><path d="M4 7h3.5c4.5 0 4.5 10 9 10H20"/><path d="m17 14 3 3-3 3"/><path d="M4 17h3.5c1.7 0 2.8-1.4 3.8-3"/><path d="M13 8c1-1 2-1 3.5-1H20"/><path d="m17 4 3 3-3 3"/></>,
  heart: <path d="M20.8 5.8a5 5 0 0 0-7.1 0L12 7.5l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.1a5 5 0 0 0 0-7.1Z"/>,
  history: <><path d="M4 6v5h5"/><path d="M5.5 17a8 8 0 1 0-1.2-8"/><path d="M12 7v5l3 2"/></>,
  send: <><path d="m3 11 18-8-7 18-3-7-8-3Z"/><path d="m11 14 4-4"/></>,
  chat: <><path d="M20 15a4 4 0 0 1-4 4H8l-5 3v-7a7 7 0 0 1-1-3.5C2 7.4 6 4 11 4s9 3.4 9 7.5V15Z"/><path d="M7 11h.01M11 11h.01M15 11h.01"/></>,
  together: <><circle cx="8" cy="8" r="3"/><circle cx="17" cy="8" r="3"/><path d="M2.5 20c.4-4 2.2-6 5.5-6s5.1 2 5.5 6"/><path d="M12.5 17c.8-2 2.2-3 4.5-3 3.3 0 4.8 2 5 6"/></>,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>,
  basket: <><path d="m5 10 3-6M19 10l-3-6"/><path d="M3 10h18l-2 10H5L3 10Z"/><path d="M8 13v4M12 13v4M16 13v4"/></>,
  chef: <><path d="M7 10a4 4 0 0 1 1-7 4.5 4.5 0 0 1 8 0 4 4 0 0 1 1 7v3H7v-3Z"/><path d="M7 13h10v7H7z"/><path d="M10 16h4"/></>,
  play: <path d="m8 5 11 7-11 7V5Z"/>,
  sparkle: <><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  difficulty: <><path d="M5 19V9M12 19V5M19 19v-7"/><path d="M3 19h18"/></>,
  people: <><circle cx="9" cy="8" r="3"/><path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6"/><path d="M16 5a3 3 0 0 1 0 6M17 14c2.5.5 3.8 2.5 4 6"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  check: <path d="m5 12 4 4L19 6"/>,
};

export function ThemeIcon({ name, size = 20, className }: { name: ThemeIconName; size?: number; className?: string }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function ThemeAvatar({ image, label, className = "" }: { image: string; label: string; className?: string }) {
  const style = { "--theme-avatar-image": `url("${image}")` } as CSSProperties;
  return <span className={`mobile-v2-theme-avatar ${className}`} style={style} role="img" aria-label={label} />;
}
