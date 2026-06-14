export type MobileThemeId = "hachiware" | "usagi";

export interface MobileThemeConfig {
  id: MobileThemeId;
  name: "小八" | "乌萨奇";
  mascot: string;
  backgroundImage: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  mutedTextColor: string;
  cardBackground: string;
  cardBorder: string;
  buttonGradient: string;
  shadowColor: string;
  iconStyle: "blue-paw" | "warm-carrot";
  decorationStyle: "cloud" | "flower";
}
