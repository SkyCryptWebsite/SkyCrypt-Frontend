import type { ThemeV3 } from "../schema";

export const burningCinnabarTheme = {
  id: "burning-cinnabar",
  name: "Burning Cinnabar Theme",
  author: "rainbowcraft2",
  schema: 3,
  light: false,
  colors: {
    icon: "oklch(56.79% 0.1979 28.72)",
    link: "oklch(56.79% 0.1979 28.72)",
    hover: "oklch(61.45% 0.1933 27.92)",
    maxed: "oklch(72.84% 0.1506 75.86)",
    gold: "oklch(82.84% 0.1548 78.27)",
    logo: "oklch(49.37% 0.1887 21.44)",
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
      color: "oklch(61.45% 0.1933 27.92)"
    },
    maxedbar: {
      type: "color",
      color: "oklch(69.69% 0.1423 76.74)"
    },
    page: {
      url: "https://sky.shiiyu.moe/img/themes/burning-cinnabar/bg.avif"
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
