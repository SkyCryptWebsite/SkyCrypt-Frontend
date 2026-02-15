import type { ThemeV3 } from "../schema";

export const warpwingTheme = {
  id: "warpwing",
  name: "Forest Walk",
  author: "WarpWing",
  schema: 3,
  light: false,
  colors: {
    icon: "oklch(67.48% 0.1158 207.35)",
    link: "oklch(67.48% 0.1158 207.35)",
    hover: "oklch(67.48% 0.1158 207.35)",
    maxed: "oklch(72.84% 0.1506 75.86)",
    gold: "oklch(82.84% 0.1548 78.27)",
    logo: "oklch(53.96% 0.0886 205.04)",
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
      color: "oklch(67.48% 0.1158 207.35)"
    },
    maxedbar: {
      type: "color",
      color: "oklch(69.69% 0.1423 76.74)"
    },
    page: {
      url: "https://blog.warpwing.cloud/_astro/demo-banner.BbPub-ks_1KHh80.webp"
    }
  },
  minecraft: {
    palette: "nice-dark",
    overrides: undefined
  },
  meta: {
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1
  }
} satisfies ThemeV3;
