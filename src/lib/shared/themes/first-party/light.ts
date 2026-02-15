import type { ThemeV3 } from "../schema";

export const lightTheme = {
  id: "default-light",
  name: "Default Light Theme",
  author: "SkyCrypt Team",
  schema: 3,
  light: true,
  colors: {
    icon: "oklch(67.18% 0.2125 144.8)",
    link: "oklch(75.19% 0.2293 145.93)",
    hover: "oklch(81.61% 0.2465 146.18)",
    maxed: "oklch(72.95% 0.1509 75.84)",
    gold: "oklch(65.57% 0.1406 71.71)",
    logo: "oklch(62.96% 0.1848 147.07)",
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
      type: "color",
      color: "oklch(76.9% 0.2065 142.21)"
    },
    maxedbar: {
      type: "color",
      color: "oklch(83.26% 0.1543 79.33)"
    },
    page: {
      url: "https://sky.shiiyu.moe/img/themes/light/bg.avif"
    }
  },
  minecraft: {
    palette: "nice-light",
    overrides: undefined
  },
  meta: {
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1
  }
} satisfies ThemeV3;
