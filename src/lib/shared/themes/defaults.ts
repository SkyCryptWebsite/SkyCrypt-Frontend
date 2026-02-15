import type { ThemeV3 } from "./schema";

export const DEFAULT_THEME: ThemeV3 = {
  id: "default",
  name: "Default Theme",
  author: "SkyCrypt Team",
  schema: 3,
  light: false,
  colors: {
    icon: "oklch(73.62% 0.2129 147.69)",
    link: "oklch(81.56% 0.2459 146.24)",
    hover: "oklch(83.81% 0.2303 149.89)",
    maxed: "oklch(72.84% 0.1506 75.86)",
    gold: "oklch(82.84% 0.1548 78.27)",
    logo: "oklch(68.48% 0.2338 351.45)",
    text: "oklch(1 0 0)",
    background: "oklch(0 0 0)",
    header: "oklch(0.28 0 0)",
    greyBackground: "oklch(0.24 0 0)",
    loreBackground: "oklch(0.17 0 0 / 0.9)",
    bg: "oklch(0.18 0 0)",
    mctooltipBg: "oklch(12.142% 0.05582 328.352 / 0.93)"
  },
  backgrounds: {
    skillbar: {
      type: "color",
      color: "oklch(63.98% 0.1731 150.18)"
    },
    maxedbar: {
      type: "color",
      color: "oklch(69.69% 0.1423 76.74)"
    },
    page: {
      url: "https://sky.shiiyu.moe/img/bg.avif"
    }
  },
  minecraft: {
    palette: "nice-dark"
  },
  meta: {
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1
  }
};
