import type { ThemeV3 } from "../schema";

export const candycaneTheme = {
  schema: 3,
  light: true,
  colors: {
    icon: "oklch(52.68% 0.2161 29.23)",
    link: "oklch(53.47% 0.2194 29.23)",
    hover: "oklch(59.05% 0.2423 29.23)",
    maxed: "oklch(72.98% 0.1509 75.83)",
    gold: "oklch(65.54% 0.1405 71.76)",
    logo: "oklch(53.08% 0.2177 29.23)",
    text: "oklch(0 0 0)",
    background: "oklch(0.9 0 0)",
    header: "oklch(0.95 0 0)",
    greyBackground: "oklch(0.85 0 0)",
    loreBackground: "oklch(0.88 0 0 / 0.9)",
    bg: "oklch(0.9 0 0)",
    mctooltipBg: "oklch(0.85 0.02 264.05 / 0.93)"
  },
  backgrounds: {
    skillbar: {
      type: "stripes",
      angle: "45deg",
      colors: ["oklch(68.22% 0.2063 24.43)", "oklch(100% 0 0)"],
      width: 10
    },
    maxedbar: {
      type: "stripes",
      angle: "45deg",
      colors: ["oklch(67.03% 0.2188 33.21)", "oklch(83.26% 0.1543 79.33)"],
      width: 10
    },
    page: {
      url: "https://sky.shiiyu.moe/img/themes/candycane/bg.avif"
    }
  },
  minecraft: {
    palette: "nice-light",
    overrides: undefined
  },
  metadata: {
    id: "candycane",
    name: "Candy Cane Theme",
    author: "Cookie_Wookie_7",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1
  }
} satisfies ThemeV3;
